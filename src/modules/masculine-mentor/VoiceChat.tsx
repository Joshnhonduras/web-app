/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';
import { buildSystemPrompt } from '../../lib/systemPrompt';
import { sendMessage } from '../../lib/aiClient';
import { extractFacts, buildContextSummary } from '../../lib/memory';
import { voiceManager } from '../../lib/voiceManager';
import type { Message } from '../../types';
import './VoiceChat.css';

export default function VoiceChat() {
  const navigate = useNavigate();
  const { messages, addMessage, settings } = useStore();
  
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [speakerMode, setSpeakerMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const callStartTimeRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  async function handleUserSpeech(text: string) {
    if (!text.trim()) return;

    setTranscript('');
    
    // Add user message
    addMessage({ role: 'user', content: text });

    // Get AI response
    try {
      const pendingHistory: Message[] = [
        ...messages,
        {
          id: '',
          role: 'user',
          content: text,
          timestamp: Date.now(),
        },
      ];

      const contextSummary = buildContextSummary(extractFacts(pendingHistory));

      const systemPrompt = buildSystemPrompt(
        settings.personaConfig,
        settings.userProfile
      ) + (contextSummary ? `\n\n${contextSummary}` : '');

      const response = await sendMessage(
        pendingHistory.slice(-18),
        systemPrompt,
        settings.apiConfig
      );

      // Add AI message
      addMessage({ role: 'assistant', content: response });

      // Speak the response
      speak(response);
    } catch (err: unknown) {
      console.error('AI error:', err);
      const isAbort = err instanceof Error && err.name === 'AbortError';
      const fallback = isAbort
        ? "The request timed out. Let's try again."
        : "I'm having trouble connecting right now. Can you repeat that?";
      speak(fallback);
    }
  }

  useEffect(() => {
    // Check if Web Speech API is available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    if (!window.speechSynthesis) {
      setError('Speech synthesis not supported in this browser');
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        handleUserSpeech(finalTranscript.trim());
      } else {
        setTranscript(interimTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setError(`Recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      if (isListening && !isPaused) {
        recognition.start(); // Restart if still in call
      }
    };

    recognitionRef.current = recognition;
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, isPaused]);

  const startCall = () => {
    if (!settings.apiConfig.apiKey || !settings.apiConfig.provider) {
      setError('Please configure your API in Settings first');
      return;
    }

    setIsListening(true);
    setIsPaused(false);
    callStartTimeRef.current = Date.now();
    
    // Start timer
    timerRef.current = window.setInterval(() => {
      setCallDuration(Math.floor((Date.now() - callStartTimeRef.current) / 1000));
    }, 1000);

    // Start listening
    try {
      recognitionRef.current?.start();
      
      // Initial greeting
      speak("Hey, I'm here. What's on your mind?");
    } catch (err) {
      console.error('Failed to start recognition:', err);
      setError('Failed to start voice recognition');
    }
  };

  const endCall = () => {
    setIsListening(false);
    setIsPaused(false);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    navigate('/masculine-mentor');
  };

  const togglePause = () => {
    if (isPaused) {
      // Resume
      setIsPaused(false);
      recognitionRef.current?.start();
    } else {
      // Pause
      setIsPaused(true);
      recognitionRef.current?.stop();
      synthRef.current?.cancel();
    }
  };

  const toggleSpeaker = () => {
    setSpeakerMode(!speakerMode);
    // Note: Web Speech API doesn't directly control speaker/earpiece on mobile
    // This is more of a visual indicator
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;

    // Set voice from user settings if available
    if (settings.voiceConfig.voiceId) {
      voiceManager.setVoice(settings.voiceConfig.voiceId);
    }

    voiceManager.speak(text, {
      rate: settings.voiceConfig.speed || 0.95,
      pitch: 0.85, // Lower pitch for masculine sound
      volume: 1.0,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
      },
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error && !isListening) {
    return (
      <div className="voice-chat-container">
        <div className="voice-error">
          <h2>Voice Chat Not Available</h2>
          <p>{error}</p>
          <Link to="/masculine-mentor" className="back-link">
            ← Back to Text Chat
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="voice-chat-container">
      {!isListening ? (
        <div className="voice-start">
          <h1>Voice Call</h1>
          <p>Talk with your mentor using voice</p>
          <button onClick={startCall} className="start-call-btn">
            📞 Start Call
          </button>
          <Link to="/masculine-mentor" className="back-link">
            ← Back to Text Chat
          </Link>
        </div>
      ) : (
        <div className="voice-active">
          <div className="call-header">
            <div className="call-info">
              <h2>Masculine Mentor</h2>
              <span className="call-status">
                {isPaused ? 'On Hold' : isSpeaking ? 'Speaking...' : 'Listening...'}
              </span>
            </div>
            <div className="call-duration">{formatDuration(callDuration)}</div>
          </div>

          <div className="voice-visual">
            <div className={`audio-indicator ${isSpeaking ? 'speaking' : isListening && !isPaused ? 'listening' : ''}`}>
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
            </div>
          </div>

          {transcript && (
            <div className="live-transcript">
              <p>{transcript}</p>
            </div>
          )}

          <div className="call-controls">
            <button 
              onClick={toggleSpeaker} 
              className={`control-btn ${speakerMode ? 'active' : ''}`}
              title={speakerMode ? 'Speaker On' : 'Speaker Off'}
            >
              {speakerMode ? '🔊' : '🔈'}
            </button>

            <button 
              onClick={togglePause} 
              className="control-btn"
              title={isPaused ? 'Resume' : 'Hold'}
            >
              {isPaused ? '▶️' : '⏸️'}
            </button>

            <button 
              onClick={endCall} 
              className="control-btn end-btn"
              title="End Call"
            >
              📞
            </button>
          </div>

          {error && (
            <div className="call-error">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
