import { JwtPayload } from 'jsonwebtoken'
import { openai } from '~utils/openai'
import { ImageCreateBody } from './image.interface'
import { buildImageGenPrompt, getImageSize } from './image.utils'

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

  console.log(generatedImage.data[0].url)

  return {
    id: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_id: reqUser.userId,
    title,
    prompt,
    url: generatedImage.data[0].url,
    aspect
  }
}

export const imagesService = {
  generateImage
}
