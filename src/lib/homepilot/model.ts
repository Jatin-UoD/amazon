export type Role = "owner" | "admin" | "member" | "guest";

export type DeviceKind =
  | "light"
  | "fan"
  | "ac"
  | "tv"
  | "plug"
  | "curtain"
  | "washer"
  | "pump"
  | "geyser"
  | "sensor";

export type AcMode = "Cool" | "Heat" | "Dry" | "Fan" | "Auto";
export type FanMode = "Auto" | "Low" | "Med" | "High";
export type WasherState = "idle" | "washing" | "rinse" | "spin" | "done";
export type Ack = "idle" | "pending" | "confirmed" | "failed" | "offline";

export interface FanSpeedCap {
  min: number;
  max: number;
}

export interface AcCap {
  min: number;
  max: number;
  modes: AcMode[];
  fanModes: FanMode[];
}

/** Only declared capabilities render controls. A relay is never a speed controller. */
export interface Capabilities {
  power: boolean;
  brightness: boolean;
  color: boolean;
  fanSpeed: FanSpeedCap | null;
  ac: AcCap | null;
  media: boolean;
  curtain: boolean;
  washerStatus: boolean;
  pump: boolean;
}

export interface Device {
  id: string;
  name: string;
  roomId: string;
  kind: DeviceKind;
  /** Every device in this preview speaks the simulator. Real adapters would replace this. */
  integration: "simulated";
  online: boolean;
  favorite: boolean;
  power: boolean;
  brightness: number;
  color: string;
  speed: number;
  temperature: number;
  acMode: AcMode;
  fanMode: FanMode;
  curtain: number;
  volume: number;
  playing: boolean;
  washerState: WasherState;
  ratedWatts: number;
  capabilities: Capabilities;
  lastAck: Ack;
  lastAckAt: number;
  timerOffAt: number | null;
  lastSeen: number;
  note?: string;
}

export interface Room {
  id: string;
  name: string;
}

export type Action =
  | { type: "power"; deviceId: string; on: boolean }
  | { type: "power-kind"; kind: DeviceKind; on: boolean; roomId?: string }
  | { type: "speed"; deviceId: string; speed: number }
  | { type: "speed-delta"; deviceId: string; delta: number }
  | { type: "temperature"; deviceId: string; temperature: number }
  | { type: "ac-mode"; deviceId: string; mode: AcMode }
  | { type: "brightness"; deviceId: string; brightness: number }
  | { type: "curtain"; deviceId: string; position: number }
  | { type: "pump"; on: boolean };

export interface DeviceCommand {
  id: string;
  householdId: string;
  deviceId: string;
  capability: string;
  value: number | string | boolean;
  issuedAt: number;
}

export interface CommandAck {
  id: string;
  status: "confirmed" | "failed" | "offline" | "rejected";
  detail: string;
  at: number;
}

export interface HourBucket {
  t: number;
  kwh: number;
  peakW: number;
  quality: "simulated";
}

export interface TracePoint {
  t: number;
  powerW: number;
  voltage: number;
  current: number;
}

export interface LiveElectrical {
  voltage: number;
  current: number;
  powerW: number;
  frequency: number;
  powerFactor: number;
  quality: "simulated";
  updatedAt: number;
}

export interface Automation {
  id: string;
  name: string;
  detail: string;
  enabled: boolean;
  icon: "sun" | "moon" | "motion" | "water" | "energy" | "bed";
  cooldownMin: number;
  priority: number;
  lastRun: number | null;
  lastStatus: "ok" | "skipped" | "failed" | null;
  trigger:
    | { type: "time"; hour: number; minute: number }
    | { type: "power-above"; watts: number }
    | { type: "ring"; event: "motion" | "doorbell" }
    | { type: "manual" }
    | { type: "linked-water" };
  actions: Action[];
  log: { t: number; status: string; detail: string }[];
}

export interface Activity {
  id: string;
  t: number;
  title: string;
  body: string;
  tone: "info" | "alert" | "ok" | "warn";
  category: "alert" | "event" | "automation" | "command";
  read: boolean;
}

export interface ChatCard {
  title: string;
  subtitle: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  cards?: ChatCard[];
  confirm?: { actions: Action[]; saveAs?: string };
}

export type Intent =
  | { type: "reply"; text: string; cards?: ChatCard[] }
  | { type: "act"; text: string; actions: Action[]; cards?: ChatCard[] }
  | { type: "confirm"; text: string; actions: Action[]; saveAs?: string }
  | { type: "query-energy" }
  | { type: "query-water" };

export interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface WaterState {
  levelPct: number;
  capacityM: number;
  pumpOn: boolean;
  auto: boolean;
  highPct: number;
  lowPct: number;
  runtimeLimitMin: number;
  pumpStartedAt: number | null;
  sensorOk: boolean;
  simulated: true;
  lastAlert: string | null;
}

export interface RingEvent {
  id: string;
  type: "motion" | "doorbell";
  t: number;
  place: string;
  demo: true;
}

export interface RingState {
  events: RingEvent[];
  seenEventIds: string[];
}

export type Screen =
  | "splash"
  | "signin"
  | "signup"
  | "home"
  | "room"
  | "device"
  | "analytics"
  | "assistant"
  | "automation"
  | "ring"
  | "water"
  | "notifications"
  | "settings"
  | "pairing"
  | "devices"
  | "monitor"
  | "profile"
  | "members"
  | "routine";

export type Tab = "home" | "rooms" | "automation" | "analytics" | "more";
export type RangeKey = "day" | "week" | "month" | "year";
export type NotifFilter = "all" | "alert" | "event" | "automation";

export interface Session {
  signedIn: boolean;
  name: string;
  email: string;
  remember: boolean;
}

export interface PendingConfirm {
  title: string;
  detail: string;
  actions: Action[];
}

export const HOUSEHOLD_ID = "home-demo";

export const LIGHT_PRESETS = [
  { id: "warm", label: "Warm", hex: "#ffc98a" },
  { id: "soft", label: "Soft", hex: "#ffe3b8" },
  { id: "day", label: "Day", hex: "#f5f8ff" },
  { id: "cool", label: "Cool", hex: "#c5dcff" },
] as const;

export function lightHex(id: string): string {
  return LIGHT_PRESETS.find((p) => p.id === id)?.hex ?? LIGHT_PRESETS[0].hex;
}
