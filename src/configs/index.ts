import dotenv from 'dotenv'
import path from 'path'
import z from 'zod'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .default('5000')
    .refine(val => Number(val)),
  POSTGRES_URL: z.string().url(),
  POSTGRES_PRISMA_URL: z.string().url(),
  POSTGRES_URL_NO_SSL: z.string().url(),
  POSTGRES_URL_NON_POOLING: z.string().url(),
  POSTGRES_USER: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DATABASE: z.string(),
  DB_PREFIX: z.string(),
  BCRYPT_SALT_ROUNDS: z.string().refine(val => Number(val)),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string()
})

const envServer = envSchema.safeParse({ ...process.env })

if (!envServer.success) {
  console.error(envServer.error.issues)
  throw new Error('There is an error with the server environment variables')
}

const envVars = {
  port: envServer.data.PORT,
  env: envServer.data.NODE_ENV,
  db: {
    postgresUrl: envServer.data.POSTGRES_URL,
    postgresPrismaUrl: envServer.data.POSTGRES_PRISMA_URL,
    postgresUrlNoSsl: envServer.data.POSTGRES_URL_NO_SSL,
    postgresUrlNonPooling: envServer.data.POSTGRES_URL_NON_POOLING,
    postgresUser: envServer.data.POSTGRES_USER,
    postgresHost: envServer.data.POSTGRES_HOST,
    postgresPassword: envServer.data.POSTGRES_PASSWORD,
    postgresDatabase: envServer.data.POSTGRES_DATABASE,
    dbPrefix: envServer.data.DB_PREFIX
  },
  jwt: {
    jwtSecret: envServer.data.JWT_SECRET,
    jwtExpiresIn: envServer.data.JWT_EXPIRES_IN,
    jwtRefreshSecret: envServer.data.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: envServer.data.JWT_REFRESH_EXPIRES_IN
  },
  bcryptSaltRounds: envServer.data.BCRYPT_SALT_ROUNDS
}

export default envVars
