import {LambdaConfog, LambdaResult, Modeln} from './types'
import type {APIGatewayProxyHandler} from 'aws-lambda'
import {addRoute} from './swagger'

let lambda = <APIGatewayProxyHandler | null>null

const spy = async (action: LambdaConfog): Promise<LambdaResult> => {
  let {body, headers, params, cerys, path, method} = action

  if (!lambda) throw Error('No se ha llamado a agent')
  path = Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, value),
    path
  )
  path += Object.entries(cerys).reduce(
    (acc, [key, value]) => `${acc + acc === '' ? '?' : '&'}${key}=${value}`,
    ''
  )
  const res = await lambda(
    {
      body: JSON.stringify(body),
      headers: headers,
      isBase64Encoded: false,
      pathParameters: {default: path},
      queryStringParameters: null,
      requestContext: {
        accountId: 'offlineContext_accountId',
        apiId: 'offlineContext_apiId',
        authorizer: {lambda: {}, jwt: [Object]},
        domainName: 'offlineContext_domainName',
        domainPrefix: 'offlineContext_domainPrefix',
        requestId: 'offlineContext_resourceId',
        routeKey: '$default',
        stage: '$default',
        httpMethod: method,
        protocol: 'http',
        path: path,
        resourcePath: path,
        requestTimeEpoch: 1,
        resourceId: '',
        identity: {
          accessKey: null,
          accountId: null,
          apiKey: null,
          apiKeyId: null,
          caller: null,
          clientCert: null,
          cognitoAuthenticationProvider: null,
          cognitoAuthenticationType: null,
          cognitoIdentityId: null,
          cognitoIdentityPoolId: null,
          principalOrgId: null,
          sourceIp: '',
          user: null,
          userAgent: null,
          userArn: null
        }
      },
      stageVariables: null,
      multiValueHeaders: {},
      httpMethod: method,
      path: path,
      multiValueQueryStringParameters: null,
      resource: ''
    },
    {
      callbackWaitsForEmptyEventLoop: false,
      functionName: '',
      functionVersion: '',
      invokedFunctionArn: '',
      memoryLimitInMB: '',
      awsRequestId: '',
      logGroupName: '',
      logStreamName: '',
      getRemainingTimeInMillis: function (): number {
        throw new Error('Function not implemented. getRemainingTimeInMillis')
      },
      done: function (): void {
        throw new Error('Function not implemented. done')
      },
      fail: function (): void {
        throw new Error('Function not implemented. fail')
      },
      succeed: function (): void {
        throw new Error('Function not implemented. succeed')
      }
    },
    function (): void {
      throw new Error('Function not implemented.')
    }
  )

  if (!res)
    return {
      body: 'Error al ejecutar la lambda',
      headers: undefined,
      statusCode: 500
    }
  //mekeSwagger(method, body, headers, params, cerys, path, res)
  addRoute(action)
  return {statusCode: res.statusCode, body: JSON.parse(res?.body), headers: res.headers}
}

export const agent = (andler: APIGatewayProxyHandler) => {
  if(!lambda) lambda = andler
  return spy
}

const equivalent = (actual: {[x: string]: any}, initial: {[x: string]: any}) => {
  const initialKeys = Object.keys(initial)
  return initialKeys.reduce((ecual: {[x: string]: any}, key: string) => {
    ecual[key] = actual[key]
    return ecual
  }, {})
}

const mekeEvent = (config: LambdaConfog) => {
  return {
    httpMethod: config.method,
    queryStringParameters: config.params,
    headers: config.headers, // ?? {'Content-Type': 'application/json; charset=utf-8'},
    path: config.path,
    body: JSON.stringify(config.body),
    requestContext: {
      resourcePath: config.path,
      httpMethod: config.method
    }
  }
}

export default agent
