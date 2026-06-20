// import React from "react";

// export default function IssuesPage() {
//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#000",
//         color: "#fff",
//         padding: "120px 20px 80px",
//       }}
//     >
//       {/* Header */}
//       <div
//         style={{
//           maxWidth: "900px",
//           margin: "0 auto",
//           textAlign: "center",
//         }}
//       >
//         <h1
//           style={{
//             fontFamily: "Cinzel, serif",
//             color: "#F5A800",
//             fontSize: "3rem",
//             marginBottom: "20px",
//           }}
//         >
//           Issues & Support
//         </h1>

//         <p
//           style={{
//             color: "rgba(255,255,255,0.75)",
//             lineHeight: 1.8,
//             maxWidth: "700px",
//             margin: "0 auto 50px",
//             fontSize: "18px",
//           }}
//         >
//           Experiencing technical difficulties, login problems, payment issues,
//           broken links, account concerns, or any challenge on the platform?
//           Our support team is available to assist you. Reach out through any
//           of the contacts below and we'll respond as soon as possible.
//         </p>
//       </div>

//       {/* Support Cards */}
//       <div
//         style={{
//           maxWidth: "900px",
//           margin: "0 auto",
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
//           gap: "20px",
//         }}
//       >
//         {/* Contact 1 */}
//         <div
//           style={{
//             background: "#0a0a0a",
//             border: "1px solid rgba(245,168,0,0.15)",
//             padding: "30px",
//             borderRadius: "10px",
//             textAlign: "center",
//           }}
//         >
//           <div style={{ fontSize: "50px", marginBottom: "15px" }}>📱</div>

//           <h3
//             style={{
//               color: "#F5A800",
//               fontFamily: "Cinzel, serif",
//               marginBottom: "15px",
//             }}
//           >
//             Support Contact 1
//           </h3>

//           <a
//             href="https://wa.me/2347082129744"
//             target="_blank"
//             rel="noopener noreferrer"
//             style={{
//               display: "inline-block",
//               background: "#25D366",
//               color: "#fff",
//               padding: "14px 28px",
//               textDecoration: "none",
//               borderRadius: "5px",
//               fontWeight: "bold",
//             }}
//           >
//             Chat on WhatsApp
//           </a>
//         </div>

//         {/* Contact 2 */}
//         <div
//           style={{
//             background: "#0a0a0a",
//             border: "1px solid rgba(245,168,0,0.15)",
//             padding: "30px",
//             borderRadius: "10px",
//             textAlign: "center",
//           }}
//         >
//           <div style={{ fontSize: "50px", marginBottom: "15px" }}>🛠️</div>

//           <h3
//             style={{
//               color: "#F5A800",
//               fontFamily: "Cinzel, serif",
//               marginBottom: "15px",
//             }}
//           >
//             Support Contact 2
//           </h3>

//           <a
//             href="https://wa.me/2349167212492"
//             target="_blank"
//             rel="noopener noreferrer"
//             style={{
//               display: "inline-block",
//               background: "#25D366",
//               color: "#fff",
//               padding: "14px 28px",
//               textDecoration: "none",
//               borderRadius: "5px",
//               fontWeight: "bold",
//             }}
//           >
//             Chat on WhatsApp
//           </a>
//         </div>
//       </div>

//       {/* Footer Note */}
//       <div
//         style={{
//           textAlign: "center",
//           marginTop: "50px",
//           color: "rgba(255,255,255,0.4)",
//           fontStyle: "italic",
//         }}
//       >
//         Please provide clear details of your issue so our team can assist you
//         quickly and effectively.
//       </div>
//     </div>
//   );
// }







import React from "react";

export default function IssuesPage() {
const supportCards = [
{
icon: "📱",
title: "General Support",
description:
"Account access, login issues, profile updates, course access, and general assistance.",
link: `https://wa.me/2347082129744?text=${encodeURIComponent(
`Hello Support Team,

I need assistance regarding my account.

━━━━━━━━━━━━━━━━━━
FULL NAME:
REGISTERED EMAIL:
PHONE NUMBER:
━━━━━━━━━━━━━━━━━━

ISSUE CATEGORY:
□ Login Issue
□ Account Access
□ Course Access
□ General Enquiry
□ Other

DESCRIPTION OF ISSUE:

---

---

Thank you for your assistance.
`
      )}`,
},
{
icon: "🛠️",
title: "Technical Support",
description:
"Platform errors, payment issues, broken links, video issues, and technical concerns.",
link: `https://wa.me/2349167212492?text=${encodeURIComponent(
`Hello Technical Support,

I am experiencing a technical issue on the platform.

━━━━━━━━━━━━━━━━━━
FULL NAME:
REGISTERED EMAIL:
━━━━━━━━━━━━━━━━━━

ISSUE TYPE:
□ Payment Problem
□ Website Error
□ Broken Link
□ Video Not Loading
□ Download Issue
□ Other

DEVICE:
BROWSER:

DETAILED DESCRIPTION:

---

---

Thank you for your assistance.
`
      )}`,
},
];

return (
<div
style={{
minHeight: "100vh",
background:
"radial-gradient(circle at top, rgba(245,168,0,0.12), transparent 40%), #000",
color: "#fff",
padding: "120px 20px 80px",
}}
>
{/* Hero Section */}
<div
style={{
maxWidth: "900px",
margin: "0 auto",
textAlign: "center",
}}
>
<div
style={{
color: "#F5A800",
letterSpacing: "4px",
textTransform: "uppercase",
fontSize: "13px",
marginBottom: "15px",
}}
>
Support Centre </div>

```
    <h1
      style={{
        fontFamily: "Cinzel, serif",
        fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
        color: "#F5A800",
        marginBottom: "20px",
        lineHeight: 1.2,
      }}
    >
      How Can We Help You?
    </h1>

    <p
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        color: "rgba(255,255,255,0.75)",
        lineHeight: 1.9,
        fontSize: "18px",
      }}
    >
      Whether you're experiencing technical difficulties, payment
      challenges, account issues, course access concerns, or platform
      errors, our support team is ready to assist you promptly.
    </p>
  </div>

  {/* Categories */}
  <div
    style={{
      maxWidth: "1000px",
      margin: "60px auto",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "12px",
    }}
  >
    {[
      "Login Issues",
      "Payment Problems",
      "Technical Errors",
      "Account Access",
      "Course Access",
      "Downloads",
      "General Enquiries",
    ].map((item) => (
      <div
        key={item}
        style={{
          padding: "10px 18px",
          border: "1px solid rgba(245,168,0,0.2)",
          borderRadius: "50px",
          background: "rgba(255,255,255,0.03)",
          color: "#ddd",
        }}
      >
        {item}
      </div>
    ))}
  </div>

  {/* Support Cards */}
  <div
    style={{
      maxWidth: "1100px",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
      gap: "25px",
    }}
  >
    {supportCards.map((card, index) => (
      <div
        key={index}
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(245,168,0,0.15)",
          borderRadius: "20px",
          padding: "40px 30px",
          textAlign: "center",
          boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: "rgba(245,168,0,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "36px",
          }}
        >
          {card.icon}
        </div>

        <h3
          style={{
            color: "#F5A800",
            fontFamily: "Cinzel, serif",
            fontSize: "1.4rem",
            marginBottom: "15px",
          }}
        >
          {card.title}
        </h3>

        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.8,
            marginBottom: "25px",
          }}
        >
          {card.description}
        </p>

        <a
          href={card.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, #F5A800 0%, #FFD56A 100%)",
            color: "#000",
            fontWeight: "700",
            padding: "14px 30px",
            borderRadius: "999px",
            textDecoration: "none",
            boxShadow: "0 10px 30px rgba(245,168,0,.25)",
          }}
        >
          Submit Issue →
        </a>

        <p
          style={{
            marginTop: "12px",
            fontSize: "12px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          A pre-filled support form will open in WhatsApp.
        </p>
      </div>
    ))}
  </div>

  {/* Notice */}
  <div
    style={{
      maxWidth: "850px",
      margin: "70px auto 0",
    }}
  >
    <div
      style={{
        background: "rgba(245,168,0,0.06)",
        border: "1px solid rgba(245,168,0,0.15)",
        borderRadius: "20px",
        padding: "30px",
        textAlign: "center",
      }}
    >
      <h3
        style={{
          color: "#F5A800",
          marginBottom: "15px",
          fontFamily: "Cinzel, serif",
        }}
      >
        Before Contacting Support
      </h3>

      <p
        style={{
          color: "rgba(255,255,255,0.75)",
          lineHeight: 1.8,
        }}
      >
        To help us resolve your request quickly, please provide as much
        information as possible, including screenshots, payment references,
        error messages, or the specific page where the issue occurred.
      </p>
    </div>
  </div>

  {/* Footer */}
  <div
    style={{
      marginTop: "60px",
      textAlign: "center",
      color: "rgba(255,255,255,0.4)",
      fontSize: "14px",
    }}
  >
    © 2026 Support Centre • Dedicated to serving you with excellence.
  </div>
</div>


);
}