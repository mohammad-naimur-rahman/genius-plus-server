import { eq } from 'drizzle-orm'
import jwt, { JwtPayload } from 'jsonwebtoken'
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

  const emailVerificationLink = authUtils.generateVerificationLink<NewUser>(
    newUser,
    envVars.ses.emailVerifyRedirectUrl
  )

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
  if (!verifiedUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid verification link')
  }

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

const login = async (body: { email: string; password: string }) => {
  const { email, password } = body

  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, email)
  })
  if (!user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User doesn't exist with this email!"
    )
  }

  const validPassword = authUtils.verifyPassword(password, user.password)
  if (!validPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong password provided!')
  }

  const accessToken = authUtils.generateToken(
    { userId: user.id, role: user.role },
    'access'
  )
  const refreshToken = authUtils.generateToken({ userId: user.id }, 'refresh')

  return { user, tokens: { accessToken, refreshToken } }
}

const forgetPassword = async (body: { email: string }) => {
  const { email } = body

  const ifUserExists = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, email)
  })

  if (!ifUserExists) {
    throw new ApiError(httpStatus.CONFLICT, "User doesn't exist!")
  }

  const emailVerificationLink = authUtils.generateVerificationLink<{
    email: string
  }>({ email }, envVars.ses.forgetPasswordVerifyRedirectUrl)

  const emailText = `Hi there!

        Welcome to ${envVars.name}. You've requested to reset your account password.
        Please click the link below to verify your email:

        ${emailVerificationLink}
        
        Regards,
        The ${process.env.NAME} Team`
  const emailSubject = `Forget password? Verify your account at ${envVars.name}`
  const emailStatus = await sendEmail(body.email, emailText, emailSubject)

  const emailSent = emailStatus.accepted.find(item => {
    return item === body.email
  })

  if (!emailSent) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Error sending email!')
  }

  return emailVerificationLink
}

const forgetPasswordVerify = async (body: {
  code: string
  password: string
}) => {
  const { code } = body
  const verifiedUser = authUtils.decryptVerificationLink(code)
  if (!verifiedUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid verification link!')
  }

  const verifyToken = jwt.sign(verifiedUser, envVars.jwt.jwtSecret, {
    expiresIn: envVars.ses.verificationLinkExpiresIn
  })

  return verifyToken
}

const resetForgetPassword = async (body: {
  token: string
  password: string
}) => {
  const { token, password } = body
  const verifiedUser = jwt.verify(token, envVars.jwt.jwtSecret) as JwtPayload
  if (!verifiedUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid verification link!')
  }

  const hashedPassword = authUtils.hashPassword(password)

  const updatedUser = await db
    .update(user)
    .set({ password: hashedPassword })
    .where(eq(user.email, verifiedUser.email))
    .returning()

  const accessToken = authUtils.generateToken(
    { userId: updatedUser[0].id, role: updatedUser[0].role },
    'access'
  )
  const refreshToken = authUtils.generateToken(
    { userId: updatedUser[0].id },
    'refresh'
  )

  return { user: updatedUser[0], tokens: { accessToken, refreshToken } }
}

const resetPassword = async (
  body: {
    email: string
    password: string
    new_password: string
  },
  reqUser: JwtPayload
) => {
  const { password, new_password } = body

  if (password === new_password) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'New password and old password cannot be same!'
    )
  }

  const requestedUser = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, reqUser.userId)
  })

  if (!requestedUser) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User doesn't exist with this email!"
    )
  }

  const validPassword = authUtils.verifyPassword(
    password,
    requestedUser.password
  )
  if (!validPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong password provided!')
  }

  const hashedPassword = authUtils.hashPassword(new_password)
  const updatedUser = await db
    .update(user)
    .set({ password: hashedPassword })
    .where(eq(user.id, reqUser.userId))
    .returning()

  return updatedUser[0]
}

const generateNewAccessToken = async (body: { refreshToken: string }) => {
  const { refreshToken } = body

  const token = refreshToken?.split(' ')[1]

  if (token === 'undefined') {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized!')
  }

  const verifiedToken = authUtils.verifyToken(token)
  if (!verifiedToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid token!')
  }

  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, verifiedToken.userId)
  })
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User doesn't exist!")
  }

  const accessToken = authUtils.generateToken(
    { userId: user.id, role: user.role },
    'access'
  )

  const newRefreshToken = authUtils.generateToken(
    { userId: user.id },
    'refresh'
  )
  return { accessToken, refreshToken: newRefreshToken }
}

export const authService = {
  signup,
  signupVerify,
  login,
  forgetPassword,
  forgetPasswordVerify,
  resetForgetPassword,
  resetPassword,
  generateNewAccessToken
}
