import { AppError } from './app-error.js'
import { ErrorCode } from './error-code.js'

export class EmailAlreadyInUse extends AppError {
  public override code = ErrorCode.EMAIL_ALREADY_IN_USE
  public override statusCode = 409

  constructor() {
    super('This email is already in use.')
    this.name = 'EmailAlreadyInUse'
  }
}
