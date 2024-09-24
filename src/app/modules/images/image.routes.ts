import { Router } from 'express'
import authGuard from '~app/middlewares/authGuard'
import validateRequest from '~app/middlewares/validateRequest'
import { ENUM_USER_ROLE } from '~enums/user'
import { imageController } from './image.controller'
import { imageValidation } from './image.validation'

const router = Router()

router.use(authGuard(ENUM_USER_ROLE.USER))

router
  .route('/')
  .get(imageController.getUserImages)
  .post(
    validateRequest(imageValidation.generateImageZSchema),
    imageController.generateImage
  )

router
  .route('/:id')
  .get(
    validateRequest(imageValidation.getOrDeleteImageZSchema),
    imageController.getImage
  )
  .patch(
    validateRequest(imageValidation.updateImageZSchema),
    imageController.updateImage
  )
  .delete(
    validateRequest(imageValidation.getOrDeleteImageZSchema),
    imageController.deleteImage
  )

export const imageRoutes = router
