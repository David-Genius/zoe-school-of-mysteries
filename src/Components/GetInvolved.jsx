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

const cards = [
  {
    title: "Volunteer",
    desc: "Participate in the mission to advance the gospel by serving on a volunteer team.",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80",
    href: "#volunteer",
  },
  {
    title: "Lead",
    desc: "Lead an eGroup, host a Watch Party or become a student leader.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
    href: "#lead",
  },
  {
    title: "Jobs",
    desc: "Explore job opportunities to use your gifts in a ministry setting.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    href: "#jobs",
  },
];

export default function GetInvolved() {
  const width = useWidth();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const sidePad  = isMobile ? 20 : isTablet ? 32 : 64;

  return (
    <>
      <style>{`
        .involve-card {
          position: relative;
          overflow: hidden;
          background: #111;
          border-radius: 4px;
          cursor: pointer;
          transition: box-shadow 0.3s;
          text-decoration: none;
          display: block;
        }
        .involve-card:hover {
          box-shadow: 0 20px 60px rgba(0,0,0,0.7);
        }
        .involve-img {
          width: 100%; display: block;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .involve-card:hover .involve-img {
          transform: scale(1.05);
        }
        .involve-img-wrap {
          overflow: hidden;
          position: relative;
        }
        .involve-body {
          padding: 24px 24px 28px;
          background: #111;
        }
        .involve-title {
          font-family: 'Cinzel', serif;
          font-size: 20px; font-weight: 700;
          color: #fff; margin-bottom: 10px;
        }
        .involve-desc {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px; font-weight: 300;
          font-style: italic;
          color: rgba(255,255,255,0.6);
          line-height: 1.7; margin-bottom: 18px;
        }
        .involve-cta {
          font-family: 'Rajdhani', sans-serif;
          font-size: 12px; letter-spacing: 2px;
          text-transform: uppercase; font-weight: 700;
          color: #fff; text-decoration: none;
          display: inline-flex; align-items: center; gap: 6px;
          border-bottom: 1px solid rgba(255,255,255,0.3);
          padding-bottom: 2px;
          transition: color 0.3s, border-color 0.3s, gap 0.3s;
        }
        .involve-cta:hover {
          color: #F5A800;
          border-color: #F5A800;
          gap: 12px;
        }
      `}</style>

      <section id="serve" style={{
        background: "#0a0a0a",
        padding: `${isMobile ? 64 : 100}px ${sidePad}px`,
      }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: isMobile ? 40 : 60 }}>
          <h2 style={{
            fontFamily: "Cinzel, serif",
            fontSize: isMobile ? 28 : isTablet ? 38 : 52,
            fontWeight: 700, color: "#fff",
            lineHeight: 1.1, marginBottom: 16,
          }}>
            How To Get Involved
          </h2>
          <p style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: isMobile ? 16 : 20,
            fontWeight: 300, fontStyle: "italic",
            color: "rgba(255,255,255,0.6)",
            maxWidth: 560, margin: "0 auto",
            lineHeight: 1.7,
          }}>
            See how God can use your gifts to make an eternal impact.
          </p>
        </div>

        {/* ── Cards Grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr",
          gap: isMobile ? 20 : 24,
          marginBottom: isMobile ? 40 : 60,
        }}>
          {cards.map((card, i) => (
            <a key={i} href={card.href} className="involve-card">
              <div className="involve-img-wrap">
                <img
                  src={card.image}
                  alt={card.title}
                  className="involve-img"
                  style={{ height: isMobile ? 220 : isTablet ? 240 : 280 }}
                />
                {/* subtle bottom fade */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: 60,
                  background: "linear-gradient(to bottom, transparent, #111)",
                  pointerEvents: "none",
                }} />
              </div>
              <div className="involve-body">
                <div className="involve-title">{card.title}</div>
                <div className="involve-desc">{card.desc}</div>
                <span className="involve-cta">
                  Learn more
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div style={{ textAlign: "center" }}>
          <a href="#serve" style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: 12, letterSpacing: 3,
            textTransform: "uppercase", fontWeight: 700,
            color: "#000", textDecoration: "none",
            background: "#F5A800",
            padding: "16px 48px", borderRadius: 2,
            display: "inline-block",
            transition: "all 0.3s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#FFD166"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#F5A800"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            See All Opportunities
          </a>
        </div>

      </section>
    </>
  );
}
