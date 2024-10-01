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

const getAllThreads = catchAsync(async (req, res) => {
  const { user } = req as ReqWithUser
  const allThreads = await talkingBuddyService.getAllThreads(user)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Threads fetched successfully!',
    data: allThreads
  })
})

const getThread = catchAsync(async (req, res) => {
  const {
    user,
    query: { id }
  } = req as ReqWithUser
  const thread = await talkingBuddyService.getThread(Number(id), user)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Thread fetched successfully!',
    data: thread
  })
})

const updateThread = catchAsync(async (req, res) => {
  const {
    body,
    query: { id },
    user
  } = req as ReqWithUser
  const updatedThread = await talkingBuddyService.updateThread(
    Number(id),
    body,
    user
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Thread updated successfully!',
    data: updatedThread
  })
})

const deleteThread = catchAsync(async (req, res) => {
  const {
    user,
    query: { id }
  } = req as ReqWithUser
  await talkingBuddyService.deleteThread(Number(id), user)

  sendResponse(res, {
    statusCode: httpStatus.NO_CONTENT,
    message: 'Thread deleted successfully!',
    data: null
  })
})

export const talkingBuddyController = {
  createThread,
  getAllThreads,
  getThread,
  updateThread,
  deleteThread
}
