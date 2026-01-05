/**
 * Usage Tracking Service
 * 
 * FREE TIER: 1,000 tokens (no payment, email only)
 * PAID TIER (GrowthPlus): 10,000 additional tokens + unlimited modules
 * 
 * Tracks token usage and prevents bot abuse via email verification
 */

export interface UsageData {
  tokensUsed: number;
  messagesCount: number;
  email?: string; // Required to track usage and prevent bot abuse
  trialStartedAt: number | null;
  isTrialActive: boolean;
  totalTokenLimit: number;
  isPaid?: boolean; // GrowthPlus subscription status
}

const STORAGE_KEY = 'growth-hub-usage';
const FREE_TRIAL_TOKENS = 1000;
const PAID_TIER_TOKENS = 10000;

/**
 * Get current usage data from localStorage
 */
export function getUsageData(): UsageData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to parse usage data:', e);
  }

  // Initialize new usage
  return {
    tokensUsed: 0,
    messagesCount: 0,
    trialStartedAt: null,
    isTrialActive: true,
    totalTokenLimit: FREE_TRIAL_TOKENS,
  };
}

/**
 * Save usage data to localStorage
 */
export function saveUsageData(data: UsageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save usage data:', e);
  }
}

/**
 * Initialize trial with email verification
 * Email is required to prevent bot abuse
 */
export function initializeTrial(email: string): UsageData {
  const current = getUsageData();

  if (!current.trialStartedAt) {
    current.trialStartedAt = Date.now();
    current.isTrialActive = true;
    current.email = email; // Store email for bot prevention
    saveUsageData(current);
  }

  return current;
}

/**
 * Upgrade to GrowthPlus
 * Adds 10,000 additional tokens + full access
 */
export function upgradeToPaid(): UsageData {
  const current = getUsageData();
  current.isPaid = true;
  current.totalTokenLimit += PAID_TIER_TOKENS; // Add 10k more tokens
  saveUsageData(current);
  return current;
}

/**
 * Record a message sent (estimate token usage)
 */
export function recordMessageUsage(messageLength: number): UsageData {
  const current = getUsageData();

  if (!current.trialStartedAt) {
    initializeTrial();
  }

  // Estimate tokens (rough: ~1 token per 4 characters)
  const estimatedTokens = Math.ceil(messageLength / 4);
  current.tokensUsed += estimatedTokens;
  current.messagesCount += 1;
  current.isTrialActive = current.tokensUsed < current.totalTokenLimit;

  saveUsageData(current);
  return current;
}

/**
 * Record tokens from API response
 */
export function recordResponseTokens(tokens: number): UsageData {
  const current = getUsageData();
  current.tokensUsed += tokens;
  current.isTrialActive = current.tokensUsed < current.totalTokenLimit;
  saveUsageData(current);
  return current;
}

/**
 * Get remaining tokens
 */
export function getRemainingTokens(): number {
  const usage = getUsageData();
  return Math.max(0, usage.totalTokenLimit - usage.tokensUsed);
}

/**
 * Check if user has exceeded trial
 */
export function isTrialExhausted(): boolean {
  const usage = getUsageData();
  return usage.tokensUsed >= usage.totalTokenLimit && usage.isTrialActive;
}

/**
 * Get human-readable word estimate
 * Rough conversion: 1 token ≈ 0.75 words
 */
export function getEstimatedWords(tokens: number): number {
  return Math.round(tokens * 0.75);
}

/**
 * Reset usage (for testing or when user upgrades)
 */
export function resetUsageData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get estimated token/word summary
 */
export function getUsageSummary() {
  const usage = getUsageData();
  const remaining = getRemainingTokens();
  const remainingWords = getEstimatedWords(remaining);
  const usedWords = getEstimatedWords(usage.tokensUsed);

  return {
    tokensUsed: usage.tokensUsed,
    tokensRemaining: remaining,
    tokensLimit: usage.totalTokenLimit,
    wordsUsed: usedWords,
    wordsRemaining: remainingWords,
    messagesCount: usage.messagesCount,
    isTrialActive: usage.isTrialActive,
    trialStartedAt: usage.trialStartedAt,
  };
}
