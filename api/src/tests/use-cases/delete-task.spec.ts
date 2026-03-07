import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTasksRepository } from '@/tests/repositories/in-memory/in-memory-tasks-repository.js'
import { DeleteTaskUseCase } from './delete-task.js'
import { ResourceNotFound } from './errors/resource-not-found.js'

describe('DeleteTaskUseCase', () => {
  let tasksRepository: InMemoryTasksRepository
  let sut: DeleteTaskUseCase

  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    sut = new DeleteTaskUseCase(tasksRepository)
  })

  it('deletes the task so it is no longer findable', async () => {
    const created = await tasksRepository.create({
      userId: 'user-1',
      title: 'Task',
    })

    await sut.execute({ id: created.id, userId: 'user-1' })

    const found = await tasksRepository.findById(created.id)
    expect(found).toBeNull()
  })

  it('throws ResourceNotFound when task id does not exist', async () => {
    await expect(
      sut.execute({ id: 'non-existent', userId: 'user-1' }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('throws ResourceNotFound when task belongs to a different user', async () => {
    const created = await tasksRepository.create({
      userId: 'user-1',
      title: 'Task',
    })

    await expect(
      sut.execute({ id: created.id, userId: 'user-2' }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
