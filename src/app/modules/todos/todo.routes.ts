import { Router } from 'express'
import authGuard from '~app/middlewares/authGuard'
import validateRequest from '~app/middlewares/validateRequest'
import { ENUM_USER_ROLE } from '~enums/user'
import { todoController } from './todo.controller'
import { todoValidation } from './toto.validation'

const router = Router()

router
  .route('/')
  .get(
    authGuard(ENUM_USER_ROLE.USER),
    validateRequest(todoValidation.getAllTodosZSchema),
    todoController.getAllTodos
  )
  .post(
    authGuard(ENUM_USER_ROLE.USER),
    validateRequest(todoValidation.createTodoZSchema),
    todoController.createTodo
  )

router.post(
  '/create-with-ai',
  authGuard(ENUM_USER_ROLE.USER),
  validateRequest(todoValidation.createTodoWithAIZSchema),
  todoController.createTodoWithAI
)

router.delete(
  '/delete-the-day',
  authGuard(ENUM_USER_ROLE.USER),
  todoController.deleteTodoForTheDay
)

router
  .route('/:id')
  .patch(
    authGuard(ENUM_USER_ROLE.USER),
    validateRequest(todoValidation.updateTodoZSchema),
    todoController.updateTodo
  )
  .delete(
    authGuard(ENUM_USER_ROLE.USER),
    validateRequest(todoValidation.deleteTodoZSchema),
    todoController.deleteTodo
  )

export const todoRoutes = router
