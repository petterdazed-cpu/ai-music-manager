import { NextRequest } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY missing' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await req.json();
    const message = body.message;

    const systemPrompt = [
      "You are Alex, a premium artist manager with real industry instincts, advising the artist directly.",
      "You are calm, strategic, emotionally intelligent, honest, supportive and direct. You sound like a human manager who understands creative pressure, timing, positioning and leverage.",
      "Write in a grounded conversational voice, like a trusted manager texting or sitting across from the artist. Be concise, confident and warm without sounding corporate or hypey.",
      "Use music industry language naturally: release timing, rollout, positioning, press angle, playlist fit, sync brief, booking, audience signal, assets, metadata, outreach, deadlines and follow-up.",
      "Never say or imply you are an AI. Never use assistant clichés like 'Certainly', 'As an AI assistant', 'I recommend that you', 'Here is a detailed strategy', or generic motivational filler.",
      "Default response format: one short opening line, then 3-5 practical next steps, then one smart manager follow-up question when useful.",
      "Be willing to give honest calls: tell the artist when not to release yet, when a plan is too thin, or when the next move is obvious. Keep it respectful and in their corner.",
      "Keep responses tight unless the artist asks for depth. Strong tone examples: 'Alright. First thing: don’t release this yet.' 'This is fixable.' 'If I were managing this campaign, here’s where I’d focus.'"
    ].join(" ");

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    // allow callers to request a non-streaming JSON response by sending { stream: false }
    if (body.stream === false) {
      const nonStreamRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          stream: false,
          max_tokens: 512,
          temperature: 0.2,
        }),
      });

      if (!nonStreamRes.ok) {
        const text = await nonStreamRes.text();
        console.error('OpenAI API error', text);
        return new Response(JSON.stringify({ error: 'OpenAI error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }

      const json = await nonStreamRes.json();
      const reply = json?.choices?.[0]?.message?.content || json?.choices?.[0]?.text || null;
      return new Response(JSON.stringify({ reply }), { headers: { 'Content-Type': 'application/json' } });
    }

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        stream: true,
        max_tokens: 512,
        temperature: 0.2,
      }),
    });

    if (!openaiRes.ok || !openaiRes.body) {
      const text = await openaiRes.text();
      console.error('OpenAI API error', text);
      return new Response(JSON.stringify({ error: 'OpenAI error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = openaiRes.body!.getReader();
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            // forward raw chunk to client
            controller.enqueue(new TextEncoder().encode(chunk));
          }
        } catch (err) {
          console.error('Streaming error:', err);
          controller.error(err);
        } finally {
          controller.close();
          try { reader.releaseLock(); } catch {}
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      }
    });
  } catch (error) {
    console.error('AIM chat API error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
