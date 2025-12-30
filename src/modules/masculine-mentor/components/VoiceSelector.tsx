import { useState, useEffect } from 'react';
import { voiceManager } from '../../../lib/voiceManager';
import type { VoiceProfile } from '../../../lib/voiceManager';
import './VoiceSelector.css';

interface VoiceSelectorProps {
  onSelect: (voiceName: string) => void;
  selectedVoice?: string;
}

export default function VoiceSelector({ onSelect, selectedVoice }: VoiceSelectorProps) {
  const [maleVoices, setMaleVoices] = useState<VoiceProfile[]>([]);
  const [testingVoice, setTestingVoice] = useState<string | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = voiceManager.getMaleVoices();
      setMaleVoices(voices);
    };

    loadVoices();

    // Voices may load asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const testVoice = (voice: SpeechSynthesisVoice) => {
    setTestingVoice(voice.name);
    
    voiceManager.setVoice(voice.name);
    voiceManager.speak(
      "Hey, this is how I sound. What do you think?",
      {
        onEnd: () => setTestingVoice(null),
        onError: () => setTestingVoice(null),
      }
    );
  };

  const getQualityBadge = (type: string) => {
    switch (type) {
      case 'premium':
        return <span className="quality-badge premium">Premium</span>;
      case 'standard':
        return <span className="quality-badge standard">Good</span>;
      default:
        return <span className="quality-badge basic">Basic</span>;
    }
  };

  return (
    <div className="voice-selector">
      <h3>Available Male Voices</h3>
      <p className="voice-help">
        Select a voice for the AI mentor. Premium voices sound more natural.
      </p>

      {maleVoices.length === 0 ? (
        <div className="no-voices">
          <p>Loading voices...</p>
        </div>
      ) : (
        <div className="voices-list">
          {maleVoices.slice(0, 10).map(({ voice, quality, type }) => (
            <div
              key={voice.name}
              className={`voice-item ${selectedVoice === voice.name ? 'selected' : ''}`}
            >
              <div className="voice-info">
                <div className="voice-header">
                  <span className="voice-name">{voice.name}</span>
                  {getQualityBadge(type)}
                </div>
                <div className="voice-details">
                  <span className="voice-lang">{voice.lang}</span>
                  <span className="voice-local">{voice.localService ? '💾 Local' : '☁️ Remote'}</span>
                </div>
              </div>
              
              <div className="voice-actions">
                <button
                  onClick={() => testVoice(voice)}
                  disabled={testingVoice === voice.name}
                  className="test-btn"
                >
                  {testingVoice === voice.name ? '▶️ Playing...' : '▶️ Test'}
                </button>
                <button
                  onClick={() => onSelect(voice.name)}
                  className="select-btn"
                >
                  {selectedVoice === voice.name ? '✓ Selected' : 'Select'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="voice-tip">
        💡 <strong>Tip:</strong> On Linux, install better voices with:
        <code>sudo apt install espeak-ng speech-dispatcher</code>
      </div>
    </div>
  );
}
