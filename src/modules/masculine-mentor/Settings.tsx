import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../lib/store';
import { testAPIConnection } from '../../lib/testConnection';
import VoiceSelector from './components/VoiceSelector';
import ModelSelector from './components/ModelSelector';
import type { APIConfig } from '../../types';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'api' | 'persona' | 'voice' | 'profile' | 'appearance' | 'data'>('api');
  const { settings } = useStore();
  const currentTheme = settings.theme || 'dark';

  return (
    <div className={currentTheme === 'light' ? 'min-h-screen bg-white text-gray-900' : 'min-h-screen bg-[#1a1a1a] text-[#e8e6e3]'}>
      {/* Header */}
      <div className={currentTheme === 'light' ? 'border-b border-gray-200 bg-gray-50 px-6 py-6' : 'border-b border-[#2a2a2a] bg-[#161616] px-6 py-6'}>
        <div className="mx-auto max-w-6xl">
          <Link to="/masculine-mentor" className={currentTheme === 'light' ? 'mb-6 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2' : 'mb-6 text-[#b8b5b0] hover:text-[#e8e6e3] transition-colors flex items-center gap-2'}>
            ← Back to Chat
          </Link>
          <h1 className="font-serif text-4xl font-light">Settings</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className={currentTheme === 'light' ? 'border-b border-gray-200 bg-gray-50 px-6 py-0' : 'border-b border-[#2a2a2a] bg-[#161616] px-6 py-0'}>
        <div className="mx-auto max-w-6xl flex gap-8">
          {(['api', 'persona', 'voice', 'profile', 'appearance', 'data'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-0 py-4 border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? currentTheme === 'light' ? 'border-blue-600 text-gray-900' : 'border-[#8b7355] text-[#e8e6e3]'
                  : currentTheme === 'light' ? 'border-transparent text-gray-600 hover:text-gray-900' : 'border-transparent text-[#b8b5b0] hover:text-[#e8e6e3]'
              }`}
            >
              {tab === 'api' && 'API Setup'}
              {tab === 'persona' && 'Persona'}
              {tab === 'voice' && 'Voice & Sounds'}
              {tab === 'profile' && 'About You'}
              {tab === 'appearance' && 'Appearance'}
              {tab === 'data' && 'Privacy'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={currentTheme === 'light' ? 'px-6 py-12 bg-white' : 'px-6 py-12'}>
        <div className="mx-auto max-w-6xl">
          {activeTab === 'api' && <APISettings theme={currentTheme} />}
          {activeTab === 'persona' && <PersonaSettings theme={currentTheme} />}
          {activeTab === 'voice' && <VoiceSettings theme={currentTheme} />}
          {activeTab === 'profile' && <ProfileSettings theme={currentTheme} />}
          {activeTab === 'appearance' && <AppearanceSettings theme={currentTheme} />}
          {activeTab === 'data' && <DataSettings theme={currentTheme} />}
        </div>
      </div>
    </div>
  );
}

function APISettings({ theme }: { theme: 'light' | 'dark' }) {
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
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-light mb-2">API Configuration</h2>
        <p className="text-[#b8b5b0]">
          Connect your AI provider. Don't have one? <Link to="/setup" className="text-[#8b7355] hover:text-[#9d8164]">Check the setup guide</Link>.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Provider</label>
          <select 
            value={provider ?? ''} 
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setProvider(e.target.value as APIConfig['provider'])}
            className="w-full bg-[#222222] border border-[#2a2a2a] rounded-lg px-4 py-2 text-[#e8e6e3] hover:border-[#3a3a3a] transition-colors"
          >
            <option value="">-- Select Provider --</option>
            <option value="groq">Groq (FREE - Recommended)</option>
            <option value="openrouter">OpenRouter (Free & Paid options)</option>
            <option value="openai">OpenAI (Paid)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full bg-[#222222] border border-[#2a2a2a] rounded-lg px-4 py-2 text-[#e8e6e3] hover:border-[#3a3a3a] transition-colors"
          />
          <p className="text-xs text-[#b8b5b0] mt-2">Your key is stored locally and never shared. Enable Private Session in Privacy to avoid persistence.</p>
        </div>

        <ModelSelector
          provider={provider}
          selectedModel={model}
          onSelect={setModel}
        />
      </div>

      <div className="flex gap-4">
        <button 
          onClick={testConnection}
          className="px-6 py-2 rounded-lg border border-[#2a2a2a] bg-[#222222] hover:bg-[#2a2a2a] transition-colors"
        >
          {testStatus === 'testing' && 'Testing...'}
          {testStatus === 'success' && '✓ Connected'}
          {testStatus === 'error' && '✗ Failed'}
          {testStatus === 'idle' && 'Test Connection'}
        </button>
        <button 
          onClick={handleSave}
          className="px-6 py-2 rounded-lg bg-[#8b7355] hover:bg-[#9d8164] transition-colors"
        >
          Save API Settings
        </button>
      </div>

      {!isValid && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 text-red-200">
          Choose a provider and enter an API key to enable chat and voice.
        </div>
      )}

      {testStatus === 'error' && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 text-red-200">
          Connection failed. Check your API key and try again.
        </div>
      )}
      {testStatus === 'success' && (
        <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 text-green-200">
          Successfully connected to {provider}!
        </div>
      )}
    </div>
  );
}

function PersonaSettings({ theme }: { theme: 'light' | 'dark' }) {
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
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-light mb-2">Persona Configuration</h2>
        <p className="text-[#b8b5b0]">
          Adjust how the AI mentor communicates with you. These settings shape the tone and style of responses.
        </p>
      </div>

      <div className="space-y-8">
        {[
          { key: 'warmth' as const, label: 'Warmth', min: 'Stoic', max: 'Warm' },
          { key: 'firmness' as const, label: 'Firmness', min: 'Gentle', max: 'Firm' },
          { key: 'verbosity' as const, label: 'Verbosity', min: 'Concise', max: 'Detailed' },
          { key: 'humor' as const, label: 'Humor', min: 'Serious', max: 'Light' },
          { key: 'directness' as const, label: 'Directness', min: 'Subtle', max: 'Direct' },
        ].map(({ key, label, min, max }) => (
          <div key={key}>
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-medium">{label}</label>
              <span className="text-[#8b7355]">{persona[key]}</span>
            </div>
            <div className="flex justify-between text-xs text-[#b8b5b0] mb-3">
              <span>{min}</span>
              <span>{max}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={persona[key]}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(key, parseInt(e.target.value, 10))}
              className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ))}
      </div>

      <button 
        onClick={handleSave}
        className="px-6 py-2 rounded-lg bg-[#8b7355] hover:bg-[#9d8164] transition-colors"
      >
        Save Persona Settings
      </button>
    </div>
  );
}

function VoiceSettings({ theme }: { theme: 'light' | 'dark' }) {
  const { settings, updateSettings } = useStore();
  const [config, setConfig] = useState(settings.voiceConfig);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundStyle, setSoundStyle] = useState<'default' | 'ios' | 'android'>('default');

  const handleSave = () => {
    updateSettings({ 
      voiceConfig: { 
        ...config, 
        provider: 'browser',
      },
    });
    alert('Voice settings saved!');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-light mb-2">Voice & Sound Settings</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Enable notification sounds</span>
          </label>
        </div>

        {soundEnabled && (
          <div>
            <label className="block text-sm font-medium mb-2">Sound Style</label>
            <select 
              value={soundStyle} 
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSoundStyle(e.target.value as 'default' | 'ios' | 'android')}
              className="w-full bg-[#222222] border border-[#2a2a2a] rounded-lg px-4 py-2 text-[#e8e6e3]"
            >
              <option value="default">Default</option>
              <option value="ios">iOS Style</option>
              <option value="android">Android Style</option>
            </select>
          </div>
        )}

        <div className="bg-[#222222] border border-[#2a2a2a] rounded-lg p-4">
          <h3 className="font-medium mb-2">Voice Engine</h3>
          <p className="text-sm text-[#b8b5b0]">
            Voice chat currently uses your browser's speech synthesis. If Piper is running locally, 
            the app will auto-upgrade to that higher-quality engine.
          </p>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">Speech Speed</label>
            <span className="text-[#8b7355]">{config.speed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={config.speed}
            onChange={(e) => setConfig({ ...config, speed: parseFloat(e.target.value) })}
            className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <VoiceSelector
          selectedVoice={config.voiceId}
          onSelect={(voiceName) => setConfig({ ...config, voiceId: voiceName })}
        />
      </div>

      <button 
        onClick={handleSave}
        className="px-6 py-2 rounded-lg bg-[#8b7355] hover:bg-[#9d8164] transition-colors"
      >
        Save Voice Settings
      </button>
    </div>
  );
}

function ProfileSettings({ theme }: { theme: 'light' | 'dark' }) {
  const { settings, updateSettings } = useStore();
  const [profile, setProfile] = useState(settings.userProfile);

  const handleSave = () => {
    updateSettings({ userProfile: profile });
    alert('Profile saved!');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-light mb-2">About You</h2>
        <p className="text-[#b8b5b0]">
          Share context about yourself so the AI can provide more relevant guidance. 
          This information is stored locally and never shared.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Name (Optional)</label>
          <input
            type="text"
            value={profile.name || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, name: e.target.value })}
            placeholder="What should I call you?"
            className="w-full bg-[#222222] border border-[#2a2a2a] rounded-lg px-4 py-2 text-[#e8e6e3]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Age (Optional)</label>
          <input
            type="number"
            value={profile.age || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, age: parseInt(e.target.value, 10) })}
            placeholder="Your age"
            className="w-full bg-[#222222] border border-[#2a2a2a] rounded-lg px-4 py-2 text-[#e8e6e3]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Relationship Status</label>
          <select 
            value={profile.relationshipStatus || ''} 
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setProfile({ ...profile, relationshipStatus: e.target.value })}
            className="w-full bg-[#222222] border border-[#2a2a2a] rounded-lg px-4 py-2 text-[#e8e6e3]"
          >
            <option value="">Prefer not to say</option>
            <option value="single">Single</option>
            <option value="dating">Dating</option>
            <option value="relationship">In a relationship</option>
            <option value="married">Married</option>
            <option value="complicated">It's complicated</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Current Challenges</label>
          <textarea
            value={profile.currentChallenges || ''}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setProfile({ ...profile, currentChallenges: e.target.value })}
            placeholder="What are you working through right now?"
            rows={4}
            className="w-full bg-[#222222] border border-[#2a2a2a] rounded-lg px-4 py-2 text-[#e8e6e3]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Goals</label>
          <textarea
            value={profile.goals || ''}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setProfile({ ...profile, goals: e.target.value })}
            placeholder="What do you want to achieve?"
            rows={4}
            className="w-full bg-[#222222] border border-[#2a2a2a] rounded-lg px-4 py-2 text-[#e8e6e3]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Additional Context</label>
          <textarea
            value={profile.additionalContext || ''}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setProfile({ ...profile, additionalContext: e.target.value })}
            placeholder="Anything else that would be helpful for the AI to know?"
            rows={4}
            className="w-full bg-[#222222] border border-[#2a2a2a] rounded-lg px-4 py-2 text-[#e8e6e3]"
          />
        </div>
      </div>

      <button 
        onClick={handleSave}
        className="px-6 py-2 rounded-lg bg-[#8b7355] hover:bg-[#9d8164] transition-colors"
      >
        Save Profile
      </button>
    </div>
  );
}

function AppearanceSettings({ theme }: { theme: 'light' | 'dark' }) {
  const { settings, updateSettings } = useStore();

  const toggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: newTheme });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-light mb-2">Appearance</h2>
        <p className={theme === 'light' ? 'text-gray-600' : 'text-[#b8b5b0]'}>
          Customize how GrowthHub looks.
        </p>
      </div>

      <div className={theme === 'light' ? 'bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4' : 'bg-[#222222] border border-[#2a2a2a] rounded-lg p-6 space-y-4'}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium mb-1">Theme</h3>
            <p className={theme === 'light' ? 'text-sm text-gray-600' : 'text-sm text-[#b8b5b0]'}>
              Choose between light and dark mode
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              theme === 'dark'
                ? 'bg-[#8b7355]'
                : 'bg-blue-600'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <div className={theme === 'light' ? 'text-xs text-gray-500' : 'text-xs text-[#b8b5b0]'}>
          Currently using <strong>{theme === 'dark' ? '🌙 Dark' : '☀️ Light'}</strong> theme
        </div>
      </div>

      <div className={theme === 'light' ? 'bg-blue-50 border border-blue-200 rounded-lg p-4' : 'bg-[#222222] border border-[#2a2a2a] rounded-lg p-4'}>
        <p className={theme === 'light' ? 'text-sm text-blue-900' : 'text-sm text-[#b8b5b0]'}>
          💡 Theme preference is saved automatically and applies across all pages and modules.
        </p>
      </div>
    </div>
  );
}

function DataSettings({ theme }: { theme: 'light' | 'dark' }) {
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
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-light mb-2">Privacy & Data</h2>
      </div>

      <div className="bg-[#222222] border border-[#2a2a2a] rounded-lg p-4">
        <h3 className="font-medium mb-2">Your Data is Private</h3>
        <p className="text-sm text-[#b8b5b0]">
          All conversations and settings are stored locally on your device. 
          Nothing is sent to our servers. API calls go directly to your chosen provider.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-3">Conversation History</label>
          <button 
            onClick={handleClearMessages}
            className="px-6 py-2 rounded-lg bg-red-900/20 border border-red-700/50 text-red-200 hover:bg-red-900/30 transition-colors"
          >
            Clear All Messages
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Mentor Memory</label>
          <button 
            onClick={handleClearMemory}
            className="px-6 py-2 rounded-lg border border-[#2a2a2a] bg-[#222222] hover:bg-[#2a2a2a] transition-colors"
          >
            Clear Mentor Memory
          </button>
          <p className="text-xs text-[#b8b5b0] mt-2">
            Removes long-term summaries the mentor uses across chats, while keeping your saved conversations.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Backup & Export</label>
          <button 
            onClick={handleExport}
            className="px-6 py-2 rounded-lg border border-[#2a2a2a] bg-[#222222] hover:bg-[#2a2a2a] transition-colors"
          >
            Export All Data
          </button>
          <p className="text-xs text-[#b8b5b0] mt-2">Download a backup of all your settings and conversations</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Private Session</label>
          <button 
            onClick={toggleSessionMode}
            className={`px-6 py-2 rounded-lg transition-colors ${
              settings.sessionMode
                ? 'border border-[#2a2a2a] bg-[#222222] hover:bg-[#2a2a2a]'
                : 'bg-[#8b7355] hover:bg-[#9d8164]'
            }`}
          >
            {settings.sessionMode ? 'Disable Private Session' : 'Enable Private Session'}
          </button>
          <p className="text-xs text-[#b8b5b0] mt-2">
            {settings.sessionMode ? 'Currently not persisting messages or API keys.' : 'Keep data local by default; enable private session to avoid persistence.'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Wipe Everything</label>
          <button 
            onClick={wipeAll}
            className="px-6 py-2 rounded-lg bg-red-900/20 border border-red-700/50 text-red-200 hover:bg-red-900/30 transition-colors"
          >
            Delete All Stored Data
          </button>
        </div>
      </div>
    </div>
  );
}
