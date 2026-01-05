/**
 * Legal Disclaimers for Growth Hub
 * These are the key disclaimers that must be shown to users
 */

export const disclaimers = {
  // Main global disclaimer shown to all users
  globalDisclaimer: `
Growth Hub provides AI-guided support and coaching for personal growth and relationships.

IMPORTANT DISCLAIMERS:
• This is NOT therapy, medical treatment, or professional mental health services
• AI responses are suggestions only - you are responsible for all decisions
• We are not doctors, therapists, or licensed mental health professionals
• If you are in crisis or experiencing suicidal thoughts, please contact emergency services or a crisis helpline immediately
• Growth Hub cannot replace professional mental health care
• For serious mental health issues, please consult with a licensed therapist or psychiatrist
  `,

  // Free tier explanation
  freeTierDisclaimer: `
GrowthHub Free Trial: 1,000 Credits

How It Works:
• You get 1,000 free credits (no payment needed, email only)
• Access all modules, courses, and features during trial
• Credits powered by our secure backend
• Your email prevents bot abuse and tracks usage

When Credits Run Out:
You have two options:

Option 1: Become a GrowthPlus Member ($9.99/month)
  • Get 10,000 additional credits per month
  • Keep access to all modules and features
  • Cancel anytime

Option 2: Get Your Own Free API Key
  • Groq or OpenRouter (100% free, unlimited)
  • Takes 2 minutes to set up
  • Full control over your usage
  • No cost to you ever
  `,

  // Shown when credits are exhausted
  creditsExhaustedMessage: `
Your free credits have been used.

Choose your next step:

Option 1: Join GrowthPlus
  $9.99/month for 10,000 additional credits
  Plus: All modules, courses, and features
  Cancel anytime

Option 2: Get Free API Access
  Completely free with Groq or OpenRouter
  Unlimited access forever
  Takes 2 minutes to set up
  `,

  // Shown if using free models specifically
  freeModelDisclaimer: `
You are currently using a FREE AI model (powered by Groq or OpenRouter).

Free model limitations:
• May occasionally take longer to respond during peak hours
• Quality is excellent but different from paid models like GPT-4
• For critical decisions, consider verifying responses with a professional

You can upgrade to a paid model anytime in Settings.
  `,

  // Crisis/emergency resource
  crisisWarning: `
🆘 IF YOU ARE IN CRISIS OR IMMEDIATE DANGER:

• United States: National Suicide Prevention Lifeline 988 (call or text)
• United States: Crisis Text Line - Text HOME to 741741
• Worldwide: findahelpline.com

Do NOT rely on Growth Hub for mental health emergencies. Reach out to professional help immediately.
  `,

  // Privacy notice for free tier
  privacyNotice: `
ABOUT YOUR PRIVACY & API KEYS:

Your Trial (1,000 tokens):
• Powered by Growth Hub's secure backend (Groq or OpenRouter)
• Growth Hub's API keys are stored securely on backend servers ONLY
• Growth Hub NEVER shares, exposes, or makes available our API keys to you or your browser
• Your conversations during trial are processed through our backend

Your Own API Key (after trial):
• When you add your own API key, it's stored ONLY in your browser
• Never sent to our servers
• You have complete control over your key
• You're responsible for keeping it secure

Privacy Choices:
• Groq: Completely free, completely private
• OpenRouter: Free, but may use data for training
• OpenAI: Paid, highest quality, your choice
  `,

  // Consent for data processing
  dataConsent: `
By using Growth Hub, you agree that:
• Conversations are processed by AI services (Groq, OpenRouter, or OpenAI depending on your settings)
• Your API key (if provided) is used only to call the AI service you selected
• We store your conversations locally on your device for context
• You are responsible for the privacy of your own API keys
  `,

  // Subscription terms - GrowthPlus
  subscriptionTerms: `
GrowthPlus Membership ($9.99/month)

What You Get:
• 10,000 additional credits per month
• Full access to all modules, courses, and features
• Current and all future modules included
• Cancel anytime, no commitment

How It Works:
• $9.99 charged monthly on your billing date
• Credits reset each month
• Cancel anytime from your account settings
• Founding member price locked in—will never increase
  `,
};

/**
 * Get all disclaimers user should see
 */
export function getAllDisclaimers(): string[] {
  return [
    disclaimers.globalDisclaimer,
    disclaimers.crisisWarning,
    disclaimers.dataConsent,
  ];
}

/**
 * Get disclaimers specific to free tier
 */
export function getFreeTierDisclaimers(): string[] {
  return [
    disclaimers.globalDisclaimer,
    disclaimers.freeTierDisclaimer,
    disclaimers.crisisWarning,
    disclaimers.dataConsent,
    disclaimers.privacyNotice,
  ];
}

/**
 * Get disclaimers for paid API users
 */
export function getPaidApiDisclaimers(): string[] {
  return [
    disclaimers.globalDisclaimer,
    disclaimers.crisisWarning,
    disclaimers.dataConsent,
  ];
}

/**
 * Format disclaimer for display
 */
export function formatDisclaimer(text: string): string {
  return text.trim();
}

/**
 * Check if user has acknowledged disclaimers
 */
export function getDisclaimerAcknowledgment(): {
  acknowledged: boolean;
  acknowledgedAt: number | null;
} {
  const stored = localStorage.getItem('growth-hub-disclaimer-ack');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { acknowledged: false, acknowledgedAt: null };
    }
  }
  return { acknowledged: false, acknowledgedAt: null };
}

/**
 * Mark disclaimers as acknowledged
 */
export function acknowledgeDisclaimers(): void {
  localStorage.setItem(
    'growth-hub-disclaimer-ack',
    JSON.stringify({
      acknowledged: true,
      acknowledgedAt: Date.now(),
    })
  );
}

/**
 * Reset disclaimer acknowledgment (for testing)
 */
export function resetDisclaimerAcknowledgment(): void {
  localStorage.removeItem('growth-hub-disclaimer-ack');
}
