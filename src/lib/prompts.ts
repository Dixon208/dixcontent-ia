export const PLATFORM_PROMPTS = {
  instagram: {
    system: "You are a social media expert specializing in Instagram. Generate engaging, visual-centric captions and hashtags.",
    user: (topic: string, niche?: string) => `Generate Instagram content for:
Topic: ${topic}
${niche ? `Niche: ${niche}` : ""}

Please provide the following in a JSON object with exactly these keys:
{
  "caption": "a string containing 3 catchy caption options",
  "hashtags": ["array", "of", "15-20", "relevant", "hashtags"],
  "post_ideas": ["array", "of", "3-5", "post", "ideas"]
}`
  },
  tiktok: {
    system: "You are a TikTok content strategist. Generate short, trendy, and high-energy captions.",
    user: (topic: string, niche?: string) => `Generate TikTok content for:
Topic: ${topic}
${niche ? `Niche: ${niche}` : ""}

Please provide the following in a JSON object with exactly these keys:
{
  "caption": "a string containing 3 short, trendy caption options",
  "hashtags": ["array", "of", "15-20", "trending", "hashtags"],
  "post_ideas": ["array", "of", "3-5", "viral", "post", "ideas", "or", "hooks"]
}`
  },
  facebook: {
    system: "You are a Facebook community manager. Generate conversational and community-focused captions.",
    user: (topic: string, niche?: string) => `Generate Facebook content for:
Topic: ${topic}
${niche ? `Niche: ${niche}` : ""}

Please provide the following in a JSON object with exactly these keys:
{
  "caption": "a string containing 3 conversational caption options that encourage comments",
  "hashtags": ["array", "of", "10-15", "relevant", "hashtags"],
  "post_ideas": ["array", "of", "3-5", "post", "ideas", "for", "community", "engagement"]
}`
  },
  twitter: {
    system: "You are a Twitter/X growth expert. Generate concise, punchy, and shareable tweets.",
    user: (topic: string, niche?: string) => `Generate Twitter/X content for:
Topic: ${topic}
${niche ? `Niche: ${niche}` : ""}

Please provide the following in a JSON object with exactly these keys:
{
  "caption": "a string containing 3 concise, punchy tweet options (under 280 chars each)",
  "hashtags": ["array", "of", "5-10", "relevant", "hashtags"],
  "post_ideas": ["array", "of", "3-5", "thread", "or", "post", "ideas"]
}`
  },
  linkedin: {
    system: "You are a LinkedIn personal branding expert. Generate professional yet engaging thought-leadership captions.",
    user: (topic: string, niche?: string) => `Generate LinkedIn content for:
Topic: ${topic}
${niche ? `Niche: ${niche}` : ""}

Please provide the following in a JSON object with exactly these keys:
{
  "caption": "a string containing 3 professional, value-driven caption options",
  "hashtags": ["array", "of", "5-10", "relevant", "hashtags"],
  "post_ideas": ["array", "of", "3-5", "educational", "post", "ideas"]
}`
  }
}
