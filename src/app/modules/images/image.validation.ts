import { z } from 'zod'
import { headerToken } from '~utils/validationUtils'

const generateImageZSchema = z.object({
  ...headerToken,
  body: z.object({
    title: z.string(),
    prompt: z.string(),
    full_control: z.boolean().default(false),
    aspect: z.enum(['square', 'portrait', 'landscape']),
    promptParams: z
      .object({
        style: z.string().optional(),
        color_scheme: z.string().optional(),
        perspective: z.string().optional(),
        lighting: z.string().optional(),
        mood: z.string().optional(),
        background_type: z.string().optional(),
        texture: z.string().optional(),
        subject_type: z.string().optional(),
        environment: z.string().optional(),
        movement: z.string().optional(),
        style_intensity: z.string().optional(),
        prompt: z.string().optional()
      })
      .optional(),
    style: z.enum(['natural', 'vivid'])
  })
})

export const imageValidation = {
  generateImageZSchema
}
