#!/usr/bin/env python3
"""
Piper TTS API Server for Growth Hub
Provides a simple HTTP API for text-to-speech using Piper
"""
import sys
import os
import io
import wave
import base64
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs
import json
from piper import PiperVoice

# Voice model path
VOICE_DIR = os.path.join(os.path.dirname(__file__), 'piper-voices')
VOICE_MODEL = os.path.join(VOICE_DIR, 'en_US-lessac-medium.onnx')

# Load voice model once at startup
print(f"Loading Piper voice model: {VOICE_MODEL}")
voice = PiperVoice.load(VOICE_MODEL)
print("Voice model loaded successfully!")

class PiperHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """Handle TTS request"""
        if self.path == '/tts':
            try:
                # Read request body
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                text = data.get('text', '')
                if not text:
                    self.send_error(400, "Missing 'text' parameter")
                    return
                
                # Generate speech - Piper returns audio chunks
                audio_chunks = []
                for chunk in voice.synthesize(text):
                    audio_chunks.append(chunk.audio_int16_bytes)
                
                # Combine all chunks
                pcm_data = b''.join(audio_chunks)
                
                # Create WAV file
                wav_bytes = io.BytesIO()
                with wave.open(wav_bytes, 'wb') as wav_file:
                    wav_file.setnchannels(1)  # Mono
                    wav_file.setsampwidth(2)  # 16-bit
                    wav_file.setframerate(voice.config.sample_rate)
                    wav_file.writeframes(pcm_data)
                
                # Convert to base64
                wav_bytes.seek(0)
                audio_b64 = base64.b64encode(wav_bytes.read()).decode('utf-8')
                
                # Send response
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = {
                    'audio': audio_b64,
                    'format': 'wav'
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
                
            except Exception as e:
                print(f"Error: {e}", file=sys.stderr)
                import traceback
                traceback.print_exc()
                self.send_error(500, str(e))
        else:
            self.send_error(404, "Not found")

    def log_message(self, format, *args):
        """Suppress default logging"""
        pass

if __name__ == '__main__':
    PORT = 5174
    server = HTTPServer(('127.0.0.1', PORT), PiperHandler)
    print(f"🎤 Piper TTS Server running on http://127.0.0.1:{PORT}")
    print("Ready to serve TTS requests!")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        server.shutdown()
