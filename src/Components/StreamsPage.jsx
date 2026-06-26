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

// ─────────────────────────────────────────────────────────────────
// CONFIG — update these whenever you go live
// ─────────────────────────────────────────────────────────────────

const YOUTUBE_CHANNEL_ID   = "UC4YA6MGcBrBeRzl2Q7WroTA";
const YOUTUBE_LIVE_VIDEO_ID = ""; // e.g. "abc123XYZ" — leave empty when not live
const FACEBOOK_PAGE_URL    = "https://www.facebook.com/share/1BPBCLT1vq/";
const WHATSAPP_GROUP_LINK  = "https://chat.whatsapp.com/FKZqlGXZwXv39iFFqfa9N4";
const TELEGRAM_LINK        = "https://t.me/+KtrkQ-ACzkNlNTFk";
const YOUTUBE_CHANNEL_URL  = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`;

// ─────────────────────────────────────────────────────────────────
// PAST STREAMS
// ─────────────────────────────────────────────────────────────────
const pastStreams = [
  {
    title: "The Power of the Resurrection",
    speaker: "Apostle Hassan Ololade Melchizedek",
    date: "Mar 30, 2025",
    youtubeId: "rHtWdsjE854",
    tag: "Sermon",
  },
  {
    title: "Walking in Divine Authority",
    speaker: "Apostle Daniel",
    date: "Mar 23, 2025",
    youtubeId: "Vqp7cAsF5Uo",
    tag: "Teaching",
  },
  {
    title: "Youth Night — Fire & Faith",
    speaker: "Apostle Hassan Ololade Melchizedek",
    date: "Mar 20, 2025",
    youtubeId: "OK3y6eQbk5Q",
    tag: "Youth",
  },
  {
    title: "Secular Education Vs Divine Education",
    speaker: "Hassan Ololade Melchizedek",
    date: "Mar 14, 2025",
    youtubeId: "RgyeTfOi1xE",
    tag: "Conference",
  },
];

const filters = ["All", "Sermon", "Teaching", "Worship", "Youth", "Conference", "Course"];

// SVG icons
const YTIcon = ({ w = 16, h = 12 }) => (
  <svg width={w} height={h} viewBox="0 0 576 512" fill="currentColor">
    <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/>
  </svg>
);
const FBIcon = ({ w = 14, h = 14 }) => (
  <svg width={w} height={h} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const WAIcon = ({ w = 16, h = 16 }) => (
  <svg width={w} height={h} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.113 1.523 5.845L0 24l6.29-1.507A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.8a9.8 9.8 0 01-5.032-1.384l-.36-.214-3.737.895.957-3.607-.236-.374A9.8 9.8 0 012.2 12C2.2 6.589 6.589 2.2 12 2.2c5.41 0 9.8 4.389 9.8 9.8 0 5.41-4.39 9.8-9.8 9.8z"/>
  </svg>
);
const TGIcon = ({ w = 16, h = 16 }) => (
  <svg width={w} height={h} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
  </svg>
);
const PlayGlyph = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M7 4.5v15l13-7.5L7 4.5z" fill="currentColor"/>
  </svg>
);
const ExternalIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

export default function StreamsPage() {
  const width    = useWidth();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const sidePad  = isMobile ? 24 : isTablet ? 48 : 88;
  const secPad   = isMobile ? 64 : 120;

  const [activeFilter, setActiveFilter] = useState("All");
  const [notifyModal,  setNotifyModal]  = useState(false);

  const filtered = activeFilter === "All"
    ? pastStreams
    : pastStreams.filter(s => s.tag === activeFilter);

  const ytEmbedSrc = YOUTUBE_LIVE_VIDEO_ID
    ? `https://www.youtube.com/embed/${YOUTUBE_LIVE_VIDEO_ID}?autoplay=0&rel=0`
    : `https://www.youtube.com/embed/live_stream?channel=${YOUTUBE_CHANNEL_ID}&autoplay=0`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Rajdhani:wght@500;600;700&display=swap');

        @keyframes sp-fadeUp   { from{opacity:0; transform:translateY(28px)} to{opacity:1; transform:translateY(0)} }
        @keyframes sp-shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes sp-floatIn  { from{opacity:0; transform:translateY(-12px)} to{opacity:1; transform:translateY(0)} }

        .sp-page { animation: sp-fadeUp 0.8s ease forwards; font-family:'Rajdhani',sans-serif; background:#000; font-size:17px; }
        .sp-in { opacity:0; animation: sp-fadeUp 0.8s ease forwards; }

        .sp-eyebrow {
          display:flex; align-items:center; gap:14px; margin-bottom:22px;
          font-size:14px; letter-spacing:5px; text-transform:uppercase; color:#F5A800;
          font-weight:600;
        }
        .sp-eyebrow-line { width:32px; height:1px; background:linear-gradient(to right,#F5A800,transparent); }

        .sp-gold {
          background:linear-gradient(90deg,#C88600 0%,#F5A800 35%,#FFD166 55%,#F5A800 75%,#C88600 100%);
          background-size:200% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          animation: sp-shimmer 5s linear infinite;
        }

        /* Video frame */
        .sp-video-frame {
          position:relative; width:100%; padding-top:56.25%;
          background:#050505; overflow:hidden;
        }
        .sp-video-frame iframe { position:absolute; inset:0; width:100%; height:100%; border:none; }

        /* Connect row — text links */
        .sp-connect-link {
          display:inline-flex; align-items:center; gap:8px;
          font-size:14px; letter-spacing:1.5px; font-weight:600; text-transform:uppercase;
          text-decoration:none; color:rgba(255,255,255,0.45);
          transition: color 0.25s; padding-bottom:2px; border-bottom:1px solid transparent;
        }
        .sp-connect-link:hover { color:#F5A800; border-bottom-color:rgba(245,168,0,0.4); }

        /* Filter — text-based, underline active state */
        .sp-filter {
          font-size:14px; letter-spacing:2px; font-weight:600; text-transform:uppercase;
          padding:0 0 8px; cursor:pointer; border:none; background:transparent;
          color:rgba(255,255,255,0.3); border-bottom:1px solid transparent;
          transition: color 0.25s, border-color 0.25s; white-space:nowrap;
        }
        .sp-filter:hover { color:rgba(255,255,255,0.65); }
        .sp-filter.active { color:#F5A800; border-bottom-color:#F5A800; }

        /* Past stream row */
        .sp-row {
          display:grid;
          border-top:1px solid rgba(255,255,255,0.07);
          transition: background 0.4s;
        }
        .sp-row:hover { background: rgba(245,168,0,0.02); }
        .sp-row:last-child { border-bottom:1px solid rgba(255,255,255,0.07); }

        .sp-row-thumb {
          position:relative; overflow:hidden; background:#050505;
        }
        .sp-row-thumb iframe { position:absolute; inset:0; width:100%; height:100%; border:none; }

        .sp-row-watch {
          display:inline-flex; align-items:center; gap:8px;
          font-size:14px; letter-spacing:2px; font-weight:600; text-transform:uppercase;
          text-decoration:none; color:rgba(255,255,255,0.4);
          transition: color 0.25s, gap 0.25s;
        }
        .sp-row:hover .sp-row-watch { color:#F5A800; gap:13px; }

        /* CTA links */
        .sp-cta-link {
          display:flex; align-items:center; justify-content:space-between;
          padding:24px 0; border-top:1px solid rgba(255,255,255,0.08);
          text-decoration:none; color:#fff;
          font-size:18px; letter-spacing:1px; font-weight:600;
          transition: padding-left 0.3s, color 0.3s;
        }
        .sp-cta-link:hover { padding-left:10px; color:#F5A800; }
        .sp-cta-link:last-child { border-bottom:1px solid rgba(255,255,255,0.08); }
        .sp-cta-arrow { transition: transform 0.3s; flex-shrink:0; }
        .sp-cta-link:hover .sp-cta-arrow { transform:translateX(6px); }

        /* Modal */
        .sp-modal-overlay {
          position:fixed; inset:0; z-index:9999;
          background:rgba(0,0,0,0.92);
          display:flex; align-items:center; justify-content:center;
          padding:20px; animation: sp-fadeUp 0.25s ease;
        }
        .sp-modal-box {
          background:#070500; border:1px solid rgba(245,168,0,0.18);
          padding:52px 44px; max-width:460px; width:100%;
          animation: sp-floatIn 0.3s ease; position:relative;
        }
        .sp-modal-link {
          display:flex; align-items:center; justify-content:space-between;
          padding:18px 0; border-top:1px solid rgba(255,255,255,0.08);
          text-decoration:none; color:rgba(255,255,255,0.7);
          font-size:15px; letter-spacing:2px; text-transform:uppercase; font-weight:600;
          transition: color 0.25s, padding-left 0.3s;
        }
        .sp-modal-link:last-of-type { border-bottom:1px solid rgba(255,255,255,0.08); }
        .sp-modal-link:hover { color:#F5A800; padding-left:6px; }

        @media (max-width: 720px) {
          .sp-row { grid-template-columns: 1fr !important; }
          .sp-row-thumb { padding-top:56.25%; }
        }
      `}</style>

      {/* ══════════════════════════════════════
          NOTIFY MODAL
      ══════════════════════════════════════ */}
      {notifyModal && (
        <div className="sp-modal-overlay" onClick={() => setNotifyModal(false)}>
          <div className="sp-modal-box" onClick={e => e.stopPropagation()}>
            <button onClick={() => setNotifyModal(false)} style={{
              position:"absolute", top:20, right:22,
              background:"none", border:"none",
              color:"rgba(255,255,255,0.35)", cursor:"pointer", fontSize:24, lineHeight:1,
            }}>✕</button>

            <div className="sp-eyebrow"><span className="sp-eyebrow-line"/>Stay Connected</div>
            <h3 style={{
              fontFamily:"Cinzel,serif", fontSize:30, fontWeight:700,
              color:"#fff", marginBottom:16, lineHeight:1.2,
            }}>Never Miss<br/>A Service</h3>
            <p style={{
              fontFamily:"Cormorant Garamond,serif", fontSize:19, fontStyle:"italic",
              color:"rgba(255,255,255,0.45)", marginBottom:10, lineHeight:1.7,
            }}>
              Choose a channel below. All instant, all free.
            </p>

            <div style={{ display:"flex", flexDirection:"column" }}>
              <a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noopener noreferrer" className="sp-modal-link">
                WhatsApp Group <WAIcon w={18} h={18}/>
              </a>
              <a href={`https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}?sub_confirmation=1`}
                target="_blank" rel="noopener noreferrer" className="sp-modal-link">
                Subscribe — YouTube <YTIcon w={18} h={14}/>
              </a>
              <a href={FACEBOOK_PAGE_URL} target="_blank" rel="noopener noreferrer" className="sp-modal-link">
                Follow — Facebook <FBIcon w={17} h={17}/>
              </a>
              <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer" className="sp-modal-link">
                Telegram Channel <TGIcon w={18} h={18}/>
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="sp-page" style={{
        paddingTop:isMobile ? 130 : 76,
        paddingBottom:isMobile ? 80 : 0,
      }}>

        {/* ══════════════════════════════════════
            1. HERO
        ══════════════════════════════════════ */}
        <section style={{
          padding:`${isMobile ? 64 : 140}px ${sidePad}px ${isMobile ? 56 : 100}px`,
          borderBottom:"1px solid rgba(245,168,0,0.08)",
          position:"relative", overflow:"hidden",
        }}>
          <div style={{
            position:"absolute", top:"-30%", right:"5%",
            width:560, height:560, borderRadius:"50%",
            background:"radial-gradient(circle,rgba(107,33,168,0.14) 0%,transparent 70%)",
            pointerEvents:"none",
          }}/>

          <div style={{ position:"relative", zIndex:1, maxWidth:980 }}>
            <div className="sp-eyebrow sp-in" style={{ animationDelay:"0s" }}>
              <span className="sp-eyebrow-line"/>Live Streaming
            </div>

            <h1 className="sp-in" style={{
              fontFamily:"Cinzel,serif", fontWeight:900,
              fontSize:isMobile ? "clamp(40px,13vw,56px)" : "clamp(64px,9vw,124px)",
              lineHeight:0.96, color:"#fff", margin:0,
              letterSpacing:"-2px", animationDelay:"0.1s",
            }}>
              <span className="sp-gold">Presence</span><br/>
              has no<br/>
              <span style={{ fontStyle:"normal", color:"transparent", WebkitTextStroke:"1.5px rgba(255,255,255,0.85)" }}>
                distance
              </span>
            </h1>

            <div className="sp-in" style={{
              display:"flex", alignItems:isMobile ? "flex-start" : "flex-end",
              justifyContent:"space-between", flexDirection:isMobile ? "column" : "row",
              gap:32, marginTop:48, animationDelay:"0.25s",
            }}>
              <p style={{
                fontFamily:"Cormorant Garamond,serif", fontSize:isMobile ? 19 : 23,
                fontWeight:300, fontStyle:"italic", color:"rgba(255,255,255,0.55)",
                maxWidth:440, lineHeight:1.8, margin:0,
              }}>
                Every Sunday, and every special service — streamed in full,
                wherever you happen to be standing.
              </p>

              <div style={{ display:"flex", gap:28, flexWrap:"wrap" }}>
                <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="sp-connect-link">
                  <YTIcon w={16} h={12}/> YouTube
                </a>
                <a href={FACEBOOK_PAGE_URL} target="_blank" rel="noopener noreferrer" className="sp-connect-link">
                  <FBIcon w={15} h={15}/> Facebook
                </a>
                <button onClick={() => setNotifyModal(true)} style={{
                  background:"none", border:"none", cursor:"pointer", padding:0,
                }} className="sp-connect-link">
                  Get Notified →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            2. LIVE PLAYER
        ══════════════════════════════════════ */}
        <section id="player" style={{
          padding:`${secPad}px ${sidePad}px`,
          background:"#020202",
        }}>
          <div style={{
            display:"grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1fr) 280px",
            gap: isMobile ? 36 : 64,
          }}>
            {/* Player column */}
            <div>
              <div className="sp-eyebrow"><span className="sp-eyebrow-line"/>This Sunday</div>
              <h2 style={{
                fontFamily:"Cinzel,serif", fontWeight:700,
                fontSize:isMobile ? 32 : isTablet ? 40 : 50,
                color:"#fff", marginBottom:32, lineHeight:1.1,
              }}>
                Sunday Worship<br/>Experience
              </h2>

              {/* YouTube live embed */}
              <div style={{ marginBottom:32 }}>
                <div style={{
                  display:"flex", alignItems:"center", gap:10, marginBottom:16,
                }}>
                  <YTIcon w={16} h={13}/>
                  <span style={{
                    fontSize:14, letterSpacing:3, textTransform:"uppercase",
                    fontWeight:600, color:"rgba(255,255,255,0.55)",
                  }}>Live on YouTube</span>
                </div>
                <div className="sp-video-frame">
                  <iframe
                    key="yt-live"
                    src={ytEmbedSrc}
                    title="YouTube Live"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div style={{ display:"flex", gap:28, marginTop:18, flexWrap:"wrap" }}>
                  <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="sp-connect-link">
                    <YTIcon w={14} h={11}/> Comment on YouTube
                  </a>
                  <a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noopener noreferrer" className="sp-connect-link">
                    <WAIcon w={14} h={14}/> WhatsApp Group
                  </a>
                </div>
              </div>

              {/* Facebook — direct link block */}
              <div>
                <div style={{
                  display:"flex", alignItems:"center", gap:10, marginBottom:16,
                }}>
                  <FBIcon w={14} h={14}/>
                  <span style={{
                    fontSize:14, letterSpacing:3, textTransform:"uppercase",
                    fontWeight:600, color:"rgba(255,255,255,0.55)",
                  }}>Also Live on Facebook</span>
                </div>
                <div style={{
                  position:"relative", width:"100%", paddingTop:"22%",
                  minHeight:120,
                  background:"linear-gradient(135deg,#0d1b2e 0%,#0f2342 100%)",
                  border:"1px solid rgba(24,119,242,0.2)",
                  overflow:"hidden",
                }}>
                  <div style={{
                    position:"absolute", top:"-40%", right:"-5%",
                    width:200, height:200, borderRadius:"50%",
                    background:"radial-gradient(circle,rgba(24,119,242,0.12) 0%,transparent 70%)",
                    pointerEvents:"none",
                  }}/>
                  <div style={{
                    position:"absolute", inset:0,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    flexDirection:"column", gap:14,
                    padding:24,
                  }}>
                    <p style={{
                      fontFamily:"Cormorant Garamond,serif", fontSize:17, fontStyle:"italic",
                      color:"rgba(255,255,255,0.45)", margin:0, textAlign:"center", lineHeight:1.6,
                    }}>
                      We stream simultaneously on Facebook. Watch and join the conversation there.
                    </p>
                    <a
                      href={FACEBOOK_PAGE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display:"inline-flex", alignItems:"center", gap:10,
                        fontFamily:"Rajdhani,sans-serif", fontSize:15, letterSpacing:2.5,
                        fontWeight:700, textTransform:"uppercase", textDecoration:"none",
                        color:"#fff", padding:"12px 26px",
                        border:"1px solid rgba(24,119,242,0.5)",
                        background:"rgba(24,119,242,0.1)",
                        transition:"background 0.25s, border-color 0.25s",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "rgba(24,119,242,0.22)";
                        e.currentTarget.style.borderColor = "rgba(24,119,242,0.85)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "rgba(24,119,242,0.1)";
                        e.currentTarget.style.borderColor = "rgba(24,119,242,0.5)";
                      }}
                    >
                      <FBIcon w={15} h={15}/> Watch on Facebook <ExternalIcon size={13}/>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Side note column */}
            <div style={{
              borderLeft: isMobile ? "none" : "1px solid rgba(255,255,255,0.08)",
              borderTop: isMobile ? "1px solid rgba(255,255,255,0.08)" : "none",
              paddingLeft: isMobile ? 0 : 36,
              paddingTop: isMobile ? 28 : 0,
            }}>
              <p style={{
                fontFamily:"Cormorant Garamond,serif", fontSize:19, fontStyle:"italic",
                color:"rgba(255,255,255,0.45)", lineHeight:1.85, marginBottom:26,
              }}>
                Service streams in real time on both platforms. YouTube carries
                the embedded live player here. For Facebook, tap the link to
                join directly on their platform.
              </p>
              <div style={{ width:32, height:1, background:"rgba(245,168,0,0.3)", marginBottom:26 }}/>
              <p style={{
                fontFamily:"Rajdhani,sans-serif", fontSize:15, letterSpacing:1,
                color:"rgba(224, 213, 213, 0.97)", lineHeight:1.8,
              }}>
                Services typically begin at 9:00am WAT. Recordings are published
                to the archive below within a few hours of close.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            3. PAST STREAMS
        ══════════════════════════════════════ */}
        <section style={{
          padding:`${secPad}px ${sidePad}px`,
          background:"#000",
        }}>
          <div style={{
            display:"flex", alignItems:isMobile ? "flex-start" : "flex-end",
            justifyContent:"space-between", flexDirection:isMobile ? "column" : "row",
            gap:24, marginBottom:isMobile ? 36 : 56,
          }}>
            <div>
              <div className="sp-eyebrow"><span className="sp-eyebrow-line"/>Archive</div>
              <h2 style={{
                fontFamily:"Cinzel,serif", fontWeight:700,
                fontSize:isMobile ? 30 : 46, color:"#fff", margin:0,
              }}>Past Streams</h2>
            </div>

            <div style={{ display:"flex", gap:isMobile ? 18 : 28, flexWrap:"wrap", overflowX:"auto" }}>
              {filters.map(f => (
                <button key={f} className={`sp-filter ${activeFilter===f ? "active" : ""}`} onClick={() => setActiveFilter(f)}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Rows */}
          <div>
            {filtered.map((s, i) => (
              <div key={i} className="sp-row" style={{
                gridTemplateColumns: isMobile ? "1fr" : "280px 1fr auto",
                gap: isMobile ? 18 : 36,
                alignItems:"center",
                padding: isMobile ? "22px 0" : "32px 0",
              }}>
                <div className="sp-row-thumb" style={{ paddingTop: isMobile ? "56.25%" : 0, aspectRatio: isMobile ? "auto" : "16/9" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${s.youtubeId}?rel=0&modestbranding=1`}
                    title={s.title} loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                <div>
                  <div style={{
                    fontSize:13, letterSpacing:2.5, textTransform:"uppercase", fontWeight:700,
                    color:"#F5A800", marginBottom:10,
                  }}>{s.tag} · {s.date}</div>
                  <div style={{
                    fontFamily:"Cinzel,serif", fontSize:isMobile ? 18 : 22,
                    fontWeight:700, color:"#fff", marginBottom:8, lineHeight:1.3,
                  }}>{s.title}</div>
                  <div style={{
                    fontFamily:"Cormorant Garamond,serif", fontSize:17, fontStyle:"italic",
                    color:"rgba(255,255,255,0.45)",
                  }}>{s.speaker}</div>
                </div>

                <a href={`https://www.youtube.com/watch?v=${s.youtubeId}`} target="_blank" rel="noopener noreferrer"
                  className="sp-row-watch" style={{ justifySelf: isMobile ? "start" : "end" }}>
                  <PlayGlyph size={17}/> Watch
                </a>
              </div>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:60 }}>
            <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="sp-connect-link" style={{ fontSize:15, letterSpacing:3 }}>
              View Full Archive on YouTube →
            </a>
          </div>
        </section>

        {/* ══════════════════════════════════════
            4. GET NOTIFIED
        ══════════════════════════════════════ */}
        <section style={{
          padding:`${secPad}px ${sidePad}px`,
          borderTop:"1px solid rgba(245,168,0,0.08)",
          position:"relative", overflow:"hidden",
        }}>
          <div style={{
            position:"absolute", bottom:"-30%", left:"10%",
            width:420, height:420, borderRadius:"50%",
            background:"radial-gradient(circle,rgba(245,168,0,0.06) 0%,transparent 70%)",
            pointerEvents:"none",
          }}/>

          <div style={{ position:"relative", zIndex:1, maxWidth:700 }}>
            <div className="sp-eyebrow"><span className="sp-eyebrow-line"/>Stay Connected</div>
            <h2 style={{
              fontFamily:"Cinzel,serif", fontWeight:700,
              fontSize:isMobile ? 30 : 48, color:"#fff",
              marginBottom:20, lineHeight:1.15,
            }}>
              Get notified<br/>before we go live.
            </h2>
            <p style={{
              fontFamily:"Cormorant Garamond,serif", fontSize:isMobile ? 18 : 21,
              fontStyle:"italic", color:"rgba(255,255,255,0.45)",
              maxWidth:500, marginBottom:10, lineHeight:1.8,
            }}>
              Every service, announced where you already are.
            </p>

            <div>
              <a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noopener noreferrer" className="sp-cta-link">
                WhatsApp Group
                <span className="sp-cta-arrow"><WAIcon w={20} h={20}/></span>
              </a>
              <a href={`https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}?sub_confirmation=1`}
                target="_blank" rel="noopener noreferrer" className="sp-cta-link">
                Subscribe on YouTube
                <span className="sp-cta-arrow"><YTIcon w={20} h={16}/></span>
              </a>
              <a href={FACEBOOK_PAGE_URL} target="_blank" rel="noopener noreferrer" className="sp-cta-link">
                Follow on Facebook
                <span className="sp-cta-arrow"><FBIcon w={18} h={18}/></span>
              </a>
              <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer" className="sp-cta-link">
                Telegram Channel
                <span className="sp-cta-arrow"><TGIcon w={20} h={20}/></span>
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}