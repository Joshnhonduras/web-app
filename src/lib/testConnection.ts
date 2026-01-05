import type { APIConfig } from '../types';

export async function testAPIConnection(apiConfig: APIConfig): Promise<{ success: boolean; message: string }> {
  if (!apiConfig.apiKey || !apiConfig.provider) {
    return { success: false, message: 'API key and provider are required' };
  }

  try {
    switch (apiConfig.provider) {
      case 'openrouter':
        return await testOpenRouter(apiConfig);
      case 'openai':
        return await testOpenAI(apiConfig);
      case 'groq':
        return await testGroq(apiConfig);
      default:
        return { success: false, message: 'Invalid provider' };
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Connection failed';
    return { success: false, message };
  }
}

async function testOpenRouter(apiConfig: APIConfig): Promise<{ success: boolean; message: string }> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiConfig.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
    },
    body: JSON.stringify({
      model: apiConfig.model || 'meta-llama/llama-3.1-8b-instruct:free',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 10,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return { 
      success: false, 
      message: error.error?.message || `HTTP ${response.status}` 
    };
  }

  return { success: true, message: 'OpenRouter connected successfully' };
}

async function testOpenAI(apiConfig: APIConfig): Promise<{ success: boolean; message: string }> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiConfig.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: apiConfig.model || 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 10,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return { 
      success: false, 
      message: error.error?.message || `HTTP ${response.status}` 
    };
  }

  return { success: true, message: 'OpenAI connected successfully' };
}

async function testGroq(apiConfig: APIConfig): Promise<{ success: boolean; message: string }> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiConfig.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: apiConfig.model || 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 10,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return { 
      success: false, 
      message: error.error?.message || `HTTP ${response.status}` 
    };
  }

  return { success: true, message: 'Groq connected successfully' };
}
