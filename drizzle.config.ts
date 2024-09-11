import { type Config, defineConfig } from 'drizzle-kit'
import envVars from '~configs'

export default defineConfig({
  schema: './src/db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: envVars.db.postgresUrl
  },
  tablesFilter: ['genius_plus*']
}) satisfies Config
