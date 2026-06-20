// import { useState, useEffect } from "react";

// /* ── responsive hook (same style as yours) ── */
// function useWidth() {
//   const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

//   useEffect(() => {
//     const h = () => setW(window.innerWidth);
//     window.addEventListener("resize", h);
//     return () => window.removeEventListener("resize", h);
//   }, []);

//   return w;
// }

// /* ── LOCATION DATA ── */
// const LOCATIONS = [
//   {
//     id: 1,
//     name: "Main Campus",
//     city: "Lagos",
//     address: "12 Kingdom Avenue, Lekki Phase 1",
//     phone: "+234 812 345 6789",
//     email: "main@zoeschool.com",
//     hours: "Mon - Sat | 8am - 6pm",
//     map: "https://maps.google.com",
//     type: "Headquarters",
//     icon: "🏛️",
//     image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800",
//   },
//   {
//     id: 2,
//     name: "Prayer Centre",
//     city: "Lagos",
//     address: "5 Revival Street, Ikeja",
//     phone: "+234 901 234 5678",
//     email: "prayer@zoeschool.com",
//     hours: "Daily | 6am - 8pm",
//     map: "https://maps.google.com",
//     type: "Ministry Hub",
//     icon: "🙏",
//     image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800",
//   },
//   {
//     id: 3,
//     name: "Study Centre",
//     city: "Lagos",
//     address: "88 Revelation Road, Yaba",
//     phone: "+234 803 456 7890",
//     email: "study@zoeschool.com",
//     hours: "Mon - Fri | 9am - 5pm",
//     map: "https://maps.google.com",
//     type: "Learning Hub",
//     icon: "📖",
//     image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
//   },
// ];

// /* ── COMPONENT ── */
// export default function LocationSection() {
//   const width = useWidth();
//   const isMobile = width < 640;
//   const isTablet = width >= 640 && width < 1024;

//   return (
//     <>
//       <style>{`
//         .loc-page {
//           background:#000;
//           color:#fff;
//           padding:80px 0;
//           animation: fadeUp 0.6s ease;
//         }

//         @keyframes fadeUp {
//           from { opacity:0; transform:translateY(20px); }
//           to { opacity:1; transform:translateY(0); }
//         }

//         .loc-title {
//           font-family:Cinzel, serif;
//           font-weight:900;
//           font-size: ${isMobile ? "28px" : "42px"};
//           margin-bottom:10px;
//         }

//         .loc-gold {
//           background: linear-gradient(135deg,#C88600,#F5A800,#FFD166);
//           -webkit-background-clip:text;
//           -webkit-text-fill-color:transparent;
//         }

//         .loc-grid {
//           display:grid;
//           grid-template-columns:${isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3,1fr)"};
//           gap:20px;
//           margin-top:40px;
//         }

//         .loc-card {
//           background:#0a0a0a;
//           border:1px solid rgba(255,255,255,0.06);
//           border-radius:6px;
//           overflow:hidden;
//           transition:0.3s;
//           cursor:pointer;
//         }

//         .loc-card:hover {
//           transform:translateY(-6px);
//           border-color:rgba(245,168,0,0.3);
//           box-shadow:0 20px 60px rgba(0,0,0,0.6);
//         }

//         .loc-img {
//           height:180px;
//           position:relative;
//           overflow:hidden;
//         }

//         .loc-img img {
//           width:100%;
//           height:100%;
//           object-fit:cover;
//           transition:0.5s;
//         }

//         .loc-card:hover .loc-img img {
//           transform:scale(1.08);
//         }

//         .loc-badge {
//           position:absolute;
//           top:12px;
//           left:12px;
//           font-family:Rajdhani,sans-serif;
//           font-size:10px;
//           letter-spacing:2px;
//           text-transform:uppercase;
//           padding:6px 10px;
//           background:rgba(245,168,0,0.15);
//           border:1px solid rgba(245,168,0,0.3);
//           color:#F5A800;
//         }

//         .loc-body {
//           padding:18px;
//         }

//         .loc-name {
//           font-family:Cinzel, serif;
//           font-size:16px;
//           font-weight:700;
//           margin-bottom:6px;
//         }

//         .loc-text {
//           font-family:"Cormorant Garamond", serif;
//           font-size:14px;
//           color:rgba(255,255,255,0.6);
//           line-height:1.6;
//         }

//         .loc-meta {
//           margin-top:12px;
//           font-family:Rajdhani,sans-serif;
//           font-size:11px;
//           color:rgba(255,255,255,0.4);
//           letter-spacing:1px;
//         }

//         .loc-btn {
//           margin-top:14px;
//           width:100%;
//           padding:12px;
//           border:none;
//           cursor:pointer;
//           font-family:Rajdhani,sans-serif;
//           font-size:11px;
//           letter-spacing:2px;
//           text-transform:uppercase;
//           background:#F5A800;
//           color:#000;
//           transition:0.3s;
//         }

//         .loc-btn:hover {
//           background:#FFD166;
//         }
//       `}</style>

//       <div className="loc-page">
//         {/* HERO */}
//         <div style={{ textAlign:"center", padding:"0 20px" }}>
//           <h1 className="loc-title">
//             Our <span className="loc-gold">Locations</span>
//           </h1>
//           <p style={{
//             fontFamily:"Cormorant Garamond, serif",
//             fontSize:"16px",
//             color:"rgba(255,255,255,0.5)",
//             maxWidth:"500px",
//             margin:"0 auto"
//           }}>
//             Find our campuses, prayer centres, and study hubs across the city.
//           </p>
//         </div>

//         {/* GRID */}
//         <div className="loc-grid" style={{ padding:"40px 20px" }}>
//           {LOCATIONS.map(loc => (
//             <div key={loc.id} className="loc-card">
              
//               {/* IMAGE */}
//               <div className="loc-img">
//                 <img src={loc.image} alt={loc.name} />
//                 <div className="loc-badge">
//                   {loc.icon} {loc.type}
//                 </div>
//               </div>

//               {/* BODY */}
//               <div className="loc-body">
//                 <div className="loc-name">{loc.name}</div>

//                 <div className="loc-text">
//                   📍 {loc.address}
//                   <br />
//                   📞 {loc.phone}
//                   <br />
//                   ✉️ {loc.email}
//                 </div>

//                 <div className="loc-meta">
//                   🕒 {loc.hours}
//                 </div>

//                 <button
//                   className="loc-btn"
//                   onClick={() => window.open(loc.map, "_blank")}
//                 >
//                   View on Map
//                 </button>
//               </div>

//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }




import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

/* ── FIX LEAFLET ICON ── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

/* ── RESPONSIVE HOOK ── */
function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  return w;
}

/* ── LOCATIONS (styled + map coordinates merged) ── */
const LOCATIONS = [
  {
    id: 1,
    name: "Main Campus",
    city: "Lagos",
    address: "12 Kingdom Avenue, Lekki Phase 1",
    phone: "+234 812 345 6789",
    email: "main@zoeschool.com",
    hours: "Mon - Sat | 8am - 6pm",
    type: "Headquarters",
    icon: "🏛️",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800",
    lat: 6.4474,
    lng: 3.4723,
  },
  {
    id: 2,
    name: "Prayer Centre",
    city: "Lagos",
    address: "5 Revival Street, Ikeja",
    phone: "+234 901 234 5678",
    email: "prayer@zoeschool.com",
    hours: "Daily | 6am - 8pm",
    type: "Ministry Hub",
    icon: "🙏",
    image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800",
    lat: 6.6018,
    lng: 3.3515,
  },
  {
    id: 3,
    name: "Study Centre",
    city: "Lagos",
    address: "88 Revelation Road, Yaba",
    phone: "+234 803 456 7890",
    email: "study@zoeschool.com",
    hours: "Mon - Fri | 9am - 5pm",
    type: "Learning Hub",
    icon: "📖",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
    lat: 6.5158,
    lng: 3.3831,
  },
];

/* ── DISTANCE (Haversine) ── */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function LocationSystem() {
  const width = useWidth();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  const [userLocation, setUserLocation] = useState(null);
  const [nearest, setNearest] = useState(null);

  /* ── GET USER GPS ── */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const user = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      setUserLocation(user);

      let closest = null;
      let minDist = Infinity;

      LOCATIONS.forEach((loc) => {
        const dist = getDistance(user.lat, user.lng, loc.lat, loc.lng);

        if (dist < minDist) {
          minDist = dist;
          closest = loc;
        }
      });

      setNearest(closest);
    });
  }, []);

  return (
    <>
      <style>{`
        .loc-page {
          background:#000;
          color:#fff;
          padding:80px 20px;
        }

        .loc-title {
          font-family:Cinzel, serif;
          font-size:${isMobile ? "28px" : "42px"};
          font-weight:900;
          text-align:center;
        }

        .loc-gold {
          background:linear-gradient(135deg,#C88600,#F5A800,#FFD166);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
        }

        .map {
          height:500px;
          border-radius:10px;
          overflow:hidden;
          margin-top:30px;
        }

        .grid {
          display:grid;
          grid-template-columns:${isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3,1fr)"};
          gap:20px;
          margin-top:40px;
        }

        .card {
          background:#0a0a0a;
          border:1px solid rgba(255,255,255,0.06);
          border-radius:8px;
          overflow:hidden;
          transition:0.3s;
        }

        .card:hover {
          transform:translateY(-6px);
          border-color:rgba(245,168,0,0.3);
        }

        .img {
          height:160px;
          overflow:hidden;
        }

        .img img {
          width:100%;
          height:100%;
          object-fit:cover;
        }

        .body {
          padding:16px;
        }

        .name {
          font-family:Cinzel, serif;
          font-weight:700;
          color:#F5A800;
          margin-bottom:6px;
        }

        .text {
          font-family:"Cormorant Garamond", serif;
          font-size:14px;
          color:rgba(255,255,255,0.6);
          line-height:1.6;
        }

        .badge {
          font-size:11px;
          color:#22c55e;
          margin-top:8px;
        }

      `}</style>

      <div className="loc-page">

        {/* HEADER */}
        <h1 className="loc-title">
          Our <span className="loc-gold">Locations</span>
        </h1>

        {nearest && (
          <p style={{ textAlign: "center", color: "#aaa" }}>
            Closest to you: <span style={{ color: "#fff" }}>{nearest.name}</span>
          </p>
        )}

        {/* MAP */}
        <div className="map">
          <MapContainer center={[6.5244, 3.3792]} zoom={11} style={{ height: "100%" }}>
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>You are here 📍</Popup>
              </Marker>
            )}

            {LOCATIONS.map((loc) => (
              <Marker key={loc.id} position={[loc.lat, loc.lng]}>
                <Popup>
                  <b>{loc.name}</b>
                  <br />
                  {loc.address}
                  <br />
                  {nearest?.id === loc.id && "🔥 Nearest Location"}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* CARDS */}
        <div className="grid">
          {LOCATIONS.map((loc) => (
            <div key={loc.id} className="card">

              <div className="img">
                <img src={loc.image} alt={loc.name} />
              </div>

              <div className="body">
                <div className="name">
                  {loc.icon} {loc.name}
                </div>

                <div className="text">
                  📍 {loc.address}
                  <br />
                  📞 {loc.phone}
                  <br />
                  ✉️ {loc.email}
                  <br />
                  🕒 {loc.hours}
                </div>

                {nearest?.id === loc.id && (
                  <div className="badge">🔥 Nearest Location</div>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </>
  );
}