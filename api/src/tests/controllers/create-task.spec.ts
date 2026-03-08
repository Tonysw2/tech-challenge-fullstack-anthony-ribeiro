import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app/app.js'
import { createAndAuthenticateUser } from '../helpers/create-and-authenticate-user.js'

const request = supertest(app.server)

describe('POST /tasks', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('returns 201 with task defaulting to PENDING status', async () => {
    const { accessToken } = await createAndAuthenticateUser(request)

    const response = await request
      .post('/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'My first task', description: 'Some details' })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('task')
  })
})
