-- Seed 6 Professional High-Level Blocks
-- These are premium, production-ready blocks for professional proposals

-- 1. Executive Dashboard Block - Data visualization with KPIs
INSERT INTO block_templates (id, name, description, category, preview_url, is_premium, usage_count, content)
VALUES (
  'b1000000-0000-0000-0000-000000000001',
  'Executive Dashboard',
  'Professional KPI dashboard with metrics, charts, and performance indicators',
  'data',
  '/placeholder.svg?height=200&width=300',
  true,
  0,
  '{
    "type": "dashboard",
    "title": "Performance Dashboard",
    "subtitle": "Q4 2025 Executive Summary",
    "metrics": [
      {"label": "Revenue", "value": "$2.4M", "change": "+18%", "trend": "up"},
      {"label": "Active Users", "value": "45,230", "change": "+12%", "trend": "up"},
      {"label": "Conversion Rate", "value": "4.8%", "change": "+0.6%", "trend": "up"},
      {"label": "NPS Score", "value": "72", "change": "+8", "trend": "up"}
    ],
    "chartData": {
      "type": "area",
      "title": "Monthly Revenue Trend"
    },
    "style": {
      "backgroundColor": "#f8fafc",
      "accentColor": "#3b82f6"
    }
  }'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  updated_at = NOW();

-- 2. Team Showcase Block - Professional team grid
INSERT INTO block_templates (id, name, description, category, preview_url, is_premium, usage_count, content)
VALUES (
  'b1000000-0000-0000-0000-000000000002',
  'Leadership Team',
  'Elegant team showcase with photos, roles, and professional bios',
  'content',
  '/placeholder.svg?height=200&width=300',
  true,
  0,
  '{
    "type": "team",
    "title": "Our Leadership Team",
    "subtitle": "Meet the experts driving our vision forward",
    "layout": "grid",
    "members": [
      {
        "name": "Sarah Chen",
        "role": "Chief Executive Officer",
        "image": "/placeholder.svg?height=200&width=200",
        "bio": "20+ years in enterprise technology. Former VP at Fortune 500.",
        "linkedin": "#"
      },
      {
        "name": "Michael Rodriguez",
        "role": "Chief Technology Officer",
        "image": "/placeholder.svg?height=200&width=200",
        "bio": "Ex-Google engineer. Led teams of 100+ developers.",
        "linkedin": "#"
      },
      {
        "name": "Emily Watson",
        "role": "Chief Financial Officer",
        "image": "/placeholder.svg?height=200&width=200",
        "bio": "Former Goldman Sachs. MBA from Harvard Business School.",
        "linkedin": "#"
      }
    ],
    "style": {
      "backgroundColor": "#ffffff",
      "cardStyle": "elevated"
    }
  }'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  updated_at = NOW();

-- 3. Comparison Table Block - Feature comparison
INSERT INTO block_templates (id, name, description, category, preview_url, is_premium, usage_count, content)
VALUES (
  'b1000000-0000-0000-0000-000000000003',
  'Competitive Analysis',
  'Side-by-side comparison table highlighting your advantages',
  'data',
  '/placeholder.svg?height=200&width=300',
  true,
  0,
  '{
    "type": "comparison",
    "title": "Why Choose Us",
    "subtitle": "See how we stack up against the competition",
    "columns": ["Feature", "Our Solution", "Competitor A", "Competitor B"],
    "rows": [
      {"feature": "Implementation Time", "us": "2 weeks", "compA": "3 months", "compB": "6 weeks", "highlight": true},
      {"feature": "24/7 Support", "us": "✓", "compA": "✗", "compB": "✓", "highlight": false},
      {"feature": "Custom Integrations", "us": "Unlimited", "compA": "5 max", "compB": "10 max", "highlight": true},
      {"feature": "Data Security", "us": "SOC 2 Type II", "compA": "SOC 2 Type I", "compB": "None", "highlight": true},
      {"feature": "Price per User", "us": "$29/mo", "compA": "$49/mo", "compB": "$39/mo", "highlight": true}
    ],
    "style": {
      "highlightColor": "#10b981",
      "headerBg": "#1e293b"
    }
  }'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  updated_at = NOW();

-- 4. Timeline/Roadmap Block - Project phases
INSERT INTO block_templates (id, name, description, category, preview_url, is_premium, usage_count, content)
VALUES (
  'b1000000-0000-0000-0000-000000000004',
  'Project Roadmap',
  'Visual timeline showing project phases, milestones, and deliverables',
  'data',
  '/placeholder.svg?height=200&width=300',
  true,
  0,
  '{
    "type": "timeline",
    "title": "Implementation Roadmap",
    "subtitle": "Your path to success in 4 phases",
    "phases": [
      {
        "name": "Discovery",
        "duration": "Week 1-2",
        "status": "complete",
        "milestones": ["Stakeholder interviews", "Requirements gathering", "Technical assessment"],
        "color": "#3b82f6"
      },
      {
        "name": "Design",
        "duration": "Week 3-4",
        "status": "current",
        "milestones": ["Solution architecture", "UI/UX mockups", "Integration planning"],
        "color": "#8b5cf6"
      },
      {
        "name": "Development",
        "duration": "Week 5-8",
        "status": "upcoming",
        "milestones": ["Core functionality", "API integrations", "Testing & QA"],
        "color": "#ec4899"
      },
      {
        "name": "Launch",
        "duration": "Week 9-10",
        "status": "upcoming",
        "milestones": ["User training", "Go-live support", "Performance monitoring"],
        "color": "#10b981"
      }
    ],
    "style": {
      "layout": "horizontal",
      "showConnectors": true
    }
  }'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  updated_at = NOW();

-- 5. Testimonial Showcase Block - Client success stories
INSERT INTO block_templates (id, name, description, category, preview_url, is_premium, usage_count, content)
VALUES (
  'b1000000-0000-0000-0000-000000000005',
  'Client Success Stories',
  'Powerful testimonials with client photos, companies, and results',
  'testimonial',
  '/placeholder.svg?height=200&width=300',
  true,
  0,
  '{
    "type": "testimonials",
    "title": "Trusted by Industry Leaders",
    "subtitle": "See what our clients have to say",
    "layout": "carousel",
    "testimonials": [
      {
        "quote": "This solution transformed our operations. We saw a 340% ROI within the first year.",
        "author": "Jennifer Morrison",
        "role": "VP of Operations",
        "company": "TechCorp Global",
        "image": "/placeholder.svg?height=80&width=80",
        "logo": "/placeholder.svg?height=40&width=120",
        "metrics": {"roi": "340%", "time_saved": "20hrs/week"}
      },
      {
        "quote": "The implementation was seamless. Their team understood our needs from day one.",
        "author": "David Park",
        "role": "Chief Digital Officer",
        "company": "Finance Plus",
        "image": "/placeholder.svg?height=80&width=80",
        "logo": "/placeholder.svg?height=40&width=120",
        "metrics": {"efficiency": "+65%", "cost_reduction": "40%"}
      }
    ],
    "logos": [
      "/placeholder.svg?height=40&width=120",
      "/placeholder.svg?height=40&width=120",
      "/placeholder.svg?height=40&width=120",
      "/placeholder.svg?height=40&width=120"
    ],
    "style": {
      "backgroundColor": "#f1f5f9",
      "cardStyle": "glass"
    }
  }'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  updated_at = NOW();

-- 6. Investment/Pricing Block - Tiered pricing with features
INSERT INTO block_templates (id, name, description, category, preview_url, is_premium, usage_count, content)
VALUES (
  'b1000000-0000-0000-0000-000000000006',
  'Investment Options',
  'Professional pricing table with tiers, features, and clear CTAs',
  'pricing',
  '/placeholder.svg?height=200&width=300',
  true,
  0,
  '{
    "type": "pricing",
    "title": "Investment Options",
    "subtitle": "Choose the plan that fits your needs",
    "currency": "USD",
    "billingPeriod": "month",
    "tiers": [
      {
        "name": "Starter",
        "price": 2500,
        "description": "Perfect for small teams getting started",
        "features": [
          "Up to 10 users",
          "Basic analytics",
          "Email support",
          "5GB storage",
          "Standard integrations"
        ],
        "cta": "Get Started",
        "highlighted": false
      },
      {
        "name": "Professional",
        "price": 7500,
        "description": "Best for growing organizations",
        "features": [
          "Up to 50 users",
          "Advanced analytics",
          "Priority support",
          "50GB storage",
          "Custom integrations",
          "API access",
          "Dedicated CSM"
        ],
        "cta": "Most Popular",
        "highlighted": true,
        "badge": "RECOMMENDED"
      },
      {
        "name": "Enterprise",
        "price": null,
        "priceLabel": "Custom",
        "description": "For large-scale deployments",
        "features": [
          "Unlimited users",
          "Enterprise analytics",
          "24/7 phone support",
          "Unlimited storage",
          "White-label options",
          "SLA guarantee",
          "On-premise option"
        ],
        "cta": "Contact Sales",
        "highlighted": false
      }
    ],
    "footer": "All plans include 30-day money-back guarantee",
    "style": {
      "highlightColor": "#3b82f6",
      "cardRadius": "xl"
    }
  }'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  updated_at = NOW();
