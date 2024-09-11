import express, { Router } from 'express'
import { userRoutes } from '~app/modules/users/user.routes'

const router = express.Router()

interface ModuleRoute {
  path: string
  routes: Router
}

const moduleRoutes: ModuleRoute[] = [
  {
    path: '/users',
    routes: userRoutes
  }
]

moduleRoutes.forEach(route => router.use(route.path, route.routes))
export default router
