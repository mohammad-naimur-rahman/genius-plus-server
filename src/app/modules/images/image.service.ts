import { v2 as cloudinary } from 'cloudinary'
import { and, eq, ilike } from 'drizzle-orm'
import { JwtPayload } from 'jsonwebtoken'
import { db } from '~db'
import { DBQuery, PaginateParams } from '~types/common'
import ApiError from '~utils/errorHandlers/ApiError'
import httpStatus from '~utils/httpStatus'
import { openai } from '~utils/openai'
import {
  getTotalCount,
  setQuerySortingNPagination
} from '~utils/paginationUtils'
import { ImageCreateBody } from './image.interface'
import image, { Image } from './image.schema'
import { buildImageGenPrompt, getImageSize } from './image.utils'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

const generateImage = async (body: ImageCreateBody, reqUser: JwtPayload) => {
  const { prompt, aspect, full_control, promptParams, style, title } = {
    ...body
  }

  let imagePrompt = prompt
  if (!full_control) {
    imagePrompt += buildImageGenPrompt(promptParams)
  }

  const size = getImageSize(aspect)

  const generatedImage = await openai.images.generate({
    prompt: imagePrompt,
    model: 'dall-e-3',
    n: 1,
    size,
    style,
    quality: 'hd',
    response_format: 'url'
  })

  if (!generatedImage.data[0].url) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Image generation failed'
    )
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    generatedImage.data[0].url,
    {
      folder: 'generated_images',
      access_mode: 'public'
    }
  )

  if (!cloudinaryResponse.secure_url) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Image upload failed')
  }

  const insertedImage = await db
    .insert(image)
    .values({
      user_id: reqUser.userId,
      title,
      prompt,
      url: cloudinaryResponse.secure_url,
      aspect
    })
    .returning()

  return insertedImage[0]
}

const getUserImages = async (params: PaginateParams, reqUser: JwtPayload) => {
  const { page, limit, search } = params

  const findQuery = and(
    ilike(image.title, `%${search || ''}%`),
    eq(image.user_id, reqUser.userId)
  )

  const query: DBQuery = { where: findQuery }
  setQuerySortingNPagination(query, params, image)

  const userImages = await db.query.image.findMany(query)
  const total = await getTotalCount(image, findQuery)

  return { userImages, meta: { page, limit, total } }
}

const getImage = async (id: number, reqUser: JwtPayload) => {
  const singleImage = await db.query.image.findFirst({
    where: and(eq(image.id, id), eq(image.user_id, reqUser.userId))
  })

  if (!singleImage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Image not found')
  }

  return singleImage
}

const updateImage = async (
  id: number,
  data: Partial<Image>,
  reqUser: JwtPayload
) => {
  const updatedImage = await db
    .update(image)
    .set(data)
    .where(and(eq(image.id, id), eq(image.user_id, reqUser.userId)))
    .returning()

  if (!updatedImage[0]) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Image not found or update failed')
  }

  return updatedImage[0]
}

const deleteImage = async (id: number, reqUser: JwtPayload) => {
  const deletedImage = await db
    .delete(image)
    .where(and(eq(image.id, id), eq(image.user_id, reqUser.userId)))
    .returning()

  if (!deletedImage[0]) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Image not found or delete failed')
  }

  return null
}

export const imagesService = {
  generateImage,
  getUserImages,
  getImage,
  updateImage,
  deleteImage
}
