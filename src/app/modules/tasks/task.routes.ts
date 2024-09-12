import { Router } from 'express'
import { taskController } from './task.controller'

export const router = Router()

router.route('/').post(taskController.createTask)

export const TaskRoutes = router
