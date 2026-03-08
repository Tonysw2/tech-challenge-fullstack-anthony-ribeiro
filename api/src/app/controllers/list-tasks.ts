import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeListTasksUseCase } from '../use-cases/factories/make-list-tasks-use-case.js'

const listTasksQuerySchema = z.object({
  cursor: z.uuid().optional(),
  limit: z.coerce.number().int().min(1).default(20),
})

export const listTasks = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { cursor, limit } = listTasksQuerySchema.parse(request.query)
  const userId = request.user.sub

  const useCase = makeListTasksUseCase()
  const { tasks, meta } = await useCase.execute({ userId, cursor, limit })

  return reply.code(200).send({ tasks, meta })
}
