import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMasculineMentorStore } from '../store/useMasculineMentorStore';
import './Chat.css';

function Chat() {
  const [input, setInput] = useState('');
  const { messages, addMessage, toggleBookmark } = useMasculineMentorStore();

  const handleSend = () => {
    if (!input.trim()) return;

    addMessage({ role: 'user', content: input });
    
    // Simulate AI response (in production, this would call your AI API)
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: getSimulatedResponse(input),
      });
    }, 1000);

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <Link to="/masculine-mentor" className="back-button">← Back</Link>
        <h2>Chat with Mentor</h2>
      </header>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>Start a conversation with your mentor.</p>
            <p className="hint">Ask about challenges, goals, or how you're feeling.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.role}`}
            >
              <div className="message-content">
                {message.content}
              </div>
              {message.role === 'assistant' && (
                <button
                  className={`bookmark-btn ${message.bookmarked ? 'active' : ''}`}
                  onClick={() => toggleBookmark(message.id)}
                >
                  {message.bookmarked ? '⭐' : '☆'}
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Share what's on your mind..."
          rows={3}
        />
        <button onClick={handleSend} disabled={!input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}

function getSimulatedResponse(_userInput: string): string {
  const responses = [
    "I hear you. What's driving that feeling right now?",
    "That's a solid observation. How do you want to move forward with it?",
    "Noted. What would the best version of yourself do in this situation?",
    "Good awareness. Let's break that down—what's one concrete step you can take today?",
    "Respect for bringing that up. What boundaries need to be set here?",
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

export default Chat;
