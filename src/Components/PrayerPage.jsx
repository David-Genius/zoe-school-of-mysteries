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
          to_email:       PRAYER_TEAM_EMAIL,
          from_name:      isAnonymous ? "Anonymous" : name,
          from_email:     email,
          category,
          prayer_request: request,
          submitted_at:   new Date().toLocaleString("en-NG"),
        },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const CATEGORIES = [
  { id: "healing",      label: "Healing",     icon: "🙏", color: "#22c55e", desc: "Physical, emotional or mental healing"  },
  { id: "family",       label: "Family",       icon: "👨‍👩‍👧", color: "#F5A800", desc: "Marriage, children, relationships"     },
  { id: "breakthrough", label: "Breakthrough", icon: "⚡", color: "#9333EA", desc: "Doors, opportunities, divine favor"     },
  { id: "salvation",    label: "Salvation",    icon: "✝️", color: "#ef4444", desc: "For yourself or a loved one"           },
  { id: "finances",     label: "Finances",     icon: "💰", color: "#f97316", desc: "Provision, debt freedom, abundance"    },
  { id: "guidance",     label: "Guidance",     icon: "🧭", color: "#06b6d4", desc: "Direction, decisions, career, purpose" },
  { id: "protection",   label: "Protection",   icon: "🛡", color: "#6366f1", desc: "Spiritual warfare, safety, peace"      },
  { id: "other",        label: "Other",        icon: "💬", color: "#ec4899", desc: "Any other prayer need"                 },
];

export default function PrayerPage({ user, onNavigate }) {
  const width    = useWidth();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const sidePad  = isMobile ? 20 : isTablet ? 32 : 64;
  const topOffset = isMobile ? 130 : 76;

  const [currentUser, setCurrentUser] = useState(user || null);
  const [step,        setStep]        = useState(1); // 1=category, 2=form, 3=success
  const [selectedCat, setSelectedCat] = useState(null);
  const [form,        setForm]        = useState({ request: "", isAnonymous: false, urgent: false });
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [myRequests,  setMyRequests]  = useState([]);
  const [activeTab,   setActiveTab]   = useState("submit"); // submit | mine | resources
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
        status:      "pending",
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
      await logActivity(currentUser.uid, "prayer_request", `Submitted a ${cat?.label || "prayer"} request`);

      // 4. WhatsApp notification to prayer team
      const WHATSAPP_NUMBER = "2347036100912";
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
    return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <>
      <style>{`
        @keyframes pr-fadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pr-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pr-pulse   { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:0.7} }
        @keyframes pr-glow    { 0%,100%{box-shadow:0 0 20px rgba(147,51,234,0.3)} 50%{box-shadow:0 0 50px rgba(147,51,234,0.6)} }
        @keyframes pr-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pr-spin    { to{transform:rotate(360deg)} }

        .pr-page { animation: pr-fadeUp 0.6s ease forwards; }

        .pr-gold {
          background: linear-gradient(135deg,#C88600 0%,#F5A800 35%,#FFD166 55%,#C88600 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: pr-shimmer 4s linear infinite;
        }

        /* ── EYEBROW ── */
        .pr-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: #9333EA;
          margin-bottom: 16px;
        }
        .pr-eyebrow-line { width: 24px; height: 1px; background: #9333EA; display: inline-block; }

        /* ── CATEGORY CARDS ── */
        .pr-cat-card {
          padding: 22px 18px;
          border-radius: 4px;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.07);
          background: #0a0a0a;
          transition: all 0.3s;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .pr-cat-card:hover { transform: translateY(-5px); }
        .pr-cat-card.selected { border-width: 2px; transform: translateY(-5px); }

        /* ── TEXTAREA ── */
        .pr-textarea {
          width: 100%;
          min-height: 180px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(147,51,234,0.2);
          border-radius: 4px;
          padding: 18px;
          color: #fff;
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          line-height: 1.8;
          outline: none;
          resize: vertical;
          transition: border-color 0.3s;
          box-sizing: border-box;
        }
        .pr-textarea:focus {
          border-color: #9333EA;
          box-shadow: 0 0 20px rgba(147,51,234,0.1);
        }
        .pr-textarea::placeholder {
          color: rgba(255,255,255,0.25);
          font-style: italic;
        }

        /* ── CHECKBOX ROWS ── */
        .pr-check-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          transition: all 0.2s;
        }
        .pr-check-row:hover {
          border-color: rgba(147,51,234,0.3);
          background: rgba(147,51,234,0.04);
        }
        .pr-checkbox {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          border: 2px solid rgba(255,255,255,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .pr-checkbox.checked { background: #9333EA; border-color: #9333EA; }

        /* ── SUBMIT BUTTON ── */
        .pr-submit-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg,#6B21A8,#9333EA,#a855f7);
          background-size: 200% auto;
          color: #fff;
          font-family: 'Cinzel', serif;
          font-size: 15px;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-weight: 700;
          border: none;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.4s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .pr-submit-btn:hover:not(:disabled) {
          background-position: right center;
          box-shadow: 0 8px 30px rgba(147,51,234,0.5);
          transform: translateY(-2px);
        }
        .pr-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        /* ── TABS ── */
        .pr-tab {
          flex: 1;
          padding: 15px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 14px;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-weight: 700;
          background: transparent;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.35);
          border-bottom: 2px solid transparent;
          transition: all 0.3s;
        }
        .pr-tab.active { color: #9333EA; border-bottom-color: #9333EA; }
        .pr-tab:hover:not(.active) { color: rgba(255,255,255,0.65); }

        /* ── REQUEST CARD ── */
        .pr-req-card {
          background: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 4px;
          padding: 22px;
          transition: border-color 0.3s;
        }
        .pr-req-card:hover { border-color: rgba(147,51,234,0.2); }

        /* ── STATUS BADGE ── */
        .pr-status {
          display: inline-block;
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 2px;
        }

        /* ── SPINNER ── */
        .pr-spinner {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: #fff;
          animation: pr-spin 0.7s linear infinite;
        }

        /* ── STEP DOTS ── */
        .pr-step-dot {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cinzel', serif;
          font-size: 14px;
          font-weight: 700;
          transition: all 0.3s;
        }
        .pr-step-line { flex: 1; height: 1px; background: rgba(255,255,255,0.1); }

        /* ── NOT LOGGED IN BOX ── */
        .pr-login-box {
          background: linear-gradient(135deg,#0a0014,#000);
          border: 1px solid rgba(147,51,234,0.2);
          border-radius: 8px;
          padding: 56px 40px;
          text-align: center;
          animation: pr-glow 3s ease-in-out infinite;
        }
      `}</style>

      <div className="pr-page" style={{ background: "#000", minHeight: "100vh", paddingTop: topOffset, paddingBottom: isMobile ? 80 : 60 }}>

        {/* ── HERO ── */}
        <section style={{
          padding: `${isMobile ? 48 : 80}px ${sidePad}px ${isMobile ? 40 : 64}px`,
          background: "radial-gradient(ellipse 60% 50% at 30% 50%, #0d0014 0%, #000 70%)",
          borderBottom: "1px solid rgba(147,51,234,0.1)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Animated orbs */}
          <div style={{ position: "absolute", top: "-10%", right: "8%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(147,51,234,0.18) 0%,transparent 70%)", pointerEvents: "none", animation: "pr-float 8s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "-20%", left: "5%", width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle,rgba(245,168,0,0.08) 0%,transparent 70%)", pointerEvents: "none", animation: "pr-float 10s ease-in-out infinite 2s" }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "linear-gradient(rgba(147,51,234,1) 1px,transparent 1px),linear-gradient(90deg,rgba(147,51,234,1) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="pr-eyebrow">
              <span className="pr-eyebrow-line" />Prayer Ministry
            </div>

            <h1 style={{
              fontFamily: "Cinzel,serif",
              fontWeight: 900,
              fontSize: isMobile ? 34 : isTablet ? 48 : 66,
              lineHeight: 1.0,
              marginBottom: 20,
              letterSpacing: "-2px",
            }}>
              <span className="pr-gold">Need</span><br />
              <span style={{ color: "#fff" }}>Prayer?</span><br />
              <span style={{ color: "transparent", WebkitTextStroke: "2px rgba(147,51,234,0.35)" }}>We're Here.</span>
            </h1>

            <p style={{
              fontFamily: "Cormorant Garamond,serif",
              fontSize: isMobile ? 18 : 22,
              fontWeight: 300,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.65)",
              maxWidth: 540,
              lineHeight: 1.8,
              marginBottom: 36,
            }}>
              You don't have to carry this alone. Our dedicated prayer team intercedes for every request submitted — personally, persistently, and with faith.
            </p>

            {/* Stats */}
            <div style={{ display: "flex", gap: isMobile ? 24 : 52, flexWrap: "wrap" }}>
              {[
                { num: "24/7", label: "Prayer Coverage" },
                { num: "100%", label: "Confidential"    },
                { num: "∞",    label: "God's Power"     },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Cinzel,serif", fontWeight: 900, fontSize: isMobile ? 26 : 34, color: "#9333EA", lineHeight: 1, marginBottom: 6, textShadow: "0 0 20px rgba(147,51,234,0.5)" }}>
                    {s.num}
                  </div>
                  <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.38)", fontWeight: 600 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MAIN CONTENT ── */}
        <section style={{ padding: `${isMobile ? 40 : 64}px ${sidePad}px` }}>

          {/* ── TABS ── */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 40 }}>
            <button className={`pr-tab ${activeTab === "submit"    ? "active" : ""}`} onClick={() => setActiveTab("submit")}>Submit Request</button>
            <button className={`pr-tab ${activeTab === "mine"      ? "active" : ""}`} onClick={() => setActiveTab("mine")}>My Requests</button>
            <button className={`pr-tab ${activeTab === "resources" ? "active" : ""}`} onClick={() => setActiveTab("resources")}>Prayer Resources</button>
          </div>

          {/* ════ TAB 1: SUBMIT ════ */}
          {activeTab === "submit" && (
            <div>

              {/* NOT LOGGED IN */}
              {!currentUser ? (
                <div style={{ maxWidth: 560, margin: "0 auto" }}>
                  <div className="pr-login-box">
                    <div style={{ fontSize: 60, marginBottom: 22, animation: "pr-pulse 2s ease-in-out infinite" }}>🙏</div>
                    <h2 style={{ fontFamily: "Cinzel,serif", fontSize: isMobile ? 22 : 30, fontWeight: 700, color: "#fff", marginBottom: 14 }}>
                      Sign In to Submit a Request
                    </h2>
                    <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 19, fontStyle: "italic", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: 32, maxWidth: 380, margin: "0 auto 32px" }}>
                      We require a free account so our prayer team can follow up with you and you can track the status of your requests.
                    </p>
                    <button
                      onClick={() => onNavigate?.("auth")}
                      style={{ fontFamily: "Cinzel,serif", fontSize: 14, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg,#6B21A8,#9333EA)", border: "none", padding: "16px 48px", borderRadius: 2, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10, transition: "all 0.3s" }}
                    >
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                      Sign In / Create Account
                    </button>
                    <div style={{ marginTop: 22, fontFamily: "Rajdhani,sans-serif", fontSize: 13, letterSpacing: 2, color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>
                      Free · Secure · Confidential
                    </div>
                  </div>
                </div>

              ) : step === 3 ? (
                /* ── SUCCESS STATE ── */
                <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ width: 92, height: 92, borderRadius: "50%", background: "linear-gradient(135deg,#6B21A8,#9333EA)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", fontSize: 38, boxShadow: "0 0 50px rgba(147,51,234,0.5)", animation: "pr-glow 2s ease-in-out infinite" }}>
                    🙏
                  </div>
                  <h2 style={{ fontFamily: "Cinzel,serif", fontSize: isMobile ? 24 : 34, fontWeight: 700, color: "#fff", marginBottom: 16 }}>
                    Your Request Has Been Received
                  </h2>
                  <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 19, fontStyle: "italic", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, maxWidth: 420, margin: "0 auto 20px" }}>
                    Our prayer team has been notified and will begin interceding for you immediately. You are not alone.
                  </p>
                  <div style={{ background: "rgba(147,51,234,0.08)", border: "1px solid rgba(147,51,234,0.2)", borderRadius: 4, padding: "18px 28px", fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontStyle: "italic", color: "rgba(255,255,255,0.65)", marginBottom: 36, maxWidth: 420, margin: "0 auto 36px" }}>
                    "The effective, fervent prayer of a righteous man avails much." — James 5:16
                  </div>
                  <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                    <button
                      onClick={reset}
                      style={{ fontFamily: "Rajdhani,sans-serif", fontSize: 14, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg,#6B21A8,#9333EA)", border: "none", padding: "14px 34px", borderRadius: 2, cursor: "pointer" }}
                    >
                      Submit Another Request
                    </button>
                    <button
                      onClick={() => setActiveTab("mine")}
                      style={{ fontFamily: "Rajdhani,sans-serif", fontSize: 14, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,0.65)", background: "transparent", border: "1px solid rgba(255,255,255,0.18)", padding: "14px 34px", borderRadius: 2, cursor: "pointer" }}
                    >
                      View My Requests
                    </button>
                  </div>
                </div>

              ) : (
                /* ── FORM STEPS ── */
                <div style={{ maxWidth: 700, margin: "0 auto" }}>

                  {/* Step indicator */}
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 44 }}>
                    {[
                      { n: 1, label: "Choose Category" },
                      { n: 2, label: "Write Request"   },
                    ].map((s, i) => (
                      <>
                        <div key={s.n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                          <div className="pr-step-dot" style={{
                            background: step >= s.n ? "linear-gradient(135deg,#6B21A8,#9333EA)" : "rgba(255,255,255,0.06)",
                            color:      step >= s.n ? "#fff" : "rgba(255,255,255,0.3)",
                            border:     step >= s.n ? "none" : "1px solid rgba(255,255,255,0.1)",
                            boxShadow:  step === s.n ? "0 0 20px rgba(147,51,234,0.5)" : "none",
                          }}>
                            {step > s.n ? "✓" : s.n}
                          </div>
                          {!isMobile && (
                            <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: step >= s.n ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.22)", whiteSpace: "nowrap" }}>
                              {s.label}
                            </div>
                          )}
                        </div>
                        {i === 0 && <div className="pr-step-line" style={{ background: step > 1 ? "rgba(147,51,234,0.4)" : "rgba(255,255,255,0.08)" }} />}
                      </>
                    ))}
                  </div>

                  {/* STEP 1 — Category */}
                  {step === 1 && (
                    <div style={{ animation: "pr-fadeUp 0.4s ease forwards" }}>
                      <h2 style={{ fontFamily: "Cinzel,serif", fontSize: isMobile ? 22 : 30, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
                        What do you need prayer for?
                      </h2>
                      <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontStyle: "italic", color: "rgba(255,255,255,0.45)", marginBottom: 32 }}>
                        Select the category that best describes your need.
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 14 }}>
                        {CATEGORIES.map(cat => (
                          <div
                            key={cat.id}
                            className={`pr-cat-card ${selectedCat === cat.id ? "selected" : ""}`}
                            style={{
                              borderColor: selectedCat === cat.id ? cat.color : "rgba(255,255,255,0.07)",
                              boxShadow:   selectedCat === cat.id ? `0 0 24px ${cat.color}44` : "none",
                              background:  selectedCat === cat.id ? `${cat.color}12` : "#0a0a0a",
                            }}
                            onClick={() => setSelectedCat(cat.id)}
                          >
                            <div style={{ fontSize: 30, marginBottom: 12 }}>{cat.icon}</div>
                            <div style={{ fontFamily: "Cinzel,serif", fontSize: 14, fontWeight: 700, color: selectedCat === cat.id ? cat.color : "#fff", marginBottom: 6 }}>
                              {cat.label}
                            </div>
                            {!isMobile && (
                              <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: 12, color: "rgba(255,255,255,0.38)", lineHeight: 1.5 }}>
                                {cat.desc}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        style={{
                          marginTop: 36,
                          fontFamily: "Cinzel,serif",
                          fontSize: 14,
                          letterSpacing: 3,
                          textTransform: "uppercase",
                          fontWeight: 700,
                          color: "#fff",
                          background: selectedCat ? "linear-gradient(135deg,#6B21A8,#9333EA)" : "rgba(255,255,255,0.06)",
                          border: "none",
                          padding: "16px 44px",
                          borderRadius: 2,
                          cursor: selectedCat ? "pointer" : "not-allowed",
                          opacity: selectedCat ? 1 : 0.4,
                          transition: "all 0.3s",
                        }}
                        onClick={() => selectedCat && setStep(2)}
                      >
                        Continue →
                      </button>
                    </div>
                  )}

                  {/* STEP 2 — Write request */}
                  {step === 2 && (
                    <div style={{ animation: "pr-fadeUp 0.4s ease forwards" }}>

                      {/* Selected category badge */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 26 }}>
                        <button
                          onClick={() => setStep(1)}
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.55)", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          ←
                        </button>
                        <div style={{
                          fontFamily: "Rajdhani,sans-serif",
                          fontSize: 13,
                          letterSpacing: 3,
                          textTransform: "uppercase",
                          color: CATEGORIES.find(c => c.id === selectedCat)?.color,
                          background: `${CATEGORIES.find(c => c.id === selectedCat)?.color}18`,
                          padding: "6px 16px",
                          borderRadius: 2,
                          fontWeight: 700,
                        }}>
                          {CATEGORIES.find(c => c.id === selectedCat)?.icon}{" "}
                          {CATEGORIES.find(c => c.id === selectedCat)?.label}
                        </div>
                      </div>

                      <h2 style={{ fontFamily: "Cinzel,serif", fontSize: isMobile ? 22 : 30, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
                        Share your prayer request
                      </h2>
                      <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontStyle: "italic", color: "rgba(255,255,255,0.45)", marginBottom: 26 }}>
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
                      <div style={{ textAlign: "right", fontFamily: "Rajdhani,sans-serif", fontSize: 13, letterSpacing: 1, color: "rgba(255,255,255,0.25)", marginTop: 8 }}>
                        {form.request.length} characters
                      </div>

                      {/* Options */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "22px 0 26px" }}>
                        {[
                          { key: "isAnonymous", label: "Submit anonymously", sub: "Your name won't be shared with the prayer team", icon: "🕊" },
                          { key: "urgent",      label: "Mark as urgent",     sub: "I need prayer as soon as possible",              icon: "⚡" },
                        ].map(opt => (
                          <div key={opt.key} className="pr-check-row" onClick={() => setForm(f => ({ ...f, [opt.key]: !f[opt.key] }))}>
                            <div className={`pr-checkbox ${form[opt.key] ? "checked" : ""}`}>
                              {form[opt.key] && (
                                <svg width="11" height="11" fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24">
                                  <path d="M20 6L9 17l-5-5"/>
                                </svg>
                              )}
                            </div>
                            <div style={{ fontSize: 20 }}>{opt.icon}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontFamily: "Cinzel,serif", fontSize: 15, fontWeight: 600, color: "#fff" }}>
                                {opt.label}
                              </div>
                              <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: 13, color: "rgba(255,255,255,0.38)", letterSpacing: 0.5, marginTop: 2 }}>
                                {opt.sub}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {error && (
                        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 4, padding: "14px 18px", fontFamily: "Rajdhani,sans-serif", fontSize: 15, color: "#ef4444", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
                          ⚠ {error}
                        </div>
                      )}

                      <button className="pr-submit-btn" onClick={submit} disabled={loading || !form.request.trim()}>
                        {loading ? (
                          <><div className="pr-spinner" /> Submitting your request...</>
                        ) : (
                          <>🙏 Submit Prayer Request</>
                        )}
                      </button>

                      <div style={{ textAlign: "center", marginTop: 16, fontFamily: "Rajdhani,sans-serif", fontSize: 13, letterSpacing: 2, color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>
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
            <div style={{ maxWidth: 700, margin: "0 auto" }}>
              {!currentUser ? (
                <div style={{ textAlign: "center", padding: "56px 20px" }}>
                  <div style={{ fontSize: 52, marginBottom: 18 }}>🔒</div>
                  <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontStyle: "italic", color: "rgba(255,255,255,0.45)" }}>
                    Sign in to view your prayer requests.
                  </p>
                  <button
                    onClick={() => onNavigate?.("auth")}
                    style={{ marginTop: 24, fontFamily: "Rajdhani,sans-serif", fontSize: 14, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg,#6B21A8,#9333EA)", border: "none", padding: "14px 34px", borderRadius: 2, cursor: "pointer" }}
                  >
                    Sign In
                  </button>
                </div>

              ) : myRequests.length === 0 ? (
                <div style={{ textAlign: "center", padding: "56px 20px" }}>
                  <div style={{ fontSize: 52, marginBottom: 18 }}>📋</div>
                  <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontStyle: "italic", color: "rgba(255,255,255,0.45)", marginBottom: 28 }}>
                    You haven't submitted any prayer requests yet.
                  </p>
                  <button
                    onClick={() => setActiveTab("submit")}
                    style={{ fontFamily: "Rajdhani,sans-serif", fontSize: 14, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg,#6B21A8,#9333EA)", border: "none", padding: "14px 34px", borderRadius: 2, cursor: "pointer" }}
                  >
                    Submit Your First Request
                  </button>
                </div>

              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: 14, letterSpacing: 2, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>
                    {myRequests.length} prayer request{myRequests.length !== 1 ? "s" : ""} submitted
                  </div>
                  {myRequests.map((req, i) => {
                    const cat = CATEGORIES.find(c => c.label === req.category);
                    const statusMap = {
                      pending:  { label: "Pending",         color: "#F5A800" },
                      praying:  { label: "Being Prayed For", color: "#9333EA" },
                      answered: { label: "Answered! 🙌",    color: "#22c55e" },
                    };
                    const status = statusMap[req.status] || statusMap.pending;
                    return (
                      <div key={req.id} className="pr-req-card" style={{ borderLeftColor: cat?.color || "#9333EA", borderLeftWidth: 3 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 20 }}>{cat?.icon || "🙏"}</span>
                            <span style={{ fontFamily: "Cinzel,serif", fontSize: 15, fontWeight: 700, color: cat?.color || "#9333EA" }}>
                              {req.category}
                            </span>
                            {req.urgent && (
                              <span style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", fontFamily: "Rajdhani,sans-serif", fontSize: 11, letterSpacing: 2, fontWeight: 700, padding: "3px 10px", borderRadius: 2 }}>
                                URGENT
                              </span>
                            )}
                            {req.isAnonymous && (
                              <span style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)", fontFamily: "Rajdhani,sans-serif", fontSize: 11, letterSpacing: 2, fontWeight: 700, padding: "3px 10px", borderRadius: 2 }}>
                                ANONYMOUS
                              </span>
                            )}
                          </div>
                          <div className="pr-status" style={{ background: `${status.color}18`, color: status.color }}>
                            {status.label}
                          </div>
                        </div>
                        <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 17, fontWeight: 300, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: 12 }}>
                          {req.request}
                        </p>
                        <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: 13, color: "rgba(255,255,255,0.28)", letterSpacing: 1 }}>
                          Submitted {formatDate(req.createdAt)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ════ TAB 3: PRAYER RESOURCES ════ */}
          {activeTab === "resources" && (
            <div style={{ maxWidth: 820, margin: "0 auto" }}>

              <div style={{ marginBottom: 44 }}>
                <div className="pr-eyebrow">
                  <span className="pr-eyebrow-line" />Grow in Prayer
                </div>
                <h2 style={{ fontFamily: "Cinzel,serif", fontSize: isMobile ? 26 : 38, fontWeight: 700, color: "#fff", marginBottom: 14 }}>
                  Prayer Resources
                </h2>
                <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontStyle: "italic", color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
                  Strengthen your prayer life with scripture, guidance, and encouragement.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 22 }}>
                {[
                  { icon: "📖", title: "Scriptures on Prayer",        text: "Powerful Bible verses to pray and meditate on daily."           },
                  { icon: "🙏", title: "How to Pray",                  text: "Simple guidance for building a consistent prayer life."         },
                  { icon: "✨", title: "Faith Declarations",           text: "Biblical declarations to speak over your life."                 },
                  { icon: "🕊️", title: "Prayer for Every Situation",  text: "Healing, family, finances, guidance and more."                  },
                ].map((item, i) => (
                  <div key={i} className="pr-req-card" style={{ padding: 28 }}>
                    <div style={{ fontSize: 36, marginBottom: 14 }}>{item.icon}</div>
                    <h3 style={{ fontFamily: "Cinzel,serif", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
                      {item.title}
                    </h3>
                    <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Prayer of the Week */}
              <div style={{ marginTop: 44, padding: "32px 36px", background: "rgba(147,51,234,0.08)", border: "1px solid rgba(147,51,234,0.2)", borderRadius: 4, textAlign: "center" }}>
                <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", color: "#9333EA", marginBottom: 18 }}>
                  Prayer of the Week
                </div>
                <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: isMobile ? 18 : 22, fontStyle: "italic", color: "rgba(255,255,255,0.78)", lineHeight: 1.8, maxWidth: 560, margin: "0 auto" }}>
                  Father, strengthen our faith, guide our steps, and help us trust You completely in every season. In Jesus' name, Amen.
                </p>
              </div>
            </div>
          )}

        </section>

        {/* ── PROMISE BANNER ── */}
        <section style={{
          padding: `${isMobile ? 48 : 64}px ${sidePad}px`,
          background: "linear-gradient(135deg,#0d0014,#000)",
          borderTop: "1px solid rgba(147,51,234,0.1)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(147,51,234,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 52, marginBottom: 22 }}>🕊️</div>
            <blockquote style={{ fontFamily: "Cormorant Garamond,serif", fontSize: isMobile ? 20 : 28, fontStyle: "italic", fontWeight: 400, color: "rgba(255,255,255,0.88)", maxWidth: 600, margin: "0 auto 16px", lineHeight: 1.7 }}>
              "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."
            </blockquote>
            <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: 14, letterSpacing: 4, color: "#9333EA", textTransform: "uppercase" }}>
              Philippians 4:6
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
