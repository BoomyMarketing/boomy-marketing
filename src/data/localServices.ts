export interface LocalService {
  slug: string;
  name: string;
  displayName: string;
  icon: string;
  priceRange: string;
  offers: Array<{
    name: string;
    price: string;
    currency: string;
  }>;
}

export const LOCAL_SERVICES_DATA: LocalService[] = [
  {
    slug: "seo-agency",
    name: "SEO Agency",
    displayName: "SEO Agency",
    icon: "🔍",
    priceRange: "$$",
    offers: [
      { name: "SEO Agency - Starter", price: "$1,500 CAD/mo", currency: "CAD" },
      { name: "SEO Agency - Growth", price: "$3,500 CAD/mo", currency: "CAD" },
      { name: "SEO Agency - Scale", price: "$7,500 CAD/mo", currency: "CAD" }
    ]
  },
  {
    slug: "seo-company",
    name: "SEO Company",
    displayName: "SEO Company",
    icon: "📊",
    priceRange: "$$",
    offers: [
      { name: "SEO Company - Starter", price: "$1,500 CAD/mo", currency: "CAD" },
      { name: "SEO Company - Growth", price: "$3,500 CAD/mo", currency: "CAD" },
      { name: "SEO Company - Scale", price: "$7,500 CAD/mo", currency: "CAD" }
    ]
  },
  {
    slug: "google-ads-agency",
    name: "Google Ads Agency",
    displayName: "Google Ads Agency",
    icon: "🎯",
    priceRange: "$$$",
    offers: [
      { name: "Google Ads Management - Starter", price: "$2,000 CAD/mo", currency: "CAD" },
      { name: "Google Ads Management - Growth", price: "$4,000 CAD/mo", currency: "CAD" },
      { name: "Google Ads Management - Scale", price: "$8,000 CAD/mo", currency: "CAD" }
    ]
  },
  {
    slug: "web-design-company",
    name: "Web Design Company",
    displayName: "Web Design Company",
    icon: "🌐",
    priceRange: "$$$",
    offers: [
      { name: "Website Design - Basic", price: "$5,000 CAD", currency: "CAD" },
      { name: "Website Design - Premium", price: "$12,000 CAD", currency: "CAD" },
      { name: "Website Design - Enterprise", price: "$25,000 CAD", currency: "CAD" }
    ]
  },
  {
    slug: "web-development-company",
    name: "Web Development Company",
    displayName: "Web Development Company",
    icon: "⚡",
    priceRange: "$$$",
    offers: [
      { name: "Web Development - Basic", price: "$8,000 CAD", currency: "CAD" },
      { name: "Web Development - Advanced", price: "$18,000 CAD", currency: "CAD" },
      { name: "Web Development - Custom", price: "$35,000 CAD", currency: "CAD" }
    ]
  },
  {
    slug: "digital-marketing-agency",
    name: "Digital Marketing Agency",
    displayName: "Digital Marketing Agency",
    icon: "📈",
    priceRange: "$$",
    offers: [
      { name: "Digital Marketing - Essentials", price: "$2,500 CAD/mo", currency: "CAD" },
      { name: "Digital Marketing - Growth", price: "$5,000 CAD/mo", currency: "CAD" },
      { name: "Digital Marketing - Full-Service", price: "$10,000 CAD/mo", currency: "CAD" }
    ]
  },
  {
    slug: "social-media-marketing-agency",
    name: "Social Media Marketing Agency",
    displayName: "Social Media Marketing Agency",
    icon: "📱",
    priceRange: "$$",
    offers: [
      { name: "Social Media Management - Basic", price: "$1,200 CAD/mo", currency: "CAD" },
      { name: "Social Media Management - Growth", price: "$2,500 CAD/mo", currency: "CAD" },
      { name: "Social Media Management - Premium", price: "$5,000 CAD/mo", currency: "CAD" }
    ]
  },
  {
    slug: "email-marketing-agency",
    name: "Email Marketing Agency",
    displayName: "Email Marketing Agency",
    icon: "📧",
    priceRange: "$",
    offers: [
      { name: "Email Marketing - Starter", price: "$800 CAD/mo", currency: "CAD" },
      { name: "Email Marketing - Professional", price: "$1,800 CAD/mo", currency: "CAD" },
      { name: "Email Marketing - Enterprise", price: "$3,500 CAD/mo", currency: "CAD" }
    ]
  },
  {
    slug: "content-marketing-agency",
    name: "Content Marketing Agency",
    displayName: "Content Marketing Agency",
    icon: "✍️",
    priceRange: "$$",
    offers: [
      { name: "Content Marketing - Basic", price: "$1,500 CAD/mo", currency: "CAD" },
      { name: "Content Marketing - Growth", price: "$3,000 CAD/mo", currency: "CAD" },
      { name: "Content Marketing - Premium", price: "$6,000 CAD/mo", currency: "CAD" }
    ]
  },
  {
    slug: "ai-automation-agency",
    name: "AI Automation Agency",
    displayName: "AI Automation Agency",
    icon: "🤖",
    priceRange: "$$$",
    offers: [
      { name: "AI Automation - Starter", price: "$3,000 CAD/mo", currency: "CAD" },
      { name: "AI Automation - Advanced", price: "$6,000 CAD/mo", currency: "CAD" },
      { name: "AI Automation - Enterprise", price: "$12,000 CAD/mo", currency: "CAD" }
    ]
  },
  {
    slug: "ai-development-company",
    name: "AI Development Company",
    displayName: "AI Development Company",
    icon: "🧠",
    priceRange: "$$$",
    offers: [
      { name: "AI Development - MVP", price: "$15,000 CAD", currency: "CAD" },
      { name: "AI Development - Production", price: "$35,000 CAD", currency: "CAD" },
      { name: "AI Development - Enterprise", price: "$75,000 CAD", currency: "CAD" }
    ]
  },
  {
    slug: "ecommerce-seo-agency",
    name: "E-commerce SEO Agency",
    displayName: "E-commerce SEO Agency",
    icon: "🛒",
    priceRange: "$$",
    offers: [
      { name: "E-commerce SEO - Starter", price: "$2,000 CAD/mo", currency: "CAD" },
      { name: "E-commerce SEO - Growth", price: "$4,500 CAD/mo", currency: "CAD" },
      { name: "E-commerce SEO - Scale", price: "$9,000 CAD/mo", currency: "CAD" }
    ]
  },
  {
    slug: "ppc-agency",
    name: "PPC Agency",
    displayName: "PPC Agency", 
    icon: "💰",
    priceRange: "$$$",
    offers: [
      { name: "PPC Management - Starter", price: "$2,000 CAD/mo", currency: "CAD" },
      { name: "PPC Management - Growth", price: "$4,000 CAD/mo", currency: "CAD" },
      { name: "PPC Management - Scale", price: "$8,000 CAD/mo", currency: "CAD" }
    ]
  }
];