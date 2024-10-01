import OpenAI from 'openai'
import envVars from '~configs'

export const openai = new OpenAI({
  apiKey: envVars.openaiApiKey
})
