import nodemailer from 'nodemailer'
import envVars from '~configs'
import ApiError from './errorHandlers/ApiError'
import httpStatus from './httpStatus'

export const sendEmail = async (
  to: string,
  emailText: string,
  subject: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      logger: true,
      debug: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: true
      }
    })

    const mailOptions = {
      from: `${envVars.name} <${envVars.ses.smtpEmail}>`,
      to,
      subject,
      text: emailText
    }

    return await transporter.sendMail(mailOptions)
  } catch {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email sending failed!')
  }
}
