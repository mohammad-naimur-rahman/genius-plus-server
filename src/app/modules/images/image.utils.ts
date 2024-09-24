import axios from 'axios'
import { ImageGenParams } from './image.interface'

export function buildImageGenPrompt(params: ImageGenParams): string {
  const {
    style,
    color_scheme,
    perspective,
    lighting,
    mood,
    background_type,
    texture,
    subject_type,
    environment,
    movement,
    style_intensity
  } = params || {}

  let finalPrompt = ''

  if (style) finalPrompt += ` in a ${style} style`
  if (color_scheme) finalPrompt += ` with ${color_scheme} colors`
  if (perspective) finalPrompt += ` from a ${perspective}`
  if (lighting) finalPrompt += ` with ${lighting} lighting`
  if (mood) finalPrompt += ` creating a ${mood} mood`
  if (background_type) finalPrompt += ` with a ${background_type} background`
  if (texture) finalPrompt += ` having a ${texture} texture`
  if (subject_type) finalPrompt += ` featuring a ${subject_type}`
  if (environment) finalPrompt += ` set in a ${environment}`
  if (movement) finalPrompt += ` showing ${movement}`
  if (style_intensity)
    finalPrompt += ` with a ${style_intensity} influence on the style`

  return finalPrompt.trim()
}

export const getImageSize = (aspect: 'square' | 'portrait' | 'landscape') => {
  if (aspect === 'square') return '1024x1024'
  if (aspect === 'portrait') return '1024x1792'
  if (aspect === 'landscape') return '1792x1024'
}

export const downloadImageFromURL = async (url: string) => {
  const response = await axios.get(url, { responseType: 'stream' })
  return response.data
}
