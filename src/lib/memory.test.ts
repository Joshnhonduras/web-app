import { describe, expect, it } from 'vitest';
import { detectAbuse, detectCrisis, buildContextSummary, extractFacts } from './memory';
import type { Message } from '../types';

describe('safety detectors', () => {
  it('detects crisis language', () => {
    expect(detectCrisis('I want to kill myself')).toBe(true);
    expect(detectCrisis('life is good')).toBe(false);
  });

  it('detects abuse language', () => {
    expect(detectAbuse('my partner hits me')).toBe(true);
    expect(detectAbuse('we argued yesterday')).toBe(false);
  });
});

describe('conversation facts', () => {
  const base: Message = { id: '1', role: 'user', content: 'My name is Sam and I want to improve focus', timestamp: Date.now() };
  it('extracts and summarizes recent facts', () => {
    const facts = extractFacts([base]);
    expect(facts.length).toBeGreaterThan(0);
    const summary = buildContextSummary(facts);
    expect(summary).toContain('Recent Context');
  });
});
