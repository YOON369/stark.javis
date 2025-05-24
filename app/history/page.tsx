'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Loop {
  id: string
  concept: string
  declaration: string
  date: string
}

export default function HistoryPage() {
  const [groupedLoops, setGroupedLoops] = useState<Record<string, Loop[]>>({})
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({})
  const [expandedDeclarations, setExpandedDeclarations] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchLoops()
  }, [])

  const fetchLoops = async () => {
    const { data, error } = await supabase
      .from('memorized_loops')
      .select('id, concept, declaration, date')
      .order('date', { ascending: false })

    if (error) {
      console.error('❌ Supabase fetch 실패:', error)
      return
    }

    const grouped = data!.reduce((acc: Record<string, Loop[]>, loop: Loop) => {
      const dateKey = new Date(loop.date).toLocaleDateString('ko-KR')
      acc[dateKey] = acc[dateKey] || []
      acc[dateKey].push(loop)
      return acc
    }, {})

    setGroupedLoops(grouped)
  }

  const toggleExpandDate = (date: string) => {
    setExpandedDates(prev => ({ ...prev, [date]: !prev[date] }))
  }

  const toggleExpandDeclaration = (key: string) => {
    setExpandedDeclarations(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const deleteLoop = async (id: string) => {
    const { error } = await supabase.from('memorized_loops').delete().eq('id', id)
    if (error) {
      console.error('❌ 삭제 실패:', error)
      return
    }
    fetchLoops()
  }

  return (
    <main className="min-h-screen bg-[#0e0e0e] text-[#e0e0e0] p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📜 히스토리 보기</h1>

      {Object.entries(groupedLoops).map(([date, items]) => {
        const isDateExpanded = expandedDates[date] || false
        const itemsToShow = isDateExpanded ? items : items.slice(0, 2)

        return (
          <div key={date} className="mb-8">
            <h2 className="text-lg font-bold text-[#9bd] mb-3">📅 {date}</h2>
            {itemsToShow.map((loop, i) => {
              const key = `${date}-${i}`
              const isTextExpanded = expandedDeclarations[key] || false
              const shortText = loop.declaration.slice(0, 100)
              const isLong = loop.declaration.length > 100

              return (
                <div key={loop.id} className="mb-3 p-4 bg-[#1a1a1a] rounded-lg">
                  <div className="text-sm text-[#888] mb-1">🧠 {loop.concept}</div>
                  <div className="text-[#eee]">
                    {isTextExpanded || !isLong ? loop.declaration : shortText + '...'}
                    {isLong && (
                      <button
                        onClick={() => toggleExpandDeclaration(key)}
                        className="ml-2 text-blue-400 hover:underline text-sm"
                      >
                        {isTextExpanded ? '간략히' : '더 보기'}
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => deleteLoop(loop.id)}
                    className="mt-2 text-red-400 hover:underline text-sm"
                  >
                    삭제하기 🗑
                  </button>
                </div>
              )
            })}
            {items.length > 2 && (
              <button
                onClick={() => toggleExpandDate(date)}
                className="text-sm text-blue-400 hover:underline"
              >
                {isDateExpanded ? '간략히 보기 ▲' : `...더 보기 (${items.length - 2}개)`}
              </button>
            )}
          </div>
        )
      })}
    </main>
  )
}
