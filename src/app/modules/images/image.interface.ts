export interface ImageGenParams {
  style?: string
  color_scheme?: string
  perspective?: string
  lighting?: string
  mood?: string
  background_type?: string
  texture?: string
  subject_type?: string
  environment?: string
  movement?: string
  style_intensity?: string
}

export interface ImageCreateBody {
  title: string
  prompt: string
  full_control: boolean
  aspect: 'square' | 'portrait' | 'landscape'
  promptParams: ImageGenParams
  style: 'natural' | 'vivid'
}
