import { useState, useEffect } from "react";

function useWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const h = () => setWidth(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return width;
}

const experiences = [
  {
    icon: (
      <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
        <path d="M12 3L2 9l10 6 10-6-10-6z"/>
        <path d="M2 15l10 6 10-6"/>
        <path d="M2 12l10 6 10-6"/>
      </svg>
    ),
    title: "Sermons",
    desc: "Receive living words that unveil the mysteries of the Kingdom, reveal Christ within, awaken divine consciousness, and equip saints to walk in wisdom, dominion, power, and sonship.",
    // cta: "View messages",
    // href: "#sermon",
    accent: "#9333EA",
    gradient: "linear-gradient(135deg, #6B21A8, #9333EA)",
    label: "REVELATION · IMPARTATION",
  },
  {
    icon: (
      <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
        <rect x="2" y="6" width="20" height="14" rx="2.5"/>
        <path d="M10 9.5l5 3-5 3V9.5z" fill="currentColor" stroke="none"/>
        <path d="M8 3h8"/>
      </svg>
    ),
    title: "Live Streams",
    desc: "Connect from anywhere in the world and participate in moments of revelation, prophetic insight, impartation, and divine encounters that transcend geographical boundaries.",
    // cta: "Join the stream",
    // href: "#streams",
    accent: "#F5A800",
    gradient: "linear-gradient(135deg, #C88600, #F5A800)",
    label: "GLOBAL · LIVE GATHERINGS",
  },
  {
    icon: (
      <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
        <path d="M9 22V12h6v10"/>
      </svg>
    ),
    title: "Stores",
    desc: "Access books, teachings, courses, and Kingdom resources designed to deepen spiritual understanding, strengthen your walk with God, and accelerate your growth into maturity and purpose.",
    // cta: "Shop now",
    // href: "#store",
    accent: "#7C3AED",
    gradient: "linear-gradient(135deg, #5B21B6, #7C3AED)",
    label: "BOOKS · RESOURCES",
  },
  {
    icon: (
      <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
      </svg>
    ),
    title: "Events",
    desc: "Join strategic Kingdom gatherings where saints are equipped, activated, transformed, and positioned to manifest God's purposes in their generation through revelation, impartation, and encounter.Step into transformative gatherings, conferences, retreats, and masterclasses where believers are equipped, activated, and immersed in deeper dimensions of God's presence, wisdom, and purpose.",
    // cta: "See upcoming events",
    // href: "#events",
    accent: "#D97706",
    gradient: "linear-gradient(135deg, #B45309, #D97706)",
    label: "CONFERENCES · GATHERINGS",
  },
];

export default function Experience() {
  const [hovered, setHovered] = useState(null);
  const width    = useWidth();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const sidePad  = isMobile ? 20 : isTablet ? 36 : 72;
  const columns  = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(4, 1fr)";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Rajdhani:wght@500;600;700&display=swap');

        .exp-section * { box-sizing: border-box; }

        .exp-card {
          background: #0D0D0D;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: background 0.45s ease, transform 0.35s ease;
          isolation: isolate;
        }
        .exp-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 0%, rgba(245,168,0,0.06) 0%, transparent 65%);
          opacity: 0;
          transition: opacity 0.45s ease;
          z-index: 0;
        }
        .exp-card.is-hovered { background: #111; transform: translateY(-6px); }
        .exp-card.is-hovered::before { opacity: 1; }

        .exp-card-inner { position: relative; z-index: 1; }

        .exp-top-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          transform: scaleX(0); transition: transform 0.5s cubic-bezier(.4,0,.2,1);
          transform-origin: left; border-radius: 0 0 2px 0;
        }
        .exp-card.is-hovered .exp-top-bar { transform: scaleX(1); }

        .exp-icon-wrap {
          width: 60px; height: 60px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          margin-bottom: 24px;
          transition: background 0.35s, border-color 0.35s, transform 0.35s;
          color: rgba(255,255,255,0.45);
        }
        .exp-card.is-hovered .exp-icon-wrap {
          background: rgba(245,168,0,0.1);
          border-color: rgba(245,168,0,0.3);
          color: #F5A800;
          transform: scale(1.08) rotate(-3deg);
        }

        .exp-label {
          font-family: 'Rajdhani', sans-serif;
          font-size: 14px; letter-spacing: 3.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-bottom: 10px;
          transition: color 0.3s;
        }
        .exp-card.is-hovered .exp-label { color: rgba(245,168,0,0.8); }

        .exp-title {
          font-family: 'Cinzel', serif; font-weight: 700;
          color: #fff; margin-bottom: 14px; transition: color 0.3s;
          line-height: 1.2;
        }
        .exp-card.is-hovered .exp-title { color: #F5A800; }

        .exp-divider {
          width: 28px; height: 1px;
          background: rgba(255,255,255,0.12);
          margin-bottom: 16px;
          transition: width 0.4s, background 0.4s;
        }
        .exp-card.is-hovered .exp-divider {
          width: 48px;
          background: rgba(245,168,0,0.5);
        }

        .exp-desc {
          font-family: 'Cormorant Garamond', serif; font-weight: 300;
          color: rgba(255,255,255,0.72); line-height: 1.85; margin-bottom: 28px;
          transition: color 0.3s;
        }
        .exp-card.is-hovered .exp-desc { color: rgba(255,255,255,0.92); }

        .exp-cta {
          font-family: 'Rajdhani', sans-serif; font-size: 11px; letter-spacing: 3px;
          text-transform: uppercase; color: #F5A800; text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          font-weight: 700; transition: gap 0.3s, opacity 0.3s;
          opacity: 0.7;
        }
        .exp-card.is-hovered .exp-cta { gap: 14px; opacity: 1; }

        .exp-cta-arrow {
          display: inline-flex; align-items: center; justify-content: center;
          width: 22px; height: 22px;
          border-radius: 50%;
          border: 1px solid rgba(245,168,0,0.4);
          transition: background 0.3s, border-color 0.3s, transform 0.3s;
          flex-shrink: 0;
        }
        .exp-card.is-hovered .exp-cta-arrow {
          background: rgba(245,168,0,0.15);
          border-color: #F5A800;
          transform: translateX(3px);
        }

        .exp-number {
          position: absolute; bottom: 10px; right: 16px;
          font-family: 'Cinzel', serif; font-size: 80px; font-weight: 900;
          color: rgba(255,255,255,0.025); line-height: 1;
          user-select: none; transition: color 0.4s, transform 0.4s;
          z-index: 0;
        }
        .exp-card.is-hovered .exp-number {
          color: rgba(245,168,0,0.05);
          transform: scale(1.05) translateY(-4px);
        }

        .exp-corner-dot {
          position: absolute; top: 16px; right: 16px;
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(255,255,255,0.08);
          transition: background 0.4s, transform 0.4s;
        }
        .exp-card.is-hovered .exp-corner-dot {
          background: #F5A800;
          transform: scale(1.6);
        }
          @media (max-width: 640px) {
  .exp-label {
    font-size: 14px !important;
  }

  .exp-title {
    font-size: 22px !important;
  }

  .exp-desc {
    font-size: 18px !important;
    line-height: 1.8 !important;
  }

  .exp-cta {
    font-size: 15px !important;
  }
}
      `}</style>

      <section className="exp-section" id="experience" style={{
        background: "linear-gradient(180deg, #080808 0%, #0A0A0A 50%, #080808 100%)",
        padding: `${isMobile ? 64 : isTablet ? 88 : 112}px ${sidePad}px`,
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Ambient background glow */}
        <div style={{
          position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 300,
          background: "radial-gradient(ellipse, rgba(245,168,0,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: isMobile ? 48 : isTablet ? 60 : 80, position: "relative" }}>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 16,
            marginBottom: 20,
            fontFamily: "Rajdhani, sans-serif",
            fontSize: isMobile ? 18 : 18, letterSpacing: 5.5,
            textTransform: "uppercase", color: "#F5A800",
            fontWeight: 600,
          }}>
            <span style={{
              width: 32, height: 1,
              background: "linear-gradient(90deg, transparent, #F5A800)",
              display: "inline-block",
            }} />
            Streams of Encounter
            <span style={{
              width: 32, height: 1,
              background: "linear-gradient(90deg, #F5A800, transparent)",
              display: "inline-block",
            }} />
          </div>

          <h2 style={{
            fontFamily: "Cinzel, serif",
            fontSize: isMobile ? 32 : isTablet ? 42 : 50,
            fontWeight: 700, color: "#fff",
            marginBottom: 18, lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}>
            Discover Your Next {" "}
            <span style={{
              background: "linear-gradient(90deg, #F5A800 0%, #FFD166 60%, #F5A800 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Kingdom Encounter.</span>
          </h2>

          <p style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: isMobile ? 20 : 22,
            fontWeight: 300, fontStyle: "italic",
            color: "rgba(255,255,255,0.65)",
            maxWidth: 520, margin: "0 auto", lineHeight: 1.85,
          }}>
            Whether through revelation, impartation, fellowship, or Kingdom resources, every pathway is designed to bring believers into greater dimensions of Christ, purpose, and sonship."
          </p>

          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, marginTop: 28,
          }}>
            <div style={{ width: 20, height: 1, background: "rgba(245,168,0,0.3)" }} />
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#F5A800" }} />
            <div style={{ width: 40, height: 1, background: "rgba(245,168,0,0.6)" }} />
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#F5A800" }} />
            <div style={{ width: 20, height: 1, background: "rgba(245,168,0,0.3)" }} />
          </div>
        </div>

        {/* ── Cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: columns,
          border: "1px solid rgba(245,168,0,0.1)",
          borderRadius: 4,
          overflow: "hidden",
          gap: 0,
          background: "rgba(245,168,0,0.04)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
          position: "relative",
        }}>
          {experiences.map((exp, i) => (
            <div
              key={i}
              className={`exp-card${hovered === i ? " is-hovered" : ""}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: isMobile ? "32px 22px" : isTablet ? "40px 28px" : "48px 32px",
                borderRight: (!isMobile && !isTablet && i < experiences.length - 1)
                  ? "1px solid rgba(245,168,0,0.08)" : "none",
                borderBottom: (isMobile || isTablet) && i < experiences.length - 1
                  ? "1px solid rgba(245,168,0,0.08)" : "none",
              }}
            >
              <div className="exp-top-bar" style={{ background: exp.gradient }} />
              <div className="exp-corner-dot" />
              <div className="exp-number">0{i + 1}</div>

              <div className="exp-card-inner">
                <div className="exp-icon-wrap">{exp.icon}</div>
                <div className="exp-label">{exp.label}</div>
                <h3 className="exp-title" style={{ fontSize: isMobile ? 22 : 24 }}>{exp.title}</h3>
                <div className="exp-divider" />
                <p
  className="exp-desc"
  style={{ fontSize: isMobile ? 18 : 18 }}
>{exp.desc}</p>
                <a href={exp.href} className="exp-cta">
                  {exp.cta}
                  {/* <span className="exp-cta-arrow">
                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span> */}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom strip ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isMobile ? "center" : "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginTop: isMobile ? 32 : 52,
          paddingTop: isMobile ? 24 : 36,
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}>
          <p style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: isMobile ? 14 : 16, fontStyle: "italic",
            color: "rgba(255,255,255,0.5)",
            margin: 0,
          }}>
            New here? We'd love to help you find your place.
          </p>
          <a href="https://chat.whatsapp.com/FKZqlGXZwXv39iFFqfa9N4" style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: 15, letterSpacing: 3,
            textTransform: "uppercase",
            color: "#0A0A0A",
            textDecoration: "none",
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "#F5A800",
            padding: "12px 22px",
            borderRadius: 3,
            border: "1px solid #F5A800",
            transition: "background 0.25s, color 0.25s, transform 0.2s, box-shadow 0.25s",
            boxShadow: "0 4px 20px rgba(245,168,0,0.25)",
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#F5A800";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(245,168,0,0.35)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#F5A800";
              e.currentTarget.style.color = "#0A0A0A";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(245,168,0,0.25)";
            }}
          >
            CONNECT WITH US
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}