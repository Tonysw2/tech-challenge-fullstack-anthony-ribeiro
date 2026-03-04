import { compare } from 'bcryptjs'
import type { User } from '../entities/user.js'
import type { IUsersRepository } from '../repositories/interfaces/users-repository-interface.js'
import { InvalidCredentials } from './errors/invalid-credentials.js'

interface SignInUseCaseRequest {
  email: string
  password: string
}

interface SignInUseCaseResponse {
  user: Omit<User, 'passwordHash'>
}

export class SignInUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: SignInUseCaseRequest): Promise<SignInUseCaseResponse> {
    const user = await this.usersRepository.findByEmailWithPassword(email)

    if (!user) {
      throw new InvalidCredentials()
    }

    const passwordMatches = await compare(password, user.passwordHash)

    if (!passwordMatches) {
      throw new InvalidCredentials()
    }

    const { passwordHash, ...userWithoutPassword } = user

    return { user: userWithoutPassword }
  }
}
