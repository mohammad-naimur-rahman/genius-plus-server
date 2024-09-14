import { Router } from 'express'
import authGuard from '~app/middlewares/authGuard'
import validateRequest from '~app/middlewares/validateRequest'
import { ENUM_USER_ROLE } from '~enums/user'
import { todoTemplateController } from './todotemplate.controller'
import { todoTemplateValidation } from './todotemplate.validation'

const router = Router()

router.use(authGuard(ENUM_USER_ROLE.USER))

router
  .route('/')
  .get(todoTemplateController.getAllTodoTemplates)
  .post(
    validateRequest(todoTemplateValidation.createTodoTemplateZSchema),
    todoTemplateController.createTodoTemplate
  )

router
  .route('/:id')
  .patch(
    validateRequest(todoTemplateValidation.updateTodoTemplateZSchema),
    todoTemplateController.updateTodoTemplate
  )
  .delete(
    validateRequest(todoTemplateValidation.deleteTodoTemplateZSchema),
    todoTemplateController.deleteTodoTemplate
  )

export const todoTemplateRoutes = router
