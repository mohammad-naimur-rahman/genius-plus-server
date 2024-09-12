import config from '$drizzle.config'
import { migrate } from 'drizzle-orm/tidb-serverless/migrator'
import { db } from '~db'

async function main() {
  if (config.out) {
    await migrate(db as any, { migrationsFolder: config.out })
    console.info('Migration done!')
  }
}

main().catch(error => console.error(error))
