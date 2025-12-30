import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../lib/store';
import { buildSystemPrompt } from '../../lib/systemPrompt';
import { sendMessage } from '../../lib/aiClient';
import { detectCrisis, detectAbuse } from '../../lib/memory';
import './Chat.css';

export default function Chat() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCrisisWarning, setShowCrisisWarning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, addMessage, settings } = useStore();

  const playNotificationSound = (type: 'send' | 'receive') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = type === 'send' ? 800 : 600;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // Ignore audio errors
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setError(null);
    
    // Safety checks
    if (detectCrisis(userMessage)) {
      setShowCrisisWarning(true);
      return;
    }
    
    if (detectAbuse(userMessage)) {
      addMessage({ role: 'user', content: userMessage });
      addMessage({
        role: 'assistant',
        content: "I'm hearing that you may be in a situation involving physical harm or violence. Your safety is the most important thing. Please consider:\n\n• National Domestic Violence Hotline: 1-800-799-7233\n• Emergency services: 911\n\nI can provide emotional support and guidance, but if you're in danger, please reach out to professionals who can help ensure your safety.",
      });
      playNotificationSound('send');
      playNotificationSound('receive');
      return;
    }

    // Check API configuration
    if (!settings.apiConfig.apiKey || !settings.apiConfig.provider) {
      setError('Please configure your API in Settings first.');
      return;
    }
    
    // Add user message
    addMessage({ role: 'user', content: userMessage });
    playNotificationSound('send');
    
    setIsLoading(true);
    
    try {
      // Build system prompt with persona and profile
      const systemPrompt = buildSystemPrompt(
        settings.personaConfig,
        settings.userProfile
      );
      
      // Get AI response
      const response = await sendMessage(
        [...messages, { id: '', role: 'user', content: userMessage, timestamp: Date.now() }],
        systemPrompt,
        settings.apiConfig
      );
      
      // Add AI response
      addMessage({
        role: 'assistant',
        content: response,
      });
      
      playNotificationSound('receive');
    } catch (err: any) {
      console.error('AI Error:', err);
      setError(err.message || 'Failed to get response. Check your API settings.');
      
      // Remove loading state but keep user message
      addMessage({
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please check your API settings and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const dismissCrisisWarning = () => {
    setShowCrisisWarning(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <Link to="/" className="back-arrow">←</Link>
        <div className="chat-title">
          <h2>Masculine Mentor</h2>
          <span className="status">
            {settings.apiConfig.apiKey ? 'Online' : 'Not configured'}
          </span>
        </div>
        <Link to="/masculine-mentor/voice" className="voice-btn" title="Voice Call">
          🎤
        </Link>
        <Link to="/masculine-mentor/settings" className="settings-btn">⚙️</Link>
      </div>

      {showCrisisWarning && (
        <div className="crisis-warning">
          <div className="crisis-content">
            <h3>🆘 Crisis Resources</h3>
            <p>
              If you're having thoughts of suicide or self-harm, please reach out to trained professionals:
            </p>
            <ul>
              <li><strong>National Suicide Prevention Lifeline:</strong> 988</li>
              <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
              <li><strong>Emergency:</strong> 911</li>
            </ul>
            <p>
              I'm here to provide guidance and support, but I'm not equipped to handle crisis situations. 
              Please connect with someone who can help keep you safe.
            </p>
            <button onClick={dismissCrisisWarning} className="dismiss-btn">
              I understand
            </button>
          </div>
        </div>
      )}

      <div className="messages-area">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>Start a conversation</p>
            <span>Your messages are private and stored locally</span>
            {!settings.apiConfig.apiKey && (
              <Link to="/masculine-mentor/settings" className="setup-link">
                → Set up your API first
              </Link>
            )}
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role}`}>
              <div className="message-bubble">
                {msg.content}
              </div>
              <span className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
        {isLoading && (
          <div className="message assistant">
            <div className="message-bubble typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          rows={1}
          disabled={isLoading}
        />
        <button 
          onClick={handleSendMessage} 
          disabled={!input.trim() || isLoading || !settings.apiConfig.apiKey}
          title={!settings.apiConfig.apiKey ? 'Configure API in Settings first' : ''}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
