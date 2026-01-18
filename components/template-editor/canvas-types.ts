import type { Section } from "@/lib/supabase/types"

// Color palette for section backgrounds
export const sectionColorPalette = [
  { name: "Transparent", value: "transparent" },
  { name: "White", value: "#ffffff" },
  { name: "Light Gray", value: "#f8fafc" },
  { name: "Blue Tint", value: "#eff6ff" },
  { name: "Green Tint", value: "#f0fdf4" },
  { name: "Purple Tint", value: "#faf5ff" },
  { name: "Amber Tint", value: "#fffbeb" },
  { name: "Rose Tint", value: "#fff1f2" },
]

// Background images for sections
export const sectionBackgroundImages = [
  "/abstract-blue-gradient.png",
  "/modern-office.png",
  "/technology-network-pattern.jpg",
]

// Stock images for image picker
export const stockImages = [
  "/modern-executive-boardroom-meeting-corporate-profe.jpg",
  "/professional-business-handshake-deal-partnership-a.jpg",
  "/business-strategy-planning-session-whiteboard-stic.jpg",
  "/professional-giving-presentation-large-screen-audi.jpg",
  "/trendy-startup-office-exposed-brick-modern-furnitu.jpg",
  "/business-team-celebrating-success-achievement-high.jpg",
]

// Default content for each section type
export const defaultSectionContent: Record<Section["type"], Record<string, unknown>> = {
  hero: {
    title: "[Company Name]",
    subtitle: "Prepared for [Client Name]",
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  },
  text: { title: "Section Title", body: "Enter your content here..." },
  image: {
    url: "/placeholder.svg?height=400&width=800",
    alt: "Image description",
    caption: "Image caption",
  },
  pricing: {
    title: "Investment",
    tiers: [
      { name: "Starter", price: "$5,000", features: ["Feature 1", "Feature 2"] },
      { name: "Professional", price: "$10,000", features: ["All Starter features", "Feature 3", "Feature 4"] },
    ],
  },
  quote: {
    text: "Add a compelling quote here that supports your proposal...",
    author: "Author Name",
    role: "Title, Company",
  },
  table: {
    title: "Data Table",
    headers: ["Item", "Description", "Value"],
    rows: [
      ["Item 1", "Description here", "$1,000"],
      ["Item 2", "Description here", "$2,000"],
    ],
  },
  header: { text: "Header" },
  footer: { text: "Footer" },
  dashboard: {
    type: "dashboard",
    title: "Key Performance Indicators",
    metrics: [
      { label: "Revenue Growth", value: "$2.4M", change: "+23%", trend: "up" },
      { label: "Customer Acquisition", value: "1,847", change: "+18%", trend: "up" },
      { label: "Retention Rate", value: "94.2%", change: "+2.1%", trend: "up" },
      { label: "Market Share", value: "12.8%", change: "+3.4%", trend: "up" },
    ],
    showChart: true,
    style: { backgroundColor: "#f8fafc" },
  },
  team: {
    type: "team",
    title: "Leadership Team",
    members: [
      {
        name: "Sarah Chen",
        role: "Chief Executive Officer",
        bio: "20+ years in enterprise technology",
        image: "/professional-woman-ceo.png",
      },
      {
        name: "Michael Ross",
        role: "Chief Technology Officer",
        bio: "Former Google engineering lead",
        image: "/professional-cto-headshot.png",
      },
      {
        name: "Emily Watson",
        role: "Chief Financial Officer",
        bio: "IPO specialist, ex-Goldman Sachs",
        image: "/professional-woman-cfo-headshot.jpg",
      },
      {
        name: "David Kim",
        role: "Chief Operating Officer",
        bio: "Scaled 3 unicorn startups",
        image: "/professional-man-coo-headshot.jpg",
      },
    ],
  },
  comparison: {
    type: "comparison",
    title: "Competitive Analysis",
    subtitle: "See how we stack up against the competition",
    competitors: ["Us", "Competitor A", "Competitor B", "Competitor C"],
    features: [
      { name: "AI-Powered Analytics", values: [true, false, true, false] },
      { name: "Real-time Collaboration", values: [true, true, false, false] },
      { name: "Enterprise Security", values: [true, true, true, false] },
      { name: "24/7 Support", values: [true, false, false, false] },
      { name: "Custom Integrations", values: [true, false, true, true] },
    ],
  },
  roadmap: {
    type: "roadmap",
    title: "Implementation Roadmap",
    phases: [
      {
        name: "Phase 1",
        period: "Q1 2026",
        status: "TBD",
        milestones: [{ task: "Task", completed: false }, { task: "Task" }, { task: "Task" }],
      },
      {
        name: "Phase 2",
        period: "Q2 2026",
        status: "TBD",
        milestones: [{ task: "Task", completed: false }, { task: "Task" }],
      },
    ],
  },
  testimonial: {
    type: "testimonial",
    title: "Client Success Stories",
    testimonials: [
      {
        quote: "This solution transformed our operations completely.",
        author: "John Smith",
        role: "CEO",
        company: "TechCorp",
        rating: 5,
        metric: "200% ROI",
        logo: "/tech-company-logo.jpg",
      },
      {
        quote: "Exceeded all our expectations in every way.",
        author: "Jane Doe",
        role: "VP Operations",
        company: "FinanceHub",
        rating: 5,
        metric: "50% cost reduction",
        logo: "/finance-company-logo.png",
      },
    ],
  },
  investment: {
    type: "investment",
    title: "Investment Options",
    tiers: [
      {
        name: "Seed",
        amount: "$500K - $1M",
        equity: "5-10%",
        features: ["Board observer seat", "Quarterly updates", "Basic support"],
        highlighted: false,
      },
      {
        name: "Series A",
        amount: "$2M - $5M",
        equity: "15-20%",
        features: ["Board seat", "Monthly updates", "Priority support", "Strategic guidance"],
        highlighted: true,
      },
      {
        name: "Series B",
        amount: "$10M+",
        equity: "10-15%",
        features: ["Multiple board seats", "Weekly updates", "Dedicated support", "Full partnership"],
        highlighted: false,
      },
    ],
  },
}

// Section type definitions for the add menu
export const sectionTypeDefinitions = [
  { type: "text" as const, icon: "Type", label: "Text Block", description: "Add paragraphs and formatted text" },
  { type: "image" as const, icon: "ImageIcon", label: "Image", description: "Add photos or graphics" },
  { type: "quote" as const, icon: "Quote", label: "Quote", description: "Add a testimonial or quote" },
  { type: "table" as const, icon: "Table", label: "Table", description: "Add data in table format" },
  { type: "pricing" as const, icon: "DollarSign", label: "Pricing", description: "Add pricing information" },
  { type: "dashboard" as const, icon: "BarChart3", label: "Dashboard", description: "Add KPI metrics grid" },
  { type: "team" as const, icon: "Users", label: "Team", description: "Add team member profiles" },
  { type: "comparison" as const, icon: "Table", label: "Comparison", description: "Add feature comparison table" },
  { type: "roadmap" as const, icon: "Calendar", label: "Roadmap", description: "Add project timeline" },
  { type: "testimonial" as const, icon: "Star", label: "Testimonials", description: "Add client success stories" },
  { type: "investment" as const, icon: "DollarSign", label: "Investment", description: "Add investment tiers" },
]

// Style presets for sections
export const stylePresets = [
  { name: "Light", bg: "#ffffff", text: "#1e293b" },
  { name: "Dark", bg: "#1e293b", text: "#ffffff" },
  { name: "Blue", bg: "#1e40af", text: "#ffffff" },
  { name: "Green", bg: "#15803d", text: "#ffffff" },
  { name: "Gray", bg: "#64748b", text: "#ffffff" },
  { name: "Subtle", bg: "#f1f5f9", text: "#334155" },
]

// Color options for background picker
export const colorOptions = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Black", value: "#1e293b" },
  { name: "Green", value: "#22c55e" },
  { name: "Gray", value: "#64748b" },
  { name: "Light", value: "#e2e8f0" },
  { name: "White", value: "#ffffff" },
]

// Image settings interface
export interface ImageSettings {
  width: number
  aspectRatio: string
  objectFit: string
  borderRadius: number
  position: "left" | "center" | "right"
  layout: "full" | "text-left" | "text-right"
}

export const defaultImageSettings: ImageSettings = {
  width: 100,
  aspectRatio: "16/9",
  objectFit: "cover",
  borderRadius: 8,
  position: "center",
  layout: "full",
}

// Helper function for position classes
export const getPositionClasses = (position: "left" | "center" | "right"): string => {
  switch (position) {
    case "left":
      return "mr-auto"
    case "right":
      return "ml-auto"
    default:
      return "mx-auto"
  }
}

// Helper function for contextual placeholder
export const getContextualPlaceholder = (caption?: string, alt?: string): string => {
  const text = (caption || alt || "").toLowerCase()
  if (text.includes("team") || text.includes("people")) return "400&width=600&query=business team"
  if (text.includes("chart") || text.includes("graph")) return "400&width=800&query=business chart"
  if (text.includes("office") || text.includes("workspace")) return "400&width=800&query=modern office"
  if (text.includes("product") || text.includes("tech")) return "400&width=800&query=technology product"
  return "400&width=800&query=professional business"
}
