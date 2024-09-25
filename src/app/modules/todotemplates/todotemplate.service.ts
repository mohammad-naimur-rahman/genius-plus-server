import { and, eq, ilike } from 'drizzle-orm'
import { JwtPayload } from 'jsonwebtoken'
import { db } from '~db'
import { DBQuery, PaginateParams } from '~types/common'
import {
  getTotalCount,
  setQuerySortingNPagination
} from '~utils/paginationUtils'
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

const getAllTodoTemplates = async (
  params: PaginateParams,
  reqUser: JwtPayload
) => {
  const { page, limit, search } = params

  const findQuery = and(
    ilike(todoTemplate.title, `%${search || ''}%`),
    eq(todoTemplate.user_id, reqUser.userId)
  )
  const query: DBQuery = { where: findQuery }
  setQuerySortingNPagination(query, params, todoTemplate)

  const todoTemplates = await db.query.todoTemplate.findMany(query)
  const total = await getTotalCount(todoTemplate, findQuery)
  return { todoTemplates, meta: { page, limit, total } }
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
