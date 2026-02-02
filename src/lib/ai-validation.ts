import { blink } from '../lib/blink'

export async function validateRoadDamageImage(imageUrl: string) {
  try {
    const { text } = await blink.ai.generateText({
      messages: [
        {
          role: 'system',
          content: 'You are an expert civil engineer and AI auditor for road damage. Analyze the provided image for road-related issues like potholes, cracks, or manhole problems. Respond with "VALID" if it contains genuine road damage, or "INVALID" if it is irrelevant, fake, or not related to road safety. Also provide a brief reason.'
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Validate this image for road damage.' },
            { type: 'image', image: imageUrl }
          ]
        }
      ]
    })
    
    const isValid = text.toUpperCase().includes('VALID')
    return { isValid, reason: text }
  } catch (error) {
    console.error('AI Validation error:', error)
    return { isValid: true, reason: 'AI validation temporarily unavailable' }
  }
}
