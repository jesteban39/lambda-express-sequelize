import statusCodes from '@config/statusCodes'

/**
 * Error with status code and message
 */
export class RouteError extends Error {
  status: statusCodes
  constructor(status: statusCodes, message: string) {
    super(message)
    this.status = status
  }
}

/**
 * Error with status code and message
 */
export class PkNotMache extends Error {
  status: statusCodes
  constructor(id: string) {
    super(`No se encontro registro para el id ${id}`)
    this.status = statusCodes.BAD_REQUEST
  }
}
