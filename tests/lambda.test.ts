import fs from 'fs'
import {handler} from '@src/lambda'
import agent from './agent'
import {addModel, saveSwagger} from './swagger'
import db from '@db'

const lambda = agent(handler)
let examples: any = {}
const directorio = './src/database/models'
const folders = fs.readdirSync(directorio)

const testModel = (modelName: string) => {
  describe(`Routes for model ${modelName}`, () => {
    beforeAll(async () => {
      await db.open()
      const Model = db.getModels()[modelName]
      await Model.sync({force: true})
      examples = addModel(Model)
      await Model.bulkCreate(examples[modelName].list)
      await db.close()
    })

    test(`GET: '/api/${modelName}'`, async () => {
      const config = {
        method: 'GET',
        path: `/api/${modelName}`,
        modelName,
        params: {},
        querys: {},
        headers: {},
        body: null
      }
      const {statusCode, headers, data} = await lambda(config)
      expect(statusCode).toBe(200)
      expect(headers?.['content-type']).toMatch(/application\/json/)
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBe(examples[modelName].list.length)
    })

    test(`POST: '/api/${modelName}'`, async () => {
      const newElement = examples[modelName].new
      const config = {
        method: 'POST',
        path: `/api/${modelName}`,
        modelName,
        params: {},
        querys: {},
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        body: newElement
      }
      const {statusCode, headers, data} = await lambda(config)
      expect(statusCode).toBe(200)
      expect(headers?.['content-type']).toMatch(/application\/json/)
      expect(data).toEqual(newElement)
    })

    test(`PUT: '/api/${modelName}'`, async () => {
      const editElement = examples[modelName].edit
      const config = {
        method: 'PUT',
        path: `/api/${modelName}/:uuid`,
        modelName,
        params: {uuid: editElement.uuid},
        querys: {},
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        body: editElement
      }
      const {statusCode, headers, data} = await lambda(config)
      expect(statusCode).toBe(200)
      expect(headers?.['content-type']).toMatch(/application\/json/)
      expect(data).toEqual(editElement)
    })

    test(`GET: '/api/${modelName}/filter'`, async () => {
      const newElement = examples[modelName].list[1]
      const config = {
        method: 'GET',
        path: `/api/${modelName}/filter`,
        modelName,
        params: {},
        querys: {nombre: newElement.nombre},
        headers: {},
        body: null
      }
      const {statusCode, headers, data} = await lambda(config)
      expect(statusCode).toBe(200)
      expect(headers?.['content-type']).toMatch(/application\/json/)
      expect(Array.isArray(data)).toBe(true)
      expect(data[0].nombre).toEqual(newElement.nombre)
    })
  })
}

describe('Tests for CRUD', () => {
  beforeAll(async () => {
    const seq = await db.open()
    await seq.sync({force: true})
    await db.close()
  })

  afterAll(saveSwagger)

  folders.forEach((file) => {
    const path = directorio + '/' + file
    const stats = fs.statSync(path)
    if (stats.isFile()) {
      const modelName = file.charAt(0).toUpperCase() + file.slice(1).replace('.ts', '')
      testModel(modelName)
    }
  })
})
