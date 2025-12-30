import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMasculineMentorStore } from '../store/useMasculineMentorStore';
import type { PersonaConfig } from '../../../types/module';
import './PersonaWizard.css';

function PersonaWizard() {
  const { persona, setPersona } = useMasculineMentorStore();
  const [localPersona, setLocalPersona] = useState<PersonaConfig>(persona);

  const handleSliderChange = (key: keyof PersonaConfig, value: number) => {
    setLocalPersona({ ...localPersona, [key]: value });
  };

  const handleToneChange = (tone: PersonaConfig['tone']) => {
    setLocalPersona({ ...localPersona, tone });
  };

  const handleSave = () => {
    setPersona(localPersona);
    alert('Persona saved! Your mentor will now reflect these preferences.');
  };

  const sliders = [
    { key: 'warmth' as const, label: 'Warmth', low: 'Stoic', high: 'Warm' },
    { key: 'firmness' as const, label: 'Firmness', low: 'Soft', high: 'Firm' },
    { key: 'chattiness' as const, label: 'Chattiness', low: 'Minimal', high: 'Chatty' },
    { key: 'humor' as const, label: 'Humor', low: 'Serious', high: 'Humorous' },
    { key: 'challenge' as const, label: 'Challenge', low: 'Supportive', high: 'Challenging' },
  ];

  return (
    <div className="persona-wizard">
      <header className="persona-header">
        <Link to="/masculine-mentor" className="back-button">← Back</Link>
        <h2>Configure Your Mentor</h2>
      </header>

      <div className="persona-content">
        <div className="persona-section">
          <h3>Personality Traits</h3>
          <p className="section-description">
            Adjust these sliders to shape your mentor's personality and coaching style.
          </p>

          {sliders.map(({ key, label, low, high }) => (
            <div key={key} className="slider-group">
              <label>{label}</label>
              <div className="slider-labels">
                <span>{low}</span>
                <span>{high}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={localPersona[key]}
                onChange={(e) => handleSliderChange(key, Number(e.target.value))}
                className="slider"
              />
            </div>
          ))}
        </div>

        <div className="persona-section">
          <h3>Communication Tone</h3>
          <p className="section-description">
            Choose how direct your mentor should be when providing feedback.
          </p>

          <div className="tone-buttons">
            {(['gentle', 'balanced', 'direct'] as const).map((tone) => (
              <button
                key={tone}
                className={`tone-btn ${localPersona.tone === tone ? 'active' : ''}`}
                onClick={() => handleToneChange(tone)}
              >
                {tone.charAt(0).toUpperCase() + tone.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="preview-section">
          <h3>Preview</h3>
          <div className="preview-box">
            <p><strong>Greeting:</strong> {getPreviewGreeting(localPersona)}</p>
            <p><strong>Feedback:</strong> {getPreviewFeedback(localPersona)}</p>
          </div>
        </div>

        <button className="save-btn" onClick={handleSave}>
          Save Configuration
        </button>
      </div>
    </div>
  );
}

function getPreviewGreeting(persona: PersonaConfig): string {
  if (persona.warmth > 70) {
    return "Hey brother, great to see you. What's on your mind today?";
  } else if (persona.warmth < 30) {
    return "Ready. What do you need?";
  }
  return "What's up? How can I help today?";
}

function getPreviewFeedback(persona: PersonaConfig): string {
  if (persona.tone === 'direct' && persona.challenge > 70) {
    return "You already know what you need to do. Stop overthinking and take action.";
  } else if (persona.tone === 'gentle') {
    return "That's a tough situation. Let's think through your options together.";
  }
  return "I hear you. What's the next step that feels right?";
}

export default PersonaWizard;
