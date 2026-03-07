import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { Client } from 'pg'
import type { Environment } from 'vitest/environments'

function generateUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL env variable')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default (<Environment>{
  name: 'prisma',
  viteEnvironment: 'ssr',
  async setup() {
    const schema = randomUUID()
    const databaseUrl = generateUrl(schema)

    process.env.DATABASE_URL = databaseUrl.toString()

    execSync('pnpm exec prisma migrate deploy')

    return {
      async teardown() {
        const client = new Client({ connectionString: databaseUrl })
        await client.connect()
        await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
        await client.end()
      },
    }
  },
})
