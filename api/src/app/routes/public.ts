import type { FastifyPluginAsync } from 'fastify'
import { signIn } from '../controllers/sign-in.js'
import { signUp } from '../controllers/sign-up.js'

export const publicRoutes: FastifyPluginAsync = async (app) => {
  app.post('/sign-up', signUp)
  app.post('/sign-in', signIn)
}
