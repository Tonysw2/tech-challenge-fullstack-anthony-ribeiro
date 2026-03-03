import z from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(1),
  JWT_REFRESH_TOKEN_SECRET: z.string().min(1),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().min(1).default('15m'),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string().min(1).default('7d'),
})

export const env = envSchema.parse(process.env)
