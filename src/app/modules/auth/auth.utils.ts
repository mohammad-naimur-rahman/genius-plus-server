import crypto from 'crypto'
import ms from 'ms'
import envVars from '~configs'
import ApiError from '~utils/errorHandlers/ApiError'
import { NewUser } from '../users/user.schema'

const generateVerificationLink = (user: NewUser) => {
  try {
    const secretKey = crypto
      .createHash('sha256')
      .update(envVars.auth.cryptoSecret!)
      .digest('base64')
      .substr(0, 32) // Ensure 32-byte key
    const iv = crypto.randomBytes(16) // IV should be 16 bytes for aes-256-cbc
    const expirationTime = ms(envVars.ses.verificationLinkExpiresIn) // e.g., '30m' from .env
    const expirationDate = Date.now() + expirationTime // Calculate expiration timestamp

    const payload = {
      ...user,
      expiresAt: expirationDate // Add expiration time to payload
    }

    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(secretKey),
      iv
    )

    let encryptedUser = cipher.update(
      JSON.stringify(payload), // Encrypt user data with expiration
      'utf-8',
      'hex'
    )
    encryptedUser += cipher.final('hex')

    const confirmationLink = `${envVars.ses.emailVerifyRedirectUrl}${encodeURIComponent(encryptedUser)}`
    return confirmationLink
  } catch {
    throw new ApiError(400, 'Error generating verification link')
  }
}

export const authUtils = {
  generateVerificationLink
}
