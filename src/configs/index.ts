import dotenv from 'dotenv'
import path from 'path'
import z from 'zod'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const envSchema = z.object({
  NAME: z.string(),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .default('5000')
    .refine(val => Number(val)),
  CLIENT_URL: z.string().url(),
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
  JWT_ACCESS_EXPIRES_IN: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),
  CRYPTO_SECRET: z.string(),
  EMAIL_VERIFY_REDIRECT_URL: z.string().url(),
  FORGET_PASSWORD_VERIFY_REDIRECT_URL: z.string().url(),
  SMTP_EMAIL: z.string().email(),
  SMTP_PASSWORD: z.string(),
  SMTP_HOST: z.string(),
  VERIFICATION_LINK_EXPIRES_IN: z.string()
})

const envServer = envSchema.safeParse({ ...process.env })

if (!envServer.success) {
  console.error(envServer.error.issues)
  throw new Error('There is an error with the server environment variables')
}

const envVars = {
  name: envServer.data.NAME,
  port: envServer.data.PORT,
  env: envServer.data.NODE_ENV,
  clientUrl: envServer.data.CLIENT_URL,
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
    jwtAccessExpiresIn: envServer.data.JWT_ACCESS_EXPIRES_IN,
    jwtRefreshExpiresIn: envServer.data.JWT_REFRESH_EXPIRES_IN
  },
  auth: {
    bcryptSaltRounds: envServer.data.BCRYPT_SALT_ROUNDS,
    cryptoSecret: process.env.CRYPTO_SECRET
  },
  ses: {
    emailVerifyRedirectUrl: envServer.data.EMAIL_VERIFY_REDIRECT_URL,
    forgetPasswordVerifyRedirectUrl:
      envServer.data.FORGET_PASSWORD_VERIFY_REDIRECT_URL,
    smtpEmail: envServer.data.SMTP_EMAIL,
    smtpPassword: envServer.data.SMTP_PASSWORD,
    smtpHost: envServer.data.SMTP_HOST,
    verificationLinkExpiresIn: envServer.data.VERIFICATION_LINK_EXPIRES_IN
  }
}

export default envVars
