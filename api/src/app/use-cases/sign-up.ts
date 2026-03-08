import { hash } from 'bcryptjs'
import type { User } from '../entities/user.js'
import type { IUsersRepository } from '../repositories/interfaces/users-repository-interface.js'
import { EmailAlreadyInUse } from './errors/email-already-in-use.js'

interface SignUpUseCaseRequest {
  name: string
  email: string
  password: string
}

interface SignUpUseCaseResponse {
  user: Omit<User, 'passwordHash'>
}

export class SignUpUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: SignUpUseCaseRequest): Promise<SignUpUseCaseResponse> {
    const existingUser = await this.usersRepository.findByEmail(email)

    if (existingUser) {
      throw new EmailAlreadyInUse()
    }

    const passwordHash = await hash(password, 10)

    const user = await this.usersRepository.create({
      name,
      email,
      passwordHash,
    })

    return {
      user,
    }
  }
}
