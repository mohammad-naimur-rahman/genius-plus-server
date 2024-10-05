import { Server } from 'http'
import app from './app'
import envVars from './configs'
import { errorlogger, logger } from './shared/logger'

const server: Server = app.listen(envVars.port, () => {
  // Disabling logger for production
  if (envVars.env === 'production')
    console.info(`Server running on port ${envVars.port}`)
  else logger.info(`Server running on port ${envVars.port}`)
})

const exitHandler = () => {
  if (server) {
    server.close(() => {
      if (envVars.env === 'production') console.info('Server closed')
      else logger.info('Server closed')
    })
  }
  process.exit(1)
}

const unexpectedErrorHandler = (error: unknown) => {
  if (envVars.env === 'production') console.error(error)
  else errorlogger.error(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  if (envVars.env === 'production') console.info('SIGTERM received')
  else logger.info('SIGTERM received')
  if (server) {
    server.close()
  }
})
