import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hub from './Hub';
import Setup from './Setup';
import Chat from './modules/masculine-mentor/Chat';
import Settings from './modules/masculine-mentor/Settings';
import VoiceChat from './modules/masculine-mentor/VoiceChat';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/masculine-mentor" element={<Chat />} />
        <Route path="/masculine-mentor/settings" element={<Settings />} />
        <Route path="/masculine-mentor/voice" element={<VoiceChat />} />
      </Routes>
    </BrowserRouter>
  );
}
