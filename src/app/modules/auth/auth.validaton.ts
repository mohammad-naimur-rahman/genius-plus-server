import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { jwtRegex, signUpRegex } from '~constants/regex'
import { user } from '~db/schema'

const createUserSchema = createInsertSchema(user, {
  password: schema => schema.password.regex(signUpRegex),
  age: s => s.age.min(6).max(100)
})

const loginUserZSChema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().regex(signUpRegex)
  })
})

const verifySignupZSchema = z.object({
  body: z.object({
    code: z.string()
  })
})

const forgetPassWordZSchema = z.object({
  body: z.object({
    email: z.string().email()
  })
})

const verifyForgetPasswordZSchema = z.object({
  body: z.object({
    code: z.string()
  })
})

const resetForgetPasswordZSchema = z.object({
  body: z.object({
    password: z.string().regex(signUpRegex),
    token: z.string()
  })
})

const resetPasswordZSchema = z.object({
  headers: z.object({
    authorization: z.string().regex(jwtRegex)
  }),
  body: z.object({
    password: z.string().regex(signUpRegex),
    new_password: z.string().regex(signUpRegex)
  })
})

export const authValidation = {
  createUserSchema,
  verifySignupZSchema,
  loginUserZSChema,
  forgetPassWordZSchema,
  verifyForgetPasswordZSchema,
  resetForgetPasswordZSchema,
  resetPasswordZSchema
}
