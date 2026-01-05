/**
 * Trial Exhaustion Message Component
 * Shown when user has used all 1,000 free credits
 */

import { useState } from 'react';
import './TrialExhaustedModal.css';

interface TrialExhaustedModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onShowApiKeyGuide?: () => void;
}

export function TrialExhaustedModal({ 
  isOpen, 
  onClose,
  onShowApiKeyGuide 
}: TrialExhaustedModalProps) {
  const [showApiGuide, setShowApiGuide] = useState(false);

  if (!isOpen) return null;

  const handleApiGuideClick = () => {
    setShowApiGuide(true);
    onShowApiKeyGuide?.();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content exhausted">
        {!showApiGuide ? (
          <>
            <div className="modal-header">
              <h2>You've Used Your Free Credits</h2>
            </div>

            <div className="modal-body">
              <div className="exhausted-message">
                <p className="exhausted-headline">
                  Ready for unlimited access?
                </p>
                <p className="exhausted-subtext">
                  Join GrowthPlus for just <strong>$9.99/month</strong> and get 10,000 additional credits 
                  to continue your journey with full access to all modules, courses, and features.
                </p>
              </div>

              <div className="options-grid">
                <div className="option-card primary">
                  <h3>✨ Become a GrowthPlus Member</h3>
                  <p className="price">$9.99/month</p>
                  <ul className="benefits">
                    <li>10,000 additional credits monthly</li>
                    <li>All current & future modules</li>
                    <li>All courses & features</li>
                    <li>Cancel anytime</li>
                  </ul>
                  <a href="#subscribe" className="btn btn-primary">
                    Join GrowthPlus Now
                  </a>
                </div>

                <div className="option-card">
                  <h3>💎 Get Unlimited Free</h3>
                  <p className="price">FREE</p>
                  <p className="desc">Your own API key</p>
                  <p className="subtext">
                    Unlimited access forever. 100% free with Groq or OpenRouter.
                    Quick setup—just 2 minutes.
                  </p>
                  <button 
                    className="btn btn-secondary"
                    onClick={handleApiGuideClick}
                  >
                    Show Me How
                  </button>
                </div>
              </div>

              <div className="info-box">
                <p>
                  <strong>💰 Founding Member Lock-In:</strong> As GrowthHub expands, the membership fee 
                  may increase, but this is the founding member price. Once you join, your price 
                  is locked in—it will never increase.
                </p>
              </div>
            </div>

            {onClose && (
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={onClose}>
                  Close
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="modal-header">
              <button 
                className="back-btn"
                onClick={() => setShowApiGuide(false)}
              >
                ← Back
              </button>
              <h2>Get Your Free API Key (2 Minutes)</h2>
            </div>

            <div className="modal-body">
              <div className="api-guide">
                <div className="guide-section">
                  <h3>✨ Option A: Groq (Recommended)</h3>
                  <ol>
                    <li>Visit <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer">console.groq.com/keys</a></li>
                    <li>Sign up and verify your email</li>
                    <li>Click "Create API Key"</li>
                    <li>Copy the key and come back here</li>
                    <li>Paste it in Settings → API Config</li>
                  </ol>
                  <p className="guide-note">Free, unlimited, private, fast</p>
                </div>

                <div className="guide-section">
                  <h3>🚀 Option B: OpenRouter</h3>
                  <ol>
                    <li>Visit <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer">openrouter.ai/keys</a></li>
                    <li>Sign up and verify your email</li>
                    <li>Create API key, copy it</li>
                    <li>Enable free models in <a href="https://openrouter.ai/settings/privacy" target="_blank" rel="noopener noreferrer">Privacy Settings</a></li>
                    <li>Paste it in Settings → API Config</li>
                  </ol>
                  <p className="guide-note">Free, unlimited, 20+ models</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowApiGuide(false)}
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
