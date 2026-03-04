import { db } from '../lib/prisma/client.js'
import type { CreateTaskDTO } from './dtos/create-task-dto.js'
import type { ITasksRepository } from './interfaces/tasks-repository-interface.js'

export class TasksRepository implements ITasksRepository {
  async create(data: CreateTaskDTO) {
    return db.task.create({ data })
  }
}
