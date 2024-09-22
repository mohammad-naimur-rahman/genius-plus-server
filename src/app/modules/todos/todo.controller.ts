import { Request, Response } from 'express'
import catchAsync from '~shared/catchAsync'
import sendResponse from '~shared/sendResponse'
import { ReqWithUser } from '~types/common'
import httpStatus from '~utils/httpStatus'
import { todoService } from './todo.service'
import { formatDate } from '~utils/dateTimteUtils'
import { CLOSING } from 'ws'

const createTodo = catchAsync(async (req, res) => {
  const { body, user } = req as ReqWithUser
  const newTodo = await todoService.createTodo(body, user)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Todo created successfully!',
    data: newTodo
  })
})

const createTodoWithAI = catchAsync(async (req, res) => {
  const { body, user } = req as ReqWithUser
  const newTodo = await todoService.createTodoWithAI(body, user)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Todo created successfully for the day!',
    data: newTodo
  })
})

const getAllTodos = catchAsync(async (req, res) => {
  const { query, user } = req as ReqWithUser
  const todos = await todoService.getAllTodos(query as { date?: string }, user)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Todos retrieved successfully!',
    data: todos
  })
})

const updateTodo = catchAsync(async (req, res) => {
  const {
    params: { id },
    body,
    user
  } = req as ReqWithUser
  const updatedTodo = await todoService.updateTodo(Number(id), body, user)

  let successMessage = ''

  console.log(
    body.date && body.date !== formatDate(new Date()),
    body.date,
    formatDate(new Date())
  )
  console.log(body?.order && body?.order !== updatedTodo.order)
  console.log(body?.is_complete, updatedTodo.is_complete)

  if (body.date && body.date === formatDate(new Date()))
    successMessage = 'Todo forwarded to today!'
  else if (body?.order && body?.order === updatedTodo.order)
    successMessage = 'Todo rearranged successfully!'
  else if (body?.is_complete && updatedTodo.is_complete)
    successMessage = 'Todo marked as completed!'
  else if (!body?.is_complete && !updatedTodo.is_complete)
    successMessage = 'Todo marked as incompleted!'
  else successMessage = 'Todo updated successfully!'

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: successMessage,
    data: updatedTodo
  })
})

const deleteTodo = catchAsync(async (req: Request, res: Response) => {
  const {
    params: { id },
    user
  } = req as ReqWithUser
  await todoService.deleteTodo(Number(id), user)
  res.status(httpStatus.NO_CONTENT).send()
})

const deleteTodoForTheDay = catchAsync(async (req: Request, res: Response) => {
  const { user, query } = req as ReqWithUser
  await todoService.deleteTodoForTheDay(query, user)
  res.status(httpStatus.NO_CONTENT).send()
})

export const todoController = {
  createTodo,
  createTodoWithAI,
  getAllTodos,
  updateTodo,
  deleteTodo,
  deleteTodoForTheDay
}
