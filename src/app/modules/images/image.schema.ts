import { integer, pgEnum, text, varchar } from 'drizzle-orm/pg-core'
import { user } from '~db/schema'
import { createTable } from '~db/utils'
import { tableIdandTimestamp } from '~utils/dbUtils'

export const imageAspectEnum = pgEnum('aspect', [
  'square',
  'portrait',
  'landscape'
])

const image = createTable('images', {
  ...tableIdandTimestamp,
  user_id: integer('user_id')
    .notNull()
    .references(() => user.id),
  title: varchar('name', { length: 255 }).notNull(),
  prompt: text('prompt').notNull(),
  url: varchar('url', { length: 255 }).notNull(),
  aspect: imageAspectEnum('aspect').notNull()
})

export type Image = typeof image.$inferSelect
export type NewImage = typeof image.$inferInsert

export default image
