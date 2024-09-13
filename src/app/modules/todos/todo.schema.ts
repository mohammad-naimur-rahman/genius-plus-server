import {
  boolean,
  date,
  integer,
  pgEnum,
  serial,
  text,
  varchar
} from 'drizzle-orm/pg-core'
import user from '~app/modules/users/user.schema'
import { createTable } from '~db/utils'

export const todoPriorityEnum = pgEnum('priority', [
  'Very Low',
  'Low',
  'Moderate',
  'High',
  'Very High'
])

const todo = createTable('todos', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id')
    .notNull()
    .references(() => user.id),
  date: date('date', { mode: 'string' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  time_range: varchar('time_range', { length: 255 }).notNull(),
  priority: todoPriorityEnum('priority').notNull(),
  is_complete: boolean('is_complete').default(false)
})

export type Todo = typeof todo.$inferSelect
export type NewTodo = typeof todo.$inferInsert

export default todo
