import { pgEnum, smallint, varchar } from 'drizzle-orm/pg-core'
import { createTable } from '~db/utils'
import { tableIdandTimestamp } from '~utils/dbUtils'

export const userRoleEnum = pgEnum('role', ['admin', 'user'])
export const signupMethodEnum = pgEnum('signup_method', ['email', 'google'])

const user = createTable('users', {
  ...tableIdandTimestamp,
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  phone_number: varchar('phone_number', { length: 255 }),
  profile_image: varchar('profile_image', { length: 255 }),
  age: smallint('age'),
  role: userRoleEnum('role').default('user'),
  signup_method: signupMethodEnum('signup_method').default('email')
})

export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert

export default user

// import { integer, text, varchar } from 'drizzle-orm/pg-core'
// import { user } from '~db/schema'
// import { createTable } from '~db/utils'
// import { tableIdandTimestamp } from '~utils/dbUtils'

// const todoTemplate = createTable('todo_templates', {
//   ...tableIdandTimestamp,
//   user_id: integer('user_id')
//     .notNull()
//     .references(() => user.id),
//   title: varchar('name', { length: 255 }).notNull(),
//   description: text('description'),
//   instructin: text('instructin').notNull()
// })

// export type TodoTemplate = typeof todoTemplate.$inferSelect
// export type NewTodoTemplate = typeof todoTemplate.$inferInsert

// export default todoTemplate
