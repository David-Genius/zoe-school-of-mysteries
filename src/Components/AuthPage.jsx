import { useState } from "react";
import { registerUser, loginUser, resetPassword } from "./firebase";

export default function AuthPage({ logo, onBack, onLogin }) {
  const [mode,      setMode]      = useState("login");
  const [form,      setForm]      = useState({ name:"", email:"", password:"", confirm:"" });
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handle = (e) => { setError(""); setForm({ ...form, [e.target.name]: e.target.value }); };

  const getErrMsg = (code) => ({
    "auth/email-already-in-use":   "An account with this email already exists.",
    "auth/wrong-password":         "Incorrect password. Please try again.",
    "auth/user-not-found":         "No account found with this email.",
    "auth/weak-password":          "Password must be at least 6 characters.",
    "auth/invalid-email":          "Please enter a valid email address.",
    "auth/too-many-requests":      "Too many attempts. Please wait and try again.",
    "auth/network-request-failed": "Network error. Check your connection.",
  }[code] || "Something went wrong. Please try again.");

  const submit = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Please fill in all required fields."); return; }
    if (mode === "signup") {
      if (!form.name.trim()) { setError("Please enter your full name."); return; }
      if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
      if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    }
    setLoading(true);
    try {
      const user = mode === "signup"
        ? await registerUser({ name: form.name, email: form.email, password: form.password })
        : await loginUser({ email: form.email, password: form.password });
      const { getUserProfile } = await import("./firebase");
      const profile = await getUserProfile(user.uid);
      setSuccess(true);
      setTimeout(() => onLogin?.({
        name:  user.displayName || form.name || "Member",
        email: user.email,
        uid:   user.uid,
        role:  profile?.role || "member",
      }), 1200);
    } catch (err) { setError(getErrMsg(err.code)); }
    finally { setLoading(false); }
  };

  const handleReset = async () => {
    if (!form.email) { setError("Enter your email first."); return; }
    setLoading(true);
    try { await resetPassword(form.email); setResetSent(true); }
    catch (err) { setError(getErrMsg(err.code)); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes orbFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes shake    { 0%,100%{transform:translateX(0)} 25%,75%{transform:translateX(-5px)} 50%{transform:translateX(5px)} }
        .auth-fade  { animation:fadeUp 0.6s ease forwards; }
        .auth-shake { animation:shake 0.4s ease; }
        .auth-orb1  { animation:orbFloat 9s ease-in-out infinite; }
        .auth-orb2  { animation:orbFloat 7s ease-in-out infinite 2s; }
        .gold-shimmer { background:linear-gradient(90deg,#F5A800 0%,#FFD166 40%,#F5A800 60%,#C88600 100%); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }

        .auth-input {
          width:100%;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(245,168,0,0.2);
          border-radius:4px;
          padding:16px 20px;
          color:#fff;
          font-family:'Rajdhani',sans-serif;
          font-size:17px;
          letter-spacing:1px;
          outline:none;
          transition:border-color 0.3s,box-shadow 0.3s;
          box-sizing:border-box;
        }
        .auth-input:focus { border-color:#F5A800; box-shadow:0 0 20px rgba(245,168,0,0.12); }
        .auth-input::placeholder { color:rgba(255,255,255,0.3); font-size:16px; }

        .auth-btn {
          width:100%;
          padding:18px;
          background:linear-gradient(135deg,#C88600,#F5A800,#FFD166,#F5A800);
          background-size:300% auto;
          color:#000;
          font-family:'Cinzel',serif;
          font-size:15px;
          letter-spacing:3px;
          text-transform:uppercase;
          font-weight:900;
          border:none;
          border-radius:2px;
          cursor:pointer;
          transition:all 0.4s;
        }
        .auth-btn:hover:not(:disabled) { background-position:right center; transform:translateY(-2px); box-shadow:0 8px 30px rgba(245,168,0,0.4); }
        .auth-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }

        .auth-tab {
          flex:1;
          padding:15px;
          font-family:'Rajdhani',sans-serif;
          font-size:14px;
          letter-spacing:3px;
          text-transform:uppercase;
          font-weight:700;
          background:transparent;
          border:none;
          cursor:pointer;
          transition:all 0.3s;
          color:rgba(255,255,255,0.35);
          border-bottom:2px solid transparent;
        }
        .auth-tab.active { color:#F5A800; border-bottom-color:#F5A800; }

        .back-btn {
          display:inline-flex;
          align-items:center;
          gap:8px;
          font-family:'Rajdhani',sans-serif;
          font-size:14px;
          letter-spacing:2px;
          text-transform:uppercase;
          font-weight:600;
          color:rgba(255,255,255,0.4);
          cursor:pointer;
          transition:color 0.3s;
          background:none;
          border:none;
        }
        .back-btn:hover { color:#F5A800; }

        .social-btn { flex:1; padding:14px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); border-radius:4px; cursor:pointer; font-family:'Rajdhani',sans-serif; font-size:14px; letter-spacing:1px; text-transform:uppercase; font-weight:600; color:rgba(255,255,255,0.6); display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.3s; }
        .social-btn:hover { border-color:rgba(245,168,0,0.4); color:#fff; }

        @media(max-width:768px) { .auth-left{display:none!important} .auth-right{width:100%!important;border-left:none!important} }
      `}</style>

      <div style={{ position:"fixed", inset:0, zIndex:2000, background:"#000", display:"flex", overflow:"hidden" }}>

        {/* LEFT */}
        <div className="auth-left" style={{
          flex:1, position:"relative", overflow:"hidden",
          background:"radial-gradient(ellipse 80% 60% at 50% 30%,rgba(107,33,168,0.5) 0%,transparent 70%),radial-gradient(ellipse 50% 50% at 20% 80%,rgba(245,168,0,0.12) 0%,transparent 60%),#000",
        }}>
          <div style={{ position:"absolute", inset:0, opacity:0.06, backgroundImage:"linear-gradient(rgba(245,168,0,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(245,168,0,0.6) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />
          <div className="auth-orb1" style={{ position:"absolute", width:450, height:450, borderRadius:"50%", top:"10%", left:"20%", background:"radial-gradient(circle,rgba(107,33,168,0.5) 0%,transparent 70%)" }} />
          <div className="auth-orb2" style={{ position:"absolute", width:250, height:250, borderRadius:"50%", bottom:"15%", right:"10%", background:"radial-gradient(circle,rgba(245,168,0,0.18) 0%,transparent 70%)" }} />
          <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", justifyContent:"center", height:"100%", padding:"60px 64px" }}>
            <img src={logo} alt="Zoe" style={{ height:56, objectFit:"contain", marginBottom:48, alignSelf:"flex-start" }} />
            <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:13, letterSpacing:5, textTransform:"uppercase", color:"#F5A800", display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
              <span style={{ width:30, height:1, background:"#F5A800", display:"inline-block" }} />Your Journey Begins
            </div>
            <h2 style={{ fontFamily:"Cinzel,serif", fontWeight:900, fontSize:"clamp(40px,4vw,64px)", lineHeight:1.1, marginBottom:24 }}>
              <span className="gold-shimmer">Enter</span><br/>
              <span style={{ color:"#fff" }}>the School</span><br/>
              <span style={{ color:"#9333EA" }}>of Mysteries</span>
            </h2>
            <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:21, fontWeight:300, fontStyle:"italic", color:"rgba(255,255,255,0.55)", lineHeight:1.8, maxWidth:400 }}>
              Join thousands discovering divine wisdom, technology, and purpose.
            </p>
            <div style={{ display:"flex", gap:40, marginTop:48 }}>
              {[["10K+","Members"],["5","Platforms"],["65+","Courses"]].map(([n,l]) => (
                <div key={l}>
                  <div style={{ fontFamily:"Cinzel,serif", fontSize:32, fontWeight:700, color:"#F5A800" }}>{n}</div>
                  <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:13, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,0.35)" }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:44, display:"flex", alignItems:"center", gap:8, fontFamily:"Rajdhani,sans-serif", fontSize:12, letterSpacing:1, color:"rgba(255,255,255,0.2)" }}>
              🔒 Secured with Firebase · 256-bit encryption
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="auth-right" style={{ width:500, background:"#0A0A0A", borderLeft:"1px solid rgba(245,168,0,0.1)", display:"flex", flexDirection:"column", justifyContent:"center", padding:"52px", overflowY:"auto" }}>
          <button className="back-btn" onClick={onBack} style={{ marginBottom:40 }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back to home
          </button>

          {success ? (
            <div className="auth-fade" style={{ textAlign:"center" }}>
              <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg,#6B21A8,#F5A800)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 24px", boxShadow:"0 0 40px rgba(245,168,0,0.3)" }}>✓</div>
              <h3 style={{ fontFamily:"Cinzel,serif", fontSize:28, fontWeight:700, color:"#fff", marginBottom:12 }}>{mode==="login"?"Welcome Back!":"Account Created!"}</h3>
              <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:20, fontStyle:"italic", color:"rgba(255,255,255,0.5)" }}>Taking you in now...</p>
            </div>

          ) : mode === "reset" ? (
            <div className="auth-fade">
              <h3 style={{ fontFamily:"Cinzel,serif", fontSize:26, fontWeight:700, color:"#fff", marginBottom:8 }}>Reset Password</h3>
              <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:18, fontStyle:"italic", color:"rgba(255,255,255,0.4)", marginBottom:30 }}>Enter your email and we'll send a reset link.</p>
              {resetSent ? (
                <div style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:4, padding:"16px 20px", fontFamily:"Rajdhani,sans-serif", fontSize:16, color:"#22c55e" }}>
                  ✓ Reset link sent to {form.email}. Check your inbox!
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:4, padding:"14px 18px", fontFamily:"Rajdhani,sans-serif", fontSize:15, color:"#ef4444" }}>⚠ {error}</div>}
                  <input className="auth-input" name="email" type="email" placeholder="Email Address" value={form.email} onChange={handle} />
                  <button className="auth-btn" onClick={handleReset} disabled={loading}>{loading?"Sending...":"Send Reset Link"}</button>
                </div>
              )}
              <p style={{ marginTop:28, fontFamily:"Rajdhani,sans-serif", fontSize:14, color:"rgba(255,255,255,0.3)", textAlign:"center" }}>
                <span onClick={() => { setMode("login"); setResetSent(false); setError(""); }} style={{ color:"#F5A800", cursor:"pointer", fontWeight:700 }}>← Back to Sign In</span>
              </p>
            </div>

          ) : (
            <div className={`auth-fade ${error?"auth-shake":""}`} key={mode}>
              <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.08)", marginBottom:34 }}>
                <button className={`auth-tab ${mode==="login"?"active":""}`} onClick={() => { setMode("login"); setError(""); }}>Sign In</button>
                <button className={`auth-tab ${mode==="signup"?"active":""}`} onClick={() => { setMode("signup"); setError(""); }}>Create Account</button>
              </div>

              <h3 style={{ fontFamily:"Cinzel,serif", fontSize:26, fontWeight:700, color:"#fff", marginBottom:8 }}>
                {mode==="login"?"Welcome back":"Join the community"}
              </h3>
              <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:18, fontStyle:"italic", color:"rgba(255,255,255,0.4)", marginBottom:30 }}>
                {mode==="login"?"Sign in to access your courses, sermons & more.":"Create your free account and start your journey."}
              </p>

              {error && (
                <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:4, padding:"14px 18px", fontFamily:"Rajdhani,sans-serif", fontSize:15, color:"#ef4444", marginBottom:18, display:"flex", alignItems:"center", gap:8 }}>
                  ⚠ {error}
                </div>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {mode==="signup" && <input className="auth-input" name="name" type="text" placeholder="Full Name *" value={form.name} onChange={handle} onKeyDown={e=>e.key==="Enter"&&submit()} />}
                <input className="auth-input" name="email" type="email" placeholder="Email Address *" value={form.email} onChange={handle} onKeyDown={e=>e.key==="Enter"&&submit()} />
                <input className="auth-input" name="password" type="password" placeholder="Password *" value={form.password} onChange={handle} onKeyDown={e=>e.key==="Enter"&&submit()} />
                {mode==="signup" && <input className="auth-input" name="confirm" type="password" placeholder="Confirm Password *" value={form.confirm} onChange={handle} onKeyDown={e=>e.key==="Enter"&&submit()} />}
                {mode==="login" && (
                  <div style={{ textAlign:"right" }}>
                    <span onClick={() => { setMode("reset"); setError(""); }} style={{ fontFamily:"Rajdhani,sans-serif", fontSize:14, color:"#F5A800", cursor:"pointer", letterSpacing:1 }}>Forgot password?</span>
                  </div>
                )}
                <button className="auth-btn" onClick={submit} disabled={loading||!form.email||!form.password} style={{ marginTop:6 }}>
                  {loading ? (mode==="login"?"Signing in...":"Creating account...") : (mode==="login"?"Sign In":"Create Account")}
                </button>
              </div>

              <div style={{ display:"flex", alignItems:"center", gap:14, margin:"26px 0" }}>
                <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)" }} />
                <span style={{ fontFamily:"Rajdhani,sans-serif", fontSize:13, letterSpacing:2, color:"rgba(255,255,255,0.2)", textTransform:"uppercase" }}>or</span>
                <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)" }} />
              </div>

              <p style={{ fontFamily:"Rajdhani,sans-serif", fontSize:15, letterSpacing:1, color:"rgba(255,255,255,0.35)", textAlign:"center", marginTop:4 }}>
                {mode==="login"?"Don't have an account? ":"Already have an account? "}
                <span onClick={() => { setMode(mode==="login"?"signup":"login"); setError(""); }} style={{ color:"#F5A800", cursor:"pointer", fontWeight:700 }}>
                  {mode==="login"?"Sign up free":"Sign in"}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}