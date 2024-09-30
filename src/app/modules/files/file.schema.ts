import { integer, varchar } from 'drizzle-orm/pg-core'
import { createTable } from '~db/utils'
import { tableIdandTimestamp } from '~utils/dbUtils'
import assistant from '../assistants/assistant.schema'
import thread from '../threads/thread.schema'

const file = createTable('files', {
  ...tableIdandTimestamp,
  thread_id: integer('thread_id')
    .notNull()
    .references(() => thread.id),
  assistant_id: integer('assistant_id')
    .notNull()
    .references(() => assistant.id),
  name: varchar('name', { length: 255 }).notNull(),
  size: integer('size').notNull(),
  file_id: varchar('file_id', { length: 255 }).notNull(),
  url: varchar('url', { length: 255 }).notNull()
})

export default file

export type File = typeof file.$inferSelect
export type NewFile = typeof file.$inferInsert
