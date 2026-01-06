import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#e8e6e3]">
      {/* Hero Section */}
      <section className="flex min-h-[85vh] flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mx-auto max-w-4xl space-y-8">
          <h1 className="font-serif text-5xl font-light leading-tight tracking-tight text-balance md:text-6xl lg:text-7xl">
            A grounded space for growth, clarity, and connection.
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#b8b5b0] md:text-xl">
            Build awareness, emotional maturity, and relational understanding through guided practices.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-[#8b7355] px-8 py-6 text-base font-medium text-white hover:bg-[#9d8164] transition-colors"
            >
              Begin Your Growth
            </Button>

            <Link
              href="#modules"
              className="px-8 py-3 text-base font-medium text-[#b8b5b0] hover:text-[#e8e6e3] transition-colors"
            >
              Explore the Modules
            </Link>
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
            {/* Module 1: Masculine Mentor */}
            <Card className="border-[#2a2a2a] bg-[#222222] transition-all hover:border-[#3a3a3a]">
              <CardContent className="p-8 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#8b7355]/10">
                  <svg
                    className="h-6 w-6 text-[#8b7355]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>

                <h3 className="font-serif text-2xl font-light text-[#e8e6e3]">Masculine Mentor</h3>

                <p className="leading-relaxed text-[#b8b5b0]">
                  A grounded guide for men to build stability, presence, clarity, and relational strength.
                </p>
              </CardContent>
            </Card>

            {/* Module 2: Relational Mirror */}
            <Card className="border-[#2a2a2a] bg-[#222222] transition-all hover:border-[#3a3a3a]">
              <CardContent className="p-8 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#6b8e9f]/10">
                  <svg
                    className="h-6 w-6 text-[#6b8e9f]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>

                <h3 className="font-serif text-2xl font-light text-[#e8e6e3]">Relational Mirror</h3>

                <p className="leading-relaxed text-[#b8b5b0]">
                  A guided reflective space for couples to explore patterns, triggers, and understanding together.
                </p>
              </CardContent>
            </Card>

            {/* Module 3: Relational Bridge */}
            <Card className="border-[#2a2a2a] bg-[#222222] transition-all hover:border-[#3a3a3a] md:col-span-2 lg:col-span-1">
              <CardContent className="p-8 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#7a9b76]/10">
                  <svg
                    className="h-6 w-6 text-[#7a9b76]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>

                <h3 className="font-serif text-2xl font-light text-[#e8e6e3]">Relational Bridge</h3>

                <p className="leading-relaxed text-[#b8b5b0]">
                  A mediated space for partners to share perspectives separately and build understanding safely.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Setup AI Section */}
      <section className="px-6 py-24 lg:py-32 bg-[#161616]">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-serif text-3xl font-light tracking-tight md:text-4xl">Set Up Your AI</h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#b8b5b0] md:text-lg">
              Get started for free with powerful AI models. Most people find these work great for their needs.
            </p>
          </div>

          <div className="space-y-8">
            {/* Option 1: Groq */}
            <Card className="border-[#2a2a2a] bg-[#222222]">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8b7355]/10">
                      <svg
                        className="h-5 w-5 text-[#8b7355]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-serif text-xl font-light text-[#e8e6e3]">Option 1: Groq (Recommended)</h3>
                  </div>
                  <p className="text-sm text-[#b8b5b0] pl-13">100% Free • Super Fast • Complete Privacy</p>
                </div>

                <ol className="space-y-3 pl-4 list-decimal text-[#b8b5b0]">
                  <li>Visit <a href="https://console.groq.com" target="_blank" rel="noopener" className="text-[#8b7355] hover:text-[#9d8164] transition-colors">console.groq.com</a> and create an account</li>
                  <li>Navigate to the API Keys section</li>
                  <li>Click "Create API Key"</li>
                  <li>Copy the key and paste it in Settings</li>
                </ol>

                <div className="flex gap-2 rounded-lg bg-[#1a1a1a] p-3 text-sm text-[#b8b5b0]">
                  <CheckCircle2 className="h-5 w-5 text-[#8b7355] flex-shrink-0" />
                  <span>Completely free, unlimited tokens, your conversations stay private</span>
                </div>
              </CardContent>
            </Card>

            {/* Option 2: OpenRouter */}
            <Card className="border-[#2a2a2a] bg-[#222222]">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6b8e9f]/10">
                      <svg
                        className="h-5 w-5 text-[#6b8e9f]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-serif text-xl font-light text-[#e8e6e3]">Option 2: OpenRouter</h3>
                  </div>
                  <p className="text-sm text-[#b8b5b0] pl-13">Free & Paid Models • 20+ Model Variety</p>
                </div>

                <ol className="space-y-3 pl-4 list-decimal text-[#b8b5b0]">
                  <li>Visit <a href="https://openrouter.ai" target="_blank" rel="noopener" className="text-[#6b8e9f] hover:text-[#7a9ba8] transition-colors">openrouter.ai</a> and sign up</li>
                  <li>Go to Keys section and create a new API key</li>
                  <li>Visit <a href="https://openrouter.ai/settings/privacy" target="_blank" rel="noopener" className="text-[#6b8e9f] hover:text-[#7a9ba8] transition-colors">Privacy Settings</a></li>
                  <li>Enable "Allow free model usage"</li>
                  <li>Copy your API key and add it in Settings</li>
                  <li>Select a free model (ends with :free)</li>
                </ol>

                <div className="rounded-lg bg-[#2a2416] p-3 border border-[#6b6a62]/20 text-sm text-[#b8b5b0]">
                  <p className="font-medium text-[#d4a574] mb-1">⚠️ Privacy Note</p>
                  <p>Free OpenRouter models may use your data for training. For complete privacy, use Groq or paid models.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <div className="rounded-lg border border-[#2a2a2a] bg-[#222222] p-8 space-y-4">
            <h3 className="font-serif text-lg font-light text-[#e8e6e3]">Ready to Start?</h3>
            <p className="text-[#b8b5b0]">
              Once you have your API key, go to Settings to complete the setup. You'll have instant access to all modules and features.
            </p>
            <Button
              size="lg"
              className="bg-[#8b7355] px-8 py-6 text-base font-medium text-white hover:bg-[#9d8164] transition-colors w-full"
            >
              Continue to Settings →
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Spacer */}
      <div className="pb-12" />
    </div>
  )
}
