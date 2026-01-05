import { useState } from 'react';
import { useStore } from '../lib/store';
import { buildSystemPrompt } from '../lib/systemPrompt';
import { sendMessage } from '../lib/aiClient';
import { detectCrisis, detectAbuse, extractFacts, buildContextSummary } from '../lib/memory';
import type { Message } from '../types';

export function useChat() {
  const { messages, addMessage, settings, longTermSummary } = useStore();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCrisisWarning, setShowCrisisWarning] = useState(false);

  const playNotificationSound = (type: 'send' | 'receive') => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = type === 'send' ? 800 : 600;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch {
      // Ignore audio errors
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);

    const messageTimestamp = Date.now();
    const pendingHistory: Message[] = [
      ...messages,
      {
        id: '',
        role: 'user',
        content: userMessage,
        timestamp: messageTimestamp,
      },
    ];

    // Safety checks
    if (detectCrisis(userMessage)) {
      addMessage({ role: 'user', content: userMessage });
      addMessage({
        role: 'assistant',
        content:
          "I'm hearing crisis language. Please reach out to trained professionals right now:\n\n" +
          '• Suicide & Crisis Lifeline: 988\n' +
          '• Crisis Text Line: Text HOME to 741741\n' +
          '• Emergency services: 911\n\n' +
          "I care about your safety and can't handle emergencies. Please contact someone who can help immediately.",
      });
      setShowCrisisWarning(true);
      playNotificationSound('send');
      playNotificationSound('receive');
      return;
    }

    if (detectAbuse(userMessage)) {
      addMessage({ role: 'user', content: userMessage });
      addMessage({
        role: 'assistant',
        content:
          "I'm hearing that you may be in a situation involving physical harm or violence. Your safety is the most important thing. Please consider:\n\n" +
          '• National Domestic Violence Hotline: 1-800-799-7233\n' +
          '• Emergency services: 911\n\n' +
          "I can provide emotional support and guidance, but if you're in danger, please reach out to professionals who can help ensure your safety.",
      });
      playNotificationSound('send');
      playNotificationSound('receive');
      return;
    }

    // Check API configuration
    if (!settings.apiConfig.apiKey || !settings.apiConfig.provider) {
      setError('Please configure your API in Settings first.');
      return;
    }

    // Add user message
    addMessage({ role: 'user', content: userMessage });
    playNotificationSound('send');

    setIsLoading(true);

    try {
      const localSummary = buildContextSummary(extractFacts(pendingHistory));
      let systemPrompt = buildSystemPrompt(settings.personaConfig, settings.userProfile);

      if (longTermSummary) {
        systemPrompt += `\n\n## Long-term Memory\n${longTermSummary}`;
      }

      if (localSummary) {
        systemPrompt += `\n\n${localSummary}`;
      }

      // Get AI response with trimmed context
      const response = await sendMessage(
        pendingHistory.slice(-18),
        systemPrompt,
        settings.apiConfig
      );

      addMessage({
        role: 'assistant',
        content: response,
      });

      playNotificationSound('receive');
    } catch (err: unknown) {
      console.error('AI Error:', err);
      const isAbort = err instanceof Error && err.name === 'AbortError';
      const friendlyMessage = isAbort
        ? 'The request timed out. Try again or switch providers.'
        : err instanceof Error
          ? err.message ||
            'The provider returned an error. Double-check your API key, model, and rate limits.'
          : 'Something went wrong talking to your AI provider.';
      setError(friendlyMessage);

      addMessage({
        role: 'assistant',
        content:
          "I'm having trouble connecting right now. Please check your API settings, model choice, or provider status and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const dismissCrisisWarning = () => {
    setShowCrisisWarning(false);
  };

  return {
    input,
    setInput,
    isLoading,
    error,
    showCrisisWarning,
    dismissCrisisWarning,
    handleSendMessage,
    messages,
    settings,
  };
}
