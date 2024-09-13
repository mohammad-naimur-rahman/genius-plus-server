import { Router } from 'express'
import { authController } from './auth.controller'

const router = Router()

router.post('/signup', authController.signup)
router.post('/signup-verify', authController.signupVerify)

export const authRoutes = router
