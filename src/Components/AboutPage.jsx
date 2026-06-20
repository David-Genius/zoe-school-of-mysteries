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
  { id: "ab-who",        label: "Who we are"           },
  { id: "ab-experience", label: "Church experiences"   },
  { id: "ab-leadership", label: "Leadership"           },
  { id: "ab-expect",     label: "What to expect"       },
  { id: "ab-nextgen",    label: "Missions and Visions" },
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
  const sidePad  = isMobile ? 18 : isTablet ? 32 : 64;
  const topOffset = isMobile ? 130 : 76;

  const [activeSection, setActiveSection] = useState("ab-about");

  useEffect(() => {
    const handler = () => {
      const sections = sideNavItems.map(n => document.getElementById(n.id));
      let current = "ab-about";
      sections.forEach(sec => {
        if (sec && sec.getBoundingClientRect().top <= 160) current = sec.id;
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Rajdhani:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        @keyframes ab-fadeUp   { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ab-fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes ab-shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes ab-scaleIn  { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        @keyframes ab-lineGrow { from{width:0} to{width:60px} }
        @keyframes ab-pulse    { 0%,100%{opacity:1} 50%{opacity:0.6} }

        .ab-gold {
          background: linear-gradient(135deg, #C88600 0%, #F5A800 40%, #FFD166 60%, #F5A800 80%, #C88600 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: ab-shimmer 4s linear infinite;
        }

        .ab-sidenav-link {
          display: block;
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px; font-weight: 500; letter-spacing: 0.3px;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          padding: 9px 0 9px 20px;
          border-left: 2px solid transparent;
          margin-bottom: 2px;
          transition: all 0.25s;
        }
        .ab-sidenav-link:hover { color: rgba(255,255,255,0.85); border-left-color: rgba(245,168,0,0.4); }
        .ab-sidenav-link.active { color: #fff; border-left-color: #F5A800; font-weight: 700; }

        .ab-img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform 0.6s ease;
        }
        .ab-img-wrap { overflow: hidden; position: relative; }
        .ab-img-wrap:hover .ab-img { transform: scale(1.04); }

        .ab-value-card {
          padding: 28px 24px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          transition: all 0.35s;
          cursor: default;
        }
        .ab-value-card:hover {
          border-color: rgba(245,168,0,0.35);
          background: rgba(245,168,0,0.05);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }

        .ab-leader-card {
          background: linear-gradient(145deg, #0d0d0d, #060606);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.35s;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .ab-leader-card:hover {
          border-color: rgba(245,168,0,0.3);
          transform: translateY(-6px);
          box-shadow: 0 24px 70px rgba(0,0,0,0.6);
        }
        .ab-leader-img-wrap {
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .ab-leader-img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
          transition: transform 0.6s ease;
        }
        .ab-leader-card:hover .ab-leader-img { transform: scale(1.04); }
        .ab-leader-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
        }
        .ab-leader-body {
          padding: 18px 18px 22px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .ab-section { scroll-margin-top: 120px; }

        .ab-divider {
          width: 60px; height: 2px;
          background: linear-gradient(90deg, #F5A800, transparent);
          margin-bottom: 32px;
          animation: ab-lineGrow 0.8s ease forwards;
        }

        .ab-eyebrow {
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px; letter-spacing: 5px;
          text-transform: uppercase; color: #F5A800;
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .ab-eyebrow-line { width: 24px; height: 1px; background: #F5A800; display: inline-block; flex-shrink:0; }

        .ab-step-card {
          display: flex;
          gap: 16px;
          padding: 16px;
          border-radius: 14px;
          background: linear-gradient(145deg, #0a0a0a, #050505);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.35s ease;
          cursor: default;
        }
        .ab-step-card:hover {
          transform: translateY(-4px);
          border-color: rgba(245,168,0,0.3);
          box-shadow: 0 20px 60px rgba(245,168,0,0.08);
          background: linear-gradient(145deg, rgba(245,168,0,0.05), #050505);
        }

        .ab-exp-card {
          background: linear-gradient(145deg, #0a0a0a, #050505);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.35s ease;
          cursor: pointer;
        }
        .ab-exp-card:hover {
          transform: translateY(-6px);
          border-color: rgba(245,168,0,0.3);
          box-shadow: 0 24px 70px rgba(245,168,0,0.08);
        }

        .ab-impact-card {
          display: flex; gap: 16px;
          padding: 20px 18px; border-radius: 14px;
          background: linear-gradient(145deg, #0a0a0a, #050505);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.35s ease; cursor: default;
        }
        .ab-impact-card:hover {
          transform: translateY(-4px);
          border-color: rgba(245,168,0,0.3);
          box-shadow: 0 25px 80px rgba(0,0,0,0.6);
          background: linear-gradient(145deg, rgba(245,168,0,0.04), #050505);
        }

        .ab-mission-card {
          padding: 24px 20px; border-radius: 14px;
          background: linear-gradient(145deg, #0a0a0a, #050505);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.35s ease; cursor: default;
        }

        .ab-cta-btn {
          display: inline-block;
          font-family: 'Rajdhani', sans-serif;
          font-size: 12px; letter-spacing: 2px;
          text-transform: uppercase; font-weight: 700;
          color: #000;
          background: linear-gradient(135deg, #F5A800, #ffcc33);
          padding: 14px 34px; border-radius: 8px;
          text-decoration: none;
          box-shadow: 0 15px 40px rgba(245,168,0,0.3);
          transition: all 0.3s ease;
        }
        .ab-cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 22px 60px rgba(245,168,0,0.45);
        }

        /* WHO WE ARE — mobile image mosaic */
        .ab-who-images {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .ab-who-img-top {
          border-radius: 14px;
          height: 300px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 25px 70px rgba(0,0,0,0.7);
        }
        .ab-who-img-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .ab-who-img-sm {
          border-radius: 12px;
          height: 240px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 15px 50px rgba(0,0,0,0.6);
          overflow: hidden;
          position: relative;
        }
        /* On mobile: full-width images stacked for max impact */
        @media (max-width: 639px) {
          .ab-who-images {
            gap: 10px;
            margin-top: 8px;
          }
          .ab-who-img-top {
            height: 260px;
            border-radius: 12px;
          }
          .ab-who-img-sm {
            height: 170px;
            border-radius: 10px;
          }
          /* Gold shimmer accent label on mobile images */
          .ab-who-img-label {
            display: flex !important;
          }
        }

        /* Image label overlay — hidden on desktop, visible on mobile */
        .ab-who-img-label {
          display: none;
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 10px 14px;
          background: linear-gradient(to top, rgba(0,0,0,0.75), transparent);
          font-family: 'Rajdhani', sans-serif;
          font-size: 10px; letter-spacing: 2px;
          text-transform: uppercase; color: #F5A800;
          font-weight: 700;
        }

        /* MOBILE-ONLY SECTION NAV PILLS */
        .ab-mobile-nav {
          display: none;
        }
        @media (max-width: 639px) {
          .ab-mobile-nav {
            display: flex;
            overflow-x: auto;
            gap: 8px;
            padding: 12px 18px;
            position: sticky;
            top: 130px;
            z-index: 50;
            background: rgba(0,0,0,0.92);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255,255,255,0.06);
            scrollbar-width: none;
          }
          .ab-mobile-nav::-webkit-scrollbar { display: none; }
          .ab-mobile-pill {
            white-space: nowrap;
            font-family: 'Rajdhani', sans-serif;
            font-size: 11px; font-weight: 600;
            letter-spacing: 1.5px; text-transform: uppercase;
            padding: 6px 14px; border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.12);
            color: rgba(255,255,255,0.65);
            background: transparent;
            text-decoration: none;
            transition: all 0.2s;
            flex-shrink: 0;
          }
          .ab-mobile-pill.active {
            background: rgba(245,168,0,0.15);
            border-color: rgba(245,168,0,0.5);
            color: #F5A800;
          }
        }

        .ab-quote-block {
          margin-top: 18px; padding: 18px 20px;
          border-left: 3px solid #F5A800;
          background: rgba(245,168,0,0.05);
          border-radius: 0 8px 8px 0;
        }

        .ab-sep {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.06);
          margin: 0;
        }

        html { scroll-behavior: smooth; }
      `}</style>

      {/* MOBILE PILL NAV */}
      <nav className="ab-mobile-nav">
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

      <div style={{ background: "#000", minHeight: "100vh", paddingTop: topOffset, paddingBottom: isMobile ? 80 : 60 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "1fr 200px",
          maxWidth: 1200,
          margin: "0 auto",
        }}>

          {/* ── ALL CONTENT ── */}
          <div style={{ minWidth: 0 }}>

            {/* ══ SECTION 1: HERO ══ */}
            <section id="ab-about" className="ab-section" style={{
              padding: `${isMobile ? 48 : 110}px ${sidePad}px`,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "radial-gradient(circle at top, rgba(245,168,0,0.06), transparent 60%), linear-gradient(to bottom, #050505, #000)",
            }}>
              <h1 style={{
                fontFamily: "Cinzel, serif", fontWeight: 900,
                fontSize: isMobile ? 34 : isTablet ? 54 : 76,
                lineHeight: 1.05, marginBottom: 22, color: "#fff", letterSpacing: "-2px",
              }}>
                <span className="ab-gold">Unlocking</span> the<br />
                Mysteries of God<br />
                <span style={{ color: "rgba(255,255,255,0.22)", WebkitTextStroke: "1px rgba(255,255,255,0.35)" }}>
                  Within You.
                </span>
              </h1>

              <p style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: isMobile ? 18 : 22, fontWeight: 400,
                color: "rgba(255,255,255,0.88)",
                maxWidth: 720, lineHeight: 1.8, marginBottom: 22,
              }}>
                We are a prophetic teaching and discipleship expression rooted in the revelation of Christ —
                designed to awaken believers into spiritual understanding, divine identity, and Kingdom manifestation.
              </p>

              <p style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: isMobile ? 16 : 18, fontWeight: 300,
                color: "rgba(255,255,255,0.75)",
                maxWidth: 700, lineHeight: 1.9, marginBottom: 38,
              }}>
                Since 2020, Zoe School of Mysteries has grown into a global spiritual ecosystem —
                not centered on personality, but on the unveiling of Christ within believers.
                From Lagos, Nigeria, a worldwide community is emerging, carrying light, understanding,
                and spiritual authority into every sphere of life.
              </p>

              {/* HERO IMAGE */}
              <div className="ab-img-wrap" style={{
                marginTop: 20, borderRadius: isMobile ? 12 : 16,
                height: isMobile ? 220 : 440, overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 30px 120px rgba(0,0,0,0.75)",
              }}>
                <img className="ab-img" src="/images/Logo over recolored scene.png" alt="Zoe School of Mysteries worship" style={{ transform: "scale(1.05)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent 60%)" }} />
              </div>
            </section>

            {/* ══ SECTION 2: WHO WE ARE ══ */}
            <section id="ab-who" className="ab-section" style={{
              padding: `${isMobile ? 56 : 100}px ${sidePad}px`,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "radial-gradient(circle at top, rgba(245,168,0,0.05), transparent 60%), linear-gradient(to bottom, #050505, #000)",
            }}>
              <div className="ab-eyebrow"><span className="ab-eyebrow-line" />Our Identity</div>
              <div className="ab-divider" />
              <h2 style={{
                fontFamily: "Cinzel, serif", fontWeight: 700,
                fontSize: isMobile ? 28 : isTablet ? 38 : 48,
                color: "#fff", marginBottom: 28, lineHeight: 1.1, letterSpacing: 0.5,
              }}>Who We Are</h2>

              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1.05fr 0.95fr",
                gap: isMobile ? 36 : 64,
                alignItems: isMobile ? "start" : "center",
              }}>
                {/* LEFT — text */}
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <p style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: isMobile ? 17 : 19, fontWeight: 400,
                    color: "rgba(255,255,255,0.88)", lineHeight: 1.9,
                  }}>
                    Zoe School of Mysteries is a Kingdom Academy raised under divine instruction — a training ground
                    for those called into the realities of the Spirit and the government of God. It is not built on religion,
                    but on revelation; not on performance, but on encounter.
                  </p>
                  <p style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: isMobile ? 16 : 18, fontWeight: 300,
                    color: "rgba(255,255,255,0.80)", lineHeight: 1.9,
                  }}>
                    At the core of this movement is the mandate carried by{" "}
                    <span style={{ color: "#F5A800", fontWeight: 600 }}>Hassan Paul Ololade Melchizedek</span>,
                    alongside apostolic and governmental stewardship through Sir NickGRACEMAN and Godwin T. Nwachukwu,
                    forming a threefold cord of apostolic, prophetic, and administrative grace.
                  </p>
                  <p style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: isMobile ? 16 : 18, fontWeight: 300,
                    color: "rgba(255,255,255,0.80)", lineHeight: 1.9,
                  }}>
                    We teach the hidden life — the ZOE reality — where believers live from God, not for God.
                    Identity is restored, spiritual senses awakened, and believers trained in dominion and discernment.
                  </p>
                  <div className="ab-quote-block">
                    <p style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontSize: isMobile ? 19 : 23, fontStyle: "italic",
                      color: "#fff", lineHeight: 1.6, marginBottom: 8,
                    }}>
                      "As He is, so are we in this world."
                    </p>
                    <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3, color: "#F5A800", textTransform: "uppercase" }}>
                      1 John 4:17
                    </div>
                  </div>
                </div>

                {/* RIGHT — IMAGE MOSAIC (shows on ALL screen sizes) */}
                <div className="ab-who-images">
                  {/* Large top image */}
                  <div className="ab-img-wrap ab-who-img-top">
                    <img
                      className="ab-img"
                      src="/images/Logo on paper note.png"
                      alt="Worship gathering"
                      style={{ transform: "scale(1.05)" }}
                    />
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 55%)",
                    }} />
                    {/* Mobile label */}
                    <div className="ab-who-img-label">The Movement</div>
                  </div>

                  {/* Two smaller images side by side */}
                  <div className="ab-who-img-row">
                    <div className="ab-who-img-sm">
                      <img
                        className="ab-img"
                        src="/images/Zoe School of Mysteries _ recolored note (1).png"
                        alt="Community of believers"
                        style={{ transform: "scale(1.05)", transition: "transform 0.6s ease" }}
                      />
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent 55%)",
                      }} />
                      <div className="ab-who-img-label">Community</div>
                    </div>
                    <div className="ab-who-img-sm">
                      <img
                        className="ab-img"
                        src="/images/Kingdom Influencers _ recolored _ summarized.png"
                        alt="Kingdom influencers"
                        style={{ transform: "scale(1.05)", transition: "transform 0.6s ease" }}
                      />
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent 55%)",
                      }} />
                      <div className="ab-who-img-label">Kingdom</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ══ SECTION 3: CHURCH EXPERIENCES ══ */}
            <section id="ab-experience" className="ab-section" style={{
              padding: `${isMobile ? 56 : 100}px ${sidePad}px`,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "radial-gradient(circle at top, rgba(245,168,0,0.06), transparent 60%), linear-gradient(to bottom, #050505, #000)",
            }}>
              <div className="ab-eyebrow"><span className="ab-eyebrow-line" />How We Gather</div>
              <div className="ab-divider" />
              <h2 style={{
                fontFamily: "Cinzel, serif", fontWeight: 700,
                fontSize: isMobile ? 28 : 48, color: "#fff",
                marginBottom: 18, lineHeight: 1.1, letterSpacing: 0.5,
              }}>Church Experiences</h2>
              <p style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: isMobile ? 17 : 19, fontWeight: 300,
                color: "rgba(255,255,255,0.82)", maxWidth: 650, lineHeight: 1.9, marginBottom: 50,
              }}>
                We are not bound by walls or locations. Zoe School of Mysteries is a global spiritual ecosystem —
                a people connected by Spirit, not geography. We gather primarily online, with moments of deeper
                convergence at appointed seasons.
              </p>

              <div className="ab-img-wrap" style={{
                borderRadius: isMobile ? 12 : 16, height: isMobile ? 200 : 420,
                marginBottom: 36, border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 30px 90px rgba(0,0,0,0.7)",
              }}>
                <img className="ab-img" src="/images/Logo placed at top.png" alt="Zoe gathering" style={{ transform: "scale(1.05)" }} />
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                gap: isMobile ? 14 : 18,
              }}>
                {[
                  { title: "Streams of Immortality (Daily Online Gathering)", desc: "Our daily online flow of teachings, prophetic insights, and spiritual formation released across the global body in real time.", img: "/images/Streams Of Immortality poster.png", tag: "Daily Flow", tagColor: "#F5A800" },
                  { title: "Live Prophetic Meetings", desc: "Spirit-led encounters of worship, prophecy, healing, and deep teaching — divine convergence moments beyond routine.", img: "/images/Expanded.png", tag: "Encounter", tagColor: "#9333EA" },
                  { title: "Evolve Annual Convergence", desc: "A yearly physical gathering for impartation, alignment, and acceleration into Kingdom assignment.", img: "/images/photo_2026-06-11_14-39-41.jpg", tag: "Annual", tagColor: "#22c55e" },
                  { title: "Global Watch & Fellowship Circles", desc: "Small online fellowship circles across nations for consistent growth, prayer, and accountability.", img: "https://i.pinimg.com/736x/a6/d1/54/a6d154515d4599844a70c1ad7e46ffbe.jpg", tag: "Community", tagColor: "#06b6d4" },
                ].map((exp, i) => (
                  <div key={i} className="ab-exp-card">
                    <div className="ab-img-wrap" style={{ height: isMobile ? 200 : 260 }}>
                      <img className="ab-img" src={exp.img} alt={exp.title} style={{ transform: "scale(1.06)" }} />
                    </div>
                    <div style={{ padding: isMobile ? "16px 16px 20px" : "20px 20px 24px" }}>
                      <div style={{
                        display: "inline-block", padding: "4px 10px",
                        fontSize: 11, letterSpacing: 1, borderRadius: 20, marginBottom: 10,
                        background: exp.tagColor + "22", color: exp.tagColor,
                        fontFamily: "Rajdhani, sans-serif", textTransform: "uppercase",
                      }}>{exp.tag}</div>
                      <div style={{ fontFamily: "Cinzel, serif", fontSize: isMobile ? 15 : 16, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.3 }}>
                        {exp.title}
                      </div>
                      <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: isMobile ? 15 : 16, fontWeight: 300, color: "rgba(255,255,255,0.78)", lineHeight: 1.75 }}>
                        {exp.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ══ SECTION 4: LEADERSHIP ══ */}
            <section id="ab-leadership" className="ab-section" style={{
              padding: `${isMobile ? 56 : 100}px ${sidePad}px`,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "radial-gradient(circle at top, rgba(245,168,0,0.05), transparent 60%), linear-gradient(to bottom, #050505, #000)",
            }}>
              <div className="ab-eyebrow"><span className="ab-eyebrow-line" />The Team</div>
              <div className="ab-divider" />
              <h2 style={{
                fontFamily: "Cinzel, serif", fontWeight: 700,
                fontSize: isMobile ? 28 : 48, color: "#fff",
                marginBottom: 14, lineHeight: 1.1, letterSpacing: 0.5,
              }}>Leadership</h2>
              <p style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: isMobile ? 17 : 19, fontWeight: 300,
                color: "rgba(255,255,255,0.82)", maxWidth: 580, lineHeight: 1.9, marginBottom: 50,
              }}>
                Behind every movement is a people who said yes. These are the vessels carrying
                the vision of Zoe School of Mysteries across nations and generations.
              </p>

              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)",
                gap: isMobile ? 20 : 24,
                alignItems: "stretch",
              }}>
                {leaders.map((l, i) => (
                  <div key={i} className="ab-leader-card">
                    <div className="ab-leader-img-wrap" style={{ height: isMobile ? 340 : 420 }}>
                      <img
                        className="ab-leader-img"
                        src={l.image}
                        alt={l.name}
                        style={{ filter: "contrast(1.05) brightness(0.92)" }}
                      />
                      <div className="ab-leader-overlay" />
                      <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        padding: "16px 18px 14px",
                      }}>
                        <div style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          fontSize: 10, borderRadius: 20, marginBottom: 8,
                          background: l.tagColor + "25", color: l.tagColor,
                          fontFamily: "Rajdhani, sans-serif",
                          letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700,
                          backdropFilter: "blur(8px)",
                          border: `1px solid ${l.tagColor}30`,
                        }}>{l.tag}</div>
                        <div style={{
                          fontFamily: "Cinzel, serif", fontSize: isMobile ? 15 : 16,
                          fontWeight: 700, color: "#fff", lineHeight: 1.25, marginBottom: 3,
                          textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                        }}>{l.name}</div>
                        <div style={{
                          fontFamily: "Rajdhani, sans-serif", fontSize: 11,
                          letterSpacing: 1.5, color: l.tagColor,
                          textTransform: "uppercase", fontWeight: 600,
                        }}>{l.role}</div>
                      </div>
                    </div>

                    <div className="ab-leader-body">
                      <p style={{
                        fontFamily: "Cormorant Garamond, serif",
                        fontSize: isMobile ? 15 : 15.5,
                        fontWeight: 300, fontStyle: "italic",
                        color: "rgba(255,255,255,0.78)", lineHeight: 1.75,
                        marginBottom: 14,
                      }}>{l.bio}</p>

                      <div style={{
                        marginTop: "auto",
                        paddingTop: 14,
                        borderTop: `1px solid ${l.tagColor}20`,
                      }}>
                        <p style={{
                          fontFamily: "Cormorant Garamond, serif",
                          fontSize: 14, fontStyle: "italic",
                          color: l.tagColor, lineHeight: 1.6,
                          opacity: 0.9,
                        }}>"{l.quote}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ══ SECTION 5: WHAT TO EXPECT ══ */}
            <section id="ab-expect" className="ab-section" style={{
              padding: `${isMobile ? 56 : 110}px ${sidePad}px`,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "radial-gradient(circle at top, rgba(245,168,0,0.06), transparent 60%), linear-gradient(to bottom, #050505, #000)",
            }}>
              <div className="ab-eyebrow"><span className="ab-eyebrow-line" />Your First Encounter</div>
              <div className="ab-divider" />

              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1.15fr 0.85fr",
                gap: isMobile ? 40 : 90, alignItems: "center",
              }}>
                <div>
                  <h2 style={{
                    fontFamily: "Cinzel, serif", fontWeight: 700,
                    fontSize: isMobile ? 28 : 46, color: "#fff",
                    marginBottom: 18, lineHeight: 1.15, letterSpacing: 0.6,
                  }}>What to Expect</h2>
                  <p style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: isMobile ? 17 : 19, fontWeight: 300,
                    color: "rgba(255,255,255,0.82)", lineHeight: 1.9,
                    marginBottom: 36, maxWidth: 640,
                  }}>
                    Zoe School of Mysteries is not a place you attend — it is a realm you align with.
                    A spiritual system where believers are formed to carry divine presence into every environment,
                    awakened into sonship and responsibility.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 10 : 14 }}>
                    {[
                      { num: "01", title: "Digital Encounter & Welcome", desc: "You are received into a living online family and immediately drawn into teachings, prayer flows, and prophetic formation." },
                      { num: "02", title: "Atmospheric Online Gatherings", desc: "Spirit-led online encounters that shift atmospheres through worship, teaching, and prophetic flow." },
                      { num: "03", title: "Formation of the Inner Life", desc: "You are transformed into the life of Christ (Zoe), carrying divine reality into your environment." },
                      { num: "04", title: "Living as a Mobile Altar", desc: "You become a walking altar — every space you enter becomes a place of manifestation." },
                      { num: "05", title: "Online Family & EVOLVE Convergence", desc: "A global family connected online, with annual physical convergence for alignment and commissioning." },
                    ].map((item, i) => (
                      <div key={i} className="ab-step-card">
                        <div style={{
                          minWidth: 44, height: 44, borderRadius: 10,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: 13,
                          color: "#F5A800", background: "rgba(245,168,0,0.1)",
                          border: "1px solid rgba(245,168,0,0.3)",
                          flexShrink: 0,
                        }}>{item.num}</div>
                        <div>
                          <div style={{ fontFamily: "Cinzel, serif", fontSize: isMobile ? 14 : 15, fontWeight: 700, color: "#fff", marginBottom: 5, letterSpacing: 0.3 }}>
                            {item.title}
                          </div>
                          <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: isMobile ? 15 : 16, fontWeight: 300, color: "rgba(255,255,255,0.78)", lineHeight: 1.75 }}>
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {!isMobile && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div className="ab-img-wrap" style={{ borderRadius: 16, height: 380, border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 30px 90px rgba(0,0,0,0.7)" }}>
                      <img className="ab-img" src="/images/The Blockchain Revolution_ How This Technology is Shaping Tomorrow_.jpg" alt="Global online gathering" style={{ transform: "scale(1.06)" }} />
                    </div>
                    <div className="ab-img-wrap" style={{ borderRadius: 16, height: 240, border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 30px 90px rgba(0,0,0,0.7)" }}>
                      <img className="ab-img" src="/images/School of Mysteries Manifestation.png" alt="Community in Spirit" style={{ transform: "scale(1.06)" }} />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* ══ SECTION 6: MISSIONS AND VISIONS ══ */}
            <section id="ab-nextgen" className="ab-section" style={{
              padding: `${isMobile ? 56 : 110}px ${sidePad}px`,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "radial-gradient(ellipse at top, rgba(245,168,0,0.06), transparent 60%), linear-gradient(to bottom, #050505, #000)",
            }}>
              <div className="ab-eyebrow"><span className="ab-eyebrow-line" />Mission & Vision</div>
              <div className="ab-divider" />
              <h2 style={{
                fontFamily: "Cinzel, serif", fontWeight: 700,
                fontSize: isMobile ? 28 : 48, color: "#fff",
                marginBottom: 16, lineHeight: 1.1, letterSpacing: 0.5,
              }}>Kingdom Mandate</h2>
              <p style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: isMobile ? 17 : 19, fontWeight: 300,
                color: "rgba(255,255,255,0.85)", maxWidth: 680, lineHeight: 1.9, marginBottom: 42,
              }}>
                Zoe School of Mysteries exists as a divine training ground for the revelation of Christ in man.
                Our mission is to awaken believers into the reality of Zoe — the life of God — and our vision is
                a global company of sons and daughters manifesting Kingdom reality across every sphere of life.
              </p>

              <div className="ab-img-wrap" style={{
                borderRadius: isMobile ? 12 : 16,
                height: isMobile ? 190 : 380, marginBottom: 40,
                border: "1px solid rgba(255,255,255,0.1)",
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
                  { title: "ZOE AWAKENING",         desc: "To bring believers into experiential knowledge of the life of God, shifting them into divine consciousness and encounter.", color: "#F5A800" },
                  { title: "GLOBAL DISCIPLESHIP",   desc: "To raise a decentralized but unified global family through online gatherings, prophetic impartation, and Spirit-led formation.", color: "#9333EA" },
                  { title: "KINGDOM MANIFESTATION", desc: "To equip saints to carry the presence of God into education, business, governance, media, and culture.", color: "#22c55e" },
                ].map((g, i) => (
                  <div key={i} className="ab-mission-card" style={{ transition: "all 0.35s ease" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = g.color + "40"; e.currentTarget.style.boxShadow = "0 20px 70px rgba(0,0,0,0.6)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={{ height: 2, width: 40, background: g.color, marginBottom: 16, boxShadow: `0 0 20px ${g.color}50` }} />
                    <div style={{ fontFamily: "Cinzel, serif", fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 12, letterSpacing: 0.5 }}>{g.title}</div>
                    <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 16, fontWeight: 300, color: "rgba(255,255,255,0.82)", lineHeight: 1.8 }}>{g.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ══ SECTION 7: TEENAGERS ══ */}
            <section id="ab-young" className="ab-section" style={{
              padding: `${isMobile ? 56 : 100}px ${sidePad}px`,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "radial-gradient(circle at top, rgba(245,168,0,0.05), transparent 60%), linear-gradient(to bottom, #0a0008, #000)",
            }}>
              <div className="ab-eyebrow"><span className="ab-eyebrow-line" />Ages 12 – 18</div>
              <div className="ab-divider" />

              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: isMobile ? 32 : 80, alignItems: "center",
              }}>
                <div className="ab-img-wrap" style={{
                  borderRadius: isMobile ? 12 : 14,
                  height: isMobile ? 280 : 580,
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
                  order: isMobile ? 2 : 1,
                }}>
                  <img className="ab-img" src="/images/teen.jpg" alt="Zoe Teens"
                    style={{ objectPosition: "center top", transform: "scale(1.03)" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent 60%)" }} />
                </div>

                <div style={{ order: isMobile ? 1 : 2 }}>
                  <h2 style={{
                    fontFamily: "Cinzel, serif", fontWeight: 700,
                    fontSize: isMobile ? 30 : 44, color: "#fff",
                    marginBottom: 18, lineHeight: 1.1, letterSpacing: 0.5,
                  }}>Zoe Teens</h2>
                  <p style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: isMobile ? 17 : 18, fontWeight: 400,
                    color: "rgba(255,255,255,0.88)", lineHeight: 1.9, marginBottom: 16, maxWidth: 520,
                  }}>
                    Zoe Teens is a transformational community for teenagers ages 12–18 who are discovering purpose,
                    building confidence, and growing into who they were created to be. We believe teenagers are not
                    just the future — they are active carriers of impact today.
                  </p>
                  <p style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: isMobile ? 16 : 17, fontWeight: 300,
                    color: "rgba(255,255,255,0.78)", lineHeight: 1.9, marginBottom: 16, maxWidth: 520,
                  }}>
                    Through mentorship, creative development, real friendships, and life skills training, we help young
                    people grow in wisdom, discipline, emotional intelligence, creativity, and identity.
                  </p>
                  <p style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: isMobile ? 16 : 17, fontWeight: 300,
                    color: "rgba(255,255,255,0.78)", lineHeight: 1.9, marginBottom: 32, maxWidth: 520,
                  }}>
                    Every Saturday at 5PM, teens gather online and physically to connect, learn, grow, and develop
                    into confident, purpose-driven leaders who can thrive anywhere in life.
                  </p>
                  <a href="https://t.me/+jjxA3Z9QSUllZDQ0" target="_blank" rel="noopener noreferrer" className="ab-cta-btn">
                    Learn More & Join
                  </a>
                </div>
              </div>
            </section>

            {/* ══ SECTION 8: OUTREACH ══ */}
            <section id="ab-outreach" className="ab-section" style={{
              padding: `${isMobile ? 56 : 110}px ${sidePad}px`,
              background: "radial-gradient(circle at top, rgba(245,168,0,0.05), transparent 60%), linear-gradient(to bottom, #050505, #000)",
            }}>
              <div className="ab-eyebrow"><span className="ab-eyebrow-line" />Kingdom Impact</div>
              <div className="ab-divider" />
              <h2 style={{
                fontFamily: "Cinzel, serif", fontWeight: 700,
                fontSize: isMobile ? 28 : 48, color: "#fff",
                marginBottom: 16, lineHeight: 1.1, letterSpacing: 0.5,
              }}>Expression of the Kingdom</h2>
              <p style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: isMobile ? 17 : 19, fontWeight: 300,
                color: "rgba(255,255,255,0.85)", maxWidth: 720, lineHeight: 1.9, marginBottom: 42,
              }}>
                In Zoe School of Mysteries, outreach is not a program — it is the overflow of a people
                who carry the life of God (Zoe). Every believer becomes a carrier of transformation,
                influencing systems through presence, wisdom, and divine intelligence.
              </p>

              <div className="ab-img-wrap" style={{
                borderRadius: isMobile ? 12 : 16,
                height: isMobile ? 190 : 400, marginBottom: 50,
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 30px 100px rgba(0,0,0,0.75)",
              }}>
                <img className="ab-img" src="/images/Website Banner Expansion.png" alt="Kingdom impact" style={{ transform: "scale(1.05)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%)" }} />
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                gap: isMobile ? 12 : 18,
              }}>
                {[
                  { title: "Kingdom Presence in Society",  desc: "Believers carry God's presence into workplaces, schools, government, and business — transforming environments from within.", icon: "🌍" },
                  { title: "Digital Evangelism & Influence",desc: "Through online platforms, believers shape culture with truth, revelation, and prophetic insight across nations.", icon: "📡" },
                  { title: "Compassion as Expression",     desc: "Love becomes action — restoration, support, and care flow naturally as the expression of Christ through His people.", icon: "🤲" },
                  { title: "City Transformation Mandate",  desc: "We train believers to influence systems — education, governance, arts, and economy — with Kingdom intelligence.", icon: "🏙" },
                ].map((o, i) => (
                  <div key={i} className="ab-impact-card">
                    <div style={{
                      width: 46, height: 46, borderRadius: 12,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22, background: "rgba(245,168,0,0.1)",
                      border: "1px solid rgba(245,168,0,0.25)", flexShrink: 0,
                    }}>{o.icon}</div>
                    <div>
                      <div style={{ fontFamily: "Cinzel, serif", fontSize: isMobile ? 14 : 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
                        {o.title}
                      </div>
                      <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: isMobile ? 15 : 16, fontWeight: 300, color: "rgba(255,255,255,0.82)", lineHeight: 1.75 }}>
                        {o.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>{/* end left content */}

          {/* ── STICKY SIDE NAV (desktop only) ── */}
          {!isMobile && !isTablet && (
            <div style={{
              borderLeft: "1px solid rgba(255,255,255,0.07)",
              paddingLeft: 28, paddingRight: 24, paddingTop: 80,
            }}>
              <div style={{ position: "sticky", top: 110 }}>
                <div style={{
                  fontFamily: "Rajdhani, sans-serif", fontSize: 9,
                  letterSpacing: 4, textTransform: "uppercase",
                  color: "rgba(255,255,255,0.25)", marginBottom: 18, paddingLeft: 20,
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
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}