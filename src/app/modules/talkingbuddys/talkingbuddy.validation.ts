import { z } from 'zod'
import { headerToken } from '~utils/validationUtils'

const createThreadZValidation = z.object({
  ...headerToken,
  body: z.object({
    name: z.string()
  })
})

export const talkingBuddyValidation = {
  createThreadZValidation
}
