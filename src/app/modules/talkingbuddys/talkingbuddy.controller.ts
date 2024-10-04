import { EventEmitter } from 'events'
import catchAsync from '~shared/catchAsync'
import sendResponse from '~shared/sendResponse'
import { ReqWithUser } from '~types/common'
import httpStatus from '~utils/httpStatus'
import applySSE from '~utils/sseUtils'
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
    params: { id }
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
    params: { id },
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
    params: { id }
  } = req as ReqWithUser
  await talkingBuddyService.deleteThread(Number(id), user)

  res.status(httpStatus.NO_CONTENT).send()
})

// Thread run controller
const runAThread = catchAsync(async (req, res) => {
  const {
    params: { id },
    body,
    user
  } = req as ReqWithUser

  // Setup for streaming response
  const eventEmitter = new EventEmitter()
  applySSE(req, res, eventEmitter)

  await talkingBuddyService.runAThread(Number(id), body, user, eventEmitter)
})

// Thread messages controller
const getThreadMessages = catchAsync(async (req, res) => {
  const {
    params: { id },
    user
  } = req as ReqWithUser
  const messages = await talkingBuddyService.getThreadMessages(Number(id), user)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Thread messages fetched successfully!',
    data: messages
  })
})

export const talkingBuddyController = {
  createThread,
  getAllThreads,
  getThread,
  updateThread,
  deleteThread,
  runAThread,
  getThreadMessages
}
