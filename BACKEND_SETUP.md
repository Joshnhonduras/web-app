# Backend Setup Guide for Growth Hub Free Tier

## Overview

The free trial system uses a backend-proxied approach for maximum security:
- **User API keys are never exposed** in the frontend
- **Your free tier API keys** (Groq, OpenRouter) are stored securely on the backend
- **Automatic fallback** from Groq to OpenRouter if one fails
- **Token usage tracking** happens at the backend

## Backend Requirements

### Endpoint: POST `/api/chat/free-tier`

Accepts free tier chat requests and routes to the appropriate free API.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Hello..." },
    { "role": "assistant", "content": "..." }
  ],
  "systemPrompt": "You are a helpful relationship coach..."
}
```

**Response:**
```json
{
  "choices": [
    {
      "message": {
        "content": "The AI response here..."
      }
    }
  ],
  "usage": {
    "completion_tokens": 150
  }
}
```

**Error Response:**
```json
{
  "error": {
    "message": "Service temporarily unavailable. Please try again."
  }
}
```

### Endpoint: GET `/api/health/free-tier`

Health check for free tier service.

**Response (200 OK):**
```json
{ "status": "ok" }
```

### Endpoint: GET `/api/models/free-tier`

Returns available free tier models.

**Response:**
```json
{
  "models": ["groq", "openrouter"]
}
```

## Backend Implementation (Node.js/Express Example)

```javascript
// Environment variables needed:
// GROQ_API_KEY=your_groq_key_here
// OPENROUTER_API_KEY=your_openrouter_key_here

import express from 'express';

const app = express();
app.use(express.json());

// Free tier chat endpoint with fallback
app.post('/api/chat/free-tier', async (req, res) => {
  const { messages, systemPrompt } = req.body;

  // Try Groq first
  try {
    const response = await callGroqAPI(messages, systemPrompt);
    return res.json(response);
  } catch (error) {
    console.log('Groq failed, trying OpenRouter:', error.message);
  }

  // Fallback to OpenRouter
  try {
    const response = await callOpenRouterAPI(messages, systemPrompt);
    return res.json(response);
  } catch (error) {
    console.error('Both Groq and OpenRouter failed:', error);
    return res.status(503).json({
      error: { message: 'Free tier service temporarily unavailable' }
    });
  }
});

// Health check
app.get('/api/health/free-tier', (req, res) => {
  res.json({ status: 'ok' });
});

// Available models
app.get('/api/models/free-tier', (req, res) => {
  res.json({ models: ['groq', 'openrouter'] });
});

// Groq API call
async function callGroqAPI(messages, systemPrompt) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Groq API error');
  }

  return await response.json();
}

// OpenRouter API call (free models only)
async function callOpenRouterAPI(messages, systemPrompt) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://growth-hub.app',
      'X-Title': 'Growth Hub',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenRouter API error');
  }

  return await response.json();
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
```

## Frontend Configuration

Set the backend URL in your environment:

**.env (or .env.local)**
```
REACT_APP_BACKEND_URL=http://localhost:3000
```

For production:
```
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

## Security Considerations

### ✅ What's Protected
- Your Groq API key - backend `.env` file ONLY
- Your OpenRouter API key - backend `.env` file ONLY
- User conversations are proxied through your backend
- No sensitive keys ever reach the frontend

### ✅ What Users Can't Access
- Your API keys (never sent to browser)
- Your backend URL (can reverse-engineer but worthless without keys)
- Your backend code
- Other users' data

### ⚠️ What Users Need to Know
- Free tier uses your hosted backend (costs you minimal)
- After trial: They get their own free Groq key (unlimited, no cost to anyone)
- Or: They subscribe $9.99/month for premium features
- You never store, see, or log their personal API keys

### 🔐 Mandatory Protections
1. **API Key Storage**
   ```bash
   # .env file (NEVER commit this)
   GROQ_API_KEY=gsk_...
   OPENROUTER_API_KEY=sk_...
   
   # .gitignore
   .env
   .env.local
   ```

2. **Rate Limiting** on `/api/chat/free-tier`
   - Max 100 requests per day per IP/session
   - Max 10 requests per minute
   - Prevents abuse and costs

3. **CORS Configuration**
   ```javascript
   app.use(cors({
     origin: ['https://yourdomain.com', 'http://localhost:3000'],
     credentials: false  // Don't send keys in CORS
   }));
   ```

4. **Input Validation**
   ```javascript
   // Reject suspicious requests
   if (!req.body.messages || typeof req.body.messages !== 'array') {
     return res.status(400).json({ error: 'Invalid input' });
   }
   if (req.body.messages.some(m => m.length > 10000)) {
     return res.status(400).json({ error: 'Message too long' });
   }
   ```

5. **Never Log Keys**
   ```javascript
   // ❌ WRONG
   console.log('API Key:', process.env.GROQ_API_KEY);
   
   // ✅ CORRECT
   console.log('Groq API called');  // No key info
   ```

6. **HTTPS in Production**
   - All traffic encrypted
   - Keys transmitted encrypted
   - No man-in-the-middle attacks

## Monitoring & Analytics

Track free tier usage:
```javascript
// Log when free tier is called
app.post('/api/chat/free-tier', async (req, res) => {
  console.log('[Free Tier]', {
    timestamp: new Date().toISOString(),
    provider: 'will-attempt-groq-first',
    messageCount: req.body.messages.length,
  });
  // ... rest of handler
});
```

## Testing

### Local Testing
```bash
# Start backend on port 3000
npm run dev

# Frontend should use REACT_APP_BACKEND_URL=http://localhost:3000
npm run dev
```

### Production Testing
```bash
# Test endpoint
curl -X POST https://api.yourdomain.com/api/chat/free-tier \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "systemPrompt": "You are helpful."
  }'
```

## Deployment

### Heroku
```bash
# Set environment variables
heroku config:set GROQ_API_KEY=your_key
heroku config:set OPENROUTER_API_KEY=your_key

# Deploy
git push heroku main
```

### Vercel (with serverless functions)
Create `api/chat/free-tier.js`:
```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, systemPrompt } = req.body;

  try {
    // Call Groq or OpenRouter
    // Return response
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
}
```

## Troubleshooting

### Free tier requests fail
1. Check that `GROQ_API_KEY` and `OPENROUTER_API_KEY` are set
2. Verify API keys are valid on their respective platforms
3. Check rate limits haven't been exceeded
4. Enable backend logs to see which service is failing

### CORS errors in browser
1. Verify `REACT_APP_BACKEND_URL` is set correctly
2. Check backend CORS configuration allows your frontend origin
3. Ensure requests use correct headers

### Slow responses
1. Groq might be slow - OpenRouter fallback should kick in
2. Both services are free - response times aren't guaranteed
3. Consider adding caching for common responses
4. Suggest users upgrade to paid API keys for faster responses

## Next Steps

1. Set up backend endpoints as shown above
2. Add rate limiting and monitoring
3. Test locally with the frontend
4. Deploy to production
5. Update `REACT_APP_BACKEND_URL` in frontend environment

Questions? The frontend will handle errors gracefully and show users when services are unavailable.
