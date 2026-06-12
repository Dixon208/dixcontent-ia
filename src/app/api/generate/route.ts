import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'
import { generateAIContent } from '@/lib/openrouter'

export async function POST(request: Request) {
  try {
    const { topic, niche, platform } = await request.json()

    if (!topic || !platform) {
      return NextResponse.json({ error: 'Topic and platform are required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await getSupabaseAdmin()
      .from('user_profiles')
      .select('credits, subscription_status')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    const isPro = profile.subscription_status === 'pro'

    if (!isPro && profile.credits <= 0) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 })
    }

    // Normalize platform to lowercase to match prompt keys
    const normalizedPlatform = platform.toLowerCase();
    const { caption, hashtags, post_ideas } = await generateAIContent(topic, niche, normalizedPlatform)

    if (!isPro) {
      await getSupabaseAdmin()
        .from('user_profiles')
        .update({ credits: profile.credits - 1 })
        .eq('id', user.id)
    }

    const { error: historyError } = await getSupabaseAdmin()
      .from('content_history')
      .insert({
        user_id: user.id,
        topic,
        niche,
        platform,
        caption,
        hashtags: Array.isArray(hashtags) ? hashtags.join(', ') : hashtags,
        post_ideas: Array.isArray(post_ideas) ? post_ideas.join('\n') : post_ideas,
      })

    if (historyError) {
      console.error('Error saving history:', historyError)
    }

    return NextResponse.json({ caption, hashtags, post_ideas })
  } catch (error: any) {
    console.error('Generation error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}