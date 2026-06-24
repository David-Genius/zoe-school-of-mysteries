// src/Components/SEOHead.jsx
// Drop this component into any page render to inject per-page SEO tags.
// Requires react-helmet-async to be installed and HelmetProvider wrapping the app.

import { Helmet } from "react-helmet-async";
import { PAGE_META, SITE } from "../SEO";

/**
 * Props
 * ─────
 * page        {string}  – matches a key in PAGE_META  (required)
 * title       {string}  – override the default page title
 * description {string}  – override the default meta description
 * image       {string}  – override the default OG image URL
 * schema      {object}  – override / extend the JSON-LD schema object
 * event       {object}  – pass a full event object to auto-generate event schema
 */
export default function SEOHead({ page, title, description, image, schema, event }) {
  const meta = PAGE_META[page] ?? PAGE_META["home"];

  const resolvedTitle       = title       || meta.title;
  const resolvedDescription = description || meta.description;
  const resolvedImage       = image       || SITE.defaultImage;
  const resolvedCanonical   = meta.canonical;

  // Build JSON-LD: prefer explicit override, then page default, then event schema
  let resolvedSchema = schema || meta.schema;

  if (event && !schema) {
    resolvedSchema = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: event.title,
      description: event.description || "",
      startDate: event.date || "",
      location: event.location
        ? { "@type": "Place", name: event.location }
        : undefined,
      image: event.image || resolvedImage,
      organizer: { "@type": "Organization", name: SITE.name, url: SITE.url },
      url: `${SITE.url}/events/${event.id}`,
    };
  }

  return (
    <Helmet>
      {/* ── Primary ── */}
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <link rel="canonical" href={resolvedCanonical} />

      {/* ── Open Graph ── */}
      <meta property="og:type"        content="website" />
      <meta property="og:site_name"   content={SITE.name} />
      <meta property="og:title"       content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:image"       content={resolvedImage} />
      <meta property="og:url"         content={resolvedCanonical} />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content={SITE.twitterHandle} />
      <meta name="twitter:title"       content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image"       content={resolvedImage} />

      {/* ── JSON-LD Structured Data ── */}
      {resolvedSchema && (
        <script type="application/ld+json">
          {JSON.stringify(resolvedSchema)}
        </script>
      )}
    </Helmet>
  );
}
