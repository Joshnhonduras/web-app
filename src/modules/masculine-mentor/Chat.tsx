import { useRef, useEffect, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '../../hooks/useChat';
import { useStore } from '../../lib/store';
import './Chat.css';

export default function Chat() {
  const {
    input,
    setInput,
    isLoading,
    error,
    showCrisisWarning,
    dismissCrisisWarning,
    handleSendMessage,
    messages,
    settings,
  } = useChat();

  const {
    conversations,
    archiveConversation,
    loadConversation,
    renameConversation,
    setConversationMemoryFlag,
  } = useStore();

  const [learnThisConversation, setLearnThisConversation] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [detailsTitle, setDetailsTitle] = useState('');
  const [detailsIncludedInMemory, setDetailsIncludedInMemory] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const selectedConversation = selectedConversationId
    ? conversations.find((c) => c.id === selectedConversationId) ?? null
    : null;

  useEffect(() => {
    if (selectedConversationId) {
      const conv = conversations.find((c) => c.id === selectedConversationId);
      if (conv) {
        setDetailsTitle(conv.title);
        setDetailsIncludedInMemory(conv.includedInMemory);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversationId]);

  const handleNewChat = () => {
    archiveConversation({ includeInMemory: learnThisConversation });
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
        <button
          type="button"
          className="new-chat-btn"
          onClick={handleNewChat}
          title="Start a new conversation"
        >
          ＋
        </button>
        <Link to="/masculine-mentor/voice" className="voice-btn" title="Voice Call">
          🎤
        </Link>
        <Link to="/masculine-mentor/settings" className="settings-btn">⚙️</Link>
      </div>

	      {conversations.length > 0 && (
	        <div className="conversation-log">
	          <span className="conversation-log-label">Previous chats:</span>
	          <ul>
	            {conversations.slice(-3).map((conv) => (
	              <li key={conv.id}>
	                <button
	                  type="button"
	                  className="conversation-log-link"
	                  onClick={() => setSelectedConversationId(conv.id)}
	                >
	                  <strong>{conv.title}</strong>
	                  {conv.includedInMemory && <span> 🧠</span>}
	                  {!conv.includedInMemory && <span> 🔒</span>}
	                  <span className="conversation-log-date">
	                    {new Date(conv.updatedAt).toLocaleDateString()}
	                  </span>
	                </button>
	              </li>
	            ))}
	          </ul>
	        </div>
	      )}

	      <div className="memory-toggle">
	        <label>
	          <input
	            type="checkbox"
	            checked={learnThisConversation}
	            onChange={(e) => setLearnThisConversation(e.target.checked)}
	          />
	          Let the mentor learn from this chat
	        </label>
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

	      {selectedConversation && (
	        <div className="conversation-details-backdrop">
	          <div className="conversation-details-modal">
	            <div className="conversation-details-header">
	              <input
	                type="text"
	                className="conversation-details-title-input"
	                value={detailsTitle}
	                onChange={(e) => setDetailsTitle(e.target.value)}
	              />
	              <label className="conversation-details-memory-toggle">
	                <input
	                  type="checkbox"
	                  checked={detailsIncludedInMemory}
	                  onChange={(e) => setDetailsIncludedInMemory(e.target.checked)}
	                />
	                Let the mentor learn from this conversation
	              </label>
	            </div>
	            <p className="conversation-details-meta">
	              Started{' '}
	              {new Date(selectedConversation.createdAt).toLocaleString()} · Last active{' '}
	              {new Date(selectedConversation.updatedAt).toLocaleString()}
	            </p>
	            {selectedConversation.summary && (
	              <div className="conversation-details-summary">
	                <h4>Summary</h4>
	                <pre>{selectedConversation.summary}</pre>
	              </div>
	            )}
	            {selectedConversation.messages.length > 0 && (
	              <div className="conversation-details-messages">
	                <h4>Recent messages</h4>
	                <ul>
	                  {selectedConversation.messages.slice(-6).map((m) => (
	                    <li key={m.id}>
	                      <strong>{m.role === 'user' ? 'You' : 'Mentor'}:</strong> {m.content}
	                    </li>
	                  ))}
	                </ul>
	              </div>
	            )}
	            <div className="conversation-details-actions">
	              <button
	                type="button"
	                className="secondary-btn"
	                onClick={() => {
	                  if (selectedConversation) {
	                    renameConversation(selectedConversation.id, detailsTitle);
	                    setConversationMemoryFlag(
	                      selectedConversation.id,
	                      detailsIncludedInMemory
	                    );
	                  }
	                }}
	              >
	                Save changes
	              </button>
	              <button
	                type="button"
	                className="primary-btn"
	                onClick={() => {
	                  loadConversation(selectedConversation.id);
	                  setSelectedConversationId(null);
	                }}
	              >
	                Open this chat
	              </button>
	              <button
	                type="button"
	                className="secondary-btn"
	                onClick={() => setSelectedConversationId(null)}
	              >
	                Close
	              </button>
	            </div>
	          </div>
	        </div>
	      )}
	    </div>
	  );
	}
