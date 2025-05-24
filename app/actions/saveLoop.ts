'use server'

import { supabase } from '@/lib/supabase'

export async function saveToSupabase({
  concept,
  declaration,
}: {
  concept: string
  declaration: string
}) {
  const { data, error } = await supabase.from('memorized_loops').insert([
    {
      concept,
      declaration,
      memorized: true,
      date: new Date().toISOString(),
    },
  ])

  if (error) {
    console.error('❌ Supabase 저장 실패:', error)
    return { success: false, error }
  }

  return { success: true, data }
}
