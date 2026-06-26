

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

const GUIDES = [
  // ── Devotional
  {
    id: 1,
    category: "Devotional",
    tag: "Devotional",
    tagColor: "#9333EA",
    title: "STREAMS OF IMMORTALITY",
    subtitle: "A week-long journey into God's presence",
    desc: "Each day of this guide walks you through a scripture, a reflection, a declaration, and a prayer. Designed to transform your mornings and anchor your week in the Word.",
    duration: "Daily",
    level: "All Levels",
    author: "Zoe School of Mysteries",
    icon: "🌅",
    cover: "/images/new.jpeg",
    featured: true,
  },
  {
    id: 1,
    category: "Devotional",
    tag: "Devotional",
    tagColor: "#9333EA",
    title: "STREAMS OF IMMORTALITY",
    subtitle: "A week-long journey into God's presence",
    desc: "Each day of this guide walks you through a scripture, a reflection, a declaration, and a prayer. Designed to transform your mornings and anchor your week in the Word.",
    pages: 14,
    duration: "7 Days",
    level: "All Levels",
    author: "Zoe School of Mysteries",
    icon: "🌅",
    cover: "/images/photo_2025-12-28_05-26-28.jpg",
    featured: true,
  },
  {
    id: 2,
    category: "Devotional",
    tag: "Devotional",
    tagColor: "#9333EA",
    title: "Seated in Heavenly Places",
    subtitle: "Understanding your position in Christ",
    desc: "A 7-day devotional guide unpacking Ephesians 2:6 — what it truly means to be seated with Christ in heavenly places and how to live from that reality.",
    duration: "7 Days",
    level: "All Levels",
    author: "Zoe School of Mysteries",
    icon: "👑",
    cover: "https://m.media-amazon.com/images/I/81vH03BiflL._AC_UF1000,1000_QL80_.jpg",
    featured: false,
  },
  // ── David Yonggi Cho
  {
    id: 3,
    category: "David Yonggi Cho",
    tag: "David Yonggi Cho",
    tagColor: "#7C3AED",
    title: "4th Dimensional Living in a 3D World",
    subtitle: "By David Yonggi Cho",
    desc: "Discover how to harness the power of the fourth dimension — the realm of the spirit — to impact the physical world. A foundational classic that unlocks the science of faith, dreams, visions, and prayer.",
    pages: 148,
    duration: "Self-Paced",
    level: "All Levels",
    author: "David Yonggi Cho",
    icon: "🌐",
    cover: "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/77/9242371/1.jpg?7186",
    featured: true,
  },
  {
    id: 5,
    category: "David Yonggi Cho",
    tag: "David Yonggi Cho",
    tagColor: "#7C3AED",
    title: "The 4th Dimension",
    subtitle: "By David Yonggi Cho",
    desc: "The groundbreaking original work by Dr. Cho that reveals the spiritual laws governing creation. Learn how faith, prayer and the Word of God operate in the fourth dimension to produce supernatural results.",
    pages: 176,
    duration: "Self-Paced",
    level: "Intermediate",
    author: "David Yonggi Cho",
    icon: "🔮",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMr69rqQz_mveBrLQdTuZlCvBrVF_qIdg_5g&s",
    featured: false,
  },
  // ── Dag Heward-Mills
  {
    id: 4,
    category: "Dag Heward-Mills",
    tag: "Dag Heward-Mills",
    tagColor: "#F5A800",
    title: "The Skills of a Shepherd",
    subtitle: "By Dag Heward-Mills",
    desc: "A practical manual on pastoral ministry — covering how to lead, guard, feed, and care for a congregation. Essential reading for every minister, eGroup leader, and aspiring shepherd of souls.",
    pages: 224,
    duration: "Self-Paced",
    level: "Intermediate",
    author: "Dag Heward-Mills",
    icon: "🐑",
    cover: "/images/Screenshot 2026-06-10 214302.png",
    featured: true,
  },
  {
    id: 10,
    category: "Dag Heward-Mills",
    tag: "Dag Heward-Mills",
    tagColor: "#F5A800",
    title: "Loyalty and Disloyalty",
    subtitle: "By Dag Heward-Mills",
    desc: "One of the most influential books in ministry. Dag Heward-Mills exposes how disloyalty destroys ministries and relationships, and lays out the biblical foundation for true, lasting loyalty in the Kingdom.",
    pages: 168,
    duration: "Self-Paced",
    level: "All Levels",
    author: "Dag Heward-Mills",
    icon: "🤝",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJA33-f9gyczPrH6G8DQ7zu71SgP1ECr4yhw&s",
    featured: false,
  },
  {
    id: 11,
    category: "Dag Heward-Mills",
    tag: "Dag Heward-Mills",
    tagColor: "#F5A800",
    title: "Those Who Honour You",
    subtitle: "By Dag Heward-Mills",
    desc: "A powerful continuation of Loyalty and Disloyalty — exploring how honouring God and His servants unlocks supernatural favour, promotion, and divine blessing in every area of life.",
    pages: 144,
    duration: "Self-Paced",
    level: "All Levels",
    author: "Dag Heward-Mills",
    icon: "🏆",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQxGYSVmsRioO2jWDTpkVpGd9py-vc4FGWTg&s",
    featured: false,
  },
  // ── God's Generals
  {
    id: 6,
    category: "God's Generals",
    tag: "God's Generals",
    tagColor: "#22c55e",
    title: "God's Generals: The Missionaries",
    subtitle: "By Roberts Liardon",
    desc: "Roberts Liardon chronicles the extraordinary lives of missionaries who gave everything to take the Gospel to the ends of the earth. Inspiring, faith-building accounts of sacrifice, miracles, and divine calling.",
    pages: 336,
    duration: "Self-Paced",
    level: "All Levels",
    author: "Roberts Liardon",
    icon: "🌍",
    cover: "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/01/1114903/1.jpg?2426",
    featured: false,
  },
  {
    id: 7,
    category: "God's Generals",
    tag: "God's Generals",
    tagColor: "#22c55e",
    title: "God's Generals: The Healing Evangelists",
    subtitle: "By Roberts Liardon",
    desc: "A gripping look at the great healing evangelists — men and women who carried extraordinary gifts of healing and brought revival wherever they went. Discover what made them powerful and where some fell.",
    pages: 368,
    duration: "Self-Paced",
    level: "All Levels",
    author: "Roberts Liardon",
    icon: "⚡",
    cover: "https://globalawakeningstore.com/cdn/shop/files/d5b68edb369d94938c0cb54745e90ace.png?v=1729535483&width=1520",
    featured: true,
  },
  {
    id: 8,
    category: "God's Generals",
    tag: "God's Generals",
    tagColor: "#22c55e",
    title: "God's Generals Vol. 3: The Revivalists",
    subtitle: "By Roberts Liardon",
    desc: "Volume 3 of the acclaimed series profiles the revivalists who shook nations and birthed some of the greatest moves of God in history. An essential study of revival history for every Spirit-filled believer.",
    pages: 352,
    duration: "Self-Paced",
    level: "All Levels",
    author: "Roberts Liardon",
    icon: "🔥",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2arVd74k8-_d0IPwz7ZAkJ3jMMVSyLx0HJg&s",
    featured: false,
  },
  // ── Andrew Wommack
  {
    id: 9,
    category: "Andrew Wommack",
    tag: "Andrew Wommack",
    tagColor: "#ef4444",
    title: "Spirit, Soul and Body",
    subtitle: "By Andrew Wommack",
    desc: "One of Andrew Wommack's most foundational teachings — clearly explaining the tripartite nature of man. Understanding the difference between your spirit, soul and body is key to walking in consistent victory and healing.",
    pages: 128,
    duration: "Self-Paced",
    level: "Beginner",
    author: "Andrew Wommack",
    icon: "🧠",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFRngXx5dAmTGNflB0pZaDf4PFzSWYwqANHw&s",
    featured: false,
  },
  // ── Ruth Ward Heflin
  {
    id: 12,
    category: "Ruth Ward Heflin",
    tag: "Ruth Ward Heflin",
    tagColor: "#06b6d4",
    title: "Golden Glory",
    subtitle: "By Ruth Ward Heflin",
    desc: "Ruth Ward Heflin shares revelations on the golden glory of God — the visible, tangible manifestation of His presence. A profound invitation into deeper realms of worship, intercession, and divine encounter.",
    pages: 192,
    duration: "Self-Paced",
    level: "Intermediate",
    author: "Ruth Ward Heflin",
    icon: "✨",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6rMSMlNleykzOCKzeloDDCkE_6vKuB_u5Yw&s",
    featured: false,
  },
  {
    id: 13,
    category: "Ruth Ward Heflin",
    tag: "Ruth Ward Heflin",
    tagColor: "#06b6d4",
    title: "Revelation Glory",
    subtitle: "By Ruth Ward Heflin",
    desc: "A companion to Golden Glory — exploring new depths of God's manifest presence, prophetic revelation and the atmosphere of Heaven. Heflin's writing carries the weight of someone who lived in sustained glory.",
    pages: 176,
    duration: "Self-Paced",
    level: "Advanced",
    author: "Ruth Ward Heflin",
    icon: "🌟",
    cover: "https://m.media-amazon.com/images/I/71j01nPAZ8L.jpg_BO30,255,255,255_UF750,750_SR1910,1000,0,C_QL100_.jpg",
    featured: false,
  },
  // ── Bruce D. Allen
  {
    id: 14,
    category: "Bruce D. Allen",
    tag: "Bruce D. Allen",
    tagColor: "#ec4899",
    title: "Gazing Into Glory",
    subtitle: "By Bruce D. Allen",
    desc: "Bruce Allen takes you into the realm of God's glory — teaching believers how to see in the Spirit, receive divine revelation, and live in the abiding presence of God through biblical contemplation and spiritual perception.",
    pages: 208,
    duration: "Self-Paced",
    level: "Intermediate",
    author: "Bruce D. Allen",
    icon: "👁️",
    cover: "https://m.media-amazon.com/images/I/61j7g57vK2L.jpg_BO30,255,255,255_UF750,750_SR1910,1000,0,C_QL100_.jpg",
    featured: true,
  },
  // ── Kathryn Kuhlman
  {
    id: 15,
    category: "Kathryn Kuhlman",
    tag: "Kathryn Kuhlman",
    tagColor: "#f97316",
    title: "Glimpse Into Glory",
    subtitle: "By Kathryn Kuhlman",
    desc: "A remarkable account of a divine vision given to Kathryn Kuhlman — a glimpse of Heaven, the presence of Jesus, and the eternal realities that fuelled her extraordinary healing ministry. Deeply moving and transforming.",
    pages: 96,
    duration: "Self-Paced",
    level: "All Levels",
    author: "Kathryn Kuhlman",
    icon: "🕊️",
    cover: "https://m.media-amazon.com/images/I/61b5bgiUJ7L._AC_UF1000,1000_QL80_.jpg",
    featured: false,
  },
];

const CATEGORIES = [
  "All",
  "Devotional",
  "David Yonggi Cho",
  "Dag Heward-Mills",
  "God's Generals",
  "Andrew Wommack",
  "Ruth Ward Heflin",
  "Bruce D. Allen",
  "Kathryn Kuhlman",
];

const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const TELEGRAM_LINK = "https://t.me/+Rbm2mYDv2TlJLdoJ";

function downloadGuide(guide) {
  const pdfUrls = {
    1:  "/pdfs/STREAMS OF IMMORTALITY DEVOTIONAL.pdf",
    2:  "/pdfs/Seated_in_Heavenly_Places.pdf",
    3:  "/pdfs/4th Dimensional Living in a 3 D - David Yonggi Cho.pdf",
    4:  "/pdfs/The Skills Of A Shepherd-Dag-Heward Mills.pdf",
    5:  "/pdfs/The 4th Dimension-David Yonggi Cho.pdf",
    6:  "/pdfs/God s Generals - The Missionaries.pdf",
    7:  "/pdfs/God's Generals - Healing evangelists.pdf",
    8:  "/pdfs/God's Generals vol 3_ The Revivalists - Roberts Liardon.pdf",
    9:  "/pdfs/Spirit, Soul   Body - Andrew Wommack.pdf",
    10: "/pdfs/Loyalty And Disloyalty - Dag Heward-Mills.pdf",
    11: "/pdfs/Those Who Honour You (Loyalty a - Dag Heward-Mills.pdf",
    12: "/pdfs/Golden Glory - Ruth Ward Heflin.pdf",
    13: "/pdfs/Revelation Glory - Ruth Ward Heflin.pdf",
    14: "/pdfs/Gazing Into Glory_ Every Believ - Bruce D Allen.pdf",
    15: "/pdfs/Glimpse Into Glory - Kathryn Kuhlman (2).pdf",
  };
  const url = pdfUrls[guide.id] || "";
  if (!url) return;
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function StudyGuidesPage() {
  const width     = useWidth();
  const isMobile  = width < 640;
  const isTablet  = width >= 640 && width < 1024;
  const sidePad   = isMobile ? 20 : isTablet ? 32 : 64;
  const topOffset = isMobile ? 130 : 76;

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLevel,    setActiveLevel]    = useState("All Levels");
  const [search,         setSearch]         = useState("");
  const [selected,       setSelected]       = useState(null);
  const [downloaded,     setDownloaded]     = useState([]);

  const filtered = GUIDES.filter(g => {
    const matchCat    = activeCategory === "All" || g.category === activeCategory;
    const matchLevel  = activeLevel    === "All Levels" || g.level === activeLevel;
    const matchSearch = !search ||
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.author.toLowerCase().includes(search.toLowerCase()) ||
      g.desc.toLowerCase().includes(search.toLowerCase()) ||
      g.tag.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchLevel && matchSearch;
  });

  const featured = GUIDES.filter(g => g.featured);

  const handleDownload = (guide, e) => {
    e.stopPropagation();
    setDownloaded(d => [...new Set([...d, guide.id])]);
    downloadGuide(guide);
  };

  const isDownloaded = (id) => downloaded.includes(id);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Rajdhani:wght@500;600;700&display=swap');

        @keyframes sg-fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sg-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }

        .sg-page { animation: sg-fadeUp 0.5s ease forwards; font-size: 17px; }

        .sg-gold {
          background: linear-gradient(135deg,#C88600 0%,#F5A800 35%,#FFD166 55%,#F5A800 75%,#C88600 100%);
          background-size: 200% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; animation:sg-shimmer 4s linear infinite;
        }

        .sg-pill {
          font-family:'Rajdhani',sans-serif;
          font-size:13px; letter-spacing:1.5px; font-weight:700;
          text-transform:uppercase; padding:9px 18px;
          border-radius:20px; cursor:pointer;
          border:1px solid rgba(255,255,255,0.1);
          background:transparent; color:rgba(255,255,255,0.45);
          transition:all 0.22s; white-space:nowrap;
        }
        .sg-pill:hover  { border-color:rgba(245,168,0,0.45); color:#F5A800; background:rgba(245,168,0,0.06); }
        .sg-pill.active { background:rgba(245,168,0,0.15); color:#F5A800; border-color:rgba(245,168,0,0.5); }

        .sg-card {
          background:#0a0a0a;
          border:1px solid rgba(255,255,255,0.06);
          border-radius:6px; overflow:hidden;
          cursor:pointer;
          transition:transform 0.3s, box-shadow 0.3s, border-color 0.3s;
          display:flex; flex-direction:column;
        }
        .sg-card:hover {
          transform:translateY(-5px);
          box-shadow:0 20px 50px rgba(0,0,0,0.6);
          border-color:rgba(245,168,0,0.2);
        }
        .sg-card-img { overflow:hidden; position:relative; flex-shrink:0; }
        .sg-card-img img { width:100%; height:100%; object-fit:cover; transition:transform 0.5s; display:block; }
        .sg-card:hover .sg-card-img img { transform:scale(1.04); }

        .sg-featured {
          background:#0a0a0a;
          border:1px solid rgba(245,168,0,0.12);
          border-radius:6px; overflow:hidden;
          cursor:pointer; transition:all 0.3s;
          display:flex; flex-direction:column;
        }
        .sg-featured:hover {
          border-color:rgba(245,168,0,0.35);
          box-shadow:0 16px 50px rgba(0,0,0,0.5);
        }

        .sg-dl-btn {
          display:inline-flex; align-items:center; gap:9px;
          font-family:'Rajdhani',sans-serif;
          font-size:14px; letter-spacing:2px;
          text-transform:uppercase; font-weight:700;
          padding:14px 22px; border-radius:4px;
          border:none; cursor:pointer; transition:all 0.28s;
          width:100%; justify-content:center;
        }
        .sg-dl-btn.free { background:#F5A800; color:#000; }
        .sg-dl-btn.free:hover { background:#FFD166; transform:translateY(-2px); box-shadow:0 6px 20px rgba(245,168,0,0.35); }
        .sg-dl-btn.done { background:rgba(34,197,94,0.1); color:#22c55e; border:1px solid rgba(34,197,94,0.3); }

        .sg-tg-btn {
          display:inline-flex; align-items:center; justify-content:center; gap:10px;
          font-family:'Rajdhani',sans-serif;
          font-size:15px; letter-spacing:2px;
          text-transform:uppercase; font-weight:700;
          padding:18px 40px; border-radius:4px;
          border:none; cursor:pointer; transition:all 0.3s;
          background:linear-gradient(135deg,#0088cc,#006ea6);
          color:#fff; text-decoration:none;
        }
        .sg-tg-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,136,204,0.4); background:linear-gradient(135deg,#009de0,#0088cc); }

        .sg-modal-overlay {
          position:fixed; inset:0; z-index:3000;
          background:rgba(0,0,0,0.88); backdrop-filter:blur(8px);
          display:flex; align-items:center; justify-content:center;
          padding:20px;
        }
        .sg-modal {
          background:#111; border:1px solid rgba(245,168,0,0.18);
          border-radius:8px; max-width:680px; width:100%;
          max-height:90vh; overflow-y:auto;
          animation:sg-fadeUp 0.3s ease forwards;
        }

        .sg-search {
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(245,168,0,0.2);
          border-radius:4px; padding:13px 18px 13px 44px;
          color:#fff; font-family:'Rajdhani',sans-serif;
          font-size:16px; outline:none; width:100%;
          max-width:340px; transition:border-color 0.3s;
        }
        .sg-search:focus { border-color:#F5A800; }
        .sg-search::placeholder { color:rgba(255,255,255,0.25); }

        .sg-eyebrow {
          display:flex; align-items:center; gap:10px;
          font-family:'Rajdhani',sans-serif;
          font-size:13px; letter-spacing:4px;
          text-transform:uppercase; color:#F5A800; margin-bottom:16px;
          font-weight:600;
        }
        .sg-eyebrow-line { width:22px; height:1px; background:#F5A800; display:inline-block; }

        .sg-stat-num { font-family:'Cinzel',serif; font-weight:900; color:#F5A800; line-height:1; margin-bottom:6px; text-shadow:0 0 20px rgba(245,168,0,0.35); }
        .sg-stat-label { font-family:'Rajdhani',sans-serif; font-size:12px; letter-spacing:3px; text-transform:uppercase; color:rgba(255,255,255,0.35); font-weight:600; }

        .sg-tag { display:inline-block; font-family:'Rajdhani',sans-serif; font-size:10px; letter-spacing:2px; text-transform:uppercase; font-weight:700; padding:4px 11px; border-radius:20px; }
        .sg-meta { display:flex; align-items:center; gap:6px; font-family:'Rajdhani',sans-serif; font-size:13px; color:rgba(255,255,255,0.38); letter-spacing:0.5px; }

        .sg-tg-card {
          background:linear-gradient(135deg,rgba(0,136,204,0.08),rgba(0,80,130,0.04));
          border:1px solid rgba(0,136,204,0.2);
          border-radius:8px; padding:52px 40px;
          text-align:center; position:relative; overflow:hidden;
          transition:all 0.3s;
        }
        .sg-tg-card:hover { border-color:rgba(0,136,204,0.4); box-shadow:0 20px 60px rgba(0,136,204,0.1); }
      `}</style>

      <div className="sg-page" style={{ background:"#000", minHeight:"100vh", paddingTop:topOffset, paddingBottom:isMobile?80:60 }}>

        {/* ── HERO ── */}
        <section style={{
          padding:`${isMobile?48:72}px ${sidePad}px ${isMobile?40:60}px`,
          background:"radial-gradient(ellipse 70% 60% at 15% 50%, #0a0600 0%, #000 65%)",
          borderBottom:"1px solid rgba(245,168,0,0.07)",
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", inset:0, opacity:0.02, backgroundImage:"linear-gradient(rgba(245,168,0,1) 1px,transparent 1px),linear-gradient(90deg,rgba(245,168,0,1) 1px,transparent 1px)", backgroundSize:"48px 48px", pointerEvents:"none" }} />
          <div style={{ position:"absolute", top:"-10%", right:"5%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(245,168,0,0.06) 0%,transparent 70%)", pointerEvents:"none" }} />

          <div style={{ position:"relative", zIndex:1 }}>
            <div className="sg-eyebrow"><span className="sg-eyebrow-line" />Zoe School of Mysteries — Library</div>
            <h1 style={{ fontFamily:"Cinzel,serif", fontWeight:900, fontSize:isMobile?34:isTablet?48:64, lineHeight:1.0, marginBottom:18, letterSpacing:"-1.5px" }}>
              <span className="sg-gold">Kingdom</span><br />
              <span style={{ color:"#fff" }}>Books &</span><br />
              <span style={{ color:"transparent", WebkitTextStroke:"2px rgba(255,255,255,0.2)" }}>Resources</span>
            </h1>
            <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:isMobile?18:21, fontWeight:300, fontStyle:"italic", color:"rgba(255,255,255,0.5)", maxWidth:520, lineHeight:1.85, marginBottom:40 }}>
              Free, downloadable PDF books curated for your spiritual growth — from faith classics to prophetic literature and ministry training.
            </p>
            <div style={{ display:"flex", gap:isMobile?28:56, flexWrap:"wrap" }}>
              {[
                { num:"15+",  label:"Books Available" },
                { num:"100%", label:"Free Downloads"   },
                { num:"8",    label:"Authors"          },
                { num:"PDF",  label:"Format"           },
              ].map((s,i) => (
                <div key={i} style={{ textAlign:"center" }}>
                  <div className="sg-stat-num" style={{ fontSize:isMobile?26:34 }}>{s.num}</div>
                  <div className="sg-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED ── */}
        <section style={{ padding:`${isMobile?40:64}px ${sidePad}px`, borderBottom:"1px solid rgba(245,168,0,0.07)" }}>
          <div className="sg-eyebrow"><span className="sg-eyebrow-line" />Start Here</div>
          <h2 style={{ fontFamily:"Cinzel,serif", fontSize:isMobile?24:36, fontWeight:700, color:"#fff", marginBottom:32 }}>Featured Books</h2>

          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":isTablet?"1fr 1fr":"repeat(3,1fr)", gap:20 }}>
            {featured.slice(0,3).map(g => (
              <div key={g.id} className="sg-featured" onClick={() => setSelected(g)}>
                <div style={{ height:isMobile?190:230, overflow:"hidden", position:"relative" }}>
                  <img src={g.cover} alt={g.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s" }} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 35%,rgba(0,0,0,0.88) 100%)" }} />
                  <div style={{ position:"absolute", top:12, left:12, fontSize:24 }}>{g.icon}</div>
                  <div style={{ position:"absolute", top:12, right:12, background:"rgba(34,197,94,0.88)", padding:"4px 12px", borderRadius:20, fontFamily:"Rajdhani,sans-serif", fontSize:10, letterSpacing:2, textTransform:"uppercase", fontWeight:700, color:"#000" }}>Free PDF</div>
                  <div style={{ position:"absolute", bottom:12, left:12 }}>
                    <div className="sg-tag" style={{ background:g.tagColor+"28", color:g.tagColor, border:`1px solid ${g.tagColor}50` }}>{g.tag}</div>
                  </div>
                </div>
                <div style={{ padding:"20px 20px 24px" }}>
                  <div style={{ fontFamily:"Cinzel,serif", fontSize:isMobile?15:18, fontWeight:700, color:"#fff", marginBottom:6, lineHeight:1.3 }}>{g.title}</div>
                  <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:13, letterSpacing:1, color:"rgba(245,168,0,0.75)", marginBottom:12 }}>{g.author}</div>
                  <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:16, color:"rgba(255,255,255,0.45)", marginBottom:16, lineHeight:1.7, display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{g.desc}</div>
                  <div style={{ display:"flex", gap:16, marginBottom:16, flexWrap:"wrap" }}>
                    <div className="sg-meta"><span>📄</span>{g.pages} pages</div>
                    <div className="sg-meta"><span>🎯</span>{g.level}</div>
                  </div>
                  <button className={`sg-dl-btn ${isDownloaded(g.id)?"done":"free"}`} onClick={e=>handleDownload(g,e)}>
                    {isDownloaded(g.id)
                      ? <><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>Downloaded</>
                      : <><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>Download Free PDF</>
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ALL BOOKS ── */}
        <section style={{ padding:`${isMobile?40:64}px ${sidePad}px` }}>
          {/* Header + search */}
          <div style={{ display:"flex", alignItems:isMobile?"flex-start":"center", justifyContent:"space-between", flexDirection:isMobile?"column":"row", gap:18, marginBottom:26 }}>
            <div>
              <div className="sg-eyebrow"><span className="sg-eyebrow-line" />Full Library</div>
              <h2 style={{ fontFamily:"Cinzel,serif", fontSize:isMobile?24:36, fontWeight:700, color:"#fff" }}>All Books</h2>
            </div>
            <div style={{ position:"relative" }}>
              <svg style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)" }} width="15" height="15" fill="none" stroke="rgba(245,168,0,0.45)" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input className="sg-search" placeholder="Search by title or author..." value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
          </div>

          {/* Filter: Author / Category */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:12, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:12, fontWeight:600 }}>Filter by Author / Category</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {CATEGORIES.map(c => (
                <button key={c} className={`sg-pill ${activeCategory===c?"active":""}`} onClick={()=>setActiveCategory(c)}>{c}</button>
              ))}
            </div>
          </div>

          {/* Filter: Level */}
          <div style={{ marginBottom:36 }}>
            <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:12, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:12, fontWeight:600 }}>Reading Level</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {LEVELS.map(l => (
                <button key={l} onClick={()=>setActiveLevel(l)} style={{
                  fontFamily:"Rajdhani,sans-serif", fontSize:13, letterSpacing:1.5,
                  textTransform:"uppercase", fontWeight:700,
                  padding:"8px 16px", borderRadius:20, cursor:"pointer",
                  border:`1px solid ${activeLevel===l?"rgba(245,168,0,0.45)":"rgba(255,255,255,0.07)"}`,
                  background: activeLevel===l?"rgba(245,168,0,0.1)":"transparent",
                  color: activeLevel===l?"#F5A800":"rgba(255,255,255,0.35)",
                  transition:"all 0.2s",
                }}>{l}</button>
              ))}
            </div>
          </div>

          <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:14, letterSpacing:2, color:"rgba(255,255,255,0.3)", marginBottom:26 }}>
            {filtered.length} book{filtered.length!==1?"s":""} found
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 20px", fontFamily:"Cormorant Garamond,serif", fontSize:20, fontStyle:"italic", color:"rgba(255,255,255,0.3)" }}>
              No books found. Try a different search or filter.
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":isTablet?"repeat(2,1fr)":"repeat(3,1fr)", gap:22 }}>
              {filtered.map((g,i) => (
                <div key={g.id} className="sg-card" onClick={()=>setSelected(g)} style={{ animationDelay:`${i*0.04}s`, animation:"sg-fadeUp 0.45s ease both" }}>
                  <div className="sg-card-img" style={{ height:isMobile?188:218 }}>
                    <img src={g.cover} alt={g.title} loading="lazy" />
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 35%,rgba(0,0,0,0.8) 100%)" }} />
                    <div style={{ position:"absolute", top:10, left:10 }}>
                      <div className="sg-tag" style={{ background:g.tagColor, color:"#fff" }}>{g.tag}</div>
                    </div>
                    <div style={{ position:"absolute", top:10, right:10, background:"rgba(34,197,94,0.85)", padding:"4px 10px", borderRadius:20, fontFamily:"Rajdhani,sans-serif", fontSize:10, letterSpacing:2, fontWeight:700, color:"#000", textTransform:"uppercase" }}>Free</div>
                    <div style={{ position:"absolute", bottom:10, left:10, fontSize:20 }}>{g.icon}</div>
                  </div>

                  <div style={{ padding:"16px 18px 20px", flex:1, display:"flex", flexDirection:"column" }}>
                    <div style={{ fontFamily:"Cinzel,serif", fontSize:15, fontWeight:700, color:"#fff", lineHeight:1.3, marginBottom:6 }}>{g.title}</div>
                    <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:13, letterSpacing:1, color:"rgba(245,168,0,0.7)", marginBottom:10 }}>{g.author}</div>
                    <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:16, color:"rgba(255,255,255,0.43)", marginBottom:14, lineHeight:1.7, display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{g.desc}</div>
                    <div style={{ display:"flex", gap:14, marginBottom:14, flexWrap:"wrap" }}>
                      <div className="sg-meta">📄 {g.pages}pg</div>
                      <div className="sg-meta">🎯 {g.level}</div>
                    </div>
                    <div style={{ flex:1 }} />
                    <button className={`sg-dl-btn ${isDownloaded(g.id)?"done":"free"}`} onClick={e=>handleDownload(g,e)}>
                      {isDownloaded(g.id)
                        ? <><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>Downloaded</>
                        : <><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>Download PDF</>
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── TELEGRAM CTA ── */}
        <section style={{ padding:`${isMobile?48:72}px ${sidePad}px`, background:"#050505", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
          <div className="sg-tg-card" style={{ maxWidth:780, margin:"0 auto" }}>
            <div style={{ position:"absolute", top:"-30%", left:"50%", transform:"translateX(-50%)", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,136,204,0.12) 0%,transparent 70%)", pointerEvents:"none" }} />

            <div style={{ position:"relative", zIndex:1 }}>
              <div style={{ marginBottom:22 }}>
                <svg width="56" height="56" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="120" cy="120" r="120" fill="#0088cc"/>
                  <path d="M178 70L155.5 165.5C153.8 172.3 149.9 174 144.4 170.9L117.4 150.9L104.4 163.4C102.7 165.1 101.3 166.5 98.2 166.5L100.2 139L151.7 92.5C153.9 90.5 151.2 89.4 148.3 91.4L84.5 131.2L58 123C51.5 121.1 51.4 116.7 59.5 113.6L170 69.3C175.5 67.4 180.3 70.5 178 70Z" fill="white"/>
                </svg>
              </div>

              <div className="sg-eyebrow" style={{ justifyContent:"center" }}>
                <span className="sg-eyebrow-line" />Zoe School Library<span className="sg-eyebrow-line" />
              </div>

              <h2 style={{ fontFamily:"Cinzel,serif", fontSize:isMobile?24:36, fontWeight:700, color:"#fff", marginBottom:16, lineHeight:1.2 }}>
                Want More Free Books?
              </h2>
              <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:isMobile?17:20, fontStyle:"italic", color:"rgba(255,255,255,0.5)", maxWidth:500, margin:"0 auto 16px", lineHeight:1.85 }}>
                The full Zoe School of Mysteries library has hundreds of Spirit-filled books — free to access.
                Join our Telegram channel to get new books delivered every week.
              </p>
              <p style={{ fontFamily:"Rajdhani,sans-serif", fontSize:13, letterSpacing:2, textTransform:"uppercase", color:"rgba(0,136,204,0.75)", marginBottom:36 }}>
                Prophetic · Healing · Revival · Discipleship · Ministry · And more
              </p>

              <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer" className="sg-tg-btn">
                <svg width="20" height="20" viewBox="0 0 240 240" fill="none"><circle cx="120" cy="120" r="120" fill="white" fillOpacity="0.15"/><path d="M178 70L155.5 165.5C153.8 172.3 149.9 174 144.4 170.9L117.4 150.9L104.4 163.4C102.7 165.1 101.3 166.5 98.2 166.5L100.2 139L151.7 92.5C153.9 90.5 151.2 89.4 148.3 91.4L84.5 131.2L58 123C51.5 121.1 51.4 116.7 59.5 113.6L170 69.3C175.5 67.4 180.3 70.5 178 70Z" fill="white"/></svg>
                Join the Free Library on Telegram
              </a>

              <p style={{ fontFamily:"Rajdhani,sans-serif", fontSize:13, letterSpacing:1.5, color:"rgba(255,255,255,0.25)", marginTop:20 }}>
                100% FREE · No subscription · Direct downloads in Telegram
              </p>
            </div>
          </div>
        </section>

        {/* ── HOW TO USE ── */}
        <section style={{ padding:`${isMobile?48:64}px ${sidePad}px`, background:"#000", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
          <div className="sg-eyebrow"><span className="sg-eyebrow-line" />Getting Started</div>
          <h2 style={{ fontFamily:"Cinzel,serif", fontSize:isMobile?24:34, fontWeight:700, color:"#fff", marginBottom:40 }}>How to Use These Resources</h2>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":isTablet?"1fr 1fr":"repeat(4,1fr)", gap:16 }}>
            {[
              { icon:"🔍", title:"Find a Book",       desc:"Browse by author or category, or search by title. Every book is available at no cost."                          },
              { icon:"📥", title:"Download Free",     desc:"Click Download PDF — no sign-up, no payment, no catch. Pure Kingdom resources, freely given."                  },
              { icon:"📖", title:"Read & Meditate",   desc:"Work through each book prayerfully. Underline, journal, pray and let the Word renew your mind."                },
              { icon:"✈️", title:"Get More on Telegram", desc:"Join the Zoe School Library on Telegram for hundreds more books, updated weekly — completely free."          },
            ].map((s,i) => (
              <div key={i} style={{ padding:"26px 20px", border:"1px solid rgba(255,255,255,0.05)", borderRadius:6, background:"rgba(255,255,255,0.015)", transition:"all 0.3s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(245,168,0,0.18)";e.currentTarget.style.background="rgba(245,168,0,0.025)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.05)";e.currentTarget.style.background="rgba(255,255,255,0.015)";}}>
                <div style={{ fontSize:30, marginBottom:16 }}>{s.icon}</div>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:17, fontWeight:700, color:"#fff", marginBottom:10 }}>{s.title}</div>
                <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:16, fontWeight:300, color:"rgba(255,255,255,0.43)", lineHeight:1.8, margin:0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── DETAIL MODAL ── */}
      {selected && (
        <div className="sg-modal-overlay" onClick={()=>setSelected(null)}>
          <div className="sg-modal" onClick={e=>e.stopPropagation()}>
            <div style={{ height:240, overflow:"hidden", position:"relative" }}>
              <img src={selected.cover} alt={selected.title} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(0,0,0,0.2) 0%,rgba(0,0,0,0.9) 100%)" }} />
              <button onClick={()=>setSelected(null)} style={{ position:"absolute", top:14, right:14, background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.18)", color:"#fff", width:38, height:38, borderRadius:"50%", cursor:"pointer", fontSize:20, display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}>×</button>
              <div style={{ position:"absolute", bottom:20, left:24 }}>
                <div className="sg-tag" style={{ background:selected.tagColor, color:"#fff", marginBottom:9 }}>{selected.tag}</div>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:isMobile?18:24, fontWeight:900, color:"#fff", lineHeight:1.2 }}>{selected.title}</div>
                <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:14, letterSpacing:1.5, color:"rgba(245,168,0,0.85)", marginTop:6 }}>by {selected.author}</div>
              </div>
            </div>

            <div style={{ padding:"26px 28px 34px" }}>
              <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:18, fontWeight:300, color:"rgba(255,255,255,0.65)", lineHeight:1.85, marginBottom:26 }}>{selected.desc}</p>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12, marginBottom:28 }}>
                {[
                  { label:"Pages",    value:`${selected.pages} pages`,  icon:"📄" },
                  { label:"Level",    value:selected.level,             icon:"🎯" },
                  { label:"Author",   value:selected.author,            icon:"✍️" },
                  { label:"Format",   value:"PDF — Free Download",      icon:"💾" },
                  { label:"Language", value:"English",                  icon:"🌍" },
                  { label:"Duration", value:selected.duration,          icon:"📅" },
                ].map((m,i) => (
                  <div key={i} style={{ padding:"13px 15px", background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:4 }}>
                    <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:11, letterSpacing:2.5, textTransform:"uppercase", color:"rgba(255,255,255,0.32)", marginBottom:5 }}>{m.icon} {m.label}</div>
                    <div style={{ fontFamily:"Cinzel,serif", fontSize:14, fontWeight:600, color:"#fff" }}>{m.value}</div>
                  </div>
                ))}
              </div>

              <button className={`sg-dl-btn ${isDownloaded(selected.id)?"done":"free"}`} style={{ fontSize:14, marginBottom:14 }} onClick={e=>handleDownload(selected,e)}>
                {isDownloaded(selected.id)
                  ? <><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>Downloaded ✓</>
                  : <><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>Download Free PDF</>
                }
              </button>

              <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:9, padding:"13px 22px", borderRadius:4, border:"1px solid rgba(0,136,204,0.25)", background:"rgba(0,136,204,0.06)", color:"rgba(0,136,204,0.9)", fontFamily:"Rajdhani,sans-serif", fontSize:13, letterSpacing:2, textTransform:"uppercase", fontWeight:700, textDecoration:"none", transition:"all 0.25s" }}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,136,204,0.12)";e.currentTarget.style.borderColor="rgba(0,136,204,0.5)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(0,136,204,0.06)";e.currentTarget.style.borderColor="rgba(0,136,204,0.25)";}}>
                <svg width="15" height="15" viewBox="0 0 240 240" fill="none"><path d="M178 70L155.5 165.5C153.8 172.3 149.9 174 144.4 170.9L117.4 150.9L104.4 163.4C102.7 165.1 101.3 166.5 98.2 166.5L100.2 139L151.7 92.5C153.9 90.5 151.2 89.4 148.3 91.4L84.5 131.2L58 123C51.5 121.1 51.4 116.7 59.5 113.6L170 69.3C175.5 67.4 180.3 70.5 178 70Z" fill="currentColor"/></svg>
                Get 100s More Books Free on Telegram
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}






