import type { FastifyPluginAsync } from 'fastify'
import { signUp } from '../controllers/sign-up.js'

export const publicRoutes: FastifyPluginAsync = async (app) => {
  app.post('/sign-up', signUp)
}
