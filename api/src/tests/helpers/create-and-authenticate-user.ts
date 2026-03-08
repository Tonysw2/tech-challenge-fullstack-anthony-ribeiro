import type supertest from 'supertest'

interface AuthResult {
  accessToken: string
  refreshToken: string
}

export async function createAndAuthenticateUser(
  request: ReturnType<typeof supertest>,
  overrides?: { name?: string; email?: string; password?: string },
): Promise<AuthResult> {
  const name = overrides?.name ?? 'Test User'
  const email = overrides?.email ?? 'test@example.com'
  const password = overrides?.password ?? 'secret123'

  const response = await request
    .post('/sign-up')
    .send({ name, email, password })

  return {
    accessToken: response.body.accessToken,
    refreshToken: response.body.refreshToken,
  }
}
