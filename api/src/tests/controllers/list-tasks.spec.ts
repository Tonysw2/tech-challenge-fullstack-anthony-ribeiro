import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app/app.js'
import { createAndAuthenticateUser } from '../helpers/create-and-authenticate-user.js'

const request = supertest(app.server)

describe('GET /tasks', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('returns 200 with tasks array and meta object', async () => {
    const { accessToken } = await createAndAuthenticateUser(request)

    const response = await request
      .get('/tasks')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      tasks: expect.any(Array),
      meta: expect.any(Object),
    })
  })
})
