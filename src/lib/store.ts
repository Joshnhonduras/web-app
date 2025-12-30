import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Message, AppSettings } from '../types';

interface AppStore {
  messages: Message[];
  settings: AppSettings;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
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
      },
      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: Date.now().toString(),
              timestamp: Date.now(),
            },
          ],
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
    }),
    {
      name: 'growth-hub-storage',
    }
  )
);
