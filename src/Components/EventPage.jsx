// import { useState, useEffect, useRef } from "react";

// /* ───────────────────────── DATA ───────────────────────── */

// const events = [
//   {
//     id: 1,
//     tag: "Annual Conference",
//     title: "Evolve 2025 — The Language of Mastery",
//     dateLabel: "24 – 30 November, 2025",
//     startDate: new Date("2025-11-24"),
//     endDate: new Date("2025-11-30"),
//     location: "Ikorodu, Lagos, Nigeria (Online & Onsite)",
//     desc: "A week of insight meetings where lights converge, kings emerge, and priesthood becomes culture. Featuring Apostle Othniel Ikechukwu, Apostle Hassan Melchizedek, Apostle Daniel Wesonga, Rabbi Smith Cosmos, Prophet Abiola Paul Oyeniyi and Nick Graceman.",
//     accentColor: "#F5A800",
//     bgColor: "#1a0533",
//     textColor: "#fff",
//     image: "/images/photo_2026-06-11_14-39-41.jpg",
//     type: "conference",
//   },
//   {
//     id: 2,
//     tag: "Camping",
//     title: "Evolve — 3rd Year Anniversary",
//     dateLabel: "26 – 30 September",
//     startDate: new Date("2025-09-26"),
//     endDate: new Date("2025-09-30"),
//     location: "Unity Estate, Off Engineer Road, Ojota Temu, Lagos",
//     desc: "5 days of camping centered on equipping, activation, impartation, transfiguration and physical blessings, with Pst. Clem Aigbe, Pst. Taiwo Akinkemi, Nick Graceman, D-Dam and other ancients. Rooms available at a cheap price.",
//     accentColor: "#c0392b",
//     bgColor: "#0a0a0a",
//     textColor: "#fff",
//     image: "/images/photo_2026-06-11_14-37-23.jpg",
//     type: "camp",
//   },
//   {
//     id: 3,
//     tag: "Prophetic Summons",
//     title: "The Days of the Saints",
//     dateLabel: "27 July – 2 August, 2026",
//     startDate: new Date("2026-07-27"),
//     endDate: new Date("2026-08-02"),
//     location: "Online & Onsite — details released closer to the date",
//     desc: "A mystical gathering built on Romans 8:19 — mystical, quality, excellence. A prophetic summons to be equipped, to transform culture, and to reveal Christ.",
//     accentColor: "#9333EA",
//     bgColor: "#0d0014",
//     textColor: "#fff",
//     image: "/images/photo_2026-06-09_14-40-37.jpg",
//     type: "summit",
//   },
//   {
//     id: 4,
//     tag: "Executive Classes",
//     title: "One-on-One Executive Classes — August 2026 Cohort",
//     dateLabel: "August 2026 Cohort",
//     startDate: new Date("2026-08-01"),
//     endDate: new Date("2026-08-31"),
//     location: "On Demand — Online",
//     desc: "Practical, precise, life-shaping one-on-one impartation sessions on your terms and on demand. Just 12 slots available at $200 per slot; next access opens in the following cohort.",
//     accentColor: "#F5A800",
//     bgColor: "#0a0a0a",
//     textColor: "#fff",
//     image: "/images/photo_2026-06-09_14-40-46.jpg",
//     type: "class",
//   },
//   {
//     id: 5,
//     tag: "Daily",
//     title: "Meditation",
//     recurring: "Monday – Friday, 6AM Daily · Sunday 7AM WAT",
//     location: "Zoe School of Mysteries — Telegram",
//     desc: "A daily meeting point for stillness and prophetic alignment — six mornings a week on Telegram.",
//     accentColor: "#F5A800",
//     bgColor: "#0d0014",
//     textColor: "#fff",
//     image: "/images/photo_2026-06-11_13-50-33.jpg",
//     type: "daily",
//   },
// ];

// function categorize(list, now = new Date()) {
//   const upcoming = [], past = [], daily = [];
//   list.forEach((ev) => {
//     if (ev.type === "daily" || ev.recurring) { daily.push(ev); return; }
//     const end = ev.endDate || ev.startDate;
//     if (end && end < now) past.push(ev); else upcoming.push(ev);
//   });
//   upcoming.sort((a, b) => a.startDate - b.startDate);
//   past.sort((a, b) => b.startDate - a.startDate);
//   return { upcoming, past, daily };
// }

// /* ───────────────────────── HOOKS ───────────────────────── */

// function useWindowWidth() {
//   const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
//   useEffect(() => {
//     const h = () => setW(window.innerWidth);
//     window.addEventListener("resize", h);
//     return () => window.removeEventListener("resize", h);
//   }, []);
//   return w;
// }

// function formatDay(date) { return date.toLocaleDateString("en-US", { day: "2-digit" }); }
// function formatMonth(date) { return date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(); }

// /* ───────────────────────── CAROUSEL (homepage section) ───────────────────────── */

// function EventsCarousel({ onSeeMore }) {
//   const [current, setCurrent] = useState(0);
//   const width = useWindowWidth();
//   const touchStartX = useRef(null);
//   const touchEndX = useRef(null);
//   const touchStartY = useRef(null);
//   const wrapperRef = useRef(null);
//   const MIN_SWIPE = 50;

//   const { upcoming, daily, past } = categorize(events);
//   const carouselEvents = [...upcoming, ...daily, ...past];

//   const getVisible = () => {
//     if (width < 480) return 1;
//     if (width < 768) return 1.2;
//     if (width < 1024) return 2;
//     if (width < 1280) return 2.5;
//     return 3;
//   };

//   const visible = getVisible();
//   const maxIndex = Math.max(0, carouselEvents.length - Math.floor(visible));
//   const isFirst = current === 0;
//   const isLast = current >= maxIndex;

//   const prev = () => { if (!isFirst) setCurrent((c) => c - 1); };
//   const next = () => { if (!isLast) setCurrent((c) => c + 1); };

//   useEffect(() => {
//     const el = wrapperRef.current;
//     if (!el) return;
//     const handleMove = (e) => {
//       if (touchStartX.current === null) return;
//       const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
//       const dy = Math.abs(e.touches[0].clientY - (touchStartY.current || 0));
//       if (dx > dy) { e.preventDefault(); touchEndX.current = e.touches[0].clientX; }
//     };
//     el.addEventListener("touchmove", handleMove, { passive: false });
//     return () => el.removeEventListener("touchmove", handleMove);
//   }, []);

//   const onTouchStart = (e) => {
//     touchStartX.current = e.targetTouches[0].clientX;
//     touchStartY.current = e.targetTouches[0].clientY;
//     touchEndX.current = null;
//   };
//   const onTouchEnd = () => {
//     if (touchStartX.current === null || touchEndX.current === null) return;
//     const diff = touchStartX.current - touchEndX.current;
//     if (Math.abs(diff) >= MIN_SWIPE) { diff > 0 ? next() : prev(); }
//     touchStartX.current = null; touchEndX.current = null; touchStartY.current = null;
//   };

//   const sidePad = width < 480 ? 20 : width < 768 ? 32 : 64;
//   const trackWidth = width - sidePad * 2;
//   const gap = width < 480 ? 16 : 24;
//   const cardWidth = (trackWidth - gap * (Math.ceil(visible) - 1)) / visible;
//   const translateX = current * (cardWidth + gap);
//   const now = new Date();

//   return (
//     <section style={{ background: "#0A0A0A", padding: `${width < 768 ? 64 : 100}px 0`, overflow: "hidden" }}>
//       <div style={{ padding: `0 ${sidePad}px`, marginBottom: width < 768 ? 32 : 48 }}>
//         <div style={{
//           display: "flex",
//           alignItems: width < 640 ? "flex-start" : "flex-end",
//           justifyContent: "space-between",
//           flexDirection: width < 640 ? "column" : "row",
//           gap: 24,
//         }}>
//           <div>
//             <div style={{
//               display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
//               fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 5,
//               textTransform: "uppercase", color: "#F5A800",
//             }}>
//               <span style={{ width: 28, height: 1, background: "#F5A800", display: "inline-block" }} />
//               Connect
//             </div>
//             <h2 style={{
//               fontFamily: "Cinzel, serif",
//               fontSize: width < 480 ? 24 : width < 768 ? 30 : 42,
//               fontWeight: 700, lineHeight: 1.15, marginBottom: 12, color: "#fff",
//             }}>
//               Discover More Ways<br />To Connect
//             </h2>
//             <p style={{
//               fontFamily: "Cormorant Garamond, serif",
//               fontSize: width < 480 ? 15 : 17, fontWeight: 300, fontStyle: "italic",
//               color: "rgba(255,255,255,0.5)", maxWidth: 460, lineHeight: 1.7,
//             }}>
//               There are always new ways to participate — events, tours, worship music, and so much more.
//             </p>
//           </div>

//           <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
//             <div
//               onClick={prev}
//               style={{
//                 width: 44, height: 44, borderRadius: "50%",
//                 border: "1px solid rgba(245,168,0,0.25)", background: "rgba(0,0,0,0.5)",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 cursor: isFirst ? "not-allowed" : "pointer",
//                 opacity: isFirst ? 0.2 : 1, color: "rgba(255,255,255,0.7)",
//                 transition: "all 0.3s", flexShrink: 0,
//               }}
//             >
//               <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
//             </div>
//             <div
//               onClick={next}
//               style={{
//                 width: 44, height: 44, borderRadius: "50%",
//                 border: "1px solid rgba(245,168,0,0.25)", background: "rgba(0,0,0,0.5)",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 cursor: isLast ? "not-allowed" : "pointer",
//                 opacity: isLast ? 0.2 : 1, color: "rgba(255,255,255,0.7)",
//                 transition: "all 0.3s", flexShrink: 0,
//               }}
//             >
//               <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
//             </div>
//             {width >= 480 && (
//               <button onClick={onSeeMore} style={{
//                 fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3,
//                 textTransform: "uppercase", fontWeight: 700, color: "#fff",
//                 background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
//                 padding: "11px 28px", borderRadius: 2, cursor: "pointer",
//                 marginLeft: 6, whiteSpace: "nowrap", transition: "all 0.3s",
//               }}
//                 onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#F5A800"; e.currentTarget.style.color = "#F5A800"; }}
//                 onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff"; }}
//               >
//                 See More
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       <div
//         style={{ padding: `0 ${sidePad}px`, overflow: "hidden", touchAction: "pan-y pinch-zoom", cursor: "grab", userSelect: "none" }}
//         ref={wrapperRef}
//         onTouchStart={onTouchStart}
//         onTouchEnd={onTouchEnd}
//       >
//         <div style={{
//           display: "flex", gap: `${gap}px`,
//           transform: `translateX(-${translateX}px)`,
//           transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
//         }}>
//           {carouselEvents.map((ev) => {
//             const isDaily = ev.type === "daily" || ev.recurring;
//             const isPast = !isDaily && ev.endDate && ev.endDate < now;
//             const statusLabel = isDaily ? "Daily" : isPast ? "Past Event" : "Upcoming";

//             return (
//               <div
//                 key={ev.id}
//                 onClick={onSeeMore}
//                 className="ev-card-hover"
//                 style={{
//                   width: `${cardWidth}px`, background: ev.bgColor,
//                   borderRadius: 4, overflow: "hidden", cursor: "pointer",
//                   flexShrink: 0, position: "relative",
//                   transition: "transform 0.3s, box-shadow 0.3s",
//                 }}
//               >
//                 <div style={{ height: width < 480 ? 200 : width < 768 ? 220 : 250, overflow: "hidden", position: "relative" }}>
//                   <img src={ev.image} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
//                   <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 40%, ${ev.bgColor}cc 100%)` }} />
//                   <div style={{
//                     position: "absolute", top: 14, left: 14,
//                     fontFamily: "Rajdhani, sans-serif", fontSize: 10, letterSpacing: 3,
//                     textTransform: "uppercase", fontWeight: 700, padding: "4px 12px",
//                     borderRadius: 2, zIndex: 2, background: ev.accentColor,
//                     color: ev.bgColor === "#fff" ? "#000" : "#fff",
//                   }}>{ev.tag}</div>
//                   <div style={{
//                     position: "absolute", top: 14, right: 14,
//                     fontFamily: "Rajdhani, sans-serif", fontSize: 10, letterSpacing: 3,
//                     textTransform: "uppercase", fontWeight: 700, padding: "4px 12px",
//                     borderRadius: 2, zIndex: 2, background: "rgba(0,0,0,0.55)",
//                     border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
//                   }}>{statusLabel}</div>
//                 </div>

//                 <div style={{ padding: width < 480 ? "20px 20px 24px" : "24px 28px 28px" }}>
//                   <div style={{
//                     fontFamily: "Rajdhani, sans-serif", fontSize: 10, letterSpacing: 4,
//                     textTransform: "uppercase", color: ev.accentColor, marginBottom: 8, fontWeight: 700,
//                   }}>{ev.dateLabel || ev.recurring}</div>

//                   <div style={{
//                     fontFamily: "Cinzel, serif", fontSize: width < 480 ? 18 : 21,
//                     fontWeight: 700, lineHeight: 1.25, marginBottom: 10, color: ev.textColor,
//                   }}>{ev.title}</div>

//                   <div style={{
//                     fontFamily: "Cormorant Garamond, serif", fontSize: width < 480 ? 14 : 15,
//                     fontWeight: 300, fontStyle: "italic", lineHeight: 1.7,
//                     color: ev.bgColor === "#fff" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)",
//                     marginBottom: 20, display: "-webkit-box", WebkitLineClamp: 3,
//                     WebkitBoxOrient: "vertical", overflow: "hidden",
//                   }}>{ev.desc}</div>

//                   <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                     <span style={{
//                       fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3,
//                       textTransform: "uppercase", fontWeight: 700, color: ev.accentColor,
//                       display: "inline-flex", alignItems: "center", gap: 8,
//                     }}>Tap for details →</span>
//                     <div style={{
//                       width: 32, height: 32, borderRadius: "50%",
//                       border: `1px solid ${ev.accentColor}44`,
//                       display: "flex", alignItems: "center", justifyContent: "center",
//                     }}>
//                       <svg width="12" height="12" fill="none" stroke={ev.accentColor} strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 36 }}>
//         {Array.from({ length: maxIndex + 1 }).map((_, i) => (
//           <div key={i} onClick={() => setCurrent(i)} style={{
//             width: i === current ? 28 : 8, height: 3, borderRadius: 2,
//             background: i === current ? "#F5A800" : "rgba(255,255,255,0.15)",
//             cursor: "pointer", transition: "all 0.4s",
//           }} />
//         ))}
//       </div>

//       {width < 480 && (
//         <div style={{ textAlign: "center", marginTop: 28 }}>
//           <button onClick={onSeeMore} style={{
//             fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3,
//             textTransform: "uppercase", fontWeight: 700, color: "#fff",
//             background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
//             padding: "11px 28px", borderRadius: 2, cursor: "pointer",
//           }}>
//             See More Events
//           </button>
//         </div>
//       )}
//     </section>
//   );
// }

// /* ───────────────────────── EVENTS PAGE ───────────────────────── */

// function EventsPage({ onBack }) {
//   const width = useWindowWidth();
//   const isMobile = width < 768;
//   const now = new Date();
//   const { upcoming, past, daily } = categorize(events, now);
//   const featured = upcoming[0];
//   const restUpcoming = upcoming.slice(1);

//   return (
//     <div style={{ background: "#0A0A0A", color: "#fff", fontFamily: "'Cormorant Garamond', serif", minHeight: "100vh" }}>
//       <style>{`
//         .ev-card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.6); }
//         .ev-timeline-card:hover { border-color: var(--accent) !important; transform: translateY(-3px); }
//         .ev-rhythm-card:hover { border-color: #F5A800 !important; transform: translateY(-3px); }
//         .ev-past-card:hover { opacity: 1 !important; transform: translateY(-3px); }
//         @keyframes pulse {
//           0% { box-shadow: 0 0 0 0 rgba(46,204,113,0.5); }
//           70% { box-shadow: 0 0 0 8px rgba(46,204,113,0); }
//           100% { box-shadow: 0 0 0 0 rgba(46,204,113,0); }
//         }
//       `}</style>

//       {/* Back bar */}
//       <div style={{
//         position: "sticky", top: 0, zIndex: 10,
//         background: "rgba(10,10,10,0.85)", backdropFilter: "blur(8px)",
//         borderBottom: "1px solid rgba(255,255,255,0.06)",
//         padding: isMobile ? "16px 20px" : "16px 64px",
//         display: "flex", alignItems: "center", gap: 12,
//       }}>
//         <button onClick={onBack} style={{
//           background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
//           color: "#fff", fontFamily: "Rajdhani, sans-serif", fontSize: 11,
//           letterSpacing: 3, textTransform: "uppercase", fontWeight: 700,
//           padding: "10px 22px", borderRadius: 2, cursor: "pointer", transition: "all 0.3s",
//         }}
//           onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#F5A800"; e.currentTarget.style.color = "#F5A800"; }}
//           onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff"; }}
//         >
//           ← Back to Home
//         </button>
//         <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
//           Events
//         </span>
//       </div>

//       {/* HERO */}
//       {featured && (
//         <section style={{
//           position: "relative", minHeight: isMobile ? "auto" : "78vh",
//           display: "flex", alignItems: "flex-end", overflow: "hidden",
//           borderBottom: "1px solid rgba(245,168,0,0.12)",
//         }}>
//           <img src={featured.image} alt="" style={{ position: "absolute", inset: 0, objectFit: "cover", width: "100%", height: "100%", filter: "saturate(1.05)" }} />
//           <div style={{
//             position: "absolute", inset: 0,
//             background: "linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.55) 45%, #0A0A0A 100%), linear-gradient(90deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.1) 65%)",
//           }} />
//           <div style={{ position: "relative", zIndex: 2, padding: isMobile ? "60px 20px 48px" : "0 64px 80px", maxWidth: 820 }}>
//             <div style={{
//               display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
//               fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 5,
//               textTransform: "uppercase", color: "#F5A800",
//             }}>
//               <span style={{ width: 28, height: 1, background: "#F5A800", display: "inline-block" }} /> Next Up
//             </div>

//             <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
//               <div style={{
//                 display: "flex", flexDirection: "column", alignItems: "center",
//                 border: "1px solid rgba(245,168,0,0.35)", borderRadius: 4,
//                 padding: "10px 16px", background: "rgba(0,0,0,0.4)",
//               }}>
//                 <span style={{ fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: 26, lineHeight: 1 }}>{formatDay(featured.startDate)}</span>
//                 <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3, color: "#F5A800", marginTop: 4 }}>{formatMonth(featured.startDate)}</span>
//               </div>
//               <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
//                 {featured.dateLabel}
//               </div>
//             </div>

//             <h1 style={{
//               fontFamily: "Cinzel, serif", fontSize: isMobile ? "32px" : "58px",
//               fontWeight: 700, lineHeight: 1.1, margin: "0 0 14px 0",
//             }}>{featured.title}</h1>

//             <p style={{
//               fontStyle: "italic", fontWeight: 300, fontSize: isMobile ? 16 : 19,
//               color: "rgba(255,255,255,0.65)", marginBottom: 22, maxWidth: 600, lineHeight: 1.7,
//             }}>{featured.desc}</p>

//             <div style={{
//               display: "flex", flexWrap: "wrap", gap: 24,
//               fontFamily: "Rajdhani, sans-serif", fontSize: 12, letterSpacing: 2,
//               color: "rgba(255,255,255,0.6)", textTransform: "uppercase", marginBottom: 30,
//             }}>
//               <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                 <svg width="14" height="14" fill="none" stroke="#F5A800" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>
//                 {featured.location}
//               </span>
//             </div>

//             <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
//               <a href="#" onClick={(e) => e.preventDefault()} style={{
//                 fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3,
//                 textTransform: "uppercase", fontWeight: 700, color: "#000",
//                 background: "#F5A800", textDecoration: "none",
//                 padding: "12px 30px", borderRadius: 2, display: "inline-flex",
//                 alignItems: "center", gap: 10,
//               }}>View Details</a>
//               <a href="#timeline-anchor" style={{
//                 fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3,
//                 textTransform: "uppercase", fontWeight: 700, color: "#fff",
//                 border: "1px solid rgba(255,255,255,0.2)", textDecoration: "none",
//                 padding: "12px 30px", borderRadius: 2, display: "inline-flex",
//                 alignItems: "center", gap: 10,
//               }}>All Upcoming Events</a>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* UPCOMING TIMELINE */}
//       <section id="timeline-anchor" style={{ padding: isMobile ? "56px 20px" : "90px 64px" }}>
//         <div style={{
//           display: "flex", alignItems: isMobile ? "flex-start" : "flex-end",
//           justifyContent: "space-between", flexDirection: isMobile ? "column" : "row",
//           gap: 16, marginBottom: isMobile ? 32 : 48,
//         }}>
//           <div>
//             <div style={{
//               display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
//               fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 5,
//               textTransform: "uppercase", color: "#F5A800",
//             }}>
//               <span style={{ width: 28, height: 1, background: "#F5A800", display: "inline-block" }} /> What's Ahead
//             </div>
//             <h2 style={{ fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: isMobile ? 26 : 38, lineHeight: 1.15 }}>Upcoming Gatherings</h2>
//           </div>
//           <p style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.5)", fontSize: isMobile ? 14 : 16, maxWidth: 440, lineHeight: 1.7 }}>
//             Conferences, camps and cohorts on the calendar — ordered by what's coming next.
//           </p>
//         </div>

//         {restUpcoming.length === 0 ? (
//           <p style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)", fontSize: 15, padding: "20px 0" }}>
//             The gathering above is the only one currently scheduled. More to come.
//           </p>
//         ) : (
//           <div style={{ position: "relative" }}>
//             <div style={{
//               position: "absolute", left: isMobile ? 27 : 100, top: 8, bottom: 8, width: 1,
//               background: "linear-gradient(to bottom, rgba(245,168,0,0.5), rgba(245,168,0,0.05))",
//             }} />
//             {restUpcoming.map((ev) => (
//               <div key={ev.id} style={{
//                 position: "relative", display: "grid",
//                 gridTemplateColumns: isMobile ? "56px 1fr" : "140px 1fr",
//                 gap: isMobile ? 16 : 40, paddingBottom: isMobile ? 40 : 56,
//                 "--accent": ev.accentColor,
//               }}>
//                 <div style={{ display: "flex", flexDirection: "column", alignItems: isMobile ? "center" : "flex-end", paddingTop: 6 }}>
//                   <span style={{ fontFamily: "Cinzel, serif", fontSize: isMobile ? 20 : 30, fontWeight: 700, lineHeight: 1 }}>{formatDay(ev.startDate)}</span>
//                   <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3, color: ev.accentColor, marginTop: 6 }}>{formatMonth(ev.startDate)}</span>
//                 </div>
//                 <div style={{
//                   position: "absolute", left: isMobile ? 23 : 96, top: 14,
//                   width: 9, height: 9, borderRadius: "50%", background: ev.accentColor,
//                   boxShadow: `0 0 0 4px #0A0A0A, 0 0 0 5px ${ev.accentColor}40`,
//                 }} />
//                 <a href="#" onClick={(e) => e.preventDefault()} className="ev-timeline-card" style={{
//                   "--accent": ev.accentColor,
//                   border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, overflow: "hidden",
//                   display: "flex", flexDirection: isMobile ? "column" : "row",
//                   transition: "border-color 0.3s, transform 0.3s",
//                   textDecoration: "none", color: "inherit",
//                 }}>
//                   <img src={ev.image} alt={ev.title} style={{
//                     width: isMobile ? "100%" : 260, height: isMobile ? 180 : "auto",
//                     flexShrink: 0, objectFit: "cover",
//                   }} />
//                   <div style={{ padding: isMobile ? 20 : "28px 32px", flex: 1 }}>
//                     <div style={{
//                       fontFamily: "Rajdhani, sans-serif", fontSize: 10, letterSpacing: 3,
//                       textTransform: "uppercase", fontWeight: 700, color: ev.accentColor, marginBottom: 10,
//                     }}>{ev.tag} · {ev.dateLabel}</div>
//                     <h3 style={{ fontFamily: "Cinzel, serif", fontSize: isMobile ? 19 : 24, fontWeight: 700, lineHeight: 1.25, margin: "0 0 10px 0" }}>{ev.title}</h3>
//                     <p style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.55)", fontSize: isMobile ? 14 : 15, lineHeight: 1.7, margin: "0 0 14px 0" }}>{ev.desc}</p>
//                     <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{ev.location}</div>
//                   </div>
//                 </a>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* DAILY RHYTHMS */}
//       {daily.length > 0 && (
//         <section style={{ padding: isMobile ? "56px 20px" : "90px 64px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
//           <div style={{
//             display: "flex", alignItems: isMobile ? "flex-start" : "flex-end",
//             justifyContent: "space-between", flexDirection: isMobile ? "column" : "row",
//             gap: 16, marginBottom: isMobile ? 32 : 48,
//           }}>
//             <div>
//               <div style={{
//                 display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
//                 fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 5,
//                 textTransform: "uppercase", color: "#F5A800",
//               }}>
//                 <span style={{ width: 28, height: 1, background: "#F5A800", display: "inline-block" }} /> Every Week
//               </div>
//               <h2 style={{ fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: isMobile ? 26 : 38, lineHeight: 1.15 }}>Daily &amp; Recurring</h2>
//             </div>
//             <p style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.5)", fontSize: isMobile ? 14 : 16, maxWidth: 440, lineHeight: 1.7 }}>
//               Standing appointments that happen on rhythm, week after week.
//             </p>
//           </div>

//           <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
//             {daily.map((ev) => (
//               <a href="#" onClick={(e) => e.preventDefault()} className="ev-rhythm-card" key={ev.id} style={{
//                 border: "1px solid rgba(245,168,0,0.18)", borderRadius: 6, padding: 28,
//                 background: "linear-gradient(135deg, rgba(245,168,0,0.06), rgba(13,0,20,0.4))",
//                 textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column",
//                 gap: 14, transition: "border-color 0.3s, transform 0.3s", position: "relative", overflow: "hidden",
//               }}>
//                 <div style={{
//                   position: "absolute", top: 24, right: 24, width: 10, height: 10, borderRadius: "50%",
//                   background: "#2ecc71", animation: "pulse 2.4s infinite",
//                 }} />
//                 <div style={{
//                   fontFamily: "Rajdhani, sans-serif", fontSize: 10, letterSpacing: 3,
//                   textTransform: "uppercase", fontWeight: 700, color: "#000", background: "#F5A800",
//                   alignSelf: "flex-start", padding: "4px 12px", borderRadius: 2,
//                 }}>{ev.tag}</div>
//                 <h3 style={{ fontFamily: "Cinzel, serif", fontSize: 22, margin: 0 }}>{ev.title}</h3>
//                 <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 13, letterSpacing: 2, color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: 10 }}>
//                   <svg width="14" height="14" fill="none" stroke="#F5A800" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
//                   {ev.recurring}
//                 </div>
//                 <p style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{ev.desc}</p>
//               </a>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* PAST EVENTS */}
//       <section style={{ padding: isMobile ? "56px 20px" : "90px 64px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingBottom: isMobile ? 80 : 120 }}>
//         <div style={{
//           display: "flex", alignItems: isMobile ? "flex-start" : "flex-end",
//           justifyContent: "space-between", flexDirection: isMobile ? "column" : "row",
//           gap: 16, marginBottom: isMobile ? 32 : 48,
//         }}>
//           <div>
//             <div style={{
//               display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
//               fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 5,
//               textTransform: "uppercase", color: "#F5A800",
//             }}>
//               <span style={{ width: 28, height: 1, background: "#F5A800", display: "inline-block" }} /> The Archive
//             </div>
//             <h2 style={{ fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: isMobile ? 26 : 38, lineHeight: 1.15 }}>Past Events</h2>
//           </div>
//           <p style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.5)", fontSize: isMobile ? 14 : 16, maxWidth: 440, lineHeight: 1.7 }}>
//             A record of what we've walked through together.
//           </p>
//         </div>

//         {past.length === 0 ? (
//           <p style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)", fontSize: 15, padding: "20px 0" }}>No past events yet — this archive will grow over time.</p>
//         ) : (
//           <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
//             {past.map((ev) => (
//               <a href="#" onClick={(e) => e.preventDefault()} className="ev-past-card" key={ev.id} style={{
//                 border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, overflow: "hidden",
//                 textDecoration: "none", color: "inherit", opacity: 0.7,
//                 transition: "opacity 0.3s, transform 0.3s", display: "block",
//               }}>
//                 <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
//                   <img src={ev.image} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.5)" }} />
//                   <div style={{
//                     position: "absolute", top: 12, right: 12, fontFamily: "Rajdhani, sans-serif",
//                     fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700,
//                     background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.2)",
//                     padding: "4px 10px", borderRadius: 2,
//                   }}>Archived</div>
//                 </div>
//                 <div style={{ padding: "18px 20px 22px" }}>
//                   <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{ev.dateLabel}</div>
//                   <h3 style={{ fontFamily: "Cinzel, serif", fontSize: 17, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{ev.title}</h3>
//                 </div>
//               </a>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }

// /* ───────────────────────── ROOT ───────────────────────── */

// export default function App() {
//   const [view, setView] = useState("home");

//   return (
//     <div style={{ fontFamily: "'Cormorant Garamond', serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Rajdhani:wght@500;700&display=swap');
//         * { box-sizing: border-box; }
//         body { margin: 0; }
//       `}</style>
//       {view === "home" ? (
//         <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
//           <div style={{ padding: "40px 20px 0", textAlign: "center" }}>
//             <p style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: 3, color: "rgba(255,255,255,0.3)", fontSize: 11, textTransform: "uppercase" }}>
//               — homepage preview —
//             </p>
//           </div>
//           <EventsCarousel onSeeMore={() => setView("events")} />
//         </div>
//       ) : (
//         <EventsPage onBack={() => setView("home")} />
//       )}
//     </div>
//   );
// }
























import { useState, useEffect, useRef } from "react";

/* ───────────────────────── DATA ───────────────────────── */

const events = [
  {
    id: 1,
    tag: "Annual Conference",
    title: "Evolve 2025 — The Language of Mastery",
    dateLabel: "24 – 30 November, 2025",
    startDate: new Date("2025-11-24"),
    endDate: new Date("2025-11-30"),
    location: "Ikorodu, Lagos, Nigeria (Online & Onsite)",
    desc: "A week of insight meetings where lights converge, kings emerge, and priesthood becomes culture. Featuring Apostle Othniel Ikechukwu, Apostle Hassan Melchizedek, Apostle Daniel Wesonga, Rabbi Smith Cosmos, Prophet Abiola Paul Oyeniyi and Nick Graceman.",
    accentColor: "#F5A800",
    bgColor: "#1a0533",
    textColor: "#fff",
    image: "/images/photo_2026-06-11_14-39-41.jpg",
    type: "conference",
  },
  {
    id: 2,
    tag: "Camping",
    title: "Evolve — 3rd Year Anniversary",
    dateLabel: "26 – 30 September",
    startDate: new Date("2025-09-26"),
    endDate: new Date("2025-09-30"),
    location: "Unity Estate, Off Engineer Road, Ojota Temu, Lagos",
    desc: "5 days of camping centered on equipping, activation, impartation, transfiguration and physical blessings, with Pst. Clem Aigbe, Pst. Taiwo Akinkemi, Nick Graceman, D-Dam and other ancients. Rooms available at a cheap price.",
    accentColor: "#c0392b",
    bgColor: "#0a0a0a",
    textColor: "#fff",
    image: "/images/photo_2026-06-11_14-37-23.jpg",
    type: "camp",
  },
  {
    id: 3,
    tag: "Prophetic Summons",
    title: "The Days of the Saints",
    dateLabel: "27 July – 2 August, 2026",
    startDate: new Date("2026-07-27"),
    endDate: new Date("2026-08-02"),
    location: "Online & Onsite — details released closer to the date",
    desc: "A mystical gathering built on Romans 8:19 — mystical, quality, excellence. A prophetic summons to be equipped, to transform culture, and to reveal Christ.",
    accentColor: "#9333EA",
    bgColor: "#0d0014",
    textColor: "#fff",
    image: "/images/photo_2026-06-09_14-40-37.jpg",
    type: "summit",
  },
  {
    id: 4,
    tag: "Executive Classes",
    title: "One-on-One Executive Classes — August 2026 Cohort",
    dateLabel: "August 2026 Cohort",
    startDate: new Date("2026-08-01"),
    endDate: new Date("2026-08-31"),
    location: "On Demand — Online",
    desc: "Practical, precise, life-shaping one-on-one impartation sessions on your terms and on demand. Just 12 slots available at $200 per slot; next access opens in the following cohort.",
    accentColor: "#F5A800",
    bgColor: "#0a0a0a",
    textColor: "#fff",
    image: "/images/photo_2026-06-09_14-40-46.jpg",
    type: "class",
  },
  {
    id: 5,
    tag: "Daily",
    title: "Meditation",
    recurring: "Monday – Friday, 6AM Daily · Sunday 7AM WAT",
    location: "Zoe School of Mysteries — Telegram",
    desc: "A daily meeting point for stillness and prophetic alignment — six mornings a week on Telegram.",
    accentColor: "#F5A800",
    bgColor: "#0d0014",
    textColor: "#fff",
    image: "/images/photo_2026-06-11_13-50-33.jpg",
    type: "daily",
  },
];

function categorize(list, now = new Date()) {
  const upcoming = [], past = [], daily = [];
  list.forEach((ev) => {
    if (ev.type === "daily" || ev.recurring) { daily.push(ev); return; }
    const end = ev.endDate || ev.startDate;
    if (end && end < now) past.push(ev); else upcoming.push(ev);
  });
  upcoming.sort((a, b) => a.startDate - b.startDate);
  past.sort((a, b) => b.startDate - a.startDate);
  return { upcoming, past, daily };
}

/* ───────────────────────── HOOKS ───────────────────────── */

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

function formatDay(date) { return date.toLocaleDateString("en-US", { day: "2-digit" }); }
function formatMonth(date) { return date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(); }

/* ───────────────────────── CAROUSEL (homepage section) ───────────────────────── */

function EventsCarousel({ onSeeMore, onSelectEvent }) {
  const [current, setCurrent] = useState(0);
  const width = useWindowWidth();
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const touchStartY = useRef(null);
  const wrapperRef = useRef(null);
  const MIN_SWIPE = 50;

  const { upcoming, daily, past } = categorize(events);
  const carouselEvents = [...upcoming, ...daily, ...past];

  const getVisible = () => {
    if (width < 480) return 1;
    if (width < 768) return 1.2;
    if (width < 1024) return 2;
    if (width < 1280) return 2.5;
    return 3;
  };

  const visible = getVisible();
  const maxIndex = Math.max(0, carouselEvents.length - Math.floor(visible));
  const isFirst = current === 0;
  const isLast = current >= maxIndex;

  const prev = () => { if (!isFirst) setCurrent((c) => c - 1); };
  const next = () => { if (!isLast) setCurrent((c) => c + 1); };

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const handleMove = (e) => {
      if (touchStartX.current === null) return;
      const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
      const dy = Math.abs(e.touches[0].clientY - (touchStartY.current || 0));
      if (dx > dy) { e.preventDefault(); touchEndX.current = e.touches[0].clientX; }
    };
    el.addEventListener("touchmove", handleMove, { passive: false });
    return () => el.removeEventListener("touchmove", handleMove);
  }, []);

  const onTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    touchEndX.current = null;
  };
  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) >= MIN_SWIPE) { diff > 0 ? next() : prev(); }
    touchStartX.current = null; touchEndX.current = null; touchStartY.current = null;
  };

  const sidePad = width < 480 ? 20 : width < 768 ? 32 : 64;
  const trackWidth = width - sidePad * 2;
  const gap = width < 480 ? 16 : 24;
  const cardWidth = (trackWidth - gap * (Math.ceil(visible) - 1)) / visible;
  const translateX = current * (cardWidth + gap);
  const now = new Date();

  return (
    <section style={{ background: "#0A0A0A", padding: `${width < 768 ? 64 : 100}px 0`, overflow: "hidden" }}>
      <div style={{ padding: `0 ${sidePad}px`, marginBottom: width < 768 ? 32 : 48 }}>
        <div style={{
          display: "flex",
          alignItems: width < 640 ? "flex-start" : "flex-end",
          justifyContent: "space-between",
          flexDirection: width < 640 ? "column" : "row",
          gap: 24,
        }}>
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
              fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 5,
              textTransform: "uppercase", color: "#F5A800",
            }}>
              <span style={{ width: 28, height: 1, background: "#F5A800", display: "inline-block" }} />
              Connect
            </div>
            <h2 style={{
              fontFamily: "Cinzel, serif",
              fontSize: width < 480 ? 24 : width < 768 ? 30 : 42,
              fontWeight: 700, lineHeight: 1.15, marginBottom: 12, color: "#fff",
            }}>
              Discover More Ways<br />To Connect
            </h2>
            <p style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: width < 480 ? 15 : 17, fontWeight: 300, fontStyle: "italic",
              color: "rgba(255,255,255,0.5)", maxWidth: 460, lineHeight: 1.7,
            }}>
              There are always new ways to participate — events, tours, worship music, and so much more.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div
              onClick={prev}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                border: "1px solid rgba(245,168,0,0.25)", background: "rgba(0,0,0,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: isFirst ? "not-allowed" : "pointer",
                opacity: isFirst ? 0.2 : 1, color: "rgba(255,255,255,0.7)",
                transition: "all 0.3s", flexShrink: 0,
              }}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
            </div>
            <div
              onClick={next}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                border: "1px solid rgba(245,168,0,0.25)", background: "rgba(0,0,0,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: isLast ? "not-allowed" : "pointer",
                opacity: isLast ? 0.2 : 1, color: "rgba(255,255,255,0.7)",
                transition: "all 0.3s", flexShrink: 0,
              }}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </div>
            {width >= 480 && (
              <button onClick={onSeeMore} style={{
                fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3,
                textTransform: "uppercase", fontWeight: 700, color: "#fff",
                background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
                padding: "11px 28px", borderRadius: 2, cursor: "pointer",
                marginLeft: 6, whiteSpace: "nowrap", transition: "all 0.3s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#F5A800"; e.currentTarget.style.color = "#F5A800"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff"; }}
              >
                See More
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        style={{ padding: `0 ${sidePad}px`, overflow: "hidden", touchAction: "pan-y pinch-zoom", cursor: "grab", userSelect: "none" }}
        ref={wrapperRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div style={{
          display: "flex", gap: `${gap}px`,
          transform: `translateX(-${translateX}px)`,
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
          {carouselEvents.map((ev) => {
            const isDaily = ev.type === "daily" || ev.recurring;
            const isPast = !isDaily && ev.endDate && ev.endDate < now;
            const statusLabel = isDaily ? "Daily" : isPast ? "Past Event" : "Upcoming";

            return (
              <div
                key={ev.id}
                onClick={() => onSelectEvent(ev.id)}
                className="ev-card-hover"
                style={{
                  width: `${cardWidth}px`, background: ev.bgColor,
                  borderRadius: 4, overflow: "hidden", cursor: "pointer",
                  flexShrink: 0, position: "relative",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
              >
                <div style={{ height: width < 480 ? 200 : width < 768 ? 220 : 250, overflow: "hidden", position: "relative" }}>
                  <img src={ev.image} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 40%, ${ev.bgColor}cc 100%)` }} />
                  <div style={{
                    position: "absolute", top: 14, left: 14,
                    fontFamily: "Rajdhani, sans-serif", fontSize: 10, letterSpacing: 3,
                    textTransform: "uppercase", fontWeight: 700, padding: "4px 12px",
                    borderRadius: 2, zIndex: 2, background: ev.accentColor,
                    color: ev.bgColor === "#fff" ? "#000" : "#fff",
                  }}>{ev.tag}</div>
                  <div style={{
                    position: "absolute", top: 14, right: 14,
                    fontFamily: "Rajdhani, sans-serif", fontSize: 10, letterSpacing: 3,
                    textTransform: "uppercase", fontWeight: 700, padding: "4px 12px",
                    borderRadius: 2, zIndex: 2, background: "rgba(0,0,0,0.55)",
                    border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
                  }}>{statusLabel}</div>
                </div>

                <div style={{ padding: width < 480 ? "20px 20px 24px" : "24px 28px 28px" }}>
                  <div style={{
                    fontFamily: "Rajdhani, sans-serif", fontSize: 10, letterSpacing: 4,
                    textTransform: "uppercase", color: ev.accentColor, marginBottom: 8, fontWeight: 700,
                  }}>{ev.dateLabel || ev.recurring}</div>

                  <div style={{
                    fontFamily: "Cinzel, serif", fontSize: width < 480 ? 18 : 21,
                    fontWeight: 700, lineHeight: 1.25, marginBottom: 10, color: ev.textColor,
                  }}>{ev.title}</div>

                  <div style={{
                    fontFamily: "Cormorant Garamond, serif", fontSize: width < 480 ? 14 : 15,
                    fontWeight: 300, fontStyle: "italic", lineHeight: 1.7,
                    color: ev.bgColor === "#fff" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)",
                    marginBottom: 20, display: "-webkit-box", WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                  }}>{ev.desc}</div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{
                      fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3,
                      textTransform: "uppercase", fontWeight: 700, color: ev.accentColor,
                      display: "inline-flex", alignItems: "center", gap: 8,
                    }}>Tap for details →</span>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      border: `1px solid ${ev.accentColor}44`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="12" height="12" fill="none" stroke={ev.accentColor} strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 36 }}>
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{
            width: i === current ? 28 : 8, height: 3, borderRadius: 2,
            background: i === current ? "#F5A800" : "rgba(255,255,255,0.15)",
            cursor: "pointer", transition: "all 0.4s",
          }} />
        ))}
      </div>

      {width < 480 && (
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <button onClick={onSeeMore} style={{
            fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3,
            textTransform: "uppercase", fontWeight: 700, color: "#fff",
            background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
            padding: "11px 28px", borderRadius: 2, cursor: "pointer",
          }}>
            See More Events
          </button>
        </div>
      )}
    </section>
  );
}

/* ───────────────────────── EVENTS PAGE ───────────────────────── */

function EventsPage({ onBack, onSelectEvent }) {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const now = new Date();
  const { upcoming, past, daily } = categorize(events, now);
  const featured = upcoming[0];
  const restUpcoming = upcoming.slice(1);

  return (
    <div style={{ background: "#0A0A0A", color: "#fff", fontFamily: "'Cormorant Garamond', serif", minHeight: "100vh" }}>
      <style>{`
        .ev-card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.6); }
        .ev-timeline-card:hover { border-color: var(--accent) !important; transform: translateY(-3px); }
        .ev-rhythm-card:hover { border-color: #F5A800 !important; transform: translateY(-3px); }
        .ev-past-card:hover { opacity: 1 !important; transform: translateY(-3px); }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(46,204,113,0.5); }
          70% { box-shadow: 0 0 0 8px rgba(46,204,113,0); }
          100% { box-shadow: 0 0 0 0 rgba(46,204,113,0); }
        }
      `}</style>

      {/* Back bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(10,10,10,0.85)", backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: isMobile ? "16px 20px" : "16px 64px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <button onClick={onBack} style={{
          background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff", fontFamily: "Rajdhani, sans-serif", fontSize: 11,
          letterSpacing: 3, textTransform: "uppercase", fontWeight: 700,
          padding: "10px 22px", borderRadius: 2, cursor: "pointer", transition: "all 0.3s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#F5A800"; e.currentTarget.style.color = "#F5A800"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff"; }}
        >
          ← Back to Home
        </button>
        <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
          Events
        </span>
      </div>

      {/* HERO */}
      {featured && (
        <section style={{
          position: "relative", minHeight: isMobile ? "auto" : "78vh",
          display: "flex", alignItems: "flex-end", overflow: "hidden",
          borderBottom: "1px solid rgba(245,168,0,0.12)",
        }}>
          <img src={featured.image} alt="" style={{ position: "absolute", inset: 0, objectFit: "cover", width: "100%", height: "100%", }} />
          {/* filter: "saturate(1.05)"  */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(10, 10, 10, 0.2) 0%, rgba(10, 10, 10, 0.34) 45%, #0a0a0a8b 100%), linear-gradient(90deg, rgba(10, 10, 10, 0.43) 0%, rgba(10,10,10,0.1) 65%)",
          }} />
          <div style={{ position: "relative", zIndex: 2, padding: isMobile ? "60px 20px 48px" : "0 64px 80px", maxWidth: 820 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
              fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 5,
              textTransform: "uppercase", color: "#F5A800",
            }}>
              <span style={{ width: 28, height: 1, background: "#F5A800", display: "inline-block" }} /> Next Up
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                border: "1px solid rgba(245,168,0,0.35)", borderRadius: 4,
                padding: "10px 16px", background: "rgba(0,0,0,0.4)",
              }}>
                <span style={{ fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: 26, lineHeight: 1 }}>{formatDay(featured.startDate)}</span>
                <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3, color: "#F5A800", marginTop: 4 }}>{formatMonth(featured.startDate)}</span>
              </div>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
                {featured.dateLabel}
              </div>
            </div>

            <h1 style={{
              fontFamily: "Cinzel, serif", fontSize: isMobile ? "32px" : "58px",
              fontWeight: 700, lineHeight: 1.1, margin: "0 0 14px 0",
            }}>{featured.title}</h1>

            <p style={{
              fontStyle: "italic", fontWeight: 300, fontSize: isMobile ? 16 : 19,
              color: "rgba(255,255,255,0.65)", marginBottom: 22, maxWidth: 600, lineHeight: 1.7,
            }}>{featured.desc}</p>

            <div style={{
              display: "flex", flexWrap: "wrap", gap: 24,
              fontFamily: "Rajdhani, sans-serif", fontSize: 12, letterSpacing: 2,
              color: "rgba(255,255,255,0.6)", textTransform: "uppercase", marginBottom: 30,
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="14" height="14" fill="none" stroke="#F5A800" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {featured.location}
              </span>
            </div>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button onClick={() => onSelectEvent(featured.id)} style={{
                fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3,
                textTransform: "uppercase", fontWeight: 700, color: "#000",
                background: "#F5A800", border: "none", cursor: "pointer",
                padding: "12px 30px", borderRadius: 2, display: "inline-flex",
                alignItems: "center", gap: 10,
              }}>View Details</button>
              <a href="#timeline-anchor" style={{
                fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3,
                textTransform: "uppercase", fontWeight: 700, color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)", textDecoration: "none",
                padding: "12px 30px", borderRadius: 2, display: "inline-flex",
                alignItems: "center", gap: 10,
              }}>All Upcoming Events</a>
            </div>
          </div>
        </section>
      )}

      {/* UPCOMING TIMELINE */}
      <section id="timeline-anchor" style={{ padding: isMobile ? "56px 20px" : "90px 64px" }}>
        <div style={{
          display: "flex", alignItems: isMobile ? "flex-start" : "flex-end",
          justifyContent: "space-between", flexDirection: isMobile ? "column" : "row",
          gap: 16, marginBottom: isMobile ? 32 : 48,
        }}>
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
              fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 5,
              textTransform: "uppercase", color: "#F5A800",
            }}>
              <span style={{ width: 28, height: 1, background: "#F5A800", display: "inline-block" }} /> What's Ahead
            </div>
            <h2 style={{ fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: isMobile ? 26 : 38, lineHeight: 1.15 }}>Upcoming Gatherings</h2>
          </div>
          <p style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.5)", fontSize: isMobile ? 14 : 16, maxWidth: 440, lineHeight: 1.7 }}>
            Conferences, camps and cohorts on the calendar — ordered by what's coming next.
          </p>
        </div>

        {restUpcoming.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)", fontSize: 15, padding: "20px 0" }}>
            The gathering above is the only one currently scheduled. More to come.
          </p>
        ) : (
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", left: isMobile ? 27 : 100, top: 8, bottom: 8, width: 1,
              background: "linear-gradient(to bottom, rgba(245,168,0,0.5), rgba(245,168,0,0.05))",
            }} />
            {restUpcoming.map((ev) => (
              <div key={ev.id} style={{
                position: "relative", display: "grid",
                gridTemplateColumns: isMobile ? "56px 1fr" : "140px 1fr",
                gap: isMobile ? 16 : 40, paddingBottom: isMobile ? 40 : 56,
                "--accent": ev.accentColor,
              }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: isMobile ? "center" : "flex-end", paddingTop: 6 }}>
                  <span style={{ fontFamily: "Cinzel, serif", fontSize: isMobile ? 20 : 30, fontWeight: 700, lineHeight: 1 }}>{formatDay(ev.startDate)}</span>
                  <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3, color: ev.accentColor, marginTop: 6 }}>{formatMonth(ev.startDate)}</span>
                </div>
                <div style={{
                  position: "absolute", left: isMobile ? 23 : 96, top: 14,
                  width: 9, height: 9, borderRadius: "50%", background: ev.accentColor,
                  boxShadow: `0 0 0 4px #0A0A0A, 0 0 0 5px ${ev.accentColor}40`,
                }} />
                <div onClick={() => onSelectEvent(ev.id)} className="ev-timeline-card" style={{
                  "--accent": ev.accentColor,
                  border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, overflow: "hidden",
                  display: "flex", flexDirection: isMobile ? "column" : "row",
                  transition: "border-color 0.3s, transform 0.3s",
                  textDecoration: "none", color: "inherit", cursor: "pointer",
                }}>
                  <img src={ev.image} alt={ev.title} style={{
                    width: isMobile ? "100%" : 260, height: isMobile ? 180 : "auto",
                    flexShrink: 0, objectFit: "cover",
                  }} />
                  <div style={{ padding: isMobile ? 20 : "28px 32px", flex: 1 }}>
                    <div style={{
                      fontFamily: "Rajdhani, sans-serif", fontSize: 10, letterSpacing: 3,
                      textTransform: "uppercase", fontWeight: 700, color: ev.accentColor, marginBottom: 10,
                    }}>{ev.tag} · {ev.dateLabel}</div>
                    <h3 style={{ fontFamily: "Cinzel, serif", fontSize: isMobile ? 19 : 24, fontWeight: 700, lineHeight: 1.25, margin: "0 0 10px 0" }}>{ev.title}</h3>
                    <p style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.55)", fontSize: isMobile ? 14 : 15, lineHeight: 1.7, margin: "0 0 14px 0" }}>{ev.desc}</p>
                    <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{ev.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* DAILY RHYTHMS */}
      {daily.length > 0 && (
        <section style={{ padding: isMobile ? "56px 20px" : "90px 64px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{
            display: "flex", alignItems: isMobile ? "flex-start" : "flex-end",
            justifyContent: "space-between", flexDirection: isMobile ? "column" : "row",
            gap: 16, marginBottom: isMobile ? 32 : 48,
          }}>
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
                fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 5,
                textTransform: "uppercase", color: "#F5A800",
              }}>
                <span style={{ width: 28, height: 1, background: "#F5A800", display: "inline-block" }} /> Every Week
              </div>
              <h2 style={{ fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: isMobile ? 26 : 38, lineHeight: 1.15 }}>Daily &amp; Recurring</h2>
            </div>
            <p style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.5)", fontSize: isMobile ? 14 : 16, maxWidth: 440, lineHeight: 1.7 }}>
              Standing appointments that happen on rhythm, week after week.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {daily.map((ev) => (
              <div onClick={() => onSelectEvent(ev.id)} className="ev-rhythm-card" key={ev.id} style={{
                border: "1px solid rgba(245,168,0,0.18)", borderRadius: 6, padding: 28,
                background: "linear-gradient(135deg, rgba(245,168,0,0.06), rgba(13,0,20,0.4))",
                textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column",
                gap: 14, transition: "border-color 0.3s, transform 0.3s", position: "relative", overflow: "hidden",
                cursor: "pointer",
              }}>
                <div style={{
                  position: "absolute", top: 24, right: 24, width: 10, height: 10, borderRadius: "50%",
                  background: "#2ecc71", animation: "pulse 2.4s infinite",
                }} />
                <div style={{
                  fontFamily: "Rajdhani, sans-serif", fontSize: 10, letterSpacing: 3,
                  textTransform: "uppercase", fontWeight: 700, color: "#000", background: "#F5A800",
                  alignSelf: "flex-start", padding: "4px 12px", borderRadius: 2,
                }}>{ev.tag}</div>
                <h3 style={{ fontFamily: "Cinzel, serif", fontSize: 22, margin: 0 }}>{ev.title}</h3>
                <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 13, letterSpacing: 2, color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="14" height="14" fill="none" stroke="#F5A800" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  {ev.recurring}
                </div>
                <p style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{ev.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PAST EVENTS */}
      <section style={{ padding: isMobile ? "56px 20px" : "90px 64px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingBottom: isMobile ? 80 : 120 }}>
        <div style={{
          display: "flex", alignItems: isMobile ? "flex-start" : "flex-end",
          justifyContent: "space-between", flexDirection: isMobile ? "column" : "row",
          gap: 16, marginBottom: isMobile ? 32 : 48,
        }}>
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
              fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 5,
              textTransform: "uppercase", color: "#F5A800",
            }}>
              <span style={{ width: 28, height: 1, background: "#F5A800", display: "inline-block" }} /> The Archive
            </div>
            <h2 style={{ fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: isMobile ? 26 : 38, lineHeight: 1.15 }}>Past Events</h2>
          </div>
          <p style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.5)", fontSize: isMobile ? 14 : 16, maxWidth: 440, lineHeight: 1.7 }}>
            A record of what we've walked through together.
          </p>
        </div>

        {past.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)", fontSize: 15, padding: "20px 0" }}>No past events yet — this archive will grow over time.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {past.map((ev) => (
              <div onClick={() => onSelectEvent(ev.id)} className="ev-past-card" key={ev.id} style={{
                border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, overflow: "hidden",
                textDecoration: "none", color: "inherit", opacity: 0.7,
                transition: "opacity 0.3s, transform 0.3s", display: "block", cursor: "pointer",
              }}>
                <div style={{ position: "relative", height: 600, overflow: "hidden" }}>
                  <img src={ev.image} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.5)" }} />
                  <div style={{
                    position: "absolute", top: 12, right: 12, fontFamily: "Rajdhani, sans-serif",
                    fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700,
                    background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.2)",
                    padding: "4px 10px", borderRadius: 2,
                  }}>Archived</div>
                </div>
                <div style={{ padding: "18px 20px 22px" }}>
                  <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{ev.dateLabel}</div>
                  <h3 style={{ fontFamily: "Cinzel, serif", fontSize: 17, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{ev.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ───────────────────────── EVENT DETAIL PAGE ───────────────────────── */

function EventDetailPage({ event, onBack }) {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const now = new Date();
  const isDaily = event.type === "daily" || event.recurring;
  const isPast = !isDaily && event.endDate && event.endDate < now;
  const statusLabel = isDaily ? "Daily" : isPast ? "Past Event" : "Upcoming";

  return (
    <div style={{ background: event.bgColor, color: "#fff", fontFamily: "'Cormorant Garamond', serif", minHeight: "100vh" }}>
      {/* Back bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: isMobile ? "16px 20px" : "16px 64px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <button onClick={onBack} style={{
          background: "transparent", border: "1px solid rgba(255,255,255,0.25)",
          color: "#fff", fontFamily: "Rajdhani, sans-serif", fontSize: 11,
          letterSpacing: 3, textTransform: "uppercase", fontWeight: 700,
          padding: "10px 22px", borderRadius: 2, cursor: "pointer", transition: "all 0.3s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = event.accentColor; e.currentTarget.style.color = event.accentColor; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "#fff"; }}
        >
          ← Back to Events
        </button>
        <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
          Event Details
        </span>
      </div>

      {/* HERO IMAGE */}
      <section style={{
        position: "relative", minHeight: isMobile ? "55vh" : "75vh",
        display: "flex", alignItems: "flex-end", overflow: "hidden",
      }}>
        <img src={event.image} alt="" style={{ position: "absolute", inset: 0, objectFit: "cover", width: "100%", height: "100%", filter: "saturate(1.05)" }} />
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(180deg, rgba(0,0,0,0.25) 0%, ${event.bgColor}aa 70%, ${event.bgColor} 100%)`,
        }} />
        <div style={{ position: "relative", zIndex: 2, padding: isMobile ? "0 20px 36px" : "0 64px 56px", maxWidth: 900 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
            <span style={{
              fontFamily: "Rajdhani, sans-serif", fontSize: 10, letterSpacing: 3,
              textTransform: "uppercase", fontWeight: 700, padding: "5px 14px",
              borderRadius: 2, background: event.accentColor,
              color: event.bgColor === "#fff" ? "#000" : "#fff",
            }}>{event.tag}</span>
            <span style={{
              fontFamily: "Rajdhani, sans-serif", fontSize: 10, letterSpacing: 3,
              textTransform: "uppercase", fontWeight: 700, padding: "5px 14px",
              borderRadius: 2, background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
            }}>{statusLabel}</span>
          </div>
          <h1 style={{
            fontFamily: "Cinzel, serif", fontSize: isMobile ? 30 : 50,
            fontWeight: 700, lineHeight: 1.15, margin: 0,
          }}>{event.title}</h1>
        </div>
      </section>

      {/* DETAILS */}
      <section style={{ padding: isMobile ? "40px 20px 80px" : "64px 64px 110px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{
          display: "flex", flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 24 : 48, marginBottom: 40,
          paddingBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "Rajdhani, sans-serif", fontSize: 10, letterSpacing: 3,
              textTransform: "uppercase", color: event.accentColor, marginBottom: 8, fontWeight: 700,
            }}>When</div>
            <div style={{ fontFamily: "Cinzel, serif", fontSize: 19, fontWeight: 700 }}>
              {event.dateLabel || event.recurring}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "Rajdhani, sans-serif", fontSize: 10, letterSpacing: 3,
              textTransform: "uppercase", color: event.accentColor, marginBottom: 8, fontWeight: 700,
            }}>Where</div>
            <div style={{ fontFamily: "Cinzel, serif", fontSize: 19, fontWeight: 700, lineHeight: 1.3 }}>
              {event.location}
            </div>
          </div>
        </div>

        <div style={{
          fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3,
          textTransform: "uppercase", color: event.accentColor, marginBottom: 14, fontWeight: 700,
        }}>About this gathering</div>
        <p style={{
          fontStyle: "italic", fontWeight: 300, fontSize: isMobile ? 17 : 20,
          lineHeight: 1.8, color: "rgba(255,255,255,0.8)", margin: 0,
        }}>{event.desc}</p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 44 }}>
          {/* <a href="#" onClick={(e) => e.preventDefault()} style={{
            fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3,
            textTransform: "uppercase", fontWeight: 700, color: "#000",
            background: event.accentColor, textDecoration: "none",
            padding: "13px 32px", borderRadius: 2, display: "inline-flex",
            alignItems: "center", gap: 10,
          }}>Register / Get Notified</a> */}
          <button onClick={onBack} style={{
            fontFamily: "Rajdhani, sans-serif", fontSize: 11, letterSpacing: 3,
            textTransform: "uppercase", fontWeight: 700, color: "#fff",
            background: "transparent", border: "1px solid rgba(255,255,255,0.25)",
            padding: "13px 32px", borderRadius: 2, cursor: "pointer",
          }}>← All Events</button>
        </div>
      </section>
    </div>
  );
}
/* ───────────────────────── EXPORTS ───────────────────────── */

// Export components and data for use in other files
export { EventsCarousel, EventsPage, EventDetailPage, events };
export default EventsCarousel;