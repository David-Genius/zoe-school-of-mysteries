import { useEffect, useState, useRef } from "react";
import { getAllSermons } from "./firebase";

// ─── Gold palette ─────────────────────────────────────────────────────────────
const G = {
  gold: "#F5A800",
  goldDim: "#C47F00",
  goldGlow: "rgba(245,168,0,0.18)",
  bg: "#080808",
  surface: "#111111",
  card: "#161616",
  border: "rgba(245,168,0,0.12)",
  borderHover: "rgba(245,168,0,0.35)",
  text: "#F0EDE6",
  muted: "#888",
  faint: "#444",
};

// ─── Default audio sermons ─────────────────────────────────────────────────────
const defaultAudioSermons = [
  { id: "a1", title: "The Mystery of Grace",           preacher: "Apostle Hassan Ololade Melchizedek", audioUrl: "/sermons/record.ogg",      type: "audio" },
  { id: "a2", title: "Kingdom Alignment",               preacher: "Apostle Hassan Ololade Melchizedek", audioUrl: "/sermons/record (2).ogg",  type: "audio" },
  { id: "a3", title: "Walking In Divine Purpose",       preacher: "Apostle Hassan Ololade Melchizedek", audioUrl: "/sermons/record (3).ogg",  type: "audio" },
  { id: "a4", title: "The Power of His Resurrection",  preacher: "Apostle Hassan Ololade Melchizedek", audioUrl: "/sermons/record (4).ogg",  type: "audio" },
  { id: "a5", title: "Accessing Heavenly Realms",      preacher: "Apostle Hassan Ololade Melchizedek", audioUrl: "/sermons/record (5).ogg",  type: "audio" },
  { id: "a6", title: "Covenant Blood Mysteries",       preacher: "Apostle Hassan Ololade Melchizedek", audioUrl: "/sermons/record (6).ogg",  type: "audio" },
  { id: "a7", title: "The Priestly Order Revealed",    preacher: "Apostle Hassan Ololade Melchizedek", audioUrl: "/sermons/record (7).ogg",  type: "audio" },
  { id: "a8", title: "Seated in Heavenly Places",      preacher: "Apostle Hassan Ololade Melchizedek", audioUrl: "/sermons/record (8).ogg",  type: "audio" },
  { id: "a9", title: "Entering the Secret Place",      preacher: "Apostle Hassan Ololade Melchizedek", audioUrl: "/sermons/record (9).ogg",  type: "audio" },
  { id:"a10", title: "The Fullness of the Godhead",    preacher: "Apostle Hassan Ololade Melchizedek", audioUrl: "/sermons/record (10).ogg", type: "audio" },
];

// ─── Default video sermons (YouTube) ─────────────────────────────────────────
// Replace these YouTube IDs with your actual videos
const defaultVideoSermons = [
  {
    id: "v1",
    title: "Mysteries of the Kingdom of God",
    preacher: "Apostle Daniel",
    youtubeId: "Vqp7cAsF5Uo",   // ← replace with real ID
    thumbnail: "/images/photo_2026-06-11_14-39-41.jpg",
    type: "video",
    date: "Dec 2024",
  },
  {
    id: "v2",
    title: "The Melchizedek Priesthood Explained",
    preacher: "Apostle Hassan Ololade Melchizedek",
    youtubeId: "RgyeTfOi1xE",   // ← replace
    thumbnail: "",
    type: "video",
    date: "Jan 2025",
  },
  {
    id: "v3",
    title: "Walking in the Spirit of Prophecy",
    preacher: "Apostle Hassan Ololade Melchizedek",
    youtubeId: "rHtWdsjE854",   // ← replace
    thumbnail: "",
    type: "video",
    date: "Feb 2025",
  },
  {
    id: "v4",
    title: "Divine Encounter: Face to Face with God",
    preacher: "Apostle Hassan Ololade Melchizedek",
    youtubeId: "fwS98qeCU74",   // ← replace
    thumbnail: "/images/photo_2026-06-11_14-39-41.jpg",
    type: "video",
    date: "Mar 2025",
  },
];

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─── YouTube thumbnail fallback ───────────────────────────────────────────────
function ytThumb(id) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

// ─── Audio Card ───────────────────────────────────────────────────────────────
function AudioCard({ s, index }) {
  const [ref, visible] = useReveal();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  function togglePlay() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play(); setPlaying(true); }
  }

  return (
    <div
      ref={ref}
      style={{
        background: G.card,
        border: `1px solid ${G.border}`,
        borderRadius: 18,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transition: "border-color 0.3s, transform 0.4s, opacity 0.5s",
        transform: visible ? "translateY(0)" : "translateY(28px)",
        opacity: visible ? 1 : 0,
        transitionDelay: `${(index % 3) * 60}ms`,
        cursor: "pointer",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = G.borderHover; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = G.border; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        {/* Play button */}
        <button
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          style={{
            flexShrink: 0,
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: playing ? G.gold : "transparent",
            border: `2px solid ${playing ? G.gold : G.goldDim}`,
            color: playing ? "#000" : G.gold,
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {playing ? "⏸" : "▶"}
        </button>

        {/* Title & preacher */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ color: G.gold, fontSize: 11, letterSpacing: "2.5px", textTransform: "uppercase", fontWeight: 600 }}>
            AUDIO SERMON
          </span>
          <h3 style={{ margin: "6px 0 4px", fontSize: "clamp(15px,3vw,18px)", color: G.text, lineHeight: 1.3 }}>
            {s.title}
          </h3>
          <p style={{ color: G.muted, fontSize: 13, margin: 0 }}>{s.preacher}</p>
        </div>
      </div>

      {/* Custom audio */}
      <audio
        ref={audioRef}
        src={s.audioUrl}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        style={{ display: "none" }}
      />
      <audio
        controls
        src={s.audioUrl}
        style={{
          width: "100%",
          height: 36,
          borderRadius: 30,
          outline: "none",
          accentColor: G.gold,
        }}
      />
    </div>
  );
}

// ─── Video Card ───────────────────────────────────────────────────────────────
function VideoCard({ s, index }) {
  const [ref, visible] = useReveal();
  const [playing, setPlaying] = useState(false);
  const thumb = s.thumbnail || ytThumb(s.youtubeId);

  return (
    <div
      ref={ref}
      style={{
        background: G.card,
        border: `1px solid ${G.border}`,
        borderRadius: 18,
        overflow: "hidden",
        transition: "border-color 0.3s, transform 0.4s, opacity 0.5s",
        transform: visible ? "translateY(0)" : "translateY(28px)",
        opacity: visible ? 1 : 0,
        transitionDelay: `${(index % 2) * 80}ms`,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = G.borderHover; e.currentTarget.style.transform = "translateY(-4px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = G.border; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Thumbnail / embed */}
      <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", background: "#000" }}>
        {playing ? (
          <iframe
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            src={`https://www.youtube.com/embed/${s.youtubeId}?autoplay=1&rel=0`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={s.title}
          />
        ) : (
          <>
            <img
              src={thumb}
              alt={s.title}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
              onError={e => { e.target.style.display = "none"; }}
            />
            {/* Gold gradient overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 50%)",
            }} />
            {/* Play button */}
            <button
              onClick={() => setPlaying(true)}
              aria-label="Play video"
              style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                width: 64, height: 64, borderRadius: "50%",
                background: G.gold,
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26, color: "#000",
                boxShadow: `0 0 28px ${G.goldGlow}`,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translate(-50%,-50%) scale(1.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translate(-50%,-50%) scale(1)"; }}
            >
              ▶
            </button>
            {s.date && (
              <span style={{
                position: "absolute", top: 12, right: 12,
                background: "rgba(0,0,0,0.65)", color: G.gold,
                fontSize: 11, padding: "3px 10px", borderRadius: 30, letterSpacing: 1,
              }}>{s.date}</span>
            )}
          </>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "18px 20px" }}>
        <span style={{ color: G.gold, fontSize: 11, letterSpacing: "2.5px", textTransform: "uppercase", fontWeight: 600 }}>
          VIDEO SERMON
        </span>
        <h3 style={{ margin: "7px 0 5px", fontSize: "clamp(15px,3vw,19px)", color: G.text, lineHeight: 1.35 }}>
          {s.title}
        </h3>
        <p style={{ color: G.muted, fontSize: 13, margin: 0 }}>{s.preacher}</p>
      </div>
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ eyebrow, title }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{
      textAlign: "center", marginBottom: 48,
      transition: "opacity 0.6s, transform 0.6s",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
    }}>
      <span style={{ color: G.gold, letterSpacing: "4px", fontSize: 12, textTransform: "uppercase", fontWeight: 600 }}>
        {eyebrow}
      </span>
      <h2 style={{
        marginTop: 12, marginBottom: 0,
        fontSize: "clamp(2rem,6vw,3.2rem)",
        color: G.text,
        fontFamily: "Cinzel, serif",
        fontWeight: 700,
        lineHeight: 1.15,
      }}>
        {title}
      </h2>
      {/* Gold line */}
      <div style={{
        width: 60, height: 2, background: G.gold,
        margin: "16px auto 0", borderRadius: 2, opacity: 0.8,
      }} />
    </div>
  );
}

// ─── Tab switcher ─────────────────────────────────────────────────────────────
function Tabs({ active, onChange }) {
  const tabs = [
    { id: "video", label: "📺 Videos" },
    { id: "audio", label: "🎧 Audio" },
  ];
  return (
    <div style={{
      display: "flex", gap: 8, justifyContent: "center",
      marginBottom: 48,
    }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            padding: "10px 28px",
            borderRadius: 50,
            border: active === t.id ? `1.5px solid ${G.gold}` : `1.5px solid ${G.faint}`,
            background: active === t.id ? G.goldGlow : "transparent",
            color: active === t.id ? G.gold : G.muted,
            fontWeight: active === t.id ? 700 : 400,
            fontSize: 15, cursor: "pointer",
            transition: "all 0.2s",
            letterSpacing: 0.5,
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SermonPage() {
  const [audioSermons, setAudioSermons] = useState([]);
  const [videoSermons, setVideoSermons] = useState(defaultVideoSermons);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("video");

  useEffect(() => {
    getAllSermons()
      .then((fbSermons) => {
        const fbAudio = fbSermons.filter(s => s.type !== "video");
        const fbVideo = fbSermons.filter(s => s.type === "video");
        setAudioSermons([...defaultAudioSermons, ...fbAudio]);
        setVideoSermons([...defaultVideoSermons, ...fbVideo]);
      })
      .catch(() => {
        setAudioSermons(defaultAudioSermons);
        setVideoSermons(defaultVideoSermons);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: G.bg,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 20,
      }}>
        {/* Pulsing cross */}
        <div style={{
          width: 60, height: 60,
          border: `3px solid ${G.gold}`,
          borderRadius: "50%",
          animation: "pulse 1.4s ease-in-out infinite",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, color: G.gold,
        }}>✝</div>
        <p style={{ color: G.muted, letterSpacing: 3, textTransform: "uppercase", fontSize: 13 }}>
          Loading Sermons…
        </p>
        <style>{`@keyframes pulse { 0%,100%{opacity:0.4;transform:scale(0.95)} 50%{opacity:1;transform:scale(1.05)} }`}</style>
      </div>
    );
  }

  return (
    <section style={{ minHeight: "100vh", background: G.bg, color: G.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&display=swap');
        * { box-sizing: border-box; }
        audio::-webkit-media-controls-panel { background: #1a1a1a; }
        audio { color-scheme: dark; }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
      `}</style>

      {/* ── Hero ── */}
      <div style={{
        position: "relative",
        paddingTop: "clamp(110px,18vw,180px)",
        paddingBottom: "clamp(70px,10vw,120px)",
        textAlign: "center",
        overflow: "hidden",
      }}>
        {/* Radial glow */}
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
          width: "min(700px,90vw)", height: "min(700px,90vw)",
          background: `radial-gradient(circle, ${G.goldGlow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        {/* Cross ornament */}
        <div style={{
          fontSize: 28, color: G.gold, marginBottom: 20,
          animation: "fadeDown 0.8s ease both",
        }}>✦ ✝ ✦</div>

        <p style={{
          color: G.gold, letterSpacing: "5px", fontSize: "clamp(10px,2vw,13px)",
          textTransform: "uppercase", fontWeight: 600, marginBottom: 14,
          animation: "fadeDown 0.9s ease both",
        }}>
          Zoe School of Mysteries
        </p>

        <h1 style={{
          fontFamily: "Cinzel, serif",
          fontSize: "clamp(2.6rem,9vw,5.5rem)",
          fontWeight: 700,
          lineHeight: 1.1,
          margin: "0 auto 24px",
          maxWidth: 800,
          padding: "0 20px",
          background: `linear-gradient(135deg, ${G.gold} 30%, #fff7dc 70%, ${G.gold} 100%)`,
          backgroundSize: "200%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "fadeDown 1s ease both, shimmer 4s linear infinite",
        }}>
          Sermon Archive
        </h1>

        <p style={{
          color: G.muted, lineHeight: 1.9,
          maxWidth: 600, margin: "0 auto 16px",
          padding: "0 24px",
          fontSize: "clamp(14px,3vw,17px)",
          animation: "fadeDown 1.1s ease both",
        }}>
          Life-transforming teachings, prophetic revelations, and
          divine mysteries through the ministry of{" "}
          <strong style={{ color: G.text }}>Apostle Hassan Ololade Melchizedek</strong>.
        </p>

        {/* Stats row */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "clamp(20px,5vw,48px)",
          marginTop: 40, flexWrap: "wrap",
          animation: "fadeDown 1.2s ease both",
        }}>
          {[
            { n: videoSermons.length + "+", label: "Video Sermons" },
            { n: audioSermons.length + "+", label: "Audio Messages" },
            { n: "∞",  label: "Kingdom Depth" },
          ].map(({ n, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ color: G.gold, fontSize: "clamp(1.5rem,4vw,2rem)", fontWeight: 700, fontFamily: "Cinzel, serif" }}>{n}</div>
              <div style={{ color: G.muted, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ width: "90%", maxWidth: 1200, margin: "0 auto", height: 1, background: G.border }} />

      {/* ── Tab content ── */}
      <div style={{ width: "90%", maxWidth: 1200, margin: "0 auto", paddingTop: 72, paddingBottom: 80 }}>
        <Tabs active={activeTab} onChange={setActiveTab} />

        {/* VIDEO TAB */}
        {activeTab === "video" && (
          <>
            <SectionHeading eyebrow="Watch & Be Transformed" title="Video Sermons" />
            {videoSermons.length === 0 ? (
              <p style={{ textAlign: "center", color: G.muted }}>No videos available yet.</p>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,360px),1fr))",
                gap: 28,
              }}>
                {videoSermons.map((s, i) => <VideoCard key={s.id} s={s} index={i} />)}
              </div>
            )}

            {/* YouTube CTA */}
            <div style={{ textAlign: "center", marginTop: 56 }}>
              <p style={{ color: G.muted, marginBottom: 16, fontSize: 14 }}>
                Watch all sermons and subscribe for new teachings every week.
              </p>
              <a
                href="https://www.youtube.com/@YourChannelHandle"   /* ← replace */
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  background: "#FF0000", color: "#fff",
                  padding: "14px 32px", borderRadius: 50,
                  textDecoration: "none", fontWeight: 700, fontSize: 15,
                  boxShadow: "0 8px 28px rgba(255,0,0,0.3)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
                </svg>
                Subscribe on YouTube
              </a>
            </div>
          </>
        )}

        {/* AUDIO TAB */}
        {activeTab === "audio" && (
          <>
            <SectionHeading eyebrow="Listen & Receive" title="Audio Messages" />
            {audioSermons.length === 0 ? (
              <p style={{ textAlign: "center", color: G.muted }}>No audio sermons yet.</p>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,320px),1fr))",
                gap: 24,
              }}>
                {audioSermons.map((s, i) => <AudioCard key={s.id} s={s} index={i} />)}
              </div>
            )}

            {/* Telegram CTA */}
            <div style={{
              marginTop: 72,
              background: `linear-gradient(135deg, #0f0f0f, #161616)`,
              border: `1px solid ${G.border}`,
              borderRadius: 24,
              padding: "clamp(32px,6vw,56px) clamp(24px,6vw,64px)",
              textAlign: "center",
              position: "relative", overflow: "hidden",
            }}>
              {/* Faint glow */}
              <div style={{
                position: "absolute", bottom: "-40%", left: "50%", transform: "translateX(-50%)",
                width: 500, height: 300,
                background: "radial-gradient(circle, rgba(0,136,204,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />

              <div style={{ fontSize: 40, marginBottom: 12 }}>✈️</div>
              <h3 style={{
                fontFamily: "Cinzel, serif",
                fontSize: "clamp(1.3rem,4vw,2rem)",
                color: G.text, margin: "0 0 12px",
              }}>
                More Audio on Telegram
              </h3>
              <p style={{ color: G.muted, maxWidth: 500, margin: "0 auto 28px", lineHeight: 1.8, fontSize: 15 }}>
                Join our Telegram community for hundreds more audio messages,
                prophetic updates, study notes, and daily kingdom insights.
              </p>
              <a
                href="https://t.me/+np_bvuRyvFg4OGJk"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  background: "#0088cc", color: "#fff",
                  padding: "14px 36px", borderRadius: 50,
                  textDecoration: "none", fontWeight: 700, fontSize: 16,
                  boxShadow: "0 8px 28px rgba(0,136,204,0.25)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                Join Telegram Community →
              </a>
              <p style={{ color: G.faint, fontSize: 12, marginTop: 16, letterSpacing: 1 }}>
                FREE · Hundreds of teachings · Updated regularly
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── Footer strip ── */}
      <div style={{
        borderTop: `1px solid ${G.border}`,
        padding: "28px 24px",
        textAlign: "center",
        color: G.faint,
        fontSize: 13,
        letterSpacing: 1,
      }}>
        © {new Date().getFullYear()} Zoe School of Mysteries · Apostle Hassan Ololade Melchizedek
      </div>
    </section>
  );
}