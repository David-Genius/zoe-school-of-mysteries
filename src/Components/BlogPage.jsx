import { useState, useEffect, useRef } from "react";
import { getPublishedBlogs } from "./firebase";

function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

function useReadingProgress(ref) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const total = el.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY - el.offsetTop;
      const pct = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
      setProgress(pct);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);
  return progress;
}

function EmberCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const embers = Array.from({ length: 26 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.6 + Math.random() * 1.8,
      vy: -0.15 - Math.random() * 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      alpha: 0.1 + Math.random() * 0.4,
      drift: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() * 0.0006;
      embers.forEach(e => {
        e.y += e.vy;
        e.x += e.vx + Math.sin(t + e.drift) * 0.15;
        if (e.y < -10) { e.y = canvas.height + 10; e.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,168,0,${e.alpha})`;
        ctx.shadowColor = "rgba(245,168,0,0.8)";
        ctx.shadowBlur = 6;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
  );
}

function readingTime(html) {
  if (!html) return 1;
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogPage({ onNavigate }) {
  const [posts,    setPosts]    = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const width    = useWidth();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const sidePad  = isMobile ? 20 : isTablet ? 40 : 64;

  const articleRef = useRef(null);
  const progress = useReadingProgress(articleRef);

  useEffect(() => {
    getPublishedBlogs().then(data => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [selected]);

  const formatDate = (ts) => {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  };

  const openPost = (post) => setSelected(post);
  const backToList = () => setSelected(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Rajdhani:wght@500;600;700&display=swap');

        @keyframes bp-fadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bp-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes bp-spin    { to{transform:rotate(360deg)} }
        @keyframes bp-glowPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }

        .bp-page { background:#000; min-height:100vh; font-family:'Rajdhani',sans-serif; }

        .bp-gold {
          background: linear-gradient(135deg, #C88600 0%, #F5A800 30%, #FFD166 50%, #F5A800 70%, #C88600 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: bp-shimmer 3s linear infinite;
        }

        .bp-eyebrow {
          display:flex; align-items:center; gap:10px;
          font-family:'Rajdhani',sans-serif;
          font-size:13px; letter-spacing:5px;
          text-transform:uppercase; color:#F5A800;
          margin-bottom:16px;
        }
        .bp-line { width:24px; height:1px; background:#F5A800; display:inline-block; }

        .bp-in { opacity:0; animation:bp-fadeUp 0.7s ease forwards; }

        .bp-hero {
          position: relative; overflow: hidden;
          background: radial-gradient(ellipse 80% 60% at 50% 30%, #1a0a00 0%, #000 70%);
          border-bottom: 1px solid rgba(245,168,0,0.15);
        }
        .bp-hero::before {
          content:''; position:absolute; top:-50%; left:-20%; width:140%; height:200%;
          background: repeating-linear-gradient(-45deg, transparent, transparent 60px, rgba(245,168,0,0.02) 60px, rgba(245,168,0,0.02) 61px);
          pointer-events:none;
        }

        .bp-spine { position: relative; }
        .bp-spine::before {
          content:'';
          position:absolute; left:-1px; top:0; bottom:0; width:2px;
          background: linear-gradient(to bottom, transparent, rgba(245,168,0,0.35), transparent);
        }

        .bp-card {
          position: relative;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(245,168,0,0.1);
          border-radius: 8px;
          padding: 0;
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.35s, background 0.35s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s;
        }
        .bp-card::before {
          content:'';
          position:absolute; left:0; top:0; bottom:0; width:3px;
          background: linear-gradient(to bottom, #F5A800, #FFD166, #9333EA);
          opacity: 0; transition: opacity 0.35s;
        }
        .bp-card:hover {
          border-color: rgba(245,168,0,0.4);
          background: rgba(245,168,0,0.03);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(245,168,0,0.08);
        }
        .bp-card:hover::before { opacity: 1; }

        .bp-featured {
          position: relative;
          background: linear-gradient(135deg, rgba(245,168,0,0.06), rgba(147,51,234,0.03));
          border: 1px solid rgba(245,168,0,0.25);
          border-radius: 10px;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s;
        }
        .bp-featured:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(245,168,0,0.15); }
        .bp-featured::after {
          content:''; position:absolute; inset:-2px; border-radius:11px;
          background: conic-gradient(from 0deg, #F5A800, transparent, transparent, #9333EA, transparent, #F5A800);
          opacity: 0; transition: opacity 0.4s; z-index:0;
          animation: bp-spin 6s linear infinite;
        }
        .bp-featured:hover::after { opacity: 0.5; }
        .bp-featured > .bp-featured-inner { position:relative; z-index:1; background:#050300; border-radius:9px; }

        .bp-readmore {
          display:inline-flex; align-items:center; gap:8px;
          font-family:'Rajdhani',sans-serif;
          font-size:13px; letter-spacing:2px; text-transform:uppercase;
          color:#F5A800; font-weight:700; transition: gap 0.25s;
        }
        .bp-card:hover .bp-readmore, .bp-featured:hover .bp-readmore { gap:14px; }

        .bp-back {
          display:inline-flex; align-items:center; gap:10px;
          background: rgba(10,8,0,0.9);
          border: 1px solid rgba(245,168,0,0.3);
          border-radius: 30px;
          padding: 11px 22px 11px 16px;
          cursor: pointer;
          font-family:'Rajdhani',sans-serif;
          font-size:13px; letter-spacing:2px; text-transform:uppercase; font-weight:700;
          color:#F5A800;
          transition: all 0.3s;
          backdrop-filter: blur(8px);
        }
        .bp-back:hover {
          border-color:#F5A800;
          background: rgba(245,168,0,0.1);
          box-shadow: 0 0 24px rgba(245,168,0,0.25);
          transform: translateX(-2px);
        }
        .bp-back svg { transition: transform 0.3s; }
        .bp-back:hover svg { transform: translateX(-3px); }

        .bp-progress-track {
          position: fixed; top:0; left:0; right:0; height:3px; z-index:50;
          background: rgba(255,255,255,0.04);
        }
        .bp-progress-fill {
          height:100%;
          background: linear-gradient(90deg, #C88600, #F5A800, #FFD166);
          box-shadow: 0 0 12px rgba(245,168,0,0.6);
          transition: width 0.1s linear;
        }

        .bp-article p:first-of-type::first-letter {
          font-family: 'Cinzel', serif;
          font-size: 62px;
          font-weight: 900;
          color: #F5A800;
          float: left;
          line-height: 0.85;
          margin: 6px 10px 0 0;
          text-shadow: 0 0 30px rgba(245,168,0,0.4);
        }

        .bp-article { font-family:'Cormorant Garamond',serif; }
        .bp-article p { margin: 0 0 1.4em; }
        .bp-article a { color:#F5A800; text-decoration: underline; text-decoration-color: rgba(245,168,0,0.3); }
        .bp-article h2 { font-family:'Cinzel',serif; color:#fff; margin: 1.6em 0 0.6em; font-size: 26px; }
        .bp-article h3 { font-family:'Cinzel',serif; color:#fff; margin: 1.6em 0 0.6em; font-size: 22px; }
        .bp-article blockquote {
          border-left: 2px solid #F5A800;
          margin: 1.6em 0; padding: 0.2em 0 0.2em 24px;
          font-style: italic; color: rgba(255,255,255,0.6);
          font-size: 21px;
        }
        .bp-article img { max-width:100%; border-radius:6px; margin: 1.2em 0; }

        .bp-chip {
          display:inline-flex; align-items:center;
          font-family:'Rajdhani',sans-serif;
          font-size:12px; letter-spacing:2px; text-transform:uppercase;
          color:#F5A800; background: rgba(245,168,0,0.08); border:1px solid rgba(245,168,0,0.2);
          padding: 5px 13px; border-radius: 20px; font-weight:600;
        }

        .bp-skel {
          background: linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(245,168,0,0.06) 50%, rgba(255,255,255,0.02) 100%);
          background-size: 200% 100%;
          animation: bp-shimmer 1.6s linear infinite;
          border-radius: 8px;
        }

        .bp-empty-glyph {
          width: 64px; height:64px; border-radius:50%;
          border: 1px solid rgba(245,168,0,0.25);
          display:flex; align-items:center; justify-content:center;
          font-size: 24px; margin: 0 auto 20px;
          animation: bp-glowPulse 2.4s ease-in-out infinite;
        }
      `}</style>

      <div className="bp-page">

        {selected ? (
          <div ref={articleRef}>
            <div className="bp-progress-track">
              <div className="bp-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Article hero */}
            <section className="bp-hero" style={{
              padding: `${isMobile ? 100 : 130}px ${sidePad}px ${isMobile ? 48 : 64}px`,
            }}>
              <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 2 }}>
                <button className="bp-back" onClick={backToList} style={{ marginBottom: 36 }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  Back to Blog
                </button>

                <div className="bp-in" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 22, animationDelay: "0.05s" }}>
                  <span className="bp-chip">{selected.author}</span>
                  <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: 14, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>
                    {formatDate(selected.createdAt)} · {readingTime(selected.body)} min read
                  </span>
                </div>

                <h1 className="bp-in" style={{
                  fontFamily: "Cinzel,serif", fontWeight: 900,
                  fontSize: isMobile ? "clamp(30px,7vw,38px)" : "clamp(38px,4.5vw,56px)",
                  lineHeight: 1.12, color: "#fff", margin: 0,
                  letterSpacing: "-0.5px",
                  animationDelay: "0.12s",
                }}>
                  {selected.title}
                </h1>

                <div className="bp-in" style={{ width: 48, height: 2, background: "linear-gradient(to right, #F5A800, transparent)", marginTop: 30, animationDelay: "0.2s" }} />
              </div>
            </section>

            {/* Article body */}
            <div style={{
              maxWidth: 720, margin: "0 auto",
              padding: `${isMobile ? 40 : 64}px ${sidePad}px ${isMobile ? 60 : 90}px`,
            }}>
              <div
                className="bp-article"
                style={{ fontSize: isMobile ? 20 : 22, color: "rgba(255,255,255,0.78)", lineHeight: 1.95 }}
                dangerouslySetInnerHTML={{ __html: selected.body }}
              />

              <div style={{ marginTop: 56, paddingTop: 32, borderTop: "1px solid rgba(245,168,0,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 19, fontStyle: "italic", color: "rgba(255,255,255,0.4)" }}>
                  Written by <span style={{ color: "#F5A800" }}>{selected.author}</span>
                </div>
                <button className="bp-back" onClick={backToList}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  Back to Blog
                </button>
              </div>
            </div>
          </div>
        ) : (

          <>
            {/* Blog list hero */}
            <section className="bp-hero" style={{
              minHeight: isMobile ? 280 : 340,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: `${isMobile ? 110 : 130}px ${sidePad}px ${isMobile ? 48 : 64}px`,
              textAlign: "center",
            }}>
              <EmberCanvas />
              <div style={{ position: "relative", zIndex: 2 }}>
                <div className="bp-eyebrow bp-in" style={{ justifyContent: "center", animationDelay: "0s" }}>
                  <span className="bp-line" />
                  Teachings & Reflections
                  <span className="bp-line" />
                </div>
                <h1 className="bp-in" style={{
                  fontFamily: "Cinzel,serif", fontWeight: 900,
                  fontSize: isMobile ? "clamp(34px,8vw,44px)" : "clamp(44px,5vw,64px)",
                  margin: 0, animationDelay: "0.1s",
                }}>
                  <span className="bp-gold">The Blog</span>
                </h1>
                <p className="bp-in" style={{
                  fontFamily: "Cormorant Garamond,serif",
                  fontSize: isMobile ? 18 : 21,
                  fontStyle: "italic", color: "rgba(255,255,255,0.5)",
                  marginTop: 16, maxWidth: 460, lineHeight: 1.7,
                  animationDelay: "0.2s",
                }}>
                  Wisdom, stories, and insight from the Zoe School community.
                </p>
              </div>
            </section>

            <div style={{ maxWidth: 920, margin: "0 auto", padding: `${isMobile ? 40 : 64}px ${sidePad}px ${isMobile ? 70 : 100}px` }}>

              {loading ? (
                <div style={{ display: "grid", gap: 20 }}>
                  <div className="bp-skel" style={{ height: 160 }} />
                  <div className="bp-skel" style={{ height: 110 }} />
                  <div className="bp-skel" style={{ height: 110 }} />
                </div>
              ) : posts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "70px 0" }}>
                  <div className="bp-empty-glyph">✦</div>
                  <div style={{ fontFamily: "Cinzel,serif", fontSize: 22, color: "#fff", marginBottom: 12, fontWeight: 700 }}>
                    Nothing here yet
                  </div>
                  <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>
                    New teachings are on their way. Check back soon.
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 22 }}>

                  {/* Featured — first post */}
                  {posts[0] && (
                    <div className="bp-featured bp-in" style={{ animationDelay: "0.05s" }} onClick={() => openPost(posts[0])}>
                      <div className="bp-featured-inner" style={{ padding: isMobile ? "30px 26px" : "46px 50px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                          <span className="bp-chip" style={{ background: "rgba(245,168,0,0.14)" }}>Latest</span>
                          <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: 13, letterSpacing: 1, color: "rgba(255,255,255,0.3)" }}>
                            {posts[0].author} · {formatDate(posts[0].createdAt)}
                          </span>
                        </div>
                        <h2 style={{
                          fontFamily: "Cinzel,serif", fontWeight: 700,
                          fontSize: isMobile ? 25 : 34, color: "#fff",
                          margin: "0 0 18px", lineHeight: 1.25,
                        }}>
                          {posts[0].title}
                        </h2>
                        <div
                          style={{
                            fontFamily: "Cormorant Garamond,serif",
                            fontSize: isMobile ? 18 : 20,
                            color: "rgba(255,255,255,0.5)", lineHeight: 1.8,
                            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                            marginBottom: 24,
                          }}
                          dangerouslySetInnerHTML={{ __html: posts[0].body }}
                        />
                        <span className="bp-readmore">
                          Read the full piece
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Remaining posts */}
                  {posts.length > 1 && (
                    <div className="bp-spine" style={{ display: "grid", gap: 16, paddingLeft: isMobile ? 0 : 24, marginTop: 6 }}>
                      {posts.slice(1).map((post, i) => (
                        <div
                          key={post.id}
                          className="bp-card bp-in"
                          style={{ padding: isMobile ? "24px 22px" : "28px 32px", animationDelay: `${0.1 + i * 0.06}s` }}
                          onClick={() => openPost(post)}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 13, flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: 12, letterSpacing: 2, color: "#F5A800", textTransform: "uppercase", fontWeight: 700 }}>
                              {post.author}
                            </span>
                            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />
                            <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>
                              {formatDate(post.createdAt)} · {readingTime(post.body)} min read
                            </span>
                          </div>
                          <h2 style={{ fontFamily: "Cinzel,serif", fontSize: isMobile ? 20 : 24, fontWeight: 700, color: "#fff", margin: "0 0 12px", lineHeight: 1.3 }}>
                            {post.title}
                          </h2>
                          <div
                            style={{
                              fontFamily: "Cormorant Garamond,serif",
                              fontSize: isMobile ? 17 : 19,
                              color: "rgba(255,255,255,0.42)", lineHeight: 1.75,
                              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                              marginBottom: 18,
                            }}
                            dangerouslySetInnerHTML={{ __html: post.body }}
                          />
                          <span className="bp-readmore">
                            Read more
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}