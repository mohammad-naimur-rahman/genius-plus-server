import { Router } from 'express'
import validateRequest from '~app/middlewares/validateRequest'
import { authController } from './auth.controller'
import { authValidation } from './auth.validaton'

const router = Router()

router.post('/signup', authController.signup)
router.post(
  '/signup-verify',
  validateRequest(authValidation.verifySignupZSchema),
  authController.signupVerify
)
router.post(
  '/login',
  validateRequest(authValidation.loginUserZSChema),
  authController.login
)
router.post(
  '/forget-password',
  validateRequest(authValidation.forgetPassWordZSchema),
  authController.forgetPassword
)
router.post(
  '/verify-forget-password',
  validateRequest(authValidation.verifyForgetPasswordZSchema),
  authController.forgetPasswordVerify
)
router.post(
  '/reset-forget-password',
  validateRequest(authValidation.resetForgetPasswordZSchema),
  authController.resetForgetPassword
)

export const authRoutes = router
