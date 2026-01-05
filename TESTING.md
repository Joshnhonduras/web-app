## Automated

- `npm run lint`
- `npm test` (Vitest) — install deps first if `vitest` is missing.

## Manual smoke (chat)

- Launch `npm run dev` and open `/`.
- Verify API key gating: before configuring, chat send is disabled and settings prompt shows; after adding key/provider, send enables.
- Start a chat, confirm messages appear, timestamps render, and context windowing still feels coherent after 20+ turns.
- Trigger crisis wording (“I want to hurt myself”) and confirm crisis resources appear and message is stored.
- Trigger abuse wording (“my partner hits me”) and confirm safety resources appear.

## Manual smoke (voice)

- With API configured, open `/masculine-mentor/voice`, start call, and confirm mic is prompted, transcript updates, and TTS responds.
- Toggle hold/resume and end call; confirm return to text chat preserves messages.
- Piper: click “Piper Neural TTS” check; if Piper server is running, confirm it selects and allows testing.

## Privacy/session

- Enable “Private Session” in Settings → Privacy; refresh and confirm API key/messages are cleared and not persisted.
- Use “Delete All Stored Data” to ensure storage wipes and app reloads cleanly.
