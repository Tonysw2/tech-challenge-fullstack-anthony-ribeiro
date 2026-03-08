import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app/app.js'
import { createAndAuthenticateUser } from '../helpers/create-and-authenticate-user.js'

const request = supertest(app.server)

describe('GET /me', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('returns 200 with user data when authenticated', async () => {
    const { accessToken } = await createAndAuthenticateUser(request)

    const response = await request
      .get('/me')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('user')
  })
})
