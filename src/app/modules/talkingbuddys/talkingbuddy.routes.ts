import { Router } from 'express'
import authGuard from '~app/middlewares/authGuard'
import validateRequest from '~app/middlewares/validateRequest'
import { ENUM_USER_ROLE } from '~enums/user'
import { talkingBuddyController } from './talkingbuddy.controller'
import { talkingBuddyValidation } from './talkingbuddy.validation'

const router = Router()

router.use(authGuard(ENUM_USER_ROLE.USER))

router
  .route('/')
  .post(
    validateRequest(talkingBuddyValidation.createThreadZValidation),
    talkingBuddyController.createThread
  )

export const talkingBuddyRoutes = router
