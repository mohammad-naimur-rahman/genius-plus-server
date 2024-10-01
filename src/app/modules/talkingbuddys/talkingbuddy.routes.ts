import { Router } from 'express'
import authGuard from '~app/middlewares/authGuard'
import { ENUM_USER_ROLE } from '~enums/user'
import { talkingBuddyController } from './talkingbuddy.controller'

const router = Router()

router.use(authGuard(ENUM_USER_ROLE.USER))

router.route('/').post(talkingBuddyController.createThread)

export const talkingBuddyRoutes = router
