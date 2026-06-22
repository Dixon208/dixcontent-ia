import { PLATFORM_PROMPTS } from './prompts'
import { Platform } from './types'

export async function generateAIContent(topic: string, niche: string | undefined, platform: string) {
  const promptConfig = PLATFORM_PROMPTS[platform as Platform] || PLATFORM_PROMPTS.instagram
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'DixContent AI',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4.5',
      messages: [
        { role: 'system', content: promptConfig.system },
        { role: 'user', content: promptConfig.user(topic, niche) },
      ],
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('OpenRouter error:', errorData)
    throw new Error('Failed to generate content')
  }

  const aiData = await response.json()
  const rawContent = aiData.choices[0].message.content
  
  try {
    return JSON.parse(rawContent)
  } catch (e) {
    console.error('Failed to parse AI content as JSON:', rawContent)
    throw new Error('Invalid response from AI')
  }
}
