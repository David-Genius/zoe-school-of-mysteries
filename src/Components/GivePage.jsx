import { useState, useEffect, useRef } from "react";
import { saveGiving } from "./firebase";
import { auth } from "./firebase";
import { PaystackButton } from "react-paystack";

const PAYSTACK_PUBLIC_KEY = "pk_live_1af67de38b73b2970449528f2068245e1d9f3a32";

function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

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
    const coins = Array.from({ length: 22 }, (_, i) => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: 6 + Math.random() * 18, vx: (Math.random() - 0.5) * 0.4,
      vy: -0.3 - Math.random() * 0.6, rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.03, alpha: 0.15 + Math.random() * 0.5,
      color: ["#F5A800", "#FFD166", "#C88600", "#9333EA", "#fff"][i % 5],
    }));
    const sparks = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      size: Math.random() * 2.5, alpha: Math.random(),
      speed: 0.005 + Math.random() * 0.015, phase: Math.random() * Math.PI * 2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < coins.length; i++) {
        for (let j = i + 1; j < coins.length; j++) {
          const dx = coins[i].x - coins[j].x, dy = coins[i].y - coins[j].y;
          const dist = Math.sqrt(dx*dx+dy*dy);
          if (dist < 160) {
            ctx.beginPath(); ctx.moveTo(coins[i].x,coins[i].y); ctx.lineTo(coins[j].x,coins[j].y);
            ctx.strokeStyle=`rgba(245,168,0,${0.06*(1-dist/160)})`; ctx.lineWidth=0.5; ctx.stroke();
          }
        }
      }
      coins.forEach(c => {
        ctx.save(); ctx.translate(c.x,c.y); ctx.rotate(c.rot); ctx.globalAlpha=c.alpha;
        ctx.beginPath(); ctx.ellipse(0,0,c.r,c.r*0.35,0,0,Math.PI*2); ctx.fillStyle=c.color; ctx.fill();
        ctx.beginPath(); ctx.ellipse(0,c.r*0.1,c.r*0.95,c.r*0.28,0,0,Math.PI*2); ctx.fillStyle=c.color+"88"; ctx.fill();
        ctx.beginPath(); ctx.ellipse(-c.r*0.2,-c.r*0.05,c.r*0.3,c.r*0.1,-0.4,0,Math.PI*2); ctx.fillStyle="rgba(255,255,255,0.5)"; ctx.fill();
        ctx.restore();
        c.x+=c.vx; c.y+=c.vy; c.rot+=c.rotV;
        if(c.y<-c.r*2){c.y=canvas.height+c.r;c.x=Math.random()*canvas.width;}
        if(c.x<-c.r*2) c.x=canvas.width+c.r;
        if(c.x>canvas.width+c.r*2) c.x=-c.r;
      });
      const t=Date.now()*0.001;
      sparks.forEach(s=>{
        const a=Math.abs(Math.sin(t*s.speed*10+s.phase));
        ctx.beginPath(); ctx.arc(s.x,s.y,s.size*a,0,Math.PI*2);
        ctx.fillStyle=`rgba(245,168,0,${a*0.6})`; ctx.fill();
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  }, []);
  return <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} />;
}

function RotatingCoin({ size=100, symbol="₦", color="#F5A800", delay=0, top, left, right, bottom }) {
  return (
    <div style={{position:"absolute",top,left,right,bottom,width:size,height:size,perspective:800,pointerEvents:"none",zIndex:2}}>
      <style>{`
        @keyframes coin-spin-${delay*10|0}{0%{transform:rotateY(0deg) rotateX(${15+delay*5}deg)}100%{transform:rotateY(360deg) rotateX(${15+delay*5}deg)}}
        @keyframes coin-float-${delay*10|0}{0%,100%{margin-top:0px}50%{margin-top:${-12-delay*4}px}}
      `}</style>
      <div style={{width:"100%",height:"100%",transformStyle:"preserve-3d",animation:`coin-spin-${delay*10|0} ${3+delay*0.8}s linear infinite, coin-float-${delay*10|0} ${2.5+delay*0.5}s ease-in-out infinite`,animationDelay:`${delay}s`}}>
        <div style={{position:"absolute",inset:0,borderRadius:"50%",background:`radial-gradient(circle at 35% 30%, ${color}ff, ${color}88)`,backfaceVisibility:"hidden",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 30px ${color}66, inset 0 2px 4px rgba(255,255,255,0.3)`,border:`2px solid ${color}cc`}}>
          <span style={{fontFamily:"Cinzel,serif",fontWeight:900,fontSize:size*0.35,color:"#000",textShadow:"0 1px 2px rgba(255,255,255,0.4)"}}>{symbol}</span>
        </div>
        <div style={{position:"absolute",inset:0,borderRadius:"50%",background:`radial-gradient(circle at 65% 70%, ${color}cc, ${color}44)`,backfaceVisibility:"hidden",transform:"rotateY(180deg)",border:`2px solid ${color}88`}} />
        <div style={{position:"absolute",width:"100%",height:"100%",borderRadius:"50%",background:`linear-gradient(to right, ${color}22, ${color}88, ${color}22)`,transform:"rotateY(90deg) scaleX(0.1)"}} />
      </div>
    </div>
  );
}

const funds = [
  { id:"tithe",       title:"Tithe",        icon:"✦", color:"#F5A800", glow:"rgba(245,168,0,0.3)"  },
  { id:"offering",    title:"Offering",      icon:"🕊", color:"#9333EA", glow:"rgba(147,51,234,0.3)" },
  { id:"building",    title:"Building Fund", icon:"⛪", color:"#06b6d4", glow:"rgba(6,182,212,0.3)"  },
  { id:"missions",    title:"Missions",      icon:"🌍", color:"#22c55e", glow:"rgba(34,197,94,0.3)"  },
  { id:"scholarship", title:"Scholarship",   icon:"📖", color:"#f97316", glow:"rgba(249,115,22,0.3)" },
  { id:"special",     title:"Special Seed",  icon:"🌱", color:"#ec4899", glow:"rgba(236,72,153,0.3)" },
];

const quickAmounts = [1000, 2500, 5000, 10000, 25000, 50000];

const scriptures = [
  { verse:"Give, and it will be given to you — good measure, pressed down, shaken together and running over.", ref:"Luke 6:38" },
  { verse:"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.", ref:"2 Corinthians 9:7" },
  { verse:"Bring the whole tithe into the storehouse... and see if I will not throw open the floodgates of heaven.", ref:"Malachi 3:10" },
  { verse:"Honor the Lord with your wealth, with the firstfruits of all your crops; then your barns will be filled to overflowing.", ref:"Proverbs 3:9–10" },
];

const faqs = [
  { q:"How can I make a donation?", a:"You can give by using our secure online payment option through Paystack (card, bank transfer, USSD) or by sending your donation manually through the bank account details provided on this page." },
  { q:"Is my payment through Paystack secure?", a:"Yes. Paystack provides a fully encrypted and secure payment system that protects your payment information during every transaction." },
  { q:"How do I donate through Paystack?", a:'Click on the "Give Now" button, select your fund, enter your donation amount, fill in your details, and follow the payment instructions to complete your transaction.' },
  { q:"How can I give through bank transfer?", a:'Select "Bank Transfer" as your payment method on the giving page. The bank account details for Fidelity Bank will be displayed. Send your donation, then submit your payment proof for confirmation.' },
  { q:"I made a bank transfer, how do I confirm my donation?", a:"After completing the transfer, upload your payment receipt, enter the last 4 digits of the account you sent from, and confirm your submission. You can also reach us on WhatsApp at 07082129744 or 09167212492." },
  { q:"Can I donate any amount?", a:"Yes. You can give any amount you feel led to sow. Every seed — no matter how small — supports the mission and vision of Zoe School of Mysteries." },
  { q:"My Paystack payment failed. What should I do?", a:"Check your internet connection and ensure your card or account details are correct, then try again. If the issue continues, contact us on WhatsApp at 07082129744 or 09167212492." },
  { q:"My money was deducted but my donation is not showing. What should I do?", a:"Please wait a few minutes for payment confirmation to process. If it still does not update, contact us on WhatsApp with your transaction reference and we will resolve it promptly." },
  { q:"Can I donate from another country?", a:"Yes! Paystack supports eligible international card payments. We also have USD, GBP, and EUR Fidelity Bank accounts for direct international transfers. Contact us on WhatsApp for assistance." },
  { q:"Will I receive confirmation after giving?", a:"Yes. After your donation is confirmed, you will receive an acknowledgement. For Paystack payments, you will see a success screen immediately after payment." },
  { q:"Is my donation refundable?", a:"Donations are generally considered final as they go directly to support the ministry. If there is an issue with a transaction, please contact us on WhatsApp at 07082129744 or 09167212492 for assistance." },
  { q:"Who can I contact if I have problems with giving?", a:"Contact our support team on WhatsApp: 07082129744 or 09167212492. We are happy to assist you with any giving-related questions." },
];

const sideNavItems = [
  { id:"give-form", label:"Give Now" },
  { id:"give-faq",  label:"FAQs"     },
];

function ImpactPanel() {
  const [verseIndex, setVerseIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setVerseIndex(v => (v+1) % scriptures.length), 6000);
    return () => clearInterval(t);
  }, []);
  const verse = scriptures[verseIndex];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <div style={{background:"rgba(245,168,0,0.04)",border:"1px solid rgba(245,168,0,0.18)",borderRadius:8,padding:"24px 20px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:8,left:14,fontFamily:"Cinzel,serif",fontSize:72,color:"rgba(245,168,0,0.07)",lineHeight:1,fontWeight:900,userSelect:"none"}}>"</div>
        <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:17,fontStyle:"italic",fontWeight:400,color:"rgba(255,255,255,0.75)",lineHeight:1.8,marginBottom:12,position:"relative",zIndex:1}}>"{verse.verse}"</p>
        <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"#F5A800",fontWeight:700}}>— {verse.ref}</div>
        <div style={{display:"flex",gap:5,marginTop:16}}>
          {scriptures.map((_,i)=>(
            <div key={i} onClick={()=>setVerseIndex(i)} style={{width:i===verseIndex?16:5,height:5,borderRadius:3,background:i===verseIndex?"#F5A800":"rgba(245,168,0,0.2)",cursor:"pointer",transition:"all 0.4s"}} />
          ))}
        </div>
      </div>
      <div style={{background:"rgba(147,51,234,0.06)",border:"1px solid rgba(147,51,234,0.2)",borderRadius:8,padding:"18px 20px"}}>
        <div style={{fontFamily:"Cinzel,serif",fontSize:13,fontWeight:700,color:"#9333EA",marginBottom:8,letterSpacing:0.5}}>🙏 A Prayer Before You Give</div>
        <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:15,fontStyle:"italic",fontWeight:300,color:"rgba(255,255,255,0.5)",lineHeight:1.8,margin:0}}>
          Lord, I give this offering as an act of worship and trust. May it be used to advance Your kingdom and bless others as You have blessed me. Amen.
        </p>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"10px 0"}}>
        <div style={{fontSize:14}}>🔒</div>
        <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.18)",fontWeight:700}}>All transactions are encrypted &amp; secure</div>
      </div>
    </div>
  );
}

// ── BANK ACCOUNTS ──
const bankAccounts = [
  { currency:"NGN ₦", number:"4011637348" },
  { currency:"USD $", number:"5250575202" },
  { currency:"GBP £", number:"52505575219" },
  { currency:"EUR €", number:"5250575233" },
];

export default function GivePage() {
  const width    = useWidth();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const sidePad  = isMobile ? 20 : isTablet ? 32 : 64;
  const topOffset= isMobile ? 130 : 76;

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
  const [openFaq,      setOpenFaq]      = useState(null);
  const [activeSection,setActiveSection]= useState("give-about");
  const [copiedIndex,  setCopiedIndex]  = useState(null);

  // Transfer confirmation state
  const [receiptFile,    setReceiptFile]    = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [last4Digits,    setLast4Digits]    = useState("");
  const [confirmed,      setConfirmed]      = useState(false);

  const fund = funds.find(f => f.id === selectedFund);

  const paystackConfig = {
    reference: `zoe_${Date.now()}`,
    email,
    amount: Number(amount) * 100,
    publicKey: PAYSTACK_PUBLIC_KEY,
    metadata: { name, phone, fund: selectedFund, frequency },
  };

  const onPaystackSuccess = async (reference) => {
    setProcessing(true);
    try {
      await saveGiving({
        uid: auth.currentUser?.uid || null,
        name, email, phone,
        amount: Number(amount),
        fund: selectedFund,
        frequency,
        method: "paystack",
        reference: reference.reference,
        status: "confirmed",
        createdAt: new Date(),
      });
      setStep(4);
    } catch (err) {
      console.error(err);
      alert("Payment received but failed to save record. Please contact support.");
    }
    setProcessing(false);
  };

  const onPaystackClose = () => {};

  // ── FIXED: receipt mandatory + WhatsApp forwarding ──
  const handleManualPay = async () => {
    if (!name || !email) return;
    if (!confirmed) return alert("Please confirm that you have made the transfer.");
    if (!last4Digits || last4Digits.length < 4) return alert("Please enter the last 4 digits of the account you sent from.");
    if (!receiptFile) return alert("Please upload your payment receipt before submitting.");

    setProcessing(true);
    try {
      // Save text record to Firestore (no file upload = free tier)
      await saveGiving({
        uid: auth.currentUser?.uid || null,
        name, email, phone,
        amount: Number(amount),
        fund: selectedFund,
        frequency,
        method: "bank_transfer",
        status: "pending",
        last4Digits,
        hasReceipt: true,
        createdAt: new Date(),
      });

      // Build WhatsApp pre-filled message with all giving details
      const msg = encodeURIComponent(
        `🙏 *New Giving Record — Zoe School of Mysteries*\n\n` +
        `*Name:* ${name}\n` +
        `*Email:* ${email}\n` +
        `*Phone:* ${phone || "—"}\n` +
        `*Fund:* ${fund?.title}\n` +
        `*Amount:* ₦${Number(amount).toLocaleString()}\n` +
        `*Frequency:* ${frequency === "once" ? "One-time" : frequency}\n` +
        `*Last 4 digits of sending account:* ${last4Digits}\n\n` +
        `📎 *Receipt is attached as the next message.*`
      );

      // Open WhatsApp with pre-filled message — giver attaches receipt image right after
      window.open(`https://wa.me/2347036100912?text=${msg}`, "_blank");

      setStep(4);
    } catch (err) {
      console.error(err);
      alert("Failed to save giving record. Please try again.");
    }
    setProcessing(false);
  };

  const handleCopy = (number, index) => {
    navigator.clipboard.writeText(number);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReceiptFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setReceiptPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setStep(1); setAmount(""); setName(""); setEmail(""); setPhone("");
    setCustom(false); setPayMethod("paystack");
    setReceiptFile(null); setReceiptPreview(null);
    setLast4Digits(""); setConfirmed(false);
  };

  // ── FIXED: receipt is now required ──
  const transferReady = name && email && confirmed && last4Digits.length >= 4 && !!receiptFile;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Rajdhani:wght@500;600;700&display=swap');

        @keyframes gp-fadeUp   { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gp-shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes gp-pulse    { 0%,100%{transform:scale(1);opacity:0.7} 50%{transform:scale(1.15);opacity:1} }
        @keyframes gp-spin     { to{transform:rotate(360deg)} }
        @keyframes gp-hexRotate{ to{transform:rotate(360deg)} }
        @keyframes gp-successRing{0%{transform:scale(0);opacity:1}100%{transform:scale(3);opacity:0}}
        @keyframes gp-ripple   {0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.5);opacity:0}}
        @keyframes gp-slideIn  {from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
        @keyframes gp-countUp  {from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}
        @keyframes gp-rain     {0%{transform:translateY(-20px) rotate(var(--r));opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(100vh) rotate(var(--r));opacity:0}}

        .gp-page{background:#000;min-height:100vh;font-family:'Rajdhani',sans-serif;}
        .gp-hero{position:relative;overflow:hidden;background:radial-gradient(ellipse 80% 60% at 50% 40%,#1a0a00 0%,#000 70%);border-bottom:1px solid rgba(245,168,0,0.15);}
        .gp-hero::before{content:'';position:absolute;top:-50%;left:-20%;width:140%;height:200%;background:repeating-linear-gradient(-45deg,transparent,transparent 60px,rgba(245,168,0,0.02) 60px,rgba(245,168,0,0.02) 61px);pointer-events:none;}
        .gp-gold{background:linear-gradient(135deg,#C88600 0%,#F5A800 30%,#FFD166 50%,#F5A800 70%,#C88600 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:gp-shimmer 3s linear infinite;}
        .gp-anim-border{position:relative;background:rgba(10,8,0,0.9);border-radius:8px;overflow:hidden;}
        .gp-anim-border::before{content:'';position:absolute;inset:-2px;background:conic-gradient(from 0deg,#F5A800,#FFD166,#9333EA,#F5A800,transparent,transparent,#F5A800);border-radius:10px;animation:gp-hexRotate 3s linear infinite;z-index:0;opacity:0;transition:opacity 0.3s;}
        .gp-anim-border:hover::before{opacity:1;}
        .gp-anim-border > *{position:relative;z-index:1;}
        .gp-fund{border-radius:6px;padding:18px 14px;cursor:pointer;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1);position:relative;overflow:hidden;text-align:center;}
        .gp-fund::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,var(--fc) 0%,transparent 70%);opacity:0;transition:opacity 0.3s;}
        .gp-fund:hover,.gp-fund.sel{transform:translateY(-5px) scale(1.03);}
        .gp-fund:hover::after,.gp-fund.sel::after{opacity:0.08;}
        .gp-pill{border-radius:4px;padding:14px 8px;cursor:pointer;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.02);font-family:'Cinzel',serif;font-size:14px;font-weight:700;color:rgba(255,255,255,0.5);text-align:center;transition:all 0.25s;}
        .gp-pill:hover{border-color:rgba(245,168,0,0.5);color:#F5A800;background:rgba(245,168,0,0.06);transform:scale(1.04);}
        .gp-pill.sel{border-color:#F5A800;color:#F5A800;background:rgba(245,168,0,0.12);box-shadow:0 0 20px rgba(245,168,0,0.2);}
        .gp-amt-input{width:100%;background:transparent;border:none;border-bottom:2px solid rgba(245,168,0,0.3);color:#F5A800;font-family:'Cinzel',serif;font-size:48px;font-weight:900;text-align:center;outline:none;transition:border-color 0.3s;text-shadow:0 0 40px rgba(245,168,0,0.4);}
        .gp-amt-input:focus{border-bottom-color:#F5A800;}
        .gp-amt-input::placeholder{color:rgba(245,168,0,0.15);}
        .gp-input{width:100%;background:rgba(245,168,0,0.04);border:1px solid rgba(245,168,0,0.15);border-radius:4px;padding:14px 16px;color:#fff;font-family:'Rajdhani',sans-serif;font-size:14px;letter-spacing:0.5px;outline:none;transition:border-color 0.3s,box-shadow 0.3s;box-sizing:border-box;}
        .gp-input:focus{border-color:#F5A800;box-shadow:0 0 20px rgba(245,168,0,0.15);}
        .gp-input::placeholder{color:rgba(255,255,255,0.2);}
        .gp-submit{width:100%;padding:18px;background:linear-gradient(135deg,#C88600,#F5A800,#FFD166,#F5A800);background-size:300% auto;color:#000;border:none;border-radius:4px;font-family:'Cinzel',serif;font-size:14px;letter-spacing:3px;text-transform:uppercase;font-weight:900;cursor:pointer;transition:all 0.4s;display:flex;align-items:center;justify-content:center;gap:10px;position:relative;overflow:hidden;}
        .gp-submit:hover:not(:disabled){background-position:right center;transform:translateY(-3px);box-shadow:0 10px 40px rgba(245,168,0,0.5),0 0 80px rgba(245,168,0,0.2);}
        .gp-submit::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);transition:left 0.5s;}
        .gp-submit:hover::before{left:100%;}
        .gp-submit:disabled{opacity:0.5;cursor:not-allowed;}
        .gp-pay{flex:1;padding:16px 10px;border-radius:6px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.02);cursor:pointer;transition:all 0.3s;display:flex;flex-direction:column;align-items:center;gap:6px;}
        .gp-pay:hover{border-color:rgba(245,168,0,0.3);transform:translateY(-3px);}
        .gp-pay.sel{border-color:#F5A800;background:rgba(245,168,0,0.08);box-shadow:0 0 20px rgba(245,168,0,0.15);}
        .gp-spinner{width:20px;height:20px;border-radius:50%;border:2px solid rgba(0,0,0,0.3);border-top-color:#000;animation:gp-spin 0.8s linear infinite;}
        .gp-step{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Cinzel',serif;font-size:12px;font-weight:700;transition:all 0.4s;}
        .gp-step.done{background:#22c55e;color:#000;box-shadow:0 0 20px rgba(34,197,94,0.4);}
        .gp-step.active{background:#F5A800;color:#000;box-shadow:0 0 20px rgba(245,168,0,0.5);animation:gp-pulse 2s ease-in-out infinite;}
        .gp-step.pending{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.25);}
        .gp-freq{flex:1;padding:10px;border:none;cursor:pointer;font-family:'Rajdhani',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;background:transparent;color:rgba(255,255,255,0.3);transition:all 0.25s;border-bottom:2px solid transparent;}
        .gp-freq.active{color:#F5A800;border-bottom-color:#F5A800;}
        .gp-back{background:none;border:none;cursor:pointer;font-family:'Rajdhani',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:rgba(255,255,255,0.35);display:flex;align-items:center;gap:6px;padding:0;margin-bottom:24px;transition:color 0.2s;}
        .gp-back:hover{color:#F5A800;}
        .gp-rain-coin{position:absolute;font-size:20px;animation:gp-rain var(--dur) linear infinite;animation-delay:var(--del);opacity:0;pointer-events:none;}
        .gp-eyebrow{display:flex;align-items:center;gap:10px;font-family:'Rajdhani',sans-serif;font-size:11px;letter-spacing:5px;text-transform:uppercase;color:#F5A800;margin-bottom:16px;}
        .gp-line{width:24px;height:1px;background:#F5A800;display:inline-block;}
        .gp-ring{position:absolute;border-radius:50%;border:1px solid rgba(245,168,0,0.3);animation:gp-ripple var(--dur) ease-out infinite;animation-delay:var(--del);}
        .gp-in{opacity:0;animation:gp-fadeUp 0.7s ease forwards;}
        .gp-upload-zone{border:2px dashed rgba(245,168,0,0.25);border-radius:6px;padding:20px;text-align:center;cursor:pointer;transition:all 0.3s;background:rgba(245,168,0,0.02);}
        .gp-upload-zone:hover{border-color:rgba(245,168,0,0.5);background:rgba(245,168,0,0.05);}
        .gp-checkbox{width:18px;height:18px;border:2px solid rgba(245,168,0,0.4);border-radius:3px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;flex-shrink:0;}
        .gp-checkbox.checked{background:#F5A800;border-color:#F5A800;}
        .paystack-btn-wrapper button{width:100% !important;padding:18px !important;background:linear-gradient(135deg,#C88600,#F5A800,#FFD166,#F5A800) !important;background-size:300% auto !important;color:#000 !important;border:none !important;border-radius:4px !important;font-family:'Cinzel',serif !important;font-size:14px !important;letter-spacing:3px !important;text-transform:uppercase !important;font-weight:900 !important;cursor:pointer !important;transition:all 0.4s !important;}
        .paystack-btn-wrapper button:hover{background-position:right center !important;transform:translateY(-3px) !important;box-shadow:0 10px 40px rgba(245,168,0,0.5) !important;}
        .paystack-btn-wrapper button:disabled{opacity:0.5 !important;cursor:not-allowed !important;}
      `}</style>

      <div className="gp-page" style={{paddingTop:topOffset,paddingBottom:isMobile?80:40}}>

        {/* HERO */}
        <section className="gp-hero" style={{minHeight:isMobile?460:540,display:"flex",alignItems:"center",padding:`${isMobile?48:72}px ${sidePad}px`}}>
          <GiveCanvas />
          {[120,200,300,420].map((s,i)=>(
            <div key={i} className="gp-ring" style={{width:s,height:s,top:"50%",left:isMobile?"50%":"68%",marginTop:-s/2,marginLeft:-s/2,"--dur":`${2.5+i*0.7}s`,"--del":`${i*0.6}s`}} />
          ))}
          {!isMobile && <>
            <RotatingCoin size={90} symbol="₦" color="#F5A800" delay={0}   top="10%" left="58%" />
            <RotatingCoin size={60} symbol="$" color="#22c55e" delay={1.2} top="55%" left="72%" />
            <RotatingCoin size={50} symbol="£" color="#9333EA" delay={2.4} top="20%" left="80%" />
            <RotatingCoin size={70} symbol="€" color="#06b6d4" delay={0.8} top="65%" left="60%" />
            <RotatingCoin size={45} symbol="₵" color="#F5A800" delay={1.8} top="35%" right="4%" />
          </>}
          {Array.from({length:8}).map((_,i)=>(
            <div key={i} className="gp-rain-coin" style={{left:`${8+i*12}%`,"--r":`${(i%3-1)*20}deg`,"--dur":`${5+(i%3)}s`,"--del":`${i*0.7}s`}}>
              {["🪙","✦","💰","⭐"][i%4]}
            </div>
          ))}
          <div style={{position:"relative",zIndex:3,maxWidth:isMobile?"100%":560}}>
            <div className="gp-eyebrow gp-in" style={{animationDelay:"0s"}}><span className="gp-line" />Generosity · Kingdom Investment</div>
            <h1 className="gp-in" style={{fontFamily:"Cinzel,serif",fontWeight:900,fontSize:isMobile?36:isTablet?52:68,lineHeight:0.95,marginBottom:20,letterSpacing:"-2px",animationDelay:"0.1s"}}>
              <span className="gp-gold">Your Seed</span><br />
              <span style={{color:"#fff",WebkitTextStroke:"1px rgba(245,168,0,0.3)"}}>Becomes</span><br />
              <span style={{color:"transparent",WebkitTextStroke:"2px #F5A800",textShadow:"0 0 40px rgba(245,168,0,0.4)"}}>A Harvest</span>
            </h1>
            <p className="gp-in" style={{fontFamily:"Cormorant Garamond,serif",fontSize:isMobile?16:20,fontStyle:"italic",fontWeight:300,color:"rgba(255,255,255,0.6)",lineHeight:1.7,maxWidth:440,marginBottom:36,animationDelay:"0.2s"}}>
              "Give, and it will be given to you — a good measure, pressed down, shaken together and running over." — Luke 6:38
            </p>
            <div className="gp-in" style={{display:"flex",gap:isMobile?24:40,flexWrap:"wrap",animationDelay:"0.3s"}}>
              {[{num:"₦42M+",sub:"Given This Year",color:"#F5A800"},{num:"1.2K+",sub:"Faithful Givers",color:"#9333EA"},{num:"15",sub:"Nations Impacted",color:"#22c55e"}].map((s,i)=>(
                <div key={i} style={{animation:`gp-countUp 0.6s ease ${0.4+i*0.15}s both`}}>
                  <div style={{fontFamily:"Cinzel,serif",fontWeight:900,fontSize:isMobile?24:32,color:s.color,lineHeight:1,marginBottom:4,textShadow:`0 0 30px ${s.color}88`}}>{s.num}</div>
                  <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:9,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,0.3)",fontWeight:600}}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="gp-in" style={{marginTop:36,animationDelay:"0.5s"}}>
              <button className="gp-submit" style={{width:"auto",padding:"16px 48px",fontSize:12}} onClick={()=>document.getElementById("give-form")?.scrollIntoView({behavior:"smooth"})}>
                Give Now
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
              </button>
            </div>
          </div>
        </section>

        {/* FORM SECTION */}
        <section id="give-form" style={{padding:`72px ${sidePad}px`,display:"grid",gridTemplateColumns:isMobile?"1fr":isTablet?"1fr":"1fr 360px",gap:isMobile?48:60,alignItems:"start",background:"linear-gradient(to bottom, #080500, #000)"}}>

          <div>
            {step < 4 && (
              <div style={{display:"flex",alignItems:"center",marginBottom:40}}>
                {["Fund","Amount","Pay"].map((label,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",flex:i<2?1:0}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                      <div className={`gp-step ${step>i+1?"done":step===i+1?"active":"pending"}`}>{step>i+1?"✓":i+1}</div>
                      <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:9,letterSpacing:2,textTransform:"uppercase",color:step===i+1?"#F5A800":"rgba(255,255,255,0.2)",fontWeight:700}}>{label}</div>
                    </div>
                    {i<2&&<div style={{flex:1,height:1,margin:"0 12px",marginBottom:22,background:step>i+1?"#22c55e":"rgba(255,255,255,0.06)",transition:"background 0.5s"}} />}
                  </div>
                ))}
              </div>
            )}

            {/* STEP 1 */}
            {step===1&&(
              <div style={{animation:"gp-slideIn 0.5s ease forwards"}}>
                <div className="gp-eyebrow"><span className="gp-line" />Step 1</div>
                <h2 style={{fontFamily:"Cinzel,serif",fontSize:isMobile?24:32,fontWeight:700,color:"#fff",marginBottom:8}}>Where Does Your Seed Go?</h2>
                <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:16,fontStyle:"italic",color:"rgba(255,255,255,0.4)",marginBottom:28}}>Choose the ground where you want to plant your faith.</p>
                <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(3,1fr)",gap:10,marginBottom:36}}>
                  {funds.map(f=>(
                    <div key={f.id} className={`gp-fund ${selectedFund===f.id?"sel":""}`}
                      style={{"--fc":f.color,borderColor:selectedFund===f.id?f.color:"rgba(255,255,255,0.06)",background:selectedFund===f.id?`radial-gradient(circle at 50% 50%, ${f.color}12, transparent)`:"rgba(255,255,255,0.02)",boxShadow:selectedFund===f.id?`0 0 24px ${f.glow}`:"none"}}
                      onClick={()=>setSelectedFund(f.id)}>
                      <div style={{fontSize:28,marginBottom:8}}>{f.icon}</div>
                      <div style={{fontFamily:"Cinzel,serif",fontSize:12,fontWeight:700,color:selectedFund===f.id?f.color:"rgba(255,255,255,0.7)",transition:"color 0.3s",letterSpacing:0.5}}>{f.title}</div>
                      {selectedFund===f.id&&<div style={{position:"absolute",top:8,right:8,width:16,height:16,borderRadius:"50%",background:f.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#000",fontWeight:700,animation:"gp-pulse 1.5s ease-in-out infinite"}}>✓</div>}
                    </div>
                  ))}
                </div>
                <button className="gp-submit" onClick={()=>setStep(2)}>
                  Plant in {fund?.title}
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step===2&&(
              <div style={{animation:"gp-slideIn 0.5s ease forwards"}}>
                <button className="gp-back" onClick={()=>setStep(1)}>← Back</button>
                <div className="gp-eyebrow"><span className="gp-line" />Step 2</div>
                <h2 style={{fontFamily:"Cinzel,serif",fontSize:isMobile?24:32,fontWeight:700,color:"#fff",marginBottom:8}}>How Much Are You Sowing?</h2>
                <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:16,fontStyle:"italic",color:"rgba(255,255,255,0.4)",marginBottom:28}}>Planting into: <span style={{color:fund?.color}}>{fund?.icon} {fund?.title}</span></p>
                <div style={{display:"flex",marginBottom:28,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                  {[{id:"once",label:"One-Time"},{id:"weekly",label:"Weekly"},{id:"monthly",label:"Monthly"}].map(f=>(
                    <button key={f.id} className={`gp-freq ${frequency===f.id?"active":""}`} onClick={()=>setFrequency(f.id)}>{f.label}</button>
                  ))}
                </div>
                {!custom?(
                  <>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
                      {quickAmounts.map(a=>(
                        <div key={a} className={`gp-pill ${amount==a?"sel":""}`} onClick={()=>setAmount(a)}>₦{a.toLocaleString()}</div>
                      ))}
                    </div>
                    <div style={{textAlign:"center",marginBottom:28}}>
                      <span style={{fontFamily:"Rajdhani,sans-serif",fontSize:11,letterSpacing:2,color:"rgba(255,255,255,0.25)",cursor:"pointer",textTransform:"uppercase",textDecoration:"underline"}} onClick={()=>setCustom(true)}>Enter custom amount</span>
                    </div>
                  </>
                ):(
                  <div style={{textAlign:"center",marginBottom:28}}>
                    <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:10,letterSpacing:4,color:"rgba(255,255,255,0.25)",marginBottom:8,textTransform:"uppercase"}}>AMOUNT (₦)</div>
                    <input className="gp-amt-input" type="number" placeholder="0" value={amount} onChange={e=>setAmount(e.target.value)} />
                    <div style={{marginTop:12}}>
                      <span style={{fontFamily:"Rajdhani,sans-serif",fontSize:11,letterSpacing:2,color:"rgba(255,255,255,0.25)",cursor:"pointer",textTransform:"uppercase",textDecoration:"underline"}} onClick={()=>{setCustom(false);setAmount("");}}>Choose preset</span>
                    </div>
                  </div>
                )}
                {amount>0&&(
                  <div className="gp-anim-border" style={{marginBottom:24}}>
                    <div style={{background:"rgba(10,8,0,0.95)",borderRadius:8,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:15,fontStyle:"italic",color:"rgba(255,255,255,0.45)"}}>{frequency==="once"?"One-time":frequency} · {fund?.title}</div>
                      <div style={{fontFamily:"Cinzel,serif",fontSize:24,fontWeight:900,color:"#F5A800",textShadow:"0 0 20px rgba(245,168,0,0.5)"}}>₦{Number(amount).toLocaleString()}</div>
                    </div>
                  </div>
                )}
                <button className="gp-submit" disabled={!amount||amount<=0} onClick={()=>setStep(3)}>
                  Confirm Seed Amount
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            )}

            {/* STEP 3 */}
            {step===3&&(
              <div style={{animation:"gp-slideIn 0.5s ease forwards"}}>
                <button className="gp-back" onClick={()=>setStep(2)}>← Back</button>
                <div className="gp-eyebrow"><span className="gp-line" />Step 3</div>
                <h2 style={{fontFamily:"Cinzel,serif",fontSize:isMobile?24:32,fontWeight:700,color:"#fff",marginBottom:8}}>Complete Your Gift</h2>
                <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:16,fontStyle:"italic",color:"rgba(255,255,255,0.4)",marginBottom:28}}>
                  Giving <span style={{color:"#F5A800",fontWeight:600}}>₦{Number(amount).toLocaleString()}</span> → {fund?.icon} {fund?.title}
                </p>

                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28}}>
                  <input className="gp-input" placeholder="Full Name *" value={name} onChange={e=>setName(e.target.value)} />
                  <input className="gp-input" placeholder="Email Address *" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
                  <input className="gp-input" placeholder="Phone (optional)" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} />
                </div>

                {/* Payment Method */}
                <div style={{marginBottom:28}}>
                  <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:10,letterSpacing:4,textTransform:"uppercase",color:"rgba(255,255,255,0.25)",marginBottom:14}}>Payment Method</div>
                  <div style={{display:"flex",gap:10}}>
                    {[{id:"paystack",label:"Card / USSD",logo:"💳",sub:"Pay instantly online"},{id:"transfer",label:"Bank Transfer",logo:"🏦",sub:"Send directly to us"}].map(m=>(
                      <div key={m.id} className={`gp-pay ${payMethod===m.id?"sel":""}`} onClick={()=>setPayMethod(m.id)}>
                        <div style={{fontSize:22}}>{m.logo}</div>
                        <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:10,letterSpacing:1,fontWeight:700,textTransform:"uppercase",color:payMethod===m.id?"#F5A800":"rgba(255,255,255,0.4)",textAlign:"center",transition:"color 0.3s"}}>{m.label}</div>
                        <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:9,color:"rgba(255,255,255,0.2)",textAlign:"center"}}>{m.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── BANK TRANSFER DETAILS ── */}
                {payMethod==="transfer"&&(
                  <div style={{marginBottom:20}}>

                    {/* Account details box */}
                    <div style={{background:"rgba(245,168,0,0.04)",border:"1px solid rgba(245,168,0,0.2)",borderRadius:8,padding:18,marginBottom:16}}>
                      <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:10,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:14}}>🏦 Transfer Details — Fidelity Bank</div>

                      {/* Account name */}
                      <div style={{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.06)",marginBottom:4}}>
                        <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.25)",marginBottom:4}}>Account Name</div>
                        <div style={{fontFamily:"Cinzel,serif",fontSize:14,fontWeight:700,color:"#F5A800"}}>Creative School of Light LTD/GTE</div>
                      </div>

                      {/* Account numbers */}
                      {bankAccounts.map((acc,i)=>(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<bankAccounts.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
                          <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",fontWeight:700}}>{acc.currency}</div>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <div style={{fontFamily:"Cinzel,serif",fontSize:13,fontWeight:700,color:"#fff"}}>{acc.number}</div>
                            <button
                              onClick={()=>handleCopy(acc.number,i)}
                              style={{background:copiedIndex===i?"rgba(34,197,94,0.15)":"rgba(245,168,0,0.1)",border:`1px solid ${copiedIndex===i?"rgba(34,197,94,0.4)":"rgba(245,168,0,0.2)"}`,borderRadius:3,padding:"4px 10px",cursor:"pointer",fontFamily:"Rajdhani,sans-serif",fontSize:9,letterSpacing:1,color:copiedIndex===i?"#22c55e":"#F5A800",textTransform:"uppercase",transition:"all 0.2s"}}>
                              {copiedIndex===i?"✓ Copied":"Copy"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ── TRANSFER CONFIRMATION ── */}
                    <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:18}}>
                      <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:10,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:16}}>✅ Confirm Your Transfer</div>

                      {/* Last 4 digits */}
                      <div style={{marginBottom:14}}>
                        <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:11,letterSpacing:1,color:"rgba(255,255,255,0.45)",marginBottom:8}}>Last 4 digits of the account you sent from *</div>
                        <input
                          className="gp-input"
                          placeholder="e.g. 3456"
                          maxLength={4}
                          value={last4Digits}
                          onChange={e=>setLast4Digits(e.target.value.replace(/\D/g,""))}
                          style={{maxWidth:160,letterSpacing:6,fontSize:18,textAlign:"center"}}
                        />
                      </div>

                      {/* Receipt upload — NOW REQUIRED */}
                      <div style={{marginBottom:14}}>
                        <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:11,letterSpacing:1,color:"rgba(255,255,255,0.45)",marginBottom:8}}>
                          Upload payment receipt <span style={{color:"#ef4444"}}>*</span> <span style={{color:"rgba(255,255,255,0.25)"}}>(required — will be sent to WhatsApp)</span>
                        </div>
                        {receiptPreview?(
                          <div style={{position:"relative",display:"inline-block"}}>
                            <img src={receiptPreview} alt="Receipt" style={{width:"100%",maxWidth:280,borderRadius:6,border:"1px solid rgba(245,168,0,0.2)"}} />
                            <button onClick={()=>{setReceiptFile(null);setReceiptPreview(null);}} style={{position:"absolute",top:6,right:6,background:"rgba(239,68,68,0.8)",border:"none",borderRadius:"50%",width:24,height:24,cursor:"pointer",color:"#fff",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                          </div>
                        ):(
                          <label className="gp-upload-zone" style={{display:"block",borderColor:!receiptFile?"rgba(239,68,68,0.3)":"rgba(245,168,0,0.25)"}}>
                            <input type="file" accept="image/*,.pdf" onChange={handleReceiptChange} style={{display:"none"}} />
                            <div style={{fontSize:28,marginBottom:8}}>📎</div>
                            <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:12,letterSpacing:1,color:"rgba(255,255,255,0.35)"}}>Tap to upload screenshot or PDF</div>
                            <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:10,color:"rgba(255,255,255,0.2)",marginTop:4}}>JPG, PNG or PDF</div>
                          </label>
                        )}
                      </div>

                      {/* Confirmation checkbox */}
                      <div style={{display:"flex",alignItems:"flex-start",gap:12,cursor:"pointer",padding:"12px 0"}} onClick={()=>setConfirmed(!confirmed)}>
                        <div className={`gp-checkbox ${confirmed?"checked":""}`}>
                          {confirmed&&<span style={{color:"#000",fontSize:12,fontWeight:700}}>✓</span>}
                        </div>
                        <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.6,userSelect:"none"}}>
                          I confirm that I have completed this bank transfer and understand that submitting a false claim is invalid and will not be accepted.
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp info note */}
                    <div style={{marginTop:10,padding:"14px 16px",background:"rgba(34,197,94,0.06)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:6,fontFamily:"Rajdhani,sans-serif",fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:2}}>
                      <div style={{color:"#22c55e",fontWeight:700,fontSize:12,marginBottom:4}}>📲 What happens when you click Submit:</div>
                      <div>1️⃣ &nbsp;WhatsApp opens with your giving details already typed</div>
                      <div>2️⃣ &nbsp;<span style={{color:"#fff"}}>Press Send</span> to send the message</div>
                      <div>3️⃣ &nbsp;<span style={{color:"#fff"}}>Tap the 📎 attach icon</span> in WhatsApp and send your receipt image</div>
                      <div style={{marginTop:6,color:"rgba(255,255,255,0.3)",fontSize:10,letterSpacing:1}}>⚠️ Browsers cannot auto-attach files to WhatsApp — you must attach it manually in step 3.</div>
                    </div>

                    <div style={{marginTop:8,padding:"10px 14px",background:"rgba(245,168,0,0.04)",borderRadius:4,fontFamily:"Rajdhani,sans-serif",fontSize:11,color:"rgba(255,255,255,0.35)",lineHeight:1.6}}>
                      💬 Need help? WhatsApp us: <span style={{color:"#F5A800"}}>07082129744</span> or <span style={{color:"#F5A800"}}>09167212492</span>
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div style={{background:"rgba(245,168,0,0.04)",border:"1px solid rgba(245,168,0,0.12)",borderRadius:6,padding:16,marginBottom:24}}>
                  {[
                    {l:"Fund",      v:`${fund?.icon} ${fund?.title}`},
                    {l:"Amount",    v:`₦${Number(amount).toLocaleString()}`,gold:true},
                    {l:"Frequency", v:frequency==="once"?"One-time":frequency.charAt(0).toUpperCase()+frequency.slice(1)},
                    {l:"Method",    v:payMethod==="paystack"?"Card / USSD":"Bank Transfer"},
                  ].map((r,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<3?"1px solid rgba(255,255,255,0.04)":"none"}}>
                      <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.3)"}}>{r.l}</div>
                      <div style={{fontFamily:"Cinzel,serif",fontSize:13,fontWeight:700,color:r.gold?"#F5A800":"#fff"}}>{r.v}</div>
                    </div>
                  ))}
                </div>

                {payMethod==="paystack"&&(
                  <div className="paystack-btn-wrapper">
                    <PaystackButton {...paystackConfig} text={`Give ₦${Number(amount).toLocaleString()} Now 🙏`} onSuccess={onPaystackSuccess} onClose={onPaystackClose} disabled={!name||!email} />
                  </div>
                )}

                {payMethod==="transfer"&&(
                  <button className="gp-submit" disabled={!transferReady||processing} onClick={handleManualPay}>
                    {processing
                      ? <><div className="gp-spinner" />Saving your record...</>
                      : <>Submit &amp; Open WhatsApp 📲</>
                    }
                  </button>
                )}

                {payMethod==="transfer"&&!transferReady&&(
                  <div style={{textAlign:"center",marginTop:10,fontFamily:"Rajdhani,sans-serif",fontSize:11,color:"rgba(239,68,68,0.6)",letterSpacing:1}}>
                    {!receiptFile?"Upload your payment receipt · ":""}
                    {!last4Digits||last4Digits.length<4?"Enter the last 4 digits of your sending account · ":""}
                    {!confirmed?"Check the confirmation box to proceed":""}
                  </div>
                )}

                <div style={{textAlign:"center",marginTop:12,fontFamily:"Rajdhani,sans-serif",fontSize:10,letterSpacing:1,color:"rgba(255,255,255,0.15)"}}>
                  🔒 Encrypted &amp; Secure · Powered by Paystack
                </div>
              </div>
            )}

            {/* STEP 4 SUCCESS */}
            {step===4&&(
              <div style={{textAlign:"center",padding:"40px 0",animation:"gp-fadeUp 0.6s ease forwards"}}>
                <div style={{position:"relative",width:100,height:100,margin:"0 auto 32px"}}>
                  {[1,2,3].map(i=>(
                    <div key={i} style={{position:"absolute",inset:`${-i*15}px`,borderRadius:"50%",border:`${i===1?2:1}px solid rgba(34,197,94,${0.4/i})`,animation:`gp-successRing ${1+i*0.4}s ease-out ${i*0.2}s both`}} />
                  ))}
                  <div style={{width:100,height:100,borderRadius:"50%",background:"linear-gradient(135deg,#16a34a,#22c55e)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,boxShadow:"0 0 60px rgba(34,197,94,0.5)",animation:"gp-countUp 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards"}}>✓</div>
                </div>
                <h2 style={{fontFamily:"Cinzel,serif",fontSize:isMobile?26:34,fontWeight:700,color:"#fff",marginBottom:10}}>Thank You, {name.split(" ")[0]}! 🙏</h2>
                <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:18,fontStyle:"italic",color:"rgba(255,255,255,0.55)",maxWidth:400,margin:"0 auto 28px",lineHeight:1.8}}>
                  Your gift of <span style={{color:"#F5A800",fontWeight:700}}>₦{Number(amount).toLocaleString()}</span> to {fund?.title} is received.<br />God's return is a hundredfold. 🌱
                </p>
                {payMethod==="transfer"&&(
                  <>
                    <div style={{background:"rgba(34,197,94,0.07)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:6,padding:"16px 20px",marginBottom:12,fontFamily:"Rajdhani,sans-serif",fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:2,textAlign:"left",maxWidth:420,margin:"0 auto 12px"}}>
                      <div style={{color:"#22c55e",fontWeight:700,fontSize:13,marginBottom:6}}>📲 3 Quick Steps to Complete:</div>
                      <div>1️⃣ &nbsp;WhatsApp has opened — <span style={{color:"#fff",fontWeight:700}}>press Send</span> on the message</div>
                      <div>2️⃣ &nbsp;Tap the <span style={{color:"#fff",fontWeight:700}}>📎 attach icon</span> in WhatsApp</div>
                      <div>3️⃣ &nbsp;<span style={{color:"#fff",fontWeight:700}}>Select and send your receipt</span> image/PDF</div>
                      <div style={{marginTop:8,fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:1}}>Sending to: 07036100912</div>
                    </div>
                    <div style={{background:"rgba(245,168,0,0.08)",border:"1px solid rgba(245,168,0,0.25)",borderRadius:4,padding:"12px 24px",marginBottom:16,fontFamily:"Rajdhani,sans-serif",fontSize:12,letterSpacing:2,color:"#F5A800",display:"block",maxWidth:420,margin:"0 auto 16px"}}>
                      ⏳ We'll confirm your transfer within 24 hours
                    </div>
                  </>
                )}
                <div style={{display:"block",background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:4,padding:"12px 24px",marginBottom:32,fontFamily:"Rajdhani,sans-serif",fontSize:12,letterSpacing:2,color:"#22c55e"}}>
                  ✓ Record saved successfully
                </div>
                <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
                  <button className="gp-submit" style={{width:"auto",padding:"14px 36px",fontSize:11}} onClick={reset}>Give Again</button>
                  <button onClick={reset} style={{fontFamily:"Rajdhani,sans-serif",fontSize:11,letterSpacing:3,textTransform:"uppercase",fontWeight:700,color:"rgba(255,255,255,0.5)",background:"transparent",border:"1px solid rgba(255,255,255,0.12)",padding:"14px 36px",borderRadius:4,cursor:"pointer"}}>Back to Home</button>
                </div>
              </div>
            )}
          </div>

          <div style={{animation:"gp-fadeUp 0.7s ease 0.3s both"}}><ImpactPanel /></div>
        </section>

        {/* FAQ SECTION */}
        <section id="give-faq" style={{padding:`72px 0`,background:"#000",borderTop:"1px solid rgba(245,168,0,0.08)"}}>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":isTablet?"1fr":"1fr 220px",maxWidth:1200,margin:"0 auto",gap:0,position:"relative"}}>
            <div style={{padding:`0 ${sidePad}px`,order:isMobile?2:1}}>
              <div id="give-about" style={{paddingTop:8}} />
              <div className="gp-eyebrow" style={{marginBottom:12}}><span className="gp-line" />FAQs</div>
              <h2 style={{fontFamily:"Cinzel,serif",fontSize:isMobile?32:48,fontWeight:900,color:"#fff",marginBottom:48,lineHeight:1.05}}>Frequently Asked Questions</h2>
              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                {faqs.map((faq,i)=>(
                  <div key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.07)",transition:"background 0.3s",background:openFaq===i?"rgba(245,168,0,0.03)":"transparent"}}>
                    <div onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 0",cursor:"pointer",gap:20}}>
                      <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:isMobile?17:20,fontWeight:400,color:openFaq===i?"#F5A800":"#fff",lineHeight:1.4,transition:"color 0.3s",flex:1}}>{faq.q}</span>
                      <div style={{width:32,height:32,borderRadius:"50%",border:`1px solid ${openFaq===i?"rgba(245,168,0,0.4)":"rgba(255,255,255,0.12)"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.3s",background:openFaq===i?"rgba(245,168,0,0.08)":"transparent",transform:openFaq===i?"rotate(180deg)":"rotate(0deg)"}}>
                        <svg width="12" height="12" fill="none" stroke={openFaq===i?"#F5A800":"rgba(255,255,255,0.5)"} strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                      </div>
                    </div>
                    <div style={{maxHeight:openFaq===i?300:0,overflow:"hidden",transition:"max-height 0.4s cubic-bezier(0.4,0,0.2,1)"}}>
                      <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:isMobile?15:17,fontWeight:300,color:"rgba(255,255,255,0.55)",lineHeight:1.8,paddingBottom:24,paddingRight:isMobile?0:40}}>{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{marginTop:48,padding:"28px 32px",background:"rgba(245,168,0,0.05)",border:"1px solid rgba(245,168,0,0.15)",borderRadius:6,display:"flex",alignItems:isMobile?"flex-start":"center",justifyContent:"space-between",flexDirection:isMobile?"column":"row",gap:16}}>
                <div>
                  <div style={{fontFamily:"Cinzel,serif",fontSize:16,fontWeight:700,color:"#fff",marginBottom:6}}>Still have questions?</div>
                  <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:15,fontStyle:"italic",color:"rgba(255,255,255,0.45)"}}>Our team is happy to help you with anything giving-related.</div>
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <a href="https://wa.me/2347082129744" target="_blank" rel="noreferrer" style={{fontFamily:"Rajdhani,sans-serif",fontSize:11,letterSpacing:2,textTransform:"uppercase",fontWeight:700,color:"#000",background:"#22c55e",padding:"12px 20px",borderRadius:2,textDecoration:"none",whiteSpace:"nowrap",flexShrink:0}}>💬 WhatsApp 1</a>
                  <a href="https://wa.me/2349167212492" target="_blank" rel="noreferrer" style={{fontFamily:"Rajdhani,sans-serif",fontSize:11,letterSpacing:2,textTransform:"uppercase",fontWeight:700,color:"#000",background:"#22c55e",padding:"12px 20px",borderRadius:2,textDecoration:"none",whiteSpace:"nowrap",flexShrink:0}}>💬 WhatsApp 2</a>
                </div>
              </div>
            </div>

            {!isMobile&&(
              <div style={{order:2,borderLeft:"1px solid rgba(255,255,255,0.07)",paddingLeft:32,paddingRight:sidePad}}>
                <div style={{position:"sticky",top:isTablet?100:110}}>
                  {sideNavItems.map((item,i)=>(
                    <a key={i} href={`#${item.id}`}
                      onClick={e=>{e.preventDefault();setActiveSection(item.id);document.getElementById(item.id)?.scrollIntoView({behavior:"smooth"});}}
                      style={{display:"block",fontFamily:"Rajdhani,sans-serif",fontSize:14,fontWeight:activeSection===item.id?700:500,letterSpacing:0.5,color:activeSection===item.id?"#fff":"rgba(255,255,255,0.4)",textDecoration:"none",padding:"10px 0 10px 16px",borderLeft:`2px solid ${activeSection===item.id?"#F5A800":"transparent"}`,transition:"all 0.25s",marginBottom:4}}
                      onMouseEnter={e=>{if(activeSection!==item.id){e.currentTarget.style.color="rgba(255,255,255,0.7)";e.currentTarget.style.borderLeftColor="rgba(245,168,0,0.3)";}}}
                      onMouseLeave={e=>{if(activeSection!==item.id){e.currentTarget.style.color="rgba(255,255,255,0.4)";e.currentTarget.style.borderLeftColor="transparent";}}}>
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
