import React from "react";

export default function Volunteer() {
  const telegramLink = "https://t.me/+tPTpa7WqH9w5MjQ0";

  const opportunities = [
    {
      title: "Media & Production",
      icon: "🎥",
      desc: "Help create and distribute content that reaches lives across nations."
    },
    {
      title: "Prayer Team",
      icon: "🙏",
      desc: "Stand in intercession and support spiritual initiatives."
    },
    {
      title: "Administration",
      icon: "📋",
      desc: "Assist with organization, planning, and operational excellence."
    },
    {
      title: "Hospitality",
      icon: "🤝",
      desc: "Help create welcoming experiences during gatherings and events."
    },
    {
      title: "Digital Evangelism",
      icon: "📱",
      desc: "Spread truth and Kingdom influence through digital platforms."
    },
    {
      title: "Outreach & Missions",
      icon: "🌍",
      desc: "Participate in initiatives that impact communities and lives."
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(245,168,0,0.08), transparent 40%), #000",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      {/* HERO */}
      <section
        style={{
          position: "relative",
          padding: "120px 20px 100px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#F5A800,#FFD76A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 42,
              margin: "0 auto 30px",
              boxShadow:
                "0 0 50px rgba(245,168,0,.35)",
            }}
          >
            🙌
          </div>

          <div
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: 12,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#F5A800",
              marginBottom: 20,
            }}
          >
            Kingdom Service
          </div>

          <h1
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "clamp(42px,7vw,80px)",
              lineHeight: 1.05,
              marginBottom: 25,
              fontWeight: 800,
            }}
          >
            Become Part of
            <br />
            <span style={{ color: "#F5A800" }}>
              What God Is Building
            </span>
          </h1>

          <p
            style={{
              maxWidth: 700,
              margin: "0 auto",
              fontSize: 18,
              lineHeight: 1.9,
              color: "rgba(255,255,255,.75)",
            }}
          >
            Every great move of God is carried by people who choose
            to serve. Join the Zoe School of Mysteries volunteer
            community and use your gifts, skills, time, and passion
            to impact lives across nations.
          </p>

          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 40,
              padding: "18px 40px",
              borderRadius: 14,
              background:
                "linear-gradient(135deg,#F5A800,#FFD76A)",
              color: "#000",
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow:
                "0 20px 60px rgba(245,168,0,.35)",
            }}
          >
            Join Volunteer Community →
          </a>
        </div>
      </section>

      {/* STATS */}
      <section
        style={{
          padding: "0 20px 80px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: 20,
          }}
        >
          {[
            ["Global Reach", "20+ Nations"],
            ["Volunteer Teams", "6 Departments"],
            ["Training", "Weekly"],
            ["Impact", "Thousands Reached"],
          ].map(([title, value]) => (
            <div
              key={title}
              style={{
                padding: 24,
                borderRadius: 16,
                background: "rgba(255,255,255,.03)",
                border:
                  "1px solid rgba(255,255,255,.08)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: "#F5A800",
                  fontSize: 28,
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                {value}
              </div>

              <div
                style={{
                  color: "rgba(255,255,255,.6)",
                  letterSpacing: 1,
                }}
              >
                {title}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OPPORTUNITIES */}
      <section
        style={{
          padding: "0 20px 100px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "clamp(30px,5vw,52px)",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Volunteer Opportunities
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,.6)",
              maxWidth: 700,
              margin: "0 auto 60px",
              lineHeight: 1.8,
            }}
          >
            There is a place for your gifts, passion, and calling.
            Find where you can serve and make a lasting impact.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(280px,1fr))",
              gap: 20,
            }}
          >
            {opportunities.map((item) => (
              <div
                key={item.title}
                style={{
                  padding: 28,
                  borderRadius: 18,
                  background:
                    "linear-gradient(145deg,#0a0a0a,#050505)",
                  border:
                    "1px solid rgba(255,255,255,.08)",
                  transition: "all .3s ease",
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 14,
                    background:
                      "rgba(245,168,0,.08)",
                    border:
                      "1px solid rgba(245,168,0,.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    marginBottom: 18,
                  }}
                >
                  {item.icon}
                </div>

                <h3
                  style={{
                    fontFamily: "Cinzel, serif",
                    marginBottom: 12,
                    color: "#fff",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    color: "rgba(255,255,255,.55)",
                    lineHeight: 1.8,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section
        style={{
          padding: "0 20px 100px",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            padding: "50px 30px",
            borderRadius: 24,
            background:
              "linear-gradient(135deg, rgba(245,168,0,.08), rgba(255,255,255,.02))",
            border:
              "1px solid rgba(245,168,0,.15)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(28px,4vw,42px)",
              fontStyle: "italic",
              color: "#fff",
              marginBottom: 15,
            }}
          >
            "We are not building an organization.
            We are raising a people."
          </p>

          <div
            style={{
              color: "#F5A800",
              letterSpacing: 3,
              textTransform: "uppercase",
              fontSize: 12,
            }}
          >
            Zoe School of Mysteries
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        style={{
          textAlign: "center",
          padding: "0 20px 120px",
        }}
      >
        <h2
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "clamp(28px,5vw,50px)",
            marginBottom: 20,
          }}
        >
          Ready To Serve?
        </h2>

        <p
          style={{
            maxWidth: 650,
            margin: "0 auto 35px",
            color: "rgba(255,255,255,.65)",
            lineHeight: 1.8,
          }}
        >
          Join our volunteer community and become part of a
          growing movement impacting lives across the world.
        </p>

        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "18px 42px",
            borderRadius: 14,
            background:
              "linear-gradient(135deg,#F5A800,#FFD76A)",
            color: "#000",
            textDecoration: "none",
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: "uppercase",
            boxShadow:
              "0 20px 60px rgba(245,168,0,.35)",
          }}
        >
          Join Telegram Group
        </a>
      </section>
    </div>
  );
}