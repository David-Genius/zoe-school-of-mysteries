import { useState, useEffect, useRef } from "react";

function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

const sideNavItems = [
  { id: "ab-about",      label: "About"               },
  { id: "ab-who",        label: "Who We Are"           },
  { id: "ab-experience", label: "Kingdom Gatherings"   },
  { id: "ab-leadership", label: "Leadership"           },
  { id: "ab-expect",     label: "What to Expect"       },
  { id: "ab-nextgen",    label: "Missions & Visions"   },
  { id: "ab-young",      label: "Teenagers"            },
  { id: "ab-outreach",   label: "Outreach"             },
];

const leaders = [
  {
    id: "hassan-paul-ololade-melchizedek",
    name: "Hassan Paul Ololade Melchizedek",
    role: "President & Chancellor",
    tag: "Chancellor",
    tagColor: "#F5A800",
    image: "/images/481092341_2063278694174886_2432271458088421622_n.jpg",
    bio: "The visionary founder of Zoe School of Mysteries, carrying an apostolic mandate to unveil Christ, raise saints, and establish Kingdom consciousness across nations.",
    focus: ["Christ revelation", "Apostolic order", "Kingdom consciousness"],
    quote: "The mystery of Christ is not to be studied alone, but embodied."
  },
  {
    id: "sir-nick-graceman",
    name: "Sir Nick GRACEMAN",
    role: "Vice Chancellor",
    tag: "Chancellor",
    tagColor: "#9333EA",
    image: "/images/485604678_2079745252528230_1624281299954468821_n.jpg",
    bio: "A builder of apostolic systems, carrying grace to translate revelation into structure, teaching, and sustainable ministry frameworks.",
    focus: ["Apostolic systems", "Teaching frameworks", "Leadership structure"],
    quote: "Revelation without structure collapses; structure without revelation is empty."
  },
  {
    id: "godwin-t-nwachukwu",
    name: "Godwin T. Nwachukwu",
    role: "Director General",
    tag: "Director General",
    tagColor: "#22c55e",
    image: "/images/Godwin.jpeg",
    bio: "Responsible for operational alignment and execution systems, ensuring that vision is translated into order, accountability, and excellence.",
    focus: ["Operations management", "Kingdom administration", "Execution systems"],
    quote: "What God releases in vision must be sustained by faithful administration."
  },
];

const values = [
  { icon: "✦", title: "The Word",    desc: "We are uncompromisingly committed to the truth of Scripture. Every sermon, every course, every teaching is anchored in the unchanging Word of God." },
  { icon: "🔥", title: "The Spirit", desc: "We believe in the full demonstration of the Holy Spirit — signs, wonders, and the gifts of the Spirit are alive and active in every gathering." },
  { icon: "🌍", title: "The Nations",desc: "Our mandate extends beyond four walls. We are called to every tribe, tongue, and nation — making disciples who make disciples." },
  { icon: "👑", title: "Excellence", desc: "We do everything with the spirit of excellence because we serve a King whose standard is perfection. From worship to service, quality is non-negotiable." },
  { icon: "🤝", title: "Community",  desc: "No one walks alone at Zoe. We are a covenant community — bearing one another's burdens and celebrating one another's victories." },
  { icon: "💡", title: "Innovation", desc: "We harness the power of technology, creativity, and innovation to extend God's Kingdom into every sphere of influence in the 21st century." },
];

export default function AboutPage() {
  const width    = useWidth();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;

  const sidePad  = isMobile ? 20 : isTablet ? 40 : 72;
  const topOffset = isMobile ? 120 : 76;

  const [activeSection, setActiveSection] = useState("ab-about");

  useEffect(() => {
    const handler = () => {
      const sections = sideNavItems.map(n => document.getElementById(n.id));
      let current = "ab-about";
      sections.forEach(sec => {
        if (sec && sec.getBoundingClientRect().top <= 180) current = sec.id;
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Rajdhani:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        /* ─── TOKENS ─── */
        :root {
          --gold:       #F5A800;
          --gold-dim:   #C88600;
          --gold-light: #FFD166;
          --purple:     #9333EA;
          --green:      #22c55e;
          --cyan:       #06b6d4;
          --surface:    rgba(255,255,255,0.025);
          --border:     rgba(255,255,255,0.07);
          --border-gold:rgba(245,168,0,0.3);
          --text-hi:    #fff;
          --text-md:    rgba(255,255,255,0.82);
          --text-lo:    rgba(255,255,255,0.52);
        }

        /* ─── KEYFRAMES ─── */
        @keyframes shimmer  { 0%{background-position:-300% center} 100%{background-position:300% center} }
        @keyframes lineGrow { from{width:0} to{width:56px} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow     { 0%,100%{opacity:0.6} 50%{opacity:1} }

        /* ─── GOLD TEXT ─── */
        .ab-gold {
          background: linear-gradient(120deg, #C88600 0%, #F5A800 35%, #FFD166 55%, #F5A800 75%, #C88600 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 5s linear infinite;
        }

        /* ─── SECTION BASE ─── */
        .ab-section {
          scroll-margin-top: 100px;
          position: relative;
        }

        /* ─── EYEBROW ─── */
        .ab-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 14px;
          font-weight: 600;
        }
        .ab-eyebrow::before {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: var(--gold);
          flex-shrink: 0;
        }

        /* ─── SECTION TITLE ─── */
        .ab-h2 {
          font-family: 'Cinzel', serif;
          font-weight: 700;
          color: var(--text-hi);
          line-height: 1.08;
          letter-spacing: -0.5px;
        }

        /* ─── DIVIDER ─── */
        .ab-divider {
          width: 56px;
          height: 2px;
          background: linear-gradient(90deg, var(--gold), transparent);
          margin-bottom: 36px;
          animation: lineGrow 0.7s ease forwards;
        }

        /* ─── GOLD LINE ACCENT (vertical bar for section) ─── */
        .ab-vline {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, var(--gold), transparent);
          border-radius: 2px;
        }

        /* ─── BODY TEXT ─── */
        .ab-body {
          font-family: 'Cormorant Garamond', serif;
          color: var(--text-md);
          line-height: 1.88;
        }

        /* ─── IMAGE WRAPPER ─── */
        .ab-img-wrap {
          overflow: hidden;
          position: relative;
        }
        .ab-img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform 0.7s ease;
        }
        .ab-img-wrap:hover .ab-img { transform: scale(1.05); }

        /* ─── CARDS ─── */
        .ab-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
          border: 1px solid var(--border);
          border-radius: 16px;
          transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
        }
        .ab-card:hover {
          border-color: var(--border-gold);
          transform: translateY(-5px);
          box-shadow: 0 24px 72px rgba(0,0,0,0.55);
        }

        /* ─── LEADER CARD ─── */
        .ab-leader-card {
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: linear-gradient(165deg, #0e0e0e, #050505);
          transition: border-color 0.35s, transform 0.35s, box-shadow 0.35s;
          display: flex;
          flex-direction: column;
        }
        .ab-leader-card:hover {
          border-color: var(--border-gold);
          transform: translateY(-8px);
          box-shadow: 0 32px 90px rgba(0,0,0,0.7);
        }
        .ab-leader-img { width:100%; height:100%; object-fit:cover; object-position:top center; display:block; transition:transform 0.7s ease; }
        .ab-leader-card:hover .ab-leader-img { transform:scale(1.05); }

        /* ─── EXPERIENCE CARD ─── */
        .ab-exp-card {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: linear-gradient(145deg, #0a0a0a, #060606);
          transition: border-color 0.35s, transform 0.35s, box-shadow 0.35s;
          cursor: pointer;
        }
        .ab-exp-card:hover {
          border-color: var(--border-gold);
          transform: translateY(-6px);
          box-shadow: 0 28px 80px rgba(245,168,0,0.1);
        }

        /* ─── STEP CARD ─── */
        .ab-step-card {
          display: flex;
          gap: 18px;
          align-items: flex-start;
          padding: 22px 20px;
          border-radius: 14px;
          background: linear-gradient(145deg, rgba(255,255,255,0.025), transparent);
          border: 1px solid var(--border);
          transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s, background 0.3s;
          cursor: default;
        }
        .ab-step-card:hover {
          border-color: var(--border-gold);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          background: linear-gradient(145deg, rgba(245,168,0,0.04), transparent);
        }

        /* ─── IMPACT CARD ─── */
        .ab-impact-card {
          display: flex;
          gap: 18px;
          align-items: flex-start;
          padding: 24px 22px;
          border-radius: 14px;
          background: linear-gradient(145deg, rgba(255,255,255,0.025), transparent);
          border: 1px solid var(--border);
          transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
          cursor: default;
        }
        .ab-impact-card:hover {
          border-color: var(--border-gold);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }

        /* ─── MISSION CARD ─── */
        .ab-mission-card {
          padding: 30px 26px;
          border-radius: 16px;
          background: linear-gradient(145deg, rgba(255,255,255,0.025), transparent);
          border: 1px solid var(--border);
          transition: border-color 0.35s, transform 0.35s, box-shadow 0.35s;
          cursor: default;
        }

        /* ─── QUOTE BLOCK ─── */
        .ab-quote {
          margin-top: 20px;
          padding: 22px 24px;
          border-left: 3px solid var(--gold);
          background: rgba(245,168,0,0.05);
          border-radius: 0 10px 10px 0;
        }

        /* ─── CTA BUTTON ─── */
        .ab-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          font-weight: 700;
          color: #000;
          background: linear-gradient(135deg, #F5A800, #FFD166);
          padding: 15px 38px;
          border-radius: 8px;
          text-decoration: none;
          box-shadow: 0 12px 36px rgba(245,168,0,0.35);
          transition: transform 0.3s, box-shadow 0.3s;
          border: none;
          cursor: pointer;
        }
        .ab-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 56px rgba(245,168,0,0.5);
        }

        /* ─── SIDE NAV ─── */
        .ab-sidenav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.5px;
          color: var(--text-lo);
          text-decoration: none;
          padding: 9px 0 9px 18px;
          border-left: 2px solid transparent;
          transition: all 0.2s;
          position: relative;
        }
        .ab-sidenav-link::before {
          content: '';
          width: 4px; height: 4px;
          border-radius: 50%;
          background: currentColor;
          flex-shrink: 0;
          opacity: 0.5;
          transition: opacity 0.2s, background 0.2s;
        }
        .ab-sidenav-link:hover {
          color: rgba(255,255,255,0.85);
          border-left-color: rgba(245,168,0,0.35);
        }
        .ab-sidenav-link:hover::before { opacity: 0.8; }
        .ab-sidenav-link.active {
          color: #fff;
          border-left-color: var(--gold);
          font-weight: 700;
        }
        .ab-sidenav-link.active::before {
          background: var(--gold);
          opacity: 1;
        }

        /* ─── MOBILE PILL NAV ─── */
        .ab-mobile-nav {
          display: none;
        }

        @media (max-width: 639px) {
          .ab-mobile-nav {
            display: flex;
            overflow-x: auto;
            gap: 8px;
            padding: 15px 20px;
            position: sticky;
            top: 135px;
            z-index: 50;
            background: rgba(0,0,0,0.94);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--border);
            scrollbar-width: none;
          }
          .ab-mobile-nav::-webkit-scrollbar { display: none; }
          .ab-mobile-pill {
            white-space: nowrap;
            font-family: 'Rajdhani', sans-serif;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            padding: 7px 16px;
            border-radius: 20px;
            border: 1px solid var(--border);
            color: var(--text-lo);
            background: transparent;
            text-decoration: none;
            transition: all 0.2s;
            flex-shrink: 0;
          }
          .ab-mobile-pill.active {
            background: rgba(245,168,0,0.12);
            border-color: rgba(245,168,0,0.45);
            color: var(--gold);
          }
        }

        /* ─── TAG BADGE ─── */
        .ab-badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 13px;
          border-radius: 20px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        /* ─── STAT BLOCK ─── */
        .ab-stat {
          padding: 22px 20px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--surface);
          text-align: center;
        }

        /* ─── WHO IMAGES ─── */
        .ab-who-top {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--border);
          box-shadow: 0 30px 80px rgba(0,0,0,0.7);
          position: relative;
        }
        .ab-who-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 12px;
        }
        .ab-who-sm {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border);
          box-shadow: 0 16px 48px rgba(0,0,0,0.6);
          position: relative;
        }
        .ab-img-label {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 12px 16px;
          background: linear-gradient(to top, rgba(0,0,0,0.75), transparent);
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 700;
        }

        /* ─── SECTION SEPARATOR ─── */
        .ab-sep {
          border: none;
          border-top: 1px solid var(--border);
        }

        /* ─── HERO SCROLL HINT ─── */
        .ab-scroll-hint {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--text-lo);
          margin-top: 40px;
        }
        .ab-scroll-line {
          width: 40px;
          height: 1px;
          background: var(--border);
        }

        /* ─── RESPONSIVE HELPERS ─── */
        @media (max-width: 639px) {
          .ab-section { scroll-margin-top: 80px; }
          .ab-hide-mobile { display: none !important; }
        }
        @media (min-width: 640px) {
          .ab-hide-tablet-up { display: none !important; }
        }

        /* ─── NUMBER RING ─── */
        .ab-num-ring {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cinzel', serif;
          font-weight: 700;
          font-size: 14px;
          color: var(--gold);
          background: rgba(245,168,0,0.08);
          border: 1px solid rgba(245,168,0,0.28);
          flex-shrink: 0;
        }

        /* ─── ICON BOX ─── */
        .ab-icon-box {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          background: rgba(245,168,0,0.08);
          border: 1px solid rgba(245,168,0,0.22);
          flex-shrink: 0;
          transition: background 0.3s, border-color 0.3s;
        }
        .ab-impact-card:hover .ab-icon-box {
          background: rgba(245,168,0,0.15);
          border-color: rgba(245,168,0,0.4);
        }
      `}</style>

      {/* ─── MOBILE PILL NAV ─── */}
      <nav className="ab-mobile-nav" aria-label="Page sections">
        {sideNavItems.map((item, i) => (
          <a
            key={i}
            href={`#${item.id}`}
            className={`ab-mobile-pill ${activeSection === item.id ? "active" : ""}`}
            onClick={e => {
              e.preventDefault();
              setActiveSection(item.id);
              document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* ─── PAGE WRAPPER ─── */}
      <div style={{ background: "#020202", minHeight: "100vh", paddingTop: topOffset, paddingBottom: isMobile ? 80 : 60 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "1fr 230px" : "1fr",
          maxWidth: 1260,
          margin: "0 auto",
          gap: 0,
        }}>

          {/* ════════════════════════════════════
              MAIN CONTENT COLUMN
          ════════════════════════════════════ */}
          <div style={{ minWidth: 0 }}>

            {/* ══ §1 HERO ══ */}
            <section id="ab-about" className="ab-section" style={{
              padding: `${isMobile ? 56 : 120}px ${sidePad}px ${isMobile ? 60 : 120}px`,
              borderBottom: "1px solid var(--border)",
              background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(245,168,0,0.1), transparent)",
            }}>
              {/* EYEBROW */}
              <div className="ab-eyebrow">Kingdom Training Ecosystem</div>

              {/* HEADLINE */}
              <h1 style={{
                fontFamily: "Cinzel, serif",
                fontWeight: 900,
                fontSize: isMobile ? 42 : isTablet ? 66 : 88,
                lineHeight: 1.03,
                letterSpacing: isMobile ? "-1px" : "-2.5px",
                marginBottom: 28,
                color: "#fff",
              }}>
                <span className="ab-gold">Manifesting</span><br />
                Christ in<br />
                <span style={{
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(255,255,255,0.28)",
                }}>Humanity.</span>
              </h1>

              {/* LEAD */}
              <p className="ab-body" style={{
                fontSize: isMobile ? 21 : 24,
                maxWidth: 700,
                marginBottom: 16,
                fontWeight: 400,
                color: "rgba(255,255,255,0.9)",
              }}>
                Zoe School of Mysteries is a Kingdom training ecosystem committed to raising saints and sons who reveal the life, nature, wisdom, and government of Christ in every sphere of society.
              </p>
              <p className="ab-body" style={{
                fontSize: isMobile ? 18 : 20,
                maxWidth: 660,
                marginBottom: 44,
                fontWeight: 300,
              }}>
                Since its inception, Zoe School of Mysteries has served as a divine training ground for believers seeking maturity, spiritual understanding, and Kingdom expression. Through revelation, transformation, and practical activation, saints are equipped to become living expressions of Christ on the earth.
              </p>

              {/* STAT ROW */}
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
                gap: 12,
                marginBottom: 48,
              }}>
                {[
                  { num: "Global", label: "Reach Across Nations" },
                  { num: "Daily", label: "Online Gatherings" },
                  { num: "Annual", label: "EVOLVE Convergence" },
                  { num: "Zoe", label: "Life of God Imparted" },
                ].map((s, i) => (
                  <div key={i} className="ab-stat">
                    <div style={{
                      fontFamily: "Cinzel, serif",
                      fontWeight: 700,
                      fontSize: isMobile ? 18 : 20,
                      color: "var(--gold)",
                      marginBottom: 6,
                    }}>{s.num}</div>
                    <div style={{
                      fontFamily: "Rajdhani, sans-serif",
                      fontSize: 12,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      color: "var(--text-lo)",
                    }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* HERO IMAGE */}
              <div className="ab-img-wrap" style={{
                borderRadius: isMobile ? 14 : 20,
                height: isMobile ? 230 : 460,
                border: "1px solid var(--border)",
                boxShadow: "0 40px 130px rgba(0,0,0,0.8)",
              }}>
                <img className="ab-img" src="/images/Logo over recolored scene.png" alt="Zoe School of Mysteries" style={{ transform: "scale(1.06)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 55%)" }} />
                <div style={{
                  position: "absolute",
                  bottom: isMobile ? 18 : 28,
                  left: isMobile ? 18 : 28,
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: isMobile ? 18 : 22,
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.8)",
                }}>
                  "As He is, so are we in this world." — 1 John 4:17
                </div>
              </div>
            </section>
```jsx
{/* ══ §2 WHO WE ARE ══ */}
<section
  id="ab-who"
  className="ab-section"
  style={{
    padding: `${isMobile ? 60 : 110}px ${sidePad}px`,
    borderBottom: "1px solid var(--border)",
    background: "linear-gradient(to bottom, #060606, #020202)",
  }}
>
  <div className="ab-eyebrow">Our Identity</div>
  <div className="ab-divider" />

  <h2
    className="ab-h2"
    style={{
      fontSize: isMobile ? 34 : isTablet ? 46 : 56,
      marginBottom: 40,
    }}
  >
    Who We Are
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: isMobile ? 40 : 64,
      alignItems: "start",
    }}
  >
    {/* TEXT */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <p
        className="ab-body"
        style={{
          fontSize: isMobile ? 20 : 22,
          fontWeight: 400,
          color: "rgba(255,255,255,0.9)",
        }}
      >
        Zoe School of Mysteries is a Kingdom institution established to unveil
        Christ in humanity and raise believers into the fullness of sonship.
      </p>

      <p
        className="ab-body"
        style={{
          fontSize: isMobile ? 18 : 20,
          fontWeight: 300,
        }}
      >
        We exist to awaken Kingdom consciousness, reveal the reality of Christ
        within, and equip saints to manifest the life, nature, and government
        of God in every sphere of influence.
      </p>

      <p
        className="ab-body"
        style={{
          fontSize: isMobile ? 18 : 20,
          fontWeight: 300,
        }}
      >
        Established under divine instruction through{" "}
        <span
          style={{
            color: "var(--gold)",
            fontWeight: 600,
          }}
        >
          Apostle Hassan Ololade Melchizedek
        </span>
        , Founder, President, and Chancellor, Zoe School of Mysteries exists as a divine institution dedicated to unveiling Christ in humanity and raising believers into mature sonship."
      </p>

      <p
        className="ab-body"
        style={{
          fontSize: isMobile ? 18 : 20,
          fontWeight: 300,
        }}
      >
        More than a school, Zoe is a movement raising sons, unveiling
        mysteries, and advancing the Kingdom of God through transformed lives.
      </p>

      <div className="ab-quote">
        <p
          className="ab-body"
          style={{
            fontSize: isMobile ? 22 : 26,
            fontStyle: "italic",
            fontWeight: 400,
            color: "#fff",
            lineHeight: 1.6,
            marginBottom: 8,
          }}
        >
          "As He is, so are we in this world."
        </p>

        <div
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: 12,
            letterSpacing: 3,
            color: "var(--gold)",
            textTransform: "uppercase",
          }}
        >
          1 John 4:17
        </div>
      </div>
    </div>

    {/* IMAGE MOSAIC */}
    <div>
      <div
        className="ab-who-top"
        style={{ height: isMobile ? 260 : 340 }}
      >
        <img
          className="ab-img"
          src="/images/Logo on paper note.png"
          alt="The Movement"
          style={{ transform: "scale(1.05)" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6), transparent 55%)",
          }}
        />
        <div className="ab-img-label">The Movement</div>
      </div>

      <div className="ab-who-row">
        <div
          className="ab-who-sm"
          style={{ height: isMobile ? 160 : 220 }}
        >
          <img
            className="ab-img"
            src="/images/Zoe School of Mysteries _ recolored note (1).png"
            alt="Community"
            style={{ transform: "scale(1.05)" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6), transparent 55%)",
            }}
          />
          <div className="ab-img-label">Community</div>
        </div>

        <div
          className="ab-who-sm"
          style={{ height: isMobile ? 160 : 220 }}
        >
          <img
            className="ab-img"
            src="/images/Kingdom Influencers _ recolored _ summarized.png"
            alt="Kingdom"
            style={{ transform: "scale(1.05)" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6), transparent 55%)",
            }}
          />
          <div className="ab-img-label">Kingdom</div>
        </div>
      </div>
    </div>
  </div>
</section>
```


            {/* ══ §3 KINGDOM GATHERINGS ══ */}
            <section id="ab-experience" className="ab-section" style={{
              padding: `${isMobile ? 60 : 110}px ${sidePad}px`,
              borderBottom: "1px solid var(--border)",
              background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(245,168,0,0.05), transparent), linear-gradient(to bottom, #060606, #020202)",
            }}>
              <div className="ab-eyebrow">How We Gather</div>
              <div className="ab-divider" />
              <h2 className="ab-h2" style={{ fontSize: isMobile ? 34 : 56, marginBottom: 14 }}>Kingdom Gatherings</h2>
              <p className="ab-body" style={{ fontSize: isMobile ? 19 : 21, fontWeight: 300, maxWidth: 620, marginBottom: 44 }}>
                We are not bound by walls or locations. Zoe School of Mysteries is a global spiritual ecosystem — a people connected by Spirit, not geography.
              </p>

              {/* BANNER IMAGE */}
              <div className="ab-img-wrap" style={{
                borderRadius: isMobile ? 14 : 18,
                height: isMobile ? 210 : 420,
                marginBottom: 36,
                border: "1px solid var(--border)",
                boxShadow: "0 30px 100px rgba(0,0,0,0.75)",
              }}>
                <img className="ab-img" src="/images/Logo placed at top.png" alt="Zoe gathering" style={{ transform: "scale(1.05)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)" }} />
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: isMobile ? 14 : 20,
              }}>
                {[
                  { title: "Streams of Immortality", subtitle: "Daily Online Gathering", desc: "Our daily online flow of teachings, prophetic insights, and spiritual formation released across the global body in real time.", img: "/images/Streams Of Immortality poster.png", tag: "Daily Flow", tagColor: "var(--gold)" },
                  { title: "Live Prophetic Meetings", subtitle: "Spirit-Led Encounters", desc: "Divine convergence moments of worship, prophecy, healing, and deep teaching beyond routine schedules.", img: "/images/Expanded.png", tag: "Encounter", tagColor: "var(--purple)" },
                  { title: "Evolve Annual Convergence", subtitle: "Yearly Physical Gathering", desc: "A yearly physical gathering for impartation, alignment, and acceleration into Kingdom assignment.", img: "/images/photo_2026-06-11_14-39-41.jpg", tag: "Annual", tagColor: "var(--green)" },
                  { title: "Global Watch & Fellowship", subtitle: "Fellowship Circles Across Nations", desc: "Small online fellowship circles across nations for consistent growth, prayer, and accountability.", img: "https://i.pinimg.com/736x/a6/d1/54/a6d154515d4599844a70c1ad7e46ffbe.jpg", tag: "Community", tagColor: "var(--cyan)" },
                ].map((exp, i) => (
                  <div key={i} className="ab-exp-card">
                    <div className="ab-img-wrap" style={{ height: isMobile ? 200 : 260 }}>
                      <img className="ab-img" src={exp.img} alt={exp.title} style={{ transform: "scale(1.06)" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 55%)" }} />
                      {/* Tag overlaid on image */}
                      <div style={{ position: "absolute", top: 16, left: 16 }}>
                        <span className="ab-badge" style={{ background: exp.tagColor + "22", color: exp.tagColor, border: `1px solid ${exp.tagColor}44` }}>
                          {exp.tag}
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: isMobile ? "20px 20px 24px" : "24px 24px 30px" }}>
                      <div style={{ fontFamily: "Cinzel, serif", fontSize: isMobile ? 17 : 18, fontWeight: 700, color: "#fff", marginBottom: 6, lineHeight: 1.3 }}>{exp.title}</div>
                      <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 12, letterSpacing: 2, color: exp.tagColor, textTransform: "uppercase", marginBottom: 12 }}>{exp.subtitle}</div>
                      <p className="ab-body" style={{ fontSize: isMobile ? 17 : 18, fontWeight: 300 }}>{exp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ══ §4 LEADERSHIP ══ */}
            <section id="ab-leadership" className="ab-section" style={{
              padding: `${isMobile ? 60 : 110}px ${sidePad}px`,
              borderBottom: "1px solid var(--border)",
              background: "linear-gradient(to bottom, #060606, #020202)",
            }}>
              <div className="ab-eyebrow">Leadership & Oversight</div>
              <div className="ab-divider" />
              <h2 className="ab-h2" style={{ fontSize: isMobile ? 34 : 56, marginBottom: 14 }}>Leadership</h2>
              <p className="ab-body" style={{ fontSize: isMobile ? 19 : 21, fontWeight: 300, maxWidth: 560, marginBottom: 48 }}>
                The leadership team provides spiritual, administrative, and strategic oversight for the vision and mission of Zoe School of Mysteries.
              </p>

              {/* LEADER GRID */}
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)",
                gap: isMobile ? 20 : 24,
                alignItems: "stretch",
              }}>
                {leaders.map((l, i) => (
                  <div key={i} className="ab-leader-card">
                    {/* IMAGE */}
                    <div style={{ position: "relative", overflow: "hidden", height: isMobile ? 360 : 420, flexShrink: 0 }}>
                      <img className="ab-leader-img" src={l.image} alt={l.name} style={{ filter: "contrast(1.04) brightness(0.9)" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }} />
                      {/* Name / role overlay */}
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 22px 18px" }}>
                        <span className="ab-badge" style={{ background: l.tagColor + "20", color: l.tagColor, border: `1px solid ${l.tagColor}30`, backdropFilter: "blur(8px)", marginBottom: 10, display: "inline-flex" }}>
                          {l.tag}
                        </span>
                        <div style={{ fontFamily: "Cinzel, serif", fontSize: isMobile ? 16 : 17, fontWeight: 700, color: "#fff", lineHeight: 1.25, marginTop: 8, marginBottom: 4, textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>{l.name}</div>
                        <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 12, letterSpacing: 2, color: l.tagColor, textTransform: "uppercase", fontWeight: 700 }}>{l.role}</div>
                      </div>
                    </div>
                    {/* BODY */}
                    <div style={{ padding: "22px 22px 26px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <p className="ab-body" style={{ fontSize: 17, fontWeight: 300, fontStyle: "italic", lineHeight: 1.75, marginBottom: 18 }}>{l.bio}</p>
                      <div style={{ marginTop: "auto", paddingTop: 16, borderTop: `1px solid ${l.tagColor}18` }}>
                        <p className="ab-body" style={{ fontSize: 17, fontStyle: "italic", color: l.tagColor, lineHeight: 1.6, opacity: 0.9 }}>"{l.quote}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ══ §5 WHAT TO EXPECT ══ */}
            <section id="ab-expect" className="ab-section" style={{
              padding: `${isMobile ? 60 : 120}px ${sidePad}px`,
              borderBottom: "1px solid var(--border)",
              background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(245,168,0,0.05), transparent), linear-gradient(to bottom, #060606, #020202)",
            }}>
              <div className="ab-eyebrow">Your First Encounter</div>
              <div className="ab-divider" />

              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr",
                gap: isMobile ? 44 : 80,
                alignItems: "center",
              }}>
                {/* LEFT */}
                <div>
                  <h2 className="ab-h2" style={{ fontSize: isMobile ? 34 : 52, marginBottom: 18 }}>What to Expect</h2>
                  <p className="ab-body" style={{ fontSize: isMobile ? 19 : 21, fontWeight: 300, marginBottom: 40, maxWidth: 580 }}>
                    Zoe School of Mysteries is not a place you attend — it is a realm you align with. A Kingdom learning environment where individuals are equipped, transformed, and empowered to express divine life.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { num: "01", title: "Digital Encounter & Welcome", desc: "You are received into a living online family and immediately drawn into teachings, prayer flows, and prophetic formation." },
                      { num: "02", title: "Atmospheric Online Gatherings", desc: "Spirit-led online encounters that shift atmospheres through worship, teaching, and prophetic flow." },
                      { num: "03", title: "Formation of the Inner Life", desc: "You are transformed into the life of Christ (Zoe), carrying divine reality into your environment." },
                      { num: "04", title: "Living as a Mobile Altar", desc: "You become a walking altar — every space you enter becomes a place of manifestation." },
                      { num: "05", title: "Online Family & EVOLVE Convergence", desc: "A global family connected online, with annual physical convergence for alignment and commissioning." },
                    ].map((item, i) => (
                      <div key={i} className="ab-step-card">
                        <div className="ab-num-ring">{item.num}</div>
                        <div>
                          <div style={{ fontFamily: "Cinzel, serif", fontSize: isMobile ? 15 : 16, fontWeight: 700, color: "#fff", marginBottom: 6, letterSpacing: 0.3 }}>{item.title}</div>
                          <p className="ab-body" style={{ fontSize: isMobile ? 16 : 17, fontWeight: 300, lineHeight: 1.75 }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT — images */}
                {!isMobile && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div className="ab-img-wrap" style={{ borderRadius: 16, height: 380, border: "1px solid var(--border)", boxShadow: "0 30px 90px rgba(0,0,0,0.75)" }}>
                      <img className="ab-img" src="/images/The Blockchain Revolution_ How This Technology is Shaping Tomorrow_.jpg" alt="Global online gathering" style={{ transform: "scale(1.06)" }} />
                    </div>
                    <div className="ab-img-wrap" style={{ borderRadius: 16, height: 240, border: "1px solid var(--border)", boxShadow: "0 30px 90px rgba(0,0,0,0.75)" }}>
                      <img className="ab-img" src="/images/School of Mysteries Manifestation.png" alt="Community in Spirit" style={{ transform: "scale(1.06)" }} />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* ══ §6 MISSIONS & VISIONS ══ */}
            <section id="ab-nextgen" className="ab-section" style={{
              padding: `${isMobile ? 60 : 110}px ${sidePad}px`,
              borderBottom: "1px solid var(--border)",
              background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(245,168,0,0.07), transparent), linear-gradient(to bottom, #060606, #020202)",
            }}>
              <div className="ab-eyebrow">Mission & Vision</div>
              <div className="ab-divider" />
              <h2 className="ab-h2" style={{ fontSize: isMobile ? 34 : 56, marginBottom: 16 }}>Kingdom Mandate</h2>
              <p className="ab-body" style={{ fontSize: isMobile ? 19 : 21, fontWeight: 300, maxWidth: 660, marginBottom: 44 }}>
                Zoe School of Mysteries exists as a divine training ground for the revelation of Christ in man. Our mission is to awaken believers into the reality of Zoe — the life of God — and our vision is a global company of saints and sons manifesting Kingdom reality across every sphere of life.
              </p>

              {/* BANNER */}
              <div className="ab-img-wrap" style={{
                borderRadius: isMobile ? 14 : 18,
                height: isMobile ? 200 : 380,
                marginBottom: 40,
                border: "1px solid var(--border)",
                boxShadow: "0 30px 100px rgba(0,0,0,0.75)",
              }}>
                <img className="ab-img" src="/images/Cream-toned banner.png" alt="Kingdom vision" style={{ transform: "scale(1.05)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent 60%)" }} />
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: isMobile ? 14 : 18,
              }}>
                {[
                  { title: "Zoe Awakening",         desc: "To bring believers into experiential knowledge of the life of God, shifting them into divine consciousness and encounter.", color: "var(--gold)" },
                  { title: "Global Discipleship",   desc: "To raise a decentralized but unified global family through online gatherings, prophetic impartation, and Spirit-led formation.", color: "var(--purple)" },
                  { title: "Kingdom Manifestation", desc: "To equip saints to carry the presence of God into education, business, governance, media, and culture.", color: "var(--green)" },
                ].map((g, i) => (
                  <div key={i} className="ab-mission-card"
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.borderColor = g.color + "40";
                      e.currentTarget.style.boxShadow = "0 24px 72px rgba(0,0,0,0.6)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <div style={{ height: 3, width: 44, background: g.color, marginBottom: 18, borderRadius: 2, boxShadow: `0 0 16px ${g.color}60` }} />
                    <div style={{ fontFamily: "Cinzel, serif", fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 14, letterSpacing: 0.5, textTransform: "uppercase" }}>{g.title}</div>
                    <p className="ab-body" style={{ fontSize: 17, fontWeight: 300, lineHeight: 1.8 }}>{g.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ══ §7 TEENAGERS ══ */}
            <section id="ab-young" className="ab-section" style={{
              padding: `${isMobile ? 60 : 110}px ${sidePad}px`,
              borderBottom: "1px solid var(--border)",
              background: "linear-gradient(to bottom, #060606, #020202)",
            }}>
              <div className="ab-eyebrow">Ages 12 – 18</div>
              <div className="ab-divider" />

              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: isMobile ? 36 : 80,
                alignItems: "center",
              }}>
                {/* IMAGE */}
                <div
                  className="ab-img-wrap"
                  style={{
                    borderRadius: isMobile ? 14 : 16,
                    height: isMobile ? 300 : 600,
                    border: "1px solid var(--border)",
                    boxShadow: "0 28px 90px rgba(0,0,0,0.65)",
                    order: isMobile ? 2 : 1,
                  }}
                >
                  <img className="ab-img" src="/images/teen.jpg" alt="Zoe Teens" style={{ objectPosition: "center top", transform: "scale(1.03)" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent 60%)" }} />
                  <div className="ab-img-label">Zoe Teens</div>
                </div>

                {/* TEXT */}
                <div style={{ order: isMobile ? 1 : 2 }}>
                  <h2 className="ab-h2" style={{ fontSize: isMobile ? 36 : 52, marginBottom: 18 }}>Zoe Teens</h2>
                  <p className="ab-body" style={{ fontSize: isMobile ? 19 : 21, fontWeight: 400, color: "rgba(255,255,255,0.9)", marginBottom: 16, maxWidth: 520 }}>
                    Zoe Teens is a transformational community for teenagers ages 12–18 who are discovering purpose, building confidence, and growing into who they were created to be.
                  </p>
                  <p className="ab-body" style={{ fontSize: isMobile ? 18 : 20, fontWeight: 300, marginBottom: 16, maxWidth: 520 }}>
                    Through mentorship, creative development, real friendships, and life skills training, we help young people grow in wisdom, discipline, emotional intelligence, creativity, and identity.
                  </p>
                  <p className="ab-body" style={{ fontSize: isMobile ? 18 : 20, fontWeight: 300, marginBottom: 36, maxWidth: 520 }}>
                    "Every Saturday at 5:00 PM, teenagers gather both online and in-person for mentorship, personal development, and transformational learning experiences." 
                  </p>

                  {/* DETAIL PILLS */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 36 }}>
                    {["Ages 12–18", "Every Saturday", "5 PM", "Online & Physical"].map((tag, i) => (
                      <span key={i} className="ab-badge" style={{ background: "rgba(245,168,0,0.1)", color: "var(--gold)", border: "1px solid rgba(245,168,0,0.25)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a href="https://t.me/+jjxA3Z9QSUllZDQ0" target="_blank" rel="noopener noreferrer" className="ab-cta">
                    Join Zoe Teens →
                  </a>
                </div>
              </div>
            </section>

            {/* ══ §8 OUTREACH ══ */}
            <section id="ab-outreach" className="ab-section" style={{
              padding: `${isMobile ? 60 : 120}px ${sidePad}px`,
              background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(245,168,0,0.05), transparent), linear-gradient(to bottom, #060606, #020202)",
            }}>
              <div className="ab-eyebrow">Kingdom Impact</div>
              <div className="ab-divider" />
              <h2 className="ab-h2" style={{ fontSize: isMobile ? 34 : 56, marginBottom: 16 }}>Expression of the Kingdom</h2>
              <p className="ab-body" style={{ fontSize: isMobile ? 19 : 21, fontWeight: 300, maxWidth: 680, marginBottom: 44 }}>
                In Zoe School of Mysteries, outreach is not a program — it is the overflow of a people who carry the life of God. Every participant is equipped to become an agent of transformation, bringing wisdom, excellence, and Kingdom values into society.
              </p>

              {/* BANNER */}
              <div className="ab-img-wrap" style={{
                borderRadius: isMobile ? 14 : 18,
                height: isMobile ? 200 : 420,
                marginBottom: 48,
                border: "1px solid var(--border)",
                boxShadow: "0 30px 100px rgba(0,0,0,0.8)",
              }}>
                <img className="ab-img" src="/images/web.png" alt="Kingdom impact" style={{ transform: "scale(1.05)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%)" }} />
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                gap: isMobile ? 12 : 18,
              }}>
                {[
                  { title: "Kingdom Presence in Society",   desc: "Believers carry God's presence into workplaces, schools, government, and business — transforming environments from within.", icon: "🌍" },
                  { title: "Digital Evangelism & Influence", desc: "Through online platforms, believers shape culture with truth, revelation, and prophetic insight across nations.", icon: "📡" },
                  { title: "Compassion as Expression",      desc: "Love becomes action — restoration, support, and care flow naturally as the expression of Christ through His people.", icon: "🤲" },
                  { title: "City Transformation Mandate",   desc: "We train believers to influence systems — education, governance, arts, and economy — with Kingdom intelligence.", icon: "🏙" },
                ].map((o, i) => (
                  <div key={i} className="ab-impact-card">
                    <div className="ab-icon-box">{o.icon}</div>
                    <div>
                      <div style={{ fontFamily: "Cinzel, serif", fontSize: isMobile ? 16 : 17, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{o.title}</div>
                      <p className="ab-body" style={{ fontSize: isMobile ? 16 : 17, fontWeight: 300, lineHeight: 1.8 }}>{o.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* BOTTOM CTA */}
              <div style={{
                marginTop: 60,
                padding: isMobile ? "36px 24px" : "52px 56px",
                borderRadius: 20,
                border: "1px solid var(--border-gold)",
                background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(245,168,0,0.07), transparent)",
                textAlign: "center",
              }}>
                <div className="ab-eyebrow" style={{ justifyContent: "center" }}>Ready to Begin?</div>
                <h3 style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: isMobile ? 28 : 40,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 16,
                  lineHeight: 1.15,
                }}>
                  Step Into the <span className="ab-gold">Mystery</span>
                </h3>
                <p className="ab-body" style={{ fontSize: isMobile ? 18 : 20, fontWeight: 300, maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.85 }}>
                  Join a global community awakening to the life of God, manifesting Kingdom reality in every sphere.
                </p>
                <a href="https://t.me/+KtrkQ-ACzkNlNTFk" target="_blank" rel="noopener noreferrer" className="ab-cta">
                  Join the Community →
                </a>
              </div>
            </section>

          </div>{/* end main content */}

          {/* ════════════════════════════════════
              STICKY SIDE NAV — desktop only
          ════════════════════════════════════ */}
          {isDesktop && (
            <div style={{
              borderLeft: "1px solid var(--border)",
              paddingLeft: 28,
              paddingRight: 20,
              paddingTop: 80,
            }}>
              <div style={{ position: "sticky", top: 110 }}>
                <div style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: 10,
                  letterSpacing: 5,
                  textTransform: "uppercase",
                  color: "var(--text-lo)",
                  marginBottom: 20,
                  paddingLeft: 18,
                }}>Contents</div>
                {sideNavItems.map((item, i) => (
                  <a
                    key={i}
                    href={`#${item.id}`}
                    className={`ab-sidenav-link ${activeSection === item.id ? "active" : ""}`}
                    onClick={e => {
                      e.preventDefault();
                      setActiveSection(item.id);
                      document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {item.label}
                  </a>
                ))}

                {/* SMALL CTA in sidebar */}
                <div style={{
                  marginTop: 36,
                  padding: "18px 16px",
                  borderRadius: 12,
                  border: "1px solid rgba(245,168,0,0.2)",
                  background: "rgba(245,168,0,0.04)",
                }}>
                  <div style={{ fontFamily: "Cinzel, serif", fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>
                    Join the Community
                  </div>
                  <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 15, color: "var(--text-lo)", lineHeight: 1.65, marginBottom: 14 }}>
                    Step into the mystery of Christ.
                  </p>
                  <a href="https://t.me/+KtrkQ-ACzkNlNTFk" target="_blank" rel="noopener noreferrer" style={{
                    display: "block",
                    fontFamily: "Rajdhani, sans-serif",
                    fontSize: 11,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "var(--gold)",
                    textDecoration: "none",
                    textAlign: "center",
                    padding: "10px",
                    border: "1px solid rgba(245,168,0,0.35)",
                    borderRadius: 8,
                    transition: "background 0.2s, color 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,168,0,0.12)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >
                    Connect →
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}