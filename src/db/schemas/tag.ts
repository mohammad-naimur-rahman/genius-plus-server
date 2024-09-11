import { relations } from 'drizzle-orm'
import { serial, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { createTable } from '~db/schema'

import { postTags } from '~db/schemas'

const tag = createTable('tag', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique()
})

export const tagRelations = relations(tag, ({ many }) => ({
  postToTag: many(postTags)
}))

export const tagSchema = createInsertSchema(tag)
export type TagSchema = z.infer<typeof tagSchema>

export default tag
