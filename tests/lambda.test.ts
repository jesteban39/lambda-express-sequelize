import {handler} from '@src/lambda'
import agent from './agent'
import {addModel, saveSwagger} from './swagger'
import db from '@db'

const modelsNames = ['User', 'Client']
const lambda = agent(handler)

const testModel = (modelName: string) => {
  describe(`Routes for model ${modelName}`, () => {
    beforeAll(async () => {
      await db.open()
      const Model = db.getModels()[modelName]
      addModel(Model)
      await db.close()
    })

    afterAll(async () => {
      saveSwagger()
    })

    test(`GET: '/api/${modelName}'`, async () => {
      const config = {
        method: 'GET',
        path: `/api/${modelName}`,
        modelName,
        params: {},
        cerys: {},
        headers: {},
        body: null
      }
      const {statusCode, headers, body} = await lambda(config)
      expect(statusCode).toBe(200)
      expect(headers?.['content-type']).toMatch(/application\/json/)
      expect(Array.isArray(body)).toBe(true)
    })

    test('POST', async () => {
      const newElement = {
        uuid: '520d1ddd-e0a7-4ddc-8c25-c187d3e4f338',
        nombre: 'Esteban Quintero'
      }
      const config = {
        method: 'POST',
        path: `/api/${modelName}`,
        modelName,
        params: {},
        cerys: {},
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        body: newElement
      }
      const {statusCode, headers, body} = await lambda(config)
      expect(statusCode).toBe(200)
      expect(headers?.['content-type']).toMatch(/application\/json/)
      expect(body).toEqual(newElement)
    })

    xtest('PUT', async () => {
      const newElement = {
        uuid: '520d1ddd-e0a7-4ddc-8c25-c187d3e4f338',
        nombre: 'Emily Quintero'
      }
      const config = {
        method: 'PUT',
        path: `/api/${modelName}/:uuid`,
        modelName,
        params: {uuid: newElement.uuid},
        cerys: {},
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        body: newElement
      }
      const {statusCode, headers, body} = await lambda(config)
      expect(statusCode).toBe(200)
      expect(headers?.['content-type']).toMatch(/application\/json/)
      expect(body).toEqual(newElement)
    })
  })
}

modelsNames.forEach((name) => testModel(name))
