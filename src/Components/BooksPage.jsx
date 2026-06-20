import { useState, useEffect } from "react";

function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

// ── All 21 books with real Selar links and cover images
export const ALL_BOOKS = [
  {
    id: 1,
    title: "Legality and Authority",
    link: "https://selar.com/7e7491",
    tag: "Spiritual",
    tagColor: "#9333EA",
    cover: "https://files.selar.co/product-images/2024/products/Hassanololade/legality-and-authority-selar.co-66f6a5f1db33a.jpeg",
    desc: "Understand the laws and authority structures of the spiritual realm.",
  },
  {
    id: 2,
    title: "Navigating the Realms and Dimensions of the Spirit",
    link: "https://selar.com/7h5824",
    tag: "Mystery",
    tagColor: "#F5A800",
    cover: "https://files.selar.co/product-images/2023/products/Hassanololade/navigating-the-realms-and-selar.co-6566159436de2.jpg",
    desc: "A guide into the multiple realms and dimensions accessible in the spirit.",
  },
  {
    id: 3,
    title: "Divine Light Unveiled",
    link: "https://selar.com/377r17",
    tag: "Revelation",
    tagColor: "#22c55e",
    cover: "https://files.selar.co/product-images/2023/products/Hassanololade/divine-light-unveiled-selar.co-6565d94c583ca.jpg",
    desc: "Unveiling the mysteries of divine light and its transformative power.",
  },
  {
    id: 4,
    title: "Spirit Technology",
    link: "https://selar.com/Spirit%20technology",
    tag: "Spiritual",
    tagColor: "#ef4444",
    cover: "https://files.selar.co/product-images/2023/products/Hassanololade/spirit-technology-selar.co-63d77de9dcbeb.jpg",
    desc: "Discover the technology embedded in the human spirit by God.",
  },
  {
    id: 5,
    title: "The Emergence of Luminary Mystics",
    link: "https://selar.com/Emergence%20of%20luminary%20mystics",
    tag: "Mystery",
    tagColor: "#F5A800",
    cover: "https://files.selar.co/product-images/2023/products/Hassanololade/the-emergence-of-luminary-selar.co-63d75ea81b100.jpeg",
    desc: "The rise of those who carry divine light and supernatural wisdom.",
  },
  {
    id: 6,
    title: "Exploring the Realms of the Spirit",
    link: "https://selar.com/Exploring%20the%20realm%20of%20the%20spirit",
    tag: "Mystery",
    tagColor: "#F5A800",
    cover: "https://files.selar.co/product-images/2023/products/Hassanololade/exploring-the-realms-of-t-selar.co-63d2ad3998669.jpg",
    desc: "A practical exploration into the spirit realm and its operations.",
  },
  {
    id: 7,
    title: "Practical Guide to Meditation",
    link: "https://selar.com/Practical%20quide%20to%20meditation",
    tag: "Practice",
    tagColor: "#06b6d4",
    cover: "https://files.selar.co/product-images/2023/products/Hassanololade/practical-quide-to-medita-selar.co-63d230649fe69.jpg",
    desc: "Step-by-step guidance to deep, effective spiritual meditation.",
  },
  {
    id: 8,
    title: "Metanoia",
    link: "https://selar.com/5akf",
    tag: "Transformation",
    tagColor: "#ec4899",
    cover: "https://files.selar.co/product-images/2023/products/Hassanololade/metanoia-selar.co-63d11fbdb960a.jpg",
    desc: "A radical shift in thinking that transforms your entire life.",
  },
  {
    id: 9,
    title: "Kingdom Mechanics",
    link: "https://selar.com/Kingdom%20mechanics",
    tag: "Kingdom",
    tagColor: "#9333EA",
    cover: "https://files.selar.co/product-images/2023/products/Hassanololade/kingdom-mechanics-christm-selar.co-63cebd753d1a4.png",
    desc: "Understanding how the Kingdom of God operates and functions.",
  },
  {
    id: 10,
    title: "Forensic Prophecy",
    link: "https://selar.com/Forensic%20prophesy",
    tag: "Prophetic",
    tagColor: "#f97316",
    cover: "https://files.selar.co/product-images/2023/products/Hassanololade/forensic-prophesy-nick-gr-selar.co-63ceba24d8770.png",
    desc: "Deep investigation into the science and precision of prophetic ministry.",
  },
  {
    id: 11,
    title: "Heavenly Portals and Ancient Gates",
    link: "https://selar.com/Heavenly%20portals%20and%20ancient%20gates",
    tag: "Mystery",
    tagColor: "#F5A800",
    cover: "https://files.selar.co/product-images/2023/products/Hassanololade/heavenly-portals-and-anci-selar.co-63c64ff74fcd8.png",
    desc: "Unlocking access points between heaven and earth.",
  },
  {
    id: 12,
    title: "Paradigm Shift",
    link: "https://selar.com/Paradigm%20shift",
    tag: "Transformation",
    tagColor: "#ec4899",
    cover: "https://files.selar.co/product-images/2023/products/Hassanololade/paradigm-shift-selar.co-63c64cbe85895.png",
    desc: "Shifting the lens through which you see God, life, and purpose.",
  },
  {
    id: 13,
    title: "Honour",
    link: "https://selar.com/Honour",
    tag: "Kingdom",
    tagColor: "#9333EA",
    cover: "https://files.selar.co/product-images/2023/products/Hassanololade/honour-selar.co-63c643decdd17.jpg",
    desc: "The kingdom principle of honour and its supernatural returns.",
  },
  {
    id: 14,
    title: "Divine Nutrition",
    link: "https://selar.com/Divine%20nutrition",
    tag: "Spiritual",
    tagColor: "#ef4444",
    cover: "https://files.selar.co/product-images/2023/products/Hassanololade/divine-nutrition-selar.co-63c5142841ba3.png",
    desc: "Feeding your spirit with the substance of heaven.",
  },
  {
    id: 15,
    title: "The Seven Lamp Stands",
    link: "https://selar.com/The%20seven%20lamp%20stand",
    tag: "Revelation",
    tagColor: "#22c55e",
    cover: "https://files.selar.co/product-images/2023/products/Hassanololade/the-seven-lamp-stands-selar.co-63c50d3be9df4.jpg",
    desc: "A revelatory study of the seven lampstands of Revelation.",
  },
  {
    id: 16,
    title: "The Practice of God's Person, Presence and Glory",
    link: "https://selar.com/The%20practice%20of%20God's%20person,%20presence%20and%20glory.",
    tag: "Practice",
    tagColor: "#06b6d4",
    cover: "https://files.selar.co/product-images/2023/products/Hassanololade/the-practice-of-god-s-per-selar.co-63c4f13cbbba3.png",
    desc: "Practical keys to hosting the presence and glory of God daily.",
  },
  {
    id: 17,
    title: "Meditation",
    link: "https://selar.com/Meditation",
    tag: "Practice",
    tagColor: "#06b6d4",
    cover: "https://files.selar.co/product-images/2023/products/Hassanololade/meditation-selar.co-63bc5b71a1609.png",
    desc: "The art and science of biblical meditation for spiritual growth.",
  },
  {
    id: 18,
    title: "The Practice of Divine Life",
    link: "https://selar.com/Practice%20of%20Divine%20Life",
    tag: "Practice",
    tagColor: "#06b6d4",
    cover: "https://files.selar.co/product-images/2023/products/Hassanololade/the-practice-of-divine-li-selar.co-63bc569d7c706.jpeg",
    desc: "Living out the divine nature deposited in every believer.",
  },
  {
    id: 19,
    title: "The Mystery of Divine Love",
    link: "https://selar.com/Mystery%20Of%20Divine%20Love",
    tag: "Mystery",
    tagColor: "#F5A800",
    cover: "https://files.selar.co/product-images/2023/products/Hassanololade/the-mystery-of-divine-lov-selar.co-63bc543f7a0ad.png",
    desc: "Unraveling the depths of God's love as a force and mystery.",
  },
  {
    id: 20,
    title: "Exploring the Realms and Dimensions of the Spirit",
    link: "https://selar.com/Explorin%20The%20Realms%20And%20Dimensions%20Of%20The%20Spirit",
    tag: "Mystery",
    tagColor: "#F5A800",
    cover: "https://files.selar.co/product-images/2023/products/Hassanololade/exploring-the-realms-and--selar.co-63b94bb6224ce.jpg",
    desc: "A deeper dive into the realms and dimensions of spiritual reality.",
  },
  {
    id: 21,
    title: "Routing the Works of Darkness",
    link: "https://selar.com/Routing%20the%20Works%20of%20darkness",
    tag: "Spiritual",
    tagColor: "#ef4444",
    cover: "https://files.selar.co/product-images/2023/products/Hassanololade/routing-the-works-of-dark-selar.co-63b93fef5d281.png",
    desc: "Strategic spiritual warfare for dismantling works of darkness.",
  },
];

const filters = ["All", "Spiritual", "Mystery", "Revelation", "Transformation", "Kingdom", "Prophetic", "Practice"];

export default function BooksPage({ searchQuery = "" }) {
  const width    = useWidth();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const sidePad  = isMobile ? 20 : isTablet ? 32 : 64;
  const topOffset = isMobile ? 130 : 76;

  const [activeFilter, setActiveFilter] = useState("All");
  const [localSearch,  setLocalSearch]  = useState(searchQuery);
  const [hovered,      setHovered]      = useState(null);

  // Sync external search query from navbar
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Filter + search logic
  const filtered = ALL_BOOKS.filter(b => {
    const matchFilter = activeFilter === "All" || b.tag === activeFilter;
    const matchSearch = !localSearch ||
      b.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      b.tag.toLowerCase().includes(localSearch.toLowerCase()) ||
      b.desc.toLowerCase().includes(localSearch.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <>
      <style>{`
        @keyframes bk-fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bk-shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes bk-float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        .bk-page { animation: bk-fadeUp 0.6s ease forwards; }

        .bk-gold {
          background: linear-gradient(135deg, #C88600 0%, #F5A800 35%, #FFD166 55%, #F5A800 75%, #C88600 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: bk-shimmer 4s linear infinite;
        }

        /* Filter pills */
        .bk-pill {
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px; letter-spacing: 2px; font-weight: 700;
          text-transform: uppercase; padding: 8px 18px;
          border-radius: 2px; cursor: pointer;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent; color: rgba(255,255,255,0.45);
          transition: all 0.25s; white-space: nowrap;
        }
        .bk-pill:hover { border-color: rgba(245,168,0,0.5); color: #F5A800; background: rgba(245,168,0,0.05); }
        .bk-pill.active { background: #F5A800; color: #000; border-color: #F5A800; }

        /* Book card */
        .bk-card {
          background: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.35s, box-shadow 0.35s, border-color 0.35s;
          position: relative;
        }
        .bk-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.7);
        }

        /* Cover */
        .bk-cover {
          overflow: hidden;
          position: relative;
          background: #111;
        }
        .bk-cover img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform 0.5s ease;
        }
        .bk-card:hover .bk-cover img { transform: scale(1.06); }

        /* Overlay on hover */
        .bk-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.35s;
          display: flex; align-items: flex-end; padding: 20px;
        }
        .bk-card:hover .bk-overlay { opacity: 1; }

        /* Buy button */
        .bk-buy {
          display: inline-block;
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px; letter-spacing: 3px;
          text-transform: uppercase; font-weight: 700;
          color: #000; background: #F5A800;
          padding: 12px 28px; border-radius: 2px;
          text-decoration: none; transition: all 0.3s;
          border: none; cursor: pointer; width: 100%;
          text-align: center;
        }
        .bk-buy:hover { background: #FFD166; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(245,168,0,0.4); }

        /* Search input */
        .bk-search {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(245,168,0,0.2);
          border-radius: 4px; padding: 12px 18px;
          color: #fff; font-family: 'Rajdhani', sans-serif;
          font-size: 14px; outline: none; width: 100%;
          max-width: 360px; transition: border-color 0.3s;
          letter-spacing: 0.5px;
        }
        .bk-search:focus { border-color: #F5A800; box-shadow: 0 0 16px rgba(245,168,0,0.12); }
        .bk-search::placeholder { color: rgba(255,255,255,0.25); }

        .bk-tag {
          display: inline-block;
          font-family: 'Rajdhani', sans-serif;
          font-size: 9px; letter-spacing: 3px;
          text-transform: uppercase; font-weight: 700;
          padding: 3px 10px; border-radius: 2px;
          margin-bottom: 8px; color: #fff;
        }

        .bk-title {
          font-family: 'Cinzel', serif;
          font-weight: 700; color: #fff;
          line-height: 1.3; margin-bottom: 8px;
        }

        .bk-desc {
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px; font-weight: 300; font-style: italic;
          color: rgba(255,255,255,0.45); line-height: 1.6;
          margin-bottom: 18px;
        }

        .bk-eyebrow {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px; letter-spacing: 5px;
          text-transform: uppercase; color: #F5A800;
          margin-bottom: 16px;
        }
        .bk-eyebrow-line { width: 24px; height: 1px; background: #F5A800; display: inline-block; }

        .no-results {
          text-align: center; padding: 80px 20px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; font-style: italic;
          color: rgba(255,255,255,0.3);
        }
      `}</style>

      <div className="bk-page" style={{
        background: "#000", minHeight: "100vh",
        paddingTop: topOffset, paddingBottom: isMobile ? 80 : 60,
      }}>

        {/* ── HERO BANNER ── */}
        <section style={{
    padding: `${isMobile ? 48 : 72}px ${sidePad}px ${isMobile ? 40 : 60}px`,
    backgroundImage: `
      linear-gradient(
        rgba(0, 0, 0, 0.81),
        rgba(0, 0, 0, 0.92)
      ),
      url("/images/banner.png")
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    borderBottom: "1px solid rgba(245,168,0,0.1)",
    position: "relative",
    overflow: "hidden",
  }}>
          {/* bg orb */}
          <div style={{ position:"absolute", top:"-20%", right:"5%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(245,168,0,0.08) 0%,transparent 70%)", pointerEvents:"none" }} />
          {/* gold grid */}
          <div style={{ position:"absolute", inset:0, opacity:0.025, backgroundImage:"linear-gradient(rgba(245,168,0,1) 1px,transparent 1px),linear-gradient(90deg,rgba(245,168,0,1) 1px,transparent 1px)", backgroundSize:"48px 48px", pointerEvents:"none" }} />

          <div style={{ position:"relative", zIndex:1 }}>
            <div className="bk-eyebrow"><span className="bk-eyebrow-line" />Zoe Store</div>

            <h1 style={{
              fontFamily: "Cinzel, serif", fontWeight: 900,
              fontSize: isMobile ? 34 : isTablet ? 48 : 64,
              lineHeight: 1.0, marginBottom: 16,
              letterSpacing: "-2px",
            }}>
              <span className="bk-gold">Books &</span>
              <br />
              <span style={{ color: "#fff" }}>Revelations</span>
            </h1>

            <p style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: isMobile ? 16 : 20,
              fontWeight: 300, fontStyle: "italic",
              color: "rgba(255,255,255,0.55)",
              maxWidth: 520, lineHeight: 1.8, marginBottom: 36,
            }}>
              Kingdom literature that unlocks mysteries, shifts paradigms, and builds
              spiritual capacity. Every book is a portal.
            </p>

            {/* Stats */}
            <div style={{ display:"flex", gap:isMobile?20:48, flexWrap:"wrap" }}>
              {[
                { num: "21",   label: "Books Available" },
                { num: "100%", label: "Digital Downloads" },
                { num: "∞",    label: "Kingdom Wisdom" },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily:"Cinzel,serif", fontSize:isMobile?24:32, fontWeight:900, color:"#F5A800", lineHeight:1, marginBottom:4, textShadow:"0 0 20px rgba(245,168,0,0.4)" }}>{s.num}</div>
                  <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:9, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,0.3)", fontWeight:600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEARCH + FILTERS ── */}
        <section style={{ padding:`${isMobile?32:48}px ${sidePad}px 0` }}>
          {/* Search bar */}
          <div style={{ marginBottom:24, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
            <div style={{ position:"relative", flex:1, maxWidth:360 }}>
              <svg style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)" }} width="14" height="14" fill="none" stroke="rgba(245,168,0,0.5)" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="bk-search"
                style={{ paddingLeft:40 }}
                placeholder="Search books by title, topic..."
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
              />
              {localSearch && (
                <span
                  onClick={() => setLocalSearch("")}
                  style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.3)", cursor:"pointer", fontSize:18, lineHeight:1 }}>×</span>
              )}
            </div>
            <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:12, letterSpacing:2, color:"rgba(255,255,255,0.3)" }}>
              {filtered.length} book{filtered.length !== 1 ? "s" : ""} found
            </div>
          </div>

          {/* Filter pills */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", overflowX:"auto", paddingBottom:4 }}>
            {filters.map(f => (
              <button key={f} className={`bk-pill ${activeFilter===f?"active":""}`} onClick={()=>setActiveFilter(f)}>{f}</button>
            ))}
          </div>
        </section>

        {/* ── BOOKS GRID ── */}
        <section style={{ padding:`32px ${sidePad}px ${isMobile?40:60}px` }}>
          {filtered.length === 0 ? (
            <div className="no-results">
              No books found for "{localSearch || activeFilter}"<br/>
              <span style={{ fontSize:14, display:"block", marginTop:8 }}>Try a different search or filter</span>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
              gap: isMobile ? 12 : 20,
            }}>
              {filtered.map((b, i) => (
                <div
                  key={b.id}
                  className="bk-card"
                  style={{
                    borderColor: hovered === b.id ? `${b.tagColor}44` : "rgba(255,255,255,0.06)",
                    boxShadow: hovered === b.id ? `0 0 30px ${b.tagColor}22` : "none",
                    animationDelay: `${i * 0.05}s`,
                    animation: "bk-fadeUp 0.5s ease both",
                  }}
                  onMouseEnter={() => setHovered(b.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Cover image */}
                  <div className="bk-cover" style={{ height: isMobile ? 200 : 280 }}>
                    <img src={b.cover} alt={b.title} loading="lazy" />
                    {/* Gradient overlay always */}
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%)" }} />
                    {/* Hover overlay with description */}
                    <div className="bk-overlay">
                      <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:13, fontStyle:"italic", color:"rgba(255,255,255,0.8)", lineHeight:1.6 }}>
                        {b.desc}
                      </p>
                    </div>
                    {/* Tag badge on image */}
                    <div style={{ position:"absolute", top:10, left:10 }}>
                      <div className="bk-tag" style={{ background: b.tagColor }}>{b.tag}</div>
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: isMobile ? "14px 14px 16px" : "18px 18px 20px" }}>
                    <div className="bk-title" style={{ fontSize: isMobile ? 13 : 15 }}>
                      {b.title}
                    </div>

                    <a
                      href={b.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bk-buy"
                      onClick={e => e.stopPropagation()}
                    >
                      Buy on Selar →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── BOTTOM CTA ── */}
        <section style={{
          padding: `${isMobile?40:64}px ${sidePad}px`,
          background: "linear-gradient(135deg, #0a0800, #000)",
          borderTop: "1px solid rgba(245,168,0,0.1)",
          textAlign: "center",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position:"absolute", top:"-30%", right:"10%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(245,168,0,0.08) 0%,transparent 70%)", pointerEvents:"none" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <div className="bk-eyebrow" style={{ justifyContent:"center" }}>
              <span className="bk-eyebrow-line" />Kingdom Literature<span className="bk-eyebrow-line" />
            </div>
            <h2 style={{ fontFamily:"Cinzel,serif", fontSize:isMobile?24:36, fontWeight:700, color:"#fff", marginBottom:14 }}>
              More Books Coming Soon
            </h2>
            <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:isMobile?15:18, fontStyle:"italic", color:"rgba(255,255,255,0.45)", maxWidth:460, margin:"0 auto 32px", lineHeight:1.8 }}>
              New revelations are always being written. Follow us to be the first to know when new books drop.
            </p>
            <a href="https://selar.com/m/Hassanololade" target="_blank" rel="noopener noreferrer" style={{ fontFamily:"Rajdhani,sans-serif", fontSize:12, letterSpacing:3, textTransform:"uppercase", fontWeight:700, color:"#000", background:"#F5A800", padding:"15px 44px", borderRadius:2, textDecoration:"none", display:"inline-block", transition:"all 0.3s" }}>
              Visit Full Store on Selar
            </a>
          </div>
        </section>

      </div>
    </>
  );
}
