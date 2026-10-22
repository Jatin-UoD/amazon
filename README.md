# HomePilot

One Home. One App. Total Control.

Mobile-first smart home console: lights, fans, AC, TV, plugs, curtains, a washer status feed, water tank and pump, energy analytics, automations, and a Ring **demo** path. Essential controls run with no AI key.

This repository is the working web app (phone layout). A native Expo shell is not what the live preview runs. The device, command, and Ring contracts below are the same shapes a React Native client or an ESP32 firmware module would speak.

## What is real vs simulated

| Piece | Status |
| --- | --- |
| Device controls, rooms, timers, scenes | Working. State is saved in this browser. |
| Command ack: pending, confirmed, failed, offline | Working. Offline devices reject commands. |
| Fan speed | Only if the device declares a regulator. Passage Fan is a relay and refuses speed. |
| Energy, voltage, current, cost | **Simulated.** Integrated from instantaneous watts. Gaps over 15s are not invented. Tariff is editable. |
| Water auto start/stop | **Simulated** local logic: low/high marks, runtime limit, sensor-fault lockout. |
| Assistant | Deterministic rules. No model is called. Ambiguous commands ask; pumps and high loads confirm. |
| Ring | **Demo events only.** Not a live Ring account. Setup steps for the official API are in the Ring screen. |
| Google / Apple sign-in | Not configured. Email sign-in is local to this device. Passwords are not stored. |

Demo accounts (any password of 4+ characters):

- `jatin@example.com` — owner
- `anika@example.com` — admin
- `guest@homepilot.app` — guest, controls locked

## Run

```bash
npm install
npm run dev
```

The app serves on port 8080.

```bash
npm run typecheck
npm test
npm run build
```

See the rest of the source in the following commits.
