const GEMINI_MODEL = 'gemini-3.8-flash';
const MAX_QUERY_LENGTH = 12000;
const MAX_SYSTEM_PROMPT_LENGTH = 4000;

const sendJson = (response, status, payload) => {
  response.status(status);
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(payload));
};

const parseRequestBody = (body) => {
  if (typeof body !== 'string') return body;

  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    sendJson(response, 405, { error: 'Method not allowed.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    sendJson(response, 503, { error: 'AstroCopilot is not configured.' });
    return;
  }

  const body = parseRequestBody(request.body);
  const query = typeof body?.query === 'string' ? body.query.trim() : '';
  const systemPrompt = typeof body?.systemPrompt === 'string' ? body.systemPrompt.trim() : '';

  if (!query || query.length > MAX_QUERY_LENGTH) {
    sendJson(response, 400, { error: `Query must be between 1 and ${MAX_QUERY_LENGTH} characters.` });
    return;
  }

  if (systemPrompt.length > MAX_SYSTEM_PROMPT_LENGTH) {
    sendJson(response, 400, { error: 'System prompt is too long.' });
    return;
  }

  let upstream;
  try {
    upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: query }] }],
          ...(systemPrompt ? { systemInstruction: { parts: [{ text: systemPrompt }] } } : {}),
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      },
    );
  } catch (error) {
    console.error('AstroCopilot could not reach Gemini:', error);
    sendJson(response, 502, { error: 'AstroCopilot could not reach its AI provider.' });
    return;
  }

  if (!upstream.ok) {
    const detail = await upstream.text();
    console.error(`AstroCopilot Gemini request failed (${upstream.status}):`, detail);
    sendJson(response, upstream.status, { error: 'The AI provider rejected the request.' });
    return;
  }

  if (!upstream.body) {
    console.error('AstroCopilot Gemini response did not include a stream.');
    sendJson(response, 502, { error: 'The AI provider did not return a response stream.' });
    return;
  }

  response.status(200);
  response.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  response.setHeader('Cache-Control', 'no-cache, no-transform');
  response.setHeader('Connection', 'keep-alive');
  response.setHeader('X-Accel-Buffering', 'no');

  try {
    for await (const chunk of upstream.body) {
      if (!response.write(chunk)) {
        await new Promise((resolve) => response.once('drain', resolve));
      }
    }
    response.end();
  } catch (error) {
    if (!response.destroyed) {
      console.error('AstroCopilot stream failed:', error);
      response.end();
    }
  }
}
