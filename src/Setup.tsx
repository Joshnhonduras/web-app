import { useNavigate } from 'react-router-dom';
import { Button } from './components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function Setup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#e8e6e3]">
      {/* Header */}
      <div className="border-b border-[#2a2a2a] bg-[#161616] px-6 py-6">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => navigate('/')}
            className="mb-6 text-[#b8b5b0] hover:text-[#e8e6e3] transition-colors flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="font-serif text-4xl font-light">Set Up Your AI</h1>
        </div>
      </div>

      {/* Content */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Intro */}
          <div className="space-y-4 text-center">
            <h2 className="font-serif text-2xl font-light">Get Started for FREE</h2>
            <p className="text-[#b8b5b0]">
              You can start using Growth Hub right now with free AI models. Most people find these work great for their needs.
            </p>
          </div>

          <div className="space-y-8">
            {/* Option 1: Groq */}
            <div className="border border-[#2a2a2a] rounded-lg bg-[#222222] p-8 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8b7355]/10">
                    <svg className="h-5 w-5 text-[#8b7355]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl font-light text-[#e8e6e3]">Option 1: Groq (Recommended)</h3>
                </div>
                <p className="text-sm text-[#b8b5b0] pl-13">100% Free • Super Fast • Complete Privacy</p>
              </div>

              <ol className="space-y-3 pl-4 list-decimal text-[#b8b5b0]">
                <li>
                  Visit{' '}
                  <a href="https://console.groq.com" target="_blank" rel="noopener" className="text-[#8b7355] hover:text-[#9d8164] transition-colors">
                    console.groq.com
                  </a>{' '}
                  and create an account
                </li>
                <li>Navigate to the API Keys section</li>
                <li>Click "Create API Key"</li>
                <li>Copy the key and paste it in Settings</li>
              </ol>

              <div className="flex gap-2 rounded-lg bg-[#1a1a1a] p-3 text-sm text-[#b8b5b0]">
                <CheckCircle2 className="h-5 w-5 text-[#8b7355] flex-shrink-0" />
                <span>Completely free, unlimited tokens, your conversations stay private</span>
              </div>
            </div>

            {/* Option 2: OpenRouter */}
            <div className="border border-[#2a2a2a] rounded-lg bg-[#222222] p-8 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6b8e9f]/10">
                    <svg className="h-5 w-5 text-[#6b8e9f]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl font-light text-[#e8e6e3]">Option 2: OpenRouter</h3>
                </div>
                <p className="text-sm text-[#b8b5b0] pl-13">Free & Paid Models • 20+ Model Variety</p>
              </div>

              <ol className="space-y-3 pl-4 list-decimal text-[#b8b5b0]">
                <li>
                  Visit{' '}
                  <a href="https://openrouter.ai" target="_blank" rel="noopener" className="text-[#6b8e9f] hover:text-[#7a9ba8] transition-colors">
                    openrouter.ai
                  </a>{' '}
                  and sign up
                </li>
                <li>Go to Keys section and create a new API key</li>
                <li>
                  Visit{' '}
                  <a href="https://openrouter.ai/settings/privacy" target="_blank" rel="noopener" className="text-[#6b8e9f] hover:text-[#7a9ba8] transition-colors">
                    Privacy Settings
                  </a>
                </li>
                <li>Enable "Allow free model usage"</li>
                <li>Copy your API key and add it in Settings</li>
                <li>Select a free model (ends with :free)</li>
              </ol>

              <div className="rounded-lg bg-[#2a2416] p-3 border border-[#6b6a62]/20 text-sm text-[#b8b5b0]">
                <p className="font-medium text-[#d4a574] mb-1">⚠️ Privacy Note</p>
                <p>Free OpenRouter models may use your data for training. For complete privacy, use Groq or paid models.</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="rounded-lg border border-[#2a2a2a] bg-[#222222] p-8 space-y-4">
            <h3 className="font-serif text-lg font-light text-[#e8e6e3]">Ready to Start?</h3>
            <p className="text-[#b8b5b0]">
              Once you have your API key, go to Settings to complete the setup. You'll have instant access to all modules and features.
            </p>
            <Button
              onClick={() => navigate('/masculine-mentor/settings')}
              className="bg-[#8b7355] px-8 py-6 text-base font-medium text-white hover:bg-[#9d8164] transition-colors w-full"
            >
              Continue to Settings →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
