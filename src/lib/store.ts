import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { extractFacts, buildContextSummary } from './memory';
import type { Message, AppSettings } from '../types';

interface ConversationMeta {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  summary: string;
  messages: Message[];
  includedInMemory: boolean;
}

interface AppStore {
  messages: Message[];
  settings: AppSettings;
  conversations: ConversationMeta[];
  longTermSummary: string;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  archiveConversation: (options?: { title?: string; includeInMemory?: boolean }) => void;
  loadConversation: (id: string) => void;
  clearMentorMemory: () => void;
  renameConversation: (id: string, title: string) => void;
  setConversationMemoryFlag: (id: string, includedInMemory: boolean) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      messages: [],
      settings: {
        apiConfig: {
          provider: null,
          apiKey: '',
        },
        voiceConfig: {
          enabled: false,
          provider: 'browser',
          speed: 1.0,
          pitch: 1.0,
        },
        personaConfig: {
          warmth: 50,
          firmness: 50,
          verbosity: 50,
          humor: 30,
          directness: 60,
        },
        userProfile: {},
        sessionMode: false,
      },
      conversations: [],
      longTermSummary: '',
      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: safeId(),
              timestamp: Date.now(),
            },
          ].slice(-200), // keep last 200 messages to avoid unbounded growth
        })),
      clearMessages: () => set({ messages: [] }),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
            apiConfig: { ...state.settings.apiConfig, ...newSettings.apiConfig },
            voiceConfig: { ...state.settings.voiceConfig, ...newSettings.voiceConfig },
            personaConfig: { ...state.settings.personaConfig, ...newSettings.personaConfig },
            userProfile: { ...state.settings.userProfile, ...newSettings.userProfile },
          },
        })),
      archiveConversation: (options) =>
        set((state) => {
          if (state.messages.length === 0) {
            return state;
          }

          const createdAt = state.messages[0]?.timestamp ?? Date.now();
          const updatedAt = state.messages[state.messages.length - 1]?.timestamp ?? createdAt;
          const firstUser = state.messages.find((m) => m.role === 'user');
          const autoTitle =
            firstUser?.content.slice(0, 60) || new Date(createdAt).toLocaleString();
          const finalTitle = options?.title?.trim() || autoTitle;
          const includeInMemory = options?.includeInMemory ?? true;

          const facts = extractFacts(state.messages);
          const summary = buildContextSummary(facts);

          const archivedMessages = state.messages.slice(-30);

          const conversation: ConversationMeta = {
            id: safeId(),
            title: finalTitle,
            createdAt,
            updatedAt,
            summary,
            messages: archivedMessages,
            includedInMemory: includeInMemory,
          };

          const combinedSummary = includeInMemory
            ? [state.longTermSummary, summary].filter(Boolean).join('\n')
            : state.longTermSummary;

          return {
            ...state,
            conversations: [...state.conversations, conversation],
            longTermSummary: combinedSummary.slice(-4000), // cap stored summary length
            messages: [],
          };
        }),
      loadConversation: (id) =>
        set((state) => {
          const conversation = state.conversations.find((c) => c.id === id);
          if (!conversation) {
            return state;
          }
          return {
            ...state,
            messages: conversation.messages,
          };
        }),
      clearMentorMemory: () =>
        set((state) => ({
          ...state,
          longTermSummary: '',
        })),
      renameConversation: (id, title) =>
        set((state) => ({
          ...state,
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title: title.trim() || c.title } : c
          ),
        })),
      setConversationMemoryFlag: (id, includedInMemory) =>
        set((state) => {
          const conversations = state.conversations.map((c) =>
            c.id === id ? { ...c, includedInMemory } : c
          );

          const summaries = conversations
            .filter((c) => c.includedInMemory && c.summary)
            .map((c) => c.summary);

          const longTermSummary = summaries.join('\n').slice(-4000);

          return {
            ...state,
            conversations,
            longTermSummary,
          };
        }),
    }),
    {
      name: 'growth-hub-storage',
      partialize: (state) => {
        if (state.settings.sessionMode) {
          // In session mode, avoid persisting sensitive data or long-term memory
          return {
            settings: {
              ...state.settings,
              apiConfig: { ...state.settings.apiConfig, apiKey: '' },
            },
            messages: [],
            conversations: [],
            longTermSummary: '',
          };
        }
        return state;
      },
    }
  )
);

function safeId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
