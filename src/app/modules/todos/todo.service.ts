import { and, eq } from 'drizzle-orm'
import { JwtPayload } from 'jsonwebtoken'
import { db } from '~db'
import todo, { NewTodo } from './todo.schema'

const createTodo = async (body: NewTodo, reqUser: JwtPayload) => {
  console.log(body)
  const newTodo = await db
    .insert(todo)
    .values({
      ...body,
      user_id: reqUser.userId,
      date: new Date().toISOString()
    })
    .returning()
  return newTodo[0]
}

const getAllTodos = async (query: { date?: string }, reqUser: JwtPayload) => {
  const { date } = { ...query }
  const allTodos = await db.query.todo.findMany({
    where: (todo, { eq, and }) =>
      and(
        eq(todo.date, date || new Date().toISOString()),
        eq(todo.user_id, reqUser.userId)
      )
  })
  return allTodos
}
const updateTodo = async (
  id: number,
  body: Partial<NewTodo>,
  reqUser: JwtPayload
) => {
  const updatedTodo = await db
    .update(todo)
    .set(body)
    .where(and(eq(todo.id, id), eq(todo.user_id, reqUser.userId)))
    .returning()
  return updatedTodo[0]
}
const deleteTodo = async (id: number, reqUser: JwtPayload) => {
  await db
    .delete(todo)
    .where(and(eq(todo.id, id), eq(todo.user_id, reqUser.userId)))
    .returning()
  return null
}

export const todoService = {
  createTodo,
  getAllTodos,
  updateTodo,
  deleteTodo
}
