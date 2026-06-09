import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const supabase = await createClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete the history item
    // RLS policy "Users can delete their own content history" handles the ownership check
    const { error } = await supabase
      .from('content_history')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // Extra safety although RLS should handle it

    if (error) {
      console.error('Error deleting history item:', error)
      return NextResponse.json({ error: 'Error deleting item' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete history error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
