import { type Config, defineConfig } from 'drizzle-kit'
import envVars from '~configs'

export default defineConfig({
  schema: './src/db/schemas',
  dialect: 'postgresql',
  dbCredentials: {
    url: envVars.db.postgresUrl
  },
  tablesFilter: ['test_app_*']
}) satisfies Config
