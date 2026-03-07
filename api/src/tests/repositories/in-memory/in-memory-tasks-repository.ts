import type { Task } from '@/app/entities/task.js'
import type { CreateTaskDTO } from '@/app/repositories/dtos/create-task-dto.js'
import type { ListTasksDTO } from '@/app/repositories/dtos/list-tasks-dto.js'
import type { UpdateTaskDTO } from '@/app/repositories/dtos/update-task-dto.js'
import type { ITasksRepository } from '@/app/repositories/interfaces/tasks-repository-interface.js'

export class InMemoryTasksRepository implements ITasksRepository {
  public items: Task[] = []

  async create(data: CreateTaskDTO): Promise<Task> {
    const task: Task = {
      id: crypto.randomUUID(),
      userId: data.userId,
      title: data.title,
      description: data.description ?? null,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.items.push(task)
    return task
  }

  async findByUserId({ userId, cursor, limit }: ListTasksDTO): Promise<Task[]> {
    let items = this.items
      .filter((t) => t.userId === userId)
      .sort((a, b) => (b.id > a.id ? 1 : b.id < a.id ? -1 : 0))

    if (cursor) {
      const cursorIndex = items.findIndex((t) => t.id === cursor)
      if (cursorIndex !== -1) {
        items = items.slice(cursorIndex + 1)
      }
    }

    return items.slice(0, limit + 1)
  }

  async countByUserId(userId: string): Promise<number> {
    return this.items.filter((t) => t.userId === userId).length
  }

  async findById(id: string): Promise<Task | null> {
    return this.items.find((t) => t.id === id) ?? null
  }

  async update({ id, userId: _userId, ...data }: UpdateTaskDTO): Promise<Task> {
    const index = this.items.findIndex((t) => t.id === id)
    const existing = this.items[index]
    const updated: Task = {
      ...existing,
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status !== undefined && { status: data.status }),
      updatedAt: new Date(),
    }
    this.items[index] = updated
    return updated
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((t) => t.id !== id)
  }
}
