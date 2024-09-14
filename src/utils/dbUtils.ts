import { serial, timestamp } from 'drizzle-orm/pg-core'

export const tableIdandTimestamp = {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow()
}
