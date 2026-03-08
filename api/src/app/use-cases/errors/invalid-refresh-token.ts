import { AppError } from './app-error.js'
import { ErrorCode } from './error-code.js'

export class InvalidRefreshToken extends AppError {
  public override code = ErrorCode.INVALID_REFRESH_TOKEN
  public override statusCode = 401

  constructor() {
    super('Invalid or expired refresh token.')
    this.name = 'InvalidRefreshToken'
  }
}
