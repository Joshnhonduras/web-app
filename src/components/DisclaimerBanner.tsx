import { useState } from 'react';
import { getDisclaimerAcknowledgment, acknowledgeDisclaimers, getAllDisclaimers, formatDisclaimer } from '../lib/legal/disclaimers';
import './DisclaimerBanner.css';

interface DisclaimerBannerProps {
  onAcknowledge?: () => void;
  variant?: 'banner' | 'modal';
}

export function DisclaimerBanner({ onAcknowledge, variant = 'banner' }: DisclaimerBannerProps) {
  const [isVisible, setIsVisible] = useState(() => {
    const ack = getDisclaimerAcknowledgment();
    return !ack.acknowledged;
  });
  const [expanded, setExpanded] = useState(false);

  const disclaimers = getAllDisclaimers();

  const handleAcknowledge = () => {
    acknowledgeDisclaimers();
    setIsVisible(false);
    onAcknowledge?.();
  };

  if (!isVisible) {
    return null;
  }

  if (variant === 'modal') {
    return (
      <div className="disclaimer-modal-overlay">
        <div className="disclaimer-modal">
          <h2>Important Disclaimers</h2>
          
          <div className="disclaimer-content">
            {disclaimers.map((disclaimer, idx) => (
              <div key={idx} className="disclaimer-section">
                {formatDisclaimer(disclaimer).split('\n').map((line, lineIdx) => (
                  <p key={lineIdx} className={line.startsWith('•') ? 'bullet' : ''}>
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="disclaimer-actions">
            <label className="checkbox-label">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    handleAcknowledge();
                  }
                }}
              />
              I acknowledge and agree to the disclaimers above
            </label>
          </div>
        </div>
      </div>
    );
  }

  // Banner variant
  return (
    <div className="disclaimer-banner">
      <div className="disclaimer-banner-content">
        <div className="disclaimer-icon">⚠️</div>
        <div className="disclaimer-text">
          <strong>Important:</strong> Growth Hub is an AI assistant, not a substitute for professional mental health care.
          {!expanded && (
            <button
              className="expand-btn"
              onClick={() => setExpanded(true)}
            >
              Read full disclaimer
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="disclaimer-expanded">
          <div className="disclaimer-full-content">
            {disclaimers.map((disclaimer, idx) => (
              <div key={idx} className="disclaimer-section">
                {formatDisclaimer(disclaimer).split('\n').map((line, lineIdx) => (
                  line.trim() && (
                    <p key={lineIdx} className={line.trim().startsWith('•') ? 'bullet' : ''}>
                      {line.trim()}
                    </p>
                  )
                ))}
              </div>
            ))}
          </div>

          <div className="disclaimer-actions">
            <label className="checkbox-label">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    handleAcknowledge();
                  }
                }}
              />
              I acknowledge the disclaimers above
            </label>

            <button
              className="collapse-btn"
              onClick={() => setExpanded(false)}
            >
              Hide details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
