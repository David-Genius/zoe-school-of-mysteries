import { useState } from "react";
import { HelmetProvider } from "react-helmet-async";
// import { useTheme } from "./ThemeContext";  // no extension needed
import EventsCarousel, { EventsPage, EventDetailPage, events } from "./Components/EventPage";
import Navbar from "./Components/Navbar";
import BlogPage from "./Components/BlogPage";
import Hero from "./Components/Hero";
import AboutPage from "./Components/AboutPage";
import AuthPage from "./Components/AuthPage";
import Experience from "./Components/Experience";
import Volunteer from "./Components/Volunteer";
import SermonPage from "./Components/SermonPage";
import Footer from "./Components/Footer";
import StreamsPage from "./Components/StreamsPage";
import GivePage from "./Components/GivePage";
// import MinistriesPage from "./Components/MinistriesPage";
import AdminPanel from "./Components/AdminPanel";
import logo from "./logo.png";
import BooksPage from "./Components/BooksPage";
import StudyGuidesPage from "./Components/StudyGuidesPage";
import PrayerPage from "./Components/PrayerPage";
// import LocationSystem from "./Components/LocationSystem";
import IssuesPage from "./Components/IssuesPage";
import ProfilePage from "./Components/ProfilePage";
import SEOHead from "./Components/SEOHead";
import './App.css';

export default function App() {
  const [page,           setPage]           = useState("home");
  const [miniSection,    setMiniSection]    = useState("all");
  const [user,           setUser]           = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [storeSearch,    setStoreSearch]    = useState("");

  const navigate = (pg, section = "") => {
    setPage(pg);
    if (pg === "ministries") setMiniSection(section || "all");
    if (pg === "store")      setStoreSearch(section || "");
    window.scrollTo(0, 0);

    if (section && section.startsWith("#")) {
      setTimeout(() => {
        document.querySelector(section)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleLogin = (u) => {
    setUser(u);
    setPage(u.role === "admin" ? "admin" : "home");
  };

  const handleSelectEvent = (id) => {
    setSelectedEventId(id);
    setPage("eventdetail");
  };

  // ── Shared navbar instance ──────────────────────────────────────────────
  const NavbarComponent = (
    <Navbar
      logo={logo}
      user={user}
      onUserIconClick={() => setPage("auth")}
      onLogout={() => { setUser(null); setPage("home"); }}
      onNavigate={navigate}
    />
  );

  // ── Resolve the current event for detail page ───────────────────────────
  const currentEvent = events.find(e => e.id === selectedEventId);

  return (
    // HelmetProvider must wrap the entire app for react-helmet-async to work
    <HelmetProvider>
      <div style={{ background: "#000", minHeight: "100vh" }}>

        {/* ── Auth ── */}
        {page === "auth" && (
          <>
            <SEOHead page="auth" />
            <AuthPage
              logo={logo}
              onBack={() => setPage("home")}
              onLogin={handleLogin}
            />
          </>
        )}

        {/* ── Admin (no public SEO needed) ── */}
        {page === "admin" && (
          <AdminPanel onExit={() => setPage("home")} />
        )}

        {/* ── About ── */}
        {page === "about" && (
          <>
            <SEOHead page="about" />
            {NavbarComponent}
            <AboutPage />
          </>
        )}

        {/* ── Live Streams ── */}
        {page === "streams" && (
          <>
            <SEOHead page="streams" />
            {NavbarComponent}
            <StreamsPage />
          </>
        )}

        {/* ── Give ── */}
        {page === "give" && (
          <>
            <SEOHead page="give" />
            {NavbarComponent}
            <GivePage />
          </>
        )}

        {/* ── Study Guides ── */}
        {page === "guides" && (
          <>
            <SEOHead page="guides" />
            {NavbarComponent}
            <StudyGuidesPage />
          </>
        )}

        {/* ── Prayer ── */}
        {page === "prayer" && (
          <>
            <SEOHead page="prayer" />
            {NavbarComponent}
            <PrayerPage user={user} onNavigate={navigate} />
          </>
        )}

        {/* ── Ministries ── */}
        {page === "ministries" && (
          <>
            <SEOHead page="ministries" />
            <Navbar
              logo={logo} user={user}
              onUserIconClick={() => setPage("auth")}
              onLogout={() => { setUser(null); setPage("home"); }}
              onNavigate={navigate}
            />
            <MinistriesPage scrollTo={miniSection} />
          </>
        )}

        {/* ── Store / Books ── */}
        {page === "store" && (
          <>
            <SEOHead page="store" />
            {NavbarComponent}
            <BooksPage searchQuery={storeSearch} />
          </>
        )}

        {/* ── Home ── */}
        {page === "home" && (
          <>
            <SEOHead page="home" />
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

        {/* ── Locations ── */}
        {page === "locations" && (
          <>
            <SEOHead page="locations" />
            {NavbarComponent}
            <LocationSystem />
          </>
        )}

        {/* ── Volunteer ── */}
        {page === "volunteer" && (
          <>
            <SEOHead page="volunteer" />
            {NavbarComponent}
            <Volunteer />
          </>
        )}

        {/* ── Issues ── */}
        {page === "issues" && (
          <>
            <SEOHead page="issues" />
            {NavbarComponent}
            <IssuesPage />
          </>
        )}

        {/* ── Profile (auth-protected, minimal SEO) ── */}
        {page === "profile" && (
          <>
            <SEOHead page="profile" />
            {NavbarComponent}
            <ProfilePage
              user={user}
              onLogout={() => { setUser(null); setPage("home"); }}
            />
          </>
        )}

        {/* ── Sermons ── */}
        {page === "sermons" && (
          <>
            <SEOHead page="sermons" />
            {NavbarComponent}
            <SermonPage />
          </>
        )}

        {/* ── Events List ── */}
        {page === "events" && (
          <>
            <SEOHead page="events" />
            {NavbarComponent}
            <EventsPage
              onBack={() => navigate("home")}
              onSelectEvent={handleSelectEvent}
            />
          </>
        )}

        {/* ── Event Detail (dynamic schema per event) ── */}
        {page === "eventdetail" && currentEvent && (
          <>
            <SEOHead
              page="eventdetail"
              title={`${currentEvent.title} – Zoe Church`}
              description={currentEvent.description || `Join us for ${currentEvent.title} at Zoe Church.`}
              image={currentEvent.image}
              event={currentEvent}
            />
            {NavbarComponent}
            <EventDetailPage
              event={currentEvent}
              onBack={() => navigate("events")}
            />
          </>
        )}

        {/* ── Blog ── */}
        {page === "blog" && (
          <>
            <SEOHead page="blog" />
            {NavbarComponent}
            <BlogPage onNavigate={navigate} />
          </>
        )}

      </div>
    </HelmetProvider>
  );
}
