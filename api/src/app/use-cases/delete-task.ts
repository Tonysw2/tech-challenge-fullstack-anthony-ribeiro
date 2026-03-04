import type { ITasksRepository } from '../repositories/interfaces/tasks-repository-interface.js'
import { ResourceNotFound } from './errors/resource-not-found.js'

interface DeleteTaskInput {
  id: string
  userId: string
}

export class DeleteTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute({ id, userId }: DeleteTaskInput): Promise<void> {
    const existing = await this.tasksRepository.findById(id)

    if (!existing || existing.userId !== userId) {
      throw new ResourceNotFound()
    }

    await this.tasksRepository.delete(id)
  }
}
