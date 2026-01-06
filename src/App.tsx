import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './lib/store';
import Hub from './Hub';
import Setup from './Setup';
import Chat from './modules/masculine-mentor/Chat';
import Settings from './modules/masculine-mentor/Settings';
import VoiceChat from './modules/masculine-mentor/VoiceChat';
import { PWAUpdatePrompt } from './components/PWAUpdatePrompt';

export default function App() {
  const { settings } = useStore();
  const theme = settings.theme || 'dark';

  return (
    <div className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-[#1a1a1a] text-[#e8e6e3]'}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/masculine-mentor" element={<Chat />} />
          <Route path="/masculine-mentor/settings" element={<Settings />} />
          <Route path="/masculine-mentor/voice" element={<VoiceChat />} />
        </Routes>
        <PWAUpdatePrompt />
      </BrowserRouter>
    </div>
  );
}
