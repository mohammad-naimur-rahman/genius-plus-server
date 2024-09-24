import { Router } from 'express'
import authGuard from '~app/middlewares/authGuard'
import validateRequest from '~app/middlewares/validateRequest'
import { ENUM_USER_ROLE } from '~enums/user'
import { imageController } from './image.controller'
import { imageValidation } from './image.validation'

const router = Router()

router
  .route('/')
  .get(authGuard(ENUM_USER_ROLE.USER), imageController.getUserImages)
  .post(
    authGuard(ENUM_USER_ROLE.USER),
    validateRequest(imageValidation.generateImageZSchema),
    imageController.generateImage
  )

export const imageRoutes = router
