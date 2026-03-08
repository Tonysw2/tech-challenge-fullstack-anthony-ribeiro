import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app/app.js'
import { createAndAuthenticateUser } from '../helpers/create-and-authenticate-user.js'

const request = supertest(app.server)

describe('DELETE /tasks/:id', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('returns 204 on successful deletion', async () => {
    const { accessToken } = await createAndAuthenticateUser(request)

    const {
      body: { task },
    } = await request
      .post('/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'My task' })

    const response = await request
      .delete(`/tasks/${task.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(204)
  })

  it('returns 404 when task does not exist', async () => {
    const { accessToken } = await createAndAuthenticateUser(request, {
      email: 'test2@example.com',
    })

    const response = await request
      .delete('/tasks/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(404)
  })
})
