# Verification of this update

- 27 automated tests pass: existing dice/truth rules, 20-person cap, reconnection, group polls, scoring/ties/expiry, stale votes, host settings and reset, offline-host recovery guard, room deletion, and the GitHub Pages root redirect preserving invite parameters.
- Browser JavaScript syntax checked for every local module.
- Live Firebase SDK checks passed with two separate anonymous identities: joining, shared dice results, switching games, Would You Rather votes/results, score reset, offline-host takeover, host-end deletion, and last-player-leave deletion.
- Browser preview verified: all three game choices, game/settings dialog, changing games while preserving players/scores, group poll/results, reset confirmation, and Truth or Dare rendering/voting controls.
- A display bug found in browser QA was fixed: visible turn counts now reset separately from the revision used to reject stale actions. A regression test covers it.
- Existing database rules are compatible and were not weakened or replaced for this update. Firebase remains on Spark; no billing activation or Cloud Functions deployment.

Limits of verification: no test with 20 physical phones, no physical camera scanning check, and no full Firebase Security Rules emulator suite. The game is still designed for trusted friends; clients run game logic. GitHub repository updates will be uploaded by the user following UPDATE-GITHUB.md.
