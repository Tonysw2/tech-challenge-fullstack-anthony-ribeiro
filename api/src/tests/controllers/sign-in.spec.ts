import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app/app.js'

const request = supertest(app.server)

describe('POST /sign-in', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('returns 200 with tokens on valid credentials', async () => {
    await request.post('/sign-up').send({
      name: 'Bob',
      email: 'bob@example.com',
      password: 'secret123',
    })

    const response = await request.post('/sign-in').send({
      email: 'bob@example.com',
      password: 'secret123',
    })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    })
  })

  it('returns 401 on invalid credentials', async () => {
    const response = await request.post('/sign-in').send({
      email: 'nonexistent@example.com',
      password: 'wrongpassword',
    })

    expect(response.status).toBe(401)
  })
})
