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

const sideNavItems = [
  { id: "min-all",      label: "All Ministries"      },
  { id: "min-egroup",   label: "eGroup Ministry"     },
  { id: "min-outreach", label: "Outreach Ministry"   },
  { id: "min-children", label: "Children's Ministry" },
  { id: "min-youth",    label: "Youth Ministry"      },
  { id: "min-young",    label: "Young Adult Ministry"},
];

const ministryData = [
  {
    id: "egroup",
    sectionId: "min-egroup",
    tag: "eGroup Ministry",
    accent: "#3b82f6",
    wm: "eG",
    title: "Connecting People.\nActivating Faith.",
    headline: "Where Relationships\nBecome Revival",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80",
    img2: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80",
    intro: "An eGroup is more than a small group — it is a covenant circle where iron sharpens iron, where burdens are shared, and where God's word moves from the head to the heart through the power of community.",
    body: "We believe you cannot grow fully in isolation. The Christian life was never meant to be lived alone — and our eGroup ministry is the heartbeat of that conviction. Every week, across homes, offices, campuses, and community halls in Nigeria and beyond, hundreds of eGroups gather to pray, study, encourage, and do life together.",
    body2: "Whether you are brand new to faith or have been walking with God for decades, there is an eGroup designed for exactly where you are. We have eGroups for singles, couples, professionals, students, new believers, and seasoned disciples.",
    stats: [
      { num: "400+", label: "Active eGroups" },
      { num: "12K+", label: "Members"        },
      { num: "20",   label: "Cities"         },
    ],
    features: [
      { title: "Weekly Gatherings",     desc: "Meet every week in a safe, intimate setting of 8–20 people to study the Word, pray, and build genuine friendships that last a lifetime." },
      { title: "Online eGroups",        desc: "Can't make it in person? Our virtual eGroups connect people across time zones and continents — bringing community to wherever you are." },
      { title: "Couples eGroups",       desc: "Specially designed for married couples and those preparing for marriage — strengthening relationships with biblical foundations and real conversations." },
      { title: "Campus eGroups",        desc: "Present on 15+ university campuses, reaching students at their most formative years with truth, community, and Kingdom purpose." },
    ],
    quote: "Real Christianity happens in community — where your story intersects with someone else's and together you find God in the middle.",
    cta: "Find an eGroup",
    ctaHref: "#find-group",
    bgColor: "#0d1f3c",
  },
  {
    id: "outreach",
    sectionId: "min-outreach",
    tag: "Outreach Ministry",
    accent: "#22c55e",
    wm: "OM",
    title: "Making an Impact\nLocally and Globally.",
    headline: "The Kingdom Has\nNo Borders",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=80",
    img2: "https://images.unsplash.com/photo-1470092306007-055b6797ca72?w=600&q=80",
    intro: "Outreach at Zoe School of Mysteries is not a program — it is a lifestyle. We are a people sent, not just assembled. Every believer is a missionary, and every neighborhood is a mission field.",
    body: "Our Outreach Ministry coordinates the compassion arm of Zoe School of Mysteries — mobilizing hundreds of volunteers every month to bring the love of Christ into the darkest corners of our communities. We don't just preach; we demonstrate the Kingdom.",
    body2: "From the bustling streets of Lagos Island to rural villages in Benue State; from correctional facilities to refugee camps — our teams go where the need is greatest and where God's presence is least expected.",
    stats: [
      { num: "200+", label: "Volunteers"      },
      { num: "15",   label: "Nations Reached" },
      { num: "50K+", label: "Lives Impacted"  },
    ],
    features: [
      { title: "Street Evangelism",     desc: "Monthly city-wide outreaches where our teams flood public spaces with the gospel — accompanied by miracles, healing prayers, and practical assistance." },
      { title: "Widow & Orphan Care",   desc: "Monthly visits and provision for widows and orphans across 8 states — food parcels, school fees sponsorship, and emotional support." },
      { title: "Prison Ministry",       desc: "Bi-monthly services in correctional facilities, bringing hope, counseling, and skills training to incarcerated men and women." },
      { title: "Medical Missions",      desc: "Free healthcare screenings, medications, and consultations for underserved communities twice a year through the Zoe Medical Mission team." },
    ],
    quote: "We were not saved to sit in pews. We were saved to invade the darkness — with love as our weapon and grace as our strategy.",
    cta: "Join Outreach",
    ctaHref: "#volunteer",
    bgColor: "#0a2e0a",
  },
  {
    id: "children",
    sectionId: "min-children",
    tag: "Children's Ministry",
    accent: "#06b6d4",
    wm: "CM",
    title: "Partnering with Parents\nto Develop Kids' Faith.",
    headline: "Raising Champions\nFrom the Cradle",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&q=80",
    img2: "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=600&q=80",
    intro: "Children are not the church of tomorrow — they are the church of today. Our Children's Ministry builds the spiritual foundations that will carry them through every storm life will bring.",
    body: "At Zoe School of Mysteries, we believe that a child who encounters God early is a child who carries God everywhere. Our children's ministry creates age-appropriate, spiritually charged environments where kids don't just hear about God — they meet Him.",
    body2: "We partner with parents as the primary disciplers of their children, equipping families with tools, resources, and community to raise the next generation of Kingdom leaders from the home outward.",
    stats: [
      { num: "1,800+", label: "Children"        },
      { num: "120+",   label: "Trained Teachers" },
      { num: "3",      label: "Age Groups"       },
    ],
    features: [
      { title: "Zoe Seedlings (0–5 yrs)",  desc: "A nurturing, sensory-rich environment for our youngest members — learning God's love through play, music, storytelling, and creative expression." },
      { title: "Zoe Explorers (6–11 yrs)", desc: "Interactive Bible adventures, character formation classes, memory verse challenges, and Kingdom-focused creative arts for school-age children." },
      { title: "Parent Partnership",       desc: "Monthly parent resources, workshops, and family devotional packs to help parents extend Sunday's encounter into everyday home life." },
      { title: "Children's Prayer Teams",  desc: "We train children as intercessors. Our children pray with faith that moves mountains — and we have testimonies to prove it." },
    ],
    quote: "Train up a child in the way he should go, and when he is old, he will not depart from it. We take this personally.",
    cta: "Register Your Child",
    ctaHref: "#children-reg",
    bgColor: "#003a3a",
  },
  {
    id: "youth",
    sectionId: "min-youth",
    tag: "Youth Ministry",
    accent: "#F5A800",
    wm: "YM",
    title: "Developing Youth Who\nInfluence Culture.",
    headline: "A Generation Set\nApart for God",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
    img2: "https://images.unsplash.com/photo-1604931374105-5e9f452b5ab3?w=600&q=80",
    intro: "The Zoe Youth Ministry — called Zoe Ignite — is not your typical youth group. It is a firestarter movement for teenagers who are done being defined by their age and ready to be defined by their God.",
    body: "Our teenagers are not waiting to become leaders someday. They are leading now — in their schools, their homes, and their communities. Zoe Ignite creates the environment where that leadership is cultivated, sharpened, and sent.",
    body2: "Every Friday night, hundreds of 13–17 year olds gather for an experience designed entirely for them — raw, authentic, electric with the presence of God. No childishness. No performance. Just real encounters that change real lives.",
    stats: [
      { num: "1,800+", label: "Active Teens"   },
      { num: "45+",    label: "Youth Leaders"  },
      { num: "30+",    label: "Schools Reached" },
    ],
    features: [
      { title: "Friday Ignite Night",      desc: "Our weekly high-energy gathering where teenagers encounter God through powerful worship, relevant preaching, and Spirit-led ministry." },
      { title: "School Ambassadors",       desc: "Over 200 trained teen ambassadors represent the Kingdom in their schools — leading Bible clubs, praying for classmates, and modeling Christ." },
      { title: "Leadership Academy",       desc: "A 6-month intensive program that trains teenagers in prophetic ministry, public speaking, emotional intelligence, and Kingdom leadership." },
      { title: "Annual Youth Convention",  desc: "Our flagship 3-day youth event attracts over 5,000 teenagers from across the nation for worship, teaching, and life-defining encounters with God." },
    ],
    quote: "Don't let anyone look down on you because you are young — but set an example. We believe this with our whole ministry.",
    cta: "Join Youth Ministry",
    ctaHref: "#youth-join",
    bgColor: "#111111",
  },
  {
    id: "youngadult",
    sectionId: "min-young",
    tag: "Young Adult Ministry",
    accent: "#f97316",
    wm: "YA",
    title: "Building Community.\nDeepening Faith.",
    headline: "Where Purpose Meets\nPassion",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80",
    img2: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    intro: "The Zoe Young Adults community is a tribe of 18–35 year olds who are navigating the most defining season of their lives — and choosing to do it with God at the center.",
    body: "Career decisions. Relationship challenges. Identity questions. Financial pressure. These are the real issues our young adults face — and our ministry exists to bring God's wisdom, a community of peers, and a prophetic perspective to every single one.",
    body2: "We don't water down the gospel for young people. We trust them with the full weight of Scripture, the full power of the Spirit, and the full responsibility of Kingdom citizenship. And they rise to it — every single time.",
    stats: [
      { num: "3,000+", label: "Young Adults"    },
      { num: "80+",    label: "City Tribes"     },
      { num: "12",     label: "Monthly Events"  },
    ],
    features: [
      { title: "Ignite Night (Fridays)",    desc: "Our flagship weekly gathering — high-energy worship, prophetic ministry, real preaching, and the kind of community that makes you feel less alone." },
      { title: "City Tribes",              desc: "Neighbourhood-based groups of 10–25 young adults who gather weekly for Bible study, prayer, career mentorship, and genuine friendship." },
      { title: "Purpose Lab",              desc: "Monthly workshops on career development, business, relationships, mental health, and creative arts — all filtered through a Kingdom worldview." },
      { title: "The Zoe Retreat",          desc: "Annual 3-day retreat for young adults to unplug, hear from God, receive prophetic ministry, and realign with their divine assignment." },
    ],
    quote: "Your twenties and thirties are not practice runs for real life. They are the most important chapters of the book God is writing with you.",
    cta: "Find Your Tribe",
    ctaHref: "#young-tribe",
    bgColor: "#2a0a00",
  },
];

export default function MinistriesPage({ scrollTo: initialScrollTo }) {
  const width     = useWidth();
  const isMobile  = width < 640;
  const isTablet  = width >= 640 && width < 1024;
  const sidePad   = isMobile ? 20 : isTablet ? 32 : 64;
  const topOffset = isMobile ? 130 : 76;

  const [activeSection, setActiveSection] = useState("min-all");

  // Scroll to specific ministry if navigated from home
  useEffect(() => {
    if (initialScrollTo && initialScrollTo !== "all") {
      setTimeout(() => {
        const el = document.getElementById(`min-${initialScrollTo}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, [initialScrollTo]);

  // Scroll spy
  useEffect(() => {
    const handler = () => {
      const sections = sideNavItems.map(n => document.getElementById(n.id));
      let current = "min-all";
      sections.forEach(sec => {
        if (sec && sec.getBoundingClientRect().top <= 160) current = sec.id;
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <style>{`
        @keyframes mn-fadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes mn-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes mn-scaleIn { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
        @keyframes mn-lineGrow{ from{width:0} to{width:56px} }

        .mn-gold {
          background: linear-gradient(135deg, #C88600 0%, #F5A800 40%, #FFD166 60%, #C88600 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: mn-shimmer 4s linear infinite;
        }

        .mn-sidenav-link {
          display: block;
          font-family: 'Rajdhani', sans-serif;
          font-size: 14px; font-weight: 500; letter-spacing: 0.3px;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          padding: 9px 0 9px 20px;
          border-left: 2px solid transparent;
          margin-bottom: 2px;
          transition: all 0.25s;
          cursor: pointer;
        }
        .mn-sidenav-link:hover { color: rgba(255,255,255,0.75); border-left-color: rgba(245,168,0,0.3); }
        .mn-sidenav-link.active { color: #fff; border-left-color: #F5A800; font-weight: 700; }

        .mn-img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.6s ease; }
        .mn-img-wrap { overflow:hidden; }
        .mn-img-wrap:hover .mn-img { transform:scale(1.04); }

        .mn-feature-card {
          padding: 22px 20px;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 4px;
          background: rgba(255,255,255,0.02);
          transition: all 0.3s;
        }
        .mn-feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }

        .mn-section { scroll-margin-top: 120px; }

        .mn-eyebrow {
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px; letter-spacing: 5px;
          text-transform: uppercase;
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .mn-eyebrow-line { width: 24px; height: 1px; display: inline-block; }

        .mn-divider {
          height: 2px; margin-bottom: 32px;
          animation: mn-lineGrow 0.8s ease forwards;
        }

        .mn-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 12px; letter-spacing: 3px;
          text-transform: uppercase; font-weight: 700;
          padding: 15px 36px; border-radius: 2px;
          text-decoration: none; transition: all 0.3s;
          cursor: pointer; border: none;
        }

        .mn-stat-num {
          font-family: 'Cinzel', serif; font-weight: 900;
          line-height: 1; margin-bottom: 6px;
        }
        .mn-stat-label {
          font-family: 'Rajdhani', sans-serif; font-size: 10px;
          letter-spacing: 3px; text-transform: uppercase;
          color: rgba(255,255,255,0.3); font-weight: 600;
        }

        .mn-blockquote {
          border-left: 3px solid currentColor;
          padding: 20px 28px;
          border-radius: 0 4px 4px 0;
          margin: 32px 0;
        }

        .mn-card-mini {
          background: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 4px; padding: 20px 18px;
          transition: all 0.3s; cursor: default;
        }
        .mn-card-mini:hover { transform: translateY(-4px); }
      `}</style>

      <div style={{
        background: "#000", minHeight: "100vh",
        paddingTop: topOffset, paddingBottom: isMobile ? 80 : 60,
      }}>

        {/* ── HERO ── */}
        <section id="min-all" className="mn-section" style={{
          padding: `${isMobile ? 56 : 80}px ${sidePad}px`,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "radial-gradient(ellipse 80% 60% at 30% 40%, #080c1a 0%, #000 70%)",
          position: "relative", overflow: "hidden",
        }}>
          {/* bg glow */}
          <div style={{
            position:"absolute", top:"-20%", right:"5%",
            width:500, height:500, borderRadius:"50%",
            background:"radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
            pointerEvents:"none",
          }} />

          <div style={{ position:"relative", zIndex:1, animation:"mn-fadeUp 0.7s ease forwards" }}>
            <div className="mn-eyebrow" style={{ color:"#F5A800" }}>
              <span className="mn-eyebrow-line" style={{ background:"#F5A800" }} />
              Our Ministries
            </div>

            <h1 style={{
              fontFamily:"Cinzel, serif", fontWeight:900,
              fontSize: isMobile ? 36 : isTablet ? 52 : 68,
              lineHeight:1.0, marginBottom:20, color:"#fff",
              letterSpacing:"-2px",
            }}>
              <span className="mn-gold">Every Person.</span>
              <br />
              <span style={{ color:"#fff" }}>Every Season.</span>
              <br />
              <span style={{ color:"transparent", WebkitTextStroke:"2px rgba(255,255,255,0.2)" }}>
                Every Need.
              </span>
            </h1>

            <p style={{
              fontFamily:"Cormorant Garamond, serif",
              fontSize: isMobile ? 17 : 21,
              fontWeight:300, color:"rgba(255,255,255,0.6)",
              maxWidth:600, lineHeight:1.8, marginBottom:40,
            }}>
              From your first breath to your most defining years, Zoe School of Mysteries
              has a ministry built for exactly where you are — and where God is taking you.
            </p>

            {/* Ministry quick nav cards */}
            <div style={{
              display:"grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(5, 1fr)",
              gap:10,
            }}>
              {ministryData.map((m, i) => (
                <a
                  key={i}
                  href={`#${m.sectionId}`}
                  onClick={e => { e.preventDefault(); document.getElementById(m.sectionId)?.scrollIntoView({ behavior:"smooth" }); }}
                  style={{
                    padding:"16px 14px",
                    background:`${m.accent}12`,
                    border:`1px solid ${m.accent}30`,
                    borderRadius:4, textDecoration:"none",
                    transition:"all 0.3s", cursor:"pointer",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${m.accent}22`; e.currentTarget.style.borderColor = `${m.accent}66`; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${m.accent}12`; e.currentTarget.style.borderColor = `${m.accent}30`; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{
                    fontFamily:"Cinzel,serif", fontSize:28,
                    fontWeight:900, color:m.accent,
                    opacity:0.3, lineHeight:1, marginBottom:8,
                  }}>{m.wm}</div>
                  <div style={{
                    fontFamily:"Rajdhani,sans-serif", fontSize:11,
                    letterSpacing:1, textTransform:"uppercase",
                    color:"rgba(255,255,255,0.6)", fontWeight:600,
                    lineHeight:1.4,
                  }}>{m.tag}</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── MAIN LAYOUT ── */}
        <div style={{
          display:"grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "1fr 200px",
          maxWidth:1200, margin:"0 auto",
        }}>

          {/* ── MINISTRY SECTIONS ── */}
          <div style={{ minWidth:0 }}>
            {ministryData.map((m, idx) => (
              <section
                key={m.id}
                id={m.sectionId}
                className="mn-section"
                style={{
                  padding:`${isMobile ? 60 : 88}px ${sidePad}px`,
                  borderBottom:"1px solid rgba(255,255,255,0.06)",
                  background: idx % 2 === 1 ? "linear-gradient(to bottom, #050505, #000)" : "#000",
                }}
              >
                {/* Eyebrow */}
                <div className="mn-eyebrow" style={{ color: m.accent }}>
                  <span className="mn-eyebrow-line" style={{ background: m.accent }} />
                  {m.tag}
                </div>
                <div className="mn-divider" style={{
                  background:`linear-gradient(90deg, ${m.accent}, transparent)`,
                  width:56,
                }} />

                {/* Title */}
                <h2 style={{
                  fontFamily:"Cinzel,serif", fontWeight:900,
                  fontSize: isMobile ? 30 : isTablet ? 42 : 56,
                  lineHeight:1.0, marginBottom:24,
                  letterSpacing:"-1px",
                  whiteSpace: isMobile ? "normal" : "pre-line",
                  color:"#fff",
                }}>{m.headline}</h2>

                {/* Hero image */}
                <div className="mn-img-wrap" style={{
                  borderRadius:4, height: isMobile ? 220 : 440,
                  marginBottom:48, animation:"mn-scaleIn 0.7s ease forwards",
                  position:"relative",
                }}>
                  <img className="mn-img" src={m.image} alt={m.tag} />
                  {/* Overlay gradient */}
                  <div style={{
                    position:"absolute", inset:0,
                    background:"linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 60%)",
                    pointerEvents:"none",
                  }} />
                  {/* Floating wm */}
                  <div style={{
                    position:"absolute", bottom:20, right:24,
                    fontFamily:"Cinzel,serif", fontWeight:900,
                    fontSize: isMobile ? 64 : 120,
                    color:"rgba(255,255,255,0.06)",
                    lineHeight:1, userSelect:"none",
                    pointerEvents:"none",
                  }}>{m.wm}</div>
                  {/* Accent tag */}
                  <div style={{
                    position:"absolute", top:20, left:20,
                    fontFamily:"Rajdhani,sans-serif", fontSize:10,
                    letterSpacing:3, textTransform:"uppercase",
                    fontWeight:700, color:"#000",
                    background: m.accent,
                    padding:"5px 14px", borderRadius:2,
                  }}>{m.tag}</div>
                </div>

                {/* Content + side image */}
                <div style={{
                  display:"grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: isMobile ? 32 : 64,
                  alignItems:"start",
                  marginBottom:48,
                }}>
                  <div>
                    <p style={{
                      fontFamily:"Cormorant Garamond,serif",
                      fontSize: isMobile ? 18 : 21,
                      fontWeight:400, color:"rgba(255,255,255,0.8)",
                      lineHeight:1.8, marginBottom:20,
                      fontStyle:"italic",
                    }}>{m.intro}</p>
                    <p style={{
                      fontFamily:"Cormorant Garamond,serif",
                      fontSize: isMobile ? 15 : 17,
                      fontWeight:300, color:"rgba(255,255,255,0.55)",
                      lineHeight:1.9, marginBottom:16,
                    }}>{m.body}</p>
                    <p style={{
                      fontFamily:"Cormorant Garamond,serif",
                      fontSize: isMobile ? 15 : 17,
                      fontWeight:300, color:"rgba(255,255,255,0.45)",
                      lineHeight:1.9,
                    }}>{m.body2}</p>

                    {/* Quote */}
                    <div className="mn-blockquote" style={{
                      borderLeftColor: m.accent,
                      background:`${m.accent}08`,
                    }}>
                      <p style={{
                        fontFamily:"Cormorant Garamond,serif",
                        fontSize: isMobile ? 17 : 20,
                        fontStyle:"italic", color:"#fff",
                        lineHeight:1.6,
                      }}>{m.quote}</p>
                    </div>
                  </div>

                  <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                    {/* Stats */}
                    <div style={{
                      display:"grid",
                      gridTemplateColumns:"repeat(3,1fr)",
                      gap:12, marginBottom:8,
                    }}>
                      {m.stats.map((s,i) => (
                        <div key={i} style={{
                          padding:"18px 14px",
                          background:`${m.accent}0e`,
                          border:`1px solid ${m.accent}25`,
                          borderRadius:4, textAlign:"center",
                        }}>
                          <div className="mn-stat-num" style={{
                            fontSize: isMobile ? 22 : 28,
                            color: m.accent,
                            textShadow:`0 0 20px ${m.accent}66`,
                          }}>{s.num}</div>
                          <div className="mn-stat-label">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Side image */}
                    <div className="mn-img-wrap" style={{ borderRadius:4, height:280 }}>
                      <img className="mn-img" src={m.img2} alt={m.tag} />
                    </div>

                    {/* CTA */}
                    <a href={m.ctaHref} className="mn-cta-btn" style={{
                      background: m.accent,
                      color: m.accent === "#F5A800" ? "#000" : "#fff",
                      justifyContent:"center",
                    }}>
                      {m.cta}
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Features grid */}
                <div>
                  <h3 style={{
                    fontFamily:"Cinzel,serif",
                    fontSize: isMobile ? 18 : 24,
                    fontWeight:700, color:"#fff",
                    marginBottom:20,
                  }}>What We Offer</h3>
                  <div style={{
                    display:"grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)",
                    gap:12,
                  }}>
                    {m.features.map((f,i) => (
                      <div
                        key={i}
                        className="mn-feature-card"
                        style={{
                          borderColor:`${m.accent}18`,
                          background:`${m.accent}06`,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = `${m.accent}44`; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = `${m.accent}18`; }}
                      >
                        {/* Accent dot */}
                        <div style={{
                          width:8, height:8, borderRadius:"50%",
                          background: m.accent,
                          marginBottom:10,
                          boxShadow:`0 0 10px ${m.accent}88`,
                        }} />
                        <div style={{
                          fontFamily:"Cinzel,serif", fontSize:14,
                          fontWeight:700, color:"#fff",
                          marginBottom:8,
                        }}>{f.title}</div>
                        <p style={{
                          fontFamily:"Cormorant Garamond,serif",
                          fontSize:15, fontWeight:300,
                          color:"rgba(255,255,255,0.5)",
                          lineHeight:1.75,
                        }}>{f.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </section>
            ))}
          </div>

          {/* ── STICKY SIDE NAV ── */}
          {!isMobile && (
            <div style={{
              borderLeft:"1px solid rgba(255,255,255,0.07)",
              paddingLeft:28, paddingRight:24, paddingTop:88,
            }}>
              <div style={{ position:"sticky", top: isTablet ? 100 : 110 }}>
                <div style={{
                  fontFamily:"Rajdhani,sans-serif", fontSize:9,
                  letterSpacing:4, textTransform:"uppercase",
                  color:"rgba(255,255,255,0.2)", marginBottom:16,
                }}>JUMP TO</div>
                {sideNavItems.map((item,i) => (
                  <a
                    key={i}
                    href={`#${item.id}`}
                    className={`mn-sidenav-link ${activeSection===item.id?"active":""}`}
                    onClick={e => {
                      e.preventDefault();
                      setActiveSection(item.id);
                      document.getElementById(item.id)?.scrollIntoView({ behavior:"smooth" });
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
