# Update your GitHub Pages site

Your current root URL displays the README because the game files are under public/. This package fixes that and adds new features. No paid Firebase setup is required.

1. Extract the ZIP.
2. Open https://github.com/0jaswee/partyroom/ and choose **Add file → Upload files**.
3. Upload the extracted folder's **contents**, including the new root `index.html` and updated `public/` and `tests/` folders. Do not upload the outer folder or ZIP itself. Allow matching files to be replaced by this upload.
4. Commit to `main`. Your existing GitHub Pages publishing setup can stay as it is. Wait for the Pages build/deployment to finish in Actions.
5. Open https://0jaswee.github.io/partyroom/ and refresh. It should open the game, preserving room invite query strings.

The `.github/workflows/pages.yml` workflow is optional if you already publish from the main branch root; the new root index.html works with that setup. If you use the included workflow instead, set Settings → Pages → Source → GitHub Actions.

No changes to Firebase keys, billing, or rules are required for these features. The app continues to use the same free Firebase project and the same 20-person limit. Do not replace the config with keys from another project.

New: Would You Rather group polls, host game/settings controls, score reset, live offline labels, and an offline-host takeover option after a 20-second grace period. Fixed: root Pages URL, transient joins, disabled-button recovery, scanner cancellation, cross-host QR invites, clipboard fallback, and room path cleanup on exit. Names/theme/anonymous identity remain browser preferences; room game data is deleted when the host ends the room or the last member explicitly leaves.
