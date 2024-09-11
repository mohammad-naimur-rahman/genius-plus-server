import chalk from 'chalk'
import { NextFunction, Request, Response } from 'express'

// Middleware to log request details with colors
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime() // Start time
  const requestTime = new Date().toLocaleString() // Current date and time

  res.on('finish', () => {
    const end = process.hrtime(start) // End time
    const elapsedTime = (end[0] * 1000 + end[1] / 1e6).toFixed(2) // Convert to milliseconds
    const statusCode = res.statusCode
    const method = req.method
    const route = req.originalUrl

    // Set status code color based on range
    let statusColor = chalk.white // Default color
    if (statusCode >= 200 && statusCode < 300) {
      statusColor = chalk.green // Success
    } else if (statusCode >= 300 && statusCode < 400) {
      statusColor = chalk.yellow // Redirection
    } else if (statusCode >= 400 && statusCode < 500) {
      statusColor = chalk.red // Client error
    } else if (statusCode >= 500) {
      statusColor = chalk.bgRed.white // Server error
    }

    // Log the details in a colorful format
    console.log(
      `${chalk.blueBright(`[${requestTime}]`)} | ${chalk.cyan.bold(method)} ${chalk.magenta(route)} ${statusColor(statusCode)} | ${chalk.yellow(elapsedTime + ' ms')}`
    )
  })
  next() // Pass to the next middleware or route handler
}

export default requestLogger
