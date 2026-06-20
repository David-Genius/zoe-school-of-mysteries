import { useEffect, useState, useRef } from "react";
import { auth, getUserProfile, onAuthChange, updateUserProfile } from "./firebase";

// ─── Avatar initials ring ───
function AvatarRing({ name, size = 100 }) {
  const initials = name
    ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "??";
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      {/* Spinning conic ring */}
      <div style={{
        position: "absolute", inset: -3,
        borderRadius: "50%",
        background: "conic-gradient(from 0deg, #F5A800, #FFD166, #9333EA, #C88600, #F5A800)",
        animation: "pp-spin 4s linear infinite",
        zIndex: 0,
      }} />
      {/* Inner ring mask */}
      <div style={{
        position: "absolute", inset: 2,
        borderRadius: "50%",
        background: "#0a0800",
        zIndex: 1,
      }} />
      {/* Avatar body */}
      <div style={{
        position: "absolute", inset: 6,
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 30%, #1a0f00, #000)",
        border: "1px solid rgba(245,168,0,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 2,
      }}>
        <span style={{
          fontFamily: "Cinzel, serif", fontWeight: 900,
          fontSize: size * 0.28,
          background: "linear-gradient(135deg, #C88600, #F5A800, #FFD166)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>{initials}</span>
      </div>
    </div>
  );
}

// ─── Editable field ───
function EditField({ label, value, type = "text", editing, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontFamily: "Rajdhani, sans-serif",
        fontSize: 10, letterSpacing: 4,
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.3)",
        marginBottom: 8,
      }}>{label}</div>
      {editing ? (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            background: "rgba(245,168,0,0.04)",
            border: "1px solid rgba(245,168,0,0.35)",
            borderRadius: 4, padding: "14px 16px",
            color: "#fff",
            fontFamily: "Rajdhani, sans-serif",
            fontSize: 15, letterSpacing: 0.5,
            outline: "none",
            boxShadow: "0 0 20px rgba(245,168,0,0.1)",
            boxSizing: "border-box",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
          onFocus={e => {
            e.target.style.borderColor = "#F5A800";
            e.target.style.boxShadow = "0 0 30px rgba(245,168,0,0.2)";
          }}
          onBlur={e => {
            e.target.style.borderColor = "rgba(245,168,0,0.35)";
            e.target.style.boxShadow = "0 0 20px rgba(245,168,0,0.1)";
          }}
        />
      ) : (
        <div style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: 18, fontWeight: 400,
          color: value ? "#fff" : "rgba(255,255,255,0.2)",
          padding: "12px 0",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          letterSpacing: 0.3,
          minHeight: 46,
          display: "flex", alignItems: "center",
        }}>
          {value || <span style={{ fontStyle: "italic", fontSize: 14, color: "rgba(255,255,255,0.2)" }}>Not set</span>}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage({ onLogout }) {
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState(false);
  const [saving,  setSaving]      = useState(false);
  const [saved,   setSaved]       = useState(false);
  const [name,    setName]        = useState("");
  const [email,   setEmail]       = useState("");
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      if (!firebaseUser) { setUser(null); setLoading(false); return; }
      const profile = await getUserProfile(firebaseUser.uid);
      const merged = { ...firebaseUser, ...profile };
      setUser(merged);
      setName(merged.name || merged.displayName || "");
      setEmail(merged.email || "");
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (updateUserProfile) {
        await updateUserProfile(auth.currentUser?.uid, { name, email });
      }
      setUser(prev => ({ ...prev, name, email }));
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setName(user?.name || user?.displayName || "");
    setEmail(user?.email || "");
    setEditing(false);
  };

  if (loading) return (
    <div style={{
      background: "#000", minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%",
        border: "2px solid rgba(245,168,0,0.2)",
        borderTopColor: "#F5A800",
        animation: "pp-spin 0.9s linear infinite",
      }} />
      <style>{`@keyframes pp-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!user) return (
    <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontStyle: "italic" }}>
        Not signed in
      </div>
    </div>
  );

  const joinDate = user.createdAt?.toDate?.().toLocaleDateString("en-NG", {
    day: "numeric", month: "long", year: "numeric"
  }) || null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Rajdhani:wght@500;600;700&display=swap');

        @keyframes pp-spin   { to { transform: rotate(360deg); } }
        @keyframes pp-fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pp-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes pp-pulse  { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
        @keyframes pp-in     { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }

        .pp-gold {
          background: linear-gradient(135deg, #C88600 0%, #F5A800 30%, #FFD166 50%, #F5A800 70%, #C88600 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: pp-shimmer 3s linear infinite;
        }

        .pp-card {
          background: rgba(8,5,0,0.95);
          border: 1px solid rgba(245,168,0,0.12);
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.4s;
        }
        .pp-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(245,168,0,0.5), transparent);
        }

        .pp-btn-gold {
          background: linear-gradient(135deg, #C88600, #F5A800, #FFD166, #F5A800);
          background-size: 300% auto;
          color: #000;
          border: none; border-radius: 4px;
          font-family: 'Cinzel', serif;
          font-size: 12px; letter-spacing: 3px;
          text-transform: uppercase; font-weight: 900;
          padding: 14px 32px;
          cursor: pointer;
          transition: all 0.4s;
          position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .pp-btn-gold:hover:not(:disabled) {
          background-position: right center;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(245,168,0,0.4);
        }
        .pp-btn-gold:disabled { opacity: 0.4; cursor: not-allowed; }

        .pp-btn-ghost {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          color: rgba(255,255,255,0.4);
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px; letter-spacing: 2px;
          text-transform: uppercase; font-weight: 700;
          padding: 14px 28px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .pp-btn-ghost:hover { border-color: rgba(255,255,255,0.25); color: rgba(255,255,255,0.7); }

        .pp-btn-danger {
          background: transparent;
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 4px;
          color: rgba(239,68,68,0.6);
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px; letter-spacing: 2px;
          text-transform: uppercase; font-weight: 700;
          padding: 14px 28px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex; align-items: center; gap: 8px;
        }
        .pp-btn-danger:hover {
          border-color: rgba(239,68,68,0.6);
          color: #ef4444;
          background: rgba(239,68,68,0.05);
          box-shadow: 0 0 20px rgba(239,68,68,0.1);
        }

        .pp-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 14px;
          border-radius: 100px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 9px; letter-spacing: 3px;
          text-transform: uppercase; font-weight: 700;
        }

        .pp-toast {
          position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
          background: rgba(10,8,0,0.97);
          border: 1px solid rgba(34,197,94,0.4);
          border-radius: 4px;
          padding: 14px 28px;
          display: flex; align-items: center; gap: 10px;
          font-family: 'Rajdhani', sans-serif; font-size: 13px;
          letter-spacing: 1px; color: #22c55e;
          box-shadow: 0 8px 40px rgba(0,0,0,0.8), 0 0 30px rgba(34,197,94,0.1);
          animation: pp-fadeUp 0.4s ease;
          z-index: 9999;
        }

        .pp-divider {
          border: none;
          border-top: 1px solid rgba(245,168,0,0.07);
          margin: 28px 0;
        }

        .pp-eyebrow {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 10px; letter-spacing: 5px;
          text-transform: uppercase; color: #F5A800;
          margin-bottom: 10px;
        }

        .pp-confirm-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.85);
          display: flex; align-items: center; justify-content: center;
          z-index: 9000;
          animation: pp-in 0.2s ease;
          backdrop-filter: blur(4px);
        }
      `}</style>

      <div style={{
        background: "#000",
        minHeight: "100vh",
        padding: "100px 20px 60px",
        fontFamily: "Rajdhani, sans-serif",
      }}>

        {/* Background texture */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 40% at 50% 0%, #130a00 0%, #000 60%)",
          zIndex: 0,
        }} />
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 60px, rgba(245,168,0,0.015) 60px, rgba(245,168,0,0.015) 61px)",
        }} />

        <div style={{
          maxWidth: 560, margin: "0 auto",
          position: "relative", zIndex: 1,
          animation: "pp-fadeUp 0.6s ease both",
        }}>

          {/* ─── PAGE HEADER ─── */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="pp-eyebrow" style={{ justifyContent: "center" }}>
              <span style={{ display: "inline-block", width: 24, height: 1, background: "#F5A800" }} />
              My Account
              <span style={{ display: "inline-block", width: 24, height: 1, background: "#F5A800" }} />
            </div>
            <h1 style={{
              fontFamily: "Cinzel, serif", fontWeight: 900,
              fontSize: 38, letterSpacing: "-1px",
              margin: "0 0 4px",
            }}>
              <span className="pp-gold">Profile</span>
            </h1>
            <p style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: 16, fontStyle: "italic", fontWeight: 300,
              color: "rgba(255,255,255,0.35)",
            }}>
              Your identity in the Kingdom
            </p>
          </div>

          {/* ─── AVATAR + ROLE CARD ─── */}
          <div className="pp-card" style={{
            padding: "36px 32px 28px",
            marginBottom: 16,
            textAlign: "center",
            animation: "pp-fadeUp 0.6s ease 0.1s both",
          }}>
            <AvatarRing name={user.name || user.displayName} size={96} />

            <div style={{
              fontFamily: "Cinzel, serif", fontWeight: 700,
              fontSize: 22, color: "#fff",
              marginTop: 20, marginBottom: 6,
              letterSpacing: 0.5,
            }}>
              {user.name || user.displayName || "Member"}
            </div>

            <div style={{ marginBottom: 16 }}>
              <span className="pp-badge" style={{
                background: "rgba(245,168,0,0.08)",
                border: "1px solid rgba(245,168,0,0.2)",
                color: "#F5A800",
              }}>
                ✦ {user.role || "Member"}
              </span>
            </div>

            {joinDate && (
              <div style={{
                fontFamily: "Rajdhani, sans-serif",
                fontSize: 10, letterSpacing: 2,
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
              }}>
                Kingdom Family since {joinDate}
              </div>
            )}
          </div>

          {/* ─── EDIT FORM CARD ─── */}
          <div className="pp-card" style={{
            padding: "32px",
            marginBottom: 16,
            animation: "pp-fadeUp 0.6s ease 0.2s both",
          }}>

            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 28,
            }}>
              <div>
                <div className="pp-eyebrow" style={{ marginBottom: 2 }}>
                  <span style={{ display: "inline-block", width: 16, height: 1, background: "#F5A800" }} />
                  Personal Info
                </div>
              </div>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(245,168,0,0.25)",
                    borderRadius: 3,
                    padding: "8px 18px",
                    cursor: "pointer",
                    fontFamily: "Rajdhani, sans-serif",
                    fontSize: 10, letterSpacing: 3,
                    textTransform: "uppercase", fontWeight: 700,
                    color: "#F5A800",
                    transition: "all 0.3s",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(245,168,0,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
              )}
            </div>

            <EditField
              label="Full Name"
              value={name}
              editing={editing}
              onChange={setName}
              placeholder="Your full name"
            />
            <EditField
              label="Email Address"
              value={email}
              type="email"
              editing={editing}
              onChange={setEmail}
              placeholder="your@email.com"
            />

            {/* Action buttons */}
            {editing && (
              <div style={{
                display: "flex", gap: 12, marginTop: 28,
                flexWrap: "wrap",
              }}>
                <button
                  className="pp-btn-gold"
                  disabled={saving || !name.trim()}
                  onClick={handleSave}
                  style={{ flex: 1 }}
                >
                  {saving ? (
                    <>
                      <div style={{
                        width: 14, height: 14, borderRadius: "50%",
                        border: "2px solid rgba(0,0,0,0.3)",
                        borderTopColor: "#000",
                        animation: "pp-spin 0.8s linear infinite",
                      }} />
                      Saving...
                    </>
                  ) : "Save Changes"}
                </button>
                <button className="pp-btn-ghost" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* ─── SIGN OUT CARD ─── */}
          <div className="pp-card" style={{
            padding: "24px 32px",
            animation: "pp-fadeUp 0.6s ease 0.3s both",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", flexWrap: "wrap", gap: 16,
            }}>
              <div>
                <div style={{
                  fontFamily: "Cinzel, serif", fontSize: 14,
                  fontWeight: 700, color: "rgba(255,255,255,0.6)",
                  marginBottom: 4,
                }}>Sign Out</div>
                <div style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: 14, fontStyle: "italic",
                  color: "rgba(255,255,255,0.25)",
                }}>
                  You'll need to sign in again to access your account
                </div>
              </div>
              <button
                className="pp-btn-danger"
                onClick={() => setLogoutConfirm(true)}
              >
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign Out
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ─── SAVED TOAST ─── */}
      {saved && (
        <div className="pp-toast">
          <span style={{ fontSize: 16 }}>✓</span>
          Profile updated successfully
        </div>
      )}

      {/* ─── LOGOUT CONFIRM OVERLAY ─── */}
      {logoutConfirm && (
        <div className="pp-confirm-overlay" onClick={() => setLogoutConfirm(false)}>
          <div
            className="pp-card"
            style={{
              maxWidth: 380, width: "90%",
              padding: "40px 36px",
              textAlign: "center",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px", fontSize: 22,
            }}>
              <svg width="22" height="22" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>

            <div style={{
              fontFamily: "Cinzel, serif", fontSize: 20,
              fontWeight: 700, color: "#fff", marginBottom: 10,
            }}>Sign out?</div>
            <p style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: 16, fontStyle: "italic",
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.7, marginBottom: 32,
            }}>
              You'll be signed out of your Zoe account.
            </p>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                className="pp-btn-danger"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={onLogout}
              >
                Yes, Sign Out
              </button>
              <button
                className="pp-btn-ghost"
                style={{ flex: 1 }}
                onClick={() => setLogoutConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
