import { useNavigate } from 'react-router-dom';
import { Button } from './components/ui/button';

export default function Hub() {
  const navigate = useNavigate();

  const modules = [
    {
      id: 'masculine-mentor',
      title: 'Masculine Mentor',
      description: 'A grounded guide for men to build stability, presence, clarity, and relational strength.',
      available: true,
      path: '/masculine-mentor',
      icon: (
        <svg className="h-6 w-6 text-[#8b7355]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'relational-mirror',
      title: 'Relational Mirror',
      description: 'A guided reflective space for couples to explore patterns, triggers, and understanding together.',
      available: false,
      icon: (
        <svg className="h-6 w-6 text-[#6b8e9f]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'relational-bridge',
      title: 'Relational Bridge',
      description: 'A mediated space for partners to share perspectives separately and build understanding safely.',
      available: false,
      icon: (
        <svg className="h-6 w-6 text-[#7a9b76]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#e8e6e3]">
      {/* Hero Section */}
      <section className="flex min-h-[75vh] flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mx-auto max-w-4xl space-y-8">
          <h1 className="font-serif text-5xl font-light leading-tight tracking-tight text-balance md:text-6xl lg:text-7xl">
            A grounded space for growth, clarity, and connection.
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#b8b5b0] md:text-xl">
            Build awareness, emotional maturity, and relational understanding through guided practices.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Button
              onClick={() => navigate('/masculine-mentor')}
              className="bg-[#8b7355] px-8 py-6 text-base font-medium text-white hover:bg-[#9d8164] transition-colors"
            >
              Begin Your Growth
            </Button>

            <button
              onClick={() => document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 text-base font-medium text-[#b8b5b0] hover:text-[#e8e6e3] transition-colors"
            >
              Explore the Modules
            </button>
          </div>
        </div>
      </section>

      {/* Subtle Divider */}
      <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-[#3a3a3a] to-transparent" />

      {/* Modules Section */}
      <section id="modules" className="px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-serif text-3xl font-light tracking-tight md:text-4xl">Pathways for Practice</h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#b8b5b0] md:text-lg">
              Each module offers a structured space for reflection, awareness, and growth.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 pt-8">
            {modules.map((module) => (
              <div
                key={module.id}
                className={`border border-[#2a2a2a] rounded-lg p-8 transition-all ${
                  module.available
                    ? 'bg-[#222222] hover:border-[#3a3a3a] cursor-pointer'
                    : 'bg-[#1a1a1a] opacity-50 cursor-not-allowed'
                }`}
                onClick={() => module.available && module.path && navigate(module.path)}
              >
                {!module.available && (
                  <div className="inline-block mb-4 px-3 py-1 text-xs font-medium text-[#b8b5b0] bg-[#2a2a2a] rounded">
                    COMING SOON
                  </div>
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-opacity-10 mb-4" style={{ backgroundColor: module.icon.props.className.match(/text-\[#[^\]]+\]/)?.[0].replace('text-', 'bg-') }}>
                  {module.icon}
                </div>
                <h3 className="font-serif text-2xl font-light text-[#e8e6e3] mb-4">{module.title}</h3>
                <p className="leading-relaxed text-[#b8b5b0]">{module.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Setup AI Section */}
      <section className="px-6 py-24 lg:py-32 bg-[#161616]">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <h2 className="font-serif text-3xl font-light tracking-tight md:text-4xl">Ready to Get Started?</h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#b8b5b0] md:text-lg">
              Configure your AI provider to unlock full access to all features.
            </p>
          </div>

          <div className="rounded-lg border border-[#2a2a2a] bg-[#222222] p-8 space-y-4 text-center">
            <Button
              onClick={() => navigate('/setup')}
              className="bg-[#8b7355] px-8 py-6 text-base font-medium text-white hover:bg-[#9d8164] transition-colors w-full"
            >
              Set Up Your AI →
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Spacer */}
      <div className="pb-12" />
    </div>
  );
}
