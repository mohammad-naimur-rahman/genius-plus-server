import {
  boolean,
  pgEnum,
  serial,
  smallint,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core'
import { createTable } from '~db/utils'

export const userRoleEnum = pgEnum('role', ['admin', 'user'])

const user = createTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  phone_number: varchar('phone_number', { length: 255 }),
  profile_image: varchar('profile_image', { length: 255 }),
  age: smallint('age'),
  role: userRoleEnum('role').default('user'),
  is_verified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow()
})

export default user
