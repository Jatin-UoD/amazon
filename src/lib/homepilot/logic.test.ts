import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  allowCommand,
  applyActions,
  can,
  deltaKwh,
  estimateCost,
  integrateKwh,
  interpretCommand,
  nextPump,
  rememberCommand,
  retriggersSelf,
  sampleEnergy,
  shouldRunAutomation,
} from "./logic.ts";
import type { Automation, WaterState } from "./model.ts";
import { demoDevices, demoRooms } from "./seed.ts";

const devices = demoDevices(1_700_000_000_000);
const rooms = demoRooms;

describe("energy", () => {
  it("integrates 1000 W for one hour as 1 kWh", () => {
    assert.equal(integrateKwh(1000, 3_600_000), 1);
  });

  it("prices 12.5 kWh at ₹7.5 as ₹93.75", () => {
    assert.equal(estimateCost(12.5, 7.5), 93.75);
  });

  it("does not invent energy across a sample gap or a meter reset", () => {
    assert.deepEqual(sampleEnergy(2000, 30_000), { kwh: 0, gap: true });
    assert.equal(deltaKwh(10, 4).note, "reset-ignored");
    assert.equal(deltaKwh(10, 80).note, "spike-ignored");
    assert.equal(deltaKwh(10, 10.5).kwh, 0.5);
  });
});

describe("capabilities and permissions", () => {
  it("refuses speed on a relay fan", () => {
    const result = applyActions(
      devices,
      [{ type: "speed", deviceId: "pass-fan", speed: 3 }],
      1_700_000_000_000,
    );
    assert.equal(result.status, "failed");
    assert.match(result.messages.join(" "), /regulator/i);
    const fan = result.devices.find((d) => d.id === "pass-fan");
    assert.equal(fan?.speed, devices.find((d) => d.id === "pass-fan")?.speed);
    assert.equal(fan?.power, false);
  });

  it("changes a real fan speed and keeps a guest locked out of control", () => {
    const ok = applyActions(devices, [{ type: "speed", deviceId: "lr-fan", speed: 5 }], 1);
    assert.equal(ok.devices.find((d) => d.id === "lr-fan")?.speed, 5);
    assert.equal(can("guest", "control"), false);
    assert.equal(can("member", "control"), true);
    assert.equal(can("member", "manage"), false);
    assert.equal(can("owner", "admin"), true);
  });

  it("rate-limits and drops duplicate command ids", () => {
    const first = allowCommand([1, 2, 3, 4, 5, 6, 7, 8], 9_000, 8, 10_000);
    assert.equal(first.ok, false);
    assert.equal(rememberCommand(["a"], "a").duplicate, true);
  });
});

describe("assistant rules", () => {
  it("turns off living room lights", () => {
    const intent = interpretCommand("Turn off the living room lights.", devices, rooms);
    assert.equal(intent.type, "act");
    if (intent.type !== "act") return;
    assert.deepEqual(intent.actions[0], { type: "power-kind", kind: "light", on: false, roomId: "living" });
  });

  it("raises only the bedroom fan", () => {
    const intent = interpretCommand("Increase the bedroom fan speed.", devices, rooms);
    assert.equal(intent.type, "act");
    if (intent.type !== "act") return;
    assert.deepEqual(intent.actions[0], { type: "speed-delta", deviceId: "br-fan", delta: 1 });
  });

  it("sets the running AC to 24 and asks when the request is ambiguous", () => {
    const intent = interpretCommand("Set the AC to 24 degrees.", devices, rooms);
    assert.equal(intent.type, "act");
    if (intent.type !== "act") return;
    assert.deepEqual(intent.actions[0], { type: "temperature", deviceId: "lr-ac", temperature: 24 });
    const vague = interpretCommand("Turn it off", devices, rooms);
    assert.equal(vague.type, "reply");
  });

  it("answers energy and tank questions without sending a command", () => {
    assert.equal(interpretCommand("Show today's electricity usage.", devices, rooms).type, "query-energy");
    assert.equal(interpretCommand("Check whether the water tank is full.", devices, rooms).type, "query-water");
  });

  it("rejects unsupported appliances and relay speed", () => {
    const locked = interpretCommand("Unlock the front door", devices, rooms);
    assert.equal(locked.type, "reply");
    if (locked.type === "reply") assert.match(locked.text, /won’t|will not|not a supported/i);
    const relay = interpretCommand("Set the passage fan to speed 3", devices, rooms);
    assert.equal(relay.type, "reply");
    if (relay.type === "reply") assert.match(relay.text, /relay/i);
  });

  it("asks before a bedtime routine or a sensitive pump start", () => {
    const bed = interpretCommand("Create a bedtime routine", devices, rooms);
    assert.equal(bed.type, "confirm");
    const pump = interpretCommand("Turn on the water pump", devices, rooms);
    assert.equal(pump.type, "confirm");
  });
});

describe("automation and water safety", () => {
  const rule: Automation = {
    id: "t",
    name: "Test",
    detail: "",
    enabled: true,
    icon: "moon",
    cooldownMin: 10,
    priority: 1,
    lastRun: 1_000_000,
    lastStatus: "ok",
    trigger: { type: "time", hour: 7, minute: 0 },
    actions: [],
    log: [],
  };

  it("does not run again inside the cooldown", () => {
    assert.equal(shouldRunAutomation(rule, 1_000_000 + 60_000).ok, false);
    assert.equal(shouldRunAutomation({ ...rule, lastRun: null }, 1_000_000).ok, true);
    assert.equal(shouldRunAutomation({ ...rule, enabled: false, lastRun: null }, 1).reason, "disabled");
    assert.equal(retriggersSelf(rule), false);
  });

  it("stops the pump on sensor fault, high level, and runtime limit", () => {
    const water: WaterState = {
      levelPct: 10,
      capacityM: 4,
      pumpOn: false,
      auto: true,
      highPct: 95,
      lowPct: 20,
      runtimeLimitMin: 20,
      pumpStartedAt: null,
      sensorOk: true,
      simulated: true,
      lastAlert: null,
    };
    assert.equal(nextPump(water, 10_000).pumpOn, true);
    assert.equal(nextPump({ ...water, sensorOk: false, pumpOn: true }, 10_000).reason, "sensor-fault");
    assert.equal(nextPump({ ...water, levelPct: 97, pumpOn: true }, 10_000).pumpOn, false);
    const started = 0;
    assert.equal(
      nextPump({ ...water, pumpOn: true, pumpStartedAt: started, levelPct: 50 }, 21 * 60_000).reason,
      "runtime-limit",
    );
  });
});
