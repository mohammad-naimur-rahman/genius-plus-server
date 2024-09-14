import { Router } from 'express'
import authGuard from '~app/middlewares/authGuard'
import validateRequest from '~app/middlewares/validateRequest'
import { ENUM_USER_ROLE } from '~enums/user'
import { todoController } from './todo.controller'
import { todoValidation } from './todo.validation'

const router = Router()

router.use(authGuard(ENUM_USER_ROLE.USER))

router
  .route('/')
  .get(
    validateRequest(todoValidation.getAllTodosZSchema),
    todoController.getAllTodos
  )
  .post(
    validateRequest(todoValidation.createTodoZSchema),
    todoController.createTodo
  )

router.post(
  '/create-with-ai',
  validateRequest(todoValidation.createTodoWithAIZSchema),
  todoController.createTodoWithAI
)

router.delete('/delete-the-day', todoController.deleteTodoForTheDay)

router
  .route('/:id')
  .patch(
    validateRequest(todoValidation.updateTodoZSchema),
    todoController.updateTodo
  )
  .delete(
    validateRequest(todoValidation.deleteTodoZSchema),
    todoController.deleteTodo
  )

export const todoRoutes = router
