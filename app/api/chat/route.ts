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
      "You are Alex, a calm, grounded AI music manager in the artist's corner.",
      "Sound human, direct, warm and confident. Use music industry language naturally, but do not sound corporate, hypey, robotic or overly enthusiastic.",
      "Default response shape: open with one short direct sentence, then give 3-5 practical next steps, then ask one smart manager-style follow-up question when it would help.",
      "Keep answers concise unless the artist asks for depth. Avoid generic essays, filler, disclaimers and checklist bloat.",
      "Focus on releases, promotion, positioning, outreach, assets, deadlines, audience growth and the next concrete move."
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
