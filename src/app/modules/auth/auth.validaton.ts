import { createInsertSchema } from 'drizzle-zod'
import { signUpRegex } from '~constants/regex'
import { user } from '~db/schema'

const createUserSchema = createInsertSchema(user, {
  password: schema => schema.password.regex(signUpRegex),
  age: s => s.age.min(6).max(100)
})

export const authValidation = {
  createUserSchema
}
