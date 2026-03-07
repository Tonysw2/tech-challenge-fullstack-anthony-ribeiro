import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/tests/repositories/in-memory/in-memory-users-repository.js'
import { EmailAlreadyInUse } from '@/app/use-cases/errors/email-already-in-use.js'
import { SignUpUseCase } from '@/app/use-cases/sign-up.js'

describe('SignUpUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: SignUpUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new SignUpUseCase(usersRepository)
  })

  it('creates user and returns data without passwordHash', async () => {
    const { user } = await sut.execute({
      name: 'John',
      email: 'john@example.com',
      password: 'secret123',
    })

    expect(user.name).toBe('John')
    expect(user.email).toBe('john@example.com')
    expect(user).not.toHaveProperty('passwordHash')
  })

  it('throws EmailAlreadyInUse on duplicate email', async () => {
    await sut.execute({
      name: 'John',
      email: 'john@example.com',
      password: 'secret123',
    })

    await expect(
      sut.execute({
        name: 'John 2',
        email: 'john@example.com',
        password: 'other',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyInUse)
  })

  it('stores a hashed password, not plain text', async () => {
    const password = 'secret123'
    await sut.execute({ name: 'John', email: 'john@example.com', password })

    const stored = usersRepository.items[0]
    expect(stored.passwordHash).not.toBe(password)
    expect(stored.passwordHash.length).toBeGreaterThan(0)
  })
})
