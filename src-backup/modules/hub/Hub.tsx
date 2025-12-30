import { useNavigate } from 'react-router-dom';
import { modules } from '../../lib/modules';
import './Hub.css';

function Hub() {
  const navigate = useNavigate();

  return (
    <div className="hub-container">
      <header className="hub-header">
        <h1>Growth Hub</h1>
        <p className="hub-subtitle">Your platform for personal growth and emotional mastery</p>
      </header>

      <div className="modules-grid">
        {modules.map((module) => (
          <div
            key={module.id}
            className={`module-card ${module.isPremium ? 'premium' : ''}`}
            onClick={() => module.path !== '/' && navigate(module.path)}
          >
            <div className="module-icon">{module.icon}</div>
            <h2 className="module-name">{module.name}</h2>
            <p className="module-description">{module.description}</p>
            {module.isPremium && (
              <span className="premium-badge">Premium</span>
            )}
          </div>
        ))}
      </div>

      <footer className="hub-footer">
        <p>Version 1.0.0 • Built with clarity and purpose</p>
      </footer>
    </div>
  );
}

export default Hub;
