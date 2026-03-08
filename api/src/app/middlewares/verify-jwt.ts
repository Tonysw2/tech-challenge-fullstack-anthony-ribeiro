import type { FastifyReply, FastifyRequest } from 'fastify'

export const verifyJwt = async (
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> => {
  await request.jwtVerify()
}
