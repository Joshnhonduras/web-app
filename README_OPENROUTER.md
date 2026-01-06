# OpenRouter Free Models Module

**Location:** `src/lib/openrouter-free-models.ts`

Zero-dependency TypeScript module for managing OpenRouter's free AI models.

## Quick Start

```typescript
import { getFreeOpenRouterModels, getDefaultFreeModels } from './src/lib/openrouter-free-models'

// Option 1: Fetch live list from OpenRouter API
const freeModels = await getFreeOpenRouterModels();

// Option 2: Instant access (no network call)
const quick = getDefaultFreeModels();

// Use in your app
const modelId = freeModels[0].id; // "meta-llama/llama-3.1-8b-instruct:free"
```

## Features

✅ **Fetch Live Models** - OpenRouter API (no auth required)
✅ **Hardcoded Fallback** - Works offline
✅ **Free Models Only** - Filter by free/paid status
✅ **Context Length** - Up to 131K tokens
✅ **Pricing Info** - Display-ready formatting
✅ **Type Safe** - Full TypeScript support
✅ **Zero Dependencies** - Only uses native `fetch()`

## Free Models

| Model | Context | Speed |
|-------|---------|-------|
| Llama 3.1 8B | 131K | ⚡ Fast |
| Mistral 7B | 32K | ⚡⚡ Very Fast |
| Gemma 2 9B | 8K | ⚡⚡ Very Fast |

## API

### Functions

- `fetchOpenRouterModels()` - Get all models from live API
- `getFreeOpenRouterModels()` - Get only free models
- `getDefaultOpenRouterModels()` - Get hardcoded list
- `getDefaultFreeModels()` - Get hardcoded free models
- `formatPricing(pricing)` - Format for display
- `formatContextLength(tokens)` - Format tokens

### Types

```typescript
interface ModelInfo {
  id: string;           // e.g., "meta-llama/llama-3.1-8b-instruct:free"
  name: string;
  provider: 'openrouter';
  free: boolean;
  contextLength?: number;
  pricing?: {
    prompt: number;     // per token
    completion: number; // per token
  };
}
```

## Examples

### React Component
```typescript
import { useState, useEffect } from 'react'
import { getFreeOpenRouterModels } from './src/lib/openrouter-free-models'

export function ModelSelector() {
  const [models, setModels] = useState([])

  useEffect(() => {
    getFreeOpenRouterModels().then(setModels)
  }, [])

  return (
    <select>
      {models.map(m => (
        <option key={m.id} value={m.id}>{m.name}</option>
      ))}
    </select>
  )
}
```

### API Client
```typescript
import { getDefaultFreeModels } from './src/lib/openrouter-free-models'

async function chat(message: string) {
  const [model] = getDefaultFreeModels()
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model.id,
      messages: [{ role: 'user', content: message }],
    }),
  })

  return response.json()
}
```

### Filter by Context Length
```typescript
import { fetchOpenRouterModels } from './src/lib/openrouter-free-models'

const models = await fetchOpenRouterModels()
const largeContext = models.filter(m => (m.contextLength || 0) >= 100000)
```

## Installation

Just copy the file to your project:
```bash
cp src/lib/openrouter-free-models.ts your-project/lib/
```

Or clone and use:
```bash
git clone https://github.com/Joshnhonduras/web-app.git
cp web-app/src/lib/openrouter-free-models.ts your-project/lib/
```

## No Dependencies

- ✅ Works in browsers (modern)
- ✅ Works in Node.js 18+
- ✅ Works with React, Vue, Angular
- ✅ Works with any bundler (Vite, Webpack, Rollup, etc.)
- ✅ No npm packages needed

## License

Free to use and modify.

---

**Source:** Growth Hub AI (https://github.com/Joshnhonduras/web-app)
**Last Updated:** January 2025
