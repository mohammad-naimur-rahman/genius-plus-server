import { z } from 'zod'
import { jwtRegex } from '~constants/regex'

export const headerToken = {
  headers: z.object({
    authorization: z.string().regex(jwtRegex)
  })
}
