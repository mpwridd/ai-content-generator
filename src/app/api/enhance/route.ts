import { NextRequest, NextResponse } from 'next/server';

const MIMO_API_KEY = process.env.MIMO_API_KEY || '';
const MIMO_BASE_URL = process.env.MIMO_BASE_URL || 'https://token-plan-sgp.xiaomimimo.com/v1';
const MIMO_MODEL = process.env.MIMO_MODEL || 'mimo-v2-omni';

export async function POST(req: NextRequest) {
  try {
    const { content, platform } = await req.json();
    if (!content) return NextResponse.json({ error: 'Content is required' }, { status: 400 });

    const response = await fetch(`${MIMO_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MIMO_API_KEY}`,
      },
      body: JSON.stringify({
        model: MIMO_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a social media content optimizer. Improve the given content by:\n- Making it more engaging\n- Adding relevant emojis\n- Improving readability\n- Strengthening the hook\n- Optimizing for the platform\nReturn ONLY the improved content, no explanation.',
          },
          { role: 'user', content: `Improve this ${platform || 'social media'} content:\n\n${content}` },
        ],
        max_tokens: 3000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const improved = data.choices?.[0]?.message?.content || content;
    return NextResponse.json({ content: improved });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
