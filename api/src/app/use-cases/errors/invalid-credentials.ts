import { AppError } from './app-error.js'
import { ErrorCode } from './error-code.js'

export class InvalidCredentials extends AppError {
  public override code = ErrorCode.INVALID_CREDENTIALS
  public override statusCode = 401

  constructor() {
    super('Invalid credentials.')
    this.name = 'InvalidCredentials'
  }
}
