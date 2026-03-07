import { beforeEach, describe, expect, it } from 'vitest'
import { ListTasksUseCase } from '@/app/use-cases/list-tasks.js'
import { InMemoryTasksRepository } from '@/tests/repositories/in-memory/in-memory-tasks-repository.js'

describe('ListTasksUseCase', () => {
  let tasksRepository: InMemoryTasksRepository
  let sut: ListTasksUseCase

  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    sut = new ListTasksUseCase(tasksRepository)
  })

  it('returns only tasks belonging to the given user', async () => {
    await tasksRepository.create({ userId: 'user-1', title: 'Task A' })
    await tasksRepository.create({ userId: 'user-2', title: 'Task B' })
    await tasksRepository.create({ userId: 'user-1', title: 'Task C' })

    const { tasks } = await sut.execute({ userId: 'user-1', limit: 20 })

    expect(tasks).toHaveLength(2)
    expect(tasks.every((t) => t.userId === 'user-1')).toBe(true)
  })

  it('returns correct count in meta', async () => {
    await tasksRepository.create({ userId: 'user-1', title: 'Task A' })
    await tasksRepository.create({ userId: 'user-1', title: 'Task B' })
    await tasksRepository.create({ userId: 'user-2', title: 'Task C' })

    const { meta } = await sut.execute({ userId: 'user-1', limit: 20 })

    expect(meta.count).toBe(2)
  })

  it('returns hasMore false when tasks fit within limit', async () => {
    await tasksRepository.create({ userId: 'user-1', title: 'Task A' })
    await tasksRepository.create({ userId: 'user-1', title: 'Task B' })

    const { meta } = await sut.execute({ userId: 'user-1', limit: 5 })

    expect(meta.hasMore).toBe(false)
    expect(meta.nextCursor).toBeNull()
  })

  it('returns hasMore true and a valid nextCursor when there are more pages', async () => {
    for (let i = 1; i <= 5; i++) {
      await tasksRepository.create({ userId: 'user-1', title: `Task ${i}` })
    }

    const { tasks, meta } = await sut.execute({ userId: 'user-1', limit: 3 })

    expect(tasks).toHaveLength(3)
    expect(meta.hasMore).toBe(true)
    expect(meta.nextCursor).toBe(tasks[tasks.length - 1].id)
  })

  it('second page via cursor returns the correct next set of tasks', async () => {
    for (let i = 1; i <= 5; i++) {
      await tasksRepository.create({ userId: 'user-1', title: `Task ${i}` })
    }

    const firstPage = await sut.execute({ userId: 'user-1', limit: 3 })
    const firstPageIds = new Set(firstPage.tasks.map((t) => t.id))

    const secondPage = await sut.execute({
      userId: 'user-1',
      limit: 3,
      cursor: firstPage.meta.nextCursor!,
    })

    expect(secondPage.tasks).toHaveLength(2)
    expect(secondPage.meta.hasMore).toBe(false)
    expect(secondPage.tasks.every((t) => !firstPageIds.has(t.id))).toBe(true)
  })
})
