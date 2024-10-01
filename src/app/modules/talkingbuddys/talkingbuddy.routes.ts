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
  .get(talkingBuddyController.getAllThreads)
  .post(
    validateRequest(talkingBuddyValidation.createThreadZValidation),
    talkingBuddyController.createThread
  )

router
  .route('/run/:id')
  .post(talkingBuddyController.runAThread)
  .get(talkingBuddyController.getThreadMessages)

router
  .route('/:id')
  .get(
    validateRequest(talkingBuddyValidation.getOrDeleteThreadZValidation),
    talkingBuddyController.getThread
  )
  .patch(
    validateRequest(talkingBuddyValidation.updateThreadZValidation),
    talkingBuddyController.updateThread
  )
  .delete(
    validateRequest(talkingBuddyValidation.getOrDeleteThreadZValidation),
    talkingBuddyController.deleteThread
  )

export const talkingBuddyRoutes = router
