import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/tests/repositories/in-memory/in-memory-users-repository.js'
import { ResourceNotFound } from './errors/resource-not-found.js'
import { GetProfileUseCase } from './get-profile.js'

describe('GetProfileUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: GetProfileUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetProfileUseCase(usersRepository)
  })

  it('returns user without passwordHash by id', async () => {
    const created = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      passwordHash: 'hashed',
    })

    const { user } = await sut.execute({ userId: created.id })

    expect(user.id).toBe(created.id)
    expect(user.email).toBe('john@example.com')
    expect(user).not.toHaveProperty('passwordHash')
  })

  it('throws ResourceNotFound when user id does not exist', async () => {
    await expect(
      sut.execute({ userId: 'non-existent' }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
