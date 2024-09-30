import { integer, pgEnum, text, varchar } from 'drizzle-orm/pg-core'
import { user } from '~db/schema'
import { createTable } from '~db/utils'
import { tableIdandTimestamp } from '~utils/dbUtils'

export const assistantTypeEnum = pgEnum('assistant_type', [
  'talkingBuddy',
  'tutor',
  'general'
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
  temperature: integer('temperature').notNull().default(0.5),
  top_p: integer('top_p').notNull().default(1),
  frequency_penalty: integer('frequency_penalty').notNull().default(0),
  presence_penalty: integer('presence_penalty').notNull().default(0),
  max_completion_tokens: integer('max_completion_tokens').notNull()
})

export default assistant

export type Assistant = typeof assistant.$inferSelect
export type NewAssistant = typeof assistant.$inferInsert
