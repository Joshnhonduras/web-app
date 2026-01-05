import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../lib/store';
import { testAPIConnection } from '../../lib/testConnection';
import VoiceSelector from './components/VoiceSelector';
import ModelSelector from './components/ModelSelector';
import type { APIConfig } from '../../types';
import './Settings.css';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'api' | 'persona' | 'voice' | 'profile' | 'data'>('api');

  return (
    <div className="settings-container">
      <div className="settings-header">
        <Link to="/masculine-mentor" className="back-btn">← Back to Chat</Link>
        <h1>Settings</h1>
      </div>

      <div className="settings-tabs">
        <button 
          className={activeTab === 'api' ? 'active' : ''} 
          onClick={() => setActiveTab('api')}
        >
          API Setup
        </button>
        <button 
          className={activeTab === 'persona' ? 'active' : ''} 
          onClick={() => setActiveTab('persona')}
        >
          Persona
        </button>
        <button 
          className={activeTab === 'voice' ? 'active' : ''} 
          onClick={() => setActiveTab('voice')}
        >
          Voice & Sounds
        </button>
        <button 
          className={activeTab === 'profile' ? 'active' : ''} 
          onClick={() => setActiveTab('profile')}
        >
          About You
        </button>
        <button 
          className={activeTab === 'data' ? 'active' : ''} 
          onClick={() => setActiveTab('data')}
        >
          Privacy
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'api' && <APISettings />}
        {activeTab === 'persona' && <PersonaSettings />}
        {activeTab === 'voice' && <VoiceSettings />}
        {activeTab === 'profile' && <ProfileSettings />}
        {activeTab === 'data' && <DataSettings />}
      </div>
    </div>
  );
}

function APISettings() {
  const { settings, updateSettings } = useStore();
  const [apiKey, setApiKey] = useState(settings.apiConfig.apiKey);
  const [provider, setProvider] = useState<APIConfig['provider']>(settings.apiConfig.provider || 'openrouter');
  const [model, setModel] = useState(settings.apiConfig.model || '');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const isValid = Boolean(provider && apiKey);

  const handleSave = () => {
    if (!isValid) {
      alert('Select a provider and enter an API key first.');
      return;
    }
    updateSettings({
      apiConfig: {
        provider,
        apiKey,
        model,
      },
    });
    alert('API settings saved!');
  };

  const testConnection = async () => {
    setTestStatus('testing');
    const result = await testAPIConnection({ provider, apiKey, model });
    setTestStatus(result.success ? 'success' : 'error');
    if (!result.success) {
      alert(result.message);
    }
  };

  return (
    <div className="settings-section">
      <h2>API Configuration</h2>
      <p className="section-description">
        Connect your AI provider. Don't have one? <Link to="/setup">Check the setup guide</Link>.
      </p>

      <div className="form-group">
        <label>Provider</label>
        <select value={provider ?? ''} onChange={(e: ChangeEvent<HTMLSelectElement>) => setProvider(e.target.value as APIConfig['provider'])}>
          <option value="">-- Select Provider --</option>
          <option value="groq">Groq (FREE - Recommended)</option>
          <option value="openrouter">OpenRouter (Free & Paid options)</option>
          <option value="openai">OpenAI (Paid)</option>
        </select>
      </div>

      <div className="form-group">
        <label>API Key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
          placeholder="sk-..."
        />
        <small>Your key is stored locally and never shared. Enable Private Session in Privacy to avoid persistence.</small>
      </div>

      <ModelSelector
        provider={provider}
        selectedModel={model}
        onSelect={setModel}
      />

      <div className="button-group">
        <button onClick={testConnection} className="secondary-btn">
          {testStatus === 'testing' && 'Testing...'}
          {testStatus === 'success' && '✓ Connected'}
          {testStatus === 'error' && '✗ Failed'}
          {testStatus === 'idle' && 'Test Connection'}
        </button>
        <button onClick={handleSave} className="primary-btn">
          Save API Settings
        </button>
      </div>

      {!isValid && (
        <div className="alert alert-error">
          Choose a provider and enter an API key to enable chat and voice.
        </div>
      )}

      {testStatus === 'error' && (
        <div className="alert alert-error">
          Connection failed. Check your API key and try again.
        </div>
      )}
      {testStatus === 'success' && (
        <div className="alert alert-success">
          Successfully connected to {provider}!
        </div>
      )}
    </div>
  );
}

function PersonaSettings() {
  const { settings, updateSettings } = useStore();
  const [persona, setPersona] = useState(settings.personaConfig);

  const handleChange = (key: keyof typeof persona, value: number) => {
    const newPersona = { ...persona, [key]: value };
    setPersona(newPersona);
  };

  const handleSave = () => {
    updateSettings({ personaConfig: persona });
    alert('Persona settings saved!');
  };

  return (
    <div className="settings-section">
      <h2>Persona Configuration</h2>
      <p className="section-description">
        Adjust how the AI mentor communicates with you. These settings shape the tone and style of responses.
      </p>

      <div className="slider-group">
        <label>Warmth: {persona.warmth}</label>
        <div className="slider-labels">
          <span>Stoic</span>
          <span>Warm</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={persona.warmth}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('warmth', parseInt(e.target.value, 10))}
        />
      </div>

      <div className="slider-group">
        <label>Firmness: {persona.firmness}</label>
        <div className="slider-labels">
          <span>Gentle</span>
          <span>Firm</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={persona.firmness}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('firmness', parseInt(e.target.value, 10))}
        />
      </div>

      <div className="slider-group">
        <label>Verbosity: {persona.verbosity}</label>
        <div className="slider-labels">
          <span>Concise</span>
          <span>Detailed</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={persona.verbosity}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('verbosity', parseInt(e.target.value, 10))}
        />
      </div>

      <div className="slider-group">
        <label>Humor: {persona.humor}</label>
        <div className="slider-labels">
          <span>Serious</span>
          <span>Light</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={persona.humor}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('humor', parseInt(e.target.value, 10))}
        />
      </div>

      <div className="slider-group">
        <label>Directness: {persona.directness}</label>
        <div className="slider-labels">
          <span>Subtle</span>
          <span>Direct</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={persona.directness}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('directness', parseInt(e.target.value, 10))}
        />
      </div>

      <button onClick={handleSave} className="primary-btn">
        Save Persona Settings
      </button>
    </div>
  );
}

function VoiceSettings() {
  const { settings, updateSettings } = useStore();
  const [config, setConfig] = useState(settings.voiceConfig);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundStyle, setSoundStyle] = useState<'default' | 'ios' | 'android'>('default');

  const handleSave = () => {
    updateSettings({ 
      voiceConfig: { 
        ...config, 
        provider: 'browser', // currently supported engine; Piper is auto-detected in the browser
      },
      // TODO: Add sound settings to store
    });
    alert('Voice settings saved!');
  };

  return (
    <div className="settings-section">
      <h2>Voice & Sound Settings</h2>

      <div className="form-group">
        <label>Message Sounds</label>
        <div className="checkbox-group">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSoundEnabled(e.target.checked)}
          />
          <span>Enable notification sounds</span>
        </div>
      </div>

      {soundEnabled && (
        <div className="form-group">
          <label>Sound Style</label>
          <select value={soundStyle} onChange={(e: ChangeEvent<HTMLSelectElement>) => setSoundStyle(e.target.value as 'default' | 'ios' | 'android')}>
            <option value="default">Default</option>
            <option value="ios">iOS Style</option>
            <option value="android">Android Style</option>
          </select>
        </div>
      )}

      <div className="info-box">
        <h3>Voice Engine</h3>
        <p>
          Voice chat currently uses your browser&apos;s speech synthesis. If Piper is running locally, 
          the app will auto-upgrade to that higher-quality engine. Cloud TTS providers will be added later.
        </p>
      </div>

      <div className="slider-group">
        <label>Speech Speed: {config.speed.toFixed(1)}x</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={config.speed}
          onChange={(e) => setConfig({ ...config, speed: parseFloat(e.target.value) })}
        />
      </div>

      <VoiceSelector
        selectedVoice={config.voiceId}
        onSelect={(voiceName) => setConfig({ ...config, voiceId: voiceName })}
      />

      <button onClick={handleSave} className="primary-btn">
        Save Voice Settings
      </button>
    </div>
  );
}

function ProfileSettings() {
  const { settings, updateSettings } = useStore();
  const [profile, setProfile] = useState(settings.userProfile);

  const handleSave = () => {
    updateSettings({ userProfile: profile });
    alert('Profile saved!');
  };

  return (
    <div className="settings-section">
      <h2>About You</h2>
      <p className="section-description">
        Share context about yourself so the AI can provide more relevant guidance. 
        This information is stored locally and never shared.
      </p>

      <div className="form-group">
        <label>Name (Optional)</label>
        <input
          type="text"
          value={profile.name || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, name: e.target.value })}
          placeholder="What should I call you?"
        />
      </div>

      <div className="form-group">
        <label>Age (Optional)</label>
        <input
          type="number"
          value={profile.age || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, age: parseInt(e.target.value, 10) })}
          placeholder="Your age"
        />
      </div>

      <div className="form-group">
        <label>Relationship Status</label>
        <select 
          value={profile.relationshipStatus || ''} 
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setProfile({ ...profile, relationshipStatus: e.target.value })}
        >
          <option value="">Prefer not to say</option>
          <option value="single">Single</option>
          <option value="dating">Dating</option>
          <option value="relationship">In a relationship</option>
          <option value="married">Married</option>
          <option value="complicated">It's complicated</option>
        </select>
      </div>

      <div className="form-group">
        <label>Current Challenges</label>
        <textarea
          value={profile.currentChallenges || ''}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setProfile({ ...profile, currentChallenges: e.target.value })}
          placeholder="What are you working through right now?"
          rows={4}
        />
      </div>

      <div className="form-group">
        <label>Goals</label>
        <textarea
          value={profile.goals || ''}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setProfile({ ...profile, goals: e.target.value })}
          placeholder="What do you want to achieve?"
          rows={4}
        />
      </div>

      <div className="form-group">
        <label>Additional Context</label>
        <textarea
          value={profile.additionalContext || ''}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setProfile({ ...profile, additionalContext: e.target.value })}
          placeholder="Anything else that would be helpful for the AI to know?"
          rows={4}
        />
      </div>

      <button onClick={handleSave} className="primary-btn">
        Save Profile
      </button>
    </div>
  );
}

function DataSettings() {
  const { settings, updateSettings, clearMessages, clearMentorMemory } = useStore();

  const handleClearMessages = () => {
    if (confirm('Are you sure? This will delete all conversation history.')) {
      clearMessages();
      alert('Conversation history cleared!');
    }
  };

  const handleExport = () => {
    const data = localStorage.getItem('growth-hub-storage');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `growth-hub-backup-${Date.now()}.json`;
      a.click();
    }
  };

  const toggleSessionMode = () => {
    const next = !settings.sessionMode;
    if (next) {
      if (!confirm('Enable private session? This stops persisting chat history and removes the stored API key. Data will clear on refresh.')) {
        return;
      }
      localStorage.removeItem('growth-hub-storage');
      updateSettings({ sessionMode: true, apiConfig: { ...settings.apiConfig, apiKey: '' } });
      clearMessages();
    } else {
      updateSettings({ sessionMode: false });
    }
  };

  const wipeAll = () => {
    if (confirm('Wipe all stored data and reload?')) {
      localStorage.removeItem('growth-hub-storage');
      sessionStorage.clear();
      window.location.reload();
    }
  };

  const handleClearMemory = () => {
    if (confirm('Clear the mentor\'s long-term memory while keeping your chat transcripts?')) {
      clearMentorMemory();
      alert('Mentor memory cleared. Future chats will not use past summaries.');
    }
  };

  return (
    <div className="settings-section">
      <h2>Privacy & Data</h2>

      <div className="info-box">
        <h3>Your Data is Private</h3>
        <p>
          All conversations and settings are stored locally on your device. 
          Nothing is sent to our servers. API calls go directly to your chosen provider.
        </p>
      </div>

      <div className="form-group">
        <label>Conversation History</label>
        <button onClick={handleClearMessages} className="danger-btn">
          Clear All Messages
        </button>
      </div>

      <div className="form-group">
        <label>Mentor Memory</label>
        <button onClick={handleClearMemory} className="secondary-btn">
          Clear Mentor Memory
        </button>
        <small>
          Removes long-term summaries the mentor uses across chats, while keeping your saved conversations.
        </small>
      </div>

      <div className="form-group">
        <label>Backup & Export</label>
        <button onClick={handleExport} className="secondary-btn">
          Export All Data
        </button>
        <small>Download a backup of all your settings and conversations</small>
      </div>

      <div className="form-group">
        <label>Private Session</label>
        <button onClick={toggleSessionMode} className={settings.sessionMode ? 'secondary-btn' : 'primary-btn'}>
          {settings.sessionMode ? 'Disable Private Session' : 'Enable Private Session'}
        </button>
        <small>{settings.sessionMode ? 'Currently not persisting messages or API keys.' : 'Keep data local by default; enable private session to avoid persistence.'}</small>
      </div>

      <div className="form-group">
        <label>Wipe Everything</label>
        <button onClick={wipeAll} className="danger-btn">
          Delete All Stored Data
        </button>
      </div>
    </div>
  );
}
