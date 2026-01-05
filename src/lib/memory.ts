import type { Message } from '../types';

export interface ExtractedFact {
  category:
    | 'personal'
    | 'challenge'
    | 'goal'
    | 'relationship'
    | 'insight'
    | 'work'
    | 'health'
    | 'habit';
  content: string;
  timestamp: number;
}

/**
 * Extract key facts from conversation history
 * This creates a simple memory system stored locally
 */
export function extractFacts(messages: Message[]): ExtractedFact[] {
  const facts: ExtractedFact[] = [];
  
  // Simple pattern matching for now
  // TODO: Use AI to extract more sophisticated insights
  
  messages.forEach(msg => {
    if (msg.role === 'user') {
      const content = msg.content.toLowerCase();
      
      // Personal information
      if (content.includes('my name is') || content.includes("i'm ") || content.includes("i am ")) {
        facts.push({
          category: 'personal',
          content: msg.content,
          timestamp: msg.timestamp,
        });
      }
      
      // Challenges/struggles
      if (content.includes('struggle') || content.includes('difficult') || 
          content.includes('hard') || content.includes('problem')) {
        facts.push({
          category: 'challenge',
          content: msg.content,
          timestamp: msg.timestamp,
        });
      }
      
      // Goals/aspirations
      if (
        content.includes('want to') ||
        content.includes('goal') ||
        content.includes('trying to') ||
        content.includes('working on') ||
        content.includes('hope to') ||
        content.includes('hoping to') ||
        content.includes('aiming to') ||
        content.includes('my dream is')
      ) {
        facts.push({
          category: 'goal',
          content: msg.content,
          timestamp: msg.timestamp,
        });
      }
      
      // Relationship mentions
      if (content.includes('wife') || content.includes('girlfriend') || 
          content.includes('partner') || content.includes('relationship')) {
        facts.push({
          category: 'relationship',
          content: msg.content,
          timestamp: msg.timestamp,
        });
      }

      // Work/career
      if (
        content.includes('job') ||
        content.includes('work') ||
        content.includes('career') ||
        content.includes('boss') ||
        content.includes('company') ||
        content.includes('business')
      ) {
        facts.push({
          category: 'work',
          content: msg.content,
          timestamp: msg.timestamp,
        });
      }

      // Health/mental state
      if (
        content.includes('anxiety') ||
        content.includes('anxious') ||
        content.includes('depressed') ||
        content.includes('panic') ||
        content.includes('burnout') ||
        content.includes('stressed') ||
        content.includes('mental health') ||
        content.includes('health')
      ) {
        facts.push({
          category: 'health',
          content: msg.content,
          timestamp: msg.timestamp,
        });
      }

      // Habits/routines
      if (
        content.includes('habit') ||
        content.includes('routine') ||
        content.includes('discipline') ||
        content.includes('every day') ||
        content.includes('daily') ||
        content.includes('consistency')
      ) {
        facts.push({
          category: 'habit',
          content: msg.content,
          timestamp: msg.timestamp,
        });
      }
    }
    
    // Extract insights from AI responses
    if (msg.role === 'assistant') {
      const content = msg.content.toLowerCase();
      
      if (content.includes('pattern') || content.includes('notice') || 
          content.includes('seems like') || content.includes('it sounds like')) {
        facts.push({
          category: 'insight',
          content: msg.content,
          timestamp: msg.timestamp,
        });
      }
    }
  });
  
  return facts;
}

/**
 * Build context summary from extracted facts
 */
export function buildContextSummary(facts: ExtractedFact[]): string {
  if (facts.length === 0) return '';

  const priority: Record<ExtractedFact['category'], number> = {
    personal: 0,
    goal: 1,
    relationship: 2,
    work: 3,
    health: 4,
    habit: 5,
    challenge: 6,
    insight: 7,
  };

  const recentFacts = facts.slice(-50);

  const selected = recentFacts
    .slice()
    .sort((a, b) => {
      const pa = priority[a.category];
      const pb = priority[b.category];
      if (pa !== pb) {
        return pa - pb;
      }
      return a.timestamp - b.timestamp;
    })
    .slice(0, 10);

  const summary = `## Recent Context:\n${selected
    .map((f) => `- [${f.category}] ${f.content}`)
    .join('\n')}`;

  return summary;
}

/**
 * Detect crisis/safety keywords
 */
export function detectCrisis(message: string): boolean {
  const crisisKeywords = [
    'kill myself',
    'suicide',
    'end it all',
    'hurt myself',
    'self harm',
    'want to die',
    'better off dead',
    'no point living',
    "can't take this anymore",
    "cant take this anymore",
    "can't do this anymore",
    'cant do this anymore',
    'i give up',
    "i'm done with life",
    'im done with life',
  ];
  
  const messageLower = message.toLowerCase();
  return crisisKeywords.some(keyword => messageLower.includes(keyword));
}

/**
 * Detect abuse/violence keywords
 */
export function detectAbuse(message: string): boolean {
  const abuseKeywords = [
    'hits me',
    'beats me',
    'physically abusive',
    'threatens to kill',
    'punches',
    'violent',
  ];
  
  const messageLower = message.toLowerCase();
  return abuseKeywords.some(keyword => messageLower.includes(keyword));
}
