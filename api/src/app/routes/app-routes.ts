import type { FastifyPluginAsync } from 'fastify'
import { privateRoutes } from './private.js'
import { publicRoutes } from './public.js'

export const appRoutes: FastifyPluginAsync = async (app) => {
  app.register(publicRoutes)
  app.register(privateRoutes)
}
