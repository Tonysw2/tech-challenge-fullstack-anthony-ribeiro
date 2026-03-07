import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '@/env.js'
import { PrismaClient } from './generated/client.js'

const connectionString = env.DATABASE_URL
const schema = new URL(connectionString).searchParams.get('schema') ?? undefined

export const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: env.DATABASE_URL }, { schema }),
})
