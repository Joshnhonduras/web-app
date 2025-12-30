import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersonaConfig, Message, DailyCheckIn } from '../../../types/module';

interface MasculineMentorState {
  persona: PersonaConfig;
  messages: Message[];
  checkIns: DailyCheckIn[];
  
  setPersona: (persona: PersonaConfig) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  toggleBookmark: (messageId: string) => void;
  addCheckIn: (checkIn: Omit<DailyCheckIn, 'id'>) => void;
  clearMessages: () => void;
}

const defaultPersona: PersonaConfig = {
  warmth: 50,
  firmness: 50,
  chattiness: 50,
  humor: 50,
  challenge: 50,
  tone: 'balanced',
};

export const useMasculineMentorStore = create<MasculineMentorState>()(
  persist(
    (set) => ({
      persona: defaultPersona,
      messages: [],
      checkIns: [],

      setPersona: (persona) => set({ persona }),

      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: crypto.randomUUID(),
              timestamp: new Date(),
            },
          ],
        })),

      toggleBookmark: (messageId) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId
              ? { ...msg, bookmarked: !msg.bookmarked }
              : msg
          ),
        })),

      addCheckIn: (checkIn) =>
        set((state) => ({
          checkIns: [
            ...state.checkIns,
            {
              ...checkIn,
              id: crypto.randomUUID(),
            },
          ],
        })),

      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'masculine-mentor-storage',
    }
  )
);
