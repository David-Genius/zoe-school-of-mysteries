import { useState, useEffect, useRef, useCallback } from "react";
import { saveGiving} from "./firebase";
import { auth } from "./firebase";
import { PaystackButton } from "react-paystack";


function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

// ─────────────────────────────────────────
// CANVAS PARTICLE ENGINE
// ─────────────────────────────────────────
function GiveCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    // Coin particles
    const coins = Array.from({ length: 22 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 6 + Math.random() * 18,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.3 - Math.random() * 0.6,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.03,
      alpha: 0.15 + Math.random() * 0.5,
      color: ["#F5A800", "#FFD166", "#C88600", "#9333EA", "#fff"][i % 5],
    }));

    // Sparkle particles
    const sparks = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5,
      alpha: Math.random(),
      speed: 0.005 + Math.random() * 0.015,
      phase: Math.random() * Math.PI * 2,
    }));

    // Lines connecting close coins
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connection lines
      for (let i = 0; i < coins.length; i++) {
        for (let j = i + 1; j < coins.length; j++) {
          const dx = coins[i].x - coins[j].x;
          const dy = coins[i].y - coins[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(coins[i].x, coins[i].y);
            ctx.lineTo(coins[j].x, coins[j].y);
            ctx.strokeStyle = `rgba(245,168,0,${0.06 * (1 - dist / 160)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw coins
      coins.forEach(c => {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.globalAlpha = c.alpha;

        // Coin body (ellipse for 3D perspective)
        ctx.beginPath();
        ctx.ellipse(0, 0, c.r, c.r * 0.35, 0, 0, Math.PI * 2);
        ctx.fillStyle = c.color;
        ctx.fill();

        // Coin rim
        ctx.beginPath();
        ctx.ellipse(0, c.r * 0.1, c.r * 0.95, c.r * 0.28, 0, 0, Math.PI * 2);
        ctx.fillStyle = c.color + "88";
        ctx.fill();

        // Shine
        ctx.beginPath();
        ctx.ellipse(-c.r * 0.2, -c.r * 0.05, c.r * 0.3, c.r * 0.1, -0.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fill();

        ctx.restore();

        // Update position
        c.x += c.vx;
        c.y += c.vy;
        c.rot += c.rotV;
        if (c.y < -c.r * 2) { c.y = canvas.height + c.r; c.x = Math.random() * canvas.width; }
        if (c.x < -c.r * 2) c.x = canvas.width + c.r;
        if (c.x > canvas.width + c.r * 2) c.x = -c.r;
      });

      // Draw sparkles
      const t = Date.now() * 0.001;
      sparks.forEach(s => {
        const a = Math.abs(Math.sin(t * s.speed * 10 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * a, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,168,0,${a * 0.6})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "absolute", inset: 0,
      width: "100%", height: "100%",
      pointerEvents: "none",
    }} />
  );
}

// ─────────────────────────────────────────
// 3D ROTATING COIN
// ─────────────────────────────────────────
function RotatingCoin({ size = 100, symbol = "₦", color = "#F5A800", delay = 0, top, left, right, bottom }) {
  return (
    <div style={{
      position: "absolute", top, left, right, bottom,
      width: size, height: size,
      perspective: 800,
      pointerEvents: "none",
      zIndex: 2,
    }}>
      <style>{`
        @keyframes coin-spin-${delay * 10 | 0} {
          0%   { transform: rotateY(0deg) rotateX(${15 + delay * 5}deg); }
          100% { transform: rotateY(360deg) rotateX(${15 + delay * 5}deg); }
        }
        @keyframes coin-float-${delay * 10 | 0} {
          0%, 100% { margin-top: 0px; }
          50%       { margin-top: ${-12 - delay * 4}px; }
        }
      `}</style>
      <div style={{
        width: "100%", height: "100%",
        transformStyle: "preserve-3d",
        animation: `coin-spin-${delay * 10 | 0} ${3 + delay * 0.8}s linear infinite, coin-float-${delay * 10 | 0} ${2.5 + delay * 0.5}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}>
        {/* Front face */}
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 30%, ${color}ff, ${color}88)`,
          backfaceVisibility: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 30px ${color}66, inset 0 2px 4px rgba(255,255,255,0.3)`,
          border: `2px solid ${color}cc`,
        }}>
          <span style={{
            fontFamily: "Cinzel, serif", fontWeight: 900,
            fontSize: size * 0.35, color: "#000",
            textShadow: `0 1px 2px rgba(255,255,255,0.4)`,
          }}>{symbol}</span>
        </div>
        {/* Back face */}
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle at 65% 70%, ${color}cc, ${color}44)`,
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          border: `2px solid ${color}88`,
        }} />
        {/* Edge */}
        <div style={{
          position: "absolute",
          width: "100%", height: "100%",
          borderRadius: "50%",
          background: `linear-gradient(to right, ${color}22, ${color}88, ${color}22)`,
          transform: "rotateY(90deg) scaleX(0.1)",
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────
const funds = [
  { id: "tithe",       title: "Tithe",         icon: "✦", color: "#F5A800", glow: "rgba(245,168,0,0.3)"   },
  { id: "offering",    title: "Offering",       icon: "🕊", color: "#9333EA", glow: "rgba(147,51,234,0.3)"  },
  { id: "building",    title: "Building Fund",  icon: "⛪", color: "#06b6d4", glow: "rgba(6,182,212,0.3)"   },
  { id: "missions",    title: "Missions",       icon: "🌍", color: "#22c55e", glow: "rgba(34,197,94,0.3)"   },
  { id: "scholarship", title: "Scholarship",    icon: "📖", color: "#f97316", glow: "rgba(249,115,22,0.3)"  },
  { id: "special",     title: "Special Seed",   icon: "🌱", color: "#ec4899", glow: "rgba(236,72,153,0.3)"  },
];

const quickAmounts = [1000, 2500, 5000, 10000, 25000, 50000];

const givingHistory = [
  { date: "Mar 30", fund: "Tithe",        amount: 5000,  status: "Confirmed" },
  { date: "Mar 23", fund: "Offering",     amount: 1000,  status: "Confirmed" },
  { date: "Mar 16", fund: "Tithe",        amount: 5000,  status: "Confirmed" },
  { date: "Mar 9",  fund: "Building Fund",amount: 2500,  status: "Confirmed" },
  { date: "Mar 2",  fund: "Tithe",        amount: 5000,  status: "Confirmed" },
  { date: "Feb 23", fund: "Missions",     amount: 1500,  status: "Confirmed" },
];


// ─────────────────────────────────────────
// FAQ DATA
// ─────────────────────────────────────────
const faqs = [
  { q: "How do I edit my giving?",                        a: "Log into your MyZoe portal, navigate to 'Giving History', and click 'Edit' on any recurring gift. You can update the amount, frequency, or payment method at any time." },
  { q: "How do I view my giving statement?",              a: "Your giving statement is available in the MyZoe portal under 'Giving History'. You can download a PDF statement for any year. Statements are also emailed at the end of each year." },
  { q: "What giving option should I choose?",             a: "Tithe (10% of your income) is the biblical standard and goes to the local church. Offering is any amount above your tithe. You can also give to specific funds like Building Fund or Missions based on what God places on your heart." },
  { q: "How do I calculate my tithe?",                   a: "Your tithe is 10% of your gross income. For example, if you earn ₦100,000 per month, your tithe would be ₦10,000. We recommend giving from the first fruits of your income." },
  { q: "Will I receive a giving statement?",              a: "Yes! You'll receive an automated email receipt after every gift. Annual giving statements are available in your MyZoe portal and are emailed every January for the previous year." },
  { q: "What is the deadline for annual contributions?",  a: "For year-end giving statements, all gifts must be received by December 31st. Online gifts must be completed by 11:59 PM WAT on December 31st to count for that year." },
  { q: "How do I give a Qualified Charitable Distribution?", a: "If you are 70½ or older, you may give directly from your Individual Retirement Account (IRA) to Zoe School of Mysteries. Contact your IRA administrator to initiate the transfer. Email giving@zoeschool.org for our tax ID." },
  { q: "How can I give assets to the church?",            a: "You can donate stocks, real estate, or other assets to Zoe School of Mysteries. These non-cash gifts may provide significant tax benefits. Please contact our finance team at giving@zoeschool.org for guidance." },
  { q: "Do you offer financial small groups?",            a: "Yes! Our Financial Freedom eGroups meet weekly and cover biblical principles of money management, budgeting, debt elimination, and generous living. Find a group near you in our Groups section." },
  { q: "Can I give if I live outside of Nigeria?",        a: "Absolutely! We accept giving from over 180 countries through Flutterwave and Stripe. Simply select your currency during checkout. All international cards are accepted." },
];

const sideNavItems = [
  // { id: "give-about",   label: "About"          },
  // { id: "give-options", label: "Giving options"  },
  // { id: "give-impact",  label: "Your impact"     },
  { id: "give-form",    label: "Resources"       },
  { id: "give-faq",     label: "FAQs"            },
];


const testGiving = async () => {
  try {
    await saveGiving({
      uid: "test123",
      name: "Test User",
      email: "test@gmail.com",
      amount: 2000,
      fund: "Tithe",
      frequency: "once",
      method: "manual",
    });

    alert("Test giving saved to Firestore!");
  } catch (err) {
    console.error(err);
    alert("Failed to save giving");
  }
};


export default function GivePage() {
  const width     = useWidth();
  const isMobile  = width < 640;
  const isTablet  = width >= 640 && width < 1024;
  const sidePad   = isMobile ? 20 : isTablet ? 32 : 64;
  const topOffset = isMobile ? 130 : 76;

  const [selectedFund, setSelectedFund] = useState("tithe");
  const [amount,       setAmount]       = useState("");
  const [custom,       setCustom]       = useState(false);
  const [frequency,    setFrequency]    = useState("once");
  const [payMethod,    setPayMethod]    = useState("paystack");
  const [step,         setStep]         = useState(1);
  const [name,         setName]         = useState("");
  const [email,        setEmail]        = useState("");
  const [phone,        setPhone]        = useState("");
  const [processing,   setProcessing]   = useState(false);
  const [historyTab,   setHistoryTab]   = useState("history");
  const [openFaq,      setOpenFaq]      = useState(null);
  const [activeSection,setActiveSection]= useState("give-about");

  const fund = funds.find(f => f.id === selectedFund);
  const total = givingHistory.reduce((s, h) => s + h.amount, 0);

  // const handlePay = () => {
  //   if (!amount || !name || !email) return;
  //   setProcessing(true);
  //   setTimeout(() => { setProcessing(false); setStep(4); }, 2200);
  // };


  const handlePay = async () => {
  if (!amount || !name || !email) return;

  setProcessing(true);

  try {
    await saveGiving({
      uid: auth.currentUser?.uid || null,
      name,
      email,
      amount,
      fund: selectedFund,
      frequency,
      method: payMethod,
    });

    setStep(4);
  } catch (error) {
    console.error(error);
    alert("Failed to save giving");
  }

  setProcessing(false);
};

  const reset = () => {
    setStep(1); setAmount(""); setName(""); setEmail(""); setPhone(""); setCustom(false);
  };

  return (
    <>
      <style>{`
        /* ─ Reset & base ─ */
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Rajdhani:wght@500;600;700&display=swap');

        /* ─ Keyframes ─ */
        @keyframes gp-fadeUp   { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gp-shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes gp-pulse    { 0%,100%{transform:scale(1);opacity:0.7} 50%{transform:scale(1.15);opacity:1} }
        @keyframes gp-spin     { to{transform:rotate(360deg)} }
        @keyframes gp-glow     { 0%,100%{box-shadow:0 0 20px rgba(245,168,0,0.3)} 50%{box-shadow:0 0 60px rgba(245,168,0,0.8),0 0 100px rgba(245,168,0,0.3)} }
        @keyframes gp-float    { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-16px) rotate(2deg)} }
        @keyframes gp-ripple   { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2.5);opacity:0} }
        @keyframes gp-slideIn  { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes gp-countUp  { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
        @keyframes gp-borderRun {
          0%   { background-position: 0% 0% }
          25%  { background-position: 100% 0% }
          50%  { background-position: 100% 100% }
          75%  { background-position: 0% 100% }
          100% { background-position: 0% 0% }
        }
        @keyframes gp-hexRotate { to { transform: rotate(360deg); } }
        @keyframes gp-successRing {
          0%   { transform: scale(0); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes gp-successCheck {
          0%   { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes gp-rain {
          0%   { transform: translateY(-20px) rotate(var(--r)); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(100vh) rotate(var(--r)); opacity: 0; }
        }

        /* ─ Page ─ */
        .gp-page {
          background: #000;
          min-height: 100vh;
          font-family: 'Rajdhani', sans-serif;
        }

        /* ─ Hero ─ */
        .gp-hero {
          position: relative;
          overflow: hidden;
          background: radial-gradient(ellipse 80% 60% at 50% 40%, #1a0a00 0%, #000 70%);
          border-bottom: 1px solid rgba(245,168,0,0.15);
        }

        /* Diagonal gold stripe */
        .gp-hero::before {
          content: '';
          position: absolute;
          top: -50%; left: -20%;
          width: 140%; height: 200%;
          background: repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 60px,
            rgba(245,168,0,0.02) 60px,
            rgba(245,168,0,0.02) 61px
          );
          pointer-events: none;
        }

        /* ─ Gold text ─ */
        .gp-gold {
          background: linear-gradient(135deg, #C88600 0%, #F5A800 30%, #FFD166 50%, #F5A800 70%, #C88600 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gp-shimmer 3s linear infinite;
        }

        /* ─ Animated border card ─ */
        .gp-anim-border {
          position: relative;
          background: rgba(10,8,0,0.9);
          border-radius: 8px;
          overflow: hidden;
        }
        .gp-anim-border::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: conic-gradient(from 0deg, #F5A800, #FFD166, #9333EA, #F5A800, transparent, transparent, #F5A800);
          border-radius: 10px;
          animation: gp-hexRotate 3s linear infinite;
          z-index: 0;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .gp-anim-border:hover::before { opacity: 1; }
        .gp-anim-border > * { position: relative; z-index: 1; }

        /* ─ Fund cards ─ */
        .gp-fund {
          border-radius: 6px;
          padding: 18px 14px;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative; overflow: hidden;
          text-align: center;
        }
        .gp-fund::after {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle at 50% 50%, var(--fc) 0%, transparent 70%);
          opacity: 0; transition: opacity 0.3s;
        }
        .gp-fund:hover, .gp-fund.sel {
          transform: translateY(-5px) scale(1.03);
        }
        .gp-fund:hover::after, .gp-fund.sel::after { opacity: 0.08; }

        /* ─ Amount pills ─ */
        .gp-pill {
          border-radius: 4px; padding: 14px 8px;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          font-family: 'Cinzel', serif; font-size: 14px; font-weight: 700;
          color: rgba(255,255,255,0.5); text-align: center;
          transition: all 0.25s;
        }
        .gp-pill:hover { border-color: rgba(245,168,0,0.5); color: #F5A800; background: rgba(245,168,0,0.06); transform: scale(1.04); }
        .gp-pill.sel { border-color: #F5A800; color: #F5A800; background: rgba(245,168,0,0.12); box-shadow: 0 0 20px rgba(245,168,0,0.2); }

        /* ─ Amount big input ─ */
        .gp-amt-input {
          width: 100%; background: transparent;
          border: none; border-bottom: 2px solid rgba(245,168,0,0.3);
          color: #F5A800; font-family: 'Cinzel', serif;
          font-size: 48px; font-weight: 900; text-align: center;
          outline: none; transition: border-color 0.3s;
          text-shadow: 0 0 40px rgba(245,168,0,0.4);
        }
        .gp-amt-input:focus { border-bottom-color: #F5A800; }
        .gp-amt-input::placeholder { color: rgba(245,168,0,0.15); }

        /* ─ Form input ─ */
        .gp-input {
          width: 100%;
          background: rgba(245,168,0,0.04);
          border: 1px solid rgba(245,168,0,0.15);
          border-radius: 4px; padding: 14px 16px;
          color: #fff; font-family: 'Rajdhani', sans-serif;
          font-size: 14px; letter-spacing: 0.5px; outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .gp-input:focus {
          border-color: #F5A800;
          box-shadow: 0 0 20px rgba(245,168,0,0.15);
        }
        .gp-input::placeholder { color: rgba(255,255,255,0.2); }

        /* ─ Submit button ─ */
        .gp-submit {
          width: 100%; padding: 18px;
          background: linear-gradient(135deg, #C88600, #F5A800, #FFD166, #F5A800);
          background-size: 300% auto;
          color: #000; border: none; border-radius: 4px;
          font-family: 'Cinzel', serif; font-size: 14px;
          letter-spacing: 3px; text-transform: uppercase; font-weight: 900;
          cursor: pointer; transition: all 0.4s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          position: relative; overflow: hidden;
        }
        .gp-submit:hover:not(:disabled) {
          background-position: right center;
          transform: translateY(-3px);
          box-shadow: 0 10px 40px rgba(245,168,0,0.5), 0 0 80px rgba(245,168,0,0.2);
        }
        .gp-submit::before {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        .gp-submit:hover::before { left: 100%; }
        .gp-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ─ Pay method ─ */
        .gp-pay {
          flex: 1; padding: 16px 10px; border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          cursor: pointer; transition: all 0.3s;
          display: flex; flex-direction: column;
          align-items: center; gap: 6px;
        }
        .gp-pay:hover { border-color: rgba(245,168,0,0.3); transform: translateY(-3px); }
        .gp-pay.sel { border-color: #F5A800; background: rgba(245,168,0,0.08); box-shadow: 0 0 20px rgba(245,168,0,0.15); }

        /* ─ Spinner ─ */
        .gp-spinner {
          width: 20px; height: 20px; border-radius: 50%;
          border: 2px solid rgba(0,0,0,0.3);
          border-top-color: #000;
          animation: gp-spin 0.8s linear infinite;
        }

        /* ─ Step dot ─ */
        .gp-step { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Cinzel', serif; font-size: 12px; font-weight: 700; transition: all 0.4s; }
        .gp-step.done { background: #22c55e; color: #000; box-shadow: 0 0 20px rgba(34,197,94,0.4); }
        .gp-step.active { background: #F5A800; color: #000; box-shadow: 0 0 20px rgba(245,168,0,0.5); animation: gp-pulse 2s ease-in-out infinite; }
        .gp-step.pending { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.25); }

        /* ─ Freq tab ─ */
        .gp-freq { flex:1; padding:10px; border:none; cursor:pointer; font-family:'Rajdhani',sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; font-weight:700; background:transparent; color:rgba(255,255,255,0.3); transition:all 0.25s; border-bottom:2px solid transparent; }
        .gp-freq.active { color:#F5A800; border-bottom-color:#F5A800; }

        /* ─ History row ─ */
        .gp-hrow { display:flex; align-items:center; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.04); gap:12px; transition:background 0.2s; cursor:default; }
        .gp-hrow:hover { background:rgba(245,168,0,0.03); }
        .gp-hrow:last-child { border-bottom:none; }

        /* ─ Stat card ─ */
        .gp-stat { background:rgba(255,255,255,0.02); border:1px solid rgba(245,168,0,0.1); border-radius:6px; padding:18px; transition:all 0.3s; }
        .gp-stat:hover { border-color:rgba(245,168,0,0.35); transform:translateY(-3px); box-shadow:0 8px 30px rgba(245,168,0,0.1); }

        /* ─ Back btn ─ */
        .gp-back { background:none; border:none; cursor:pointer; font-family:'Rajdhani',sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; font-weight:700; color:rgba(255,255,255,0.35); display:flex; align-items:center; gap:6px; padding:0; margin-bottom:24px; transition:color 0.2s; }
        .gp-back:hover { color:#F5A800; }

        /* ─ Rain coins ─ */
        .gp-rain-coin {
          position: absolute;
          font-size: 20px;
          animation: gp-rain var(--dur) linear infinite;
          animation-delay: var(--del);
          opacity: 0;
          pointer-events: none;
        }

        /* ─ Eyebrow ─ */
        .gp-eyebrow { display:flex; align-items:center; gap:10px; font-family:'Rajdhani',sans-serif; font-size:11px; letter-spacing:5px; text-transform:uppercase; color:#F5A800; margin-bottom:16px; }
        .gp-line { width:24px; height:1px; background:#F5A800; display:inline-block; }

        /* ─ Ripple ring ─ */
        .gp-ring { position:absolute; border-radius:50%; border:1px solid rgba(245,168,0,0.3); animation:gp-ripple var(--dur) ease-out infinite; animation-delay:var(--del); }

        /* ─ Animate in ─ */
        .gp-in { opacity:0; animation:gp-fadeUp 0.7s ease forwards; }

        /* ─ History tab btn ─ */
        .gp-htab { background:none; border:none; cursor:pointer; font-family:'Rajdhani',sans-serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:700; padding:12px 16px; transition:all 0.2s; border-bottom:2px solid transparent; margin-bottom:-1px; }
      `}</style>

      <div className="gp-page" style={{ paddingTop: topOffset, paddingBottom: isMobile ? 80 : 40 }}>

        {/* ══════════════════════════════════════
            EPIC 3D HERO
        ══════════════════════════════════════ */}
        <section className="gp-hero" style={{
          minHeight: isMobile ? 460 : 540,
          display: "flex", alignItems: "center",
          padding: `${isMobile ? 48 : 72}px ${sidePad}px`,
        }}>
          {/* Canvas particle engine */}
          <GiveCanvas />

          {/* Ripple rings */}
          {[120, 200, 300, 420].map((s, i) => (
            <div key={i} className="gp-ring" style={{
              width: s, height: s,
              top: "50%", left: isMobile ? "50%" : "68%",
              marginTop: -s / 2, marginLeft: -s / 2,
              "--dur": `${2.5 + i * 0.7}s`,
              "--del": `${i * 0.6}s`,
            }} />
          ))}

          {/* Floating 3D coins — desktop only */}
          {!isMobile && <>
            <RotatingCoin size={90}  symbol="₦" color="#F5A800" delay={0}   top="10%" left="58%" />
            <RotatingCoin size={60}  symbol="$" color="#22c55e" delay={1.2} top="55%" left="72%" />
            <RotatingCoin size={50}  symbol="£" color="#9333EA" delay={2.4} top="20%" left="80%" />
            <RotatingCoin size={70}  symbol="€" color="#06b6d4" delay={0.8} top="65%" left="60%" />
            <RotatingCoin size={45}  symbol="₵" color="#F5A800" delay={1.8} top="35%" right="4%" />
          </>}

          {/* Rain coins — subtle */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="gp-rain-coin" style={{
              left: `${8 + i * 12}%`,
              "--r": `${(i % 3 - 1) * 20}deg`,
              "--dur": `${5 + (i % 3)}s`,
              "--del": `${i * 0.7}s`,
            }}>
              {["🪙", "✦", "💰", "⭐"][i % 4]}
            </div>
          ))}

          {/* Hero content */}
          <div style={{ position: "relative", zIndex: 3, maxWidth: isMobile ? "100%" : 560 }}>
            <div className="gp-eyebrow gp-in" style={{ animationDelay: "0s" }}>
              <span className="gp-line" />
              Generosity · Kingdom Investment
            </div>

            <h1 className="gp-in" style={{
              fontFamily: "Cinzel, serif", fontWeight: 900,
              fontSize: isMobile ? 36 : isTablet ? 52 : 68,
              lineHeight: 0.95, marginBottom: 20,
              letterSpacing: "-2px",
              animationDelay: "0.1s",
            }}>
              <span className="gp-gold">Your Seed</span>
              <br />
              <span style={{
                color: "#fff",
                WebkitTextStroke: "1px rgba(245,168,0,0.3)",
              }}>Becomes</span>
              <br />
              <span style={{
                color: "transparent",
                WebkitTextStroke: "2px #F5A800",
                textShadow: "0 0 40px rgba(245,168,0,0.4)",
              }}>A Harvest</span>
            </h1>

            <p className="gp-in" style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: isMobile ? 16 : 20,
              fontStyle: "italic", fontWeight: 300,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.7, maxWidth: 440,
              marginBottom: 36,
              animationDelay: "0.2s",
            }}>
              "Give, and it will be given to you — a good measure, pressed down,
              shaken together and running over." — Luke 6:38
            </p>

            {/* Impact counters */}
            <div className="gp-in" style={{
              display: "flex", gap: isMobile ? 24 : 40, flexWrap: "wrap",
              animationDelay: "0.3s",
            }}>
              {[
                { num: "₦42M+", sub: "Given This Year",  color: "#F5A800" },
                { num: "1.2K+", sub: "Faithful Givers",  color: "#9333EA" },
                { num: "15",    sub: "Nations Impacted",  color: "#22c55e" },
              ].map((s, i) => (
                <div key={i} style={{ animation: `gp-countUp 0.6s ease ${0.4 + i * 0.15}s both` }}>
                  <div style={{
                    fontFamily: "Cinzel, serif", fontWeight: 900,
                    fontSize: isMobile ? 24 : 32,
                    color: s.color, lineHeight: 1, marginBottom: 4,
                    textShadow: `0 0 30px ${s.color}88`,
                  }}>{s.num}</div>
                  <div style={{
                    fontFamily: "Rajdhani, sans-serif",
                    fontSize: 9, letterSpacing: 3,
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.3)", fontWeight: 600,
                  }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="gp-in" style={{ marginTop: 36, animationDelay: "0.5s" }}>
              <button
                className="gp-submit"
                style={{ width: "auto", padding: "16px 48px", fontSize: 12 }}
                onClick={() => document.getElementById("give-form")?.scrollIntoView({ behavior: "smooth" })}
              >
                Give Now
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            GIVING FORM + HISTORY
        ══════════════════════════════════════ */}
        <section id="give-form" style={{
          padding: `72px ${sidePad}px`,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "1fr 360px",
          gap: isMobile ? 48 : 60,
          alignItems: "start",
          background: "linear-gradient(to bottom, #080500, #000)",
        }}>

          {/* ── LEFT: FORM ── */}
          <div>
            {/* Step indicator */}
            {step < 4 && (
              <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
                {["Fund", "Amount", "Pay"].map((label, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <div className={`gp-step ${step > i + 1 ? "done" : step === i + 1 ? "active" : "pending"}`}>
                        {step > i + 1 ? "✓" : i + 1}
                      </div>
                      <div style={{
                        fontFamily: "Rajdhani, sans-serif", fontSize: 9,
                        letterSpacing: 2, textTransform: "uppercase",
                        color: step === i + 1 ? "#F5A800" : "rgba(255,255,255,0.2)",
                        fontWeight: 700,
                      }}>{label}</div>
                    </div>
                    {i < 2 && (
                      <div style={{
                        flex: 1, height: 1, margin: "0 12px", marginBottom: 22,
                        background: step > i + 1
                          ? "linear-gradient(90deg, #22c55e, #22c55e)"
                          : "rgba(255,255,255,0.06)",
                        transition: "background 0.5s",
                      }} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* STEP 1 — FUND */}
            {step === 1 && (
              <div style={{ animation: "gp-slideIn 0.5s ease forwards" }}>
                <div className="gp-eyebrow"><span className="gp-line" />Step 1</div>
                <h2 style={{
                  fontFamily: "Cinzel, serif", fontSize: isMobile ? 24 : 32,
                  fontWeight: 700, color: "#fff", marginBottom: 8,
                }}>
                  Where Does Your Seed Go?
                </h2>
                <p style={{
                  fontFamily: "Cormorant Garamond, serif", fontSize: 16,
                  fontStyle: "italic", color: "rgba(255,255,255,0.4)", marginBottom: 28,
                }}>
                  Choose the ground where you want to plant your faith.
                </p>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)",
                  gap: 10, marginBottom: 36,
                }}>
                  {funds.map(f => (
                    <div
                      key={f.id}
                      className={`gp-fund ${selectedFund === f.id ? "sel" : ""}`}
                      style={{
                        "--fc": f.color,
                        borderColor: selectedFund === f.id ? f.color : "rgba(255,255,255,0.06)",
                        background: selectedFund === f.id
                          ? `radial-gradient(circle at 50% 50%, ${f.color}12, transparent)`
                          : "rgba(255,255,255,0.02)",
                        boxShadow: selectedFund === f.id ? `0 0 24px ${f.glow}` : "none",
                      }}
                      onClick={() => setSelectedFund(f.id)}
                    >
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
                      <div style={{
                        fontFamily: "Cinzel, serif", fontSize: 12,
                        fontWeight: 700,
                        color: selectedFund === f.id ? f.color : "rgba(255,255,255,0.7)",
                        transition: "color 0.3s",
                        letterSpacing: 0.5,
                      }}>{f.title}</div>
                      {selectedFund === f.id && (
                        <div style={{
                          position: "absolute", top: 8, right: 8,
                          width: 16, height: 16, borderRadius: "50%",
                          background: f.color, display: "flex",
                          alignItems: "center", justifyContent: "center",
                          fontSize: 9, color: "#000", fontWeight: 700,
                          animation: "gp-pulse 1.5s ease-in-out infinite",
                        }}>✓</div>
                      )}
                    </div>
                  ))}
                </div>

                <button className="gp-submit" onClick={() => setStep(2)}>
                  Plant in {fund?.title}
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            )}

            {/* STEP 2 — AMOUNT */}
            {step === 2 && (
              <div style={{ animation: "gp-slideIn 0.5s ease forwards" }}>
                <button className="gp-back" onClick={() => setStep(1)}>← Back</button>
                <div className="gp-eyebrow"><span className="gp-line" />Step 2</div>
                <h2 style={{
                  fontFamily: "Cinzel, serif", fontSize: isMobile ? 24 : 32,
                  fontWeight: 700, color: "#fff", marginBottom: 8,
                }}>
                  How Much Are You Sowing?
                </h2>
                <p style={{
                  fontFamily: "Cormorant Garamond, serif", fontSize: 16,
                  fontStyle: "italic", color: "rgba(255,255,255,0.4)", marginBottom: 28,
                }}>
                  Planting into: <span style={{ color: fund?.color }}>{fund?.icon} {fund?.title}</span>
                </p>

                {/* Frequency */}
                <div style={{
                  display: "flex", marginBottom: 28,
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}>
                  {[{ id:"once",label:"One-Time"},{id:"weekly",label:"Weekly"},{id:"monthly",label:"Monthly"}].map(f => (
                    <button key={f.id} className={`gp-freq ${frequency===f.id?"active":""}`}
                      onClick={() => setFrequency(f.id)}>{f.label}</button>
                  ))}
                </div>

                {!custom ? (
                  <>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
                      {quickAmounts.map(a => (
                        <div key={a} className={`gp-pill ${amount==a?"sel":""}`} onClick={() => setAmount(a)}>
                          ₦{a.toLocaleString()}
                        </div>
                      ))}
                    </div>
                    <div style={{ textAlign:"center", marginBottom:28 }}>
                      <span style={{
                        fontFamily:"Rajdhani,sans-serif", fontSize:11, letterSpacing:2,
                        color:"rgba(255,255,255,0.25)", cursor:"pointer",
                        textTransform:"uppercase", textDecoration:"underline",
                      }} onClick={() => setCustom(true)}>Enter custom amount</span>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign:"center", marginBottom:28 }}>
                    <div style={{
                      fontFamily:"Rajdhani,sans-serif", fontSize:10, letterSpacing:4,
                      color:"rgba(255,255,255,0.25)", marginBottom:8, textTransform:"uppercase",
                    }}>AMOUNT (₦)</div>
                    <input className="gp-amt-input" type="number" placeholder="0"
                      value={amount} onChange={e => setAmount(e.target.value)} />
                    <div style={{ marginTop:12, textAlign:"center" }}>
                      <span style={{
                        fontFamily:"Rajdhani,sans-serif", fontSize:11, letterSpacing:2,
                        color:"rgba(255,255,255,0.25)", cursor:"pointer",
                        textTransform:"uppercase", textDecoration:"underline",
                      }} onClick={() => { setCustom(false); setAmount(""); }}>
                        Choose preset
                      </span>
                    </div>
                  </div>
                )}

                {/* Summary */}
                {amount > 0 && (
                  <div className="gp-anim-border" style={{ marginBottom:24 }}>
                    <div style={{
                      background:"rgba(10,8,0,0.95)", borderRadius:8,
                      padding:"16px 20px",
                      display:"flex", justifyContent:"space-between", alignItems:"center",
                    }}>
                      <div style={{
                        fontFamily:"Cormorant Garamond,serif", fontSize:15,
                        fontStyle:"italic", color:"rgba(255,255,255,0.45)",
                      }}>
                        {frequency==="once"?"One-time":frequency} · {fund?.title}
                      </div>
                      <div style={{
                        fontFamily:"Cinzel,serif", fontSize:24,
                        fontWeight:900, color:"#F5A800",
                        textShadow:"0 0 20px rgba(245,168,0,0.5)",
                      }}>₦{Number(amount).toLocaleString()}</div>
                    </div>
                  </div>
                )}

                <button className="gp-submit" disabled={!amount||amount<=0} onClick={() => setStep(3)}>
                  Confirm Seed Amount
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            )}

            {/* STEP 3 — PAYMENT */}
            {step === 3 && (
              <div style={{ animation: "gp-slideIn 0.5s ease forwards" }}>
                <button className="gp-back" onClick={() => setStep(2)}>← Back</button>
                <div className="gp-eyebrow"><span className="gp-line" />Step 3</div>
                <h2 style={{
                  fontFamily:"Cinzel,serif", fontSize: isMobile ? 24 : 32,
                  fontWeight:700, color:"#fff", marginBottom:8,
                }}>Complete Your Gift</h2>
                <p style={{
                  fontFamily:"Cormorant Garamond,serif", fontSize:16,
                  fontStyle:"italic", color:"rgba(255,255,255,0.4)", marginBottom:28,
                }}>
                  Giving <span style={{ color:"#F5A800", fontWeight:600 }}>
                    ₦{Number(amount).toLocaleString()}
                  </span> → {fund?.icon} {fund?.title}
                </p>

                <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
                  <input className="gp-input" placeholder="Full Name *" value={name} onChange={e=>setName(e.target.value)} />
                  <input className="gp-input" placeholder="Email Address *" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
                  <input className="gp-input" placeholder="Phone (optional)" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} />
                </div>

                {/* Payment methods */}
                <div style={{ marginBottom:28 }}>
                  <div style={{
                    fontFamily:"Rajdhani,sans-serif", fontSize:10,
                    letterSpacing:4, textTransform:"uppercase",
                    color:"rgba(255,255,255,0.25)", marginBottom:14,
                  }}>Payment Method</div>
                  <div style={{ display:"flex", gap:10 }}>
                    {[
                      { id:"paystack",    label:"Paystack",      logo:"🟢", sub:"Card/Bank/USSD" },
                      { id:"flutterwave", label:"Flutterwave",   logo:"🌊", sub:"Card/MobileMoney" },
                      { id:"transfer",    label:"Bank Transfer", logo:"🏦", sub:"Direct Transfer" },
                    ].map(m => (
                      <div key={m.id} className={`gp-pay ${payMethod===m.id?"sel":""}`} onClick={()=>setPayMethod(m.id)}>
                        <div style={{ fontSize:22 }}>{m.logo}</div>
                        <div style={{
                          fontFamily:"Rajdhani,sans-serif", fontSize:10,
                          letterSpacing:1, fontWeight:700, textTransform:"uppercase",
                          color: payMethod===m.id ? "#F5A800" : "rgba(255,255,255,0.4)",
                          textAlign:"center", transition:"color 0.3s",
                        }}>{m.label}</div>
                        <div style={{
                          fontFamily:"Rajdhani,sans-serif", fontSize:9,
                          color:"rgba(255,255,255,0.2)", textAlign:"center",
                        }}>{m.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bank details */}
                {payMethod==="transfer" && (
                  <div style={{
                    background:"rgba(245,168,0,0.04)",
                    border:"1px solid rgba(245,168,0,0.15)",
                    borderRadius:6, padding:16, marginBottom:20,
                  }}>
                    {[
                      { l:"Bank",    v:"Zenith Bank" },
                      { l:"Account",v:"1234567890" },
                      { l:"Name",   v:"Zoe School of Mysteries" },
                    ].map((r,i) => (
                      <div key={i} style={{
                        display:"flex", justifyContent:"space-between",
                        padding:"6px 0",
                        borderBottom: i<2 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      }}>
                        <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>{r.l}</div>
                        <div style={{ fontFamily:"Cinzel,serif", fontSize:13, fontWeight:700, color:"#fff" }}>{r.v}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Summary */}
                <div style={{
                  background:"rgba(245,168,0,0.04)",
                  border:"1px solid rgba(245,168,0,0.12)",
                  borderRadius:6, padding:16, marginBottom:24,
                }}>
                  {[
                    { l:"Fund",      v:`${fund?.icon} ${fund?.title}` },
                    { l:"Amount",    v:`₦${Number(amount).toLocaleString()}`, gold:true },
                    { l:"Frequency", v: frequency==="once"?"One-time":frequency.charAt(0).toUpperCase()+frequency.slice(1) },
                    { l:"Method",    v: payMethod.charAt(0).toUpperCase()+payMethod.slice(1) },
                  ].map((r,i) => (
                    <div key={i} style={{
                      display:"flex", justifyContent:"space-between",
                      padding:"8px 0",
                      borderBottom: i<3 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}>
                      <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>{r.l}</div>
                      <div style={{ fontFamily:"Cinzel,serif", fontSize:13, fontWeight:700, color: r.gold?"#F5A800":"#fff" }}>{r.v}</div>
                    </div>
                  ))}
                </div>

                <button className="gp-submit" disabled={!name||!email||processing} onClick={handlePay}>
                  {processing ? (
                    <><div className="gp-spinner" />Processing your gift...</>
                  ) : (
                    <>Give ₦{Number(amount).toLocaleString()} Now 🙏</>
                  )}
                </button>
                <div style={{ textAlign:"center", marginTop:12, fontFamily:"Rajdhani,sans-serif", fontSize:10, letterSpacing:1, color:"rgba(255,255,255,0.15)" }}>
                  🔒 Encrypted & Secure
                </div>
              </div>
            )}

            {/* STEP 4 — SUCCESS */}
            {step === 4 && (
              <div style={{ textAlign:"center", padding:"40px 0", animation:"gp-fadeUp 0.6s ease forwards" }}>
                {/* Success rings */}
                <div style={{ position:"relative", width:100, height:100, margin:"0 auto 32px" }}>
                  {[1,2,3].map(i => (
                    <div key={i} style={{
                      position:"absolute", inset:`${-i*15}px`,
                      borderRadius:"50%",
                      border:`${i===1?2:1}px solid rgba(34,197,94,${0.4/i})`,
                      animation:`gp-successRing ${1+i*0.4}s ease-out ${i*0.2}s both`,
                    }} />
                  ))}
                  <div style={{
                    width:100, height:100, borderRadius:"50%",
                    background:"linear-gradient(135deg, #16a34a, #22c55e)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:40, boxShadow:"0 0 60px rgba(34,197,94,0.5)",
                    animation:"gp-countUp 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
                  }}>✓</div>
                </div>

                <h2 style={{ fontFamily:"Cinzel,serif", fontSize:isMobile?26:34, fontWeight:700, color:"#fff", marginBottom:10 }}>
                  Thank You, {name.split(" ")[0]}! 🙏
                </h2>
                <p style={{
                  fontFamily:"Cormorant Garamond,serif", fontSize:18,
                  fontStyle:"italic", color:"rgba(255,255,255,0.55)",
                  maxWidth:400, margin:"0 auto 28px", lineHeight:1.8,
                }}>
                  Your gift of <span style={{ color:"#F5A800", fontWeight:700 }}>
                    ₦{Number(amount).toLocaleString()}
                  </span> to {fund?.title} is received.
                  <br />God's return is a hundredfold. 🌱
                </p>

                <div style={{
                  display:"inline-block",
                  background:"rgba(34,197,94,0.08)",
                  border:"1px solid rgba(34,197,94,0.25)",
                  borderRadius:4, padding:"12px 24px", marginBottom:32,
                  fontFamily:"Rajdhani,sans-serif", fontSize:12, letterSpacing:2, color:"#22c55e",
                }}>
                  ✓ Confirmation sent to {email}
                </div>

                <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
                  <button className="gp-submit" style={{ width:"auto", padding:"14px 36px", fontSize:11 }} onClick={reset}>
                    Give Again
                  </button>
                  <button onClick={reset} style={{
                    fontFamily:"Rajdhani,sans-serif", fontSize:11, letterSpacing:3,
                    textTransform:"uppercase", fontWeight:700, color:"rgba(255,255,255,0.5)",
                    background:"transparent", border:"1px solid rgba(255,255,255,0.12)",
                    padding:"14px 36px", borderRadius:4, cursor:"pointer",
                  }}>Back to Home</button>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: HISTORY ── */}
          <div style={{ animation: "gp-fadeUp 0.7s ease 0.3s both" }}>
            <div style={{ borderBottom:"1px solid rgba(245,168,0,0.1)", marginBottom:24 }}>
              {[{ id:"history",label:"Giving History"},{ id:"stats",label:"My Stats"}].map(t => (
                <button key={t.id} className="gp-htab"
                  onClick={()=>setHistoryTab(t.id)}
                  style={{
                    color: historyTab===t.id ? "#F5A800" : "rgba(255,255,255,0.3)",
                    borderBottomColor: historyTab===t.id ? "#F5A800" : "transparent",
                  }}>
                  {t.label}
                </button>
              ))}
            </div>

            {historyTab==="history" && (
              <div>
                {givingHistory.map((h,i) => {
                  const f = funds.find(f => f.title === h.fund);
                  return (
                    <div key={i} className="gp-hrow">
                      <div style={{
                        width:38, height:38, borderRadius:"50%",
                        background:`${f?.color||"#F5A800"}18`,
                        border:`1px solid ${f?.color||"#F5A800"}44`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:16, flexShrink:0,
                      }}>{f?.icon||"✦"}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontFamily:"Cinzel,serif", fontSize:13, fontWeight:600, color:"#fff", marginBottom:2 }}>{h.fund}</div>
                        <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:10, color:"rgba(255,255,255,0.25)", letterSpacing:1 }}>{h.date}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontFamily:"Cinzel,serif", fontSize:15, fontWeight:700, color:"#F5A800" }}>₦{h.amount.toLocaleString()}</div>
                        <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:9, letterSpacing:2, color:"#22c55e", textTransform:"uppercase" }}>✓ {h.status}</div>
                      </div>
                    </div>
                  );
                })}
                <div style={{
                  marginTop:16, paddingTop:16,
                  borderTop:"1px solid rgba(245,168,0,0.12)",
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                }}>
                  <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:10, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,0.25)" }}>Total</div>
                  <div style={{ fontFamily:"Cinzel,serif", fontSize:22, fontWeight:900, color:"#F5A800", textShadow:"0 0 20px rgba(245,168,0,0.4)" }}>
                    ₦{total.toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {historyTab==="stats" && (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[
                  { l:"Total Given",     v:`₦${total.toLocaleString()}`,                                     icon:"💰", color:"#F5A800" },
                  { l:"Times Given",     v: givingHistory.length,                                             icon:"🙏", color:"#9333EA" },
                  { l:"Faithful Tithes",v: givingHistory.filter(h=>h.fund==="Tithe").length,                 icon:"✦",  color:"#22c55e" },
                  { l:"Avg Gift",        v:`₦${Math.round(total/givingHistory.length).toLocaleString()}`,    icon:"📊", color:"#06b6d4" },
                ].map((s,i) => (
                  <div key={i} className="gp-stat" style={{ animation:`gp-fadeUp 0.5s ease ${i*0.1}s both` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                      <div style={{
                        width:44, height:44, borderRadius:"50%",
                        background:`${s.color}18`, border:`1px solid ${s.color}33`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:18, flexShrink:0,
                      }}>{s.icon}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:9, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,0.25)", marginBottom:4 }}>{s.l}</div>
                        <div style={{ fontFamily:"Cinzel,serif", fontSize:22, fontWeight:900, color:s.color, textShadow:`0 0 20px ${s.color}66` }}>{s.v}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Streak bar */}
                <div className="gp-stat" style={{ marginTop:4 }}>
                  <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:9, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,0.25)", marginBottom:12 }}>
                    Weekly Giving Streak
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    {[1,1,1,1,1,0,1].map((a,i) => (
                      <div key={i} style={{
                        flex:1, height:8, borderRadius:4,
                        background: a ? "#F5A800" : "rgba(255,255,255,0.06)",
                        boxShadow: a ? "0 0 8px rgba(245,168,0,0.4)" : "none",
                        transition:"all 0.3s",
                      }} />
                    ))}
                  </div>
                  <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:11, color:"rgba(255,255,255,0.25)", marginTop:8, letterSpacing:0.5 }}>
                    6 of 7 weeks ✨
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>


        {/* ══════════════════════════════════════
            FAQ SECTION WITH STICKY SIDE NAV
        ══════════════════════════════════════ */}
        <section id="give-faq" style={{
          padding: `72px 0`,
          background: "#000",
          borderTop: "1px solid rgba(245,168,0,0.08)",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "1fr 220px",
            maxWidth: 1200,
            margin: "0 auto",
            gap: 0,
            position: "relative",
            flexDirection: "row-reverse",
          }}>

            {/* ── LEFT: FAQs ── */}
            <div style={{ padding: `0 ${sidePad}px`, order: isMobile ? 2 : 1 }}>

              {/* Section IDs for scroll spy */}
              <div id="give-about" style={{ paddingTop: 8 }} />
              <div className="gp-eyebrow" style={{ marginBottom: 12 }}>
                <span className="gp-line" />FAQs
              </div>
              <h2 style={{
                fontFamily: "Cinzel, serif",
                fontSize: isMobile ? 32 : 48,
                fontWeight: 900, color: "#fff",
                marginBottom: 48,
                lineHeight: 1.05,
              }}>FAQs</h2>

              {/* FAQ accordion */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.07)",
                      transition: "background 0.3s",
                      background: openFaq === i ? "rgba(245,168,0,0.03)" : "transparent",
                    }}
                  >
                    {/* Question row */}
                    <div
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between",
                        padding: "22px 0",
                        cursor: "pointer",
                        gap: 20,
                      }}
                    >
                      <span style={{
                        fontFamily: "Cormorant Garamond, serif",
                        fontSize: isMobile ? 17 : 20,
                        fontWeight: 400,
                        color: openFaq === i ? "#F5A800" : "#fff",
                        lineHeight: 1.4,
                        transition: "color 0.3s",
                        flex: 1,
                      }}>{faq.q}</span>

                      {/* Chevron */}
                      <div style={{
                        width: 32, height: 32,
                        borderRadius: "50%",
                        border: `1px solid ${openFaq === i ? "rgba(245,168,0,0.4)" : "rgba(255,255,255,0.12)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.3s",
                        background: openFaq === i ? "rgba(245,168,0,0.08)" : "transparent",
                        transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                      }}>
                        <svg width="12" height="12" fill="none" stroke={openFaq === i ? "#F5A800" : "rgba(255,255,255,0.5)"} strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </div>
                    </div>

                    {/* Answer — animated expand */}
                    <div style={{
                      maxHeight: openFaq === i ? 300 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
                    }}>
                      <p style={{
                        fontFamily: "Cormorant Garamond, serif",
                        fontSize: isMobile ? 15 : 17,
                        fontWeight: 300,
                        color: "rgba(255,255,255,0.55)",
                        lineHeight: 1.8,
                        paddingBottom: 24,
                        paddingRight: isMobile ? 0 : 40,
                      }}>{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div style={{
                marginTop: 48,
                padding: "28px 32px",
                background: "rgba(245,168,0,0.05)",
                border: "1px solid rgba(245,168,0,0.15)",
                borderRadius: 6,
                display: "flex",
                alignItems: isMobile ? "flex-start" : "center",
                justifyContent: "space-between",
                flexDirection: isMobile ? "column" : "row",
                gap: 16,
              }}>
                <div>
                  <div style={{
                    fontFamily: "Cinzel, serif", fontSize: 16,
                    fontWeight: 700, color: "#fff", marginBottom: 6,
                  }}>Still have questions?</div>
                  <div style={{
                    fontFamily: "Cormorant Garamond, serif", fontSize: 15,
                    fontStyle: "italic", color: "rgba(255,255,255,0.45)",
                  }}>
                    Our team is happy to help you with anything giving-related.
                  </div>
                </div>
                <a href="#contact" style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: 11, letterSpacing: 3,
                  textTransform: "uppercase", fontWeight: 700,
                  color: "#000", background: "#F5A800",
                  padding: "12px 28px", borderRadius: 2,
                  textDecoration: "none", whiteSpace: "nowrap",
                  transition: "all 0.3s", flexShrink: 0,
                }}>Contact Us</a>
              </div>
            </div>

            {/* ── RIGHT: Sticky Side Nav ── */}
            {!isMobile && (
              <div style={{
                order: 2,
                borderLeft: "1px solid rgba(255,255,255,0.07)",
                paddingLeft: 32,
                paddingRight: sidePad,
              }}>
                <div style={{
                  position: "sticky",
                  top: isTablet ? 100 : 110,
                }}>
                  {sideNavItems.map((item, i) => (
                    <a
                      key={i}
                      href={`#${item.id}`}
                      onClick={e => {
                        e.preventDefault();
                        setActiveSection(item.id);
                        document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                      }}
                      style={{
                        display: "block",
                        fontFamily: "Rajdhani, sans-serif",
                        fontSize: 14,
                        fontWeight: activeSection === item.id ? 700 : 500,
                        letterSpacing: 0.5,
                        color: activeSection === item.id ? "#fff" : "rgba(255,255,255,0.4)",
                        textDecoration: "none",
                        padding: "10px 0 10px 16px",
                        borderLeft: `2px solid ${activeSection === item.id ? "#F5A800" : "transparent"}`,
                        transition: "all 0.25s",
                        marginBottom: 4,
                      }}
                      onMouseEnter={e => {
                        if (activeSection !== item.id) {
                          e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                          e.currentTarget.style.borderLeftColor = "rgba(245,168,0,0.3)";
                        }
                      }}
                      onMouseLeave={e => {
                        if (activeSection !== item.id) {
                          e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                          e.currentTarget.style.borderLeftColor = "transparent";
                        }
                      }}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </>
  );
}
