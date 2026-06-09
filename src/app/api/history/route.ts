import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 10
    const offset = (page - 1) * limit

    const supabase = await createClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get content history
    const { data, error, count } = await supabase
      .from('content_history')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching history:', error)
      return NextResponse.json({ error: 'Error fetching history' }, { status: 500 })
    }

    return NextResponse.json({
      data,
      total: count,
      page,
      totalPages: count ? Math.ceil(count / limit) : 0
    })

  } catch (error) {
    console.error('History fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
