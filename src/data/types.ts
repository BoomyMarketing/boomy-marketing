/**
 * types.ts — shared TypeScript types for Boomy Marketing Astro pages
 */

// ─── Local Page ─────────────────────────────────────────────────────────────

export interface LocalPageData {
  /** URL slug, e.g. "calgary" */
  city: string;
  /** Display name, e.g. "Calgary" */
  cityName: string;
  /** Province abbreviation, e.g. "AB" */
  province: string;
  /** Province full name, e.g. "Alberta" */
  provinceName: string;
  /** Service slug, e.g. "seo-agency" */
  service: string;
  /** Service display name, e.g. "SEO Agency" */
  serviceName: string;
  /** Geo coordinates */
  geo: { latitude: number; longitude: number };
  /** Nearby cities for areaServed schema */
  nearbyCities: string[];
  /** Page title */
  title: string;
  /** Meta description */
  description: string;
  /** Canonical URL path, e.g. "/local/calgary/seo-agency" */
  canonicalPath: string;
}

// ─── FAQ ────────────────────────────────────────────────────────────────────

export interface FAQItem {
  question: string;
  answer: string;
}

// ─── Service Card ────────────────────────────────────────────────────────────

export interface ServiceCardData {
  href: string;
  icon: string;
  title: string;
  description: string;
  label?: string;
}

// ─── Breadcrumb ──────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
