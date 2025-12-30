import { Link } from 'react-router-dom';
import './Setup.css';

export default function Setup() {
  return (
    <div className="setup-container">
      <div className="setup-header">
        <Link to="/" className="back-btn">← Back</Link>
        <h1>Set Up Your AI</h1>
      </div>

      <div className="setup-content">
        <div className="intro-section">
          <h2>Get Started for FREE</h2>
          <p>
            You can start using Growth Hub right now with free AI models. Most people find
            these work great for their needs.
          </p>
        </div>

        <div className="providers-section">
          <h3>Choose a Free Provider</h3>
          
          <div className="provider-card">
            <h4>Option 1: Groq (Recommended - 100% Free)</h4>
            <p>Free API with super-fast inference. All models are free!</p>
            <ol>
              <li>
                Visit <a href="https://console.groq.com" target="_blank" rel="noopener">console.groq.com</a> and create account
              </li>
              <li>Navigate to API Keys section</li>
              <li>Create a new API key</li>
              <li>Copy the key and paste it in Settings</li>
            </ol>
          </div>

          <div className="provider-card">
            <h4>Option 2: OpenRouter</h4>
            <p>Access to multiple free AND paid models</p>
            <ol>
              <li>
                Visit <a href="https://openrouter.ai" target="_blank" rel="noopener">openrouter.ai</a> and sign up
              </li>
              <li>Go to Keys section and create a new API key</li>
              <li>
                <strong>IMPORTANT:</strong> Go to{' '}
                <a href="https://openrouter.ai/settings/privacy" target="_blank" rel="noopener">
                  Privacy Settings
                </a>
              </li>
              <li>Enable "Allow free model usage" (required for free models)</li>
              <li>Copy your API key and add it in Settings</li>
              <li>Select a free model (ends with :free)</li>
            </ol>
            <div className="privacy-note">
              ⚠️ Free OpenRouter models require allowing your data to be used for training.
              If you want complete privacy, use Groq or paid models instead.
            </div>
          </div>
        </div>

        <div className="upgrade-section">
          <h3>Want More?</h3>
          <p>
            If you need higher quality or faster responses in the future, you can always
            upgrade to a paid API service like OpenAI. But for most people, the free
            models work just fine!
          </p>
        </div>

        <Link to="/masculine-mentor/settings" className="continue-btn">
          Continue to Settings →
        </Link>
      </div>
    </div>
  );
}
