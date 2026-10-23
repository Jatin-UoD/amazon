import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Activity, Automation, ChatMessage, Device, Member, NotifFilter,
  RangeKey, RingEvent, Screen, Session, Tab, WaterState,
} from "./model";
import { applyActions, interpretCommand, nextPump, totalPower } from "./logic";
import {
  demoActivities, demoAutomations, demoDevices, demoMembers,
  demoRingEvents, demoRooms, demoWater,
} from "./seed";

const now = () => Date.now();

interface Store {
  session: Session;
  screen: Screen;
  tab: Tab;
  devices: Device[];
  rooms: typeof demoRooms;
  automations: Automation[];
  activities: Activity[];
  members: Member[];
  water: WaterState;
  ringEvents: RingEvent[];
  chat: ChatMessage[];
  selectedRoomId: string | null;
  selectedDeviceId: string | null;
  range: RangeKey;
  notifFilter: NotifFilter;
  tariff: number;
  energyKwh: number;

  signIn: (email: string, name?: string) => void;
  signOut: () => void;
  setScreen: (s: Screen) => void;
  setTab: (t: Tab) => void;
  selectRoom: (id: string) => void;
  selectDevice: (id: string) => void;
  toggleDevice: (id: string) => void;
  setSpeed: (id: string, speed: number) => void;
  setTemp: (id: string, temp: number) => void;
  setBrightness: (id: string, b: number) => void;
  toggleAutomation: (id: string) => void;
  setWaterAuto: (v: boolean) => void;
  setPump: (on: boolean) => void;
  sendChat: (text: string) => void;
  confirmChat: () => void;
  setRange: (r: RangeKey) => void;
  setNotifFilter: (f: NotifFilter) => void;
  markRead: (id: string) => void;
  tick: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      session: { signedIn: false, name: "", email: "", role: "guest" },
      screen: "splash",
      tab: "home",
      devices: demoDevices(now()),
      rooms: demoRooms,
      automations: demoAutomations,
      activities: demoActivities(now()),
      members: demoMembers,
      water: demoWater(now()),
      ringEvents: demoRingEvents(now()),
      chat: [
        { id: "c0", role: "assistant", text: "Hi! I can control your home. Try “Turn off all the lights in the living room”." },
      ],
      selectedRoomId: null,
      selectedDeviceId: null,
      range: "day",
      notifFilter: "all",
      tariff: 7.5,
      energyKwh: 12.5,

      signIn: (email, name) => {
        const role =
          email.includes("guest") ? "guest" :
          email.includes("anika") ? "admin" : "owner";
        set({
          session: {
            signedIn: true,
            email,
            name: name || (role === "owner" ? "Jatin Sharma" : role === "admin" ? "Anika Sharma" : "Guest"),
            role,
          },
          screen: "home",
        });
      },
      signOut: () => set({ session: { signedIn: false, name: "", email: "", role: "guest" }, screen: "signin" }),
      setScreen: (screen) => set({ screen }),
      setTab: (tab) => {
        const map: Record<Tab, Screen> = {
          home: "home", rooms: "devices", automation: "automation", analytics: "analytics", more: "settings",
        };
        set({ tab, screen: map[tab] });
      },
      selectRoom: (id) => set({ selectedRoomId: id, screen: "room" }),
      selectDevice: (id) => set({ selectedDeviceId: id, screen: "device" }),
      toggleDevice: (id) => {
        const { devices, session } = get();
        if (session.role === "guest") return;
        const d = devices.find((x) => x.id === id);
        if (!d) return;
        const res = applyActions(devices, [{ type: "power", deviceId: id, on: !d.power }], now());
        set({ devices: res.devices });
      },
      setSpeed: (id, speed) => {
        const res = applyActions(get().devices, [{ type: "speed", deviceId: id, speed }], now());
        set({ devices: res.devices });
      },
      setTemp: (id, temp) => {
        const res = applyActions(get().devices, [{ type: "temperature", deviceId: id, temperature: temp }], now());
        set({ devices: res.devices });
      },
      setBrightness: (id, b) => {
        const res = applyActions(get().devices, [{ type: "brightness", deviceId: id, brightness: b }], now());
        set({ devices: res.devices });
      },
      toggleAutomation: (id) =>
        set({
          automations: get().automations.map((a) =>
            a.id === id ? { ...a, enabled: !a.enabled } : a
          ),
        }),
      setWaterAuto: (v) => set({ water: { ...get().water, auto: v } }),
      setPump: (on) => {
        const res = applyActions(get().devices, [{ type: "pump", on }], now());
        set({
          devices: res.devices,
          water: { ...get().water, pumpOn: on, pumpStartedAt: on ? now() : null },
        });
      },
      sendChat: (text) => {
        const { devices, rooms, chat, water, energyKwh, tariff } = get();
        const userMsg: ChatMessage = { id: `u${now()}`, role: "user", text };
        const intent = interpretCommand(text, devices, rooms);
        let reply: ChatMessage;
        if (intent.type === "act") {
          const res = applyActions(devices, intent.actions, now());
          set({ devices: res.devices });
          reply = { id: `a${now()}`, role: "assistant", text: intent.text, cards: intent.cards };
        } else if (intent.type === "confirm") {
          reply = { id: `a${now()}`, role: "assistant", text: intent.text, confirm: { actions: intent.actions, saveAs: intent.saveAs } };
        } else if (intent.type === "query-energy") {
          reply = { id: `a${now()}`, role: "assistant", text: `Today's usage is ${energyKwh.toFixed(1)} kWh (₹${(energyKwh * tariff).toFixed(2)}).` };
        } else if (intent.type === "query-water") {
          reply = { id: `a${now()}`, role: "assistant", text: `Water tank is at ${water.levelPct}% (${((water.levelPct / 100) * water.capacityM).toFixed(1)} / ${water.capacityM} m). Pump is ${water.pumpOn ? "ON" : "OFF"}.` };
        } else {
          reply = { id: `a${now()}`, role: "assistant", text: intent.text, cards: intent.cards };
        }
        set({ chat: [...chat, userMsg, reply] });
      },
      confirmChat: () => {
        const { chat, devices } = get();
        const last = [...chat].reverse().find((m) => m.confirm);
        if (!last?.confirm) return;
        const res = applyActions(devices, last.confirm.actions, now());
        set({
          devices: res.devices,
          chat: [
            ...chat,
            { id: `a${now()}`, role: "assistant", text: "Done. Actions applied." },
          ],
        });
      },
      setRange: (range) => set({ range }),
      setNotifFilter: (notifFilter) => set({ notifFilter }),
      markRead: (id) =>
        set({
          activities: get().activities.map((a) =>
            a.id === id ? { ...a, read: true } : a
          ),
        }),
      tick: () => {
        const w = nextPump(get().water, now());
        // slight level drift when pump on
        if (w.pumpOn && w.levelPct < 100) w.levelPct = Math.min(100, w.levelPct + 0.05);
        if (!w.pumpOn && w.levelPct > 0) w.levelPct = Math.max(0, w.levelPct - 0.01);
        set({ water: w, energyKwh: get().energyKwh + totalPower(get().devices) / 3_600_000 });
      },
    }),
    { name: "homepilot-v1" }
  )
);
