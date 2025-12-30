# Growth Hub Web App

A fresh TypeScript and React web application for personal growth and emotional mastery.

## Features

### The Hub
Central dashboard where users can access all modules and tools.

### Masculine Mentor Module
AI coach for grounded confidence, discipline, and emotional steadiness.

**Features:**
- **Persona Configuration** - Customize your mentor's personality across 5 trait axes (warmth, firmness, chattiness, humor, challenge) and 3 tone levels (gentle, balanced, direct)
- **Chat Mentor** - Text-based conversations with your AI mentor
- **Daily Check-Ins** - Track mood, reflections, and build streaks
- **Grounding Tools** - Breathing exercises, tension release, focus resets, and daily mantras

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Routing:** React Router v7
- **State Management:** Zustand with persistence
- **Data Fetching:** TanStack Query
- **Styling:** CSS Modules

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 8+

### Installation

```bash
npm install --include=dev
```

### Development

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── modules/
│   ├── hub/                    # Central dashboard module
│   │   ├── Hub.tsx
│   │   └── Hub.css
│   └── masculine-mentor/       # Masculine Mentor module
│       ├── MasculineMentor.tsx
│       ├── components/
│       │   ├── Chat.tsx
│       │   ├── PersonaWizard.tsx
│       │   ├── DailyCheckIn.tsx
│       │   └── Tools.tsx
│       └── store/
│           └── useMasculineMentorStore.ts
├── types/
│   └── module.ts               # Shared TypeScript interfaces
├── lib/
│   └── modules.ts              # Module registry
├── App.tsx                     # Main app component
└── main.tsx                    # Entry point
```

## Architecture Principles

- **Modular Independence:** Each module is self-contained with its own state, routes, and components
- **Type Safety:** Full TypeScript coverage with strict type checking
- **Local-First:** Data stored locally using Zustand persistence
- **No Cross-Module Leakage:** Modules communicate only through shared utilities

## Core Principles (from Growth Hub Constitution)

1. **Intent-Driven Development** - Elevate emotional maturity and personal stability
2. **User Respect & Dignity** - Emotionally neutral, judgment-free guidance
3. **Safety & Boundaries** - Clear disclaimers, crisis detection
4. **Privacy & Data Boundaries** - Local-first storage, explicit consent
5. **Professional Standards** - Modern best practices and patterns

## Future Modules

The architecture supports easy addition of new modules:
- Relationship Intelligence
- Relationship Mediator
- Additional growth tools

## Version

1.0.0 - Initial Release
Built with clarity and purpose.
