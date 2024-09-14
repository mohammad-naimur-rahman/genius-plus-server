import { z } from 'zod'
import { headerToken } from '~utils/validationUtils'

const createTodoZSchema = z.object({
  ...headerToken,
  body: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string().date().optional(),
    time_range: z.string(),
    priority: z.enum(['Very Low', 'Low', 'Moderate', 'High', 'Very High'])
  })
})

const createTodoWithAIZSchema = z.object({
  ...headerToken,
  body: z.object({
    text: z.string()
  })
})

const getAllTodosZSchema = z.object({
  ...headerToken,
  params: z.object({
    date: z.string().date().optional()
  })
})

const updateTodoZSchema = z.object({
  ...headerToken,
  params: z.object({
    id: z.string().refine(v => Number(v))
  }),
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    time_range: z.string().optional(),
    priority: z
      .enum(['Very Low', 'Low', 'Moderate', 'High', 'Very High'])
      .optional()
  })
})

const deleteTodoZSchema = z.object({
  ...headerToken,
  params: z.object({
    id: z.string().refine(v => Number(v))
  })
})

export const todoValidation = {
  createTodoZSchema,
  getAllTodosZSchema,
  updateTodoZSchema,
  deleteTodoZSchema,
  createTodoWithAIZSchema
}
