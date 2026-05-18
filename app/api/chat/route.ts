import { NextRequest } from "next/server";
import { buildAlexSystemPrompt } from "@/lib/alex/promptBuilder";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY missing' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await req.json();
    const message = body.message;
    const systemPrompt = buildAlexSystemPrompt({
      userMessage: message,
      managerSettings: body.managerSettings,
    });

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
