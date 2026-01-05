# Integration Guide: Free Trial System

This guide shows how to integrate the new free trial system into your existing Chat component.

## What Changed

### New Files Created
- `src/lib/usage/usageService.ts` - Usage tracking
- `src/lib/freeTierClient.ts` - Backend-proxied API calls
- `src/lib/legal/disclaimers.ts` - Legal disclaimers
- `src/components/TrialWelcomeModal.tsx` - Welcome modal (shown on first message)
- `src/components/DisclaimerBanner.tsx` - Disclaimer banner

### Key Concepts

1. **Free Trial**: 1,000 tokens = ~250-400 words
2. **Automatic Selection**: New users automatically use free tier
3. **Fallback System**: Groq → OpenRouter if first fails
4. **Minimal Friction**: Direct links and clear instructions for API key setup
5. **Secure**: Your API keys stay hidden on the backend

## Integration Steps

### 1. Update Chat Component

In `src/modules/masculine-mentor/Chat.tsx`, modify the message sending logic:

```typescript
import { sendMessage } from '../../lib/aiClient';
import { sendMessageFreeTier } from '../../lib/freeTierClient';
import { 
  initializeTrial, 
  recordMessageUsage, 
  getRemainingTokens,
  isTrialExhausted,
  getUsageSummary
} from '../../lib/usage/usageService';
import { TrialWelcomeModal } from '../../components/TrialWelcomeModal';
import { useState, useEffect } from 'react';

export default function Chat() {
  // ... existing state ...
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [hasShownTrialModal, setHasShownTrialModal] = useState(false);

  // On component mount, check if first message
  useEffect(() => {
    const { messagesCount } = getUsageSummary();
    if (messagesCount === 0 && !hasShownTrialModal) {
      setShowTrialModal(true);
      setHasShownTrialModal(true);
    }
  }, []);

  // Modified send message function
  const sendMessage = async (userMessage: string) => {
    // Check if user has API key configured
    const hasApiKey = settings.apiConfig?.apiKey && settings.apiConfig?.provider;
    
    if (hasApiKey) {
      // User has their own API key - use it
      const response = await sendMessage(
        messages,
        systemPrompt,
        settings.apiConfig
      );
      addMessage({ role: 'assistant', content: response });
    } else {
      // New user or free tier - use backend-proxied free tier
      
      // Initialize trial on first message
      initializeTrial();
      
      // Check if trial exhausted
      if (isTrialExhausted()) {
        // Show upgrade prompt instead of sending
        addMessage({
          role: 'assistant',
          content: `You've used your 1,000 free trial tokens! Here are your options:\n\n1. Get your own API key (Groq, OpenAI, etc.) - super easy, ~2 minutes\n2. Subscribe for $9.99/month for unlimited access\n\nWould you like to set up an API key? Go to Settings → API Config for instructions.`
        });
        return;
      }

      // Record message usage
      recordMessageUsage(userMessage.length);

      // Call free tier API (backend-proxied)
      try {
        const response = await sendMessageFreeTier(
          [...messages, { role: 'user', content: userMessage }],
          systemPrompt
        );
        
        // response includes both content and tokensUsed
        addMessage({ role: 'assistant', content: response.content });
        
        // Record actual tokens used
        if (response.tokensUsed) {
          recordResponseTokens(response.tokensUsed);
        }

        // Show usage summary
        const remaining = getRemainingTokens();
        if (remaining < 200) {
          // Show upgrade prompt if running low
          console.log(`⚠️ Only ${remaining} tokens remaining!`);
        }
      } catch (error) {
        addMessage({
          role: 'assistant',
          content: `I'm having trouble connecting to the free service. Please try again or set up your own API key in Settings.`
        });
      }
    }
  };

  return (
    <>
      {/* Your existing chat UI */}
      <TrialWelcomeModal 
        isOpen={showTrialModal} 
        onClose={() => setShowTrialModal(false)}
      />
      {/* ... rest of component ... */}
    </>
  );
}
```

### 2. Add Disclaimer Banner to Hub

In `src/Hub.tsx`, add the disclaimer banner at the top:

```typescript
import { DisclaimerBanner } from './components/DisclaimerBanner';

export default function Hub() {
  return (
    <div className="hub-container">
      <DisclaimerBanner />
      {/* ... rest of hub ... */}
    </div>
  );
}
```

### 3. Update Setup Page

The existing `src/Setup.tsx` is good, but you can enhance it:

```typescript
import { Link } from 'react-router-dom';
import './Setup.css';

export default function Setup() {
  return (
    <div className="setup-container">
      <div className="setup-header">
        <Link to="/" className="back-btn">← Back</Link>
        <h1>Set Up Your AI</h1>
      </div>

      <div className="setup-content">
        <div className="intro-section">
          <h2>Option 1: Start Your FREE TRIAL (No Setup Required!)</h2>
          <p>
            New users get <strong>1,000 free tokens (~250-400 words)</strong> using free AI models.
            Just start chatting - no API key needed!
          </p>
          <p>
            The free models (Groq, OpenRouter) are high-quality and work great for most people.
          </p>
          <Link to="/masculine-mentor/chat" className="btn btn-primary">
            Start Free Trial →
          </Link>
        </div>

        <div className="divider">Or</div>

        <div className="intro-section">
          <h2>Option 2: Use Your Own API Key (Unlimited Access)</h2>
          <p>
            Have your own API key? Skip the trial and use your key immediately for unlimited tokens.
          </p>
          
          {/* Existing API key setup instructions */}
          <div className="providers-section">
            {/* ... copy from old Setup.tsx ... */}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 4. Add Settings Page Component

Create `src/components/UsageDisplay.tsx` to show trial usage:

```typescript
import { getUsageSummary } from '../lib/usage/usageService';
import { useEffect, useState } from 'react';

export function UsageDisplay() {
  const [usage, setUsage] = useState(getUsageSummary());

  useEffect(() => {
    // Update on component mount
    setUsage(getUsageSummary());
    
    // Re-check every 5 seconds
    const interval = setInterval(() => {
      setUsage(getUsageSummary());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!usage.isTrialActive || usage.tokensUsed === 0) {
    return null; // Don't show if not in trial
  }

  const percentUsed = (usage.tokensUsed / usage.tokensLimit) * 100;

  return (
    <div className="usage-display">
      <h3>Free Trial Usage</h3>
      
      <div className="usage-bar">
        <div 
          className="usage-fill"
          style={{ width: `${percentUsed}%` }}
        />
      </div>

      <p className="usage-text">
        {usage.tokensUsed} / {usage.tokensLimit} tokens used
      </p>
      <p className="usage-words">
        (~{usage.wordsUsed} / ~{usage.wordsRemaining} words)
      </p>

      {usage.tokensRemaining < 200 && (
        <div className="usage-warning">
          ⚠️ You have {usage.tokensRemaining} tokens left!
          <a href="#api-setup">Set up your own API key</a> or 
          <a href="#subscribe">subscribe for unlimited</a>.
        </div>
      )}
    </div>
  );
}
```

And CSS:
```css
.usage-display {
  background: #f0f8ff;
  border: 1px solid #0066cc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.usage-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin: 12px 0;
}

.usage-fill {
  height: 100%;
  background: linear-gradient(90deg, #0066cc, #667eea);
  transition: width 0.3s ease;
}

.usage-text {
  margin: 8px 0 4px 0;
  font-size: 13px;
  color: #333;
}

.usage-words {
  margin: 0 0 12px 0;
  font-size: 12px;
  color: #666;
}

.usage-warning {
  background: #fff3cd;
  border: 1px solid #ffc107;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 13px;
  color: #856404;
  margin-top: 8px;
}

.usage-warning a {
  color: #0066cc;
  text-decoration: underline;
  margin-left: 4px;
}
```

### 5. Environment Configuration

Create/update `.env.local`:

```
REACT_APP_BACKEND_URL=http://localhost:3000
VITE_BACKEND_URL=http://localhost:3000
```

For production:
```
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

## Testing

### Test Free Trial Flow
1. Open app in fresh browser (incognito/private)
2. Go to chat
3. Modal should show about free trial
4. Send a message
5. Check localStorage: `growth-hub-usage` should show token count
6. Send multiple messages
7. Watch token count increase

### Test Exhaustion
1. Edit localStorage `growth-hub-usage`
2. Set `tokensUsed: 999`
3. Send next message - should show upgrade prompt

### Test with API Key
1. Go to Settings
2. Add your own API key
3. Send message - should use your key instead of free tier
4. Modal should not show again

## Common Issues

### Backend not responding
- Check `REACT_APP_BACKEND_URL` is set correctly
- Verify backend is running
- Check browser console for CORS errors

### Token counting seems off
- Frontend estimates tokens; actual might differ
- Backend should record real tokens used
- Display shows estimate range (250-400 words)

### Free tier failing immediately
- Check Groq and OpenRouter API keys on backend
- Rate limits might be exceeded
- OpenRouter might need privacy settings adjusted

### Disclaimer shows every time
- Check localStorage: `growth-hub-disclaimer-ack` should exist
- Browser might be clearing localStorage in session mode

## Next: Subscription Integration

Once this is working, you'll need to add:
1. Stripe integration for $9.99/month billing
2. Subscription status check
3. Bypass free tier if subscribed
4. Billing portal link in settings

See the roadmap document for subscription setup.

