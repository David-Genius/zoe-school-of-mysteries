import { useState, useEffect } from "react";
import EventsCarousel, { EventsPage, EventDetailPage, events } from "./Components/EventPage";
import Navbar from "./Components/Navbar";
import BlogPage from "./Components/BlogPage";
import Hero from "./Components/Hero";
import AboutPage from "./Components/AboutPage";
import AuthPage from "./Components/AuthPage";
import Experience from "./Components/Experience";
// import EventsCarousel from "./Components/EventPage";
import Volunteer from "./Components/Volunteer";
import SermonPage from "./Components/SermonPage";
// import GetInvolved from "./Components/GetInvolved";
import Footer from "./Components/Footer";
import StreamsPage from "./Components/StreamsPage";
import GivePage from "./Components/GivePage";
import MinistriesPage from "./Components/MinistriesPage";
import AdminPanel from "./Components/AdminPanel";
import logo from "./logo.png";
import BooksPage from "./Components/BooksPage";
import StudyGuidesPage from "./Components/StudyGuidesPage";
import PrayerPage from "./Components/PrayerPage"
import LocationSystem from "./Components/LocationSystem";
import IssuesPage from "./Components/IssuesPage";
import ProfilePage from "./Components/ProfilePage";
import './App.css';

export default function App() {
  const [page,        setPage]        = useState("home");
  const [miniSection, setMiniSection] = useState("all");
  const [user,        setUser]        = useState(null);
  // Add to state:
  const [selectedEventId, setSelectedEventId] = useState(null);
const [storeSearch, setStoreSearch] = useState("");

  
  // Update navigate function:
const navigate = (pg, section = "") => {
  setPage(pg);
  // if (page === "blog") return <BlogPage onNavigate={onNavigate} />;

  if (pg === "ministries") setMiniSection(section || "all");
  if (pg === "store") setStoreSearch(section || "");
  window.scrollTo(0, 0);


  // Only scroll to a DOM element if section looks like a CSS selector
  if (section && section.startsWith("#")) {
    setTimeout(() => {
      document.querySelector(section)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }
};

  // ✅ THIS IS THE KEY FIX — check role on login
  const handleLogin = (u) => {
    setUser(u);
    if (u.role === "admin") {
      setPage("admin");   // 👈 admin goes to admin panel
    } else {
      setPage("home");    // 👈 regular member goes home
    }
  };

  // Add this handler (alongside handleLogin etc):
const handleSelectEvent = (id) => {
  setSelectedEventId(id);
  setPage("eventdetail");
};





  const NavbarComponent = (
    <Navbar
      logo={logo}
      user={user}
      onUserIconClick={() => setPage("auth")}
      onLogout={() => { setUser(null); setPage("home"); }}
      onNavigate={navigate}
    />
  );

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>

      {page === "auth" && (
        <AuthPage
          logo={logo}
          onBack={() => setPage("home")}
          onLogin={handleLogin}  
        />
      )}

      {page === "admin" && (
        <AdminPanel onExit={() => setPage("home")} />
      )}

      {page === "about" && <>{NavbarComponent}<AboutPage /></>}
      {page === "streams" && <>{NavbarComponent}<StreamsPage /></>}
      {page === "give" && <>{NavbarComponent}<GivePage /></>}
      {page === "guides" && (<>{NavbarComponent}<StudyGuidesPage /></>)}
      {page === "prayer" && (<>{NavbarComponent}<PrayerPage user={user} onNavigate={navigate} /></>)}

      {page === "ministries" && (
        <>
          <Navbar
            logo={logo} user={user}
            onUserIconClick={() => setPage("auth")}
            onLogout={() => { setUser(null); setPage("home"); }}
            onNavigate={navigate}
          />
          <MinistriesPage scrollTo={miniSection} />
        </>
      )}

{/* Add to routing */}
{page === "store" && (
  <>
    {NavbarComponent}
    <BooksPage searchQuery={storeSearch} />
  </>
)}

      {page === "home" && (
  <>
    {NavbarComponent}
    <Hero />
    <Experience />
    <EventsCarousel 
      onSeeMore={() => navigate("events")} 
      onSelectEvent={handleSelectEvent}  
    />
    <Footer logo={logo} onNavigate={navigate} />
  </>
)}



      {page === "locations" && (
  <>
    {NavbarComponent}
    <LocationSystem />
  </>
)}

      {page === "volunteer" && (
  <>
    {NavbarComponent}
    <Volunteer />
  </>
)}

{page === "issues" && (
  <>
    {NavbarComponent}
    <IssuesPage />
  </>
)}


{page === "profile" && (
  <>
    {NavbarComponent}
    <ProfilePage
      user={user}
      onLogout={() => {
        setUser(null);
        setPage("home");
      }}
    />
  </>
)}

{page === "sermons" && (
  <>
    {NavbarComponent}
    <SermonPage />
  </>
)}


{page === "events" && (
  <>
    {NavbarComponent}
    <EventsPage 
      onBack={() => navigate("home")} 
      onSelectEvent={handleSelectEvent} 
    />
  </>
)}

{page === "eventdetail" && selectedEventId && (
  <>
    {NavbarComponent}
    <EventDetailPage 
      event={events.find(e => e.id === selectedEventId)} 
      onBack={() => navigate("events")} 
    />
  </>
)}


{page === "blog" && (
  <>
    {NavbarComponent}
    <BlogPage onNavigate={navigate} />
  </>
)}
    </div>
  );
}


