import type { Task } from '@/app/entities/task.js'
import type { CreateTaskDTO } from '../dtos/create-task-dto.js'
import type { ListTasksDTO } from '../dtos/list-tasks-dto.js'

export interface ITasksRepository {
  create(data: CreateTaskDTO): Promise<Task>
  findByUserId(data: ListTasksDTO): Promise<Task[]>
  countByUserId(userId: string): Promise<number>
}
