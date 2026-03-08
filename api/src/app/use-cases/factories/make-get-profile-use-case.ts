import { UsersRepository } from '@/app/repositories/users-repository.js'
import { GetProfileUseCase } from '../get-profile.js'

export function makeGetProfileUseCase() {
  const usersRepository = new UsersRepository()
  return new GetProfileUseCase(usersRepository)
}
