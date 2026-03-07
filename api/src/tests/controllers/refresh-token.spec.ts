import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app/app.js'
import { createAndAuthenticateUser } from '../helpers/create-and-authenticate-user.js'

const request = supertest(app.server)

describe('POST /refresh-token', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('returns 200 with new token pair on valid refresh token', async () => {
    const { refreshToken } = await createAndAuthenticateUser(request)

    const response = await request.post('/refresh-token').send({ refreshToken })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('accessToken')
    expect(response.body).toHaveProperty('refreshToken')
  })

  it('returns 401 on invalid refresh token', async () => {
    const response = await request
      .post('/refresh-token')
      .send({ refreshToken: 'invalid.token.here' })

    expect(response.status).toBe(401)
  })
})
