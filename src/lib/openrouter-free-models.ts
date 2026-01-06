/**
 * OpenRouter Free Models - Standalone Module
 * 
 * Provides a list of free OpenRouter models with full pricing and context info.
 * No external dependencies required.
 * 
 * Usage:
 * ------
 * import { fetchOpenRouterModels, getDefaultOpenRouterModels } from './openrouter-free-models'
 * 
 * // Option 1: Fetch live list from OpenRouter API
 * const models = await fetchOpenRouterModels();
 * 
 * // Option 2: Use hardcoded fallback (no network call)
 * const models = getDefaultOpenRouterModels();
 * 
 * // Option 3: Get only free models
 * const freeModels = getDefaultOpenRouterModels().filter(m => m.free);
 */

export interface ModelInfo {
  id: string;
  name: string;
  provider: 'openrouter';
  free: boolean;
  contextLength?: number;
  pricing?: {
    prompt: number;
    completion: number;
  };
}

/**
 * Fetch available models from OpenRouter API (no auth required)
 * Returns complete list with pricing info
 */
export async function fetchOpenRouterModels(): Promise<ModelInfo[]> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models');
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    
    return data.data
      .map((model: {
        id: string;
        name?: string;
        pricing?: { prompt?: string; completion?: string };
        context_length?: number;
      }) => {
        const isFree = 
          model.pricing?.prompt === '0' && 
          model.pricing?.completion === '0';
        
        return {
          id: model.id,
          name: model.name || model.id,
          provider: 'openrouter' as const,
          free: isFree,
          contextLength: model.context_length,
          pricing: {
            prompt: parseFloat(model.pricing?.prompt || '0'),
            completion: parseFloat(model.pricing?.completion || '0'),
          },
        };
      })
      .sort((a, b) => {
        // Free models first, then by context length
        if (a.free !== b.free) return b.free ? 1 : -1;
        return (b.contextLength || 0) - (a.contextLength || 0);
      });
  } catch (error) {
    console.error('Failed to fetch OpenRouter models:', error);
    return getDefaultOpenRouterModels();
  }
}

/**
 * Get only free OpenRouter models
 */
export async function getFreeOpenRouterModels(): Promise<ModelInfo[]> {
  const allModels = await fetchOpenRouterModels();
  return allModels.filter(model => model.free);
}

/**
 * Default OpenRouter models (hardcoded fallback)
 * Last updated: January 2025
 * 
 * These models are always free on OpenRouter:
 * - Llama 3.1 8B (131k context)
 * - Mistral 7B (32k context)
 * - Gemma 2 9B (8k context)
 */
export function getDefaultOpenRouterModels(): ModelInfo[] {
  return [
    {
      id: 'meta-llama/llama-3.1-8b-instruct:free',
      name: 'Llama 3.1 8B Instruct (Free)',
      provider: 'openrouter',
      free: true,
      contextLength: 131072,
      pricing: { prompt: 0, completion: 0 },
    },
    {
      id: 'mistralai/mistral-7b-instruct:free',
      name: 'Mistral 7B Instruct (Free)',
      provider: 'openrouter',
      free: true,
      contextLength: 32768,
      pricing: { prompt: 0, completion: 0 },
    },
    {
      id: 'google/gemma-2-9b-it:free',
      name: 'Gemma 2 9B IT (Free)',
      provider: 'openrouter',
      free: true,
      contextLength: 8192,
      pricing: { prompt: 0, completion: 0 },
    },
  ];
}

/**
 * Get only free models from default list
 */
export function getDefaultFreeModels(): ModelInfo[] {
  return getDefaultOpenRouterModels().filter(m => m.free);
}

/**
 * Format pricing for display
 */
export function formatPricing(pricing: { prompt: number; completion: number }): string {
  if (pricing.prompt === 0 && pricing.completion === 0) {
    return 'FREE';
  }
  
  const promptCost = (pricing.prompt * 1_000_000).toFixed(2);
  const completionCost = (pricing.completion * 1_000_000).toFixed(2);
  
  return `$${promptCost}/$${completionCost} per 1M tokens`;
}

/**
 * Format context length for display
 */
export function formatContextLength(tokens?: number): string {
  if (!tokens) return 'Unknown';
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(1)}K`;
  return `${tokens}`;
}

/**
 * Example usage
 */
export const examples = {
  // Get all free models
  getFreeModels: async () => {
    const models = await getFreeOpenRouterModels();
    return models.map(m => ({
      id: m.id,
      name: m.name,
      contextLength: formatContextLength(m.contextLength),
      pricing: formatPricing(m.pricing!),
    }));
  },

  // Quick access to free models (no network call)
  getQuickList: () => {
    return getDefaultFreeModels().map(m => m.id);
  },

  // Find model by ID
  findModel: async (modelId: string) => {
    const models = await fetchOpenRouterModels();
    return models.find(m => m.id === modelId);
  },

  // Filter by context length
  filterByContextLength: async (minTokens: number) => {
    const models = await fetchOpenRouterModels();
    return models.filter(m => (m.contextLength || 0) >= minTokens);
  },
};
