import { v2 as cloudinary } from 'cloudinary'
import { and, AnyColumn, eq, ilike, SQLWrapper } from 'drizzle-orm'
import { JwtPayload } from 'jsonwebtoken'
import { db } from '~db'
import ApiError from '~utils/errorHandlers/ApiError'
import httpStatus from '~utils/httpStatus'
import { openai } from '~utils/openai'
import { getOffset, getSortOrder } from '~utils/paginationUtils'
import { ImageCreateBody } from './image.interface'
import image from './image.schema'
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

type SortOrder = 'asc' | 'desc'

export interface PaginateParams {
  sortBy: AnyColumn
  sortOrder: SortOrder
  page: number
  limit: number
  search?: string
}

const getUserImages = async (params: PaginateParams, reqUser: JwtPayload) => {
  const { sortBy, sortOrder, page, limit, search } = params
  console.log(params)

  const query: any = {
    where: and(
      ilike(image.title, `%${search || ''}%`),
      eq(image.user_id, reqUser.userId)
    ),
    limit: limit || 10,
    offset: getOffset(page, limit)
  }

  if (sortBy && (sortBy as unknown as 'string | number | symbol') in image) {
    const sortKey = image[
      sortBy as unknown as keyof typeof image
    ] as unknown as AnyColumn | SQLWrapper

    query.orderBy = [getSortOrder(sortOrder || 'desc')(sortKey)]
  }

  const userImages = await db.query.image.findMany(query)

  if (!userImages) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No images found for this user')
  }

  return userImages
}

export const imagesService = {
  generateImage,
  getUserImages
}
