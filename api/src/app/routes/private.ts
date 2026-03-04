import type { FastifyPluginAsync } from 'fastify'
import { createTask } from '../controllers/create-task.js'
import { listTasks } from '../controllers/list-tasks.js'
import { verifyJwt } from '../middlewares/verify-jwt.js'

export const privateRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('onRequest', verifyJwt)

  app.get('/tasks', listTasks)
  app.post('/tasks', createTask)
}
