import type { ITasksRepository } from '../repositories/interfaces/tasks-repository-interface.js'
import { ResourceNotFound } from './errors/resource-not-found.js'

interface UpdateTaskInput {
  id: string
  userId: string
  title?: string
  description?: string | null
  status?: 'PENDING' | 'COMPLETE'
}

export class UpdateTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute({ id, userId, title, description, status }: UpdateTaskInput) {
    const existing = await this.tasksRepository.findById(id)

    if (!existing || existing.userId !== userId) {
      throw new ResourceNotFound()
    }

    const task = await this.tasksRepository.update({
      id,
      userId,
      title,
      description,
      status,
    })

    return { task }
  }
}
