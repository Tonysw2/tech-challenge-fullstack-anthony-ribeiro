import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ResourceNotFound } from '../use-cases/errors/resource-not-found.js'
import { makeUpdateTaskUseCase } from '../use-cases/factories/make-update-task-use-case.js'

const updateTaskParamsSchema = z.object({
  id: z.uuid(),
})

const updateTaskBodySchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().nullable().optional(),
    status: z.enum(['PENDING', 'COMPLETE']).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided.',
  })

export const updateTask = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id } = updateTaskParamsSchema.parse(request.params)
  const { title, description, status } = updateTaskBodySchema.parse(
    request.body,
  )
  const userId = request.user.sub

  try {
    const useCase = makeUpdateTaskUseCase()
    const { task } = await useCase.execute({
      id,
      userId,
      title,
      description,
      status,
    })

    return reply.code(200).send({ task })
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
