import type { Task } from '@/app/entities/task.js'
import type { CreateTaskDTO } from '../dtos/create-task-dto.js'

export interface ITasksRepository {
  create(data: CreateTaskDTO): Promise<Task>
}
