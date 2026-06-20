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

// ── Matches your Navbar drawer exactly ──────────────────────────────────────
const footerLinks = [
  {
    heading: "Connect",
    links: [
      { label: "Visit Zoe",    page: "home"      },
      { label: "Live Streams", page: "streams"   },
      { label: "Giving",       page: "give"      },
      { label: "Volunteer",    page: "volunteer" },
      { label: "Need Prayer?", page: "prayer"    },
      { label: "Events",       page: "events"    },
    ],
  },
  {
    heading: "Discover",
    links: [
      { label: "Sermons",      page: "sermons"   },
      { label: "Study Guides", page: "guides"    },
      { label: "Store",        page: "store"     },
      { label: "Blog",         page: "blog"      },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Zoe School",       page: "about"     },
      { label: "Mission & Vision", page: "about"     },
      { label: "Leadership",       page: "about"     },
    ],
  },
];

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1BPBCLT1vq/",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=2ydy17f",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: "Telegram",
    href: "https://t.me/+KtrkQ-ACzkNlNTFk",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@melchizedekololadehassan1591",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@apostlehassan.o?_r=1&_t=ZS-977BxSwHJeq",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
      </svg>
    ),
  },
];

// ── Receives onNavigate from App.jsx, same as Navbar ────────────────────────
export default function Footer({ logo, onNavigate }) {
  const width    = useWidth();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const sidePad  = isMobile ? 24 : isTablet ? 32 : 64;
  const [openIdx, setOpenIdx] = useState(null);

  const goToPage = (page) => {
    if (!page) return;
    onNavigate?.(page);
    // Scroll to top after navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        .footer-link {
          font-family: 'Rajdhani', sans-serif;
          font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          display: block;
          padding: 5px 0;
          transition: color 0.2s;
          letter-spacing: 0.5px;
          cursor: pointer;
          background: none;
          border: none;
          text-align: left;
        }
        .footer-link:hover { color: #F5A800; }

        .social-btn {
          width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: all 0.3s;
          flex-shrink: 0;
        }
        .social-btn:hover {
          border-color: #F5A800;
          color: #F5A800;
          background: rgba(245,168,0,0.08);
        }

        .footer-bottom-link {
          font-family: 'Rajdhani', sans-serif;
          font-size: 12px; letter-spacing: 1px;
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          transition: color 0.2s;
          cursor: pointer;
          background: none;
          border: none;
        }
        .footer-bottom-link:hover { color: #F5A800; }

        .footer-col-heading {
          font-family: 'Cinzel', serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #F5A800;
          margin-bottom: 22px;
          position: relative;
          padding-bottom: 14px;
        }
        .footer-col-heading::after {
          content: "";
          position: absolute;
          left: 0; bottom: 0;
          width: 28px; height: 2px;
          background: #F5A800;
          opacity: 0.5;
        }

        .footer-accordion-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: none;
          border: none;
          padding: 18px 0;
          cursor: pointer;
          font-family: 'Cinzel', serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #F5A800;
        }
        .footer-accordion-chevron {
          transition: transform 0.3s ease;
          color: rgba(245,168,0,0.6);
          flex-shrink: 0;
        }
        .footer-accordion-chevron.open { transform: rotate(180deg); }
        .footer-accordion-body {
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        .footer-accordion-section {
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .footer-accordion-section:first-child {
          border-top: 1px solid rgba(255,255,255,0.06);
          margin-top: 8px;
        }
      `}</style>

      <footer style={{
        background: "#050505",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Ambient glow */}
        <div style={{
          position: "absolute", top: -200, right: -150,
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,168,0,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Main body */}
        <div style={{
          padding: `${isMobile ? 56 : 88}px ${sidePad}px ${isMobile ? 40 : 64}px`,
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : isTablet
            ? "1.4fr 1fr 1fr"
            : "minmax(280px, 1.4fr) 1fr 1fr 1fr",
          columnGap: isMobile ? 0 : isTablet ? 40 : 64,
          rowGap: isMobile ? 40 : 0,
          position: "relative", zIndex: 1,
          maxWidth: 1440, margin: "0 auto",
          alignItems: "start",
        }}>

          {/* LEFT: Logo + tagline + contact + socials */}
          <div style={{
            gridColumn: isTablet ? "1 / -1" : "auto",
            marginBottom: 0,
            paddingRight: isMobile || isTablet ? 0 : 24,
            textAlign: isMobile ? "center" : "left",
            display: "flex", flexDirection: "column",
            alignItems: isMobile ? "center" : "flex-start",
          }}>
            {logo ? (
              <img src={logo} alt="Zoe School of Mysteries"
                style={{ height: 52, objectFit: "contain", marginBottom: 22, cursor: "pointer" }}
                onClick={() => goToPage("home")}
              />
            ) : (
              <div
                onClick={() => goToPage("home")}
                style={{
                  fontFamily: "Cinzel, serif", fontSize: 22, fontWeight: 900,
                  color: "#F5A800", marginBottom: 22, letterSpacing: 2, cursor: "pointer",
                }}>
                ZOE SCHOOL
              </div>
            )}

            <p style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: 17, fontWeight: 300, fontStyle: "italic",
              color: "rgba(255,255,255,0.42)",
              lineHeight: 1.85, marginBottom: 32,
              maxWidth: isMobile ? 320 : 340,
            }}>
              A sacred space where divine wisdom, technology, and purpose
              converge — shaping lives for eternity.
            </p>

            {/* Contact */}
            <div style={{
              display: "flex", flexWrap: "wrap",
              gap: isMobile ? "24px 40px" : isTablet ? 48 : 32,
              marginBottom: 32,
              justifyContent: isMobile ? "center" : "flex-start",
            }}>
              <div style={{ textAlign: isMobile ? "center" : "left" }}>
                <div style={{
                  fontFamily: "Cinzel, serif", fontSize: 10, fontWeight: 700,
                  letterSpacing: 2, textTransform: "uppercase",
                  color: "rgba(255,255,255,0.28)", marginBottom: 8,
                }}>Location</div>
                <div style={{
                  fontFamily: "Rajdhani, sans-serif", fontSize: 14,
                  color: "rgba(255,255,255,0.5)", lineHeight: 1.6, letterSpacing: 0.5,
                }}>Lagos, Nigeria</div>
              </div>
              <div style={{ textAlign: isMobile ? "center" : "left" }}>
                <div style={{
                  fontFamily: "Cinzel, serif", fontSize: 10, fontWeight: 700,
                  letterSpacing: 2, textTransform: "uppercase",
                  color: "rgba(255,255,255,0.28)", marginBottom: 8,
                }}>Phone</div>
                <div style={{
                  fontFamily: "Rajdhani, sans-serif", fontSize: 14,
                  color: "rgba(255,255,255,0.5)", letterSpacing: 0.5, lineHeight: 1.6,
                }}>
                  +234 703 610 0912<br />+234 817 929 7984
                </div>
              </div>
            </div>

            {/* Socials — always open in new tab */}
            <div style={{
              display: "flex", gap: 12, flexWrap: "wrap",
              justifyContent: isMobile ? "center" : "flex-start",
            }}>
              {socials.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="social-btn" title={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {isMobile ? (
            <div style={{ gridColumn: "1 / -1" }}>
              {footerLinks.map((col, i) => {
                const open = openIdx === i;
                return (
                  <div key={i} className="footer-accordion-section">
                    <button
                      className="footer-accordion-btn"
                      onClick={() => setOpenIdx(open ? null : i)}
                      aria-expanded={open}
                    >
                      {col.heading}
                      <svg
                        className={`footer-accordion-chevron ${open ? "open" : ""}`}
                        width="14" height="14" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    <div
                      className="footer-accordion-body"
                      style={{ maxHeight: open ? col.links.length * 44 + 8 : 0 }}
                    >
                      <div style={{ paddingBottom: 12, textAlign: "center" }}>
                        {col.links.map((link, j) => (
                          <button key={j} className="footer-link"
                            style={{ padding: "8px 0", width: "100%" }}
                            onClick={() => goToPage(link.page)}>
                            {link.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            footerLinks.map((col, i) => (
              <div key={i}>
                <div className="footer-col-heading">{col.heading}</div>
                {col.links.map((link, j) => (
                  <button key={j} className="footer-link"
                    onClick={() => goToPage(link.page)}>
                    {link.label}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

        {/* Bottom bar */}
        <div style={{
          padding: isMobile ? "28px 24px" : `24px ${sidePad}px`,
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 16 : 0,
          maxWidth: 1440, margin: "0 auto",
          position: "relative", zIndex: 1,
          textAlign: isMobile ? "center" : "left",
        }}>
          <div style={{
            display: "flex", gap: 24, flexWrap: "wrap",
            justifyContent: "center", order: isMobile ? 1 : 2,
          }}>
            {[
              { label: "Contact Us", page: "issues" },
              { label: "Terms",      page: "terms"  },
              { label: "Privacy",    page: "privacy" },
            ].map(({ label, page }, i) => (
              <button key={i} className="footer-bottom-link"
                onClick={() => goToPage(page)}>
                {label}
              </button>
            ))}
          </div>

          <div style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: 12, letterSpacing: 1,
            color: "rgba(255,255,255,0.25)",
            order: isMobile ? 2 : 1,
          }}>
            © 2026 Zoe School of Mysteries. All Rights Reserved.
          </div>
        </div>

      </footer>
    </>
  );
}