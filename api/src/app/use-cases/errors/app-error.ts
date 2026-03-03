import type { ErrorCode } from './error-code.js'

export abstract class AppError extends Error {
  public abstract code: ErrorCode
  public statusCode?: number
}
