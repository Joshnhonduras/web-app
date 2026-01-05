/**
 * Free Tier AI Client - Backend Proxied
 * 
 * SECURITY MODEL:
 * ===============
 * 
 * Your API keys (Groq, OpenRouter) are NEVER exposed to frontend:
 * - Stored securely on backend server only
 * - Never sent to browser or user
 * - Never accessible from frontend code or browser dev tools
 * 
 * User's API Keys (when they provide their own):
 * - Stored ONLY in browser localStorage
 * - Never sent to your backend
 * - You never see or store them
 * 
 * This client:
 * - Sends user message to your backend
 * - Backend uses its secure Groq/OpenRouter keys to call APIs
 * - Returns response to user
 * - Your keys remain secure, your backend remains hidden
 */

import type { Message } from '../types';

const DEFAULT_TIMEOUT_MS = 30000;

// Change this to your actual backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = DEFAULT_TIMEOUT_MS
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Send message using backend-proxied free tier API
 * Backend handles Groq → OpenRouter fallback automatically
 */
export async function sendMessageFreeTier(
  messages: Message[],
  systemPrompt: string
): Promise<string> {
  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/chat/free-tier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        systemPrompt,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error?.message || `Free tier API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Return response content and token info if available
    return {
      content: data.choices?.[0]?.message?.content || 'I apologize, but I had trouble generating a response.',
      tokensUsed: data.usage?.completion_tokens || 0,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Free tier API request timed out. Please try again.');
    }
    throw error;
  }
}

/**
 * Check free tier API health
 */
export async function checkFreeTierHealth(): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/health/free-tier`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get available free tier models from backend
 */
export async function getFreeTierModels(): Promise<string[]> {
  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/models/free-tier`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch free tier models');
    }

    const data = await response.json();
    return data.models || ['groq', 'openrouter'];
  } catch (error) {
    console.error('Error fetching free tier models:', error);
    return ['groq', 'openrouter'];
  }
}
