import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import globalErrorHandler from '~app/middlewares/globalErrorHandler'
import requestLogger from '~app/middlewares/requestLogger'
import { db } from '~db'
import { category, comment, post, user } from '~db/schemas'
import httpStatus from '~utils/httpStatus'

const app: Application = express()

app.use(cors())
app.use(cookieParser())
app.use(requestLogger)

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/user', async (req, res) => {
  const newUser = await db
    .insert(user)
    .values(req.body)
    .returning({ id: user.id })
  res.status(200).send({ data: newUser })
})

app.get('/user', async (req, res) => {
  const users = await db.query.user.findMany()
  res.status(200).send({ data: users })
})

app.post('/post', async (req, res) => {
  const newPost = await db.insert(post).values(req.body)
  res.status(200).send({ data: newPost })
})

app.get('/post', async (req, res) => {
  const posts = await await db.query.post.findMany({
    with: { user: true, category: true, tags: true }
  })
  res.status(200).send({ data: posts })
})

app.post('/comment', async (req, res) => {
  const newComment = await db.insert(comment).values(req.body)
  res.status(200).send({ data: newComment })
})

app.get('/comment', async (req, res) => {
  const comments = await db.select().from(comment)
  res.status(200).send({ data: comments })
})

app.post('/category', async (req, res) => {
  const newCategory = await db.insert(category).values(req.body)
  res.status(200).send({ data: newCategory })
})

app.get('/category', async (req, res) => {
  const categories = await db.select().from(category)
  res.status(200).send({ data: categories })
})

//global error handler
app.use(globalErrorHandler)

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Route Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Route Not Available'
      }
    ]
  })
  next()
})

export default app
