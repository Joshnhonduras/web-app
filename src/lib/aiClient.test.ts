import { describe, expect, it, vi } from 'vitest';
import { sendMessage } from './aiClient';
import type { Message } from '../types';

const baseMessages: Message[] = [{ id: '1', role: 'user', content: 'hi', timestamp: Date.now() }];

describe('aiClient', () => {
  it('throws when API is not configured', async () => {
    await expect(sendMessage(baseMessages, 'sys', { apiKey: '', provider: null })).rejects.toThrow();
  });

  it('formats OpenAI payload', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'hello' } }],
      }),
    });
    (globalThis as unknown as { fetch: typeof fetch }).fetch = mockFetch as unknown as typeof fetch;

    const result = await sendMessage(baseMessages, 'sys', { apiKey: 'key', provider: 'openai', model: 'gpt-4o-mini' });
    expect(result).toBe('hello');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
      })
    );
  });
});
