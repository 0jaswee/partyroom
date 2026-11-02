# PartyRoom — Free edition

**Use this edition. No Cloud Functions, billing account, or Blaze upgrade is required.** It uses anonymous Firebase Authentication, Realtime Database transactions, and static hosting. Your configured Firebase project is `partyroom-ba907`.

## Room size and cleanup

- Room settings allow 2–20 people. The default is 20. Seats are reserved for the same 20 browser identities while a room exists, including someone temporarily disconnected.
- Host → **End room** → **End room & delete data** permanently removes the room, players, scores, votes, challenge, and connection records. Connected phones clear their in-memory room and remove the room query from their URL.
- The last person clicking **Leave room** also deletes the room and connection records. If anyone simply closes the browser or loses their network, the room stays so they can reconnect. Explicitly end the room before everyone leaves; there is no paid background cleanup job.
- No game history is saved in localStorage. Browser authentication, the name preference, and color theme are separate from room data. Anonymous Firebase Auth accounts are not room records and are not deleted when ending a room.
- Firebase's browser SDK holds room state in memory while the page is open. This app has no service worker or offline game-state cache.

## Run locally

Install Node.js 22+ and run from this extracted folder:

```sh
npm start
```

Open http://localhost:8080. Select **Try the demo** for local simulated opponents. With internet and the published free-edition database rules, normal room creation uses the configured Firebase project.

## Publish for free

The Firebase project, anonymous sign-in, and database already exist. Use this edition's `database.rules.json`, not the previous paid-backend rules.

```sh
npm install -g firebase-tools
firebase login
npm test
firebase deploy --only database,hosting
```

`.firebaserc` already selects `partyroom-ba907`. **Do not enable Blaze and do not deploy Functions.** The CLI prints the Firebase Hosting URL after a successful deployment. Alternatively, upload this folder's contents to a GitHub repository, use branch `main`, set repository Settings → Pages → Source → GitHub Actions, and the included workflow publishes `public/`.

In Firebase Authentication → Settings → Authorized domains, add the final frontend hostname if necessary (no scheme or path). For local development, add `localhost` if not already allowed. Firebase Hosting domains are normally included by default.

## Passwords and trust

The room's five-digit code and optional password derive a SHA-256 database path. Passwords are not stored or included in links. A wrong password points to an empty room path. Send password-protected invite links and passwords separately. The same code with a different password is a different room. Use a long password when you want privacy; short passwords can be guessed. Anyone who knows a room's full path effectively holds its invite capability.

Rooms cannot be listed at the database root. Anonymous sign-in is required to access a known room path. Members can mutate the shared game state, and the normal app validates moves and turn revisions inside transactions. This is a **trusted-friends party app**, not a cheat-proof competitive service. There is no paid server validating dice randomness, scores, or client clocks.

## Limits

The Spark plan has a project-wide limit of 100 simultaneous Realtime Database connections. Twenty phones are within that connection limit, but download/storage and auth quotas still apply. Keep one game tab per phone and end rooms after play. Spark does not bill overages; services can stop at free quotas. Review usage in the Firebase console. Official references:

- https://firebase.google.com/docs/database/faq-and-troubleshooting
- https://firebase.google.com/docs/database/usage/billing
- https://firebase.google.com/pricing

## Checks

`npm test` runs the game engine, 20-person cap, reconnect, password path, host-end cleanup, and last-leave cleanup tests. Fake database tests verify client transport behavior; they are not a substitute for Firebase rules emulator tests. Check two real phones after hosting: joins, password rejection, timer advance, scoring, majority votes, host ending, and absence of `freeRooms/{key}` and `freePresence/{key}` afterward.

## Future edits

Read `PLAN.md` and the in-app `context.html`. UI: `public/app.js`. Rules: `public/game-engine.js`. Free Firebase transport: `public/free-firebase.js`. Room creation/join model: `public/room-model.js`. No frontend build or package installation is needed to run the app itself.
