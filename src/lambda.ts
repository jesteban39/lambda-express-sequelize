import serverless from 'serverless-http'
import type {
  APIGatewayEvent,
  Context,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
import server from './server'
import db from '@db'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  context: Context
) => {
  try {
    await db.open()
    if (!event) throw Error('event no tiene un valor valido')
    return <APIGatewayProxyResult>await serverless(server)(event, context)
  } catch (error) {
    console.error(error)
    return {
      isBase64Encoded: false,
      statusCode: 500,
      body: JSON.stringify({message: error.toString()}),
      headers: {'content-type': 'application/json'}
    }
  } finally {
    await db.close()
  }
}
