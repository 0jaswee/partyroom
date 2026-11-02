# Agent handoff — free edition

Date: 2026-11-02. This edition supersedes the earlier Cloud Functions implementation. User explicitly requested free-only, a maximum of 20 people, and room data deletion when a room ends. Do not suggest Blaze or deploy paid services for this edition.

Firebase project `partyroom-ba907`, web app `PartyRoom Web`, anonymous sign-in enabled, RTDB `https://partyroom-ba907-default-rtdb.firebaseio.com`, us-central1. Configuration is in public/firebase-config.js and .firebaserc. Use database.rules.json from this folder. Earlier rules for rooms/state are incompatible with this edition.

Buildless browser ES modules. Firebase SDK loads from gstatic, QR packages from esm.sh, optional fonts from Google Fonts. package.json only starts the local static server and node:test. GitHub Pages workflow uploads public/. firebase.json deploys static Hosting and database rules only, no Functions.

Architecture: browser SDK directly runs RTDB transactions on `freeRooms/{code_sha256}`. Hash input includes code and password; no plaintext password is saved. Known-room reads require anonymous auth; root listing denied. Members can write game state; the app's pure engine enforces normal play, but members are trusted and can bypass it in custom clients. This tradeoff removes the billable backend. Do not claim server-authoritative or cheat-proof behavior. Security rules validate structure and membership/creation/join cases; emulator tests remain useful before wider distribution.

State includes owner, created, seatCount, settings, players, phase, round, current, deadline, streak, votes, last, kind, prompt. Player: name/active/joined/score. Capacity 2–20, default 20; inactive seats retained for reconnecting identities. Duplicate names checked case-insensitively in transaction. Same browser anonymous identity can rejoin; no name-only identity recovery. Room actions and deadlines use client clock + Firebase serverTimeOffset. All phones can request expiration through transactions. No background execution when every phone is closed.

End Room is host-only in UI and deletion rules, with an explicit confirmation. It atomically deletes freeRooms/key and freePresence/key. A last explicit Leave returns null from the room transaction, then removes presence. Client listeners handle null by clearing room state, listeners, URL query, and old last-room storage. Names/theme/Auth persistence are not game-state cache and remain. Closing all tabs without ending does not trigger room deletion; offline conditional cleanup needs a different design if requested.

Game engine: Dice fixed join order, extra on selected number, optional third match ends streak; pips score. Truth/Dare random next player excluding current, other members vote, configured tie fallback, done awards 1/2, pass/expiry 0. Adding games means editing settings labels/validation, engine transition, render branch, tests and docs.

Deployment: firebase login then firebase deploy --only database,hosting. The project is still Spark; leave it there. GitHub Pages may host the frontend alternatively. Use final verification/status notes for what was actually published and tested; do not treat README deployment instructions as evidence of success.
