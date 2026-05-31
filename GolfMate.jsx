import { useState, useEffect, useRef } from "react";

// ============================================================
// DESIGN TOKENS (from Sleek.design export)
// ============================================================
const C = {
  bg: "#07130F",
  fg: "#F9F8F6",
  primary: "#D4AF37",
  primaryFg: "#07130F",
  secondary: "#1B3B2F",
  secondaryFg: "#F9F8F6",
  muted: "#162E25",
  mutedFg: "#8FA39A",
  accent: "#1B3B2F",
  accentFg: "#D4AF37",
  destructive: "#CC3333",
  card: "#11261E",
  cardFg: "#F9F8F6",
  border: "#234A3A",
  input: "#0D1D16",
  emerald: "#10B981",
  amber: "#F59E0B",
};

const S = {
  screen: { minHeight: "100vh", backgroundColor: C.bg, color: C.fg, fontFamily: "'Montserrat', sans-serif", display: "flex", flexDirection: "column" },
  header: { padding: "48px 24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}33` },
  card: { backgroundColor: C.card, borderRadius: 20, border: `1px solid rgba(255,255,255,0.05)`, padding: 20 },
  btn: { width: "100%", backgroundColor: C.primary, color: C.primaryFg, padding: "16px", borderRadius: 999, fontWeight: 700, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", border: "none", cursor: "pointer" },
  btnSecondary: { width: "100%", backgroundColor: C.secondary, color: C.fg, padding: "16px", borderRadius: 999, fontWeight: 700, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", border: `1px solid rgba(255,255,255,0.1)`, cursor: "pointer" },
  input: { width: "100%", backgroundColor: C.input, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", color: C.fg, fontSize: 14, outline: "none", boxSizing: "border-box" },
  label: { fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.mutedFg, marginBottom: 6, display: "block" },
  tag: { fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 999 },
};

// ============================================================
// MOCK DATA
// ============================================================
const PLAYERS_DATA = [
  { id: 1, name: "Marcus Chen", phone: "+44 7911 123456", status: "accepted", avatar: "MC" },
  { id: 2, name: "David Sterling", phone: "+44 7911 654321", status: "pending", countdown: "21:45:30", avatar: "DS" },
  { id: 3, name: "Elena Vasquez", phone: "+44 7911 888999", status: "declined", reason: "Out of town", avatar: "EV" },
  { id: 4, name: "James Wilson", phone: "+1 555 123 4567", status: "expired", avatar: "JW" },
];

const HISTORY_DATA = [
  { id: 1, course: "The Royal Portrush", date: "12 Oct 2024", players: "Marcus, David, Elena", note: "Windy conditions on the back nine, but the greens were exceptionally fast. Great company." },
  { id: 2, course: "Valderrama Club", date: "05 Oct 2024", players: "Robert, Sarah", note: "" },
];

const VENUES_DATA = [
  { id: 1, name: "Emirates Golf Club", location: "Dubai, UAE" },
  { id: 2, name: "Pebble Beach", location: "California, USA" },
  { id: 3, name: "Augusta National", location: "Georgia, USA" },
];

const SAVED_PLAYERS = [
  { id: 5, name: "James Wilson", phone: "+1 555 123 4567", avatar: "JW" },
  { id: 6, name: "Sarah Jenkins", phone: "+1 555 987 6543", avatar: "SJ" },
  { id: 7, name: "Robert King", phone: "+1 555 222 3333", avatar: "RK" },
];

// ============================================================
// AVATAR COMPONENT
// ============================================================
function Avatar({ initials, size = 44, color = C.primary, style = {} }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", backgroundColor: C.secondary, border: `2px solid ${color}33`, display: "flex", alignItems: "center", justifyContent: "center", color, fontWeight: 700, fontSize: size * 0.3, flexShrink: 0, ...style }}>
      {initials}
    </div>
  );
}

// ============================================================
// STATUS BADGE
// ============================================================
function StatusBadge({ status }) {
  const colors = { accepted: C.emerald, pending: C.amber, declined: C.destructive, expired: C.mutedFg, confirmed: C.emerald, completed: C.emerald };
  const c = colors[status] || C.mutedFg;
  return <span style={{ ...S.tag, backgroundColor: `${c}15`, color: c, border: `1px solid ${c}30` }}>{status}</span>;
}

// ============================================================
// BOTTOM NAV
// ============================================================
function BottomNav({ active, navigate }) {
  const tabs = [
    { id: "home", label: "Home", icon: "⌂" },
    { id: "calendar", label: "Calendar", icon: "📅" },
    { id: "history", label: "History", icon: "🕐" },
    { id: "chat", label: "Chat", icon: "💬" },
  ];
  return (
    <nav style={{ position: "fixed", bottom: 24, left: 24, right: 24, backgroundColor: `${C.card}F0`, backdropFilter: "blur(20px)", border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px", zIndex: 50 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => navigate(t.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 0", borderRadius: 999, backgroundColor: active === t.id ? `${C.primary}15` : "transparent", color: active === t.id ? C.primary : C.mutedFg, border: "none", cursor: "pointer", fontSize: 10, fontWeight: active === t.id ? 700 : 500, letterSpacing: "0.05em" }}>
          <span style={{ fontSize: 18 }}>{t.icon}</span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}

// ============================================================
// SCREEN: SPLASH
// ============================================================
function SplashScreen({ navigate }) {
  useEffect(() => { const t = setTimeout(() => navigate("login"), 2500); return () => clearTimeout(t); }, []);
  return (
    <div style={{ ...S.screen, alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", backgroundColor: `${C.primary}08`, filter: "blur(80px)", top: "10%" }} />
      <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", backgroundColor: `${C.emerald}08`, filter: "blur(60px)", bottom: "20%" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", animation: "fadeIn 1s ease" }}>
        <div style={{ width: 96, height: 96, backgroundColor: `${C.primary}20`, borderRadius: 32, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, border: `1px solid ${C.primary}30`, boxShadow: `0 0 40px ${C.primary}20` }}>
          <span style={{ fontSize: 48 }}>⛳</span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700, margin: 0, letterSpacing: -1 }}>Golf<span style={{ color: C.primary }}>Mate</span></h1>
        <p style={{ color: C.mutedFg, letterSpacing: "0.3em", fontSize: 10, fontWeight: 700, textTransform: "uppercase", marginTop: 8 }}>Your Group Organiser</p>
      </div>
      <div style={{ position: "absolute", bottom: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ width: 48, height: 4, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ height: "100%", backgroundColor: C.primary, borderRadius: 999, animation: "loadingBar 2.5s ease forwards" }} />
        </div>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: `${C.mutedFg}60` }}>Version 1.0.0</p>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}@keyframes loadingBar{from{width:0}to{width:100%}}`}</style>
    </div>
  );
}

// ============================================================
// SCREEN: LOGIN
// ============================================================
function LoginScreen({ navigate }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  return (
    <div style={{ ...S.screen }}>
      <div style={{ height: "38vh", position: "relative", background: `linear-gradient(135deg, ${C.secondary} 0%, ${C.bg} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", padding: "0 24px 32px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 50%, rgba(212,175,55,0.08) 0%, transparent 60%)" }} />
        <span style={{ fontSize: 48, marginBottom: 8 }}>⛳</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, margin: 0, letterSpacing: -1 }}>GolfMate</h1>
        <p style={{ color: C.mutedFg, letterSpacing: "0.2em", fontSize: 10, fontWeight: 700, textTransform: "uppercase", marginTop: 6 }}>Your Group Organiser</p>
      </div>
      <div style={{ flex: 1, padding: "24px 32px 48px", display: "flex", flexDirection: "column", gap: 20, overflowY: "auto" }}>
        <div>
          <label style={S.label}>Full Name</label>
          <input style={S.input} placeholder="Namith Raj" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label style={S.label}>Mobile Number</label>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ ...S.input, width: 80, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14 }}>+91</span><span style={{ color: C.mutedFg }}>▾</span>
            </div>
            <input style={{ ...S.input, flex: 1 }} placeholder="98765 43210" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: `${C.border}60` }} />
          <span style={{ fontSize: 10, color: C.mutedFg, fontWeight: 700, letterSpacing: "0.1em" }}>Or Email</span>
          <div style={{ flex: 1, height: 1, backgroundColor: `${C.border}60` }} />
        </div>
        <div>
          <label style={S.label}>Email Address</label>
          <input style={S.input} type="email" placeholder="namith@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div onClick={() => setIsPlaying(!isPlaying)} style={{ width: 20, height: 20, borderRadius: 6, backgroundColor: isPlaying ? C.primary : C.input, border: `1px solid ${isPlaying ? C.primary : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, marginTop: 2 }}>
            {isPlaying && <span style={{ color: C.primaryFg, fontSize: 12, fontWeight: 700 }}>✓</span>}
          </div>
          <label style={{ fontSize: 13, color: C.mutedFg, lineHeight: 1.4, cursor: "pointer" }} onClick={() => setIsPlaying(!isPlaying)}>
            I am also playing in games I organise
          </label>
        </div>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
          <button style={S.btn} onClick={() => navigate("verification")}>Sign In</button>
          <button style={{ ...S.btnSecondary, backgroundColor: "transparent", border: "none", color: C.mutedFg }} onClick={() => navigate("home")}>Continue as Guest</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: VERIFICATION
// ============================================================
function VerificationScreen({ navigate }) {
  const [code, setCode] = useState(["4", "8", "", "", "", ""]);
  const [countdown, setCountdown] = useState(45);
  useEffect(() => { if (countdown > 0) { const t = setTimeout(() => setCountdown(c => c - 1), 1000); return () => clearTimeout(t); } }, [countdown]);
  const handleDigit = (d) => {
    const idx = code.findIndex(c => c === "");
    if (d === "⌫") { const last = [...code].reverse().findIndex(c => c !== ""); if (last !== -1) { const newCode = [...code]; newCode[5 - last] = ""; setCode(newCode); } return; }
    if (idx !== -1) { const newCode = [...code]; newCode[idx] = d; setCode(newCode); }
  };
  return (
    <div style={{ ...S.screen, padding: "48px 32px" }}>
      <button onClick={() => navigate("login")} style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: C.secondary, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.fg, fontSize: 18, marginBottom: 40 }}>←</button>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Verify Identity</h1>
      <p style={{ color: C.mutedFg, fontSize: 13, lineHeight: 1.5, marginBottom: 40 }}>Please enter the 6-digit verification code sent to <strong style={{ color: C.fg }}>+91 98765 43210</strong></p>
      <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
        {code.map((d, i) => (
          <div key={i} style={{ flex: 1, height: 52, backgroundColor: C.input, border: `1px solid ${d ? C.primary : C.border}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, transition: "border-color 0.2s" }}>{d || "—"}</div>
        ))}
      </div>
      <button style={S.btn} onClick={() => navigate("home")}>Verify & Proceed</button>
      <p style={{ textAlign: "center", fontSize: 12, color: C.mutedFg, marginTop: 16 }}>
        Didn't receive the code? <button onClick={() => setCountdown(45)} style={{ background: "none", border: "none", color: C.primary, fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase" }}>Resend Code {countdown > 0 ? `(0:${countdown.toString().padStart(2, "0")})` : ""}</button>
      </p>
      <div style={{ marginTop: "auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px 40px", textAlign: "center" }}>
        {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((d, i) => (
          <button key={i} onClick={() => d && handleDigit(d)} style={{ fontSize: 22, fontWeight: 600, background: "none", border: "none", color: d ? C.fg : "transparent", cursor: d ? "pointer" : "default", padding: 8 }}>{d}</button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: HOME
// ============================================================
function HomeScreen({ navigate }) {
  return (
    <div style={{ ...S.screen, paddingBottom: 120 }}>
      <header style={{ padding: "48px 24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ color: C.mutedFg, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Welcome Back</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 600, margin: 0 }}>Namith Raj</h1>
        </div>
        <Avatar initials="NR" size={48} />
      </header>
      <main style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Organise Button */}
        <div onClick={() => navigate("createGame")} style={{ position: "relative", borderRadius: 24, overflow: "hidden", height: 160, background: `linear-gradient(135deg, ${C.card} 0%, ${C.secondary} 100%)`, border: `1px solid rgba(255,255,255,0.05)`, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)" }} />
          <div style={{ width: 52, height: 52, backgroundColor: `${C.primary}20`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, border: `1px solid ${C.primary}30`, boxShadow: `0 0 15px ${C.primary}15` }}>
            <span style={{ color: C.primary, fontSize: 24 }}>+</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 500, color: "#fff", letterSpacing: "0.05em", margin: 0 }}>Organise a Game</h2>
        </div>

        {/* Upcoming Game */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: C.mutedFg, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Upcoming Game</h3>
            <button style={{ background: "none", border: "none", color: C.primary, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>See all</button>
          </div>
          <div style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: C.secondary, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid rgba(255,255,255,0.05)` }}>
                  <span style={{ fontSize: 22, color: C.primary }}>⛳</span>
                </div>
                <div>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 17, margin: 0 }}>Pebble Beach</h4>
                  <p style={{ color: C.mutedFg, fontSize: 12, margin: "4px 0 0" }}>📅 Sat, 24 Nov • 07:30 AM</p>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: `${C.bg}80`, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, border: `1px solid rgba(255,255,255,0.05)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: C.emerald, boxShadow: `0 0 8px ${C.emerald}80` }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: C.emerald }}>Confirmed</span>
              </div>
              <p style={{ fontSize: 13, color: C.mutedFg, margin: 0 }}><span style={{ color: C.fg, fontWeight: 600 }}>4/4</span> Players</p>
            </div>
            <button style={{ ...S.btnSecondary, fontSize: 13 }} onClick={() => navigate("gameLobby")}>Enter Game Lobby</button>
          </div>
        </section>

        {/* Recent History */}
        <section>
          <h3 style={{ fontSize: 11, fontWeight: 700, color: C.mutedFg, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Recent History</h3>
          <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
            {HISTORY_DATA.map((g, i) => (
              <div key={g.id} style={{ padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: i < HISTORY_DATA.length - 1 ? `1px solid ${C.border}50` : "none" }}>
                <div>
                  <h4 style={{ fontWeight: 500, fontSize: 15, margin: 0 }}>{g.course}</h4>
                  <p style={{ fontSize: 11, color: C.mutedFg, margin: "4px 0 0" }}>📅 {g.date} • Round Completed</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <BottomNav active="home" navigate={navigate} />
    </div>
  );
}

// ============================================================
// SCREEN: CREATE GAME (Tab 1 - Details)
// ============================================================
function CreateGameScreen({ navigate }) {
  const [date, setDate] = useState("Sat, 24 Nov");
  const [teeTime, setTeeTime] = useState("07:30 AM");
  const [course, setCourse] = useState("St Andrews Old Course");
  return (
    <div style={{ ...S.screen }}>
      <header style={{ padding: "48px 24px 24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}33` }}>
        <button onClick={() => navigate("home")} style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: C.secondary, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.fg, fontSize: 18 }}>←</button>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, margin: 0 }}>Create Game</h1>
        <div style={{ width: 40 }} />
      </header>
      <div style={{ padding: "16px 24px" }}>
        <div style={{ display: "flex", backgroundColor: `${C.secondary}80`, padding: 4, borderRadius: 16, border: `1px solid rgba(255,255,255,0.05)` }}>
          <button style={{ flex: 1, padding: "10px", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", backgroundColor: C.primary, color: C.primaryFg, borderRadius: 12, border: "none", cursor: "pointer" }}>Tab 1: Details</button>
          <button onClick={() => navigate("createVenue")} style={{ flex: 1, padding: "10px", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", backgroundColor: "transparent", color: C.mutedFg, border: "none", cursor: "pointer" }}>Tab 2: Venue</button>
        </div>
      </div>
      <main style={{ padding: "8px 24px 120px", display: "flex", flexDirection: "column", gap: 20, overflowY: "auto" }}>
        <div>
          <label style={S.label}>Select Date</label>
          <div style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, backgroundColor: `${C.primary}10`, color: C.primary, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>📅</div>
              <span style={{ fontWeight: 500 }}>{date}</span>
            </div>
            <span style={{ color: C.mutedFg }}>›</span>
          </div>
        </div>
        <div>
          <label style={S.label}>Tee Time</label>
          <div style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, backgroundColor: `${C.primary}10`, color: C.primary, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>🕐</div>
              <span style={{ fontWeight: 500 }}>{teeTime}</span>
            </div>
            <span style={{ color: C.mutedFg }}>›</span>
          </div>
        </div>
        <div>
          <label style={S.label}>Course Location</label>
          <input style={{ ...S.input, borderRadius: 20, padding: "18px 20px" }} value={course} onChange={e => setCourse(e.target.value)} placeholder="Search course..." />
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.mutedFg, margin: 0 }}>Recently Used Venues</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {VENUES_DATA.map(v => (
              <div key={v.id} onClick={() => setCourse(v.name)} style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: C.secondary, display: "flex", alignItems: "center", justifyContent: "center", color: C.primary, fontSize: 20 }}>⛳</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>{v.name}</p>
                    <p style={{ fontSize: 10, color: C.mutedFg, margin: "2px 0 0" }}>{v.location}</p>
                  </div>
                </div>
                <button style={{ backgroundColor: `${C.primary}20`, color: C.primary, border: "none", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18 }}>+</button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "24px", background: `linear-gradient(to top, ${C.bg} 60%, transparent)` }}>
        <button style={S.btn} onClick={() => navigate("createVenue")}>Next: Venue Contact →</button>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: CREATE GAME (Tab 2 - Venue)
// ============================================================
function CreateVenueScreen({ navigate }) {
  const [clubMobile, setClubMobile] = useState("");
  const [clubEmail, setClubEmail] = useState("");
  const [caddyMobile, setCaddyMobile] = useState("");
  const [caddyEmail, setCaddyEmail] = useState("");
  return (
    <div style={{ ...S.screen }}>
      <header style={{ padding: "48px 24px 24px", borderBottom: `1px solid ${C.border}33` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <button onClick={() => navigate("createGame")} style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: C.secondary, border: "none", cursor: "pointer", color: C.fg, fontSize: 18 }}>←</button>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, margin: 0 }}>Create Game</h1>
        </div>
        <div style={{ display: "flex", backgroundColor: `${C.secondary}80`, padding: 4, borderRadius: 16, border: `1px solid rgba(255,255,255,0.05)` }}>
          <button onClick={() => navigate("createGame")} style={{ flex: 1, padding: "10px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", backgroundColor: "transparent", color: C.mutedFg, border: "none", cursor: "pointer" }}>Tab 1: Details</button>
          <button style={{ flex: 1, padding: "10px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", backgroundColor: C.primary, color: C.primaryFg, borderRadius: 12, border: "none", cursor: "pointer" }}>Tab 2: Venue</button>
        </div>
      </header>
      <main style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 32, overflowY: "auto", paddingBottom: 120 }}>
        {/* Club */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${C.primary}10`, display: "flex", alignItems: "center", justifyContent: "center", color: C.primary }}>⛳</div>
            <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.mutedFg, margin: 0 }}>Clubhouse Contact</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={S.label}>Club Mobile Number *</label>
                <span style={{ fontSize: 10, color: `${C.primary}80`, fontStyle: "italic" }}>Required</span>
              </div>
              <input style={S.input} type="tel" placeholder="+44 7700 900000" value={clubMobile} onChange={e => setClubMobile(e.target.value)} />
            </div>
            <div>
              <label style={S.label}>Club Email (Optional)</label>
              <input style={S.input} type="email" placeholder="proshop@clubname.com" value={clubEmail} onChange={e => setClubEmail(e.target.value)} />
            </div>
          </div>
        </section>

        {/* Caddy */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${C.primary}10`, display: "flex", alignItems: "center", justifyContent: "center", color: C.primary }}>👤</div>
            <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.mutedFg, margin: 0 }}>Caddy Service</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={S.label}>Caddy Master Mobile *</label>
                <span style={{ fontSize: 10, color: `${C.primary}80`, fontStyle: "italic" }}>Required</span>
              </div>
              <input style={S.input} type="tel" placeholder="+44 7700 900123" value={caddyMobile} onChange={e => setCaddyMobile(e.target.value)} />
            </div>
            <div>
              <label style={S.label}>Caddy Email (Optional)</label>
              <input style={S.input} type="email" placeholder="caddies@clubname.com" value={caddyEmail} onChange={e => setCaddyEmail(e.target.value)} />
            </div>
          </div>
        </section>
      </main>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "24px", background: `linear-gradient(to top, ${C.bg} 60%, transparent)` }}>
        <button style={S.btn} onClick={() => navigate("addPlayers")}>Proceed to Add Players</button>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: ADD PLAYERS
// ============================================================
function AddPlayersScreen({ navigate }) {
  const [players, setPlayers] = useState([
    { id: 1, name: "Marcus Chen", phone: "+44 7911 123456", avatar: "MC" },
    { id: 2, name: "David Sterling", phone: "+44 7911 654321", avatar: "DS" },
    { id: 3, name: "Elena Vasquez", phone: "+44 7911 888999", avatar: "EV" },
  ]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const remove = (id) => setPlayers(p => p.filter(x => x.id !== id));
  const addSaved = (p) => { if (players.length < 10 && !players.find(x => x.id === p.id)) setPlayers(prev => [...prev, p]); };
  const addManual = () => {
    if (newName && newPhone && players.length < 10) {
      setPlayers(prev => [...prev, { id: Date.now(), name: newName, phone: newPhone, avatar: newName.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase() }]);
      setNewName(""); setNewPhone("");
    }
  };

  return (
    <div style={{ ...S.screen }}>
      <header style={{ padding: "48px 24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}33` }}>
        <button onClick={() => navigate("createVenue")} style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: C.secondary, border: "none", cursor: "pointer", color: C.fg, fontSize: 18 }}>←</button>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, margin: 0 }}>Add Players</h1>
        <div style={{ width: 40 }} />
      </header>
      <main style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20, overflowY: "auto", paddingBottom: 120 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.mutedFg, margin: 0 }}>Flight List</h3>
          <div style={{ backgroundColor: `${C.primary}20`, padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700, color: C.primary, border: `1px solid ${C.primary}20` }}>{players.length} <span style={{ opacity: 0.6 }}>/ 10</span></div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {players.map(p => (
            <div key={p.id} style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar initials={p.avatar} size={44} />
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: C.mutedFg, margin: "2px 0 0" }}>{p.phone}</p>
                </div>
              </div>
              <button onClick={() => remove(p.id)} style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: `${C.destructive}15`, color: C.destructive, border: "none", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
          ))}
        </div>

        {/* Manual Add */}
        <div style={{ ...S.card, backgroundColor: `${C.card}80` }}>
          <h3 style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.mutedFg, marginBottom: 16 }}>Manual Add</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <input style={S.input} placeholder="Full Name" value={newName} onChange={e => setNewName(e.target.value)} />
            <input style={S.input} type="tel" placeholder="+1..." value={newPhone} onChange={e => setNewPhone(e.target.value)} />
          </div>
          <button onClick={addManual} style={{ width: "100%", padding: "12px", borderRadius: 12, border: `2px dashed ${C.primary}40`, backgroundColor: "transparent", color: C.primary, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>+ Add Player</button>
        </div>

        {/* Saved Players */}
        <div>
          <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.mutedFg, marginBottom: 12 }}>Recently Used</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SAVED_PLAYERS.filter(sp => !players.find(p => p.id === sp.id)).map(p => (
              <div key={p.id} style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", opacity: 0.8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar initials={p.avatar} size={40} color={C.mutedFg} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>{p.name}</p>
                    <p style={{ fontSize: 10, color: C.mutedFg, margin: "2px 0 0" }}>{p.phone}</p>
                  </div>
                </div>
                <button onClick={() => addSaved(p)} style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: `${C.primary}15`, color: C.primary, border: "none", cursor: "pointer", fontSize: 16 }}>+</button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "24px", background: `linear-gradient(to top, ${C.bg} 60%, transparent)` }}>
        <button style={S.btn} onClick={() => navigate("gameLobby")}>✈ Send All Invites</button>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: GAME LOBBY
// ============================================================
function GameLobbyScreen({ navigate }) {
  const [players, setPlayers] = useState(PLAYERS_DATA);
  const [countdown, setCountdown] = useState({ h: 21, m: 45, s: 30 });

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(c => {
        if (c.s > 0) return { ...c, s: c.s - 1 };
        if (c.m > 0) return { ...c, m: c.m - 1, s: 59 };
        if (c.h > 0) return { h: c.h - 1, m: 59, s: 59 };
        return c;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (n) => n.toString().padStart(2, "0");
  const statusColor = { accepted: C.emerald, pending: C.amber, declined: C.destructive, expired: C.mutedFg };
  const statusIcon = { accepted: "✓", pending: "⏱", declined: "✕", expired: "↻" };

  return (
    <div style={{ ...S.screen }}>
      <header style={{ padding: "48px 24px 24px", borderBottom: `1px solid ${C.border}33`, backgroundColor: `${C.card}40` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <button onClick={() => navigate("home")} style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: C.secondary, border: "none", cursor: "pointer", color: C.fg, fontSize: 18 }}>←</button>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, margin: 0 }}>Game Lobby</h1>
          <div style={{ width: 40 }} />
        </div>
        <div style={{ ...S.card, backgroundColor: `${C.secondary}80` }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: C.primary, margin: 0 }}>St Andrews Old Course</h2>
              <p style={{ fontSize: 11, color: C.mutedFg, margin: "4px 0 0" }}>Sat, 24 Nov • 07:30 AM</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.mutedFg, margin: 0 }}>Organiser</p>
              <p style={{ fontSize: 12, fontWeight: 700, margin: "4px 0 0" }}>Namith Raj</p>
              <p style={{ fontSize: 9, color: `${C.primary}80`, fontWeight: 700, textTransform: "uppercase", margin: "2px 0 0" }}>Not Playing</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 20, paddingTop: 12, borderTop: `1px solid rgba(255,255,255,0.05)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ color: C.primary, fontSize: 13 }}>📞</span><span style={{ fontSize: 10, fontWeight: 700 }}>+1 234 567 890</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ color: C.primary, fontSize: 13 }}>⛳</span><span style={{ fontSize: 10, fontWeight: 700 }}>Caddy: +1 987 654 321</span></div>
          </div>
        </div>
      </header>
      <main style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 12, paddingBottom: 120 }}>
        <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.mutedFg, margin: 0 }}>Player Status</h3>
        {players.map(p => {
          const sc = statusColor[p.status];
          return (
            <div key={p.id} style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: p.status === "expired" ? 0.5 : p.status === "declined" ? 0.7 : 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ position: "relative" }}>
                  <Avatar initials={p.avatar} size={48} color={sc} />
                  <div style={{ position: "absolute", bottom: -4, right: -4, width: 20, height: 20, backgroundColor: sc, borderRadius: "50%", border: `2px solid ${C.card}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 700 }}>{statusIcon[p.status]}</div>
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>{p.name}</p>
                  {p.status === "pending" && <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}><span style={{ fontSize: 10, color: C.amber }}>⏱</span><span style={{ fontSize: 11, fontWeight: 700, color: C.amber }}>{fmt(countdown.h)}:{fmt(countdown.m)}:{fmt(countdown.s)}</span></div>}
                  {p.status === "declined" && <p style={{ fontSize: 10, color: `${C.destructive}80`, margin: "4px 0 0" }}>{p.reason}</p>}
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: sc, margin: "4px 0 0" }}>{p.status}</p>
                </div>
              </div>
              {p.status === "pending" && <button style={{ backgroundColor: `${C.secondary}80`, color: C.primary, border: `1px solid ${C.primary}20`, borderRadius: 999, padding: "8px 16px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>Remind</button>}
              {(p.status === "declined" || p.status === "expired") && <button style={{ backgroundColor: `${C.primary}10`, color: C.primary, border: `1px solid ${C.primary}20`, borderRadius: 999, padding: "8px 16px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>Replace</button>}
            </div>
          );
        })}
      </main>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "24px", background: `linear-gradient(to top, ${C.bg} 60%, transparent)`, borderTop: `1px solid rgba(255,255,255,0.05)` }}>
        <button style={S.btn} onClick={() => navigate("selectPlayers")}>Select Final Players →</button>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: SELECT PLAYERS
// ============================================================
function SelectPlayersScreen({ navigate }) {
  const accepted = PLAYERS_DATA.filter(p => p.status === "accepted" || p.status === "pending");
  const [selected, setSelected] = useState([1]);
  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <div style={{ ...S.screen }}>
      <header style={{ padding: "48px 24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}33` }}>
        <button onClick={() => navigate("gameLobby")} style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: C.secondary, border: "none", cursor: "pointer", color: C.fg, fontSize: 18 }}>←</button>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, margin: 0 }}>Pick Your Team</h1>
        <div style={{ width: 40 }} />
      </header>
      <main style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20, overflowY: "auto", paddingBottom: 120 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.mutedFg, marginBottom: 4 }}>Final Selection</p>
          <p style={{ fontSize: 11, color: `${C.mutedFg}80` }}>Unselected players will be notified politely that the group is now full.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.mutedFg, margin: 0 }}>Accepted Players</h3>
          <div style={{ backgroundColor: C.primary, padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700, color: C.primaryFg }}>{selected.length} <span style={{ opacity: 0.6 }}>/ {accepted.length} Selected</span></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {accepted.map(p => {
            const isSelected = selected.includes(p.id);
            return (
              <div key={p.id} onClick={() => toggle(p.id)} style={{ position: "relative", borderRadius: 24, border: `1px solid ${isSelected ? `${C.primary}40` : "rgba(255,255,255,0.05)"}`, backgroundColor: isSelected ? `${C.primary}10` : `${C.card}80`, cursor: "pointer", padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", opacity: isSelected ? 1 : 0.7, transition: "all 0.2s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <Avatar initials={p.avatar} size={56} color={isSelected ? C.primary : C.mutedFg} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 16, color: isSelected ? C.primary : C.fg, margin: 0 }}>{p.name}</p>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: isSelected ? `${C.primary}80` : C.mutedFg, margin: "4px 0 0" }}>Ready to play</p>
                  </div>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: isSelected ? C.primary : "transparent", border: `2px solid ${isSelected ? C.primary : "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.primaryFg, fontWeight: 700, fontSize: 14, transition: "all 0.2s" }}>{isSelected ? "✓" : ""}</div>
              </div>
            );
          })}
        </div>
      </main>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "24px", background: `linear-gradient(to top, ${C.bg} 60%, transparent)` }}>
        <button style={S.btn} onClick={() => navigate("confirmed")}>Confirm and Notify All</button>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: PLAYER INVITE
// ============================================================
function PlayerInviteScreen({ navigate }) {
  const [countdown, setCountdown] = useState({ h: 23, m: 59, s: 4 });
  useEffect(() => {
    const t = setInterval(() => setCountdown(c => {
      if (c.s > 0) return { ...c, s: c.s - 1 };
      if (c.m > 0) return { ...c, m: c.m - 1, s: 59 };
      if (c.h > 0) return { h: c.h - 1, m: 59, s: 59 };
      return c;
    }), 1000);
    return () => clearInterval(t);
  }, []);
  const fmt = n => n.toString().padStart(2, "0");
  const details = [
    { icon: "📅", label: "Date", value: "Sat, 24 Nov" },
    { icon: "🕐", label: "Tee Time", value: "07:30 AM" },
    { icon: "👥", label: "Group Size", value: "4 Players" },
    { icon: "⛳", label: "Course", value: "Old Course" },
  ];
  return (
    <div style={{ ...S.screen, overflow: "hidden" }}>
      <div style={{ height: "30vh", position: "relative", background: `linear-gradient(135deg, ${C.secondary}, ${C.bg})`, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 24px 24px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 60%, rgba(212,175,55,0.1) 0%, transparent 60%)" }} />
        <button onClick={() => navigate("home")} style={{ position: "absolute", top: "48px", right: "24px", width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.2)", border: `1px solid rgba(255,255,255,0.1)`, cursor: "pointer", color: C.fg, fontSize: 18 }}>✕</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar initials="NR" size={40} color={C.primary} />
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: C.primary, margin: 0 }}>Invitation From</p>
            <p style={{ fontWeight: 700, fontSize: 17, margin: "2px 0 0" }}>Namith Raj</p>
          </div>
        </div>
      </div>
      <main style={{ flex: 1, padding: "24px 24px 140px", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
              Weekend Round at<br /><span style={{ color: C.primary }}>St Andrews</span>
            </h1>
          </div>
          <div style={{ backgroundColor: `${C.secondary}80`, padding: "8px 16px", borderRadius: 16, border: `1px solid rgba(255,255,255,0.05)`, textAlign: "center" }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.mutedFg, display: "block" }}>Expires In</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: C.amber }}>{fmt(countdown.h)}:{fmt(countdown.m)}:{fmt(countdown.s)}</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {details.map(d => (
            <div key={d.label} style={{ ...S.card }}>
              <div style={{ fontSize: 20, marginBottom: 10 }}>{d.icon}</div>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.mutedFg, margin: 0 }}>{d.label}</p>
              <p style={{ fontWeight: 700, fontSize: 13, margin: "4px 0 0" }}>{d.value}</p>
            </div>
          ))}
        </div>
        <div style={{ ...S.card, display: "flex", alignItems: "center", gap: 12, backgroundColor: `${C.secondary}30` }}>
          <span style={{ fontSize: 20, color: C.primary }}>🚩</span>
          <p style={{ fontSize: 12, margin: 0 }}><strong>Namith</strong> is organizing but <span style={{ color: C.primary, fontStyle: "italic", fontWeight: 700 }}>not playing</span> in this round.</p>
        </div>
      </main>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "24px", display: "flex", flexDirection: "column", gap: 10, background: `linear-gradient(to top, ${C.bg} 60%, transparent)` }}>
        <button style={{ ...S.btn, backgroundColor: "#16A34A" }} onClick={() => navigate("home")}>✓ Accept Invitation</button>
        <button style={{ ...S.btnSecondary }}>Decline Round</button>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: GAME CHAT
// ============================================================
function GameChatScreen({ navigate }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Marcus Chen", text: "Looking forward to Saturday! Has anyone checked the weather forecast?", time: "09:42 AM", mine: false, avatar: "MC" },
    { id: 2, sender: "You", text: "Just checked, looks like clear skies and 14°C. Perfect for golf! ⛳", time: "09:45 AM", mine: true },
    { id: 3, sender: "system", text: "Game Confirmed • Venue Notified" },
    { id: 4, sender: "David Sterling", text: "Great. I've booked a caddy as well. See you all at the clubhouse for coffee at 7!", time: "10:15 AM", mine: false, avatar: "DS" },
  ]);
  const [input, setInput] = useState("");
  const send = () => {
    if (input.trim()) {
      setMessages(m => [...m, { id: Date.now(), sender: "You", text: input, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), mine: true }]);
      setInput("");
    }
  };

  return (
    <div style={{ ...S.screen }}>
      <header style={{ padding: "48px 24px 16px", display: "flex", alignItems: "center", gap: 16, borderBottom: `1px solid ${C.border}33`, backgroundColor: `${C.card}80` }}>
        <button onClick={() => navigate("home")} style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: C.secondary, border: "none", cursor: "pointer", color: C.fg, fontSize: 18 }}>←</button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, margin: 0 }}>St Andrews • Sat 24 Nov</h1>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.mutedFg, margin: "4px 0 0" }}>4 Players</p>
        </div>
        <button style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: C.secondary, border: "none", cursor: "pointer", color: C.fg, fontSize: 18 }}>ℹ</button>
      </header>
      <main style={{ flex: 1, overflowY: "auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span style={{ backgroundColor: C.secondary, padding: "4px 12px", borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.mutedFg, border: `1px solid rgba(255,255,255,0.05)` }}>Today</span>
        </div>
        {messages.map(m => {
          if (m.sender === "system") return (
            <div key={m.id} style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ backgroundColor: `${C.primary}10`, border: `1px solid ${C.primary}20`, padding: "8px 16px", borderRadius: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: C.primary }}>✓</span>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.primary, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>{m.text}</p>
              </div>
            </div>
          );
          return (
            <div key={m.id} style={{ display: "flex", alignItems: "flex-end", gap: 10, justifyContent: m.mine ? "flex-end" : "flex-start", maxWidth: "85%" , alignSelf: m.mine ? "flex-end" : "flex-start" }}>
              {!m.mine && <Avatar initials={m.avatar} size={32} />}
              <div>
                {!m.mine && <p style={{ fontSize: 10, fontWeight: 700, color: C.mutedFg, margin: "0 0 4px 4px" }}>{m.sender}</p>}
                <div style={{ backgroundColor: m.mine ? C.primary : C.card, color: m.mine ? C.primaryFg : C.fg, padding: "14px 16px", borderRadius: m.mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px", border: m.mine ? "none" : `1px solid rgba(255,255,255,0.05)` }}>
                  <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0 }}>{m.text}</p>
                  <p style={{ fontSize: 9, opacity: 0.6, textAlign: "right", margin: "6px 0 0" }}>{m.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </main>
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}33`, display: "flex", alignItems: "center", gap: 10 }}>
        <button style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: C.secondary, border: "none", cursor: "pointer", color: C.mutedFg, fontSize: 20 }}>+</button>
        <div style={{ flex: 1, position: "relative" }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Type a message..." style={{ ...S.input, borderRadius: 999, paddingRight: 48 }} />
          <button onClick={send} style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", backgroundColor: C.primary, border: "none", cursor: "pointer", color: C.primaryFg, fontSize: 16 }}>✈</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: CALENDAR
// ============================================================
function CalendarScreen({ navigate }) {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const gameDays = [6, 24];
  return (
    <div style={{ ...S.screen, paddingBottom: 120 }}>
      <header style={{ padding: "48px 24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}33` }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, margin: 0 }}>Game Schedule</h1>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.primary, margin: "4px 0 0" }}>Your Golf Season</p>
        </div>
        <button onClick={() => navigate("createGame")} style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: C.secondary, border: `1px solid rgba(255,255,255,0.05)`, cursor: "pointer", color: C.fg, fontSize: 22 }}>+</button>
      </header>
      <main style={{ overflowY: "auto" }}>
        <div style={{ padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 500, margin: 0 }}>November 2024</h2>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: C.secondary, border: "none", cursor: "pointer", color: C.fg }}>‹</button>
            <button style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: C.secondary, border: "none", cursor: "pointer", color: C.fg }}>›</button>
          </div>
        </div>
        <div style={{ padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 12 }}>
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: C.mutedFg }}>{d}</div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {[28,29,30,31].map(d => <div key={`prev-${d}`} style={{ aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", color: `${C.mutedFg}30`, fontSize: 13 }}>{d}</div>)}
            {days.map(d => {
              const isGame = gameDays.includes(d);
              const isToday = d === 24;
              return (
                <div key={d} style={{ aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div style={{ position: "absolute", inset: 2, borderRadius: 10, backgroundColor: isToday ? C.primary : isGame ? `${C.destructive}10` : "transparent", border: isGame && !isToday ? `1px solid ${C.destructive}30` : "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: isGame ? 700 : 400, color: isToday ? C.primaryFg : isGame ? C.destructive : C.fg }}>{d}</span>
                    {isGame && <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: isToday ? C.primaryFg : C.destructive, marginTop: 1 }} />}
                  </div>
                </div>
              );
            })}
            <div style={{ aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", color: `${C.mutedFg}30`, fontSize: 13 }}>1</div>
          </div>
        </div>
        <div style={{ padding: "32px 24px" }}>
          <div style={{ ...S.card, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 16, right: 16 }}>
              <StatusBadge status="confirmed" />
            </div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.primary, margin: "0 0 8px" }}>Saturday, 24 Nov</p>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700, margin: "0 0 20px" }}>St Andrews Links<br />Old Course</h3>
            <div style={{ display: "flex", gap: 24, borderTop: `1px solid rgba(255,255,255,0.05)`, paddingTop: 16 }}>
              <div>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.mutedFg }}>Tee Time</span>
                <p style={{ fontWeight: 700, fontSize: 14, margin: "4px 0 0" }}>07:30 AM</p>
              </div>
              <div>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.mutedFg }}>Players</span>
                <p style={{ fontWeight: 700, fontSize: 14, margin: "4px 0 0" }}>4 Confirmed</p>
              </div>
            </div>
            <button onClick={() => navigate("gameLobby")} style={{ ...S.btnSecondary, marginTop: 16, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>View Game Details ›</button>
          </div>
        </div>
      </main>
      <BottomNav active="calendar" navigate={navigate} />
    </div>
  );
}

// ============================================================
// SCREEN: GAME HISTORY
// ============================================================
function GameHistoryScreen({ navigate }) {
  return (
    <div style={{ ...S.screen, paddingBottom: 120 }}>
      <header style={{ padding: "48px 24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}33` }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, margin: 0 }}>Past Rounds</h1>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.primary, margin: "4px 0 0" }}>Game Organisation History</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: C.secondary, border: `1px solid rgba(255,255,255,0.05)`, cursor: "pointer", color: C.fg, fontSize: 16 }}>🔍</button>
          <button style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: C.secondary, border: `1px solid rgba(255,255,255,0.05)`, cursor: "pointer", color: C.fg, fontSize: 16 }}>⚡</button>
        </div>
      </header>
      <main style={{ overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", gap: 12, overflowX: "auto" }}>
          {[{label:"Total Games",value:42},{label:"Venues",value:18},{label:"Players Met",value:84}].map(s => (
            <div key={s.label} style={{ ...S.card, minWidth: 130, flexShrink: 0 }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.mutedFg, margin: "0 0 4px" }}>{s.label}</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.mutedFg, margin: 0 }}>Recent Rounds</h3>
          {HISTORY_DATA.map(g => (
            <div key={g.id} style={{ ...S.card, borderRadius: 28, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.primary, margin: "0 0 4px" }}>{g.date}</p>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, margin: 0 }}>{g.course}</h4>
                </div>
                <StatusBadge status="completed" />
              </div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", color: C.mutedFg, margin: "0 0 16px" }}>✈ {g.players}</p>
              {g.note && (
                <div style={{ backgroundColor: `${C.input}80`, padding: 12, borderRadius: 12, border: `1px solid rgba(255,255,255,0.05)`, marginBottom: 16 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: C.mutedFg, margin: "0 0 4px" }}>📝 Game Note</p>
                  <p style={{ fontSize: 11, fontStyle: "italic", color: C.mutedFg, margin: 0 }}>"{g.note}"</p>
                </div>
              )}
              <button onClick={() => navigate("chat")} style={{ ...S.btnSecondary, padding: "10px", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>📦 View Chat Archive</button>
            </div>
          ))}
        </div>
      </main>
      <BottomNav active="history" navigate={navigate} />
    </div>
  );
}

// ============================================================
// SCREEN: GAME CONFIRMED
// ============================================================
function GameConfirmedScreen({ navigate }) {
  return (
    <div style={{ ...S.screen, overflow: "hidden" }}>
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", position: "relative" }}>
        <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "60vw", height: "60vw", borderRadius: "50%", backgroundColor: `${C.primary}08`, filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "60vw", height: "60vw", borderRadius: "50%", backgroundColor: `${C.emerald}08`, filter: "blur(80px)" }} />
        <div style={{ position: "relative", marginBottom: 32 }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", backgroundColor: C.emerald, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 50px ${C.emerald}40`, border: `4px solid ${C.bg}`, zIndex: 10, position: "relative" }}>
            <span style={{ fontSize: 40, color: "#fff" }}>✓</span>
          </div>
          <div style={{ position: "absolute", inset: -10, borderRadius: "50%", border: `1px solid ${C.emerald}30`, animation: "ping 2s infinite" }} />
        </div>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, margin: 0 }}>Round Confirmed!</h1>
          <p style={{ color: C.mutedFg, fontSize: 13, maxWidth: 280, margin: "8px auto 0" }}>Everything is set for your round at <span style={{ color: C.primary, fontWeight: 700 }}>St Andrews Links</span>.</p>
        </div>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.mutedFg, margin: "0 0 4px" }}>Automated Confirmations</p>
          {[
            { icon: "👥", title: "All Players Notified", sub: "Push notifications sent" },
            { icon: "⛳", title: "Golf Club Reception", sub: "Tee time confirmed via email" },
            { icon: "👤", title: "Caddy Master", sub: "Booking request dispatched" },
          ].map(item => (
            <div key={item.title} style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${C.emerald}10`, display: "flex", alignItems: "center", justifyContent: "center", color: C.emerald, fontSize: 18 }}>{item.icon}</div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, margin: 0 }}>{item.title}</p>
                  <p style={{ fontSize: 10, color: C.mutedFg, margin: "2px 0 0" }}>{item.sub}</p>
                </div>
              </div>
              <span style={{ color: C.emerald, fontSize: 18 }}>✓</span>
            </div>
          ))}
        </div>
        <div style={{ width: "100%", marginTop: 24, padding: 20, backgroundColor: `${C.secondary}50`, borderRadius: 28, border: `1px solid rgba(255,255,255,0.05)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ color: C.primary }}>🔔</span>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.primary }}>Scheduled Reminders</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {["24 Hours","2 Hours","Morning"].map(r => (
              <div key={r} style={{ backgroundColor: `${C.bg}40`, padding: 8, borderRadius: 12, textAlign: "center", border: `1px solid rgba(255,255,255,0.05)` }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: C.mutedFg, textTransform: "uppercase", margin: "0 0 4px" }}>{r}</p>
                <span style={{ color: C.emerald, fontSize: 14 }}>✓</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <div style={{ padding: "24px" }}>
        <button style={S.btn} onClick={() => navigate("home")}>Back to Dashboard</button>
      </div>
      <style>{`@keyframes ping{0%{transform:scale(1);opacity:1}75%,100%{transform:scale(1.5);opacity:0}}`}</style>
    </div>
  );
}

// ============================================================
// SCREEN: NOTIFICATIONS
// ============================================================
function NotificationsScreen({ navigate }) {
  const notifs = [
    { id: 1, type: "accepted", title: "Invitation Accepted", text: "Marcus Thorne accepted your invite for Pebble Beach.", time: "2m ago", color: C.emerald, icon: "✓" },
    { id: 2, type: "declined", title: "Invitation Declined", text: 'David Chen declined the invite: "Out of town that weekend."', time: "1h ago", color: C.destructive, icon: "✕" },
    { id: 3, type: "expiring", title: "Expiring Soon", text: "Elena's invite for St Andrews expires in 02:14:10.", time: "3h ago", color: C.amber, icon: "⏱" },
    { id: 4, type: "reminder", title: "Game Reminder", text: "Your round at Valderrama starts in 24 hours. Check the lobby for final details.", time: "Yesterday", color: C.primary, icon: "🔔" },
  ];
  return (
    <div style={{ ...S.screen }}>
      <header style={{ padding: "48px 24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}33` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate("home")} style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: C.secondary, border: "none", cursor: "pointer", color: C.fg, fontSize: 18 }}>←</button>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, margin: 0 }}>Notifications</h1>
        </div>
        <button style={{ background: "none", border: "none", color: C.primary, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>Mark all read</button>
      </header>
      <main style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
        {notifs.map(n => (
          <div key={n.id} style={{ ...S.card, display: "flex", gap: 16, borderLeft: `4px solid ${n.color}` }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: `${n.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: n.color, fontSize: 18, flexShrink: 0 }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{n.title}</h4>
                <span style={{ fontSize: 9, color: C.mutedFg, fontWeight: 700, textTransform: "uppercase" }}>{n.time}</span>
              </div>
              <p style={{ fontSize: 11, color: C.mutedFg, lineHeight: 1.5, margin: 0 }}>{n.text}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function GolfMateApp() {
  const [screen, setScreen] = useState("splash");

  const screens = {
    splash: <SplashScreen navigate={setScreen} />,
    login: <LoginScreen navigate={setScreen} />,
    verification: <VerificationScreen navigate={setScreen} />,
    home: <HomeScreen navigate={setScreen} />,
    createGame: <CreateGameScreen navigate={setScreen} />,
    createVenue: <CreateVenueScreen navigate={setScreen} />,
    addPlayers: <AddPlayersScreen navigate={setScreen} />,
    gameLobby: <GameLobbyScreen navigate={setScreen} />,
    selectPlayers: <SelectPlayersScreen navigate={setScreen} />,
    playerInvite: <PlayerInviteScreen navigate={setScreen} />,
    chat: <GameChatScreen navigate={setScreen} />,
    calendar: <CalendarScreen navigate={setScreen} />,
    history: <GameHistoryScreen navigate={setScreen} />,
    confirmed: <GameConfirmedScreen navigate={setScreen} />,
    notifications: <NotificationsScreen navigate={setScreen} />,
  };

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", backgroundColor: C.bg, position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      {screens[screen] || screens.home}
    </div>
  );
}
