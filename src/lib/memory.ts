import type { Message } from '../types';

export interface ExtractedFact {
  category: 'personal' | 'challenge' | 'goal' | 'relationship' | 'insight';
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
      if (content.includes('want to') || content.includes('goal') || 
          content.includes('trying to') || content.includes('working on')) {
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
  
  const recentFacts = facts.slice(-10); // Last 10 facts
  
  const summary = `## Recent Context:\n${recentFacts.map(f => `- [${f.category}] ${f.content}`).join('\n')}`;
  
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
