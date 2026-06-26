
import { useState, useEffect, useRef } from "react";

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

const slides = [
{
image: "/images/hero1.png",
eyebrow: "Welcome to",
title: ["Zoe", "School of", "Mysteries"],
subtitle:
"A Kingdom learning ecosystem dedicated to unveiling the realities of Christ, cultivating spiritual intelligence, and raising sons who influence their generation from the wisdom, nature, and life of God.",
},
{
image: "/images/hero2.png",
eyebrow: "The Life of God",
title: ["Awaken", "To Zoe", "& Dominion"],
subtitle:
"Discover the reality of the divine life within. Grow in identity, purpose, and spiritual capacity as you learn to manifest the life and nature of Christ in every sphere of influence.",
},
{
image: "/images/hero3.png",
eyebrow: "Kingdom Realities",
title: ["Unlock", "Divine", "Wisdom"],
subtitle:
"Gain insight into the mysteries, laws, and realities of the Kingdom that empower effective leadership, purposeful living, spiritual maturity, and lasting transformation.",
},
{
image: "/images/hero4.png",
eyebrow: "The Emergence of Sons",
title: ["Influence", "Systems", "& Nations"],
subtitle:
"Be equipped to demonstrate the nature of Christ, exercise Kingdom influence, transform cultures and systems, and become a catalyst for generational transformation and national impact.",
},
];



export default function Hero() {
  const width = useWidth();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  const topOffset = isMobile ? 76 : 76;

  const sidePad = isMobile ? 22 : isTablet ? 40 : 72;

  // ── LARGER title clamps for better adult readability ──
  const titleSize = isMobile
    ? "clamp(46px, 12vw, 62px)"
    : isTablet
    ? "clamp(50px, 8vw, 70px)"
    : "clamp(58px, 6.5vw, 86px)";

  // ── LARGER subtitle sizes ──
  const subtitleSize = isMobile ? 17 : isTablet ? 18 : 20;

  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("next");
  const [touched, setTouched] = useState(false);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const handleMove = (e) => {
      if (touchStartX.current === null) return;
      const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
      const dy = Math.abs(e.touches[0].clientY - (touchStartY.current || 0));
      if (dx > dy) e.preventDefault();
    };
    el.addEventListener("touchmove", handleMove, { passive: false });
    return () => el.removeEventListener("touchmove", handleMove);
  }, []);

  const goTo = (dir, index = null) => {
    if (animating) return;
    setAnimating(true);
    setDirection(
      index !== null ? (index > current ? "next" : "prev") : dir
    );
    setTimeout(() => {
      if (index !== null) setCurrent(index);
      else if (dir === "next") setCurrent((p) => (p + 1) % slides.length);
      else setCurrent((p) => (p - 1 + slides.length) % slides.length);
      setAnimating(false);
    }, 500);
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    setTouched(true);
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) >= 50) diff > 0 ? goTo("next") : goTo("prev");
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const slide = slides[current];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Rajdhani:wght@500;600;700&display=swap');

        @keyframes fadeSlideNext {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlidePrev {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideUpContent {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoomBg {
          from { transform: scale(1); }
          to   { transform: scale(1.07); }
        }
        @keyframes bgFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.35; }
          50%      { opacity: 1; }
        }
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%      { transform: translateY(-18px) scale(1.04); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(0.92); opacity: 0.6; }
          70%  { transform: scale(1.08); opacity: 0; }
          100% { transform: scale(0.92); opacity: 0; }
        }
        @keyframes swipeHint {
          0%  { transform: translateX(0); opacity: 0.5; }
          40% { transform: translateX(8px); opacity: 1; }
          80% { transform: translateX(0); opacity: 0.5; }
          100%{ transform: translateX(0); opacity: 0.5; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .slide-enter-next  { animation: fadeSlideNext 0.6s cubic-bezier(0.4,0,0.2,1) forwards; }
        .slide-enter-prev  { animation: fadeSlidePrev 0.6s cubic-bezier(0.4,0,0.2,1) forwards; }
        .slide-enter-mobile{ animation: slideUpContent 0.55s cubic-bezier(0.4,0,0.2,1) forwards; }
        .bg-zoom   { animation: zoomBg 9s ease forwards; }
        .bg-fadein { animation: bgFadeIn 0.45s ease forwards; }
        .orb1      { animation: orbFloat 10s ease-in-out infinite; }
        .orb2      { animation: orbFloat 7.5s ease-in-out infinite 2.5s; }
        .scroll-pulse { animation: scrollPulse 2.2s ease-in-out infinite; }
        .swipe-hint   { animation: swipeHint 2.4s ease-in-out infinite; }
        .fade-in-up   { animation: fadeInUp 0.7s cubic-bezier(0.4,0,0.2,1) both; }

        .gold-shimmer {
          background: linear-gradient(90deg, #C88600 0%, #F5A800 30%, #FFD166 55%, #F5A800 75%, #C88600 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4.5s linear infinite;
        }

        /* ── Mobile Card Sheet ── */
        .mobile-sheet {
          position: absolute;
          top: 30%; bottom: 0; left: 0; right: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0) 0%,
            rgba(5,2,18,0.85) 22%,
            rgba(5,2,18,0.97) 50%,
            rgba(5,2,18,1) 100%
          );
          padding: 36px 22px 28px;
          z-index: 4;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .mobile-eyebrow {
          display: flex; align-items: center; gap: 9px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px; letter-spacing: 4px;
          text-transform: uppercase; color: #F5A800;
          margin-bottom: 12px;
          margin-top: -50px;
        }
        .mobile-eyebrow-line {
          display: inline-block;
          width: 22px; height: 1px; background: #F5A800;
          flex-shrink: 0;
        }

        .mobile-title-wrap { margin-bottom: 14px; }
        .mobile-title-gold {
          font-family: 'Cinzel', serif;
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.5px;
          display: block;
        }
        .mobile-title-white {
          font-family: 'Cinzel', serif;
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.5px;
          color: #fff;
          display: block;
        }
        .mobile-title-purple {
          font-family: 'Cinzel', serif;
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.5px;
          color: #9333EA;
          display: block;
          text-shadow: 0 0 50px rgba(147,51,234,0.55);
        }

        /* ── Subtitle: bumped to 17px on mobile ── */
        .mobile-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          font-weight: 300;
          font-style: italic;
          color: rgba(255,255,255,0.68);
          line-height: 1.8;
          margin-bottom: 16px;
        }

        /* Dot nav — taller for easier tapping */
        .dot {
          height: 5px; border-radius: 3px;
          background: rgba(255,255,255,0.18);
          cursor: pointer; transition: all 0.4s;
          overflow: hidden; position: relative;
        }
        .dot.active { background: rgba(245,168,0,0.22); }
        .dot-progress {
          position: absolute; top: 0; left: 0; height: 100%;
          background: #F5A800; border-radius: 3px;
          animation: progressBar 6s linear forwards;
        }

        /* Slide counter chip */
        .slide-counter {
          display: flex; align-items: center; gap: 4px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px; letter-spacing: 2px;
          color: rgba(255,255,255,0.35);
        }
        .slide-counter-num {
          color: #F5A800; font-size: 22px; font-weight: 700; line-height: 1;
        }

        /* Arrow buttons — larger tap target */
        .arrow-btn {
          width: 48px; height: 48px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(0,0,0,0.38); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(255,255,255,0.65); transition: all 0.3s;
        }
        .arrow-btn:hover {
          border-color: #F5A800; color: #F5A800;
          background: rgba(245,168,0,0.08);
        }

        /* Mobile swipe row */
        .mobile-swipe-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Mobile dots */
        .mobile-dots { display: flex; gap: 7px; align-items: center; }

        /* Mobile slide counter */
        .mobile-counter {
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px; letter-spacing: 2px;
          color: rgba(255,255,255,0.3);
        }
        .mobile-counter span {
          color: #F5A800; font-size: 20px; font-weight: 700;
        }

        /* Gold divider */
        .gold-divider {
          width: 36px; height: 2px;
          background: linear-gradient(to right, #F5A800, transparent);
          margin-bottom: 14px;
        }

        /* Scroll indicator */
        .scroll-label {
          font-family: 'Rajdhani', sans-serif;
          font-size: 12px; letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          writing-mode: vertical-rl;
        }

        .hero-stat { transition: transform 0.3s; cursor: default; }
        .hero-stat:hover { transform: translateY(-4px); }

        @media (prefers-reduced-motion: reduce) {
          .bg-zoom, .orb1, .orb2, .gold-shimmer,
          .slide-enter-next, .slide-enter-prev, .slide-enter-mobile,
          .scroll-pulse, .swipe-hint, .fade-in-up { animation: none !important; }
        }
      `}</style>

      <section
        id="home"
        ref={wrapperRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          position: "relative",
          height: isMobile ? `calc(100vh - 76px - 54px)` : `calc(100vh - 76px)`,
          marginTop: 76,
          minHeight: isMobile ? 480 : 600,
          overflow: "hidden",
          background: "#050212",
        }}
      >
        {/* ── Background Image ── */}
        <div
          key={`bg-${current}`}
          className="bg-zoom bg-fadein"
          style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: isMobile ? "center top" : "center",
          }}
        />

        {/* ── Overlays ── */}
        <div style={{
          position: "absolute", inset: 0,
          background: isMobile
            ? "linear-gradient(to bottom, rgba(5,2,18,0.15) 0%, rgba(5,2,18,0.08) 35%, rgba(5,2,18,0.0) 50%)"
            : `linear-gradient(to right, rgba(5, 2, 18, 0.21) 30%, rgba(5, 2, 18, 0.06) 100%),
               linear-gradient(to top, rgba(5, 2, 18, 0.14) 0%, transparent 52%)`,
          pointerEvents: "none", zIndex: 1,
        }} />

        <div style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: isMobile
            ? "radial-gradient(ellipse 80% 50% at 50% 20%, rgba(107,33,168,0.18) 0%, transparent 70%)"
            : "radial-gradient(ellipse 65% 65% at 68% 22%, rgba(107,33,168,0.22) 0%, transparent 70%)",
        }} />

        <div style={{
          position: "absolute", inset: 0, opacity: 0.025, zIndex: 1, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(245,168,0,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,168,0,1) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }} />

        {/* ── Ambient Orbs — desktop only ── */}
        {!isMobile && (
          <>
            <div className="orb1" style={{
              position: "absolute", zIndex: 1,
              width: 520, height: 520, borderRadius: "50%",
              top: "-8%", left: "46%",
              background: "radial-gradient(circle, rgba(107,33,168,0.26) 0%, transparent 68%)",
              pointerEvents: "none",
            }} />
            <div className="orb2" style={{
              position: "absolute", zIndex: 1,
              width: 260, height: 260, borderRadius: "50%",
              top: "58%", left: "6%",
              background: "radial-gradient(circle, rgba(245,168,0,0.09) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
          </>
        )}

        {/* ══════════════════════════════════════
            MOBILE LAYOUT
        ══════════════════════════════════════ */}
        {isMobile && (
          <>
            {/* Slide counter — top right */}
            <div style={{
              position: "absolute", top: 8, right: 18, zIndex: 6,
              fontFamily: "Rajdhani, sans-serif",
            }}>
              <div className="mobile-counter">
                <span>{String(current + 1).padStart(2, "0")}</span>
                {" / "}{String(slides.length).padStart(2, "0")}
              </div>
            </div>

            {/* Bottom content sheet */}
            <div
              key={`content-${current}`}
              className="slide-enter-mobile mobile-sheet"
            >
              {/* Eyebrow */}
              <div className="mobile-eyebrow fade-in-up" style={{ animationDelay: "0.05s" }}>
                <span className="mobile-eyebrow-line" />
                {slide.eyebrow}
              </div>

              {/* Title */}
              <div className="mobile-title-wrap fade-in-up" style={{ animationDelay: "0.12s" }}>
                <span className="mobile-title-gold gold-shimmer" style={{ fontSize: titleSize }}>
                  {slide.title[0]}
                </span>
                <span className="mobile-title-white" style={{ fontSize: titleSize }}>
                  {slide.title[1]}
                </span>
                <span className="mobile-title-purple" style={{ fontSize: titleSize }}>
                  {slide.title[2]}
                </span>
              </div>

              {/* Gold divider */}
              <div className="gold-divider fade-in-up" style={{ animationDelay: "0.18s" }} />

              {/* Subtitle */}
              <p className="mobile-subtitle fade-in-up" style={{ animationDelay: "0.22s" }}>
                {slide.subtitle}
              </p>

              {/* Bottom row: dots + swipe hint */}
              <div className="mobile-swipe-row">
                <div className="mobile-dots">
                  {slides.map((_, i) => (
                    <div
                      key={i}
                      className={`dot ${i === current ? "active" : ""}`}
                      style={{ width: i === current ? 36 : 16 }}
                      onClick={() => goTo(i > current ? "next" : "prev", i)}
                    >
                      {i === current && <div className="dot-progress" key={`p-${current}`} />}
                    </div>
                  ))}
                </div>

                {/* Swipe hint — fades after first touch */}
                {!touched && (
                  <div
                    className="swipe-hint"
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      fontFamily: "Rajdhani, sans-serif", fontSize: 12,
                      letterSpacing: 3, textTransform: "uppercase",
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    swipe
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════
            DESKTOP / TABLET LAYOUT
        ══════════════════════════════════════ */}
        {!isMobile && (
          <>
            {/* Slide counter */}
            <div style={{
              position: "absolute", top: 26, right: 52, zIndex: 5,
              fontFamily: "Rajdhani, sans-serif",
              letterSpacing: 3, color: "rgba(255,255,255,0.28)",
              fontSize: 13,
            }}>
              <span style={{ color: "#F5A800", fontSize: 26, fontWeight: 700 }}>
                {String(current + 1).padStart(2, "0")}
              </span>
              {" / "}
              {String(slides.length).padStart(2, "0")}
            </div>

            {/* Main Content */}
            <div
              key={`content-${current}`}
              className={direction === "next" ? "slide-enter-next" : "slide-enter-prev"}
              style={{
                position: "absolute", zIndex: 3,
                bottom: 90, left: 0,
                padding: `0 ${sidePad}px`,
                maxWidth: isTablet ? 640 : 780,
              }}
            >
              {/* Eyebrow */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                marginBottom: 20,
                fontFamily: "Rajdhani, sans-serif",
                fontSize: 13, letterSpacing: 5,
                textTransform: "uppercase", color: "#F5A800",
              }}>
                <span style={{
                  width: 28, height: 1,
                  background: "linear-gradient(to right, #F5A800, rgba(245,168,0,0.4))",
                  display: "inline-block",
                }} />
                {slide.eyebrow}
              </div>

              {/* Title */}
              <h1 style={{
                fontFamily: "Cinzel, serif", fontWeight: 900,
                lineHeight: 1.03, letterSpacing: "-0.5px",
                fontSize: titleSize, margin: "0 0 24px",
              }}>
                <span className="gold-shimmer" style={{ display: "block" }}>{slide.title[0]}</span>
                <span style={{ color: "#fff", display: "block" }}>{slide.title[1]}</span>
                <span style={{
                  color: "#9333EA", display: "block",
                  textShadow: "0 0 70px rgba(147,51,234,0.55)",
                }}>{slide.title[2]}</span>
              </h1>

              {/* Thin gold line */}
              <div style={{
                width: 44, height: 2,
                background: "linear-gradient(to right, #F5A800, transparent)",
                marginBottom: 22,
              }} />

              {/* Subtitle */}
              <p style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: subtitleSize,
                fontWeight: 300, fontStyle: "italic",
                color: "rgba(255,255,255,0.68)",
                lineHeight: 1.85,
                margin: 0,
                maxWidth: isTablet ? "100%" : 500,
              }}>
                {slide.subtitle}
              </p>
            </div>

            {/* Arrows — right side vertical */}
            <div style={{
              position: "absolute", right: 52,
              top: "50%", transform: "translateY(-50%)",
              display: "flex", flexDirection: "column", gap: 12, zIndex: 5,
            }}>
              <div className="arrow-btn" onClick={() => goTo("prev")} role="button" aria-label="Previous slide">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M18 15l-6-6-6 6" />
                </svg>
              </div>
              <div className="arrow-btn" onClick={() => goTo("next")} role="button" aria-label="Next slide">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            {/* Dots */}
            <div style={{
              position: "absolute",
              bottom: 40, left: "50%", transform: "translateX(-50%)",
              display: "flex", gap: 9, alignItems: "center", zIndex: 5,
            }}>
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`dot ${i === current ? "active" : ""}`}
                  style={{ width: i === current ? 40 : 18 }}
                  onClick={() => goTo(i > current ? "next" : "prev", i)}
                >
                  {i === current && <div className="dot-progress" key={`p-${current}`} />}
                </div>
              ))}
            </div>

            {/* Scroll indicator */}
            <div style={{
              position: "absolute", bottom: 40, right: 116,
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 8, zIndex: 5,
            }}>
              <span className="scroll-label">Scroll</span>
              <div className="scroll-pulse" style={{
                width: 1, height: 52,
                background: "linear-gradient(to bottom, #F5A800, transparent)",
              }} />
            </div>
          </>
        )}
      </section>
    </>
  );
}
