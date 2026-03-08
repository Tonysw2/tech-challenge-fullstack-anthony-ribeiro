import { UsersRepository } from '@/app/repositories/users-repository.js'
import { SignUpUseCase } from '../sign-up.js'

export function makeSignUpUseCase() {
  const usersRepository = new UsersRepository()
  const useCase = new SignUpUseCase(usersRepository)
  return useCase
}
