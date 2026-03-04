import type { FastifyPluginAsync } from 'fastify'
import { createTask } from '../controllers/create-task.js'
import { deleteTask } from '../controllers/delete-task.js'
import { listTasks } from '../controllers/list-tasks.js'
import { updateTask } from '../controllers/update-task.js'
import { verifyJwt } from '../middlewares/verify-jwt.js'

export const privateRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('onRequest', verifyJwt)

  app.get('/tasks', listTasks)
  app.post('/tasks', createTask)
  app.patch('/tasks/:id', updateTask)
  app.delete('/tasks/:id', deleteTask)
}
