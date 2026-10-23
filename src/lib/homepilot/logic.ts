import type { Action, Automation, Device, DeviceKind, Intent, Role, Room, WaterState } from "./model";

export function integrateKwh(watts: number, ms: number): number {
  return (watts * ms) / 3_600_000_000;
}

export function estimateCost(kwh: number, tariff: number): number {
  return Math.round(kwh * tariff * 100) / 100;
}

export function sampleEnergy(watts: number, gapMs: number): { kwh: number; gap: boolean } {
  if (gapMs > 15_000) return { kwh: 0, gap: true };
  return { kwh: integrateKwh(watts, gapMs), gap: false };
}

export function deltaKwh(prev: number, next: number): { kwh: number; note?: string } {
  if (next < prev) return { kwh: 0, note: "reset-ignored" };
  const d = next - prev;
  if (d > 50) return { kwh: 0, note: "spike-ignored" };
  return { kwh: d };
}

export function can(role: Role, action: "control" | "manage" | "admin"): boolean {
  if (role === "owner") return true;
  if (role === "admin") return action !== "admin" || true;
  if (role === "member") return action === "control";
  return false;
}

export function allowCommand(recent: number[], now: number, limit: number, windowMs: number) {
  const fresh = recent.filter((t) => now - t < windowMs);
  return { ok: fresh.length < limit, recent: [...fresh, now] };
}

export function rememberCommand(ids: string[], id: string) {
  return { duplicate: ids.includes(id), ids: ids.includes(id) ? ids : [...ids, id].slice(-50) };
}

export function applyActions(devices: Device[], actions: Action[], now: number) {
  let next = devices.map((d) => ({ ...d }));
  const messages: string[] = [];
  let status: "ok" | "failed" = "ok";

  for (const a of actions) {
    if (a.type === "power") {
      const d = next.find((x) => x.id === a.deviceId);
      if (!d) { status = "failed"; messages.push("Device not found"); continue; }
      if (!d.online) { status = "failed"; messages.push(`${d.name} is offline`); d.lastAck = "offline"; continue; }
      d.power = a.on;
      d.lastAck = "confirmed";
      d.lastAckAt = now;
    } else if (a.type === "power-kind") {
      next = next.map((d) => {
        if (d.kind !== a.kind) return d;
        if (a.roomId && d.roomId !== a.roomId) return d;
        if (!d.online) return d;
        return { ...d, power: a.on, lastAck: "confirmed" as const, lastAckAt: now };
      });
    } else if (a.type === "speed" || a.type === "speed-delta") {
      const d = next.find((x) => x.id === a.deviceId);
      if (!d) { status = "failed"; messages.push("Device not found"); continue; }
      if (!d.capabilities.fanSpeed) {
        status = "failed";
        messages.push(`${d.name} is a relay — no speed regulator`);
        continue;
      }
      const { min, max } = d.capabilities.fanSpeed;
      const target = a.type === "speed" ? a.speed : d.speed + a.delta;
      d.speed = Math.max(min, Math.min(max, target));
      d.power = true;
      d.lastAck = "confirmed";
      d.lastAckAt = now;
    } else if (a.type === "temperature") {
      const d = next.find((x) => x.id === a.deviceId);
      if (!d?.capabilities.ac) { status = "failed"; messages.push("Not an AC"); continue; }
      d.temperature = Math.max(d.capabilities.ac.min, Math.min(d.capabilities.ac.max, a.temperature));
      d.power = true;
      d.lastAck = "confirmed";
      d.lastAckAt = now;
    } else if (a.type === "ac-mode") {
      const d = next.find((x) => x.id === a.deviceId);
      if (!d?.capabilities.ac) continue;
      d.acMode = a.mode;
      d.lastAck = "confirmed";
      d.lastAckAt = now;
    } else if (a.type === "brightness") {
      const d = next.find((x) => x.id === a.deviceId);
      if (!d) continue;
      d.brightness = Math.max(0, Math.min(100, a.brightness));
      d.power = true;
      d.lastAck = "confirmed";
      d.lastAckAt = now;
    } else if (a.type === "pump") {
      const d = next.find((x) => x.kind === "pump");
      if (d) { d.power = a.on; d.lastAck = "confirmed"; d.lastAckAt = now; }
    }
  }
  return { devices: next, status, messages };
}

export function nextPump(water: WaterState, now: number): WaterState {
  let w = { ...water };
  if (!w.sensorOk) return w;
  if (w.auto && !w.pumpOn && w.levelPct <= w.lowPct) {
    w.pumpOn = true;
    w.pumpStartedAt = now;
    w.lastAlert = "Auto start — low level";
  }
  if (w.pumpOn) {
    if (w.levelPct >= w.highPct) {
      w.pumpOn = false;
      w.pumpStartedAt = null;
      w.lastAlert = "Auto stop — high level";
    }
    if (w.pumpStartedAt && now - w.pumpStartedAt > w.runtimeLimitMin * 60_000) {
      w.pumpOn = false;
      w.pumpStartedAt = null;
      w.lastAlert = "Runtime limit reached";
    }
  }
  return w;
}

export function shouldRunAutomation(rule: Automation, now: number) {
  if (!rule.enabled) return { ok: false, reason: "disabled" };
  if (rule.lastRun && now - rule.lastRun < rule.cooldownMin * 60_000) return { ok: false, reason: "cooldown" };
  return { ok: true };
}

export function retriggersSelf(rule: Automation) {
  return rule.trigger.type === "linked-water" || rule.trigger.type === "power-above";
}

export function interpretCommand(text: string, devices: Device[], rooms: Room[]): Intent {
  const t = text.toLowerCase().trim();

  if (/unlock|door lock|front door lock/.test(t)) {
    return { type: "reply", text: "Door unlock is not a supported appliance in this demo." };
  }
  if (/passage fan.*speed|set the passage fan/.test(t)) {
    return { type: "reply", text: "Passage Fan is a relay — no speed regulator." };
  }
  if (/today.*(usage|electric|energy|kwh)|show.*usage|electricity usage/.test(t)) {
    return { type: "query-energy" };
  }
  if (/water tank|tank.*(full|level)|check.*water/.test(t)) {
    return { type: "query-water" };
  }
  if (/bedtime routine|create a bedtime/.test(t)) {
    return {
      type: "confirm",
      text: "Create a bedtime routine? Lights off, AC to 26°, fans low.",
      actions: [
        { type: "power-kind", kind: "light", on: false },
        { type: "temperature", deviceId: "lr-ac", temperature: 26 },
      ],
      saveAs: "Bedtime Routine",
    };
  }
  if (/turn on the water pump|start.*pump|pump on/.test(t)) {
    return { type: "confirm", text: "Start the water pump? This uses significant power.", actions: [{ type: "pump", on: true }] };
  }
  if (/turn off.*(living.?room )?lights|all lights.*(living|off)/.test(t)) {
    return {
      type: "act",
      text: "All lights in the living room have been turned off.",
      actions: [{ type: "power-kind", kind: "light", on: false, roomId: "living" }],
      cards: devices.filter((d) => d.kind === "light" && d.roomId === "living").map((d) => ({ title: d.name, subtitle: "Off" })),
    };
  }
  if (/increase.*(bedroom )?fan|bedroom fan.*speed|raise.*fan/.test(t)) {
    const fan = devices.find((d) => d.id === "br-fan");
    if (fan) return { type: "act", text: "Bedroom fan speed increased.", actions: [{ type: "speed-delta", deviceId: "br-fan", delta: 1 }] };
  }
  if (/set.*(ac|air).*(to )?(\d{2})|ac to (\d{2})/.test(t)) {
    const m = t.match(/(\d{2})/);
    const temp = m ? Number(m[1]) : 24;
    const ac = devices.find((d) => d.kind === "ac" && d.power) || devices.find((d) => d.id === "lr-ac");
    if (ac) return { type: "act", text: `AC set to ${temp}°.`, actions: [{ type: "temperature", deviceId: ac.id, temperature: temp }] };
  }
  if (/turn (it|that) off/.test(t)) {
    return { type: "reply", text: "Which device should I turn off? Please specify the room or name." };
  }
  if (/turn off|switch off/.test(t)) {
    return { type: "reply", text: "Please specify which device or room." };
  }
  return { type: "reply", text: "I can control lights, fans, AC, TV, pump, and answer energy/water questions. Try: “Turn off living room lights”." };
}

export function totalPower(devices: Device[]): number {
  return devices.reduce((s, d) => s + (d.power && d.online ? d.ratedWatts * (d.kind === "light" ? d.brightness / 100 : 1) : 0), 0);
}
