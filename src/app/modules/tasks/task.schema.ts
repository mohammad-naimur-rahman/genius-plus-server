import {
  boolean,
  integer,
  pgEnum,
  serial,
  text,
  varchar
} from 'drizzle-orm/pg-core'
import { createTable } from '~db/utils'
import todo from '../../../db/schema/todo'

export const taskPriorityEnum = pgEnum('priority', [
  'Very Low',
  'Low',
  'Moderate',
  'High',
  'Very High'
])

const task = createTable('tasks', {
  id: serial('id').primaryKey(),
  todo_id: integer('todo_id')
    .notNull()
    .references(() => todo.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  time_ranage: varchar('time_range', { length: 255 }).notNull(),
  priority: taskPriorityEnum('priority').notNull(),
  is_complete: boolean('is_complete').default(false)
})

export default task
