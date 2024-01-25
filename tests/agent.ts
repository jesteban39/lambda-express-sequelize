import {addRoute} from './swagger'
import type {LambdaConfog, LambdaResult} from './types'
import type {APIGatewayProxyHandler} from 'aws-lambda'

let lambda = <APIGatewayProxyHandler | null>null

const spy = async (action: LambdaConfog): Promise<LambdaResult> => {
  const {body, headers, params, cerys, path, method} = action
  if (!lambda) throw Error('No se ha llamado a agent')
  const url = Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, value),
    path
  )

  const res = await lambda(
    {
      body: JSON.stringify(body),
      headers: headers,
      isBase64Encoded: false,
      pathParameters: {default: url},
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
        path: url,
        resourcePath: url,
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
      path: url,
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

  if (!res) {
    return {
      statusCode: 500,
      data: {},
      body: 'Error al ejecutar la lambda',
      headers: {}
    }
  }

  console.log(res?.body)

  const response = {
    statusCode: res.statusCode,
    body: res?.body,
    data: await JSON.parse(res?.body),
    headers: res.headers ?? {}
  }
  addRoute(action, response)
  return response
}

export const agent = (andler: APIGatewayProxyHandler) => {
  if (!lambda) lambda = andler
  return spy
}

const equivalent = (actual: {[x: string]: any}, initial: {[x: string]: any}) => {
  const initialKeys = Object.keys(initial)
  return initialKeys.reduce((ecual: {[x: string]: any}, key: string) => {
    ecual[key] = actual[key]
    return ecual
  }, {})
}

export default agent
