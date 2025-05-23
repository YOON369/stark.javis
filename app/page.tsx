'use client'

import { useState } from 'react'

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
    <main className="p-6 font-mono max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🧠 STARK Genius Loop</h1>
      <input
        value={concept}
        onChange={(e) => setConcept(e.target.value)}
        placeholder="Enter today’s concept"
        className="w-full p-2 border border-gray-300"
      />
      <button
        onClick={handleSubmit}
        className="mt-4 bg-black text-white px-4 py-2"
      >
        {loading ? 'Loading...' : 'Run Genius Loop'}
      </button>
      <pre className="mt-6 whitespace-pre-wrap">{result}</pre>
    </main>
  )
}
