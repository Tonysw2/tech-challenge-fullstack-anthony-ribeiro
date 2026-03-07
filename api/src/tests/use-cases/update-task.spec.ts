import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTasksRepository } from '@/tests/repositories/in-memory/in-memory-tasks-repository.js'
import { ResourceNotFound } from './errors/resource-not-found.js'
import { UpdateTaskUseCase } from './update-task.js'

describe('UpdateTaskUseCase', () => {
  let tasksRepository: InMemoryTasksRepository
  let sut: UpdateTaskUseCase

  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    sut = new UpdateTaskUseCase(tasksRepository)
  })

  it('updates task title, description, and status', async () => {
    const created = await tasksRepository.create({
      userId: 'user-1',
      title: 'Old title',
    })

    const { task } = await sut.execute({
      id: created.id,
      userId: 'user-1',
      title: 'New title',
      description: 'New description',
      status: 'COMPLETE',
    })

    expect(task.title).toBe('New title')
    expect(task.description).toBe('New description')
    expect(task.status).toBe('COMPLETE')
  })

  it('throws ResourceNotFound when task id does not exist', async () => {
    await expect(
      sut.execute({ id: 'non-existent', userId: 'user-1', title: 'X' }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('throws ResourceNotFound when task belongs to a different user', async () => {
    const created = await tasksRepository.create({
      userId: 'user-1',
      title: 'Task',
    })

    await expect(
      sut.execute({ id: created.id, userId: 'user-2', title: 'X' }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
