import { and, eq } from 'drizzle-orm'
import { JwtPayload } from 'jsonwebtoken'
import { AssistantCreateParams } from 'openai/resources/beta/assistants.mjs'
import { openaiPrompts } from '~constants/openaiPrompts'
import { db } from '~db'
import { assistant, thread, user } from '~db/schema'
import ApiError from '~utils/errorHandlers/ApiError'
import httpStatus from '~utils/httpStatus'
import { openai } from '~utils/openaiUtils'
import { NewAssistant } from '../assistants/assistant.schema'
import { CreateTalkingBuddyBody } from './talkingbuddy.interface'

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

export const talkingBuddyService = {
  createThread
}
