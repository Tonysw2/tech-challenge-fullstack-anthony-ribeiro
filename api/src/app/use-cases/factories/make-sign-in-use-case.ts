import { UsersRepository } from '@/app/repositories/users-repository.js'
import { SignInUseCase } from '../sign-in.js'

export function makeSignInUseCase() {
  const usersRepository = new UsersRepository()
  const useCase = new SignInUseCase(usersRepository)
  return useCase
}
