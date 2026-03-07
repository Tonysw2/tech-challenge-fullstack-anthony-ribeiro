import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/tests/repositories/in-memory/in-memory-users-repository.js'
import { InvalidCredentials } from './errors/invalid-credentials.js'
import { SignInUseCase } from './sign-in.js'
import { SignUpUseCase } from './sign-up.js'

describe('SignInUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: SignInUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new SignInUseCase(usersRepository)
  })

  it('returns user without passwordHash on valid credentials', async () => {
    const signUp = new SignUpUseCase(usersRepository)
    await signUp.execute({
      name: 'John',
      email: 'john@example.com',
      password: 'secret123',
    })

    const { user } = await sut.execute({
      email: 'john@example.com',
      password: 'secret123',
    })

    expect(user.email).toBe('john@example.com')
    expect(user).not.toHaveProperty('passwordHash')
  })

  it('throws InvalidCredentials when email is not found', async () => {
    await expect(
      sut.execute({ email: 'nobody@example.com', password: 'secret123' }),
    ).rejects.toBeInstanceOf(InvalidCredentials)
  })

  it('throws InvalidCredentials when password is wrong', async () => {
    const signUp = new SignUpUseCase(usersRepository)
    await signUp.execute({
      name: 'John',
      email: 'john@example.com',
      password: 'secret123',
    })

    await expect(
      sut.execute({ email: 'john@example.com', password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(InvalidCredentials)
  })
})
