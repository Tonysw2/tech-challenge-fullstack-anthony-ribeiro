import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app/app.js'

const request = supertest(app.server)

describe('POST /sign-up', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('returns 201 with accessToken and refreshToken', async () => {
    const response = await request.post('/sign-up').send({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'secret123',
    })

    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    })
  })

  it('returns 409 when email is already in use', async () => {
    await request.post('/sign-up').send({
      name: 'Alice',
      email: 'alice-dup@example.com',
      password: 'secret123',
    })

    const response = await request.post('/sign-up').send({
      name: 'Alice',
      email: 'alice-dup@example.com',
      password: 'secret123',
    })

    expect(response.status).toBe(409)
  })
})
