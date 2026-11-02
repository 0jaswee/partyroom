# Deployment status — free edition

## Updated ZIP handoff

This updated package adds Would You Rather, host settings/score reset, offline-host recovery, and GitHub Pages entry fixes. It has 27 passing automated tests and passed live Firebase integration checks in a temporary preview. The latest package has **not** been uploaded to the user's GitHub repository or released to the main Firebase Hosting URL. Upload its contents following UPDATE-GITHUB.md. The deployment history below describes the earlier free release, not publication of these new changes.

Published 2026-11-02 from Google Cloud Shell, with the user's approval to authorize deployment.

- Live website: https://partyroom-ba907.web.app
- Firebase project: partyroom-ba907
- Plan: Spark; no billing account or Blaze activation performed.
- Authentication: Anonymous enabled.
- Realtime Database: us-central1, configured URL in public/firebase-config.js.
- Free-edition database.rules.json published successfully through the Firebase console.
- Static Hosting deployed successfully with Firebase CLI; no Cloud Functions configured or deployed.

Verified: 17 local automated tests pass; those tests also passed in Cloud Shell before the first Hosting release. Live SDK smoke checks passed for two separate anonymous identities joining one room, a turn and shared dice roll result, host-end atomic deletion, and last-player-leave deletion. A browser test created a 20-seat room, displayed its live lobby/QR invitation, then ended it and returned to the landing page with a cleared room URL and deletion message.

The first live smoke test found a transaction cache issue on join. It was fixed by keeping a live subscription during each transaction; the live checks were rerun successfully. The final free-firebase.js includes that fix.

Not physically tested with 20 phones simultaneously. Camera permission/scanning requires a real supported phone; test this before relying on QR scanning at an event. The 20-person cap is covered by model tests.

Use this folder and its ZIP rather than earlier paid-backend packages. See README.md for free deployment updates and cleanup behavior.
