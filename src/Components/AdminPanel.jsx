import { useState, useEffect } from "react";
import {
  getAllUsers,
  getAllGiving,
  // listenToGiving,
  getRecentActivity,
  getDashboardStats,
  banUser,
  unbanUser,
  deleteUserRecord,
  promoteToAdmin,
  auth,
  onAuthChange,
  getUserProfile,
  getPrayerStats,
  updatePrayerStatus,
  addEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
  demoteAdmin,
  addBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
} from "./firebase";

// import {
//   ref,
//   uploadBytes,
//   getDownloadURL
// } from "firebase/storage";


function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  return w;
}



const formatDate = (ts) => {
  if (!ts) return "—";
  let d;
  if (ts.toDate) {
    d = ts.toDate();
  } else if (ts.seconds) {
    d = new Date(ts.seconds * 1000);
  } else {
    d = new Date(ts);
  }
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-NG", { day:"numeric", month:"short", year:"numeric" });
};

const formatTime = (ts) => {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60)  return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
};

const ACTIVITY_ICONS = {
  login:           "🔑",
  logout:          "👋",
  account_created: "✨",
  giving:          "💰",
  ban_user:        "🚫",
  unban_user:      "✅",
  delete_user:     "🗑",
  promote:         "👑",
};

export default function AdminPanel({ onExit }) {
  const width = useWidth();
  const isMobile = width < 768;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [tab,        setTab]        = useState("dashboard");
  const [loading,    setLoading]    = useState(true);
  const [authCheck,  setAuthCheck]  = useState(true);
  const [isAdmin,    setIsAdmin]    = useState(false);
  const [stats,      setStats]      = useState(null);
  const [users,      setUsers]      = useState([]);
  const [giving,     setGiving]     = useState([]);
  const [activity,   setActivity]   = useState([]);
  const [search,     setSearch]     = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [confirm,    setConfirm]    = useState(null);
  const [toast,      setToast]      = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [prayer, setPrayer] = useState(null);

  const [events, setEvents] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventType, setEventType] = useState("");

  const [blogs,       setBlogs]       = useState([]);
  const [blogTitle,   setBlogTitle]   = useState("");
  const [blogAuthor,  setBlogAuthor]  = useState("");
  const [blogBody,    setBlogBody]    = useState("");
  const [blogPublished, setBlogPublished] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogSaving,  setBlogSaving]  = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      if (!user) { setIsAdmin(false); setAuthCheck(false); return; }
      const profile = await getUserProfile(user.uid);
      setIsAdmin(profile?.role === "admin");
      setAuthCheck(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const initEvents = async () => {
      const data = await getAllEvents();
      if (!data || data.length === 0) {
        for (let ev of DEFAULT_EVENTS) { await addEvent(ev); }
        const fresh = await getAllEvents();
        setEvents(fresh);
      } else {
        setEvents(data);
      }
    };
    initEvents();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    loadData();
  }, [tab, isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === "dashboard") {
        const [s, a] = await Promise.all([getDashboardStats(), getRecentActivity(10)]);
        setStats(s); setActivity(a);
      } else if (tab === "users") {
        setUsers(await getAllUsers());
  //     } else if (tab === "giving") {
  // setLoading(true);
  // const data = await getAllGiving();
  // setGiving(data);
  // setLoading(false);
  } else if (tab === "giving") {
  const data = await getAllGiving();
  setGiving(data);

            // store unsub somewhere to clean up if needed
          }else if (tab === "prayer") {
        setPrayer(await getPrayerStats());
      } else if (tab === "events") {
        setEvents(await getAllEvents());
      } else if (tab === "activity") {
        setActivity(await getRecentActivity(50));
      } else if (tab === "blog") {
        setBlogs(await getAllBlogs());
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleAction = async () => {
    if (!confirm) return;
    const { action, uid, name } = confirm;
    setConfirm(null);
    try {
      if (action === "ban")     { await banUser(uid);          showToast(`${name} banned.`); }
      if (action === "unban")   { await unbanUser(uid);        showToast(`${name} unbanned.`); }
      if (action === "delete")  { await deleteUserRecord(uid); showToast(`${name} deleted.`); }
      if (action === "promote") { await promoteToAdmin(uid);   showToast(`${name} promoted to admin.`); }
      if (action === "demote")  { await demoteAdmin(uid);      showToast(`${name} removed from admin.`); }
      setUsers(await getAllUsers());
    } catch (e) { showToast("Error: " + e.message); }
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = userFilter === "all" || u.status === userFilter || (userFilter === "admin" && u.role === "admin");
    return matchSearch && matchFilter;
  });

  const totalGiving = giving.reduce((s, g) => s + (g.amount || 0), 0);

  if (authCheck) return (
    <div style={{ position:"fixed", inset:0, background:"#000", display:"flex", alignItems:"center", justifyContent:"center", zIndex:3000 }}>
      <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:16, letterSpacing:2, color:"rgba(255,255,255,0.4)" }}>Checking access...</div>
    </div>
  );

  if (!isAdmin) return (
    <div style={{ position:"fixed", inset:0, background:"#000", display:"flex", alignItems:"center", justifyContent:"center", zIndex:3000, flexDirection:"column", gap:16 }}>
      <div style={{ fontSize:48 }}>🚫</div>
      <div style={{ fontFamily:"Cinzel,serif", fontSize:26, fontWeight:700, color:"#ef4444" }}>Access Denied</div>
      <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:18, fontStyle:"italic", color:"rgba(255,255,255,0.4)" }}>You don't have admin privileges.</div>
      <button onClick={onExit} style={{ fontFamily:"Rajdhani,sans-serif", fontSize:14, letterSpacing:3, textTransform:"uppercase", fontWeight:700, color:"#000", background:"#F5A800", border:"none", padding:"14px 32px", borderRadius:2, cursor:"pointer", marginTop:8 }}>Go Back</button>
    </div>
  );

  const tabs = [
    { id:"dashboard", label:"Dashboard", icon:"📊" },
    { id:"users",     label:"Users",     icon:"👥" },
    { id:"giving",    label:"Giving",    icon:"💰" },
    { id:"prayer",    label:"Prayer",    icon:"🙏" },
    { id:"blog",      label:"Blog",      icon:"✍️" },
    { id:"activity",  label:"Activity",  icon:"📋" },
  ];

  const DEFAULT_EVENTS = [
    { title: "Sunday Service",   description: "Join us for powerful worship",   date: "2026-06-15", type: "upcoming" },
    { title: "Night Vigil",      description: "All night prayer meeting",        date: "2026-06-20", type: "upcoming" },
    { title: "Bible Study",      description: "Deep study of the Word",          date: "2026-06-12", type: "daily"    },
    { title: "Youth Conference", description: "Annual youth gathering",          date: "2026-05-10", type: "past"     },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Rajdhani:wght@400;500;600;700&display=swap');

        @keyframes adm-fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes adm-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes adm-toast   { 0%{transform:translateY(20px);opacity:0} 10%,90%{transform:translateY(0);opacity:1} 100%{transform:translateY(-10px);opacity:0} }
        @keyframes adm-spin    { to{transform:rotate(360deg)} }

        .adm-page { font-family:'Rajdhani',sans-serif; background:#000; min-height:100vh; color:#fff; }

        /* ── SIDEBAR ── */
        .adm-sidebar {
          position:fixed; top:0; left:0; bottom:0; width:240px;
          background:#080808; border-right:1px solid rgba(245,168,0,0.1);
          display:flex; flex-direction:column; z-index:100; padding-top:24px;
        }
        .adm-content { margin-left:240px; padding:36px; min-height:100vh; }

        /* ── TABS ── */
        .adm-tab {
          display:flex; align-items:center; gap:12px;
          padding:15px 24px; cursor:pointer; transition:all 0.2s;
          color:rgba(255,255,255,0.45); border-left:3px solid transparent;
          font-size:15px;          /* ↑ was 13px */
          letter-spacing:1.5px; text-transform:uppercase; font-weight:600;
        }
        .adm-tab:hover  { color:rgba(255,255,255,0.75); background:rgba(255,255,255,0.03); }
        .adm-tab.active { color:#F5A800; border-left-color:#F5A800; background:rgba(245,168,0,0.07); }
        .adm-tab span   { font-size:20px; }  /* icons slightly bigger too */

        /* ── CARDS ── */
        .adm-stat-card {
          background:#0a0a0a; border:1px solid rgba(245,168,0,0.1);
          border-radius:6px; padding:24px; transition:all 0.3s;
        }
        .adm-stat-card p { overflow-wrap:break-word; word-break:break-word; }
        .adm-stat-card:hover { border-color:rgba(245,168,0,0.3); transform:translateY(-3px); box-shadow:0 8px 30px rgba(0,0,0,0.4); }

        /* ── TABLE ── */
        .adm-table-row {
          display:grid; padding:16px 18px;
          border-bottom:1px solid rgba(255,255,255,0.04);
          transition:background 0.2s; word-break:break-word;
        }
        .adm-table-row:hover { background:rgba(245,168,0,0.03); }

        /* ── BADGES & BUTTONS ── */
        .adm-badge {
          display:inline-block; font-size:10px;   /* ↑ was 9px */
          letter-spacing:2px; text-transform:uppercase;
          font-weight:700; padding:4px 12px; border-radius:12px;
        }
        .adm-btn {
          border:none; border-radius:2px; cursor:pointer;
          font-family:'Rajdhani',sans-serif;
          font-size:12px;          /* ↑ was 10px */
          letter-spacing:2px; text-transform:uppercase;
          font-weight:700; padding:8px 16px; transition:all 0.2s;
        }

        /* ── INPUTS ── */
        .adm-search {
          background:rgba(255,255,255,0.04); border:1px solid rgba(245,168,0,0.18);
          border-radius:4px; padding:12px 18px; color:#fff;
          font-family:'Rajdhani',sans-serif;
          font-size:15px;          /* ↑ was 13px */
          outline:none; width:100%; max-width:320px; transition:border-color 0.3s;
        }
        .adm-search:focus       { border-color:#F5A800; }
        .adm-search::placeholder{ color:rgba(255,255,255,0.28); }

        /* ── FILTER PILLS ── */
        .adm-filter-pill {
          border:1px solid rgba(255,255,255,0.1); background:transparent;
          color:rgba(255,255,255,0.4); border-radius:20px; padding:7px 18px;
          font-family:'Rajdhani',sans-serif;
          font-size:12px;          /* ↑ was 10px */
          letter-spacing:2px; text-transform:uppercase; font-weight:700;
          cursor:pointer; transition:all 0.2s;
        }
        .adm-filter-pill.active        { border-color:#F5A800; color:#F5A800; background:rgba(245,168,0,0.08); }
        .adm-filter-pill:hover:not(.active) { border-color:rgba(245,168,0,0.3); color:rgba(255,255,255,0.7); }

        /* ── TOAST ── */
        .adm-toast {
          position:fixed; bottom:32px; right:32px;
          background:#0a0a0a; border:1px solid rgba(245,168,0,0.3);
          border-radius:4px; padding:16px 24px;
          font-family:'Rajdhani',sans-serif;
          font-size:15px;          /* ↑ was 13px */
          letter-spacing:1px; color:#F5A800; z-index:9999;
          animation:adm-toast 3s ease forwards;
          box-shadow:0 8px 30px rgba(0,0,0,0.5);
        }

        /* ── CONFIRM OVERLAY ── */
        .adm-confirm-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.8); backdrop-filter:blur(4px); z-index:5000; display:flex; align-items:center; justify-content:center; }
        .adm-confirm-box     { background:#111; border:1px solid rgba(245,168,0,0.2); border-radius:8px; padding:36px; max-width:420px; width:90%; animation:adm-fadeUp 0.3s ease forwards; }

        /* ── USER DRAWER ── */
        .adm-user-drawer {
          position:fixed; right:0; top:0; bottom:0; width:380px; max-width:100%;
          background:#0d0d0d; border-left:1px solid rgba(245,168,0,0.12);
          z-index:4000; overflow-y:auto; padding:32px;
          transform:translateX(100%); transition:transform 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        .adm-user-drawer.open { transform:translateX(0); }

        /* ── SECTION LABELS (table headers, card labels) ── */
        .adm-label {
          font-family:'Rajdhani',sans-serif;
          font-size:11px;          /* ↑ was 9–10px */
          letter-spacing:3px; text-transform:uppercase;
          color:rgba(255,255,255,0.3); font-weight:700;
        }

        /* ── MOBILE ── */
        @media (max-width: 768px) {
          .adm-sidebar  { width:100% !important; position:sticky !important; top:0 !important; z-index:1000 !important; background:#080808 !important; }
          .adm-sidebar::-webkit-scrollbar { display:none; }
          .adm-content  { margin-left:0; padding:20px; }
          .adm-tab      { border-left:none; border-bottom:2px solid transparent; flex-direction:column; gap:4px; padding:10px 14px; font-size:21px; white-space:nowrap; }
          .adm-tab.active { border-bottom-color:#F5A800; border-left:none; }
          .adm-user-drawer  { width:100% !important; max-width:100% !important; padding:22px !important; }
          .adm-confirm-box  { width:95% !important; padding:24px !important; }
          .adm-stat-card    { padding:18px !important; }
          .adm-toast        { right:12px !important; left:12px !important; bottom:12px !important; width:auto !important; }
        }

        @media (max-width: 480px) {
          .adm-content  { padding:14px !important; }
          .adm-tab      { min-width:72px; font-size:20px !important; }
          .adm-stat-card{ padding:14px !important; }
          .adm-confirm-box   { padding:18px !important; }
          .adm-user-drawer   { padding:16px !important; }
        }
      `}</style>

      <div className="adm-page">

        {/* ── MOBILE SLIDE-OVER MENU ── */}
        {isMobile && mobileMenuOpen && (
          <>
            <div onClick={() => setMobileMenuOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:2000 }} />
            <div style={{ position:"fixed", top:0, left:0, width:"270px", height:"100vh", background:"#080808", zIndex:3000, padding:"24px", borderRight:"1px solid rgba(245,168,0,0.1)" }}>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background:"none", border:"none", color:"#fff", fontSize:26, marginBottom:24, cursor:"pointer" }}>✕</button>
              {tabs.map(t => (
                <div key={t.id} className={`adm-tab ${tab===t.id?"active":""}`} onClick={() => { setTab(t.id); setMobileMenuOpen(false); }}>
                  <span>{t.icon}</span>{t.label}
                </div>
              ))}
              <button onClick={onExit} style={{ marginTop:24, width:"100%", padding:"14px", background:"#ef4444", color:"#fff", border:"none", borderRadius:6, cursor:"pointer", fontFamily:"Rajdhani,sans-serif", fontSize:14, fontWeight:700, letterSpacing:2 }}>
                Exit Admin
              </button>
            </div>
          </>
        )}

        {/* ── SIDEBAR (desktop) ── */}
        <div className="adm-sidebar" style={{ display: isMobile ? "none" : "flex" }}>
          {/* Logo */}
          <div style={{ padding:"0 24px 28px", borderBottom:"1px solid rgba(245,168,0,0.08)" }}>
            <div style={{ fontFamily:"Cinzel,serif", fontSize:16, fontWeight:900, color:"#F5A800", letterSpacing:2 }}>ZOE ADMIN</div>
            <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:11, letterSpacing:2, color:"rgba(255,255,255,0.28)", marginTop:4 }}>SCHOOL OF MYSTERIES</div>
          </div>

          {/* Tabs */}
          <div style={{ flex:1, paddingTop:10 }}>
            {tabs.map(t => (
              <div key={t.id} className={`adm-tab ${tab===t.id?"active":""}`} onClick={() => setTab(t.id)}>
                <span>{t.icon}</span>{t.label}
              </div>
            ))}
          </div>

          {/* Exit */}
          <div style={{ padding:"18px 24px", borderTop:"1px solid rgba(245,168,0,0.08)" }}>
            <button onClick={onExit}
              style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.4)", fontFamily:"Rajdhani,sans-serif", fontSize:13, letterSpacing:2, textTransform:"uppercase", fontWeight:700, padding:"12px 16px", borderRadius:2, cursor:"pointer", width:"100%", transition:"all 0.3s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="#ef4444"; e.currentTarget.style.color="#ef4444"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; e.currentTarget.style.color="rgba(255,255,255,0.4)"; }}>
              ← Exit Admin
            </button>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="adm-content">

          {/* Mobile top bar */}
          {isMobile && (
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, padding:"14px 16px", background:"#080808", border:"1px solid rgba(245,168,0,0.1)", borderRadius:8 }}>
              <div style={{ color:"#F5A800", fontFamily:"Cinzel,serif", fontWeight:700, fontSize:18 }}>ZOE ADMIN</div>
              <button onClick={() => setMobileMenuOpen(true)} style={{ background:"none", border:"none", color:"#F5A800", fontSize:30, cursor:"pointer" }}>☰</button>
            </div>
          )}

          {/* ══ BLOG ══ */}
          {tab === "blog" && (
            <div style={{ animation:"adm-fadeUp 0.5s ease" }}>
              <div style={{ marginBottom:28 }}>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:30, fontWeight:700 }}>Blog ✍️</div>
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:15, marginTop:4 }}>Write and manage blog posts</div>
              </div>

              <div className="adm-stat-card" style={{ marginBottom:24 }}>
                <input className="adm-search" placeholder="Post Title" value={blogTitle} onChange={e=>setBlogTitle(e.target.value)} style={{ marginBottom:12, maxWidth:"100%" }} />
                <input className="adm-search" placeholder="Author Name" value={blogAuthor} onChange={e=>setBlogAuthor(e.target.value)} style={{ marginBottom:12, maxWidth:"100%" }} />
                <textarea
                  placeholder="Write your blog post here... (HTML supported)"
                  value={blogBody} onChange={e=>setBlogBody(e.target.value)} rows={10}
                  style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(245,168,0,0.2)", borderRadius:6, color:"#fff", fontFamily:"Cormorant Garamond,serif", fontSize:17, padding:"14px 18px", outline:"none", resize:"vertical", marginBottom:16, lineHeight:1.7 }}
                />
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
                  <div onClick={() => setBlogPublished(!blogPublished)} style={{ width:48, height:26, borderRadius:13, background:blogPublished?"#F5A800":"rgba(255,255,255,0.1)", position:"relative", cursor:"pointer", transition:"background 0.3s", flexShrink:0 }}>
                    <div style={{ position:"absolute", top:3, left:blogPublished?26:3, width:20, height:20, borderRadius:"50%", background:"#fff", transition:"left 0.3s" }} />
                  </div>
                  <span style={{ fontFamily:"Rajdhani,sans-serif", fontSize:14, letterSpacing:1, color:"rgba(255,255,255,0.5)" }}>
                    {blogPublished ? "Published — visible to all" : "Draft — hidden from public"}
                  </span>
                </div>
                <button className="adm-btn" disabled={blogSaving}
                  style={{ background:blogSaving?"rgba(245,168,0,0.4)":"#F5A800", color:"#000", width:"100%", padding:"15px", fontSize:14 }}
                  onClick={async () => {
                    if (!blogTitle.trim() || !blogBody.trim()) return showToast("Title and body are required.");
                    setBlogSaving(true);
                    try {
                      if (editingBlog) {
                        await updateBlog(editingBlog.id, { title:blogTitle.trim(), author:blogAuthor.trim()||"Zoe Admin", body:blogBody, published:blogPublished });
                        setEditingBlog(null); showToast("Post updated ✓");
                      } else {
                        await addBlog({ title:blogTitle.trim(), author:blogAuthor.trim()||"Zoe Admin", body:blogBody, published:blogPublished });
                        showToast("Post published ✓");
                      }
                      setBlogTitle(""); setBlogAuthor(""); setBlogBody(""); setBlogPublished(true);
                      setBlogs(await getAllBlogs());
                    } catch(e) { showToast("Error: "+e.message); }
                    setBlogSaving(false);
                  }}>
                  {blogSaving ? "Saving..." : editingBlog ? "Update Post" : "Publish Post"}
                </button>
                {editingBlog && (
                  <button className="adm-btn" style={{ width:"100%", marginTop:10, background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.4)", padding:"12px" }}
                    onClick={() => { setEditingBlog(null); setBlogTitle(""); setBlogAuthor(""); setBlogBody(""); setBlogPublished(true); }}>
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="adm-stat-card">
                <div className="adm-label" style={{ marginBottom:18 }}>All Posts ({blogs.length})</div>
                {blogs.length === 0 && <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:17, fontStyle:"italic", color:"rgba(255,255,255,0.3)", textAlign:"center", padding:"36px 0" }}>No posts yet.</div>}
                {blogs.map(post => (
                  <div key={post.id} style={{ padding:"16px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap" }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontFamily:"Cinzel,serif", fontSize:16, fontWeight:700, color:"#fff", marginBottom:5 }}>{post.title}</div>
                        <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:12, color:"rgba(255,255,255,0.3)", letterSpacing:1 }}>
                          {post.author} · {post.createdAt?.toDate?.().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
                        </div>
                      </div>
                      <span style={{ fontFamily:"Rajdhani,sans-serif", fontSize:10, letterSpacing:2, padding:"4px 12px", borderRadius:12, fontWeight:700, background:post.published?"rgba(34,197,94,0.12)":"rgba(255,255,255,0.06)", color:post.published?"#22c55e":"rgba(255,255,255,0.3)" }}>
                        {post.published?"PUBLISHED":"DRAFT"}
                      </span>
                    </div>
                    <div style={{ display:"flex", gap:10, marginTop:14 }}>
                      <button className="adm-btn" style={{ background:"rgba(245,168,0,0.1)", color:"#F5A800" }}
                        onClick={() => { setEditingBlog(post); setBlogTitle(post.title); setBlogAuthor(post.author); setBlogBody(post.body); setBlogPublished(post.published); window.scrollTo({top:0,behavior:"smooth"}); }}>Edit</button>
                      <button className="adm-btn" style={{ background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.4)" }}
                        onClick={async () => { await updateBlog(post.id,{published:!post.published}); setBlogs(await getAllBlogs()); showToast(post.published?"Post set to draft":"Post published ✓"); }}>
                        {post.published?"Unpublish":"Publish"}
                      </button>
                      <button className="adm-btn" style={{ background:"rgba(239,68,68,0.12)", color:"#ef4444" }}
                        onClick={async () => { await deleteBlog(post.id); setBlogs(await getAllBlogs()); showToast("Post deleted."); }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ EVENTS ══ */}
          {tab === "events" && (
            <div style={{ animation:"adm-fadeUp 0.5s ease" }}>
              <div style={{ marginBottom:24 }}>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:30, fontWeight:700 }}>Events 📅</div>
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:15, marginTop:4 }}>Create, edit and manage church events</div>
              </div>
              <div className="adm-stat-card" style={{ marginBottom:24 }}>
                <input className="adm-search" placeholder="Event Title"       value={eventTitle} onChange={e=>setEventTitle(e.target.value)} style={{ marginBottom:12 }} />
                <input className="adm-search" placeholder="Event Description" value={eventDesc}  onChange={e=>setEventDesc(e.target.value)}  style={{ marginBottom:12 }} />
                <input type="date" className="adm-search" value={eventDate} onChange={e=>setEventDate(e.target.value)} style={{ marginBottom:12 }} />
                <select value={eventType} onChange={e=>setEventType(e.target.value)} className="adm-search" style={{ marginBottom:14 }}>
                  <option value="">Select Type</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                  <option value="daily">Daily</option>
                </select>
                <button className="adm-btn" style={{ background:"#F5A800", color:"#000", width:"100%", padding:"15px", fontSize:14 }}
                  onClick={async () => {
                    if (!eventTitle) return alert("Title required");
                    if (editingEvent) {
                      await updateEvent(editingEvent.id, { title:eventTitle, description:eventDesc, date:eventDate, type:eventType });
                      setEditingEvent(null);
                    } else {
                      await addEvent({ title:eventTitle, description:eventDesc, date:eventDate });
                    }
                    setEventTitle(""); setEventDesc(""); setEventDate(""); setEventType("");
                    setEvents(await getAllEvents());
                  }}>
                  {editingEvent ? "Update Event" : "Create Event"}
                </button>
              </div>
              <div className="adm-stat-card">
                {events.map(ev => (
                  <div key={ev.id} style={{ padding:"14px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontFamily:"Cinzel,serif", fontSize:16, fontWeight:700, marginBottom:4 }}>{ev.title}</div>
                    <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:14, color:"rgba(255,255,255,0.4)" }}>{ev.description}</div>
                    <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:13, color:"#F5A800", marginTop:5 }}>{ev.date} · {ev.type}</div>
                    <div style={{ display:"flex", gap:10, marginTop:12 }}>
                      <button className="adm-btn" onClick={() => { setEditingEvent(ev); setEventTitle(ev.title); setEventDesc(ev.description); setEventDate(ev.date); setEventType(ev.type); }}>Edit</button>
                      <button className="adm-btn" style={{ background:"rgba(239,68,68,0.2)", color:"#ef4444" }}
                        onClick={async () => { await deleteEvent(ev.id); setEvents(await getAllEvents()); }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ DASHBOARD ══ */}
          {tab === "dashboard" && (
            <div style={{ animation:"adm-fadeUp 0.5s ease forwards" }}>
              <div style={{ marginBottom:36 }}>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:32, fontWeight:700, color:"#fff", marginBottom:8 }}>Dashboard</div>
                <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:14, letterSpacing:2, color:"rgba(255,255,255,0.3)" }}>Overview of Zoe School of Mysteries</div>
              </div>
              {loading ? <Loader /> : stats && (
                <>
                  <div style={{ display:"grid", gridTemplateColumns: width<480?"1fr":isMobile?"1fr 1fr":"repeat(4,1fr)", gap:14, marginBottom:36 }}>
                    {[
                      { label:"Total Members", value:stats.totalUsers,  color:"#F5A800", icon:"👥" },
                      { label:"Active Users",  value:stats.activeUsers, color:"#22c55e", icon:"✅" },
                      { label:"Banned",        value:stats.bannedUsers, color:"#ef4444", icon:"🚫" },
                      { label:"Admins",        value:stats.adminCount,  color:"#9333EA", icon:"👑" },
                    ].map((s,i) => (
                      <div key={i} className="adm-stat-card">
                        <div style={{ fontSize:26, marginBottom:12 }}>{s.icon}</div>
                        <div style={{ fontFamily:"Cinzel,serif", fontSize:36, fontWeight:900, color:s.color, lineHeight:1, marginBottom:8, textShadow:`0 0 20px ${s.color}66` }}>{s.value}</div>
                        <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:11, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:14, marginBottom:36 }}>
                    <div className="adm-stat-card">
                      <div className="adm-label" style={{ marginBottom:14 }}>Total Giving</div>
                      <div style={{ fontFamily:"Cinzel,serif", fontSize:40, fontWeight:900, color:"#F5A800", textShadow:"0 0 30px rgba(245,168,0,0.4)" }}>₦{stats.totalGiving?.toLocaleString()}</div>
                      <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:13, color:"rgba(255,255,255,0.3)", marginTop:8 }}>{stats.totalGivingTx} transactions</div>
                    </div>
                    <div className="adm-stat-card">
                      <div className="adm-label" style={{ marginBottom:18 }}>Giving by Fund</div>
                      {Object.entries(stats.byFund||{}).slice(0,5).map(([fund,amt]) => (
                        <div key={fund} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                          <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:16, color:"rgba(255,255,255,0.6)" }}>{fund}</div>
                          <div style={{ fontFamily:"Cinzel,serif", fontSize:16, fontWeight:700, color:"#F5A800" }}>₦{amt?.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="adm-stat-card">
                    <div className="adm-label" style={{ marginBottom:18 }}>Recent Activity</div>
                    {activity.map((a,i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                        <div style={{ fontSize:20, flexShrink:0 }}>{ACTIVITY_ICONS[a.type]||"•"}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:15, color:"rgba(255,255,255,0.7)" }}>{a.description}</div>
                          <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:12, color:"rgba(255,255,255,0.25)", letterSpacing:1, marginTop:2 }}>{formatTime(a.timestamp)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══ USERS ══ */}
          {tab === "users" && (
            <div style={{ animation:"adm-fadeUp 0.5s ease forwards" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:30, flexWrap:"wrap", gap:16 }}>
                <div>
                  <div style={{ fontFamily:"Cinzel,serif", fontSize:30, fontWeight:700, color:"#fff", marginBottom:5 }}>Users</div>
                  <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:14, letterSpacing:2, color:"rgba(255,255,255,0.3)" }}>{filteredUsers.length} members</div>
                </div>
                <input className="adm-search" placeholder="Search name or email..." value={search} onChange={e=>setSearch(e.target.value)} />
              </div>
              <div style={{ display:"flex", gap:10, marginBottom:22, flexWrap:"wrap" }}>
                {["all","active","banned","admin"].map(f => (
                  <button key={f} className={`adm-filter-pill ${userFilter===f?"active":""}`} onClick={()=>setUserFilter(f)}>{f}</button>
                ))}
              </div>
              {loading ? <Loader /> : (
                <div style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,0.06)", borderRadius:6, overflow:"hidden" }}>
                  <div className="adm-table-row" style={{ gridTemplateColumns:isMobile?"1fr 90px":"2fr 2fr 110px 90px 130px", borderBottom:"1px solid rgba(245,168,0,0.1)", background:"rgba(245,168,0,0.04)" }}>
                    {["Name / Email",!isMobile&&"Joined",!isMobile&&"Role","Status",!isMobile&&"Actions"].filter(Boolean).map((h,i)=>(
                      <div key={i} className="adm-label">{h}</div>
                    ))}
                  </div>
                  {filteredUsers.map((u,i) => (
                    <div key={i} className="adm-table-row" style={{ gridTemplateColumns:isMobile?"1fr 90px":"2fr 2fr 110px 90px 130px", cursor:"pointer" }} onClick={()=>setSelectedUser(u)}>
                      <div>
                        <div style={{ fontFamily:"Cinzel,serif", fontSize:14, fontWeight:600, color:"#fff", marginBottom:3 }}>{u.name}</div>
                        <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:12, color:"rgba(255,255,255,0.35)" }}>{u.email}</div>
                      </div>
                      {!isMobile && <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:13, color:"rgba(255,255,255,0.4)", alignSelf:"center" }}>{formatDate(u.createdAt)}</div>}
                      {!isMobile && <div style={{ alignSelf:"center" }}><span className="adm-badge" style={{ background:u.role==="admin"?"rgba(147,51,234,0.15)":"rgba(255,255,255,0.06)", color:u.role==="admin"?"#9333EA":"rgba(255,255,255,0.4)" }}>{u.role}</span></div>}
                      <div style={{ alignSelf:"center" }}><span className="adm-badge" style={{ background:u.status==="active"?"rgba(34,197,94,0.12)":"rgba(239,68,68,0.12)", color:u.status==="active"?"#22c55e":"#ef4444" }}>{u.status}</span></div>
                      {!isMobile && (
                        <div style={{ display:"flex", gap:8, alignSelf:"center" }} onClick={e=>e.stopPropagation()}>
                          {u.status==="active"
                            ? <button className="adm-btn" style={{ background:"rgba(239,68,68,0.12)", color:"#ef4444" }} onClick={()=>setConfirm({action:"ban",uid:u.uid,name:u.name})}>Ban</button>
                            : <button className="adm-btn" style={{ background:"rgba(34,197,94,0.12)", color:"#22c55e" }} onClick={()=>setConfirm({action:"unban",uid:u.uid,name:u.name})}>Unban</button>}
                          <button className="adm-btn" style={{ background:"rgba(239,68,68,0.08)", color:"rgba(239,68,68,0.6)" }} onClick={()=>setConfirm({action:"delete",uid:u.uid,name:u.name})}>Del</button>
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredUsers.length===0 && <div style={{ padding:"52px", textAlign:"center", fontFamily:"Cormorant Garamond,serif", fontSize:17, fontStyle:"italic", color:"rgba(255,255,255,0.3)" }}>No users found.</div>}
                </div>
              )}
            </div>
          )}

          {/* ══ GIVING ══ */}
          {tab === "giving" && (
            <div style={{ animation:"adm-fadeUp 0.5s ease forwards" }}>
              <div style={{ marginBottom:30 }}>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:30, fontWeight:700, color:"#fff", marginBottom:5 }}>Giving Records</div>
                <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:14, letterSpacing:2, color:"rgba(255,255,255,0.3)" }}>
                  {giving.length} transactions · Total: <span style={{ color:"#F5A800" }}>₦{totalGiving.toLocaleString()}</span>
                </div>
              </div>
              {loading ? <Loader /> : (
                <div style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,0.06)", borderRadius:6, overflow:"hidden" }}>
                  <div className="adm-table-row" style={{ gridTemplateColumns:isMobile?"1fr 110px":"2fr 1fr 110px 90px 90px", borderBottom:"1px solid rgba(245,168,0,0.1)", background:"rgba(245,168,0,0.04)" }}>
                    {["Donor",!isMobile&&"Fund","Amount",!isMobile&&"Method","Date"].filter(Boolean).map((h,i)=>(
                      <div key={i} className="adm-label">{h}</div>
                    ))}
                  </div>
                  {giving.map((g,i) => (
                    <div key={i} className="adm-table-row" style={{ gridTemplateColumns:isMobile?"1fr 110px":"2fr 1fr 110px 90px 90px" }}>
                      <div>
                        <div style={{ fontFamily:"Cinzel,serif", fontSize:14, color:"#fff", marginBottom:3 }}>{g.name}</div>
                        <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:12, color:"rgba(255,255,255,0.3)" }}>{g.email}</div>
                      </div>
                      {!isMobile && <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:13, color:"rgba(255,255,255,0.5)", alignSelf:"center" }}>{g.fund}</div>}
                      <div style={{ fontFamily:"Cinzel,serif", fontSize:15, fontWeight:700, color:"#F5A800", alignSelf:"center" }}>₦{g.amount?.toLocaleString()}</div>
                      {!isMobile && <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:12, color:"rgba(255,255,255,0.3)", alignSelf:"center" }}>{g.method}</div>}
                     <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:12, color:"rgba(255,255,255,0.3)", alignSelf:"center" }}>
  {g.createdAt?.toDate 
    ? formatDate(g.createdAt)
    : g.createdAt?.seconds
    ? formatDate(new Date(g.createdAt.seconds * 1000))
    : "—"}
</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ ACTIVITY ══ */}
          {tab === "activity" && (
            <div style={{ animation:"adm-fadeUp 0.5s ease forwards" }}>
              <div style={{ marginBottom:30 }}>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:30, fontWeight:700, color:"#fff", marginBottom:5 }}>Activity Log</div>
                <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:14, letterSpacing:2, color:"rgba(255,255,255,0.3)" }}>Real-time user activity</div>
              </div>
              {loading ? <Loader /> : (
                <div style={{ display:"flex", flexDirection:"column", background:"#0a0a0a", border:"1px solid rgba(255,255,255,0.06)", borderRadius:6, overflow:"hidden" }}>
                  {activity.map((a,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", transition:"background 0.2s" }}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(245,168,0,0.03)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                        {ACTIVITY_ICONS[a.type]||"•"}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:15, color:"rgba(255,255,255,0.75)", letterSpacing:0.5 }}>{a.description}</div>
                        <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:12, color:"rgba(255,255,255,0.25)", marginTop:3, letterSpacing:1 }}>UID: {a.uid?.substring(0,12)}... · {formatTime(a.timestamp)}</div>
                      </div>
                      <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:11, letterSpacing:2, textTransform:"uppercase", color:"rgba(255,255,255,0.2)", whiteSpace:"nowrap" }}>{formatDate(a.timestamp)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ PRAYER ══ */}
          {tab === "prayer" && (
            <div style={{ animation:"adm-fadeUp 0.5s ease forwards" }}>
              <div style={{ marginBottom:30 }}>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:30, fontWeight:700, color:"#fff", marginBottom:5 }}>Prayer Requests</div>
                <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:14, letterSpacing:2, color:"rgba(255,255,255,0.3)" }}>{prayer?.total??"..."} total · {prayer?.urgent??0} urgent</div>
              </div>
              {loading ? <Loader /> : prayer && (
                <>
                  <div style={{ display:"grid", gridTemplateColumns:width<480?"1fr":isMobile?"1fr 1fr":"repeat(4,1fr)", gap:14, marginBottom:26 }}>
                    {[
                      { label:"Total",    value:prayer.total,   color:"#9333EA", icon:"🙏" },
                      { label:"Pending",  value:prayer.pending, color:"#F5A800", icon:"⏳" },
                      { label:"Praying",  value:prayer.praying, color:"#06b6d4", icon:"✨" },
                      { label:"Answered", value:prayer.answered,color:"#22c55e", icon:"🙌" },
                    ].map((s,i) => (
                      <div key={i} className="adm-stat-card">
                        <div style={{ fontSize:24, marginBottom:10 }}>{s.icon}</div>
                        <div style={{ fontFamily:"Cinzel,serif", fontSize:34, fontWeight:900, color:s.color, lineHeight:1, marginBottom:5, textShadow:`0 0 20px ${s.color}55` }}>{s.value}</div>
                        <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:11, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:14, marginBottom:26 }}>
                    <div className="adm-stat-card">
                      <div className="adm-label" style={{ marginBottom:18 }}>By Category</div>
                      {Object.entries(prayer.byCategory).sort((a,b)=>b[1]-a[1]).map(([cat,count]) => (
                        <div key={cat} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                          <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:16, color:"rgba(255,255,255,0.65)" }}>{cat}</div>
                          <div style={{ fontFamily:"Cinzel,serif", fontSize:15, fontWeight:700, color:"#9333EA" }}>{count}</div>
                        </div>
                      ))}
                      {Object.keys(prayer.byCategory).length===0 && <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:15, fontStyle:"italic", color:"rgba(255,255,255,0.25)" }}>No data yet</div>}
                    </div>
                    <div className="adm-stat-card" style={{ display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center" }}>
                      <div style={{ fontSize:34, marginBottom:14 }}>⚡</div>
                      <div style={{ fontFamily:"Cinzel,serif", fontSize:56, fontWeight:900, color:"#ef4444", textShadow:"0 0 30px rgba(239,68,68,0.5)", lineHeight:1, marginBottom:10 }}>{prayer.urgent}</div>
                      <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:11, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>Urgent Requests</div>
                      <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:14, fontStyle:"italic", color:"rgba(255,255,255,0.25)", marginTop:8 }}>require immediate intercession</div>
                    </div>
                  </div>
                  <div className="adm-stat-card">
                    <div className="adm-label" style={{ marginBottom:22 }}>All Requests ({prayer.recent.length})</div>
                    {prayer.recent.length===0 && <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:17, fontStyle:"italic", color:"rgba(255,255,255,0.3)", textAlign:"center", padding:"36px 0" }}>No prayer requests yet.</div>}
                    {prayer.recent.map(req => (
                      <div key={req.id} style={{ padding:"18px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, flexWrap:"wrap", gap:10 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                            <span style={{ fontFamily:"Cinzel,serif", fontSize:14, fontWeight:700, color:"#9333EA" }}>{req.category}</span>
                            {req.urgent    && <span style={{ background:"rgba(239,68,68,0.15)", color:"#ef4444",              fontFamily:"Rajdhani,sans-serif", fontSize:10, letterSpacing:2, fontWeight:700, padding:"3px 10px", borderRadius:2 }}>URGENT</span>}
                            {req.isAnonymous&&<span style={{ background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.3)", fontFamily:"Rajdhani,sans-serif", fontSize:10, letterSpacing:2, fontWeight:700, padding:"3px 10px", borderRadius:2 }}>ANONYMOUS</span>}
                          </div>
                          <select value={req.status||"pending"}
                            onChange={async e => { await updatePrayerStatus(req.id,e.target.value); setPrayer(await getPrayerStats()); showToast("Prayer status updated ✓"); }}
                            style={{ background:"#111", border:`1px solid ${req.status==="answered"?"rgba(34,197,94,0.4)":req.status==="praying"?"rgba(6,182,212,0.4)":"rgba(245,168,0,0.4)"}`, color:req.status==="answered"?"#22c55e":req.status==="praying"?"#06b6d4":"#F5A800", fontFamily:"Rajdhani,sans-serif", fontSize:12, letterSpacing:2, padding:"6px 14px", borderRadius:2, cursor:"pointer", outline:"none" }}>
                            <option value="pending">⏳ Pending</option>
                            <option value="praying">✨ Being Prayed For</option>
                            <option value="answered">🙌 Answered</option>
                          </select>
                        </div>
                        <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:16, fontWeight:300, color:"rgba(255,255,255,0.6)", lineHeight:1.75, marginBottom:10 }}>
                          {req.request?.length>200?req.request.substring(0,200)+"…":req.request}
                        </p>
                        <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:12, color:"rgba(255,255,255,0.22)", letterSpacing:1 }}>
                          {req.isAnonymous?"Anonymous":req.name}{!req.isAnonymous&&req.email?` · ${req.email}`:""} · {formatDate(req.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

        </div>{/* end .adm-content */}

        {/* ── USER DETAIL DRAWER ── */}
        <div className={`adm-user-drawer ${selectedUser?"open":""}`}>
          {selectedUser && (
            <>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:30 }}>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:18, fontWeight:700, color:"#fff" }}>User Details</div>
                <button onClick={()=>setSelectedUser(null)} style={{ background:"rgba(255,255,255,0.06)", border:"none", color:"rgba(255,255,255,0.5)", width:34, height:34, borderRadius:"50%", cursor:"pointer", fontSize:18 }}>×</button>
              </div>
              <div style={{ width:68, height:68, borderRadius:"50%", background:"linear-gradient(135deg,#6B21A8,#F5A800)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Cinzel,serif", fontSize:26, fontWeight:700, color:"#000", marginBottom:18 }}>
                {selectedUser.name?.charAt(0)?.toUpperCase()}
              </div>
              <div style={{ fontFamily:"Cinzel,serif", fontSize:20, fontWeight:700, color:"#fff", marginBottom:5 }}>{selectedUser.name}</div>
              <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:14, color:"rgba(255,255,255,0.4)", marginBottom:22 }}>{selectedUser.email}</div>
              {[
                { l:"Role",        v:selectedUser.role,                           color:selectedUser.role==="admin"?"#9333EA":"rgba(255,255,255,0.5)" },
                { l:"Status",      v:selectedUser.status,                         color:selectedUser.status==="active"?"#22c55e":"#ef4444" },
                { l:"Joined",      v:formatDate(selectedUser.createdAt) },
                { l:"Last Seen",   v:formatDate(selectedUser.lastSeen) },
                { l:"Total Given", v:`₦${(selectedUser.givingTotal||0).toLocaleString()}`, color:"#F5A800" },
              ].map((r,i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:11, letterSpacing:2, textTransform:"uppercase", color:"rgba(255,255,255,0.25)" }}>{r.l}</div>
                  <div style={{ fontFamily:"Cinzel,serif", fontSize:14, fontWeight:600, color:r.color||"#fff" }}>{r.v}</div>
                </div>
              ))}
              <div style={{ marginTop:26, display:"flex", flexDirection:"column", gap:12 }}>
                {selectedUser.status==="active"
                  ? <button className="adm-btn" style={{ background:"rgba(239,68,68,0.12)", color:"#ef4444", padding:"14px", width:"100%", fontSize:13 }} onClick={()=>{ setConfirm({action:"ban",uid:selectedUser.uid,name:selectedUser.name}); setSelectedUser(null); }}>🚫 Ban This User</button>
                  : <button className="adm-btn" style={{ background:"rgba(34,197,94,0.12)", color:"#22c55e", padding:"14px", width:"100%", fontSize:13 }} onClick={()=>{ setConfirm({action:"unban",uid:selectedUser.uid,name:selectedUser.name}); setSelectedUser(null); }}>✅ Unban This User</button>}
                {selectedUser.role!=="admin"
                  ? <button className="adm-btn" style={{ background:"rgba(147,51,234,0.12)", color:"#9333EA", padding:"14px", width:"100%", fontSize:13 }} onClick={()=>{ setConfirm({action:"promote",uid:selectedUser.uid,name:selectedUser.name}); setSelectedUser(null); }}>👑 Promote to Admin</button>
                  : <button className="adm-btn" style={{ background:"rgba(245,168,0,0.1)", color:"#F5A800", padding:"14px", width:"100%", fontSize:13 }} onClick={()=>{ setConfirm({action:"demote",uid:selectedUser.uid,name:selectedUser.name}); setSelectedUser(null); }}>⬇️ Remove Admin Role</button>}
                <button className="adm-btn" style={{ background:"rgba(239,68,68,0.06)", color:"rgba(239,68,68,0.5)", padding:"14px", width:"100%", fontSize:13 }} onClick={()=>{ setConfirm({action:"delete",uid:selectedUser.uid,name:selectedUser.name}); setSelectedUser(null); }}>🗑 Delete Account</button>
              </div>
            </>
          )}
        </div>
        {selectedUser && <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:3999 }} onClick={()=>setSelectedUser(null)} />}

        {/* ── CONFIRM DIALOG ── */}
        {confirm && (
          <div className="adm-confirm-overlay" onClick={()=>setConfirm(null)}>
            <div className="adm-confirm-box" onClick={e=>e.stopPropagation()}>
              <div style={{ fontSize:38, marginBottom:18, textAlign:"center" }}>
                {confirm.action==="ban"?"🚫":confirm.action==="unban"?"✅":confirm.action==="delete"?"🗑":"👑"}
              </div>
              <div style={{ fontFamily:"Cinzel,serif", fontSize:20, fontWeight:700, color:"#fff", textAlign:"center", marginBottom:12 }}>
                {confirm.action==="ban"?"Ban User":confirm.action==="unban"?"Unban User":confirm.action==="delete"?"Delete User":confirm.action==="demote"?"Remove Admin Role":"Promote User"}?
              </div>
              <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:19, fontStyle:"italic", color:"rgba(255,255,255,0.45)", textAlign:"center", marginBottom:30 }}>
                {confirm.action==="ban"    ?`${confirm.name} will no longer be able to log in.`
                :confirm.action==="unban"  ?`${confirm.name}'s access will be restored.`
                :confirm.action==="delete" ?`This will permanently delete ${confirm.name}'s account.`
                :confirm.action==="demote" ?`${confirm.name} will be downgraded back to a regular member.`
                                           :`${confirm.name} will gain full admin access.`}
              </p>
              <div style={{ display:"flex", gap:12 }}>
                <button onClick={()=>setConfirm(null)} style={{ flex:1, padding:"14px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)", fontFamily:"Rajdhani,sans-serif", fontSize:13, letterSpacing:2, textTransform:"uppercase", fontWeight:700, borderRadius:2, cursor:"pointer" }}>Cancel</button>
                <button onClick={handleAction} style={{ flex:1, padding:"14px", background:confirm.action==="delete"?"#ef4444":confirm.action==="promote"?"#9333EA":confirm.action==="demote"?"#F5A800":confirm.action==="unban"?"#22c55e":"#ef4444", fontFamily:"Rajdhani,sans-serif", fontSize:13, letterSpacing:2, textTransform:"uppercase", fontWeight:700, border:"none", borderRadius:2, cursor:"pointer" }}>Confirm</button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOAST ── */}
        {toast && <div className="adm-toast">{toast}</div>}

      </div>
    </>
  );
}

function Loader() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"64px", flexDirection:"column", gap:18 }}>
      <div style={{ width:38, height:38, borderRadius:"50%", border:"2px solid rgba(245,168,0,0.2)", borderTopColor:"#F5A800", animation:"adm-spin 0.8s linear infinite" }} />
      <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:13, letterSpacing:3, color:"rgba(255,255,255,0.25)", textTransform:"uppercase" }}>Loading...</div>
      <style>{"@keyframes adm-spin{to{transform:rotate(360deg)}}"}</style>
    </div>
  );
}