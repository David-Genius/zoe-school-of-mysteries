import { useState, useEffect, useRef } from "react";
import { defaultVideoSermons } from "./sermonData";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaTelegramPlane,
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { RiThreadsFill } from "react-icons/ri";
import { MdLocationOn, MdPhone } from "react-icons/md";

const navLinks = [
  { label: "Give",    navigate: "give"    },
  { label: "Sermons", navigate: "sermons" },
  { label: "About",   navigate: "about"   },
];

// ── SEARCH DATA: only Books, Sermons, Events ──────────────────────────────────
const searchData = [
  // Sermons
  { title: "Sunday Sermon",                                       type: "Sermon", navigate: "sermons" },
  { title: "The Power of Faith",                                  type: "Sermon", navigate: "sermons" },
  { title: "Walking in the Light",                                type: "Sermon", navigate: "sermons" },
  { title: "Mysteries of the Kingdom of God",                     type: "Sermon", navigate: "sermons" },
  { title: "The Melchizedek Priesthood Explained",                type: "Sermon", navigate: "sermons" },
  { title: "Walking in the Spirit of Prophecy",                   type: "Sermon", navigate: "sermons" },
  { title: "Divine Encounter: Face to Face with God",             type: "Sermon", navigate: "sermons" },

  // Events
  { title: "Evolve 2025 — The Language of Mastery",              type: "Event",  navigate: "events"  },
  { title: "Evolve — 3rd Year Anniversary",                       type: "Event",  navigate: "events"  },
  { title: "The Days of the Saints",                              type: "Event",  navigate: "events"  },
  { title: "One-on-One Executive Classes",                        type: "Event",  navigate: "events"  },
  { title: "Meditation",                                          type: "Event",  navigate: "events"  },

  // Books
  { title: "Legality and Authority",                              type: "Book",   navigate: "store",  searchQ: "Legality"     },
  { title: "Navigating the Realms and Dimensions of the Spirit", type: "Book",   navigate: "store",  searchQ: "Navigating"   },
  { title: "Divine Light Unveiled",                              type: "Book",   navigate: "store",  searchQ: "Divine Light" },
  { title: "Spirit Technology",                                   type: "Book",   navigate: "store",  searchQ: "Spirit Tech"  },
  { title: "The Emergence of Luminary Mystics",                  type: "Book",   navigate: "store",  searchQ: "Luminary"     },
  { title: "Exploring the Realms of the Spirit",                 type: "Book",   navigate: "store",  searchQ: "Exploring"    },
  { title: "Practical Guide to Meditation",                      type: "Book",   navigate: "store",  searchQ: "Meditation"   },
  { title: "Metanoia",                                           type: "Book",   navigate: "store",  searchQ: "Metanoia"     },
  { title: "Kingdom Mechanics",                                  type: "Book",   navigate: "store",  searchQ: "Kingdom Mech" },
  { title: "Forensic Prophecy",                                  type: "Book",   navigate: "store",  searchQ: "Forensic"     },
  { title: "Heavenly Portals and Ancient Gates",                 type: "Book",   navigate: "store",  searchQ: "Portals"      },
  { title: "Paradigm Shift",                                     type: "Book",   navigate: "store",  searchQ: "Paradigm"     },
  { title: "Honour",                                             type: "Book",   navigate: "store",  searchQ: "Honour"       },
  { title: "Divine Nutrition",                                   type: "Book",   navigate: "store",  searchQ: "Nutrition"    },
  { title: "The Seven Lamp Stands",                              type: "Book",   navigate: "store",  searchQ: "Lamp Stands"  },
  { title: "The Practice of God's Person, Presence and Glory",  type: "Book",   navigate: "store",  searchQ: "God's Person" },
  { title: "The Practice of Divine Life",                        type: "Book",   navigate: "store",  searchQ: "Divine Life"  },
  { title: "The Mystery of Divine Love",                         type: "Book",   navigate: "store",  searchQ: "Divine Love"  },
  { title: "Exploring the Realms and Dimensions of the Spirit", type: "Book",   navigate: "store",  searchQ: "Dimensions"   },
  { title: "Routing the Works of Darkness",                      type: "Book",   navigate: "store",  searchQ: "Darkness"     },
];

// ── Only 3 types now ──────────────────────────────────────────────────────────
const typeColors = {
  Sermon: "#9333EA",
  Event:  "#22c55e",
  Book:   "#C88600",
};

const typeEmoji = {
  Sermon: "🎤",
  Event:  "📅",
  Book:   "📖",
};

// ── SECTION 1: Connect ────────────────────────────────────────────────────────
const connectItems = [
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/></svg>,
    title: "Visit Zoe",    sub: "Back to Home",             navigate: "home",
  },
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="15" rx="2"/><polygon points="10,10 16,14.5 10,19" fill="currentColor" stroke="none"/></svg>,
    title: "Live Streams", sub: "Join us from anywhere",    navigate: "streams",
  },
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    title: "Giving",       sub: "Generosity in action",     navigate: "give",
  },
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    title: "Volunteer",    sub: "Serve at your local campus", navigate: "volunteer",
  },
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>,
    title: "Need Prayer?", sub: "We're here for you",        navigate: "prayer",
  },
   {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
    title: "Events",        sub: "Meaningful experiences",          href: "#events", navigate: "events",
  },

  

];

// ── SECTION 2: Discover ───────────────────────────────────────────────────────
const discoverItems = [
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 10l4.553-2.069A1 1 0 0121 8.87V18.5a1 1 0 01-1.447.894L15 17M3 8h12v10H3a1 1 0 01-1-1V9a1 1 0 011-1z"/></svg>,
    title: "Sermons",      sub: "Watch & listen",            navigate: "sermons",
  },
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>,
    title: "Study Guides", sub: "Deepen your faith",         navigate: "guides",
  },
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>,
    title: "Store",        sub: "Books & resources ↗",       navigate: "store",
  },
  // Add to discoverItems array:
{
  icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  title: "Blog",
  sub:   "Articles & insights",
  navigate: "blog",
},
];

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

export default function Navbar({ logo, user, onUserIconClick, onLogout, onNavigate }) {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [activeItem,  setActiveItem]  = useState("Volunteer");
  const [query,       setQuery]       = useState("");
  const [results,     setResults]     = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [userMenu,    setUserMenu]    = useState(false);

  const width    = useWidth();
  const isMobile = width < 768;
  const searchRef = useRef(null);
  const userRef   = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
      if (userRef.current   && !userRef.current.contains(e.target))   setUserMenu(false);
      if (e.target.classList.contains("drawer-overlay"))               setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Search: filter only Sermon | Event | Book ────────────────────────────
  const handleSearch = (val) => {
    setQuery(val);
    setShowResults(true);
    if (!val.trim()) { setResults([]); return; }
    setResults(
      searchData.filter(i =>
        i.title.toLowerCase().includes(val.toLowerCase()) ||
        i.type.toLowerCase().includes(val.toLowerCase())
      )
    );
  };

  const handleSearchFocus = () => setShowResults(true);

  const goToPage = (page, section = null) => {
    if (!page) return;
    onNavigate?.(page, section);
    setMenuOpen(false);
    setShowResults(false);
    setQuery("");
  };

  // ── Unified click handler for every search result card ───────────────────
  const handleResultClick = (item) => {
    setShowResults(false);
    setQuery("");
    goToPage(item.navigate, item.searchQ || "");
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .nav-link { color:rgba(255,255,255,0.7); text-decoration:none; font-family:'Rajdhani',sans-serif; font-size:13px; letter-spacing:2px; text-transform:uppercase; font-weight:600; position:relative; transition:color 0.3s; cursor:pointer; }
        .nav-link::after { content:''; display:block; height:1px; background:#F5A800; transform:scaleX(0); transition:transform 0.3s; }
        .nav-link:hover { color:#F5A800; }
        .nav-link:hover::after { transform:scaleX(1); }

        .hamburger-bar { display:block; width:24px; height:1.5px; background:rgba(255,255,255,0.6); transition:0.3s; }
        .hamburger:hover .hamburger-bar { background:#F5A800; }
        .bar-top-open { transform:translateY(6.5px) rotate(45deg) !important; background:#F5A800 !important; }
        .bar-mid-open { opacity:0 !important; }
        .bar-bot-open { transform:translateY(-6.5px) rotate(-45deg) !important; background:#F5A800 !important; }

        .search-wrap:focus-within { border-color:rgba(245,168,0,0.55) !important; }
        /* Replace your existing .search-dropdown rule with this: */
.search-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  width: 680px;
  background: #141414;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  overflow: hidden;
  z-index: 2000;
  box-shadow: 0 28px 80px rgba(0,0,0,0.95), 0 0 0 1px rgba(245,168,0,0.08);
  max-height: 75vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(245,168,0,0.15) transparent;
}

@media(max-width: 768px) {
  .search-dropdown {
    position: fixed;        /* ← fixed instead of absolute */
    top: 130px;             /* ← below navbar + tab bar */
    left: 12px;
    right: 12px;
    width: auto;
    transform: none;
    max-height: calc(100vh - 150px);   /* ← fills remaining screen */
  }
}
        .search-dropdown::-webkit-scrollbar { width:3px; }
        .search-dropdown::-webkit-scrollbar-thumb { background:rgba(245,168,0,0.15); border-radius:2px; }

        .sd-card { cursor:pointer; transition:opacity 0.2s; }
        .sd-card:hover { opacity:0.8; }
        .sd-card:hover .sd-img { transform:scale(1.05) !important; }
        .sd-img { transition:transform 0.4s ease !important; }

        .search-empty { padding:40px 18px; font-family:'Rajdhani',sans-serif; font-size:12px; color:rgba(255,255,255,0.3); text-align:center; letter-spacing:2px; text-transform:uppercase; }

        .user-icon-btn { transition:border-color 0.3s,background 0.3s; }
        .user-icon-btn:hover { border-color:#F5A800 !important; background:rgba(245,168,0,0.08) !important; }

        .user-mini-menu { position:absolute; top:calc(100% + 14px); right:0; width:200px; background:#111; border:1px solid rgba(245,168,0,0.18); border-radius:8px; overflow:hidden; z-index:2000; box-shadow:0 20px 60px rgba(0,0,0,0.9); transform:translateY(-8px); opacity:0; pointer-events:none; transition:all 0.25s ease; }
        .user-mini-menu.open { transform:translateY(0); opacity:1; pointer-events:all; }
        .mini-menu-item { display:flex; align-items:center; gap:10px; padding:12px 16px; cursor:pointer; transition:background 0.2s; text-decoration:none; }
        .mini-menu-item:hover { background:rgba(245,168,0,0.07); }
        .mini-menu-item span { font-family:'Rajdhani',sans-serif; font-size:13px; letter-spacing:1px; color:rgba(255,255,255,0.75); font-weight:500; }

        .drawer-overlay { position:fixed; inset:0; z-index:1100; background:rgba(0,0,0,0.6); backdrop-filter:blur(3px); opacity:0; pointer-events:none; transition:opacity 0.35s ease; }
        .drawer-overlay.open { opacity:1; pointer-events:all; }

        .side-drawer { position:fixed; top:0; left:0; bottom:0; width:290px; z-index:1200; background:#0D0D0D; border-right:1px solid rgba(245,168,0,0.1); transform:translateX(-100%); transition:transform 0.38s cubic-bezier(0.4,0,0.2,1); display:flex; flex-direction:column; overflow-y:auto; }
        .side-drawer.open { transform:translateX(0); }
        .side-drawer::-webkit-scrollbar { width:3px; }
        .side-drawer::-webkit-scrollbar-thumb { background:rgba(245,168,0,0.15); border-radius:2px; }

        .drawer-header { display:flex; align-items:center; justify-content:space-between; padding:0 18px; height:76px; border-bottom:1px solid rgba(245,168,0,0.08); flex-shrink:0; }
        .drawer-close { width:34px; height:34px; border-radius:50%; border:1px solid rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.3s; color:rgba(255,255,255,0.5); font-size:18px; }
        .drawer-close:hover { border-color:#F5A800; color:#F5A800; background:rgba(245,168,0,0.06); }

        .drawer-section-label { font-family:'Cinzel',serif; font-size:13px; font-weight:700; color:#F5A800; padding:18px 18px 8px; letter-spacing:2px; text-transform:uppercase; }

        .drawer-item { display:flex; align-items:center; gap:14px; padding:13px 18px; cursor:pointer; transition:all 0.2s; text-decoration:none; border-left:3px solid transparent; }
        .drawer-item:hover { background:rgba(245,168,0,0.05); border-left-color:rgba(245,168,0,0.35); }
        .drawer-item.active { background:rgba(245,168,0,0.08); border-left-color:#F5A800; }
        .drawer-item-icon { width:36px; height:36px; border-radius:8px; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.45); flex-shrink:0; transition:all 0.2s; }
        .drawer-item:hover .drawer-item-icon, .drawer-item.active .drawer-item-icon { background:rgba(245,168,0,0.1); color:#F5A800; }
        .drawer-item-title { font-family:'Cinzel',serif; font-size:13px; font-weight:600; color:rgba(255,255,255,0.82); margin-bottom:1px; transition:color 0.2s; }
        .drawer-item:hover .drawer-item-title, .drawer-item.active .drawer-item-title { color:#F5A800; }
        .drawer-item-sub { font-family:'Rajdhani',sans-serif; font-size:11px; color:rgba(255,255,255,0.32); letter-spacing:0.3px; }

        .drawer-divider { height:1px; background:rgba(245,168,0,0.07); margin:6px 0; }

        .notice-item { display:flex; align-items:center; gap:14px; padding:13px 18px; cursor:pointer; transition:background 0.2s; text-decoration:none; }
        .notice-item:hover { background:rgba(255,255,255,0.03); }

        .drawer-footer { padding:18px; border-top:1px solid rgba(245,168,0,0.08); flex-shrink:0; }
        .drawer-give-btn { display:block; width:100%; padding:12px; background:#F5A800; color:#000; text-align:center; font-family:'Rajdhani',sans-serif; font-size:12px; letter-spacing:3px; text-transform:uppercase; font-weight:700; border-radius:2px; cursor:pointer; transition:background 0.3s; border:none; text-decoration:none; }
        .drawer-give-btn:hover { background:#FFD166; }

        .my-portal-box { background:rgba(255,255,255,0.03); border:1px solid rgba(245,168,0,0.1); border-radius:6px; padding:14px; margin:0 18px 6px; }
        .portal-btn { display:inline-flex; align-items:center; gap:6px; margin-top:10px; padding:9px 16px; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.12); border-radius:4px; font-family:'Rajdhani',sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,0.7); cursor:pointer; transition:all 0.3s; text-decoration:none; }
        .portal-btn:hover { border-color:#F5A800; color:#F5A800; }

        .top-tab-bar {
          position:fixed; top:76px; left:0; right:0; height:54px; z-index:998;
          background:rgba(8,8,8,0.98); backdrop-filter:blur(20px);
          border-bottom:1px solid rgba(245,168,0,0.1);
          display:flex; align-items:center; overflow-x:auto; overflow-y:hidden;
          -webkit-overflow-scrolling:touch; scrollbar-width:none; padding:0 4px;
        }
        .top-tab-bar::-webkit-scrollbar { display:none; }
        .tab-item { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; padding:10px 16px 12px; min-width:70px; cursor:pointer; text-decoration:none; transition:all 0.2s; flex-shrink:0; border-bottom:2px solid transparent; }
        .tab-item:hover, .tab-item.active { border-bottom-color:#F5A800; }
        .tab-item:hover .tab-label, .tab-item.active .tab-label { color:#F5A800; }
        .tab-item:hover svg, .tab-item.active svg { color:#F5A800; stroke:#F5A800; }
        .tab-icon { color:rgba(255,255,255,0.5); transition:color 0.2s; }
        .tab-label { font-family:'Rajdhani',sans-serif; font-size:10px; letter-spacing:1px; text-transform:uppercase; font-weight:600; color:rgba(255,255,255,0.45); transition:color 0.2s; white-space:nowrap; }

        .social-icon { width:34px; height:34px; border-radius:50%; background:rgba(255,255,255,0.07); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.3s; font-size:14px; text-decoration:none; color:#fff; }
        .social-icon:hover { background:#F5A800; color:#000; }

        .see-more-btn { font-family:'Rajdhani',sans-serif; font-size:10px; letter-spacing:2px; color:#F5A800; cursor:pointer; text-transform:uppercase; font-weight:700; background:none; border:none; padding:0; }
        .see-more-btn:hover { text-decoration:underline; }
      `}</style>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:1000,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding: isMobile ? "0 16px" : "0 48px",
        height:"76px",
        background: scrolled ? "rgba(0,0,0,0.97)" : "rgba(0,0,0,0.85)",
        backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(245,168,0,0.12)",
        transition:"background 0.4s",
      }}>

        {/* LEFT */}
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}
            style={{ cursor:"pointer", display:"flex", flexDirection:"column", gap:5, padding:2 }}>
            <span className={`hamburger-bar ${menuOpen ? "bar-top-open" : ""}`} style={{ transformOrigin:"center", transition:"0.3s" }} />
            <span className={`hamburger-bar ${menuOpen ? "bar-mid-open" : ""}`} style={{ transition:"0.3s" }} />
            <span className={`hamburger-bar ${menuOpen ? "bar-bot-open" : ""}`} style={{ transformOrigin:"center", transition:"0.3s" }} />
          </div>
          <img src={logo} alt="Zoe Logo" style={{ height:75, objectFit:"contain" }} />
        </div>

        {/* CENTER — Search */}
        <div ref={searchRef} style={{ flex:1, maxWidth: isMobile ? "100%" : 340, margin: isMobile ? "0 12px" : "0 40px", position:"relative" }}>
          <div className="search-wrap" style={{
            display:"flex", alignItems:"center", gap:10,
            background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(245,168,0,0.18)",
            borderRadius:50, padding:"9px 10px", transition:"border-color 0.3s",
          }}>
            <svg width="14" height="14" fill="none" stroke="rgba(245,168,0,0.6)" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={query}
              onChange={e => handleSearch(e.target.value)}
              onFocus={handleSearchFocus}
              placeholder="Search sermons, books, events..."
              style={{ background:"none", border:"none", outline:"none", color:"#fff", fontFamily:"Rajdhani,sans-serif", fontSize:13, letterSpacing:1, width:"100%" }}
            />
            {query && (
              <span
                onClick={() => { setQuery(""); setResults([]); setShowResults(false); }}
                style={{ color:"rgba(255,255,255,0.3)", cursor:"pointer", fontSize:18, lineHeight:1 }}
              >×</span>
            )}
          </div>


            {/* ← ADD THIS right after the search-wrap div closes */}
  {showResults && (
    <div
      onClick={() => { setShowResults(false); setQuery(""); setResults([]); }}
      style={{
        position: "fixed",
        top: isMobile ? 88 : 20,
        right: isMobile ? 16 : 52,
        zIndex: 2100,
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: "#1a1a1a",
        border: "1px solid rgba(245,168,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "#F5A800",
        fontSize: 18,
        lineHeight: 1,
        boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
        transition: "all 0.2s",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,168,0,0.12)"; e.currentTarget.style.borderColor = "#F5A800"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.style.borderColor = "rgba(245,168,0,0.35)"; }}
    >
      ×
    </div>
  )}


          {/* ── DROPDOWN ── */}
          {showResults && (
            <div className="search-dropdown">

              {/* ── TYPED QUERY MODE ── */}
              {query.trim() ? (
                results.length > 0 ? (
                  <div>
                    {/* Loop ONLY over the 3 allowed types */}
                    {["Sermon", "Event", "Book"].map(type => {
                      const group = results.filter(r => r.type === type);
                      if (!group.length) return null;
                      return (
                        <div key={type} style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                          {/* Section header */}
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                            <div style={{ fontFamily:"Cinzel,serif", fontSize:14, fontWeight:700, color:"#fff" }}>{type}s</div>
                            <button
                                className="see-more-btn"
                                onClick={() => goToPage(
                                  type === "Book" ? "store" : type === "Sermon" ? "sermons" : "events"
                                )}
                              >
                                See all →
                              </button>
                          </div>

                          {/* Cards grid */}
                          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                            {group.slice(0, 3).map((item, i) => (
                              <div
                                key={i}
                                className="sd-card"
                                onClick={() => handleResultClick(item)}
                              >
                                <div style={{
                                  width:"100%", aspectRatio:"16/10", borderRadius:6,
                                  background:"rgba(245,168,0,0.08)",
                                  display:"flex", alignItems:"center", justifyContent:"center",
                                  fontSize:28, marginBottom:8,
                                }}>
                                  {typeEmoji[item.type] || "✨"}
                                </div>
                                <div style={{ fontFamily:"Cinzel,serif", fontSize:12, fontWeight:600, color:"#fff", lineHeight:1.3, marginBottom:4 }}>
                                  {item.title}
                                </div>
                                <div style={{
                                  fontFamily:"Rajdhani,sans-serif", fontSize:9, letterSpacing:2,
                                  textTransform:"uppercase", color: typeColors[item.type],
                                  padding:"2px 8px", borderRadius:10,
                                  background:`${typeColors[item.type]}18`, display:"inline-block",
                                }}>
                                  {item.type}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="search-empty">No results for "{query}"</div>
                )

              ) : (
                /* ── DEFAULT MODE (no query — shows on focus) ── */
                <div>

                  {/* BOOKS */}
                  <div style={{ padding:"18px 20px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                      <div style={{ fontFamily:"Cinzel,serif", fontSize:15, fontWeight:700, color:"#fff" }}>Books</div>
                      <button className="see-more-btn" onClick={() => goToPage("store", "")}>See all →</button>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
                      {[
                        { title:"Legality and Authority", cover:"https://files.selar.co/product-images/2024/products/Hassanololade/legality-and-authority-selar.co-66f6a5f1db33a.jpeg", searchQ:"Legality"    },
                        { title:"Spirit Technology",      cover:"https://files.selar.co/product-images/2023/products/Hassanololade/spirit-technology-selar.co-63d77de9dcbeb.jpg",       searchQ:"Spirit Tech"  },
                        { title:"Divine Light Unveiled",  cover:"https://files.selar.co/product-images/2023/products/Hassanololade/divine-light-unveiled-selar.co-6565d94c583ca.jpg",  searchQ:"Divine Light" },
                      ].map((b, i) => (
                        <div key={i} className="sd-card" onClick={() => { setShowResults(false); setQuery(""); goToPage("store", b.searchQ); }}>
                          <div style={{ width:"100%", height: isMobile ? 100 : 140,borderRadius:6, overflow:"hidden", marginBottom:8, background:"#1a1a1a" }}>
                            <img src={b.cover} alt={b.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} className="sd-img" />
                          </div>
                          <div style={{ fontFamily:"Cinzel,serif", fontSize:12, fontWeight:700, color:"#fff", lineHeight:1.3 }}>{b.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SERMONS */}
                  <div style={{ padding:"18px 20px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                      <div style={{ fontFamily:"Cinzel,serif", fontSize:15, fontWeight:700, color:"#fff" }}>Sermons</div>
                      <button className="see-more-btn" onClick={() => goToPage("sermons")}>See all →</button>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
                      {defaultVideoSermons.slice(0, 3).map((s, i) => (
                        <div
                          key={i}
                          className="sd-card"
                          onClick={() => {
                            setShowResults(false);
                            setQuery("");
                            goToPage("sermons");
                            setTimeout(() => {
                              document.getElementById(`sermon-${s.id}`)?.scrollIntoView({ behavior:"smooth" });
                            }, 300);
                          }}
                        >
                          <div style={{ width:"100%", height: isMobile ? 80 : 110, borderRadius:6, overflow:"hidden", marginBottom:8, background:"#1a1a1a" }}>
                            <img
                              src={`https://img.youtube.com/vi/${s.youtubeId}/hqdefault.jpg`}
                              alt={s.title}
                              style={{ width:"100%", height:"100%", objectFit:"cover" }}
                              className="sd-img"
                            />
                          </div>
                          <div style={{ fontFamily:"Cinzel,serif", fontSize:12, fontWeight:700, color:"#fff", lineHeight:1.3, marginBottom:3 }}>{s.title}</div>
                          <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:10, color:"rgba(255,255,255,0.4)" }}>{s.preacher}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* EVENTS */}
                  <div style={{ padding:"18px 20px 20px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                      <div style={{ fontFamily:"Cinzel,serif", fontSize:15, fontWeight:700, color:"#fff" }}>Events</div>
                      {/* "See more" navigates to the full Events page */}
                      <button className="see-more-btn" onClick={() => goToPage("events")}>See all →</button>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
                      {[
                        { title:"Evolve 2025",         image:"/images/photo_2026-06-11_14-39-41.jpg" },
                        { title:"Days of the Saints",   image:"/images/photo_2026-06-09_14-40-37.jpg" },
                        { title:"Executive Classes",    image:"/images/photo_2026-06-09_14-40-46.jpg" },
                      ].map((event, i) => (
                        <div
                          key={i}
                          className="sd-card"
                          /* ← Clicking ANY event card opens the Events page */
                          onClick={() => { setShowResults(false); setQuery(""); goToPage("events"); }}
                        >
                          <div style={{ width:"100%", height: isMobile ? 80 : 110, borderRadius:6, overflow:"hidden", marginBottom:8, background:"#1a1a1a" }}>
                            <img
                              src={event.image}
                              alt={event.title}
                              style={{ width:"100%", height:"100%", objectFit:"cover" }}
                              className="sd-img"
                              onError={e => { e.target.style.display = "none"; }}
                            />
                          </div>
                          <div style={{ fontFamily:"Cinzel,serif", fontSize:12, fontWeight:700, color:"#fff", lineHeight:1.3 }}>{event.title}</div>
                          <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:10, color:"#22c55e", marginTop:3 }}>Upcoming Event</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div style={{ display:"flex", alignItems:"center", gap: isMobile ? 12 : 32 }}>
          {!isMobile && navLinks.map(({ label, navigate }) => (
            <span key={label} className="nav-link" onClick={() => goToPage(navigate)}>{label}</span>
          ))}

          {/* USER ICON */}
          <div ref={userRef} style={{ position:"relative" }}>
            <div
              className="user-icon-btn"
              onClick={() => user ? setUserMenu(!userMenu) : onUserIconClick?.()}
              style={{ width:38, height:38, borderRadius:"50%", border:"1px solid rgba(245,168,0,0.3)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", background:"transparent" }}
            >
              {user ? (
                <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#6B21A8,#F5A800)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Cinzel,serif", fontWeight:700, fontSize:14, color:"#000" }}>
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              ) : (
                <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              )}
            </div>

            {user && (
              <div className={`user-mini-menu ${userMenu ? "open" : ""}`}>
                <div style={{ padding:"14px 16px 10px", borderBottom:"1px solid rgba(245,168,0,0.08)" }}>
                  <div style={{ fontFamily:"Cinzel,serif", fontSize:14, fontWeight:600, color:"#fff" }}>{user.name}</div>
                  <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:11, color:"rgba(255,255,255,0.35)", letterSpacing:1 }}>{user.email}</div>
                </div>
                {[{ icon:"👤", label:"My Profile", page:"profile" }].map((item, i) => (
                  <div key={i} className="mini-menu-item" onClick={() => { onNavigate?.(item.page); setUserMenu(false); }}>
                    <span style={{ fontSize:15 }}>{item.icon}</span><span>{item.label}</span>
                  </div>
                ))}
                <div style={{ height:1, background:"rgba(245,168,0,0.08)", margin:"4px 0" }} />
                <div className="mini-menu-item" onClick={() => { onLogout?.(); setUserMenu(false); }}>
                  <span style={{ fontSize:15 }}>🚪</span>
                  <span style={{ color:"#ef4444" }}>Sign Out</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ══ DARK OVERLAY ══ */}
      <div className={`drawer-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />

      {/* ══ MOBILE TOP TAB BAR ══ */}
      {isMobile && (
        <nav className="top-tab-bar">
          {[
            { label:"Home",      navigate:"home",    icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/></svg> },
            { label:"Sermons",   navigate:"sermons", icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 10l4.553-2.069A1 1 0 0121 8.87V18.5a1 1 0 01-1.447.894L15 17M3 8h12v10H3a1 1 0 01-1-1V9a1 1 0 011-1z"/></svg> },
            { label:"Streaming", navigate:"streams", icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></svg> },
            { label:"Giving",    navigate:"give",    icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
            { label:"About",     navigate:"about",   icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg> },
          ].map((tab, i) => (
            <a key={i} href="#" className="tab-item" onClick={e => { e.preventDefault(); goToPage(tab.navigate); }}>
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </a>
          ))}
        </nav>
      )}

      {/* ══ SIDE DRAWER ══ */}
      <div className={`side-drawer ${menuOpen ? "open" : ""}`}>

        <div className="drawer-header">
          <img src={logo} alt="Zoe Logo" style={{ height:38, objectFit:"contain" }} />
          <div className="drawer-close" onClick={() => setMenuOpen(false)}>×</div>
        </div>

        <div className="drawer-section-label">Connect</div>
        {connectItems.map((item, i) => (
          <div key={i} className={`drawer-item ${activeItem === item.title ? "active" : ""}`}
            onClick={() => { setActiveItem(item.title); goToPage(item.navigate); setMenuOpen(false); }}>
            <div className="drawer-item-icon">{item.icon}</div>
            <div>
              <div className="drawer-item-title">{item.title}</div>
              <div className="drawer-item-sub">{item.sub}</div>
            </div>
          </div>
        ))}

        <div className="drawer-divider" />

        <div className="drawer-section-label">Discover</div>
        {discoverItems.map((item, i) => (
          <div key={i} className={`drawer-item ${activeItem === item.title ? "active" : ""}`}
            onClick={() => { setActiveItem(item.title); goToPage(item.navigate); setMenuOpen(false); }}>
            <div className="drawer-item-icon">{item.icon}</div>
            <div>
              <div className="drawer-item-title">{item.title}</div>
              <div className="drawer-item-sub">{item.sub}</div>
            </div>
          </div>
        ))}

        <div className="drawer-divider" />

        <div className="drawer-section-label">About</div>
{[{ title:"Mission and Visions", section:"ab-nextgen" }].map((item, i) => (
  <div key={i} className="drawer-item" onClick={() => {
    setMenuOpen(false);
    goToPage("about");
    setTimeout(() => {
      document.getElementById(item.section)?.scrollIntoView({ behavior: "smooth" });
    }, 400);
  }}>
    <div className="drawer-item-icon">
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
      </svg>
    </div>
    <div className="drawer-item-title">{item.title}</div>
  </div>
))}

        {/* Notice an issue */}
        <div className="notice-item" style={{ cursor:"pointer" }} onClick={() => { onNavigate("issues"); setMenuOpen(false); }}>
          <div style={{ width:36, height:36, borderRadius:8, background:"rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily:"Cinzel,serif", fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.7)" }}>Notice an issue?</div>
            <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:11, color:"rgba(255,255,255,0.3)" }}>Tell us so we can fix it.</div>
          </div>
        </div>

        <div className="drawer-divider" />

        {/* MyZoe Portal */}
        <div className="my-portal-box">
          <div style={{ fontFamily:"Cinzel,serif", fontSize:13, fontWeight:700, color:"#fff", marginBottom:6 }}>MyZoe</div>
          <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.6, letterSpacing:0.3 }}>
            MyZoe is the official Telegram community of Zoe School of Mysteries, designed for members, students, and partners to stay connected, receive updates, and engage with teachings and activities.
          </div>
          <a href="https://t.me/+KtrkQ-ACzkNlNTFk" className="portal-btn" onClick={() => setMenuOpen(false)}>Access MyZoe ↗</a>
        </div>

        {/* Address & Contact */}
        <div style={{ padding:"20px 18px 10px", borderTop:"1px solid rgba(245,168,0,0.08)", marginTop:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, color:"rgba(255,255,255,0.65)", fontFamily:"Rajdhani,sans-serif", fontSize:13 }}>
            <MdLocationOn size={16} style={{ color:"#F5A800", flexShrink:0 }} /><span>Lagos, Nigeria</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, color:"rgba(255,255,255,0.6)", fontFamily:"Rajdhani,sans-serif", fontSize:13 }}>
            <MdPhone size={15} style={{ color:"#F5A800", flexShrink:0 }} /><span>+234 703 610 0912</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18, color:"rgba(255,255,255,0.6)", fontFamily:"Rajdhani,sans-serif", fontSize:13 }}>
            <MdPhone size={15} style={{ color:"#F5A800", flexShrink:0 }} /><span>+234 817 929 7984</span>
          </div>

          <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:18 }}>
            {[
              { icon:<FaFacebookF />,    href:"https://www.facebook.com/share/1BPBCLT1vq/" },
              { icon:<FaInstagram />,    href:"https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=2ydy17f" },
              { icon:<RiThreadsFill />,  href:"https://www.threads.com/@officialapostlehassan" },
              { icon:<FaYoutube />,      href:"https://www.youtube.com/@melchizedekololadehassan1591" },
              { icon:<SiTiktok />,       href:"https://www.tiktok.com/@apostlehassan.o?_r=1&_t=ZS-977BxSwHJeq" },
              { icon:<FaTelegramPlane />,href:"https://t.me/+KtrkQ-ACzkNlNTFk" },
              { icon:<FaWhatsapp />,     href:"https://chat.whatsapp.com/FKZqlGXZwXv39iFFqfa9N4" },
            ].map(({ icon, href }, index) => (
              <a key={index} href={href} target="_blank" rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                style={{ width:40, height:40, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#F5A800", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(245,168,0,0.15)", textDecoration:"none", fontSize:17, transition:"all .3s ease", boxShadow:"0 4px 12px rgba(0,0,0,0.25)" }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.borderColor="rgba(245,168,0,0.45)"; e.currentTarget.style.background="rgba(245,168,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.borderColor="rgba(245,168,0,0.15)"; e.currentTarget.style.background="rgba(255,255,255,0.03)"; }}
              >{icon}</a>
            ))}
          </div>

          <div style={{ width:70, height:1, background:"linear-gradient(90deg,transparent,rgba(245,168,0,0.4),transparent)", marginBottom:12 }} />
          <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:11, color:"rgba(255,255,255,0.38)", letterSpacing:"0.8px", textTransform:"uppercase" }}>© 2026 Zoe School of Mysteries</div>
          <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:10, color:"rgba(255,255,255,0.22)", marginTop:4, letterSpacing:"0.5px" }}>All Rights Reserved</div>
        </div>

        <div className="drawer-footer">
          <a href="#give" className="drawer-give-btn" onClick={e => { e.preventDefault(); setMenuOpen(false); onNavigate?.("give"); }}>Give Now</a>
        </div>

      </div>
    </>
  );
}