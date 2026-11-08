const extractText = (event) => {
  const data = event
    .split(/\r?\n/)
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trim())
    .join('\n');

  if (!data || data === '[DONE]') return '';

  let payload;
  try {
    payload = JSON.parse(data);
  } catch (error) {
    throw new Error('AstroCopilot returned an invalid streaming event.', { cause: error });
  }

  return payload?.candidates
    ?.map((candidate) => candidate?.content?.parts?.map((part) => part?.text ?? '').join('') ?? '')
    .join('') ?? '';
};

export async function* streamResponse(query, systemPrompt) {
  const endpoint = import.meta.env.VITE_ASTROCOPILOT_API_URL || '/api/astrocopilot';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, systemPrompt }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AstroCopilot request failed: ${response.status} ${text}`);
  }
  if (!response.body) throw new Error('ReadableStream not supported on AstroCopilot response.');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });

    const events = buffer.split(/\r?\n\r?\n/);
    buffer = events.pop() ?? '';

    for (const event of events) {
      const text = extractText(event);
      if (text) yield text;
    }

    if (done) break;
  }

  const finalText = extractText(buffer);
  if (finalText) yield finalText;
}
