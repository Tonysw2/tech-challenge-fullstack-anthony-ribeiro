import type { User } from '@/app/entities/user.js'
import type { CreateUserDTO } from '../dtos/create-user-dto.js'

export interface IUsersRepository {
  create(data: CreateUserDTO): Promise<Omit<User, 'passwordHash'>>
  findByEmail(email: string): Promise<Omit<User, 'passwordHash'> | null>
  findByEmailWithPassword(email: string): Promise<User | null>
}
