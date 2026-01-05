import { useNavigate } from 'react-router-dom';
import './Hub.css';

export default function Hub() {
  const navigate = useNavigate();

  const modules = [
    {
      id: 'masculine-mentor',
      title: 'Masculine Mentor',
      description: 'Get clarity and guidance through AI-powered conversations',
      available: true,
      path: '/masculine-mentor',
    },
    {
      id: 'relationship-intel',
      title: 'Relationship Intelligence',
      description: 'Coming soon',
      available: false,
    },
    {
      id: 'relationship-mediator',
      title: 'Relationship Mediator',
      description: 'Coming soon',
      available: false,
    },
    {
      id: 'setup',
      title: 'Set Up Your AI',
      description: 'Quick 3-step guide to get started for free',
      available: true,
      path: '/setup',
    },
  ];

  return (
    <div className="hub-container">
      <div className="hub-content">
        <div className="hub-header">
          <h1>Growth Hub</h1>
          <p>Personal development tools powered by AI</p>
        </div>

        <div className="modules-grid">
          {modules.map((module) => (
            <div
              key={module.id}
              className={`module-card ${!module.available ? 'disabled' : ''}`}
              onClick={() => module.available && module.path && navigate(module.path)}
            >
              {!module.available && <div className="coming-soon-badge">COMING SOON</div>}
              <h2>{module.title}</h2>
              <p>{module.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
