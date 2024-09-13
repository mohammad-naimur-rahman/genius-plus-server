import { Request, Response } from 'express'
import catchAsync from '~shared/catchAsync'
import sendResponse from '~shared/sendResponse'
import { ReqWithUser } from '~types/common'
import httpStatus from '~utils/httpStatus'
import { todoService } from './todo.service'

export const createTodo = catchAsync(async (req, res) => {
  const { body, user } = req as ReqWithUser
  const newTodo = await todoService.createTodo(body, user)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Todo created successfully!',
    data: newTodo
  })
})

export const getAllTodos = catchAsync(async (req, res) => {
  const { query, user } = req as ReqWithUser
  const todos = await todoService.getAllTodos(query as { date?: string }, user)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Todos retrieved successfully!',
    data: todos
  })
})

export const updateTodo = catchAsync(async (req, res) => {
  const {
    params: { id },
    body,
    user
  } = req as ReqWithUser
  const updatedTodo = await todoService.updateTodo(Number(id), body, user)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Todo updated successfully!',
    data: updatedTodo
  })
})

export const deleteTodo = catchAsync(async (req: Request, res: Response) => {
  const {
    params: { id },
    user
  } = req as ReqWithUser
  await todoService.deleteTodo(Number(id), user)
  res.status(httpStatus.NO_CONTENT).send()
})

export const todoController = {
  createTodo,
  getAllTodos,
  updateTodo,
  deleteTodo
}
