# Voice Chat - COMPLETE ✅

## What's Built

### Phone Call Interface
Full voice conversation UI that looks and feels like a real phone call:

- **Call screen** with dark gradient background
- **Audio visualizer** with animated waves (green when listening, blue when speaking)
- **Call timer** showing duration (MM:SS format)
- **Live transcription** showing what you're saying in real-time
- **3 control buttons:**
  - 🔊 Speaker toggle (earpiece/speaker mode indicator)
  - ⏸️ Pause/Resume (hold the call)
  - 📞 End call (rotated red button)

### Web Speech API Integration

**Speech Recognition (STT):**
- Uses browser's built-in Web Speech API
- Continuous listening
- Real-time transcription
- Automatically restarts if interrupted
- Detects final vs interim results

**Speech Synthesis (TTS):**
- Uses browser's built-in voices
- Automatically selects male voice when available
- Adjustable speed (from settings)
- Lower pitch for masculine sound
- Visual indicator when AI is speaking

### Features

✅ **Hands-free conversation** - Just talk naturally
✅ **AI responds with voice** - Hears and speaks
✅ **Same AI brain** - Uses your persona settings and profile
✅ **Conversation saved** - All voice messages saved to chat history
✅ **Pause/Resume** - Put the call on hold anytime
✅ **Speaker mode** - Toggle indicator (visual only on web)
✅ **Error handling** - Graceful fallback if speech API unavailable

## How It Works

### Call Flow:
1. Click 🎤 voice button in chat
2. Click "Start Call"
3. AI greets you with voice
4. You talk → Speech recognition transcribes
5. Your text shown in live transcript box
6. Sent to AI (same as text chat)
7. AI responds with voice + visual waves
8. Loop continues until you end call
9. All messages saved to regular chat history

### Technical Details:

**Speech Recognition:**
```javascript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
- continuous: true (keeps listening)
- interimResults: true (shows what you're saying)
- lang: 'en-US'
```

**Speech Synthesis:**
```javascript
const utterance = new SpeechSynthesisUtterance(text);
- Finds male voice automatically
- rate: from user settings (0.5-2.0x)
- pitch: 0.9 (slightly lower for masculine sound)
```

### Browser Compatibility:

**Works on:**
- ✅ Chrome/Chromium (Linux, Windows, Mac, Android)
- ✅ Edge
- ✅ Safari (iOS/Mac)
- ⚠️ Firefox (limited support)

**Linux Specific:**
- Works in Chrome/Chromium
- Requires PulseAudio or PipeWire for audio
- May need to grant microphone permission
- Voice quality depends on installed TTS engines

## Access Points

1. **From chat header** - Click 🎤 microphone icon
2. **Direct URL** - `/masculine-mentor/voice`

## Settings Integration

Voice chat uses:
- **API Config** - Same AI backend as text chat
- **Persona Settings** - AI responds with same personality
- **User Profile** - Has same context about you
- **Voice Speed** - From "Voice & Sounds" settings tab

## Known Limitations

1. **Browser voices vary** - Quality depends on OS/browser
2. **No true speaker/earpiece control** - Web API limitation (visual indicator only)
3. **Requires internet** - For AI responses (speech processing is local)
4. **May need mic permission** - Browser will prompt
5. **Linux voice quality** - Depends on installed TTS packages

## Improving Linux Voice Quality

For better male voices on Linux:

```bash
# Install better TTS voices
sudo apt install espeak-ng-espeak 
sudo apt install speech-dispatcher-espeak-ng

# Or install festival
sudo apt install festival festvox-kallpc16k

# For higher quality
sudo apt install libttspico-utils
```

## Testing

1. Go to chat
2. Click 🎤 microphone icon
3. Click "Start Call"
4. Grant microphone permission when prompted
5. Say something
6. Watch live transcript appear
7. AI responds with voice
8. Try pause/resume and speaker toggle
9. End call when done

## Next Steps

To enhance:
- ⏳ Add actual audio files for notification sounds
- ⏳ Interrupt detection (stop AI when user starts talking)
- ⏳ Better voice selection UI
- ⏳ Record call feature
- ⏳ OpenAI TTS integration (premium option)
- ⏳ ElevenLabs integration (premium option)
