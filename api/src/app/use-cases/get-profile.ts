import type { User } from '../entities/user.js'
import type { IUsersRepository } from '../repositories/interfaces/users-repository-interface.js'
import { ResourceNotFound } from './errors/resource-not-found.js'

interface GetProfileUseCaseRequest {
  userId: string
}

interface GetProfileUseCaseResponse {
  user: Omit<User, 'passwordHash'>
}

export class GetProfileUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    userId,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)
    if (!user) throw new ResourceNotFound()
    return { user }
  }
}
