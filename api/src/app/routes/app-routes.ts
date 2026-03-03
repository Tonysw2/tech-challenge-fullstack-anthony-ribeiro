import type { FastifyPluginAsync } from 'fastify'
import { publicRoutes } from './public.js'

export const appRoutes: FastifyPluginAsync = async (app) => {
  app.register(publicRoutes)
}
