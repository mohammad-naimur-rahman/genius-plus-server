import catchAsync from '~shared/catchAsync'
import sendResponse from '~shared/sendResponse'
import { ReqWithUser } from '~types/common'
import httpStatus from '~utils/httpStatus'
import { talkingBuddyService } from './talkingbuddy.service'

const createThread = catchAsync(async (req, res) => {
  const { body, user } = req as ReqWithUser
  const newConversation = await talkingBuddyService.createThread(body, user)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Conversation created successfully!',
    data: newConversation
  })
})

export const talkingBuddyController = {
  createThread
}
