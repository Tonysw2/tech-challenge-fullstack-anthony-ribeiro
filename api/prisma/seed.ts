import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '../src/app/lib/prisma/generated/client.js'

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

const USERS = [
  { email: 'alice@example.com', name: 'Alice' },
  { email: 'bob@example.com', name: 'Bob' },
]

const TASK_DESCRIPTIONS = [
  'Implement feature',
  'Fix bug in module',
  'Write unit tests',
  'Update documentation',
  'Refactor legacy code',
  'Review pull request',
  'Set up CI pipeline',
  'Optimize database query',
  'Add input validation',
  'Deploy to staging',
]

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  for (const userData of USERS) {
    const user = await db.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        passwordHash: hashedPassword,
        name: userData.name,
      },
    })

    console.log(`Upserted user: ${user.email} (${user.id})`)

    await db.task.deleteMany({ where: { userId: user.id } })

    const baseTime = new Date()
    for (let i = 0; i < 50; i++) {
      const index = i + 1
      const description = TASK_DESCRIPTIONS[i % TASK_DESCRIPTIONS.length]
      const createdAt = new Date(baseTime.getTime() + i * 5000)
      await db.task.create({
        data: {
          userId: user.id,
          title: `Task ${index}: ${description}`,
          description:
            index % 3 === 0
              ? null
              : `Details for task ${index} assigned to ${userData.name}.`,
          status: (index <= 25 ? 'PENDING' : 'COMPLETE') as
            | 'PENDING'
            | 'COMPLETE',
          createdAt,
          updatedAt: createdAt,
        },
      })
    }
    console.log(`Created 50 tasks for ${user.email}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
