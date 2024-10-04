import { and, eq } from 'drizzle-orm'

import { EventEmitter } from 'events'
import { JwtPayload } from 'jsonwebtoken'
import { AssistantCreateParams } from 'openai/resources/beta/assistants.mjs'
import { openaiPrompts } from '~constants/openaiPrompts'
import { db } from '~db'
import { assistant, thread, user } from '~db/schema'
import ApiError from '~utils/errorHandlers/ApiError'
import httpStatus from '~utils/httpStatus'
import { openai } from '~utils/openaiUtils'
import { NewAssistant } from '../assistants/assistant.schema'
import { Thread } from '../threads/thread.schema'
import {
  CreateTalkingBuddyBody,
  RunTalkingBuddyThreadQuery
} from './talkingbuddy.interface'

const createThread = async (
  body: CreateTalkingBuddyBody,
  reqUser: JwtPayload
) => {
  const { name } = body // thread name

  const userData = await db.query.user.findFirst({
    where: eq(user.id, reqUser.userId)
  })

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found with this id!')
  }

  // It will only create one assistant per user for talking buddy
  // First checking if assistant exists
  const assistantExists = await db.query.assistant.findFirst({
    where: and(
      eq(assistant.type, 'talkingBuddy'),
      eq(assistant.user_id, reqUser.userId)
    ),
    columns: {
      id: true
    }
  })

  let assistantExistsId = null

  if (!assistantExists) {
    // First create assistant with openai if assistant doesn't exist
    const assistantObj: AssistantCreateParams = {
      name: `Talking Buddy for user id ${reqUser.userId}`,
      description:
        'This is a talking buddy assistant, this value will not be shown in the ui',
      model: 'gpt-4o-mini',
      temperature: 1.2,
      instructions: openaiPrompts.takingBuddyPrompt(userData.name)
    }

    const createdAssistant = await openai.beta.assistants.create(assistantObj)

    const newAssistantObj: NewAssistant = {
      user_id: reqUser.userId,
      name: assistantObj.name!,
      description: assistantObj.description,
      assistant_id: createdAssistant.id,
      type: 'talkingBuddy',
      model: assistantObj.model,
      temperature: String(assistantObj.temperature)
    }

    // Then insert the assistant data into db
    const newAssistant = await db
      .insert(assistant)
      .values(newAssistantObj)
      .returning({ id: assistant.id })
    assistantExistsId = newAssistant[0].id
  } else {
    // if assistant exists, using it for creating the thread
    assistantExistsId = assistantExists.id
  }

  // First create a thread with openai
  const createdThread = await openai.beta.threads.create()

  // Insert the thread data into db
  const newThread = await db
    .insert(thread)
    .values({
      user_id: reqUser.userId,
      assistant_id: assistantExistsId,
      name,
      thread_id: createdThread.id
    })
    .returning()

  return newThread[0]
}

const getAllThreads = async (reqUser: JwtPayload) => {
  const takingBuddyAssistant = await db.query.assistant.findFirst({
    where: and(
      eq(assistant.user_id, reqUser.userId),
      eq(assistant.type, 'talkingBuddy')
    ),
    columns: { id: true }
  })

  if (!takingBuddyAssistant) {
    return []
  }

  const threads = await db.query.thread.findMany({
    where: and(
      eq(thread.user_id, reqUser.userId),
      eq(thread.assistant_id, takingBuddyAssistant.id)
    )
  })
  return threads
}

const getThread = async (id: number, reqUser: JwtPayload) => {
  const singleThread = await db.query.thread.findFirst({
    where: and(eq(thread.id, id), eq(thread.user_id, reqUser.userId))
  })

  if (!singleThread) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Thread not found with this id!')
  }

  return singleThread
}

const updateThread = async (
  id: number,
  body: Partial<Thread>,
  reqUser: JwtPayload
) => {
  const updatedThread = await db
    .update(thread)
    .set(body)
    .where(and(eq(thread.id, id), eq(thread.user_id, reqUser.userId)))
    .returning()
  return updatedThread[0]
}

const deleteThread = async (id: number, reqUser: JwtPayload) => {
  await db
    .delete(thread)
    .where(and(eq(thread.id, id), eq(thread.user_id, reqUser.userId)))
  return null
}

// Thread run service
const runAThread = async (
  id: number,
  body: RunTalkingBuddyThreadQuery,
  reqUser: JwtPayload,
  eventEmitter: EventEmitter
) => {
  const talkingBuddyThread = await db.query.thread.findFirst({
    where: and(eq(thread.id, id), eq(thread.user_id, reqUser.userId)),
    columns: { thread_id: true, assistant_id: true }
  })

  if (!talkingBuddyThread) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Thread not found with this id!')
  }

  const talkingBuddyAssistant = await db.query.assistant.findFirst({
    where: and(
      eq(assistant.id, talkingBuddyThread.assistant_id),
      eq(assistant.type, 'talkingBuddy')
    ),
    columns: { assistant_id: true, max_completion_tokens: true }
  })

  if (!talkingBuddyAssistant) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Assistant not found with this id!'
    )
  }

  // First create a message
  await openai.beta.threads.messages.create(talkingBuddyThread.thread_id, {
    role: 'user',
    content: body.prompt
  })

  // Then create a run
  const data = await openai.beta.threads.runs.create(
    talkingBuddyThread.thread_id,
    {
      assistant_id: talkingBuddyAssistant?.assistant_id,
      stream: true,
      max_completion_tokens: talkingBuddyAssistant.max_completion_tokens || 500
    }
  )

  for await (const event of data) {
    eventEmitter.emit('event', event)
  }
}

const getThreadMessages = async (id: number, reqUser: JwtPayload) => {
  const talkingBuddyThread = await db.query.thread.findFirst({
    where: and(eq(thread.id, id), eq(thread.user_id, reqUser.userId)),
    columns: { thread_id: true }
  })

  if (!talkingBuddyThread) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Thread not found with this id!')
  }

  const messages = await openai.beta.threads.messages.list(
    talkingBuddyThread.thread_id
  )

  const sortedMessages = messages.data.sort(
    (a, b) => a.created_at - b.created_at
  )

  const messagesContents = sortedMessages.map(message => ({
    id: message.id,
    role: message.role,
    content:
      message.content[0].type === 'text' ? message.content[0].text.value : ''
  }))

  return messagesContents
}

export const talkingBuddyService = {
  createThread,
  getAllThreads,
  getThread,
  updateThread,
  deleteThread,
  runAThread,
  getThreadMessages
}
