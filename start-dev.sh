#!/bin/bash
# Start Growth Hub with Piper TTS support

cd /mnt/hdd/growth_hub/web-app

echo "🚀 Starting Growth Hub..."

# Kill existing processes on ports 5173 and 5174
fuser -k 5173/tcp 2>/dev/null
fuser -k 5174/tcp 2>/dev/null

# Start Piper TTS server in background
echo "🎤 Starting Piper TTS server..."
python3 piper-server.py &
PIPER_PID=$!

# Wait for Piper to start
sleep 2

# Start Vite dev server
echo "🌐 Starting Vite dev server..."
npm run dev -- --host 0.0.0.0 &
VITE_PID=$!

echo ""
echo "✅ Growth Hub is running!"
echo "   Web App: http://localhost:5173"
echo "   Piper TTS: http://localhost:5174"
echo ""
echo "Press Ctrl+C to stop all servers..."

# Trap Ctrl+C and cleanup
trap "echo ''; echo '🛑 Stopping servers...'; kill $PIPER_PID $VITE_PID 2>/dev/null; exit" INT

# Wait for both processes
wait

