export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  isPremium: boolean;
}

export interface PersonaConfig {
  warmth: number; // 0-100: stoic to warm
  firmness: number; // 0-100: soft to firm
  chattiness: number; // 0-100: minimal to chatty
  humor: number; // 0-100: serious to humorous
  challenge: number; // 0-100: supportive to challenging
  tone: 'gentle' | 'balanced' | 'direct';
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  bookmarked?: boolean;
}

export interface DailyCheckIn {
  id: string;
  date: Date;
  mood: number; // 1-5
  reflection: string;
  followUp?: string;
}
