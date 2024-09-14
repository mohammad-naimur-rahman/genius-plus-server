import { z } from 'zod'
import { headerToken } from '~utils/validationUtils'

const createTodoTemplateZSchema = z.object({
  ...headerToken,
  body: z.object({
    title: z.string(),
    description: z.string().optional(),
    instructions: z.string()
  })
})

const updateTodoTemplateZSchema = z.object({
  ...headerToken,
  params: z.object({
    id: z.string().refine(v => Number(v))
  }),
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    instructions: z.string().optional()
  })
})

const deleteTodoTemplateZSchema = z.object({
  ...headerToken,
  params: z.object({
    id: z.string().refine(v => Number(v))
  })
})

export const todoTemplateValidation = {
  createTodoTemplateZSchema,
  updateTodoTemplateZSchema,
  deleteTodoTemplateZSchema
}
