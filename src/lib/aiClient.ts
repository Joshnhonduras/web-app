import type { Message, APIConfig } from '../types';

export async function sendMessage(
  messages: Message[],
  systemPrompt: string,
  apiConfig: APIConfig
): Promise<string> {
  if (!apiConfig.apiKey || !apiConfig.provider) {
    throw new Error('API not configured. Please set up your API in Settings.');
  }

  switch (apiConfig.provider) {
    case 'openrouter':
      return await callOpenRouter(messages, systemPrompt, apiConfig);
    case 'openai':
      return await callOpenAI(messages, systemPrompt, apiConfig);
    case 'groq':
      return await callGroq(messages, systemPrompt, apiConfig);
    default:
      throw new Error('Invalid API provider');
  }
}

async function callOpenRouter(
  messages: Message[],
  systemPrompt: string,
  apiConfig: APIConfig
): Promise<string> {
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
  ];

  const model = apiConfig.model || 'meta-llama/llama-3.1-8b-instruct:free';

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiConfig.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Growth Hub',
    },
    body: JSON.stringify({
      model,
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error?.message || 'OpenRouter API error');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'I apologize, but I had trouble generating a response.';
}

async function callOpenAI(
  messages: Message[],
  systemPrompt: string,
  apiConfig: APIConfig
): Promise<string> {
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiConfig.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: apiConfig.model || 'gpt-4o-mini',
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error?.message || 'OpenAI API error');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'I apologize, but I had trouble generating a response.';
}

async function callGroq(
  messages: Message[],
  systemPrompt: string,
  apiConfig: APIConfig
): Promise<string> {
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
  ];

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiConfig.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: apiConfig.model || 'llama-3.3-70b-versatile',
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error?.message || 'Groq API error');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'I apologize, but I had trouble generating a response.';
}
