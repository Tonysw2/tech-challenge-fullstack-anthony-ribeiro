import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ResourceNotFound } from '../use-cases/errors/resource-not-found.js'
import { makeDeleteTaskUseCase } from '../use-cases/factories/make-delete-task-use-case.js'

const deleteTaskParamsSchema = z.object({
  id: z.string().uuid(),
})

export const deleteTask = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id } = deleteTaskParamsSchema.parse(request.params)
  const userId = request.user.sub

  try {
    const useCase = makeDeleteTaskUseCase()
    await useCase.execute({ id, userId })

    return reply.code(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFound) {
      return reply.code(error.statusCode).send({
        code: error.code,
        message: error.message,
      })
    }

    throw error
  }
}
