import { Router } from 'express'
import { userController } from './user.controller'

const router = Router()

router.route('/').get(userController.getAllUsers)

export const userRoutes = router
