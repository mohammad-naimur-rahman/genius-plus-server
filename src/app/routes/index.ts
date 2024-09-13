import express, { Router } from 'express'
import { authRoutes } from '~app/modules/auth/auth.routes'
import { todoRoutes } from '~app/modules/todos/todo.routes'
import { userRoutes } from '~app/modules/users/user.routes'

const router = express.Router()

interface ModuleRoute {
  path: string
  routes: Router
}

const moduleRoutes: ModuleRoute[] = [
  { path: '/auth', routes: authRoutes },
  { path: '/users', routes: userRoutes },
  { path: '/todos', routes: todoRoutes }
]

moduleRoutes.forEach(route => router.use(route.path, route.routes))
export default router
