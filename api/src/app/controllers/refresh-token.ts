import type { FastifyReply, FastifyRequest } from 'fastify'
import jwt, { type SignOptions } from 'jsonwebtoken'
import z from 'zod'
import { env } from '@/env.js'
import { InvalidRefreshToken } from '../use-cases/errors/invalid-refresh-token.js'

const refreshTokenBodySchema = z.object({
  refreshToken: z.string(),
})

export const refreshToken = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { refreshToken: token } = refreshTokenBodySchema.parse(request.body)

  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_TOKEN_SECRET) as {
      sub: string
    }

    const newAccessToken = await reply.jwtSign(
      { sub: payload.sub },
      { expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN },
    )

    const newRefreshToken = jwt.sign(
      { sub: payload.sub },
      env.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: env.JWT_REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn'],
      },
    )

    return reply
      .code(200)
      .send({ accessToken: newAccessToken, refreshToken: newRefreshToken })
  } catch {
    const error = new InvalidRefreshToken()
    return reply.code(error.statusCode).send({
      code: error.code,
      message: error.message,
    })
  }
}
