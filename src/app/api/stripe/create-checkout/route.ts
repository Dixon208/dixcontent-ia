import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe-server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = await createCheckoutSession(user.id, user.email!)

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
