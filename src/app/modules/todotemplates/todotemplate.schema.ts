import { integer, text, varchar } from 'drizzle-orm/pg-core'
import { user } from '~db/schema'
import { createTable } from '~db/utils'
import { tableIdandTimestamp } from '~utils/dbUtils'

const todoTemplate = createTable('todo_templates', {
  ...tableIdandTimestamp,
  user_id: integer('user_id')
    .notNull()
    .references(() => user.id),
  title: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  instructions: text('instructions').notNull()
})

export type TodoTemplate = typeof todoTemplate.$inferSelect
export type NewTodoTemplate = typeof todoTemplate.$inferInsert

export default todoTemplate
