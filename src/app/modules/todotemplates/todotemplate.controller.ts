import catchAsync from '~shared/catchAsync'
import sendResponse from '~shared/sendResponse'
import { ReqWithUser } from '~types/common'
import httpStatus from '~utils/httpStatus'
import { filterQueries } from '~utils/paginationUtils'
import { todoTemplateService } from './todotemplate.service'

const createTodoTemplate = catchAsync(async (req, res) => {
  const { body, user } = req as ReqWithUser
  const newTemplate = await todoTemplateService.createTodoTemplate(body, user)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Todo template created successfully!',
    data: newTemplate
  })
})

const getAllTodoTemplates = catchAsync(async (req, res) => {
  const { query, user } = req as ReqWithUser
  const params = filterQueries(query)
  const { todoTemplates, meta } = await todoTemplateService.getAllTodoTemplates(
    params,
    user
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Todo templates retrieved successfully!',
    data: todoTemplates,
    meta
  })
})

const updateTodoTemplate = catchAsync(async (req, res) => {
  const {
    params: { id },
    body,
    user
  } = req as ReqWithUser
  const updatedTemplate = await todoTemplateService.updateTodoTemplate(
    Number(id),
    body,
    user
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Todo template updated successfully!',
    data: updatedTemplate
  })
})

const deleteTodoTemplate = catchAsync(async (req, res) => {
  const {
    params: { id },
    user
  } = req as ReqWithUser
  await todoTemplateService.deleteTodoTemplate(Number(id), user)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Todo template deleted successfully!',
    data: null
  })
})

export const todoTemplateController = {
  createTodoTemplate,
  getAllTodoTemplates,
  updateTodoTemplate,
  deleteTodoTemplate
}
