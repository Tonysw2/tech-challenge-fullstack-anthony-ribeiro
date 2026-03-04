import { AppError } from './app-error.js'
import { ErrorCode } from './error-code.js'

export class ResourceNotFound extends AppError {
  public override code = ErrorCode.RESOURCE_NOT_FOUND
  public override statusCode = 404

  constructor() {
    super('Resource not found.')
    this.name = 'ResourceNotFound'
  }
}
