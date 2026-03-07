import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTasksRepository } from '@/tests/repositories/in-memory/in-memory-tasks-repository.js'
import { CreateTaskUseCase } from '@/app/use-cases/create-task.js'

describe('CreateTaskUseCase', () => {
  let tasksRepository: InMemoryTasksRepository
  let sut: CreateTaskUseCase

  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    sut = new CreateTaskUseCase(tasksRepository)
  })

  it('creates a task with correct userId, title and description', async () => {
    const { task } = await sut.execute({
      userId: 'user-1',
      title: 'My task',
      description: 'Some description',
    })

    expect(task.userId).toBe('user-1')
    expect(task.title).toBe('My task')
    expect(task.description).toBe('Some description')
  })

  it('creates a task with status PENDING by default', async () => {
    const { task } = await sut.execute({
      userId: 'user-1',
      title: 'My task',
    })

    expect(task.status).toBe('PENDING')
  })
})
