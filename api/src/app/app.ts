import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from '../env.js'
import { appRoutes } from './routes/app-routes.js'
import { ErrorCode } from './use-cases/errors/error-code.js'

export const app = fastify()

app.register(fastifyJwt, { secret: env.JWT_SECRET })

app.register(appRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.code(400).send({
      code: ErrorCode.VALIDATION_ERROR,
      message: 'Validation error.',
      errors: error.issues,
    })
  }

  reply.send(error)
})
