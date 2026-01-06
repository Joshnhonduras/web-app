export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface UserProfile {
  name?: string;
  age?: number;
  relationshipStatus?: string;
  currentChallenges?: string;
  goals?: string;
  additionalContext?: string;
}

export interface PersonaConfig {
  warmth: number; // 0-100
  firmness: number;
  verbosity: number;
  humor: number;
  directness: number;
}

export interface APIConfig {
  provider: 'openai' | 'groq' | 'openrouter' | null;
  apiKey: string;
  model?: string;
}

export interface VoiceConfig {
  enabled: boolean;
  provider: 'browser' | 'openai' | 'elevenlabs';
  voiceId?: string;
  speed: number;
  pitch: number;
}

export interface TrialStatus {
  isActive: boolean;
  tokensUsed: number;
  tokensLimit: number;
  startedAt: number | null;
  email?: string;
  createdAt?: number;
}

export interface AppSettings {
  apiConfig: APIConfig;
  voiceConfig: VoiceConfig;
  personaConfig: PersonaConfig;
  userProfile: UserProfile;
  sessionMode?: boolean; // when true, limit or skip persistence
  trial?: TrialStatus;
  theme?: 'light' | 'dark';
}
