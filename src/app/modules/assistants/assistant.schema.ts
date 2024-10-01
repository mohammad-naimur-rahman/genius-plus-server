import { integer, numeric, pgEnum, text, varchar } from 'drizzle-orm/pg-core'
import { user } from '~db/schema'
import { createTable } from '~db/utils'
import { tableIdandTimestamp } from '~utils/dbUtils'

export const assistantTypeEnum = pgEnum('assistant_type', [
  'talkingBuddy',
  'tutor',
  'general',
  'notes'
])

const assistant = createTable('assistants', {
  ...tableIdandTimestamp,
  user_id: integer('user_id')
    .notNull()
    .references(() => user.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  logo: varchar('logo', { length: 255 }),
  type: assistantTypeEnum('type').notNull(),
  model: varchar('model', { length: 255 }).notNull().default('gpt-4o'),
  assistant_id: varchar('assistant_id', { length: 255 }).notNull(),
  vector_store_id: varchar('vector_store_id', { length: 255 }),
  temperature: numeric('temperature', { precision: 2, scale: 1 }).default(
    '0.5'
  ),
  top_p: numeric('top_p', { precision: 2, scale: 1 }).default('1'),
  max_completion_tokens: integer('max_completion_tokens').default(500)
})

export default assistant

export type Assistant = typeof assistant.$inferSelect
export type NewAssistant = typeof assistant.$inferInsert
