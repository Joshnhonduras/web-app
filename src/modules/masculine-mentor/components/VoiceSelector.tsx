import { useState, useEffect } from 'react';
import { voiceManager } from '../../../lib/voiceManager';
import type { VoiceEngine, VoiceProfile } from '../../../lib/voiceManager';
import './VoiceSelector.css';

interface VoiceSelectorProps {
  onSelect: (voiceName: string) => void;
  selectedVoice?: string;
}

export default function VoiceSelector({ onSelect, selectedVoice }: VoiceSelectorProps) {
  const [maleVoices, setMaleVoices] = useState<VoiceProfile[]>([]);
  const [testingVoice, setTestingVoice] = useState<string | null>(null);
  const [engine, setEngine] = useState<VoiceEngine>('browser');
  const [piperAvailable, setPiperAvailable] = useState(false);
  const [checkingPiper, setCheckingPiper] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const voices = voiceManager.getMaleVoices();
      setMaleVoices(voices);
    };

    loadVoices();
    setEngine(voiceManager.getEngine());

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
  
  const testPiper = () => {
    setTestingVoice('piper');
    voiceManager.speak(
      "Hey, this is Piper, a high-quality neural voice. I sound much more natural than browser voices.",
      {
        onEnd: () => setTestingVoice(null),
        onError: () => setTestingVoice(null),
      }
    );
  };

  const checkPiper = async () => {
    setCheckingPiper(true);
    try {
      const available = await voiceManager.isPiperAvailable();
      setPiperAvailable(available);
      if (available) {
        switchEngine('piper');
      }
    } finally {
      setCheckingPiper(false);
    }
  };
  
  const switchEngine = (newEngine: VoiceEngine) => {
    setEngine(newEngine);
    voiceManager.setEngine(newEngine);
    if (newEngine === 'piper') {
      onSelect('piper');
    }
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
      <h3>Voice Engine</h3>
      
      <div className="engine-selector">
        <div className={`engine-option ${engine === 'piper' ? 'selected' : ''}`}>
          <button onClick={checkPiper} className="engine-btn">
            <span className="engine-icon">🎤</span>
            <div className="engine-info">
              <strong>Piper Neural TTS</strong>
              <small>{piperAvailable ? 'Available locally' : 'Click to check availability'}</small>
            </div>
            {engine === 'piper' && piperAvailable && <span className="check">✓</span>}
          </button>
          <button onClick={testPiper} disabled={testingVoice === 'piper' || !piperAvailable} className="test-btn">
            {testingVoice === 'piper' ? '▶️ Playing...' : '▶️ Test'}
          </button>
          {checkingPiper && <small>Checking for Piper server...</small>}
        </div>
        
        <div className={`engine-option ${engine === 'browser' ? 'selected' : ''}`}>
          <button onClick={() => switchEngine('browser')} className="engine-btn">
            <span className="engine-icon">🔊</span>
            <div className="engine-info">
              <strong>Browser TTS</strong>
              <small>Built-in voice synthesis</small>
            </div>
            {engine === 'browser' && <span className="check">✓</span>}
          </button>
        </div>
      </div>

      {engine === 'browser' && (
        <>
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
              {maleVoices.slice(0, 10).map(({ voice, type }) => (
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
        </>
      )}

      {!piperAvailable && (
        <div className="voice-tip">
          💡 <strong>Want better voices?</strong> Start the Piper TTS server:
          <code>python3 piper-server.py</code>
        </div>
      )}
    </div>
  );
}
