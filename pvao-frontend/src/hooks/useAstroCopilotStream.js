import { useCallback, useEffect, useState } from 'react';
import { streamResponse as streamAstroCopilotResponse } from '../components/common/AstroCopilot/astroCopilotClient';
// TODO: re-enable Groq once API key is available
// import { streamResponse as streamGroqResponse } from '../components/common/AstroCopilot/groqClient';
import { ASTROCOPILOT_SYSTEM_PROMPT } from '../utils/constants';
import { resolveResponse } from '../utils/resolveResponse';

const isPlaceholderPrompt = (prompt) => !prompt || prompt.trim() === '' || /You are Astro[- ]?Copilot/i.test(prompt);
const GENERIC_ASTROCOPILOT_ERROR = 'AstroCopilot is temporarily unavailable — please try again.';

export const useAstroCopilotStream = (query, systemPrompt, resolve = resolveResponse) => {
  const promptText = isPlaceholderPrompt(systemPrompt) ? ASTROCOPILOT_SYSTEM_PROMPT : systemPrompt;

  const [status, setStatus] = useState('idle');
  const [streamedText, setStreamedText] = useState('');
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    const trimmedQuery = query?.trim();
    if (!trimmedQuery) {
      setStatus('idle');
      setStreamedText('');
      setError(null);
      return '';
    }

    setStatus('streaming');
    setStreamedText('');
    setError(null);

    try {
      let responseText = '';
      for await (const chunk of streamAstroCopilotResponse(trimmedQuery, promptText)) {
        responseText += chunk;
        setStreamedText(responseText);
      }

      const finalText = responseText;

      setStreamedText(finalText || '');
      setStatus('success');
      setError(null);
      return finalText || '';
    } catch (err) {
      console.error('AstroCopilot stream error:', err);
      setStatus('error');
      setError(GENERIC_ASTROCOPILOT_ERROR);
      return '';
    }
  }, [query, promptText, resolve]);

  useEffect(() => {
    if (!query || !query.trim()) {
      setStatus('idle');
      setStreamedText('');
      setError(null);
      return;
    }

    run();
  }, [query, promptText, run]);

  return { status, streamedText, error, run };
};
