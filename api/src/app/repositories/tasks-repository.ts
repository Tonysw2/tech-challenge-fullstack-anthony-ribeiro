import { db } from '../lib/prisma/client.js'
import type { CreateTaskDTO } from './dtos/create-task-dto.js'
import type { ListTasksDTO } from './dtos/list-tasks-dto.js'
import type { ITasksRepository } from './interfaces/tasks-repository-interface.js'

export class TasksRepository implements ITasksRepository {
  async create(data: CreateTaskDTO) {
    return db.task.create({
      data,
    })
  }

  async findByUserId({ userId, cursor, limit }: ListTasksDTO) {
    return db.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit + 1,
      ...{
        cursor: {
          id: cursor,
        },
        skip: 1,
      },
    })
  }

  async countByUserId(userId: string) {
    return db.task.count({ where: { userId } })
  }
}
