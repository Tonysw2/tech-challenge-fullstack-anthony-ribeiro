import type { User } from '@/app/entities/user.js'
import type { CreateUserDTO } from '@/app/repositories/dtos/create-user-dto.js'
import type { IUsersRepository } from '@/app/repositories/interfaces/users-repository-interface.js'

export class InMemoryUsersRepository implements IUsersRepository {
  public items: User[] = []

  async create(data: CreateUserDTO): Promise<Omit<User, 'passwordHash'>> {
    const user: User = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.items.push(user)
    const { passwordHash: _, ...rest } = user
    return rest
  }

  async findByEmail(email: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = this.items.find((u) => u.email === email)
    if (!user) return null
    const { passwordHash: _, ...rest } = user
    return rest
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.items.find((u) => u.email === email) ?? null
  }

  async findById(id: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = this.items.find((u) => u.id === id)
    if (!user) return null
    const { passwordHash: _, ...rest } = user
    return rest
  }
}
