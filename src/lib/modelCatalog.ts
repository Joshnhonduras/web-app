/**
 * Fetch and manage AI model catalogs from different providers
 */

export interface ModelInfo {
  id: string;
  name: string;
  provider: 'openrouter' | 'openai' | 'groq';
  free: boolean;
  contextLength?: number;
  pricing?: {
    prompt: number;
    completion: number;
  };
}

/**
 * Fetch available models from OpenRouter
 */
export async function fetchOpenRouterModels(): Promise<ModelInfo[]> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models');
    const data = await response.json();
    
    return data.data.map((model: any) => {
      const isFree = model.pricing?.prompt === '0' && model.pricing?.completion === '0';
      
      return {
        id: model.id, // e.g., "mistralai/mistral-7b-instruct:free"
        name: model.id, // Use the ID as the display name too
        provider: 'openrouter' as const,
        free: isFree,
        contextLength: model.context_length,
        pricing: {
          prompt: parseFloat(model.pricing?.prompt || '0'),
          completion: parseFloat(model.pricing?.completion || '0'),
        },
      };
    });
  } catch (error) {
    console.error('Failed to fetch OpenRouter models:', error);
    return getDefaultOpenRouterModels();
  }
}

/**
 * Default OpenRouter models (fallback if API fails)
 */
function getDefaultOpenRouterModels(): ModelInfo[] {
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
    {
      id: 'meta-llama/llama-3.1-70b-instruct',
      name: 'Llama 3.1 70B Instruct',
      provider: 'openrouter',
      free: false,
      contextLength: 131072,
      pricing: { prompt: 0.35, completion: 0.40 },
    },
    {
      id: 'anthropic/claude-3.5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'openrouter',
      free: false,
      contextLength: 200000,
      pricing: { prompt: 3.0, completion: 15.0 },
    },
    {
      id: 'openai/gpt-4o',
      name: 'GPT-4o',
      provider: 'openrouter',
      free: false,
      contextLength: 128000,
      pricing: { prompt: 2.5, completion: 10.0 },
    },
  ];
}

/**
 * Get OpenAI models
 */
export function getOpenAIModels(): ModelInfo[] {
  return [
    {
      id: 'gpt-4o',
      name: 'GPT-4o (Latest)',
      provider: 'openai',
      free: false,
      contextLength: 128000,
      pricing: { prompt: 2.5, completion: 10.0 },
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini (Recommended)',
      provider: 'openai',
      free: false,
      contextLength: 128000,
      pricing: { prompt: 0.15, completion: 0.60 },
    },
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'openai',
      free: false,
      contextLength: 128000,
      pricing: { prompt: 10.0, completion: 30.0 },
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: 'openai',
      free: false,
      contextLength: 16385,
      pricing: { prompt: 0.50, completion: 1.50 },
    },
  ];
}

/**
 * Get Groq models (FREE!)
 */
export function getGroqModels(): ModelInfo[] {
  return [
    {
      id: 'llama-3.3-70b-versatile',
      name: 'Llama 3.3 70B Versatile (Free)',
      provider: 'groq',
      free: true,
      contextLength: 32768,
      pricing: { prompt: 0, completion: 0 },
    },
    {
      id: 'llama-3.1-70b-versatile',
      name: 'Llama 3.1 70B Versatile (Free)',
      provider: 'groq',
      free: true,
      contextLength: 131072,
      pricing: { prompt: 0, completion: 0 },
    },
    {
      id: 'llama-3.1-8b-instant',
      name: 'Llama 3.1 8B Instant (Free)',
      provider: 'groq',
      free: true,
      contextLength: 131072,
      pricing: { prompt: 0, completion: 0 },
    },
    {
      id: 'mixtral-8x7b-32768',
      name: 'Mixtral 8x7B (Free)',
      provider: 'groq',
      free: true,
      contextLength: 32768,
      pricing: { prompt: 0, completion: 0 },
    },
    {
      id: 'gemma2-9b-it',
      name: 'Gemma 2 9B IT (Free)',
      provider: 'groq',
      free: true,
      contextLength: 8192,
      pricing: { prompt: 0, completion: 0 },
    },
  ];
}

/**
 * Get models for a specific provider
 */
export async function getModelsForProvider(
  provider: 'openrouter' | 'openai' | 'groq'
): Promise<ModelInfo[]> {
  switch (provider) {
    case 'openrouter':
      return await fetchOpenRouterModels();
    case 'openai':
      return getOpenAIModels();
    case 'groq':
      return getGroqModels();
    default:
      return [];
  }
}

/**
 * Format pricing for display
 */
export function formatPricing(pricing: { prompt: number; completion: number }): string {
  if (pricing.prompt === 0 && pricing.completion === 0) {
    return 'FREE';
  }
  
  // Convert to cost per 1M tokens
  const promptCost = pricing.prompt;
  const completionCost = pricing.completion;
  
  if (promptCost < 1 && completionCost < 1) {
    return `$${promptCost.toFixed(2)}/$${completionCost.toFixed(2)} per 1M tokens`;
  }
  
  return `$${promptCost}/$${completionCost} per 1M tokens`;
}
