import { Router } from 'express'
import authGuard from '~app/middlewares/authGuard'
import validateRequest from '~app/middlewares/validateRequest'
import { ENUM_USER_ROLE } from '~enums/user'
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

router.post(
  '/reset-password',
  validateRequest(authValidation.resetPasswordZSchema),
  authGuard(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  authController.resetPassword
)
router.post(
  '/access-token',
  validateRequest(authValidation.generateNewAccessTokenZSchema),
  authController.generateNewAccessToken
)

export const authRoutes = router
