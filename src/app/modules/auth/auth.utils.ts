import crypto from 'crypto'
import jwt, { JwtPayload } from 'jsonwebtoken'
import ms from 'ms'
import envVars from '~configs'

const algorithm = 'aes-256-cbc'
const key = crypto
  .createHash('sha256')
  .update(envVars.auth.cryptoSecret!)
  .digest()
const ivLength = 16

const generateVerificationLink = <T>(data: T, redirectURL: string) => {
  const iv = crypto.randomBytes(ivLength)
  const expirationTime = ms(envVars.ses.verificationLinkExpiresIn)
  const expires_at = Date.now() + expirationTime
  const payload = { ...data, expires_at }
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const encryptedData = iv.toString('hex') + ':' + encrypted
  const confirmationLink = `${redirectURL}${encodeURIComponent(encryptedData)}`
  return confirmationLink
}

const decryptVerificationLink = (encryptedData: string) => {
  try {
    const [ivHex, encrypted] = decodeURIComponent(encryptedData).split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    const payload = JSON.parse(decrypted)
    if (Date.now() > payload.expires_at) {
      throw new Error('Verification link has expired!')
    }
    return payload
  } catch (error) {
    console.error('Error decrypting or parsing the verification link:', error)
    throw new Error('Invalid verification link')
  }
}

const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex')
  return `${salt}:${hash}`
}

const verifyPassword = (password: string, storedHash: string) => {
  const [salt, originalHash] = storedHash.split(':')
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex')
  return originalHash === hashVerify
}

const generateToken = (
  payload: Record<string, unknown>,
  type: 'access' | 'refresh'
) => {
  const token = jwt.sign(payload, envVars.jwt.jwtSecret, {
    expiresIn:
      type === 'access'
        ? envVars.jwt.jwtAccessExpiresIn
        : envVars.jwt.jwtRefreshExpiresIn
  })
  return token
}

const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, envVars.jwt.jwtSecret) as JwtPayload
}

export const authUtils = {
  generateVerificationLink,
  decryptVerificationLink,
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken
}
