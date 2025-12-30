import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Chat from './components/Chat';
import PersonaWizard from './components/PersonaWizard';
import DailyCheckIn from './components/DailyCheckIn';
import Tools from './components/Tools';
import './MasculineMentor.css';

function MasculineMentorHome() {
  const navigate = useNavigate();

  const features = [
    { title: 'Talk to Mentor', path: 'chat', icon: '💬', description: 'Chat with your AI mentor' },
    { title: 'Daily Check-In', path: 'check-in', icon: '📝', description: 'Track your progress' },
    { title: 'Grounding Tools', path: 'tools', icon: '🧘', description: 'Breathing & focus exercises' },
    { title: 'Configure Persona', path: 'persona', icon: '⚙️', description: 'Customize your mentor' },
  ];

  return (
    <div className="mm-home">
      <header className="mm-header">
        <Link to="/" className="back-button">← Back to Hub</Link>
        <h1>💪 Masculine Mentor</h1>
        <p className="mm-subtitle">Your coach for grounded confidence and emotional steadiness</p>
      </header>

      <div className="features-grid">
        {features.map((feature) => (
          <div
            key={feature.path}
            className="feature-card"
            onClick={() => navigate(feature.path)}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="disclaimer">
        <p>⚠️ This is not therapy, medical advice, or crisis support. If you're in crisis, please contact a professional.</p>
      </div>
    </div>
  );
}

function MasculineMentor() {
  return (
    <div className="masculine-mentor">
      <Routes>
        <Route path="/" element={<MasculineMentorHome />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/persona" element={<PersonaWizard />} />
        <Route path="/check-in" element={<DailyCheckIn />} />
        <Route path="/tools" element={<Tools />} />
      </Routes>
    </div>
  );
}

export default MasculineMentor;
