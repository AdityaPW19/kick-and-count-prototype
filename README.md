# Count & Kick — local edition

Requires Node.js 20 or newer. No npm dependencies or Astrocade account are needed.

## Launch

From this folder, run `npm start` (or from the workspace root, `npm --prefix kick-count-prototype start`). Open http://127.0.0.1:4174/ and press PLAY. Stop the server with Ctrl+C.

The first launch downloads all 23 supplied image/audio assets. Subsequent launches reuse them and work without an internet connection. The optional Google font uses the existing system-font fallback when offline.

## Landscape play

The game uses a 1280 × 720 scene that scales to fit the available screen without cropping. Rotate phones/tablets sideways; portrait mode displays a rotate prompt and freezes gameplay until you return to landscape. The pause button also freezes question delays and animations. Use the fullscreen button where the browser supports it (fullscreen is optional).

Tap/click the matching ball, or press its number on a keyboard (`0` means 10). Sound controls are available both on the menu and during play. The landscape styles are in [landscape.css](landscape.css).

## Configuration and saves

- Edit [config.json](config.json) and refresh to apply your settings and dialogue.
- Open http://127.0.0.1:4174/#edit for a small live settings panel. These session-only edits do not modify the configuration file. Starting level applies on the next PLAY.
- Tutorial completion and the game's saved high score are stored in this browser's localStorage, not Astrocade. Clearing site data resets them. The original game starts a new session on PLAY; it does not resume unfinished levels.
- [local-runtime.js](local-runtime.js) implements the Astrocade APIs this game calls. This is a local compatibility layer, not a copy of Astrocade's library. Cloud leaderboard, LLM and animation APIs are not needed by this game and are not provided.
- [asset-manifest.json](asset-manifest.json) maps the original asset IDs to local files and preserves download URLs. Run `npm run download-assets` to restore missing assets.

Serve the game over HTTP; opening the HTML directly will not load its JSON configuration. The server listens only on this computer (127.0.0.1). Set the PORT environment variable if port 4174 is already in use.