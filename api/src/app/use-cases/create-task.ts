import type { Task } from '../entities/task.js'
import type { ITasksRepository } from '../repositories/interfaces/tasks-repository-interface.js'

interface CreateTaskUseCaseRequest {
  userId: string
  title: string
  description?: string | null
}

interface CreateTaskUseCaseResponse {
  task: Task
}

export class CreateTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute({
    userId,
    title,
    description,
  }: CreateTaskUseCaseRequest): Promise<CreateTaskUseCaseResponse> {
    const task = await this.tasksRepository.create({
      userId,
      title,
      description,
    })

    return { task }
  }
}
