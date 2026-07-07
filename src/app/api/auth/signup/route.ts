import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })

    if (authError) {
  console.error('Auth signup error:', authError)
  return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Signup failed' }, { status: 400 })
    }

    const { error: profileError } = await getSupabaseAdmin()
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        name: name,
        credits: 5,
        subscription_status: 'free',
      })

    if (profileError) {
      console.error('Error creating user profile:', profileError)
      return NextResponse.json({ error: 'Error creating user profile' }, { status: 500 })
    }

    return NextResponse.json({
      user: { id: authData.user.id, email: authData.user.email, name: name },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
