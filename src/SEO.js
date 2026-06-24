// src/SEO.js
// Centralised SEO config for every page in Zoe's website.
// Used together with react-helmet-async.

import logoUrl from "./logo.png";




export const SITE = {
  name: "Zoe School of Mysteries",
  url: "https://zoeschoolofmysteries.org",        // ← replace with real domain
  logo: logoUrl,
//   twitterHandle: "@ZoeChurch",         // ← replace or remove if unused
  defaultImage: logoUrl, // fallback OG image
};

/**
 * Returns the full <head> meta payload for a given page key.
 * Add / edit entries here whenever you add a new page.
 */
export const PAGE_META = {
  home: {
    title: `${SITE.name} – Welcome`,
    description:
      "Welcome to Zoe Church – a vibrant community of faith. Join us for worship, events, sermons, and more.",
    canonical: SITE.url,
    schema: {
      "@context": "https://schema.org",
      "@type": "Church",
      name: SITE.name,
      url: SITE.url,
      logo: SITE.logo,
      sameAs: [],
    },
  },

  about: {
    title: `About Us – ${SITE.name}`,
    description:
      "Learn about Zoe Church – our mission, values, history, and the team behind our community.",
    canonical: `${SITE.url}/about`,
    schema: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: `About – ${SITE.name}`,
      url: `${SITE.url}/about`,
    },
  },

  sermons: {
    title: `Sermons – ${SITE.name}`,
    description:
      "Watch and listen to the latest sermons from Zoe Church. Be inspired, grow in faith, and stay connected.",
    canonical: `${SITE.url}/sermons`,
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `Sermons – ${SITE.name}`,
      url: `${SITE.url}/sermons`,
    },
  },

  streams: {
    title: `Live Stream – ${SITE.name}`,
    description:
      "Watch Zoe Church live. Join our online worship services from anywhere in the world.",
    canonical: `${SITE.url}/streams`,
    schema: {
      "@context": "https://schema.org",
      "@type": "BroadcastEvent",
      name: `Live Stream – ${SITE.name}`,
      url: `${SITE.url}/streams`,
      isLiveBroadcast: true,
      broadcastOfEvent: { "@type": "Event", name: "Sunday Service" },
    },
  },

  events: {
    title: `Events – ${SITE.name}`,
    description:
      "Explore upcoming events at Zoe Church. From worship nights to conferences – there's something for everyone.",
    canonical: `${SITE.url}/events`,
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `Events – ${SITE.name}`,
      url: `${SITE.url}/events`,
    },
  },

  blog: {
    title: `Blog – ${SITE.name}`,
    description:
      "Read articles, devotionals, and stories from the Zoe Church community.",
    canonical: `${SITE.url}/blog`,
    schema: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: `Blog – ${SITE.name}`,
      url: `${SITE.url}/blog`,
    },
  },

  give: {
    title: `Give – ${SITE.name}`,
    description:
      "Support the work of Zoe Church through your generous giving. Every contribution makes a difference.",
    canonical: `${SITE.url}/give`,
    schema: {
      "@context": "https://schema.org",
      "@type": "DonateAction",
      name: `Give – ${SITE.name}`,
      url: `${SITE.url}/give`,
    },
  },

  ministries: {
    title: `Ministries – ${SITE.name}`,
    description:
      "Discover the ministries at Zoe Church and find your place to serve, grow, and connect.",
    canonical: `${SITE.url}/ministries`,
    schema: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Ministries – ${SITE.name}`,
      url: `${SITE.url}/ministries`,
    },
  },

  volunteer: {
    title: `Volunteer – ${SITE.name}`,
    description:
      "Make a difference by volunteering at Zoe Church. Find opportunities that match your gifts and passion.",
    canonical: `${SITE.url}/volunteer`,
    schema: {
      "@context": "https://schema.org",
      "@type": "VolunteerAction",
      name: `Volunteer – ${SITE.name}`,
      url: `${SITE.url}/volunteer`,
    },
  },

  prayer: {
    title: `Prayer – ${SITE.name}`,
    description:
      "Submit your prayer requests and join us in prayer. Zoe Church believes in the power of prayer.",
    canonical: `${SITE.url}/prayer`,
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `Prayer – ${SITE.name}`,
      url: `${SITE.url}/prayer`,
    },
  },

  store: {
    title: `Books & Resources – ${SITE.name}`,
    description:
      "Browse books, study materials, and resources available from Zoe Church to deepen your faith journey.",
    canonical: `${SITE.url}/store`,
    schema: {
      "@context": "https://schema.org",
      "@type": "Store",
      name: `Books & Resources – ${SITE.name}`,
      url: `${SITE.url}/store`,
    },
  },

  guides: {
    title: `Study Guides – ${SITE.name}`,
    description:
      "Access free Bible study guides from Zoe Church to help you grow deeper in God's Word.",
    canonical: `${SITE.url}/guides`,
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `Study Guides – ${SITE.name}`,
      url: `${SITE.url}/guides`,
    },
  },

  locations: {
    title: `Locations – ${SITE.name}`,
    description:
      "Find a Zoe Church location near you. We have multiple campuses ready to welcome you.",
    canonical: `${SITE.url}/locations`,
    schema: {
      "@context": "https://schema.org",
      "@type": "Church",
      name: SITE.name,
      url: `${SITE.url}/locations`,
    },
  },

  profile: {
    title: `My Profile – ${SITE.name}`,
    description: "Manage your Zoe Church member profile.",
    canonical: `${SITE.url}/profile`,
    schema: null, // No schema needed for auth-protected pages
  },

  auth: {
    title: `Sign In – ${SITE.name}`,
    description: "Sign in or create an account to access your Zoe Church member portal.",
    canonical: `${SITE.url}/auth`,
    schema: null,
  },

  issues: {
    title: `Issues – ${SITE.name}`,
    description: "Browse current issues and topics being addressed by Zoe Church.",
    canonical: `${SITE.url}/issues`,
    schema: null,
  },

  eventdetail: {
    title: `Event – ${SITE.name}`,
    description: "View details for this Zoe Church event.",
    canonical: `${SITE.url}/events`,
    schema: null, // Dynamically generated per event – see App.jsx
  },
};