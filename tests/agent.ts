import {addRoute} from './swagger'
import type {LambdaConfog, LambdaResult} from './types'
import type {APIGatewayProxyHandler} from 'aws-lambda'

let lambda = <APIGatewayProxyHandler | null>null

const spy = async (action: LambdaConfog): Promise<LambdaResult> => {
  const {body, headers, params, querys, path, method} = action
  if (!lambda) throw Error('No se ha llamado a agent')
  const url = Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, value),
    path
  )

  const queryString = Object.entries(querys).reduce(
    (acc, [key, value]) => `${acc}${!acc ? '' : '&'}${key}=${value}`,
    ''
  )

  const res = await lambda(
    {
      body: body ? JSON.stringify(body) : null,
      cookies: [],
      headers: headers,
      isBase64Encoded: false,
      pathParameters: {default: url},
      queryStringParameters: querys,
      rawPath: url,
      rawQueryString: queryString,
      routeKey: '$default',
      stageVariables: null,
      version: '2.0',
      multiValueHeaders: {},
      httpMethod: method,
      path: url,
      multiValueQueryStringParameters: queryString,
      resource: '',
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
        operationName: undefined,
        time: Date.now().toLocaleString(), 
        timeEpoch: Date.now(),
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
        },
        http: {
          method: method,
          path: url,
          protocol: 'HTTP/1.1',
          sourceIp: '::1',
          userAgent: 'PostmanRuntime/7.36.1'
        }
      }
    } as any,
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
