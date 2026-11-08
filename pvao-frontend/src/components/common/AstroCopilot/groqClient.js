export async function* streamResponse(query, systemPrompt) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error('Missing VITE_GROQ_API_KEY');

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: query }
      ],
      temperature: 0.7,
      stream: true
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq stream failed: ${response.status} ${text}`);
  }
  if (!response.body) throw new Error('ReadableStream not supported on response body.');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    for (const line of buffer.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === '[DONE]') return;

      try {
        const json = JSON.parse(payload);
        const text = json.choices?.[0]?.delta?.content;
        if (text) yield text;
      } catch {
        // Ignore partial or malformed stream frames.
      }
    }
    buffer = '';
  }

  if (buffer.trim()) {
    const trimmed = buffer.trim();
    if (trimmed.startsWith('data:')) {
      const payload = trimmed.slice(5).trim();
      if (payload !== '[DONE]') {
        try {
          const json = JSON.parse(payload);
          const text = json.choices?.[0]?.delta?.content;
          if (text) yield text;
        } catch {}
      }
    }
  }
}
