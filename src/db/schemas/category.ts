import { relations } from 'drizzle-orm'
import { serial, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { createTable } from '~db/schema'

import { post } from '~db/schemas'

const category = createTable('category', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique()
})

export const categoryRelations = relations(category, ({ many }) => ({
  posts: many(post)
}))

export const categorySchema = createInsertSchema(category)
export type CategorySchema = z.infer<typeof categorySchema>

export default category
