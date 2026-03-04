import type { FastifyReply, FastifyRequest } from 'fastify'
import jwt, { type SignOptions } from 'jsonwebtoken'
import z from 'zod'
import { env } from '@/env.js'
import { InvalidCredentials } from '../use-cases/errors/invalid-credentials.js'
import { makeSignInUseCase } from '../use-cases/factories/make-sign-in-use-case.js'

const signInBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export const signIn = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = signInBodySchema.parse(request.body)

  try {
    const useCase = makeSignInUseCase()

    const { user } = await useCase.execute({ email, password })

    const payload = { sub: user.id }

    const accessToken = await reply.jwtSign(payload, {
      expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    })

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: env.JWT_REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn'],
    })

    return reply.code(200).send({ accessToken, refreshToken })
  } catch (error) {
    if (error instanceof InvalidCredentials) {
      return reply.code(error.statusCode).send({
        code: error.code,
        message: error.message,
      })
    }

    throw error
  }
}
