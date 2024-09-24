import express, { Router } from 'express'
import { authRoutes } from '~app/modules/auth/auth.routes'
import { imageRoutes } from '~app/modules/images/image.routes'
import { todoRoutes } from '~app/modules/todos/todo.routes'
import { todoTemplateRoutes } from '~app/modules/todotemplates/todotemplate.routes'
import { userRoutes } from '~app/modules/users/user.routes'

const router = express.Router()

interface ModuleRoute {
  path: string
  routes: Router
}

const moduleRoutes: ModuleRoute[] = [
  { path: '/auth', routes: authRoutes },
  { path: '/users', routes: userRoutes },
  { path: '/todos', routes: todoRoutes },
  { path: '/todo-templates', routes: todoTemplateRoutes },
  { path: '/images', routes: imageRoutes }
]

moduleRoutes.forEach(route => router.use(route.path, route.routes))
export default router
