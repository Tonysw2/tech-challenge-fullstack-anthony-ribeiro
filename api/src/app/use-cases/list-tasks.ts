import type { Task } from '../entities/task.js'
import type { ITasksRepository } from '../repositories/interfaces/tasks-repository-interface.js'

interface ListTasksUseCaseRequest {
  userId: string
  cursor?: string
  limit: number
}

interface ListTasksMeta {
  nextCursor: string | null
  hasMore: boolean
  count: number
}

interface ListTasksUseCaseResponse {
  tasks: Task[]
  meta: ListTasksMeta
}

export class ListTasksUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute({
    userId,
    cursor,
    limit,
  }: ListTasksUseCaseRequest): Promise<ListTasksUseCaseResponse> {
    const [rawTasks, count] = await Promise.all([
      this.tasksRepository.findByUserId({ userId, cursor, limit }),
      this.tasksRepository.countByUserId(userId),
    ])

    const hasMore = rawTasks.length > limit
    const tasks = rawTasks.slice(0, limit)
    const nextCursor = hasMore ? tasks[tasks.length - 1].id : null

    return { tasks, meta: { nextCursor, hasMore, count } }
  }
}
