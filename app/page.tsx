'use client'

import { useState } from 'react'
import { saveToSupabase } from './actions/saveLoop' // ✅ 상대 경로 확인 필요

export default function Home() {
  const [concept, setConcept] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    const res = await fetch('/api/genius-loop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ concept }),
    })
    const data = await res.json()
    setResult(data.result)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#0e0e0e] text-[#e0e0e0] p-6 font-mono max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧠 STARK Genius Loop</h1>

      <input
        value={concept}
        onChange={(e) => setConcept(e.target.value)}
        placeholder="Enter today’s concept"
        className="w-full p-3 text-lg bg-[#1a1a1a] text-[#f0f0f0] border border-[#444] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#555]"
      />

      <button
        onClick={handleSubmit}
        className="mt-4 bg-[#333] hover:bg-[#444] text-white px-5 py-2 rounded-lg transition duration-150"
      >
        {loading ? 'Loading...' : 'Run Genius Loop'}
      </button>

      <pre className="mt-6 whitespace-pre-wrap bg-[#1a1a1a] p-4 rounded-lg text-[#dcdcdc] leading-relaxed">
        {result}
      </pre>

      {/* ✅ Supabase 저장 버튼 */}
      <button
        onClick={async () => {
          const res = await saveToSupabase({ concept, declaration: result })
          if (res.success) {
            alert('✅ Supabase에 저장 완료!')
          } else {
            alert('❌ 저장 실패: ' + res.error?.message)
          }
        }}
        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-150"
      >
        Supabase에 저장하기
      </button>
    </main>
  )
}
