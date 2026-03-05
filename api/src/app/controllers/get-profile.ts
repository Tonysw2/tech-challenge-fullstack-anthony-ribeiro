import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetProfileUseCase } from '../use-cases/factories/make-get-profile-use-case.js'

export const getProfile = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user.sub
  const useCase = makeGetProfileUseCase()
  const { user } = await useCase.execute({ userId })
  return reply.code(200).send({ user })
}
