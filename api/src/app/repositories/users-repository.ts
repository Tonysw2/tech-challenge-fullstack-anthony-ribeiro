import { db } from '../lib/prisma/client.js'
import type { CreateUserDTO } from './dtos/create-user-dto.js'
import type { IUsersRepository } from './interfaces/users-repository-interface.js'

export class UsersRepository implements IUsersRepository {
  async create(data: CreateUserDTO) {
    return db.user.create({
      data,
      omit: {
        passwordHash: true,
      },
    })
  }

  async findByEmail(email: string) {
    return db.user.findUnique({
      where: {
        email,
      },
      omit: {
        passwordHash: true,
      },
    })
  }

  async findByEmailWithPassword(email: string) {
    return db.user.findUnique({ where: { email } })
  }

  async findById(id: string) {
    return db.user.findUnique({ where: { id }, omit: { passwordHash: true } })
  }
}
