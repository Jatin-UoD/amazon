# HomePilot

**One Home. One App. Total Control.**

Mobile-first smart home console for the Amazon Developer Hackathon.

## Features (matching the UI mockup)

1. Splash / Onboarding  
2. Sign In (demo accounts)  
3. Home Dashboard — rooms, quick actions, power  
4. Room Control  
5. Device Detail — fan speed, AC temp, brightness  
6. Energy Analytics — charts + device-wise usage  
7. AI Assistant — rule-based local commands  
8. Automation & Scenes  
9. Ring Security (demo events)  
10. Water Tank & Pump (auto start/stop)  
11. Notifications  
12. Settings & Members  
13. Device Pairing  
14. Device List  
15. Live Monitoring  
16. Profile  

## Demo accounts

| Email | Role |
|-------|------|
| jatin@example.com | Owner |
| anika@example.com | Admin |
| guest@homepilot.app | Guest (controls locked) |

Any password with 4+ characters works. State is saved in the browser.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:8080

## Stack

- React 19 + TypeScript + Vite  
- Tailwind CSS v4  
- Zustand (persisted state)  
- Recharts (energy charts)  
- Lucide icons  

Electricity, water, and Ring events are **simulated**. No external API keys required.

## Deploy (Vercel)

Import this repo on Vercel. Framework: Vite. Build: `npm run build`. Output: `dist`. No environment variables.
