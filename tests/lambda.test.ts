import fs from 'fs'
import examples from './examples.json'
import {handler} from '@src/lambda'
import agent from './agent'
import {addModels, saveSwagger} from './swagger'
import db from '@db'

const PATH_MODELS = './src/database/models'
const lambda = agent(handler)
let exp: any = {}
const filesModel = fs.readdirSync(PATH_MODELS)

const testModel = (modelName: string) => {
  describe(`Routes for model ${modelName}`, () => {
    beforeAll(async () => {
      await db.open()
      const Model = db.getModels()[modelName]
      await Model.sync({force: true})
      await Model.bulkCreate(exp[modelName].list)
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
      expect(data.length).toBe(exp[modelName].list.length)
    })

    test(`POST: '/api/${modelName}'`, async () => {
      const newElement = exp[modelName].new
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
      const editElement = exp[modelName].edit
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
      const newElement = exp[modelName].list[1]
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
    exp = addModels(Object.values(seq.models), examples)
    await seq.sync({force: true})
    await db.close()
  })

  filesModel.forEach((file) => {
    const path = PATH_MODELS + '/' + file
    const stats = fs.statSync(path)
    if (stats.isFile()) {
      const modelName = file[0].toUpperCase() + file.slice(1).replace('.ts', '')
      testModel(modelName)
    }
  })

  afterAll(() => {
    saveSwagger()
    fs.writeFileSync('./tests/examples.json', JSON.stringify(exp), 'utf8')
  })
})
