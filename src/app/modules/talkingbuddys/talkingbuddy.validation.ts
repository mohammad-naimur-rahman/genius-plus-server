import { z } from 'zod'
import { headerToken } from '~utils/validationUtils'

const createThreadZValidation = z.object({
  ...headerToken,
  body: z.object({
    name: z.string()
  })
})

const updateThreadZValidation = z.object({
  ...headerToken,
  body: z.object({
    name: z.string().optional()
  })
})

const getOrDeleteThreadZValidation = z.object({
  ...headerToken,
  params: z.object({
    id: z.string().refine(v => Number(v))
  })
})

export const talkingBuddyValidation = {
  createThreadZValidation,
  updateThreadZValidation,
  getOrDeleteThreadZValidation
}
