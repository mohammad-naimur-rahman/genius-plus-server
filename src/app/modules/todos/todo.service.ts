import { and, asc, eq } from 'drizzle-orm'
import { JwtPayload } from 'jsonwebtoken'
import { openaiPrompts } from '~constants/openaiPrompts'
import { db } from '~db'
import { formatDate } from '~utils/dateTimteUtils'
import ApiError from '~utils/errorHandlers/ApiError'
import httpStatus from '~utils/httpStatus'
import { isValidJSON } from '~utils/isValidSomething'
import { openai } from '~utils/openai'
import todo, { NewTodo } from './todo.schema'

const createTodo = async (body: NewTodo, reqUser: JwtPayload) => {
  const previousTodoLength = await db.query.todo.findMany({
    where: and(
      eq(todo.user_id, reqUser.userId),
      eq(todo.date, formatDate(new Date()))
    )
  })

  const newTodo = await db
    .insert(todo)
    .values({
      ...body,
      user_id: reqUser.userId,
      date: formatDate(new Date()),
      order: previousTodoLength.length + 1
    })
    .returning()
  return newTodo[0]
}

const createTodoWithAI = async (
  body: { text: string },
  reqUser: JwtPayload
) => {
  const { text } = body

  const todoExists = await db.query.todo.findFirst({
    where: and(
      eq(todo.user_id, reqUser.userId),
      eq(todo.date, formatDate(new Date()))
    )
  })

  if (todoExists) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Try in an empty todo list or delete the old ones!'
    )
  }

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: openaiPrompts.todoForaDay()
      },
      { role: 'user', content: text }
    ],
    model: 'gpt-4o'
  })

  const todoJSON = completion.choices[0].message.content

  const isValid = todoJSON && isValidJSON(todoJSON)

  if (!isValid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Something went wrong, try again!'
    )
  }

  const todos = JSON.parse(todoJSON)

  if (!Array.isArray(todos)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No todos found in the response')
  }

  const hasError = todos.find((todo: NewTodo) => todo.title === 'ERROR')

  if (hasError) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      hasError.description || 'Something went wrong, try again!'
    )
  }

  const newTodos = await db
    .insert(todo)
    .values(
      todos.map((todo: NewTodo, order: number) => ({
        ...todo,
        user_id: reqUser.userId,
        date: formatDate(new Date()),
        order: order + 1
      }))
    )
    .returning()

  return newTodos
}

const getAllTodos = async (query: { date?: string }, reqUser: JwtPayload) => {
  const { date } = { ...query }
  const allTodos = await db.query.todo.findMany({
    where: (todo, { eq, and }) =>
      and(
        eq(todo.date, date || formatDate(new Date())),
        eq(todo.user_id, reqUser.userId)
      ),
    orderBy: asc(todo.order)
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
  return null
}

const deleteTodoForTheDay = async (reqUser: JwtPayload) => {
  console.log(formatDate(new Date()))
  await db
    .delete(todo)
    .where(
      and(
        eq(todo.date, formatDate(new Date())),
        eq(todo.user_id, reqUser.userId)
      )
    )
  return null
}

export const todoService = {
  createTodo,
  getAllTodos,
  updateTodo,
  deleteTodo,
  createTodoWithAI,
  deleteTodoForTheDay
}
