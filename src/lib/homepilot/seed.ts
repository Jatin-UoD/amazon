import type { Device, Room, Automation, Activity, Member, WaterState, RingEvent } from "./model";

export const demoRooms: Room[] = [
  { id: "living", name: "Living Room" },
  { id: "bedroom", name: "Bedroom" },
  { id: "kitchen", name: "Kitchen" },
  { id: "others", name: "Others" },
];

const caps = {
  light: { power: true, brightness: true, color: true, fanSpeed: null, ac: null, media: false, curtain: false, washerStatus: false, pump: false },
  fan: { power: true, brightness: false, color: false, fanSpeed: { min: 1, max: 5 }, ac: null, media: false, curtain: false, washerStatus: false, pump: false },
  fanRelay: { power: true, brightness: false, color: false, fanSpeed: null, ac: null, media: false, curtain: false, washerStatus: false, pump: false },
  ac: { power: true, brightness: false, color: false, fanSpeed: null, ac: { min: 16, max: 30, modes: ["Cool","Heat","Dry","Fan","Auto"] as const, fanModes: ["Auto","Low","Med","High"] as const }, media: false, curtain: false, washerStatus: false, pump: false },
  tv: { power: true, brightness: false, color: false, fanSpeed: null, ac: null, media: true, curtain: false, washerStatus: false, pump: false },
  plug: { power: true, brightness: false, color: false, fanSpeed: null, ac: null, media: false, curtain: false, washerStatus: false, pump: false },
  pump: { power: true, brightness: false, color: false, fanSpeed: null, ac: null, media: false, curtain: false, washerStatus: false, pump: true },
};

export function demoDevices(now: number): Device[] {
  return [
    { id: "lr-light", name: "Living Room Light", roomId: "living", kind: "light", integration: "simulated", online: true, favorite: true, power: true, brightness: 75, color: "warm", speed: 0, temperature: 24, acMode: "Cool", fanMode: "Auto", curtain: 0, volume: 40, playing: false, washerState: "idle", ratedWatts: 12, capabilities: caps.light, lastAck: "confirmed", lastAckAt: now, timerOffAt: null, lastSeen: now },
    { id: "lr-fan", name: "Ceiling Fan", roomId: "living", kind: "fan", integration: "simulated", online: true, favorite: true, power: true, brightness: 0, color: "", speed: 3, temperature: 24, acMode: "Cool", fanMode: "Auto", curtain: 0, volume: 0, playing: false, washerState: "idle", ratedWatts: 75, capabilities: caps.fan, lastAck: "confirmed", lastAckAt: now, timerOffAt: null, lastSeen: now },
    { id: "lr-tv", name: "TV", roomId: "living", kind: "tv", integration: "simulated", online: true, favorite: false, power: false, brightness: 0, color: "", speed: 0, temperature: 24, acMode: "Cool", fanMode: "Auto", curtain: 0, volume: 30, playing: false, washerState: "idle", ratedWatts: 120, capabilities: caps.tv, lastAck: "confirmed", lastAckAt: now, timerOffAt: null, lastSeen: now },
    { id: "lr-ac", name: "AC", roomId: "living", kind: "ac", integration: "simulated", online: true, favorite: true, power: true, brightness: 0, color: "", speed: 0, temperature: 24, acMode: "Cool", fanMode: "Auto", curtain: 0, volume: 0, playing: false, washerState: "idle", ratedWatts: 1500, capabilities: caps.ac, lastAck: "confirmed", lastAckAt: now, timerOffAt: null, lastSeen: now },
    { id: "br-light", name: "Bedroom Light", roomId: "bedroom", kind: "light", integration: "simulated", online: true, favorite: false, power: false, brightness: 50, color: "soft", speed: 0, temperature: 24, acMode: "Cool", fanMode: "Auto", curtain: 0, volume: 0, playing: false, washerState: "idle", ratedWatts: 10, capabilities: caps.light, lastAck: "confirmed", lastAckAt: now, timerOffAt: null, lastSeen: now },
    { id: "br-fan", name: "Bedroom Fan", roomId: "bedroom", kind: "fan", integration: "simulated", online: true, favorite: false, power: false, brightness: 0, color: "", speed: 2, temperature: 24, acMode: "Cool", fanMode: "Auto", curtain: 0, volume: 0, playing: false, washerState: "idle", ratedWatts: 70, capabilities: caps.fan, lastAck: "confirmed", lastAckAt: now, timerOffAt: null, lastSeen: now },
    { id: "br-ac", name: "Bedroom AC", roomId: "bedroom", kind: "ac", integration: "simulated", online: true, favorite: false, power: false, brightness: 0, color: "", speed: 0, temperature: 26, acMode: "Cool", fanMode: "Auto", curtain: 0, volume: 0, playing: false, washerState: "idle", ratedWatts: 1400, capabilities: caps.ac, lastAck: "confirmed", lastAckAt: now, timerOffAt: null, lastSeen: now },
    { id: "kit-light", name: "Kitchen Light", roomId: "kitchen", kind: "light", integration: "simulated", online: true, favorite: false, power: true, brightness: 90, color: "day", speed: 0, temperature: 24, acMode: "Cool", fanMode: "Auto", curtain: 0, volume: 0, playing: false, washerState: "idle", ratedWatts: 15, capabilities: caps.light, lastAck: "confirmed", lastAckAt: now, timerOffAt: null, lastSeen: now },
    { id: "pass-fan", name: "Passage Fan", roomId: "others", kind: "fan", integration: "simulated", online: true, favorite: false, power: false, brightness: 0, color: "", speed: 1, temperature: 24, acMode: "Cool", fanMode: "Auto", curtain: 0, volume: 0, playing: false, washerState: "idle", ratedWatts: 40, capabilities: caps.fanRelay, lastAck: "confirmed", lastAckAt: now, timerOffAt: null, lastSeen: now, note: "Relay only — no speed regulator" },
    { id: "washer", name: "Washing Machine", roomId: "others", kind: "washer", integration: "simulated", online: false, favorite: false, power: false, brightness: 0, color: "", speed: 0, temperature: 24, acMode: "Cool", fanMode: "Auto", curtain: 0, volume: 0, playing: false, washerState: "idle", ratedWatts: 500, capabilities: { ...caps.plug, washerStatus: true }, lastAck: "offline", lastAckAt: now - 3 * 3600_000, timerOffAt: null, lastSeen: now - 3 * 3600_000 },
    { id: "pump", name: "Water Pump", roomId: "others", kind: "pump", integration: "simulated", online: true, favorite: false, power: false, brightness: 0, color: "", speed: 0, temperature: 24, acMode: "Cool", fanMode: "Auto", curtain: 0, volume: 0, playing: false, washerState: "idle", ratedWatts: 750, capabilities: caps.pump, lastAck: "confirmed", lastAckAt: now, timerOffAt: null, lastSeen: now },
  ];
}

export const demoAutomations: Automation[] = [
  { id: "a1", name: "Morning Routine", detail: "7:00 AM · Daily", enabled: true, icon: "sun", cooldownMin: 60, priority: 1, lastRun: null, lastStatus: null, trigger: { type: "time", hour: 7, minute: 0 }, actions: [{ type: "power-kind", kind: "light", on: true }], log: [] },
  { id: "a2", name: "Night Mode", detail: "10:00 PM · Daily", enabled: true, icon: "moon", cooldownMin: 60, priority: 2, lastRun: null, lastStatus: null, trigger: { type: "time", hour: 22, minute: 0 }, actions: [{ type: "power-kind", kind: "light", on: false }, { type: "power-kind", kind: "tv", on: false }], log: [] },
  { id: "a3", name: "Motion Light", detail: "Motion detected", enabled: true, icon: "motion", cooldownMin: 5, priority: 3, lastRun: null, lastStatus: null, trigger: { type: "ring", event: "motion" }, actions: [{ type: "power", deviceId: "lr-light", on: true }], log: [] },
  { id: "a4", name: "Water Tank Auto", detail: "Below 20% · Pump ON", enabled: true, icon: "water", cooldownMin: 30, priority: 1, lastRun: null, lastStatus: null, trigger: { type: "linked-water" }, actions: [{ type: "pump", on: true }], log: [] },
  { id: "a5", name: "Energy Saver", detail: "High usage > 3kW", enabled: false, icon: "energy", cooldownMin: 15, priority: 4, lastRun: null, lastStatus: null, trigger: { type: "power-above", watts: 3000 }, actions: [{ type: "power-kind", kind: "ac", on: false }], log: [] },
];

export function demoActivities(now: number): Activity[] {
  return [
    { id: "n1", t: now - 2 * 60_000, title: "Ring Motion Detected", body: "Front Door · 2 min ago", tone: "alert", category: "alert", read: false },
    { id: "n2", t: now - 15 * 60_000, title: "AC Temperature Reached", body: "Bedroom · 15 min ago", tone: "info", category: "event", read: false },
    { id: "n3", t: now - 32 * 60_000, title: "High Power Usage Alert", body: "Total home · 32 min ago", tone: "warn", category: "alert", read: false },
    { id: "n4", t: now - 60 * 60_000, title: "Automation Executed", body: "Night Mode · 1 hr ago", tone: "ok", category: "automation", read: true },
    { id: "n5", t: now - 2 * 3600_000, title: "Water Tank Full", body: "Tank · 2 hr ago", tone: "ok", category: "event", read: true },
    { id: "n6", t: now - 3 * 3600_000, title: "Device Offline", body: "Washing Machine · 3 hr ago", tone: "warn", category: "alert", read: true },
  ];
}

export const demoMembers: Member[] = [
  { id: "m1", name: "Jatin Sharma", email: "jatin@example.com", role: "owner" },
  { id: "m2", name: "Anika Sharma", email: "anika@example.com", role: "admin" },
  { id: "m3", name: "Guest User", email: "guest@homepilot.app", role: "guest" },
];

export function demoWater(now: number): WaterState {
  return {
    levelPct: 70,
    capacityM: 4.0,
    pumpOn: false,
    auto: true,
    highPct: 95,
    lowPct: 20,
    runtimeLimitMin: 45,
    pumpStartedAt: null,
    sensorOk: true,
    simulated: true,
    lastAlert: null,
  };
}

export function demoRingEvents(now: number): RingEvent[] {
  return [
    { id: "r1", type: "motion", t: now - 2 * 60_000, place: "Front Door", demo: true },
    { id: "r2", type: "doorbell", t: now - 12 * 60_000, place: "Front Door", demo: true },
  ];
}
