import { relations } from 'drizzle-orm'
import { date, integer, serial } from 'drizzle-orm/pg-core'
import { createTable } from '~db/utils'
import task from './task'
import user from './user'

const todo = createTable('todos', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id')
    .notNull()
    .references(() => user.id),
  date: date('date', { mode: 'string' }).notNull()
})

export const todoRelations = relations(todo, ({ many }) => ({
  tasks: many(task)
}))

export default todo
