import { integer, varchar } from 'drizzle-orm/pg-core'
import { user } from '~db/schema'
import { createTable } from '~db/utils'
import { tableIdandTimestamp } from '~utils/dbUtils'
import assistant from '../assistants/assistant.schema'

const thread = createTable('threads', {
  ...tableIdandTimestamp,
  user_id: integer('user_id')
    .notNull()
    .references(() => user.id),
  assistant_id: integer('assistant_id')
    .notNull()
    .references(() => assistant.id),
  name: varchar('name', { length: 255 }).notNull(),
  vector_store_id: varchar('vector_store_id', { length: 255 }),
  thread_id: varchar('thread_id', { length: 255 }).notNull()
})

export default thread

export type Thread = typeof thread.$inferSelect
export type NewThread = typeof thread.$inferInsert
