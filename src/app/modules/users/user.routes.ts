import { Router } from 'express'
import { db } from '~db'
import catchAsync from '~shared/catchAsync'
import sendResponse from '~shared/sendResponse'
import httpStatus from '~utils/httpStatus'
import { userController } from './user.controller'
import user from './user.schema'

const router = Router()

router
  .route('/')
  .get(userController.getAllUsers)
  .post(
    catchAsync(async (req, res) => {
      const newUsers = await db.insert(user).values(req.body).returning()
      sendResponse(res, {
        statusCode: httpStatus.CREATED,
        data: newUsers,
        message: 'All users retrieved successfully!'
      })
    })
  )

export const userRoutes = router
