import type { FastifyReply, FastifyRequest } from 'fastify'
import jwt, { type SignOptions } from 'jsonwebtoken'
import z from 'zod'
import { env } from '@/env.js'
import { EmailAlreadyInUse } from '../use-cases/errors/email-already-in-use.js'
import { makeSignUpUseCase } from '../use-cases/factories/make-sign-up-use-case.js'

const signUpBodySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
})

export const signUp = async (request: FastifyRequest, reply: FastifyReply) => {
  const { name, email, password } = signUpBodySchema.parse(request.body)

  try {
    const useCase = makeSignUpUseCase()

    const { user } = await useCase.execute({ name, email, password })

    const payload = { sub: user.id }

    const accessToken = await reply.jwtSign(payload, {
      expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    })

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: env.JWT_REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn'],
    })

    return reply.code(201).send({ accessToken, refreshToken })
  } catch (error) {
    if (error instanceof EmailAlreadyInUse) {
      return reply.code(error.statusCode).send({
        code: error.code,
        message: error.message,
      })
    }

    throw error
  }
}
