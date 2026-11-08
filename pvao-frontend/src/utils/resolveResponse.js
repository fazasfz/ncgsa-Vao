const failedText = /error|timed out|timeout|failed|unavailable/i;
const providerFailureText = /Missing VITE_|Gemini stream failed|Groq stream failed|ReadableStream not supported|Failed to fetch|fetch failed|API key|API_KEY|HTTP.*status|network|timed out|timeout/i;

const sanitizeProviderFailureText = (text = '') => {
  if (typeof text !== 'string') return '';
  const trimmed = text.trim();
  return providerFailureText.test(trimmed) ? '' : trimmed;
};

const stripLatex = (text = '') =>
  text
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$]+\$/g, ' ')
    .replace(/\\[A-Za-z]+\{[^}]*\}/g, ' ')
    .replace(/\\[A-Za-z]+/g, ' ');

const normalizeUnit = (unit = '') =>
  unit.replace(/°/g, 'deg').replace(/µ/g, 'u').replace(/\s+/g, '').toLowerCase();

const extractValues = (text = '') => {
  const cleanText = stripLatex(text);
  const matches = cleanText.matchAll(/([-+]?\d*\.?\d+(?:e[-+]?\d+)?)\s*([A-Za-zµ°%/²³μ]+|km\/s|m\/s|m²|cm²|g\/cm³|kg|N|J|W|Hz|MHz|GHz|nm|um|AU|ly|pc|deg|K)/gi);
  return [...matches].map((match) => ({
    value: Number.parseFloat(match[1]),
    unit: normalizeUnit(match[2] || '')
  })).filter((item) => Number.isFinite(item.value) && item.unit);
};

export const resolveResponse = (geminiResult, groqResult) => {
  const gText = sanitizeProviderFailureText(typeof geminiResult === 'string' ? geminiResult : '');
  const qText = sanitizeProviderFailureText(typeof groqResult === 'string' ? groqResult : '');

  if (!gText && !qText) return '';
  if (failedText.test(gText) && !qText) return '';
  if (failedText.test(qText) && !gText) return '';
  if (failedText.test(gText)) return qText;
  if (failedText.test(qText)) return gText;
  if (!gText) return qText;
  if (!qText) return gText;

  const gValues = extractValues(gText);
  const qValues = extractValues(qText);
  let note = '';

  for (const gValue of gValues) {
    const match = qValues.find((qValue) => qValue.unit === gValue.unit);
    if (!match) continue;

    const scale = Math.max(Math.abs(gValue.value), Math.abs(match.value), 1);
    if (Math.abs(gValue.value - match.value) > scale * 0.15) {
      note = '⚠ cross-check note: Gemini and Groq disagree materially on a numeric value; verify the estimate.';
      break;
    }
  }

  return note ? `${gText}\n${note}` : gText;
};
