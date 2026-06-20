import { useState, useEffect } from "react";

function useWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

const ministries = [
  {
    tag: "eGroup Ministry",
    title: "Connecting people.\nActivating faith.",
    color: "#0d1f3c",
    accent: "#3b82f6",
    wm: "eG",
    spanTwo: true,
    href: "#egroup",
  },
  {
    tag: "Outreach Ministry",
    title: "Making an impact\nlocally and globally.",
    color: "#0a2e0a",
    accent: "#22c55e",
    wm: "OM",
    spanTwo: false,
    href: "#outreach",
  },
  {
    tag: "Children's Ministry",
    title: "Partnering with parents\nto develop kids' faith.",
    color: "#003a3a",
    accent: "#06b6d4",
    wm: "CM",
    spanTwo: false,
    href: "#children",
  },
  {
    tag: "Youth Ministry",
    title: "Developing youth who\ninfluence culture.",
    color: "#111111",
    accent: "#F5A800",
    wm: "YM",
    spanTwo: false,
    href: "#youth",
  },
  {
    tag: "Young Adult Ministry",
    title: "Building community.\nDeepening faith.",
    color: "#2a0a00",
    accent: "#f97316",
    wm: "YA",
    spanTwo: false,
    href: "#youngadult",
  },
];

function MinistryCard({ m, isMobile, onNavigate }) {
  return (
    <a
      href={m.href}
      style={{
        position: "relative",
        overflow: "hidden",
        background: m.color,
        minHeight: isMobile ? 180 : 240,
        padding: isMobile ? "24px 20px 20px" : "40px 36px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        cursor: "pointer",
        textDecoration: "none",
        transition: "filter 0.3s, transform 0.3s",
        gridColumn: m.spanTwo && !isMobile ? "span 2" : "span 1",
      }}
      onClick={e => { e.preventDefault(); onNavigate?.("ministries", m.id); }}
      onMouseEnter={e => {
        e.currentTarget.style.filter = "brightness(1.15)";
        e.currentTarget.style.transform = "scale(1.015)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.filter = "brightness(1)";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {/* Watermark */}
      <div style={{
        position: "absolute", top: 10, right: 16,
        fontFamily: "Cinzel, serif",
        fontSize: isMobile ? 60 : 90,
        fontWeight: 900,
        color: "rgba(255,255,255,0.04)",
        lineHeight: 1,
        userSelect: "none",
        pointerEvents: "none",
      }}>{m.wm}</div>

      {/* Shine overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      {/* Accent bar */}
      <div style={{
        width: 32, height: 2,
        background: m.accent,
        borderRadius: 1,
        marginBottom: isMobile ? 10 : 14,
      }} />

      {/* Tag */}
      <div style={{
        fontFamily: "Rajdhani, sans-serif",
        fontSize: 10, letterSpacing: 3,
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.4)",
        marginBottom: 8, fontWeight: 600,
      }}>{m.tag}</div>

      {/* Title */}
      <div style={{
        fontFamily: "Cinzel, serif",
        fontSize: isMobile ? 16 : m.spanTwo ? 26 : 20,
        fontWeight: 700,
        lineHeight: 1.35,
        color: "#fff",
        marginBottom: isMobile ? 14 : 20,
        whiteSpace: "pre-line",
      }}>{m.title}</div>

      {/* CTA */}
      <div style={{
        fontFamily: "Rajdhani, sans-serif",
        fontSize: 11, letterSpacing: 2,
        textTransform: "uppercase", fontWeight: 700,
        color: m.accent,
        display: "inline-flex", alignItems: "center", gap: 8,
      }}>
        Learn more
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </a>
  );
}

export default function MinistryCards({ onNavigate }) {
  const width = useWidth();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  // grid columns
  const columns = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr";

  return (
    <>
      <style>{`
        #groups a:hover .accent-bar { width: 52px !important; }
      `}</style>

      <section id="groups" style={{
        background: "#000",
        padding: `${isMobile ? 60 : 96}px ${isMobile ? 20 : isTablet ? 32 : 64}px`,
      }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: isMobile ? 32 : 52 }}>
          {/* Eyebrow */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            marginBottom: 16,
            fontFamily: "Rajdhani, sans-serif",
            fontSize: 11, letterSpacing: 5,
            textTransform: "uppercase", color: "#F5A800",
          }}>
            <span style={{ width: 28, height: 1, background: "#F5A800", display: "inline-block" }} />
            Our Community
          </div>

          <div style={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "flex-end",
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
            gap: 20,
          }}>
            <div>
              <h2 style={{
                fontFamily: "Cinzel, serif",
                fontSize: isMobile ? 24 : isTablet ? 32 : 44,
                fontWeight: 700, lineHeight: 1.15,
                color: "#fff", marginBottom: 12,
              }}>
                A place for you<br />and your family.
              </h2>
              <p style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: isMobile ? 15 : 18,
                fontWeight: 300, fontStyle: "italic",
                color: "rgba(255,255,255,0.5)",
                maxWidth: 500, lineHeight: 1.7,
              }}>
                Join small groups, get involved in outreach, and discover
                ways for your whole family to grow in their faith.
              </p>
            </div>

            <a href="#groups"
              onClick={e => { e.preventDefault(); onNavigate?.("ministries", "all"); }}
              style={{
                fontFamily: "Rajdhani, sans-serif",
                fontSize: 11, letterSpacing: 3,
                textTransform: "uppercase", fontWeight: 700,
                color: "#fff", textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "11px 28px", borderRadius: 2,
                transition: "all 0.3s", whiteSpace: "nowrap",
                flexShrink: 0, display: "inline-block",
                cursor: "pointer",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#F5A800"; e.currentTarget.style.color = "#F5A800"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff"; }}
            >
              View All
            </a>
          </div>
        </div>

        {/* ── Ministry Grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: columns,
          gap: 3,
        }}>
          {ministries.map((m, i) => (
            <MinistryCard key={i} m={m} isMobile={isMobile} onNavigate={onNavigate} />
          ))}
        </div>

      </section>
    </>
  );
}
