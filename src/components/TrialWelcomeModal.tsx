import { useState, type FormEvent } from 'react';
import { getEstimatedWords, initializeTrial } from '../lib/usage/usageService';
import './TrialWelcomeModal.css';

interface TrialWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailSubmit?: (email: string) => void;
}

const TOKEN_LIMIT = 1000;

export function TrialWelcomeModal({ isOpen, onClose, onEmailSubmit }: TrialWelcomeModalProps) {
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [showApiKeyHelp, setShowApiKeyHelp] = useState(false);
  const estimatedWords = getEstimatedWords(TOKEN_LIMIT);

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      initializeTrial(email);
      setEmailSubmitted(true);
      onEmailSubmit?.(email);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {!emailSubmitted ? (
          // Email verification step
          <>
            <div className="modal-header">
              <h2>🎉 Welcome to GrowthHub!</h2>
              <button className="modal-close" onClick={onClose}>✕</button>
            </div>

            <div className="modal-body">
              <div className="trial-info">
                <p className="trial-headline">
                  Get <strong>1,000 FREE credits</strong> to explore GrowthHub
                </p>
                <p className="trial-subtext">
                  That's approximately <strong>{estimatedWords}-{Math.round(estimatedWords * 1.2)} words</strong> of AI-powered coaching
                </p>
              </div>

              <div className="email-section">
                <p className="email-description">
                  Just verify your email to get started. We use this to prevent abuse and track your free tier usage.
                </p>
                
                <form onSubmit={handleEmailSubmit} className="email-form">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="email-input"
                  />
                  <button type="submit" className="btn btn-primary" disabled={!email.includes('@')}>
                    Start Free Trial
                  </button>
                </form>

                <p className="email-note">
                  We'll never spam you. One email per account to prevent token scalping.
                </p>
              </div>
            </div>
          </>
        ) : !showApiKeyHelp ? (
          // Trial info step (after email)
          <>
            <div className="modal-header">
              <h2>🎉 You're All Set!</h2>
              <button className="modal-close" onClick={onClose}>✕</button>
            </div>

            <div className="modal-body">
              <div className="trial-info">
                <p className="trial-headline">
                  You have <strong>1,000 free credits</strong> to try GrowthHub!
                </p>
                <p className="trial-subtext">
                  Access all modules, courses, and features
                </p>
              </div>

              <div className="what-next">
                <h3>What happens after your free credits?</h3>
                <p>
                  Once you've used your 1,000 free credits, you have two options:
                </p>

                <div className="option-card">
                  <h4>Option 1: Get Your Own FREE API Key (2 Minutes!)</h4>
                  <p>Unlimited access to free models. No credit card ever needed.</p>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setShowApiKeyHelp(true)}
                  >
                    See How (2 min setup) →
                  </button>
                </div>

                <div className="option-card highlight">
                  <h4>✨ Option 2: Become a GrowthPlus Member ($9.99/month)</h4>
                  <p>
                    <strong>Get:</strong> 10,000 additional credits + unlimited access to all current and future modules, courses, and features
                  </p>
                  <a href="#subscribe" className="btn btn-primary">
                    Upgrade to GrowthPlus →
                  </a>
                </div>
              </div>

              <p className="trial-disclaimer">
                💡 <strong>Best value:</strong> Get a free API key from Groq or OpenRouter and have unlimited access forever (completely free).
              </p>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={onClose}>
                Start Exploring
              </button>
            </div>
          </>
        ) : (
          // API key setup guide
          <>
            <div className="modal-header">
              <button 
                className="back-btn"
                onClick={() => setShowApiKeyHelp(false)}
              >
                ← Back
              </button>
              <h2>Get Your Free API Key (2 Minutes)</h2>
              <button className="modal-close" onClick={onClose}>✕</button>
            </div>

            <div className="modal-body">
              <div className="api-guide">
                <div className="guide-section">
                  <h3>✨ Option A: Groq (Recommended - 100% Free & Private)</h3>
                  <ol>
                    <li>Visit <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer">console.groq.com/keys</a></li>
                    <li>Sign up and verify your email</li>
                    <li>Click "Create API Key"</li>
                    <li>Copy the key</li>
                    <li>Come back here and paste it in Settings → API Config</li>
                  </ol>
                  <p className="guide-note">✅ Completely free, unlimited tokens, your conversations stay private, blazing fast</p>
                </div>

                <div className="guide-section">
                  <h3>🚀 Option B: OpenRouter (Free with 20+ Model Options)</h3>
                  <ol>
                    <li>Visit <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer">openrouter.ai/keys</a></li>
                    <li>Sign up and verify your email</li>
                    <li>Create a new API key and copy it</li>
                    <li>Go to <a href="https://openrouter.ai/settings/privacy" target="_blank" rel="noopener noreferrer">Privacy Settings</a> and enable "Allow free model usage"</li>
                    <li>Come back and paste it in Settings → API Config</li>
                  </ol>
                  <p className="guide-note">
                    ✅ Also free and unlimited! More model variety. 
                    ⚠️ Free models may be used for training. For complete privacy, use Groq.
                  </p>
                </div>

                <div className="guide-footer">
                  <p><strong>🏆 Either way, you get unlimited free access forever with just your own free API key.</strong></p>
                  <p>Go to Settings → API Config to add your key anytime.</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowApiKeyHelp(false)}
              >
                ← Back
              </button>
              <button className="btn btn-primary" onClick={onClose}>
                Got It!
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
