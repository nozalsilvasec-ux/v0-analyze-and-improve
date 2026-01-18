// Frontend-only block templates - no database needed
export interface BlockTemplate {
  id: string
  name: string
  description: string
  category: "header" | "content" | "pricing" | "testimonial" | "cta" | "data" | "media"
  preview_url: string
  is_premium: boolean
  content: {
    type: string
    [key: string]: unknown
  }
}

export const BLOCK_TEMPLATES: BlockTemplate[] = [
  // PREMIUM PROFESSIONAL BLOCKS
  {
    id: "executive-dashboard",
    name: "Executive Dashboard",
    description: "KPI metrics grid with 4 key performance indicators",
    category: "data",
    preview_url: "/kpi-dashboard-metrics.jpg",
    is_premium: true,
    content: {
      type: "dashboard",
      title: "Key Performance Indicators",
      metrics: [
        { label: "Revenue Growth", value: "$2.4M", change: "+23%", trend: "up", icon: "dollar" },
        { label: "Customer Acquisition", value: "1,847", change: "+18%", trend: "up", icon: "users" },
        { label: "Market Share", value: "34%", change: "+5%", trend: "up", icon: "chart" },
        { label: "Team Growth", value: "52", change: "+12", trend: "up", icon: "briefcase" },
      ],
      showChart: true,
      style: { backgroundColor: "#f8fafc" },
    },
  },
  {
    id: "leadership-team",
    name: "Leadership Team",
    description: "Professional team showcase with executive profiles",
    category: "content",
    preview_url: "/executive-team-profiles.jpg",
    is_premium: true,
    content: {
      type: "team",
      title: "Leadership Team",
      subtitle: "Meet the people driving our vision forward",
      members: [
        {
          name: "Sarah Chen",
          role: "Chief Executive Officer",
          image: "/professional-woman-ceo.png",
          bio: "20+ years in enterprise technology",
        },
        {
          name: "Michael Ross",
          role: "Chief Technology Officer",
          image: "/professional-cto-headshot.png",
          bio: "Former Google engineering lead",
        },
        {
          name: "Emily Watson",
          role: "Chief Financial Officer",
          image: "/professional-woman-cfo-headshot.jpg",
          bio: "IPO specialist, ex-Goldman Sachs",
        },
        {
          name: "David Kim",
          role: "Chief Operating Officer",
          image: "/professional-man-coo-headshot.jpg",
          bio: "Scaled 3 unicorn startups",
        },
      ],
      style: { layout: "grid", columns: 4 },
    },
  },
  {
    id: "competitive-analysis",
    name: "Competitive Analysis",
    description: "Side-by-side comparison matrix vs competitors",
    category: "data",
    preview_url: "/competitive-analysis-comparison-table.jpg",
    is_premium: true,
    content: {
      type: "comparison",
      title: "Competitive Analysis",
      subtitle: "See how we stack up against the competition",
      competitors: ["Competitor A", "Competitor B", "Competitor C"],
      features: [
        { name: "AI-Powered Analytics", us: true, competitors: [false, true, false] },
        { name: "Real-time Collaboration", us: true, competitors: [true, false, false] },
        { name: "Enterprise Security", us: true, competitors: [true, true, false] },
        { name: "24/7 Support", us: true, competitors: [false, false, true] },
        { name: "Custom Integrations", us: true, competitors: [false, true, false] },
      ],
      style: { highlightUs: true, accentColor: "#10b981" },
    },
  },
  {
    id: "project-roadmap",
    name: "Project Roadmap",
    description: "Timeline visualization with quarterly milestones",
    category: "content",
    preview_url: "/project-roadmap-timeline.jpg",
    is_premium: true,
    content: {
      type: "roadmap",
      title: "Implementation Roadmap",
      subtitle: "Your path to success",
      phases: [
        {
          name: "Q1 2026",
          title: "Foundation",
          milestones: ["Discovery & Planning", "Team Onboarding", "Infrastructure Setup"],
          status: "completed",
        },
        {
          name: "Q2 2026",
          title: "Development",
          milestones: ["Core Platform Build", "Integration Development", "Beta Testing"],
          status: "in-progress",
        },
        {
          name: "Q3 2026",
          title: "Launch",
          milestones: ["Production Deployment", "User Training", "Go-Live Support"],
          status: "upcoming",
        },
        {
          name: "Q4 2026",
          title: "Optimization",
          milestones: ["Performance Tuning", "Feature Expansion", "ROI Analysis"],
          status: "upcoming",
        },
      ],
      style: { layout: "horizontal", showConnectors: true },
    },
  },
  {
    id: "client-success-stories",
    name: "Client Success Stories",
    description: "Premium testimonials with metrics and ratings",
    category: "testimonial",
    preview_url: "/client-testimonials-success-stories.jpg",
    is_premium: true,
    content: {
      type: "testimonial",
      title: "Client Success Stories",
      subtitle: "Trusted by industry leaders worldwide",
      testimonials: [
        {
          quote: "This solution transformed our operations, delivering 340% ROI within the first year.",
          author: "Jennifer Martinez",
          company: "Fortune 500 Tech Co",
          logo: "/tech-company-logo.jpg",
          rating: 5,
          metric: "340% ROI",
        },
        {
          quote: "The most intuitive enterprise platform we've ever implemented. Our team was productive from day one.",
          author: "Robert Chang",
          company: "Global Finance Inc",
          logo: "/finance-company-logo.png",
          rating: 5,
          metric: "50% faster onboarding",
        },
        {
          quote: "Exceptional support and continuous innovation. They're a true strategic partner.",
          author: "Amanda Foster",
          company: "Healthcare Leaders",
          logo: "/healthcare-company-logo.png",
          rating: 5,
          metric: "99.9% uptime",
        },
      ],
      style: { layout: "carousel", showRatings: true, showMetrics: true },
    },
  },
  {
    id: "investment-options",
    name: "Investment Options",
    description: "3-tier pricing/investment structure",
    category: "pricing",
    preview_url: "/investment-pricing-tiers.jpg",
    is_premium: true,
    content: {
      type: "investment",
      title: "Investment Options",
      subtitle: "Flexible options tailored to your needs",
      tiers: [
        {
          name: "Starter",
          price: "$25,000",
          period: "one-time",
          description: "Perfect for small teams",
          features: ["Core Platform Access", "5 User Licenses", "Email Support", "Basic Analytics"],
          highlighted: false,
        },
        {
          name: "Professional",
          price: "$75,000",
          period: "one-time",
          description: "Most popular choice",
          features: [
            "Everything in Starter",
            "25 User Licenses",
            "Priority Support",
            "Advanced Analytics",
            "Custom Integrations",
          ],
          highlighted: true,
          badge: "Recommended",
        },
        {
          name: "Enterprise",
          price: "Custom",
          period: "contact us",
          description: "For large organizations",
          features: [
            "Everything in Professional",
            "Unlimited Users",
            "Dedicated Success Manager",
            "SLA Guarantee",
            "On-premise Option",
          ],
          highlighted: false,
        },
      ],
      style: { layout: "horizontal", showBadges: true },
    },
  },

  // STANDARD BLOCKS
  {
    id: "hero-banner",
    name: "Hero Banner",
    description: "Full-width hero section with headline and CTA",
    category: "header",
    preview_url: "/hero-banner-section.jpg",
    is_premium: false,
    content: {
      type: "hero",
      title: "Transform Your Business",
      subtitle: "Innovative solutions for modern challenges",
      cta: { text: "Get Started", url: "#" },
      style: { backgroundColor: "#1e40af", textColor: "#ffffff" },
    },
  },
  {
    id: "gradient-hero",
    name: "Gradient Hero",
    description: "Hero section with gradient background",
    category: "header",
    preview_url: "/gradient-hero.png",
    is_premium: false,
    content: {
      type: "hero",
      title: "The Future is Here",
      subtitle: "Leading the next generation of innovation",
      cta: { text: "Learn More", url: "#" },
      style: { gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", textColor: "#ffffff" },
    },
  },
  {
    id: "minimal-header",
    name: "Minimal Header",
    description: "Clean, minimalist header section",
    category: "header",
    preview_url: "/minimal-clean-header.jpg",
    is_premium: false,
    content: {
      type: "hero",
      title: "Simple. Elegant. Powerful.",
      subtitle: "Less is more",
      style: { backgroundColor: "#ffffff", textColor: "#111827" },
    },
  },
  {
    id: "two-column-content",
    name: "Two Column Layout",
    description: "Side-by-side content layout",
    category: "content",
    preview_url: "/two-column-layout.jpg",
    is_premium: false,
    content: {
      type: "text",
      title: "Why Choose Us",
      text: "We deliver exceptional value through innovation and dedication.",
      layout: "two-column",
    },
  },
  {
    id: "feature-grid",
    name: "Feature Grid",
    description: "Grid of features with icons",
    category: "content",
    preview_url: "/feature-grid-icons.jpg",
    is_premium: false,
    content: {
      type: "text",
      title: "Our Features",
      features: [
        { icon: "zap", title: "Lightning Fast", description: "Optimized for speed" },
        { icon: "shield", title: "Secure", description: "Enterprise-grade security" },
        { icon: "globe", title: "Global", description: "Available worldwide" },
        { icon: "heart", title: "Loved", description: "Trusted by thousands" },
      ],
    },
  },
  {
    id: "numbered-list",
    name: "Numbered List",
    description: "Sequential numbered content list",
    category: "content",
    preview_url: "/numbered-list-steps.jpg",
    is_premium: false,
    content: {
      type: "text",
      title: "How It Works",
      items: [
        { number: 1, title: "Sign Up", description: "Create your account in minutes" },
        { number: 2, title: "Configure", description: "Set up your preferences" },
        { number: 3, title: "Launch", description: "Go live and start growing" },
      ],
    },
  },
  {
    id: "pricing-table",
    name: "Pricing Table",
    description: "Three-tier pricing comparison",
    category: "pricing",
    preview_url: "/pricing-table-comparison.jpg",
    is_premium: false,
    content: {
      type: "pricing",
      title: "Simple, Transparent Pricing",
      tiers: [
        { name: "Basic", price: "$9", period: "/month", features: ["5 Projects", "Basic Support", "1GB Storage"] },
        {
          name: "Pro",
          price: "$29",
          period: "/month",
          features: ["Unlimited Projects", "Priority Support", "10GB Storage", "Analytics"],
          highlighted: true,
        },
        {
          name: "Team",
          price: "$79",
          period: "/month",
          features: ["Everything in Pro", "Team Collaboration", "100GB Storage", "API Access"],
        },
      ],
    },
  },
  {
    id: "single-price-card",
    name: "Single Price Card",
    description: "Focused single pricing option",
    category: "pricing",
    preview_url: "/single-price-card.jpg",
    is_premium: false,
    content: {
      type: "pricing",
      title: "One Plan, Everything Included",
      tiers: [
        {
          name: "All-Access",
          price: "$49",
          period: "/month",
          features: ["All Features", "Unlimited Usage", "Priority Support", "Custom Domain"],
          highlighted: true,
        },
      ],
    },
  },
  {
    id: "quote-card",
    name: "Quote Card",
    description: "Single testimonial quote",
    category: "testimonial",
    preview_url: "/testimonial-quote-card.jpg",
    is_premium: false,
    content: {
      type: "quote",
      quote: "This product changed everything for our team. Highly recommended!",
      author: "Jane Smith",
      role: "CEO, TechCorp",
    },
  },
  {
    id: "stats-grid",
    name: "Stats Grid",
    description: "Key statistics display",
    category: "data",
    preview_url: "/placeholder.svg?height=120&width=200",
    is_premium: false,
    content: {
      type: "dashboard",
      title: "By the Numbers",
      metrics: [
        { label: "Customers", value: "10,000+", trend: "up" },
        { label: "Countries", value: "50+", trend: "up" },
        { label: "Uptime", value: "99.9%", trend: "up" },
        { label: "Support Rating", value: "4.9/5", trend: "up" },
      ],
      showChart: false,
    },
  },
  {
    id: "comparison-table",
    name: "Comparison Table",
    description: "Feature comparison across options",
    category: "data",
    preview_url: "/placeholder.svg?height=120&width=200",
    is_premium: false,
    content: {
      type: "table",
      title: "Feature Comparison",
      headers: ["Feature", "Basic", "Pro", "Enterprise"],
      rows: [
        ["Cloud Storage", "5GB", "50GB", "Unlimited"],
        ["API Calls", "1,000/day", "10,000/day", "Unlimited"],
        ["Support", "Email", "Priority", "Dedicated"],
      ],
    },
  },
  {
    id: "cta-banner",
    name: "CTA Banner",
    description: "Call-to-action banner section",
    category: "cta",
    preview_url: "/placeholder.svg?height=120&width=200",
    is_premium: false,
    content: {
      type: "text",
      title: "Ready to Get Started?",
      text: "Join thousands of satisfied customers today.",
      cta: { text: "Start Free Trial", url: "#" },
      style: { backgroundColor: "#10b981", textColor: "#ffffff" },
    },
  },
  {
    id: "image-gallery",
    name: "Image Gallery",
    description: "Grid of images",
    category: "media",
    preview_url: "/placeholder.svg?height=120&width=200",
    is_premium: false,
    content: {
      type: "image",
      title: "Gallery",
      images: [
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
      ],
      layout: "grid",
    },
  },
  {
    id: "before-after",
    name: "Before After",
    description: "Comparison slider for transformations",
    category: "media",
    preview_url: "/placeholder.svg?height=120&width=200",
    is_premium: false,
    content: {
      type: "image",
      title: "The Transformation",
      before: "/placeholder.svg?height=300&width=500",
      after: "/placeholder.svg?height=300&width=500",
    },
  },
]

// Helper to filter blocks by category
export function getBlocksByCategory(category?: string): BlockTemplate[] {
  if (!category || category === "all") return BLOCK_TEMPLATES
  return BLOCK_TEMPLATES.filter((block) => block.category === category)
}

// Helper to search blocks
export function searchBlocks(query: string): BlockTemplate[] {
  const lowerQuery = query.toLowerCase()
  return BLOCK_TEMPLATES.filter(
    (block) => block.name.toLowerCase().includes(lowerQuery) || block.description.toLowerCase().includes(lowerQuery),
  )
}

// Sort with premium first
export function getSortedBlocks(blocks: BlockTemplate[]): BlockTemplate[] {
  return [...blocks].sort((a, b) => {
    if (a.is_premium && !b.is_premium) return -1
    if (!a.is_premium && b.is_premium) return 1
    return a.name.localeCompare(b.name)
  })
}
