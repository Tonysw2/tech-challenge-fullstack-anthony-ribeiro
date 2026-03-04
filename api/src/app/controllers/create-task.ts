import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeCreateTaskUseCase } from '../use-cases/factories/make-create-task-use-case.js'

const createTaskBodySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
})

export const createTask = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { title, description } = createTaskBodySchema.parse(request.body)
  const userId = request.user.sub

  const useCase = makeCreateTaskUseCase()
  const { task } = await useCase.execute({ userId, title, description })

  return reply.code(201).send({ task })
}
