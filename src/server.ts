import { Server } from 'http'
import app from './app'
import envVars from './configs'
import { errorlogger, logger } from './shared/logger'

const server: Server = app.listen(envVars.port, () => {
  logger.info(`Server running on port ${envVars.port}`)
})

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed')
    })
  }
  process.exit(1)
}

const unexpectedErrorHandler = (error: unknown) => {
  errorlogger.error(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  if (server) {
    server.close()
  }
})
