import { useEffect, useState } from "react";
import {
  Home, LayoutGrid, Zap, BarChart3, MoreHorizontal, ChevronLeft,
  Lightbulb, Fan, AirVent, Tv, Plug, Droplets, WashingMachine,
  Shield, Bell, Settings, User, Plus, Mic, Send, Power,
  Thermometer, Gauge, Wifi, WifiOff, Sun, Moon, Activity,
  LogOut, Users, Link2, Lock, QrCode, Search,
} from "lucide-react";
import { useStore } from "./lib/homepilot/store";
import { totalPower, estimateCost } from "./lib/homepilot/logic";
import type { Device, Screen, Tab } from "./lib/homepilot/model";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
} from "recharts";

function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-xl bg-[#122844] p-1.5 border border-[#1d3d5e]">
        <Home size={size - 8} className="text-[#2f9bff]" />
      </div>
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return <div className={`toggle ${on ? "on" : ""}`} onClick={onClick} />;
}

function StatusBar() {
  return (
    <div className="flex justify-between items-center px-5 pt-3 pb-1 text-xs text-[#8ea6c3]">
      <span>9:41</span>
      <div className="flex gap-1.5 items-center">
        <Wifi size={12} />
        <span className="text-[10px]">●●●</span>
      </div>
    </div>
  );
}

function TabBar() {
  const { tab, setTab } = useStore();
  const items: { id: Tab; icon: typeof Home; label: string }[] = [
    { id: "home", icon: Home, label: "Home" },
    { id: "rooms", icon: LayoutGrid, label: "Rooms" },
    { id: "automation", icon: Zap, label: "Automation" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "more", icon: MoreHorizontal, label: "More" },
  ];
  return (
    <div className="tab-bar">
      {items.map((i) => (
        <button key={i.id} className={`tab-item ${tab === i.id ? "active" : ""}`} onClick={() => setTab(i.id)}>
          <i.icon size={20} />
          {i.label}
        </button>
      ))}
    </div>
  );
}

function kindIcon(kind: string, size = 18) {
  const map: Record<string, typeof Lightbulb> = {
    light: Lightbulb, fan: Fan, ac: AirVent, tv: Tv, plug: Plug,
    pump: Droplets, washer: WashingMachine, curtain: LayoutGrid, sensor: Activity, geyser: Thermometer,
  };
  const Icon = map[kind] || Plug;
  return <Icon size={size} />;
}

/* ─── Screens ─── */

function Splash() {
  const setScreen = useStore((s) => s.setScreen);
  return (
    <div className="flex flex-col h-dvh px-6 pb-10">
      <StatusBar />
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <Logo size={48} />
        <h1 className="text-3xl font-extrabold mt-4 text-white">HomePilot</h1>
        <p className="text-[#8ea6c3] mt-1 text-sm">One Home. One App. Total Control.</p>
        <div className="mt-6 w-full max-w-[300px] rounded-[28px] overflow-hidden border border-[#1d3d5e] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
          <img src="/img/house.jpg" alt="Smart home at night" className="h-52 w-full object-cover" />
        </div>
        <h2 className="mt-6 text-xl font-bold">Smarter Home<br />Brighter Future</h2>
        <p className="text-[#8ea6c3] text-sm mt-2 px-4">Control your devices, monitor energy, keep your home safe — all in one app.</p>
      </div>
      <button className="btn-primary" onClick={() => setScreen("signin")}>Get Started</button>
      <p className="text-center text-sm text-[#8ea6c3] mt-3">
        Already have an account?{" "}
        <button className="text-[#2f9bff] font-semibold" onClick={() => setScreen("signin")}>Sign In</button>
      </p>
    </div>
  );
}

function SignIn() {
  const signIn = useStore((s) => s.signIn);
  const [email, setEmail] = useState("jatin@example.com");
  const [pass, setPass] = useState("");
  return (
    <div className="flex flex-col h-dvh px-6">
      <StatusBar />
      <div className="mt-6 flex items-center gap-2">
        <Logo />
        <span className="font-bold text-lg">HomePilot</span>
      </div>
      <h1 className="text-2xl font-bold mt-8">Welcome Back</h1>
      <p className="text-[#8ea6c3] text-sm mt-1">Sign in to your account</p>
      <div className="mt-8 space-y-4">
        <div>
          <label className="text-xs text-[#8ea6c3]">Email or Phone</label>
          <input className="w-full mt-1 bg-[#0c1c31] border border-[#1d3d5e] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2f9bff]"
            value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jatin@example.com" />
        </div>
        <div>
          <label className="text-xs text-[#8ea6c3]">Password</label>
          <input type="password" className="w-full mt-1 bg-[#0c1c31] border border-[#1d3d5e] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2f9bff]"
            value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Enter your password" />
        </div>
        <div className="flex justify-between items-center text-xs">
          <label className="flex items-center gap-2 text-[#8ea6c3]"><input type="checkbox" defaultChecked /> Remember me</label>
          <span className="text-[#2f9bff]">Forgot Password?</span>
        </div>
        <button className="btn-primary" onClick={() => signIn(email || "jatin@example.com")}>Sign In</button>
        <div className="flex items-center gap-3 text-xs text-[#65809f]">
          <div className="flex-1 h-px bg-[#1d3d5e]" /><span>or</span><div className="flex-1 h-px bg-[#1d3d5e]" />
        </div>
        <div className="flex gap-3">
          <button className="flex-1 card py-3 text-sm font-medium flex items-center justify-center gap-2">G Google</button>
          <button className="flex-1 card py-3 text-sm font-medium flex items-center justify-center gap-2"> Apple</button>
        </div>
      </div>
      <p className="text-center text-sm text-[#8ea6c3] mt-auto mb-8">
        Don't have an account? <span className="text-[#2f9bff] font-semibold">Create Account</span>
      </p>
      <p className="text-center text-[10px] text-[#65809f] mb-4">Demo: jatin@example.com · any password 4+ chars</p>
    </div>
  );
}

function HomeDashboard() {
  const { session, devices, rooms, selectRoom, selectDevice, setScreen, toggleDevice } = useStore();
  const power = totalPower(devices);
  const online = devices.filter((d) => d.online).length;
  const active = devices.filter((d) => d.power && d.online).length;
  const quick = [
    { label: "Lights", kind: "light", icon: Lightbulb },
    { label: "Fan", kind: "fan", icon: Fan },
    { label: "AC", kind: "ac", icon: AirVent },
    { label: "TV", kind: "tv", icon: Tv },
  ];
  return (
    <div className="pb-24">
      <StatusBar />
      <div className="px-5 pt-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[#8ea6c3] text-sm">Good Morning,</p>
            <h1 className="text-xl font-bold flex items-center gap-1">{session.name.split(" ")[0]} <span>👋</span></h1>
            <p className="text-xs text-[#65809f] mt-0.5">My Home · 1st Floor</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">28°C</p>
            <p className="text-xs text-[#8ea6c3]">Partly Cloudy</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#122844] flex items-center justify-center text-[#3ee0b0]"><Wifi size={18} /></div>
            <div>
              <p className="text-xs text-[#8ea6c3]">Connected</p>
              <p className="font-bold">{online} Devices</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#122844] flex items-center justify-center text-[#2f9bff]"><Zap size={18} /></div>
            <div>
              <p className="text-xs text-[#8ea6c3]">Power Usage</p>
              <p className="font-bold">{(power / 1000).toFixed(1)} kW</p>
            </div>
          </div>
        </div>
        <h2 className="font-semibold mt-6 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-3">
          {quick.map((q) => {
            const on = devices.some((d) => d.kind === q.kind && d.power);
            return (
              <button key={q.label} className={`card p-3 flex flex-col items-center gap-2 ${on ? "border-[#2f9bff]" : ""}`}
                onClick={() => {
                  const d = devices.find((x) => x.kind === q.kind);
                  if (d) toggleDevice(d.id);
                }}>
                <q.icon size={22} className={on ? "text-[#2f9bff]" : "text-[#8ea6c3]"} />
                <span className="text-[11px]">{q.label}</span>
              </button>
            );
          })}
        </div>
        <h2 className="font-semibold mt-6 mb-3">Rooms</h2>
        <div className="grid grid-cols-2 gap-3">
          {rooms.map((r) => {
            const count = devices.filter((d) => d.roomId === r.id).length;
            return (
              <button key={r.id} className="card p-4 text-left" onClick={() => selectRoom(r.id)}>
                <div className="w-9 h-9 rounded-lg bg-[#122844] flex items-center justify-center mb-2 text-[#2f9bff]">
                  <LayoutGrid size={16} />
                </div>
                <p className="font-semibold text-sm">{r.name}</p>
                <p className="text-xs text-[#8ea6c3]">{count} Devices</p>
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 mt-6">
          <button className="card flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2" onClick={() => setScreen("assistant")}>
            <Mic size={16} className="text-[#2f9bff]" /> AI Assistant
          </button>
          <button className="card flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2" onClick={() => setScreen("notifications")}>
            <Bell size={16} className="text-[#f0b429]" /> Alerts
          </button>
        </div>
      </div>
    </div>
  );
}

function RoomControl() {
  const { devices, rooms, selectedRoomId, setScreen, selectDevice, toggleDevice, setBrightness, setSpeed } = useStore();
  const room = rooms.find((r) => r.id === selectedRoomId);
  const list = devices.filter((d) => d.roomId === selectedRoomId);
  const active = list.filter((d) => d.power).length;
  return (
    <div className="pb-24">
      <StatusBar />
      <div className="px-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setScreen("home")} className="p-1"><ChevronLeft size={22} /></button>
          <div>
            <h1 className="font-bold text-lg">{room?.name}</h1>
            <p className="text-xs text-[#8ea6c3]">{list.length} Devices · {active} Active</p>
          </div>
        </div>
        <div className="flex gap-2 mb-4 overflow-x-auto scroll-hide">
          {["All", "Lights", "Fans", "TV"].map((f) => (
            <button key={f} className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${f === "All" ? "bg-[#2f9bff] text-white" : "card"}`}>{f}</button>
          ))}
        </div>
        <div className="space-y-3">
          {list.map((d) => (
            <div key={d.id} className="card p-4" onClick={() => selectDevice(d.id)}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${d.power ? "bg-[#2f9bff]/20 text-[#2f9bff]" : "bg-[#122844] text-[#8ea6c3]"}`}>
                  {kindIcon(d.kind)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{d.name}</p>
                  <p className="text-xs text-[#8ea6c3]">
                    {d.kind === "fan" && d.power ? `On · Speed ${d.speed}` :
                     d.kind === "ac" && d.power ? `${d.temperature}° · ${d.acMode}` :
                     d.kind === "light" && d.power ? `On · ${d.brightness}%` :
                     d.power ? "On" : "Off"}
                    {!d.online && " · Offline"}
                  </p>
                </div>
                <div onClick={(e) => { e.stopPropagation(); toggleDevice(d.id); }}>
                  <Toggle on={d.power} onClick={() => {}} />
                </div>
              </div>
              {d.power && d.capabilities.brightness && (
                <input type="range" min={0} max={100} value={d.brightness}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setBrightness(d.id, Number(e.target.value))}
                  className="w-full mt-3 accent-[#2f9bff]" />
              )}
              {d.power && d.capabilities.fanSpeed && (
                <input type="range" min={1} max={5} value={d.speed}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setSpeed(d.id, Number(e.target.value))}
                  className="w-full mt-3 accent-[#2f9bff]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeviceDetail() {
  const { devices, selectedDeviceId, setScreen, toggleDevice, setSpeed, setTemp, setBrightness } = useStore();
  const d = devices.find((x) => x.id === selectedDeviceId);
  if (!d) return null;
  return (
    <div className="pb-24">
      <StatusBar />
      <div className="px-5">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setScreen("room")} className="p-1"><ChevronLeft size={22} /></button>
          <div>
            <h1 className="font-bold text-lg">{d.name}</h1>
            <p className="text-xs text-[#8ea6c3] capitalize">{d.roomId.replace("-", " ")}</p>
          </div>
        </div>
        <div className="flex flex-col items-center py-6">
          <div className={`w-44 h-44 rounded-full flex items-center justify-center border-[10px] ${d.power ? "border-[#163a66] bg-[#0b2340] text-[#7ec4ff]" : "border-[#1d3d5e] text-[#65809f]"}`}>
            <div className={d.power && d.kind === "fan" ? "fan-on" : ""}>{kindIcon(d.kind, 64)}</div>
          </div>
          <p className={`mt-4 font-semibold ${d.power ? "text-[#3ee0b0]" : "text-[#8ea6c3]"}`}>{d.power ? "On" : "Off"}</p>
        </div>
        {d.capabilities.fanSpeed && (
          <div className="card p-4 mb-4">
            <p className="text-sm font-medium mb-3">Speed {d.speed}</p>
            <input type="range" min={1} max={5} value={d.speed}
              onChange={(e) => setSpeed(d.id, Number(e.target.value))}
              className="w-full accent-[#2f9bff]" />
            <div className="flex justify-between text-xs text-[#65809f] mt-1">
              {[1, 2, 3, 4, 5].map((n) => <span key={n}>{n}</span>)}
            </div>
          </div>
        )}
        {d.capabilities.ac && (
          <div className="card p-4 mb-4">
            <p className="text-sm font-medium mb-3">Temperature {d.temperature}°C</p>
            <input type="range" min={16} max={30} value={d.temperature}
              onChange={(e) => setTemp(d.id, Number(e.target.value))}
              className="w-full accent-[#2f9bff]" />
            <p className="text-xs text-[#8ea6c3] mt-2">Mode: {d.acMode}</p>
          </div>
        )}
        {d.capabilities.brightness && (
          <div className="card p-4 mb-4">
            <p className="text-sm font-medium mb-3">Brightness {d.brightness}%</p>
            <input type="range" min={0} max={100} value={d.brightness}
              onChange={(e) => setBrightness(d.id, Number(e.target.value))}
              className="w-full accent-[#2f9bff]" />
          </div>
        )}
        <div className="card p-4 space-y-3">
          <div className="flex justify-between text-sm"><span className="text-[#8ea6c3]">Timer</span><span>Off</span></div>
          <div className="flex justify-between text-sm"><span className="text-[#8ea6c3]">Schedule</span><span>Not Set ›</span></div>
          <div className="flex justify-between text-sm"><span className="text-[#8ea6c3]">Energy Usage</span><span>{d.ratedWatts} W</span></div>
        </div>
      </div>
    </div>
  );
}

function Analytics() {
  const { energyKwh, tariff, range, setRange, devices } = useStore();
  const cost = estimateCost(energyKwh, tariff);
  const data = [
    { t: "12AM", kwh: 0.3 }, { t: "3AM", kwh: 0.2 }, { t: "6AM", kwh: 0.5 },
    { t: "9AM", kwh: 1.2 }, { t: "12PM", kwh: 1.8 }, { t: "3PM", kwh: 1.5 },
    { t: "6PM", kwh: 2.1 }, { t: "9PM", kwh: 1.6 }, { t: "12AM", kwh: 0.8 },
  ];
  const byDevice = [
    { name: "AC", kwh: 4.2, pct: 34, color: "#2f9bff" },
    { name: "Refrigerator", kwh: 2.1, pct: 17, color: "#3ee0b0" },
    { name: "Lights", kwh: 1.8, pct: 14, color: "#f0b429" },
  ];
  return (
    <div className="pb-24">
      <StatusBar />
      <div className="px-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-bold text-lg">Energy Analytics</h1>
        </div>
        <div className="flex gap-2 mb-5">
          {(["day", "week", "month", "year"] as const).map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize ${range === r ? "bg-[#2f9bff] text-white" : "card"}`}>{r}</button>
          ))}
        </div>
        <div className="card p-5 mb-4">
          <p className="text-xs text-[#8ea6c3]">Total Consumption</p>
          <p className="text-3xl font-extrabold mt-1">{energyKwh.toFixed(1)} <span className="text-base font-medium text-[#8ea6c3]">kWh</span></p>
          <p className="text-[#2f9bff] font-semibold mt-1">₹ {cost.toFixed(2)}</p>
          <div className="h-40 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2f9bff" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#2f9bff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" tick={{ fill: "#65809f", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "#0c1c31", border: "1px solid #1d3d5e", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="kwh" stroke="#2f9bff" fill="url(#g)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <h2 className="font-semibold mb-3">Device-wise Usage</h2>
        <div className="space-y-3">
          {byDevice.map((d) => (
            <div key={d.name} className="card p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: d.color + "22", color: d.color }}>
                {kindIcon(d.name === "AC" ? "ac" : d.name === "Lights" ? "light" : "plug")}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.name}</p>
                <div className="h-1.5 bg-[#122844] rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: d.color }} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{d.kwh} kWh</p>
                <p className="text-xs text-[#8ea6c3]">{d.pct}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Assistant() {
  const { chat, sendChat, confirmChat, setScreen } = useStore();
  const [input, setInput] = useState("");
  const suggestions = [
    "Turn off all the lights in the living room",
    "Set AC to 24 degrees",
    "Show today's usage",
    "Create a bedtime routine",
  ];
  return (
    <div className="flex flex-col h-dvh pb-20">
      <StatusBar />
      <div className="px-5 flex items-center gap-3 mb-3">
        <button onClick={() => setScreen("home")} className="p-1"><ChevronLeft size={22} /></button>
        <div>
          <h1 className="font-bold">AI Home Assistant</h1>
          <p className="text-xs text-[#8ea6c3]">Powered by rules · Local</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 space-y-3 scroll-hide">
        {chat.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-[#2f9bff] text-white rounded-br-md" : "card rounded-bl-md"}`}>
              {m.text}
              {m.cards && (
                <div className="mt-2 space-y-1">
                  {m.cards.map((c, i) => (
                    <div key={i} className="bg-[#122844] rounded-lg px-3 py-2 text-xs flex justify-between">
                      <span>{c.title}</span><span className="text-[#8ea6c3]">{c.subtitle}</span>
                    </div>
                  ))}
                </div>
              )}
              {m.confirm && (
                <button className="mt-2 w-full bg-[#2f9bff] text-white rounded-lg py-2 text-xs font-semibold" onClick={confirmChat}>Confirm</button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="px-5 pt-2">
        <div className="flex gap-2 overflow-x-auto scroll-hide mb-2">
          {suggestions.map((s) => (
            <button key={s} className="card px-3 py-1.5 text-[11px] whitespace-nowrap" onClick={() => sendChat(s)}>{s}</button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <input className="flex-1 bg-[#0c1c31] border border-[#1d3d5e] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2f9bff]"
            placeholder="Type a message..." value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) { sendChat(input.trim()); setInput(""); } }} />
          <button className="w-11 h-11 rounded-xl bg-[#2f9bff] flex items-center justify-center"
            onClick={() => { if (input.trim()) { sendChat(input.trim()); setInput(""); } }}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AutomationScreen() {
  const { automations, toggleAutomation, setScreen } = useStore();
  const icons: Record<string, typeof Sun> = { sun: Sun, moon: Moon, motion: Activity, water: Droplets, energy: Zap, bed: Moon };
  return (
    <div className="pb-24">
      <StatusBar />
      <div className="px-5">
        <h1 className="font-bold text-lg mb-1">Automation & Scenes</h1>
        <div className="flex gap-2 mb-4">
          <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-[#2f9bff] text-white">Automation</button>
          <button className="card px-4 py-1.5 rounded-full text-xs font-medium">Scenes</button>
        </div>
        <div className="space-y-3">
          {automations.map((a) => {
            const Icon = icons[a.icon] || Zap;
            return (
              <div key={a.id} className="card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#122844] flex items-center justify-center text-[#2f9bff]"><Icon size={18} /></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{a.name}</p>
                  <p className="text-xs text-[#8ea6c3]">{a.detail}</p>
                </div>
                <Toggle on={a.enabled} onClick={() => toggleAutomation(a.id)} />
              </div>
            );
          })}
        </div>
        <button className="card w-full mt-4 py-3 text-sm font-medium text-[#2f9bff] flex items-center justify-center gap-2">
          <Plus size={16} /> Add New Automation
        </button>
      </div>
    </div>
  );
}

function RingScreen() {
  const { ringEvents, setScreen } = useStore();
  return (
    <div className="pb-24">
      <StatusBar />
      <div className="px-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setScreen("home")} className="p-1"><ChevronLeft size={22} /></button>
          <div>
            <h1 className="font-bold text-lg flex items-center gap-2"><Shield size={18} className="text-[#2f9bff]" /> ring</h1>
            <p className="text-xs text-[#8ea6c3]">Your Home, More Secure</p>
          </div>
        </div>
        <div className="card overflow-hidden mb-4">
          <div className="h-48 relative">
            <img src="/img/porch.jpg" alt="Front door camera" className="h-full w-full object-cover" />
            <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">LIVE</span>
          </div>
          <div className="p-3 flex gap-4 justify-center text-xs">
            <button className="flex flex-col items-center gap-1 text-[#2f9bff]"><Activity size={16} />Live View</button>
            <button className="flex flex-col items-center gap-1 text-[#8ea6c3]"><Bell size={16} />Events</button>
            <button className="flex flex-col items-center gap-1 text-[#8ea6c3]"><Settings size={16} />Settings</button>
          </div>
        </div>
        <h2 className="font-semibold mb-3">Recent Events</h2>
        <div className="space-y-2">
          {ringEvents.map((e) => (
            <div key={e.id} className="card p-3 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${e.type === "motion" ? "bg-red-500/20 text-red-400" : "bg-[#2f9bff]/20 text-[#2f9bff]"}`}>
                {e.type === "motion" ? <Activity size={14} /> : <Bell size={14} />}
              </div>
              <div>
                <p className="text-sm font-medium capitalize">{e.type} Detected</p>
                <p className="text-xs text-[#8ea6c3]">{e.place} · {Math.round((Date.now() - e.t) / 60000)} min ago</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#65809f] mt-4 text-center">Demo events only. Not a live Ring account.</p>
      </div>
    </div>
  );
}

function WaterScreen() {
  const { water, setWaterAuto, setPump, setScreen } = useStore();
  const levelM = ((water.levelPct / 100) * water.capacityM).toFixed(1);
  return (
    <div className="pb-24">
      <StatusBar />
      <div className="px-5">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setScreen("home")} className="p-1"><ChevronLeft size={22} /></button>
          <h1 className="font-bold text-lg">Water Tank & Pump</h1>
        </div>
        <div className="flex flex-col items-center py-4">
          <div className="relative w-36 h-36">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#1d3d5e" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#2f9bff" strokeWidth="8"
                strokeDasharray={`${water.levelPct * 2.64} 264`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-extrabold">{water.levelPct}%</p>
              <p className="text-xs text-[#8ea6c3]">{levelM} / {water.capacityM} m</p>
            </div>
          </div>
        </div>
        <div className="card p-4 space-y-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2"><Droplets size={16} className="text-[#2f9bff]" /><span className="text-sm">Pump Status</span></div>
            <span className={`text-sm font-semibold ${water.pumpOn ? "text-[#3ee0b0]" : "text-[#8ea6c3]"}`}>{water.pumpOn ? "ON" : "OFF"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#8ea6c3]">Auto Mode</span>
            <Toggle on={water.auto} onClick={() => setWaterAuto(!water.auto)} />
          </div>
          <div className="flex justify-between text-sm"><span className="text-[#8ea6c3]">High Level (Overflow)</span><span>{water.highPct}%</span></div>
          <div className="flex justify-between text-sm"><span className="text-[#8ea6c3]">Low Level (Auto Start)</span><span>{water.lowPct}%</span></div>
        </div>
        <button className="btn-primary mb-4" onClick={() => setPump(!water.pumpOn)}>
          {water.pumpOn ? "Stop Pump" : "Start Pump"}
        </button>
        <h2 className="font-semibold mb-2">Recent Activity</h2>
        <div className="card p-3 space-y-2 text-xs text-[#8ea6c3]">
          <p>Pump Started · 10:24 AM</p>
          <p>Water Level 70% · 10:20 AM</p>
        </div>
      </div>
    </div>
  );
}

function Notifications() {
  const { activities, notifFilter, setNotifFilter, markRead, setScreen } = useStore();
  const filtered = notifFilter === "all" ? activities : activities.filter((a) => a.category === notifFilter || (notifFilter === "alert" && a.tone === "alert"));
  const toneColor = { alert: "text-red-400", warn: "text-[#f0b429]", ok: "text-[#3ee0b0]", info: "text-[#2f9bff]" };
  return (
    <div className="pb-24">
      <StatusBar />
      <div className="px-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setScreen("home")} className="p-1"><ChevronLeft size={22} /></button>
          <h1 className="font-bold text-lg">Notifications</h1>
        </div>
        <div className="flex gap-2 mb-4 overflow-x-auto scroll-hide">
          {(["all", "alert", "event", "automation"] as const).map((f) => (
            <button key={f} onClick={() => setNotifFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap ${notifFilter === f ? "bg-[#2f9bff] text-white" : "card"}`}>{f === "all" ? "All" : f + "s"}</button>
          ))}
        </div>
        <div className="space-y-2">
          {filtered.map((a) => (
            <button key={a.id} className={`card p-3 flex items-start gap-3 w-full text-left ${!a.read ? "border-[#2f9bff]/40" : ""}`}
              onClick={() => markRead(a.id)}>
              <div className={`mt-0.5 ${toneColor[a.tone]}`}>●</div>
              <div>
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-[#8ea6c3]">{a.body}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsScreen() {
  const { session, members, devices, setScreen, signOut } = useStore();
  const items = [
    { icon: Users, label: "Household Members", sub: `${members.length} members`, screen: "members" as Screen },
    { icon: LayoutGrid, label: "Rooms & Devices", sub: `${devices.length} devices`, screen: "devices" as Screen },
    { icon: Link2, label: "Integrations", sub: "Ring · Google Home", screen: "settings" as Screen },
    { icon: Lock, label: "Security & Privacy", sub: "", screen: "settings" as Screen },
    { icon: Zap, label: "Energy Tariff", sub: "₹ 7.5 / kWh", screen: "settings" as Screen },
    { icon: Settings, label: "App Settings", sub: "", screen: "settings" as Screen },
  ];
  return (
    <div className="pb-24">
      <StatusBar />
      <div className="px-5">
        <h1 className="font-bold text-lg mb-4">Household Settings</h1>
        <div className="card p-4 flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#2f9bff]/20 flex items-center justify-center text-[#2f9bff] font-bold text-lg">
            {session.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{session.name}</p>
            <p className="text-xs text-[#8ea6c3] capitalize">{session.role}</p>
          </div>
        </div>
        <div className="space-y-1">
          {items.map((i) => (
            <button key={i.label} className="w-full flex items-center gap-3 px-2 py-3.5 text-left"
              onClick={() => i.screen !== "settings" && setScreen(i.screen)}>
              <i.icon size={18} className="text-[#8ea6c3]" />
              <div className="flex-1">
                <p className="text-sm font-medium">{i.label}</p>
                {i.sub && <p className="text-xs text-[#65809f]">{i.sub}</p>}
              </div>
              <ChevronLeft size={16} className="rotate-180 text-[#65809f]" />
            </button>
          ))}
        </div>
        <button className="mt-6 w-full card py-3 text-sm text-red-400 font-medium flex items-center justify-center gap-2" onClick={signOut}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
}

function DevicesList() {
  const { devices, rooms, toggleDevice, selectDevice, setScreen } = useStore();
  const [filter, setFilter] = useState("All");
  const filters = ["All", ...rooms.map((r) => r.name)];
  const list = filter === "All" ? devices : devices.filter((d) => rooms.find((r) => r.id === d.roomId)?.name === filter);
  return (
    <div className="pb-24">
      <StatusBar />
      <div className="px-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-bold text-lg">Devices</h1>
          <button className="text-[#2f9bff] text-sm font-medium flex items-center gap-1" onClick={() => setScreen("pairing")}>
            <Plus size={16} /> Add
          </button>
        </div>
        <div className="flex gap-2 mb-4 overflow-x-auto scroll-hide">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${filter === f ? "bg-[#2f9bff] text-white" : "card"}`}>{f}</button>
          ))}
        </div>
        <div className="space-y-2">
          {list.map((d) => (
            <div key={d.id} className="card p-3 flex items-center gap-3" onClick={() => selectDevice(d.id)}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${d.power ? "bg-[#2f9bff]/20 text-[#2f9bff]" : "bg-[#122844] text-[#8ea6c3]"}`}>
                {kindIcon(d.kind)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.name}</p>
                <p className="text-xs text-[#8ea6c3] flex items-center gap-1">
                  {d.online ? <Wifi size={10} /> : <WifiOff size={10} />}
                  {d.online ? "Online" : "Offline"}
                </p>
              </div>
              <div onClick={(e) => { e.stopPropagation(); toggleDevice(d.id); }}>
                <Toggle on={d.power} onClick={() => {}} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Pairing() {
  const setScreen = useStore((s) => s.setScreen);
  return (
    <div className="pb-24">
      <StatusBar />
      <div className="px-5">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setScreen("devices")} className="p-1"><ChevronLeft size={22} /></button>
          <h1 className="font-bold text-lg">Add Device</h1>
        </div>
        <div className="flex gap-2 mb-8">
          <button className="flex-1 py-2 rounded-xl text-sm font-medium bg-[#2f9bff] text-white">Scan QR</button>
          <button className="flex-1 py-2 rounded-xl text-sm font-medium card">Manual</button>
        </div>
        <div className="flex flex-col items-center py-12">
          <div className="w-24 h-24 rounded-full bg-[#122844] flex items-center justify-center mb-6 border border-[#1d3d5e]">
            <QrCode size={40} className="text-[#2f9bff]" />
          </div>
          <p className="font-semibold">Searching for devices...</p>
          <p className="text-xs text-[#8ea6c3] mt-2 text-center px-8">Make sure your device is in pairing mode and connected to the same Wi-Fi network.</p>
          <div className="flex gap-1.5 mt-6">
            <div className="w-2 h-2 rounded-full bg-[#2f9bff] animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-[#2f9bff]/50 animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 rounded-full bg-[#2f9bff]/30 animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Monitor() {
  const { devices, setScreen } = useStore();
  const power = totalPower(devices);
  const data = Array.from({ length: 24 }, (_, i) => ({
    t: `${i}`,
    power: 800 + Math.random() * 1500 + (i > 8 && i < 22 ? 800 : 0),
    voltage: 220 + Math.random() * 20,
  }));
  return (
    <div className="pb-24">
      <StatusBar />
      <div className="px-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setScreen("analytics")} className="p-1"><ChevronLeft size={22} /></button>
          <h1 className="font-bold text-lg">Power & Voltage Trend</h1>
        </div>
        <div className="h-48 card p-3 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="t" tick={{ fill: "#65809f", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Area type="monotone" dataKey="power" stroke="#2f9bff" fill="#2f9bff33" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="card p-3 text-center">
            <p className="text-xs text-[#8ea6c3]">Avg Power</p>
            <p className="font-bold mt-1">{(power / 1000).toFixed(1)} kW</p>
          </div>
          <div className="card p-3 text-center">
            <p className="text-xs text-[#8ea6c3]">Avg Voltage</p>
            <p className="font-bold mt-1">232 V</p>
          </div>
          <div className="card p-3 text-center">
            <p className="text-xs text-[#8ea6c3]">Total Energy</p>
            <p className="font-bold mt-1">12.5 kWh</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Profile() {
  const { session, setScreen, signOut } = useStore();
  return (
    <div className="pb-24">
      <StatusBar />
      <div className="px-5">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setScreen("settings")} className="p-1"><ChevronLeft size={22} /></button>
          <h1 className="font-bold text-lg">Profile</h1>
        </div>
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#2f9bff]/20 flex items-center justify-center text-[#2f9bff] text-2xl font-bold">
            {session.name.charAt(0)}
          </div>
          <p className="font-bold mt-3">{session.name}</p>
          <p className="text-sm text-[#8ea6c3]">{session.email}</p>
        </div>
        <div className="space-y-1">
          {["Account Details", "Subscription", "Help & Support", "About"].map((l) => (
            <button key={l} className="w-full flex items-center justify-between px-2 py-3.5 text-sm">
              <span>{l}</span>
              <span className="text-xs text-[#65809f]">{l === "Subscription" ? "Free Plan ›" : "›"}</span>
            </button>
          ))}
        </div>
        <button className="mt-6 w-full card py-3 text-sm text-red-400 font-medium" onClick={signOut}>Sign Out</button>
      </div>
    </div>
  );
}

function Members() {
  const { members, setScreen } = useStore();
  return (
    <div className="pb-24">
      <StatusBar />
      <div className="px-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setScreen("settings")} className="p-1"><ChevronLeft size={22} /></button>
          <h1 className="font-bold text-lg">Household Members</h1>
        </div>
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.id} className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#122844] flex items-center justify-center text-[#2f9bff] font-bold">{m.name.charAt(0)}</div>
              <div className="flex-1">
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-xs text-[#8ea6c3]">{m.email}</p>
              </div>
              <span className="text-xs capitalize text-[#65809f]">{m.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Root ─── */

export default function App() {
  const { screen, session, tick } = useStore();
  useEffect(() => {
    const id = setInterval(() => tick(), 5000);
    return () => clearInterval(id);
  }, [tick]);

  const showTabs = session.signedIn && !["splash", "signin", "assistant", "device", "pairing", "profile", "members", "ring", "water", "notifications", "monitor"].includes(screen);

  return (
    <div className="phone-shell">
      {screen === "splash" && <Splash />}
      {screen === "signin" && <SignIn />}
      {screen === "home" && <HomeDashboard />}
      {screen === "room" && <RoomControl />}
      {screen === "device" && <DeviceDetail />}
      {screen === "analytics" && <Analytics />}
      {screen === "assistant" && <Assistant />}
      {screen === "automation" && <AutomationScreen />}
      {screen === "ring" && <RingScreen />}
      {screen === "water" && <WaterScreen />}
      {screen === "notifications" && <Notifications />}
      {screen === "settings" && <SettingsScreen />}
      {screen === "devices" && <DevicesList />}
      {screen === "pairing" && <Pairing />}
      {screen === "monitor" && <Monitor />}
      {screen === "profile" && <Profile />}
      {screen === "members" && <Members />}
      {showTabs && <TabBar />}
    </div>
  );
}
