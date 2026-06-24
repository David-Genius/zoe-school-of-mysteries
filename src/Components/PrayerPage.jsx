import { useState, useEffect, useRef } from "react";
import { db, auth, onAuthChange, logActivity } from "./firebase";
import {
  collection, addDoc, serverTimestamp,
  query, where, getDocs, orderBy, limit,
} from "firebase/firestore";

// ── EmailJS config — fill these in from emailjs.com
const EMAILJS_SERVICE_ID  = "your_service_id";
const EMAILJS_TEMPLATE_ID = "your_prayer_template_id";
const EMAILJS_PUBLIC_KEY  = "your_public_key";
// Prayer team email — set this to your real prayer team email
const PRAYER_TEAM_EMAIL   = "prayer@zoeschool.com";

function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

// Send email via EmailJS
async function sendPrayerEmail({ name, email, category, request, isAnonymous }) {
  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id:  EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id:     EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email:    PRAYER_TEAM_EMAIL,
          from_name:   isAnonymous ? "Anonymous" : name,
          from_email:  email,
          category,
          prayer_request: request,
          submitted_at: new Date().toLocaleString("en-NG"),
        },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const CATEGORIES = [
  { id: "healing",      label: "Healing",        icon: "🙏", color: "#22c55e",  desc: "Physical, emotional or mental healing"   },
  { id: "family",       label: "Family",          icon: "👨‍👩‍👧", color: "#F5A800",  desc: "Marriage, children, relationships"      },
  { id: "breakthrough", label: "Breakthrough",    icon: "⚡", color: "#9333EA",  desc: "Doors, opportunities, divine favor"      },
  { id: "salvation",    label: "Salvation",       icon: "✝️", color: "#ef4444",  desc: "For yourself or a loved one"            },
  { id: "finances",     label: "Finances",        icon: "💰", color: "#f97316",  desc: "Provision, debt freedom, abundance"     },
  { id: "guidance",     label: "Guidance",        icon: "🧭", color: "#06b6d4",  desc: "Direction, decisions, career, purpose"  },
  { id: "protection",   label: "Protection",      icon: "🛡", color: "#6366f1",  desc: "Spiritual warfare, safety, peace"       },
  { id: "other",        label: "Other",           icon: "💬", color: "#ec4899",  desc: "Any other prayer need"                  },
];

// const TESTIMONIES = [
//   { name: "Sister Amaka", category: "Healing",     text: "I submitted a prayer request for my mother's cancer diagnosis in January. By March, her scans came back clean. The doctors called it unexplainable. I call it God.", time: "2 months ago" },
//   { name: "Brother Felix", category: "Finances",   text: "I was three months behind on rent and had no job. Within two weeks of submitting my request, I got three job offers and paid everything off. God is faithful.", time: "6 weeks ago" },
//   { name: "Sis. Ngozi",   category: "Family",      text: "My husband and I were on the verge of divorce. I sent in a prayer request anonymously. Something shifted. We went for counselling. Today we are stronger than ever.", time: "3 months ago" },
// ];

export default function PrayerPage({ user, onNavigate }) {
  const width    = useWidth();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const sidePad  = isMobile ? 20 : isTablet ? 32 : 64;
  const topOffset = isMobile ? 130 : 76;

  const [currentUser,  setCurrentUser]  = useState(user || null);
  const [step,         setStep]         = useState(1); // 1=category, 2=form, 3=success
  const [selectedCat,  setSelectedCat]  = useState(null);
  const [form,         setForm]         = useState({ request: "", isAnonymous: false, urgent: false });
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [myRequests,   setMyRequests]   = useState([]);
  const [activeTab,    setActiveTab]    = useState("submit"); // submit | mine | testimonies
  const textRef = useRef(null);

  // Listen to auth state
  useEffect(() => {
    const unsub = onAuthChange(u => setCurrentUser(u));
    return unsub;
  }, []);

  // Load user's own requests
  useEffect(() => {
    if (!currentUser) return;
    const load = async () => {
      try {
        const q = query(
          collection(db, "prayer_requests"),
          where("uid", "==", currentUser.uid),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const snap = await getDocs(q);
        setMyRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch {}
    };
    load();
  }, [currentUser, step]);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.request.trim()) { setError("Please write your prayer request."); return; }
    if (form.request.trim().length < 20) { setError("Please share a bit more detail (at least 20 characters)."); return; }

    setLoading(true); setError("");
    try {
      const cat = CATEGORIES.find(c => c.id === selectedCat);

      // 1. Save to Firestore
      await addDoc(collection(db, "prayer_requests"), {
        uid:         currentUser.uid,
        name:        form.isAnonymous ? "Anonymous" : (currentUser.displayName || "Member"),
        email:       form.isAnonymous ? "" : currentUser.email,
        category:    cat?.label || "Other",
        categoryId:  selectedCat,
        request:     form.request.trim(),
        isAnonymous: form.isAnonymous,
        urgent:      form.urgent,
        status:      "pending", // pending | praying | answered
        createdAt:   serverTimestamp(),
      });

      // 2. Send email to prayer team
      await sendPrayerEmail({
        name:        currentUser.displayName || "Member",
        email:       currentUser.email,
        category:    cat?.label || "Other",
        request:     form.request.trim(),
        isAnonymous: form.isAnonymous,
      });

      // 3. Log activity
// 3. Log activity
await logActivity(currentUser.uid, "prayer_request", `Submitted a ${cat?.label || "prayer"} request`);

// 4. WhatsApp notification to prayer team
const WHATSAPP_NUMBER = "2347036100912"; // ← replace with real number, no + sign
const waMsg = encodeURIComponent(
  `🙏 *New Prayer Request — Zoe School*\n\n` +
  `*Category:* ${cat?.label || "Other"}\n` +
  `*From:* ${form.isAnonymous ? "Anonymous" : (currentUser.displayName || "Member")}\n` +
  `*Urgent:* ${form.urgent ? "⚡ YES" : "No"}\n\n` +
  `*Request:*\n${form.request.trim()}\n\n` +
  `_Via zoeschool.com_`
);
window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`, "_blank");

setStep(3);

} catch (error) {
  console.error("Prayer request error:", error);
  setError(error.message || "Failed to submit prayer request.");
} finally {
  setLoading(false);
}
};

  const reset = () => {
    setStep(1); setSelectedCat(null);
    setForm({ request: "", isAnonymous: false, urgent: false });
    setError("");
  };

  const formatDate = (ts) => {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-NG", { day:"numeric", month:"short", year:"numeric" });
  };

  const STATUS_LABELS = {
  awaiting_prayer: "⏳ Awaiting Prayer",
  intercession: "🙏 In Intercession",
  testimony: "📖 Testimony Shared",
};

  return (
    <>
      <style>{`
        @keyframes pr-fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pr-shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pr-pulse    { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:0.7} }
        @keyframes pr-glow     { 0%,100%{box-shadow:0 0 20px rgba(147,51,234,0.3)} 50%{box-shadow:0 0 50px rgba(147,51,234,0.6)} }
        @keyframes pr-float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

        .pr-page { animation: pr-fadeUp 0.6s ease forwards; }

        .pr-gold {
          background: linear-gradient(135deg,#C88600 0%,#F5A800 35%,#FFD166 55%,#C88600 100%);
          background-size: 200% auto; -webkit-background-clip:text;
          -webkit-text-fill-color:transparent; background-clip:text;
          animation: pr-shimmer 4s linear infinite;
        }

        .pr-eyebrow { display:flex; align-items:center; gap:10px; font-family:'Rajdhani',sans-serif; font-size:11px; letter-spacing:5px; text-transform:uppercase; color:#9333EA; margin-bottom:16px; }
        .pr-eyebrow-line { width:24px; height:1px; background:#9333EA; display:inline-block; }

        /* Category cards */
        .pr-cat-card {
          padding: 20px 18px; border-radius:4px; cursor:pointer;
          border: 1px solid rgba(255,255,255,0.07);
          background: #0a0a0a;
          transition: all 0.3s; text-align:center;
          position: relative; overflow: hidden;
        }
        .pr-cat-card:hover { transform:translateY(-5px); }
        .pr-cat-card.selected { border-width:2px; transform:translateY(-5px); }

        /* Form */
        .pr-textarea {
          width:100%; min-height:160px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(147,51,234,0.2);
          border-radius:4px; padding:16px;
          color:#fff; font-family:'Cormorant Garamond',serif;
          font-size:16px; line-height:1.7; outline:none;
          resize:vertical; transition:border-color 0.3s;
          box-sizing:border-box;
        }
        .pr-textarea:focus { border-color:#9333EA; box-shadow:0 0 20px rgba(147,51,234,0.1); }
        .pr-textarea::placeholder { color:rgba(255,255,255,0.2); font-style:italic; }

        /* Checkbox */
        .pr-check-row {
          display:flex; align-items:center; gap:12px;
          padding:14px 16px; border-radius:4px;
          border:1px solid rgba(255,255,255,0.06);
          background:rgba(255,255,255,0.02);
          cursor:pointer; transition:all 0.2s;
        }
        .pr-check-row:hover { border-color:rgba(147,51,234,0.3); background:rgba(147,51,234,0.04); }
        .pr-checkbox {
          width:18px; height:18px; border-radius:3px;
          border:2px solid rgba(255,255,255,0.2);
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0; transition:all 0.2s;
        }
        .pr-checkbox.checked { background:#9333EA; border-color:#9333EA; }

        /* Submit btn */
        .pr-submit-btn {
          width:100%; padding:16px;
          background:linear-gradient(135deg,#6B21A8,#9333EA,#a855f7);
          background-size:200% auto;
          color:#fff; font-family:'Cinzel',serif;
          font-size:13px; letter-spacing:3px;
          text-transform:uppercase; font-weight:700;
          border:none; border-radius:2px; cursor:pointer;
          transition:all 0.4s; display:flex;
          align-items:center; justify-content:center; gap:10px;
        }
        .pr-submit-btn:hover:not(:disabled) {
          background-position:right center;
          box-shadow:0 8px 30px rgba(147,51,234,0.5);
          transform:translateY(-2px);
        }
        .pr-submit-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }

        /* Tabs */
        .pr-tab {
          flex:1; padding:13px;
          font-family:'Rajdhani',sans-serif; font-size:12px;
          letter-spacing:3px; text-transform:uppercase; font-weight:700;
          background:transparent; border:none; cursor:pointer;
          color:rgba(255,255,255,0.3); border-bottom:2px solid transparent;
          transition:all 0.3s;
        }
        .pr-tab.active { color:#9333EA; border-bottom-color:#9333EA; }
        .pr-tab:hover:not(.active) { color:rgba(255,255,255,0.6); }

        /* Request card */
        .pr-req-card {
          background:#0a0a0a; border:1px solid rgba(255,255,255,0.06);
          border-radius:4px; padding:20px;
          transition:border-color 0.3s;
        }
        .pr-req-card:hover { border-color:rgba(147,51,234,0.2); }

        /* Testimony card */
        .pr-test-card {
          background:#0a0a0a; border-left:3px solid #9333EA;
          padding:24px; border-radius:0 4px 4px 0;
          transition:all 0.3s; position:relative;
        }
        .pr-test-card:hover { background:#0f0f0f; box-shadow:0 8px 30px rgba(0,0,0,0.4); }

        /* Status badge */
        .pr-status {
          display:inline-block; font-family:'Rajdhani',sans-serif;
          font-size:9px; letter-spacing:3px; text-transform:uppercase;
          font-weight:700; padding:3px 10px; border-radius:2px;
        }

        /* Spinner */
        @keyframes pr-spin { to{transform:rotate(360deg)} }
        .pr-spinner { width:20px; height:20px; border-radius:50%; border:2px solid rgba(255,255,255,0.2); border-top-color:#fff; animation:pr-spin 0.7s linear infinite; }

        /* Steps */
        .pr-step-dot {
          width:32px; height:32px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font-family:'Cinzel',serif; font-size:12px; font-weight:700;
          transition:all 0.3s;
        }
        .pr-step-line { flex:1; height:1px; background:rgba(255,255,255,0.1); }

        /* Not logged in */
        .pr-login-box {
          background: linear-gradient(135deg,#0a0014,#000);
          border:1px solid rgba(147,51,234,0.2);
          border-radius:8px; padding:56px 40px;
          text-align:center; animation:pr-glow 3s ease-in-out infinite;
        }
      `}</style>

      <div className="pr-page" style={{ background:"#000", minHeight:"100vh", paddingTop:topOffset, paddingBottom:isMobile?80:60 }}>

        {/* ── HERO ── */}
        <section style={{
          padding:`${isMobile?48:80}px ${sidePad}px ${isMobile?40:64}px`,
          background:"radial-gradient(ellipse 60% 50% at 30% 50%, #0d0014 0%, #000 70%)",
          borderBottom:"1px solid rgba(147,51,234,0.1)",
          position:"relative", overflow:"hidden",
        }}>
          {/* Animated orbs */}
          <div style={{ position:"absolute", top:"-10%", right:"8%", width:380, height:380, borderRadius:"50%", background:"radial-gradient(circle,rgba(147,51,234,0.18) 0%,transparent 70%)", pointerEvents:"none", animation:"pr-float 8s ease-in-out infinite" }} />
          <div style={{ position:"absolute", bottom:"-20%", left:"5%", width:240, height:240, borderRadius:"50%", background:"radial-gradient(circle,rgba(245,168,0,0.08) 0%,transparent 70%)", pointerEvents:"none", animation:"pr-float 10s ease-in-out infinite 2s" }} />
          <div style={{ position:"absolute", inset:0, opacity:0.03, backgroundImage:"linear-gradient(rgba(147,51,234,1) 1px,transparent 1px),linear-gradient(90deg,rgba(147,51,234,1) 1px,transparent 1px)", backgroundSize:"48px 48px", pointerEvents:"none" }} />

          <div style={{ position:"relative", zIndex:1 }}>
            <div className="pr-eyebrow"><span className="pr-eyebrow-line" />Prayer Ministry</div>
            <h1 style={{ fontFamily:"Cinzel,serif", fontWeight:900, fontSize:isMobile?34:isTablet?48:66, lineHeight:1.0, marginBottom:20, letterSpacing:"-2px" }}>
              <span className="pr-gold">Need</span><br />
              <span style={{ color:"#fff" }}>Prayer?</span><br />
              <span style={{ color:"transparent", WebkitTextStroke:"2px rgba(147,51,234,0.35)" }}>We're Here.</span>
            </h1>
            <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:isMobile?17:21, fontWeight:300, fontStyle:"italic", color:"rgba(255,255,255,0.6)", maxWidth:540, lineHeight:1.8, marginBottom:36 }}>
              You don't have to carry this alone. Our dedicated prayer team intercedes for every request submitted — personally, persistently, and with faith.
            </p>

            {/* Stats */}
            <div style={{ display:"flex", gap:isMobile?24:52, flexWrap:"wrap" }}>
              {[
                { num:"24/7",  label:"Prayer Coverage" },
                { num:"100%",  label:"Confidential"    },
                { num:"∞",     label:"God's Power"     },
              ].map((s,i) => (
                <div key={i} style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"Cinzel,serif", fontWeight:900, fontSize:isMobile?24:32, color:"#9333EA", lineHeight:1, marginBottom:4, textShadow:"0 0 20px rgba(147,51,234,0.5)" }}>{s.num}</div>
                  <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:9, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,0.3)", fontWeight:600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MAIN CONTENT ── */}
        <section style={{ padding:`${isMobile?40:64}px ${sidePad}px` }}>

          {/* ── TABS ── */}
          <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.07)", marginBottom:40 }}>
            <button className={`pr-tab ${activeTab==="submit"?"active":""}`} onClick={()=>setActiveTab("submit")}>Submit Request</button>
            <button className={`pr-tab ${activeTab==="mine"?"active":""}`} onClick={()=>setActiveTab("mine")}>My Requests</button>
            <button
  className={`pr-tab ${activeTab==="resources"?"active":""}`}
  onClick={()=>setActiveTab("resources")}
>
  Prayer Resources
</button>
          </div>

          {/* ════ TAB 1: SUBMIT ════ */}
          {activeTab === "submit" && (
            <div>
              {/* NOT LOGGED IN */}
              {!currentUser ? (
                <div style={{ maxWidth:560, margin:"0 auto" }}>
                  <div className="pr-login-box">
                    <div style={{ fontSize:56, marginBottom:20, animation:"pr-pulse 2s ease-in-out infinite" }}>🙏</div>
                    <h2 style={{ fontFamily:"Cinzel,serif", fontSize:isMobile?22:28, fontWeight:700, color:"#fff", marginBottom:12 }}>
                      Sign In to Submit a Request
                    </h2>
                    <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:17, fontStyle:"italic", color:"rgba(255,255,255,0.5)", lineHeight:1.8, marginBottom:32, maxWidth:380, margin:"0 auto 32px" }}>
                      We require a free account so our prayer team can follow up with you and you can track the status of your requests.
                    </p>
                    <button
                      onClick={() => onNavigate?.("auth")}
                      style={{ fontFamily:"Cinzel,serif", fontSize:12, letterSpacing:3, textTransform:"uppercase", fontWeight:700, color:"#fff", background:"linear-gradient(135deg,#6B21A8,#9333EA)", border:"none", padding:"15px 44px", borderRadius:2, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:10, transition:"all 0.3s" }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                      Sign In / Create Account
                    </button>
                    <div style={{ marginTop:20, fontFamily:"Rajdhani,sans-serif", fontSize:11, letterSpacing:1, color:"rgba(255,255,255,0.2)" }}>
                      Free · Secure · Confidential
                    </div>
                  </div>
                </div>

              ) : step === 3 ? (
                /* ── SUCCESS STATE ── */
                <div style={{ maxWidth:560, margin:"0 auto", textAlign:"center", padding:"40px 20px" }}>
                  <div style={{ width:88, height:88, borderRadius:"50%", background:"linear-gradient(135deg,#6B21A8,#9333EA)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 28px", fontSize:36, boxShadow:"0 0 50px rgba(147,51,234,0.5)", animation:"pr-glow 2s ease-in-out infinite" }}>🙏</div>
                  <h2 style={{ fontFamily:"Cinzel,serif", fontSize:isMobile?24:32, fontWeight:700, color:"#fff", marginBottom:14 }}>
                    Your Request Has Been Received
                  </h2>
                  <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:18, fontStyle:"italic", color:"rgba(255,255,255,0.55)", lineHeight:1.8, maxWidth:420, margin:"0 auto 16px" }}>
                    Our prayer team has been notified and will begin interceding for you immediately. You are not alone.
                  </p>
                  <div style={{ background:"rgba(147,51,234,0.08)", border:"1px solid rgba(147,51,234,0.2)", borderRadius:4, padding:"16px 24px", fontFamily:"Cormorant Garamond,serif", fontSize:16, fontStyle:"italic", color:"rgba(255,255,255,0.6)", marginBottom:32, maxWidth:400, margin:"0 auto 32px" }}>
                    "The effective, fervent prayer of a righteous man avails much." — James 5:16
                  </div>
                  <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
                    <button onClick={reset} style={{ fontFamily:"Rajdhani,sans-serif", fontSize:11, letterSpacing:3, textTransform:"uppercase", fontWeight:700, color:"#fff", background:"linear-gradient(135deg,#6B21A8,#9333EA)", border:"none", padding:"13px 32px", borderRadius:2, cursor:"pointer" }}>
                      Submit Another Request
                    </button>
                    <button onClick={()=>setActiveTab("mine")} style={{ fontFamily:"Rajdhani,sans-serif", fontSize:11, letterSpacing:3, textTransform:"uppercase", fontWeight:700, color:"rgba(255,255,255,0.6)", background:"transparent", border:"1px solid rgba(255,255,255,0.15)", padding:"13px 32px", borderRadius:2, cursor:"pointer" }}>
                      View My Requests
                    </button>
                  </div>
                </div>

              ) : (
                /* ── FORM STEPS ── */
                <div style={{ maxWidth:680, margin:"0 auto" }}>

                  {/* Step indicator */}
                  <div style={{ display:"flex", alignItems:"center", marginBottom:40 }}>
                    {[
                      { n:1, label:"Choose Category" },
                      { n:2, label:"Write Request"   },
                    ].map((s,i) => (
                      <>
                        <div key={s.n} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                          <div className="pr-step-dot" style={{
                            background: step>=s.n ? "linear-gradient(135deg,#6B21A8,#9333EA)" : "rgba(255,255,255,0.06)",
                            color: step>=s.n ? "#fff" : "rgba(255,255,255,0.3)",
                            border: step>=s.n ? "none" : "1px solid rgba(255,255,255,0.1)",
                            boxShadow: step===s.n ? "0 0 20px rgba(147,51,234,0.5)" : "none",
                          }}>
                            {step>s.n ? "✓" : s.n}
                          </div>
                          {!isMobile && <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:9, letterSpacing:2, textTransform:"uppercase", color:step>=s.n?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.2)", whiteSpace:"nowrap" }}>{s.label}</div>}
                        </div>
                        {i === 0 && <div className="pr-step-line" style={{ background:step>1?"rgba(147,51,234,0.4)":"rgba(255,255,255,0.08)" }} />}
                      </>
                    ))}
                  </div>

                  {/* STEP 1 — Category */}
                  {step === 1 && (
                    <div style={{ animation:"pr-fadeUp 0.4s ease forwards" }}>
                      <h2 style={{ fontFamily:"Cinzel,serif", fontSize:isMobile?22:28, fontWeight:700, color:"#fff", marginBottom:8 }}>What do you need prayer for?</h2>
                      <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:16, fontStyle:"italic", color:"rgba(255,255,255,0.4)", marginBottom:32 }}>
                        Select the category that best describes your need.
                      </p>
                      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:12 }}>
                        {CATEGORIES.map(cat => (
                          <div key={cat.id} className={`pr-cat-card ${selectedCat===cat.id?"selected":""}`}
                            style={{
                              borderColor: selectedCat===cat.id ? cat.color : "rgba(255,255,255,0.07)",
                              boxShadow: selectedCat===cat.id ? `0 0 24px ${cat.color}44` : "none",
                              background: selectedCat===cat.id ? `${cat.color}12` : "#0a0a0a",
                            }}
                            onClick={() => setSelectedCat(cat.id)}>
                            <div style={{ fontSize:28, marginBottom:10 }}>{cat.icon}</div>
                            <div style={{ fontFamily:"Cinzel,serif", fontSize:13, fontWeight:700, color: selectedCat===cat.id ? cat.color : "#fff", marginBottom:4 }}>{cat.label}</div>
                            {!isMobile && <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:10, color:"rgba(255,255,255,0.35)", lineHeight:1.5 }}>{cat.desc}</div>}
                          </div>
                        ))}
                      </div>
                      <button
                        style={{ marginTop:32, fontFamily:"Cinzel,serif", fontSize:12, letterSpacing:3, textTransform:"uppercase", fontWeight:700, color:"#fff", background:selectedCat?"linear-gradient(135deg,#6B21A8,#9333EA)":"rgba(255,255,255,0.06)", border:"none", padding:"15px 40px", borderRadius:2, cursor:selectedCat?"pointer":"not-allowed", opacity:selectedCat?1:0.4, transition:"all 0.3s" }}
                        onClick={() => selectedCat && setStep(2)}>
                        Continue →
                      </button>
                    </div>
                  )}

                  {/* STEP 2 — Write request */}
                  {step === 2 && (
                    <div style={{ animation:"pr-fadeUp 0.4s ease forwards" }}>
                      {/* Selected category badge */}
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
                        <button onClick={()=>setStep(1)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)", width:32, height:32, borderRadius:"50%", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>
                        <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:10, letterSpacing:3, textTransform:"uppercase", color:CATEGORIES.find(c=>c.id===selectedCat)?.color, background:`${CATEGORIES.find(c=>c.id===selectedCat)?.color}18`, padding:"5px 14px", borderRadius:2, fontWeight:700 }}>
                          {CATEGORIES.find(c=>c.id===selectedCat)?.icon} {CATEGORIES.find(c=>c.id===selectedCat)?.label}
                        </div>
                      </div>

                      <h2 style={{ fontFamily:"Cinzel,serif", fontSize:isMobile?22:28, fontWeight:700, color:"#fff", marginBottom:8 }}>Share your prayer request</h2>
                      <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:16, fontStyle:"italic", color:"rgba(255,255,255,0.4)", marginBottom:24 }}>
                        Be as specific as you feel comfortable sharing. Everything is kept confidential.
                      </p>

                      <textarea
                        ref={textRef}
                        className="pr-textarea"
                        name="request"
                        value={form.request}
                        onChange={handle}
                        placeholder="Lord, I need prayer for... (Please share what's on your heart)"
                      />
                      <div style={{ textAlign:"right", fontFamily:"Rajdhani,sans-serif", fontSize:10, letterSpacing:1, color:"rgba(255,255,255,0.2)", marginTop:6 }}>
                        {form.request.length} characters
                      </div>

                      {/* Options */}
                      <div style={{ display:"flex", flexDirection:"column", gap:10, margin:"20px 0 24px" }}>
                        {[
                          { key:"isAnonymous", label:"Submit anonymously", sub:"Your name won't be shared with the prayer team", icon:"🕊" },
                          { key:"urgent",      label:"Mark as urgent",     sub:"I need prayer as soon as possible",              icon:"⚡" },
                        ].map(opt => (
                          <div key={opt.key} className="pr-check-row" onClick={()=>setForm(f=>({...f,[opt.key]:!f[opt.key]}))}>
                            <div className={`pr-checkbox ${form[opt.key]?"checked":""}`}>
                              {form[opt.key] && <svg width="10" height="10" fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>}
                            </div>
                            <div style={{ fontSize:18 }}>{opt.icon}</div>
                            <div style={{ flex:1 }}>
                              <div style={{ fontFamily:"Cinzel,serif", fontSize:13, fontWeight:600, color:"#fff" }}>{opt.label}</div>
                              <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:11, color:"rgba(255,255,255,0.35)", letterSpacing:0.5 }}>{opt.sub}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {error && (
                        <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:4, padding:"12px 16px", fontFamily:"Rajdhani,sans-serif", fontSize:13, color:"#ef4444", marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
                          ⚠ {error}
                        </div>
                      )}

                      <button className="pr-submit-btn" onClick={submit} disabled={loading || !form.request.trim()}>
                        {loading ? (
                          <><div className="pr-spinner" />Submitting your request...</>
                        ) : (
                          <>🙏 Submit Prayer Request</>
                        )}
                      </button>

                      <div style={{ textAlign:"center", marginTop:14, fontFamily:"Rajdhani,sans-serif", fontSize:10, letterSpacing:2, color:"rgba(255,255,255,0.2)", textTransform:"uppercase" }}>
                        100% Confidential · Prayed Over by Real People
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ════ TAB 2: MY REQUESTS ════ */}
          {activeTab === "mine" && (
            <div style={{ maxWidth:680, margin:"0 auto" }}>
              {!currentUser ? (
                <div style={{ textAlign:"center", padding:"48px 20px" }}>
                  <div style={{ fontSize:48, marginBottom:16 }}>🔒</div>
                  <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:18, fontStyle:"italic", color:"rgba(255,255,255,0.4)" }}>Sign in to view your prayer requests.</p>
                  <button onClick={()=>onNavigate?.("auth")} style={{ marginTop:20, fontFamily:"Rajdhani,sans-serif", fontSize:11, letterSpacing:3, textTransform:"uppercase", fontWeight:700, color:"#fff", background:"linear-gradient(135deg,#6B21A8,#9333EA)", border:"none", padding:"13px 32px", borderRadius:2, cursor:"pointer" }}>Sign In</button>
                </div>
              ) : myRequests.length === 0 ? (
                <div style={{ textAlign:"center", padding:"48px 20px" }}>
                  <div style={{ fontSize:48, marginBottom:16 }}>📋</div>
                  <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:18, fontStyle:"italic", color:"rgba(255,255,255,0.4)", marginBottom:24 }}>You haven't submitted any prayer requests yet.</p>
                  <button onClick={()=>setActiveTab("submit")} style={{ fontFamily:"Rajdhani,sans-serif", fontSize:11, letterSpacing:3, textTransform:"uppercase", fontWeight:700, color:"#fff", background:"linear-gradient(135deg,#6B21A8,#9333EA)", border:"none", padding:"13px 32px", borderRadius:2, cursor:"pointer" }}>Submit Your First Request</button>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:12, letterSpacing:2, color:"rgba(255,255,255,0.3)", marginBottom:8 }}>
                    {myRequests.length} prayer request{myRequests.length!==1?"s":""} submitted
                  </div>
                  {myRequests.map((req,i) => {
                    const cat = CATEGORIES.find(c=>c.label===req.category);
                    const statusMap = { pending:{label:"Pending",color:"#F5A800"}, praying:{label:"Being Prayed For",color:"#9333EA"}, answered:{label:"Answered! 🙌",color:"#22c55e"} };
                    const status = statusMap[req.status] || statusMap.pending;
                    return (
                      <div key={req.id} className="pr-req-card" style={{ borderLeftColor:cat?.color||"#9333EA", borderLeftWidth:3 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, flexWrap:"wrap", gap:8 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <span style={{ fontSize:18 }}>{cat?.icon||"🙏"}</span>
                            <span style={{ fontFamily:"Cinzel,serif", fontSize:14, fontWeight:700, color:cat?.color||"#9333EA" }}>{req.category}</span>
                            {req.urgent && <span style={{ background:"rgba(239,68,68,0.15)", color:"#ef4444", fontFamily:"Rajdhani,sans-serif", fontSize:9, letterSpacing:2, fontWeight:700, padding:"2px 8px", borderRadius:2 }}>URGENT</span>}
                            {req.isAnonymous && <span style={{ background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.3)", fontFamily:"Rajdhani,sans-serif", fontSize:9, letterSpacing:2, fontWeight:700, padding:"2px 8px", borderRadius:2 }}>ANONYMOUS</span>}
                          </div>
                          <div className="pr-status" style={{ background:`${status.color}18`, color:status.color }}>{status.label}</div>
                        </div>
                        <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:15, fontWeight:300, color:"rgba(255,255,255,0.6)", lineHeight:1.7, marginBottom:10 }}>{req.request}</p>
                        <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:10, color:"rgba(255,255,255,0.25)", letterSpacing:1 }}>
                          Submitted {formatDate(req.createdAt)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ════ TAB 3: TESTIMONIES ════ */}
          {activeTab === "resources" && (
  <div style={{ maxWidth: 800, margin: "0 auto" }}>
    
    <div style={{ marginBottom: 40 }}>
      <div className="pr-eyebrow">
        <span className="pr-eyebrow-line" />
        Grow in Prayer
      </div>

      <h2
        style={{
          fontFamily: "Cinzel,serif",
          fontSize: isMobile ? 24 : 36,
          fontWeight: 700,
          color: "#fff",
          marginBottom: 12,
        }}
      >
        Prayer Resources
      </h2>

      <p
        style={{
          fontFamily: "Cormorant Garamond,serif",
          fontSize: 18,
          fontStyle: "italic",
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.8,
        }}
      >
        Strengthen your prayer life with scripture,
        guidance, and encouragement.
      </p>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)",
        gap: 20,
      }}
    >
      {[
        {
          icon: "📖",
          title: "Scriptures on Prayer",
          text: "Powerful Bible verses to pray and meditate on daily.",
        },
        {
          icon: "🙏",
          title: "How to Pray",
          text: "Simple guidance for building a consistent prayer life.",
        },
        {
          icon: "✨",
          title: "Faith Declarations",
          text: "Biblical declarations to speak over your life.",
        },
        {
          icon: "🕊️",
          title: "Prayer for Every Situation",
          text: "Healing, family, finances, guidance and more.",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="pr-req-card"
          style={{ padding: 24 }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>
            {item.icon}
          </div>

          <h3
            style={{
              fontFamily: "Cinzel,serif",
              color: "#fff",
              marginBottom: 10,
            }}
          >
            {item.title}
          </h3>

          <p
            style={{
              fontFamily: "Cormorant Garamond,serif",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.7,
            }}
          >
            {item.text}
          </p>
        </div>
      ))}
    </div>

    {/*  */}
    >
      {/* <h3
        style={{
          fontFamily: "Cinzel,serif",
          color: "#fff",
          marginBottom: 10,
        }}
      >
        Prayer of the Week
      </h3>

      <p
        style={{
          fontFamily: "Cormorant Garamond,serif",
          fontSize: 18,
          fontStyle: "italic",
          color: "rgba(255,2<div
      style={{
        marginTop: 40,
        padding: 30,
        background: "rgba(147,51,234,0.08)",
        border: "1px solid rgba(147,51,234,0.2)",
        borderRadius: 4,
        textAlign: "center",
      }}55,255,0.75)",
          lineHeight: 1.8,
        }}
      >
        Father, strengthen our faith, guide our steps,
        and help us trust You completely in every season.
        In Jesus' name, Amen.
      </p> */}
    {/* </div> */}
  </div>
)}
        </section>

        {/* ── PROMISE BANNER ── */}
        <section style={{ padding:`${isMobile?48:64}px ${sidePad}px`, background:"linear-gradient(135deg,#0d0014,#000)", borderTop:"1px solid rgba(147,51,234,0.1)", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(147,51,234,0.07) 0%,transparent 70%)", pointerEvents:"none" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ fontSize:48, marginBottom:20 }}>🕊️</div>
            <blockquote style={{ fontFamily:"Cormorant Garamond,serif", fontSize:isMobile?20:28, fontStyle:"italic", fontWeight:400, color:"rgba(255,255,255,0.85)", maxWidth:600, margin:"0 auto 12px", lineHeight:1.6 }}>
              "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."
            </blockquote>
            <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:12, letterSpacing:4, color:"#9333EA", textTransform:"uppercase" }}>
              Philippians 4:6
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
