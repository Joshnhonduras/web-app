import type { Module } from '../types/module';

export const modules: Module[] = [
  {
    id: 'hub',
    name: 'The Hub',
    description: 'Central dashboard and module manager',
    icon: '🏠',
    path: '/',
    isPremium: false,
  },
  {
    id: 'masculine-mentor',
    name: 'Masculine Mentor',
    description: 'AI coach for grounded confidence, discipline, and emotional steadiness',
    icon: '💪',
    path: '/masculine-mentor',
    isPremium: true,
  },
];

export const getModuleById = (id: string): Module | undefined => {
  return modules.find((m) => m.id === id);
};
