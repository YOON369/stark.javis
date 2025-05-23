import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { concept } = await req.json()

  const prompt = `
Concept: ${concept}
Explain from 8 genius views:
1. Math (Ramanujan)
2. Physics (Einstein)
3. Chemistry (Faraday)
4. Engineering (Tesla)
5. Programming (Turing)
6. Art (Kramarik)
7. Logic (Sherlock Holmes)
8. Philosophy (Wittgenstein)
Then summarize and write one English declaration.
  `

  const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await gptRes.json()
  return NextResponse.json({ result: data.choices[0].message.content })
}
