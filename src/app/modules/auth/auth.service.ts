import envVars from '~configs'
import { db } from '~db'
import { sendEmail } from '~utils/emailUtils'
import ApiError from '~utils/errorHandlers/ApiError'
import httpStatus from '~utils/httpStatus'
import user, { NewUser } from '../users/user.schema'
import { authUtils } from './auth.utils'
import { authValidation } from './auth.validaton'

const signup = async (body: NewUser) => {
  const newUser = authValidation.createUserSchema.parse(body)

  const ifUserExists = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, newUser.email)
  })

  if (ifUserExists) {
    throw new ApiError(httpStatus.CONFLICT, 'User already exists!')
  }

  const emailVerificationLink = authUtils.generateVerificationLink(newUser)

  const emailText = `Hi there!

        Welcome to ${envVars.name}. You've just signed up for a new account.
        Please click the link below to verify your email:

        ${emailVerificationLink}
        
        Regards,
        The ${process.env.NAME} Team`
  const emailSubject = `Verify your account at ${envVars.name}`
  const emailStatus = await sendEmail(body.email, emailText, emailSubject)

  const emailSent = emailStatus.accepted.find(item => {
    return item === body.email
  })

  if (!emailSent) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Error sending email')
  }

  return emailVerificationLink
}

const signupVerify = async (body: { code: string }) => {
  const { code } = body
  const verifiedUser = authUtils.decryptVerificationLink(code)
  const filteredUser = authValidation.createUserSchema.parse(verifiedUser)
  const hashedPassword = authUtils.hashPassword(filteredUser.password)
  filteredUser.password = hashedPassword

  const newUser = await db.insert(user).values(filteredUser).returning()
  const accessToken = authUtils.generateToken(
    { userId: newUser[0].id, role: newUser[0].role },
    'access'
  )

  const refreshToken = authUtils.generateToken(
    { userId: newUser[0].id },
    'refresh'
  )
  return { user: newUser[0], tokens: { accessToken, refreshToken } }
}

export const authService = {
  signup,
  signupVerify
}
