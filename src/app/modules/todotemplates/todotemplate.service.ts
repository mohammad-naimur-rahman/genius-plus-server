import { and, eq } from 'drizzle-orm'
import { JwtPayload } from 'jsonwebtoken'
import { db } from '~db'
import todoTemplate, { NewTodoTemplate } from './todotemplate.schema'

const createTodoTemplate = async (
  body: NewTodoTemplate,
  reqUser: JwtPayload
) => {
  const newTemplate = await db
    .insert(todoTemplate)
    .values({
      ...body,
      user_id: reqUser.userId
    })
    .returning()

  return newTemplate[0]
}

const getAllTodoTemplates = async (reqUser: JwtPayload) => {
  const todoTemplates = await db
    .select()
    .from(todoTemplate)
    .where(eq(todoTemplate.user_id, reqUser.userId))
  return todoTemplates
}

const updateTodoTemplate = async (
  id: number,
  body: Partial<NewTodoTemplate>,
  reqUser: JwtPayload
) => {
  const updatedTemplate = await db
    .update(todoTemplate)
    .set(body)
    .where(
      and(eq(todoTemplate.id, id), eq(todoTemplate.user_id, reqUser.userId))
    )
    .returning()
  return updatedTemplate[0]
}

const deleteTodoTemplate = async (id: number, reqUser: JwtPayload) => {
  await db
    .delete(todoTemplate)
    .where(
      and(eq(todoTemplate.id, id), eq(todoTemplate.user_id, reqUser.userId))
    )
  return null
}

export const todoTemplateService = {
  createTodoTemplate,
  getAllTodoTemplates,
  updateTodoTemplate,
  deleteTodoTemplate
}
