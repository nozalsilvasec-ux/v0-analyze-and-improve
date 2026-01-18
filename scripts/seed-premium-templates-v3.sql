-- Premium Templates Seed Data
-- 5 Original Premium Templates with AI-generated image placeholders

-- Template 1: Executive Business Strategy (consulting category)
INSERT INTO templates (
  id, name, description, category, thumbnail_url, content, is_public, is_premium, usage_count, rating, created_at, updated_at
) VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'Executive Business Strategy',
  'A comprehensive C-suite level proposal template designed for enterprise consulting engagements. Features strategic frameworks, market analysis sections, and executive dashboards.',
  'consulting',
  '/placeholder.svg?height=400&width=600',
  '{
    "sections": [
      {
        "id": "hero-1",
        "type": "hero",
        "title": "Strategic Partnership Proposal",
        "order": 1,
        "content": {
          "subtitle": "Transforming Vision Into Market Leadership",
          "date": "January 2026",
          "clientName": "[Client Name]",
          "heroImage": "/placeholder.svg?height=600&width=1200"
        }
      },
      {
        "id": "exec-summary",
        "type": "text",
        "title": "Executive Summary",
        "order": 2,
        "content": {
          "text": "This strategic proposal outlines a comprehensive 18-month transformation initiative designed to position your organization as the definitive market leader in your sector. Our approach combines deep industry expertise with cutting-edge analytical frameworks to deliver measurable outcomes.\n\nKey deliverables include a complete market positioning analysis, competitive intelligence framework, and actionable growth roadmap with quarterly milestones."
        }
      },
      {
        "id": "market-analysis",
        "type": "image",
        "title": "Market Landscape Analysis",
        "order": 3,
        "content": {
          "imageUrl": "/placeholder.svg?height=500&width=900",
          "caption": "Current market dynamics and competitive positioning"
        }
      },
      {
        "id": "strategic-framework",
        "type": "text",
        "title": "Strategic Framework",
        "order": 4,
        "content": {
          "text": "Our proprietary Strategic Excellence Framework encompasses four critical pillars:\n\n1. Market Intelligence & Positioning\n2. Operational Excellence & Efficiency\n3. Innovation Pipeline Development\n4. Stakeholder Value Optimization\n\nEach pillar is supported by quantitative metrics and qualitative assessments to ensure comprehensive coverage of your strategic objectives."
        }
      },
      {
        "id": "timeline",
        "type": "image",
        "title": "Implementation Roadmap",
        "order": 5,
        "content": {
          "imageUrl": "/placeholder.svg?height=400&width=1000",
          "caption": "18-month strategic implementation timeline"
        }
      },
      {
        "id": "investment",
        "type": "pricing",
        "title": "Investment Overview",
        "order": 6,
        "content": {
          "packages": [
            {"name": "Foundation", "price": "$150,000", "description": "Core strategy development and market analysis", "features": ["Market positioning study", "Competitive analysis", "Strategic roadmap", "Quarterly reviews"]},
            {"name": "Accelerator", "price": "$275,000", "description": "Full transformation with hands-on implementation support", "features": ["Everything in Foundation", "Implementation support", "Change management", "Executive coaching", "Monthly progress reviews"]},
            {"name": "Enterprise", "price": "$450,000", "description": "Complete strategic partnership with embedded team", "features": ["Everything in Accelerator", "Dedicated strategy team", "Board-level reporting", "M&A advisory", "24/7 executive access"]}
          ]
        }
      }
    ],
    "settings": {
      "fontFamily": "Inter",
      "primaryColor": "#1e3a5f",
      "accentColor": "#c9a227",
      "headerStyle": "executive"
    }
  }',
  true,
  true,
  847,
  4.9,
  NOW(),
  NOW()
);

-- Template 2: SaaS Product Launch Blueprint (product category)
INSERT INTO templates (
  id, name, description, category, thumbnail_url, content, is_public, is_premium, usage_count, rating, created_at, updated_at
) VALUES (
  'a2000000-0000-0000-0000-000000000002',
  'SaaS Product Launch Blueprint',
  'Modern tech-focused proposal template perfect for software companies, featuring product showcases, integration diagrams, and scalable pricing models.',
  'product',
  '/placeholder.svg?height=400&width=600',
  '{
    "sections": [
      {
        "id": "hero-1",
        "type": "hero",
        "title": "Product Partnership Proposal",
        "order": 1,
        "content": {
          "subtitle": "Accelerate Your Digital Transformation",
          "tagline": "Enterprise-Grade Solutions, Startup Agility",
          "heroImage": "/placeholder.svg?height=600&width=1200"
        }
      },
      {
        "id": "problem",
        "type": "text",
        "title": "The Challenge",
        "order": 2,
        "content": {
          "text": "In today''s rapidly evolving digital landscape, organizations face unprecedented challenges:\n\n• Legacy systems creating operational bottlenecks\n• Data silos preventing unified decision-making\n• Manual processes consuming 40% of team capacity\n• Security vulnerabilities from outdated infrastructure\n\nThese challenges cost enterprises an average of $2.3M annually in lost productivity and missed opportunities."
        }
      },
      {
        "id": "solution",
        "type": "image",
        "title": "Our Solution",
        "order": 3,
        "content": {
          "imageUrl": "/placeholder.svg?height=500&width=900",
          "caption": "Unified platform architecture designed for scale"
        }
      },
      {
        "id": "features",
        "type": "text",
        "title": "Platform Capabilities",
        "order": 4,
        "content": {
          "text": "Our enterprise platform delivers transformative capabilities:\n\nReal-Time Analytics Engine\nProcess 10M+ events per second with sub-millisecond latency. Get instant insights across all your data sources.\n\nIntelligent Automation\nAI-powered workflows that learn and adapt. Reduce manual tasks by 75% within the first quarter.\n\nSeamless Integrations\n200+ pre-built connectors to your existing tech stack. Deploy in days, not months.\n\nEnterprise Security\nSOC 2 Type II certified with end-to-end encryption. Your data never leaves your control."
        }
      },
      {
        "id": "demo",
        "type": "image",
        "title": "Platform Preview",
        "order": 5,
        "content": {
          "imageUrl": "/placeholder.svg?height=500&width=900",
          "caption": "Intuitive dashboard with customizable widgets"
        }
      },
      {
        "id": "pricing",
        "type": "pricing",
        "title": "Flexible Pricing",
        "order": 6,
        "content": {
          "packages": [
            {"name": "Starter", "price": "$499/mo", "description": "Perfect for growing teams", "features": ["Up to 25 users", "5 integrations", "Standard support", "99.9% uptime SLA"]},
            {"name": "Professional", "price": "$1,499/mo", "description": "For scaling organizations", "features": ["Up to 100 users", "Unlimited integrations", "Priority support", "Custom workflows", "Advanced analytics"]},
            {"name": "Enterprise", "price": "Custom", "description": "Full platform capabilities", "features": ["Unlimited users", "Dedicated instance", "24/7 premium support", "Custom development", "On-premise option"]}
          ]
        }
      },
      {
        "id": "next-steps",
        "type": "text",
        "title": "Getting Started",
        "order": 7,
        "content": {
          "text": "We make onboarding seamless:\n\n1. Discovery Call - Understand your unique requirements\n2. Technical Assessment - Map integration points and data flows\n3. Pilot Program - 30-day proof of concept with dedicated support\n4. Full Deployment - Phased rollout with comprehensive training\n\nAverage time to value: 6 weeks"
        }
      }
    ],
    "settings": {
      "fontFamily": "Inter",
      "primaryColor": "#7c3aed",
      "accentColor": "#10b981",
      "headerStyle": "modern"
    }
  }',
  true,
  true,
  1234,
  4.8,
  NOW(),
  NOW()
);

-- Template 3: Creative Agency Pitch Deck (design category)
INSERT INTO templates (
  id, name, description, category, thumbnail_url, content, is_public, is_premium, usage_count, rating, created_at, updated_at
) VALUES (
  'a3000000-0000-0000-0000-000000000003',
  'Creative Agency Pitch Deck',
  'Bold and visually striking proposal template for creative agencies, brand studios, and design consultancies. Showcases portfolio work with immersive layouts.',
  'design',
  '/placeholder.svg?height=400&width=600',
  '{
    "sections": [
      {
        "id": "hero-1",
        "type": "hero",
        "title": "Let''s Create Something Extraordinary",
        "order": 1,
        "content": {
          "subtitle": "Creative Partnership Proposal",
          "agency": "Studio Collective",
          "heroImage": "/placeholder.svg?height=600&width=1200"
        }
      },
      {
        "id": "intro",
        "type": "text",
        "title": "Who We Are",
        "order": 2,
        "content": {
          "text": "We are a collective of strategists, designers, and storytellers united by one belief: great brands are built on bold ideas fearlessly executed.\n\nWith 15 years of experience and 200+ successful brand transformations, we don''t just create beautiful designs—we craft experiences that move people to action.\n\nOur work has been recognized by Cannes Lions, D&AD, and The One Show."
        }
      },
      {
        "id": "portfolio-1",
        "type": "image",
        "title": "Selected Work: Brand Identity",
        "order": 3,
        "content": {
          "imageUrl": "/placeholder.svg?height=500&width=900",
          "caption": "Brand transformation for Fortune 500 clients"
        }
      },
      {
        "id": "process",
        "type": "text",
        "title": "Our Creative Process",
        "order": 4,
        "content": {
          "text": "Discovery & Immersion\nWe dive deep into your world—your customers, competitors, and culture. No assumptions, only insights.\n\nStrategic Foundation\nEvery pixel serves a purpose. We develop positioning that differentiates and messaging that resonates.\n\nCreative Exploration\nBold concepts, refined craft. We explore multiple directions before converging on the optimal solution.\n\nIterative Refinement\nCollaboration is our superpower. We refine together until every detail exceeds expectations.\n\nLaunch & Beyond\nWe don''t disappear after delivery. We ensure your brand launches with impact and evolves with intention."
        }
      },
      {
        "id": "portfolio-2",
        "type": "image",
        "title": "Selected Work: Digital Experience",
        "order": 5,
        "content": {
          "imageUrl": "/placeholder.svg?height=500&width=900",
          "caption": "Award-winning digital experiences"
        }
      },
      {
        "id": "scope",
        "type": "text",
        "title": "Proposed Scope",
        "order": 6,
        "content": {
          "text": "Based on our conversations, we propose a comprehensive brand refresh including:\n\n• Brand Strategy & Positioning\n• Visual Identity System\n• Brand Guidelines & Asset Library\n• Website Design (12 unique pages)\n• Social Media Template Suite\n• Launch Campaign Creative\n\nTimeline: 12 weeks from kickoff to launch"
        }
      },
      {
        "id": "investment",
        "type": "pricing",
        "title": "Investment",
        "order": 7,
        "content": {
          "packages": [
            {"name": "Brand Refresh", "price": "$75,000", "description": "Visual identity evolution", "features": ["Logo refinement", "Color & typography system", "Basic guidelines", "Key applications"]},
            {"name": "Brand Transformation", "price": "$150,000", "description": "Complete brand overhaul", "features": ["Full strategy engagement", "New visual identity", "Comprehensive guidelines", "Digital presence", "Launch support"]},
            {"name": "Brand Partnership", "price": "$250,000+", "description": "Ongoing creative partnership", "features": ["Everything above", "Retainer support", "Campaign development", "Brand guardianship", "Quarterly evolution"]}
          ]
        }
      }
    ],
    "settings": {
      "fontFamily": "DM Sans",
      "primaryColor": "#ec4899",
      "accentColor": "#f59e0b",
      "headerStyle": "creative"
    }
  }',
  true,
  true,
  956,
  4.9,
  NOW(),
  NOW()
);

-- Template 4: Management Consulting Framework (consulting category)
INSERT INTO templates (
  id, name, description, category, thumbnail_url, content, is_public, is_premium, usage_count, rating, created_at, updated_at
) VALUES (
  'a4000000-0000-0000-0000-000000000004',
  'Management Consulting Framework',
  'McKinsey-style professional consulting proposal with structured problem-solving frameworks, data visualization placeholders, and impact quantification sections.',
  'consulting',
  '/placeholder.svg?height=400&width=600',
  '{
    "sections": [
      {
        "id": "cover",
        "type": "hero",
        "title": "Operational Excellence Initiative",
        "order": 1,
        "content": {
          "subtitle": "Diagnostic Findings & Transformation Roadmap",
          "clientName": "[Client Organization]",
          "date": "January 2026",
          "heroImage": "/placeholder.svg?height=600&width=1200"
        }
      },
      {
        "id": "situation",
        "type": "text",
        "title": "Current Situation",
        "order": 2,
        "content": {
          "text": "Our diagnostic assessment identified significant opportunities for operational improvement:\n\nKey Findings:\n• Operating margins 340bps below industry median\n• Customer acquisition costs 2.3x higher than best-in-class competitors\n• Product development cycle times 40% longer than market leaders\n• Employee productivity metrics trending downward for 6 consecutive quarters\n\nThese gaps represent approximately $45M in annual value leakage that can be systematically captured through targeted interventions."
        }
      },
      {
        "id": "analysis",
        "type": "image",
        "title": "Diagnostic Analysis",
        "order": 3,
        "content": {
          "imageUrl": "/placeholder.svg?height=500&width=900",
          "caption": "Value bridge analysis: Current state to target performance"
        }
      },
      {
        "id": "framework",
        "type": "text",
        "title": "Transformation Framework",
        "order": 4,
        "content": {
          "text": "We recommend a phased transformation approach built on four interlocking workstreams:\n\nWorkstream 1: Process Excellence\nReengineer core operational processes to eliminate waste and reduce cycle times by 35%.\n\nWorkstream 2: Digital Enablement\nDeploy targeted automation and analytics capabilities to enhance decision-making velocity.\n\nWorkstream 3: Organization Design\nAlign structure, roles, and incentives to support new ways of working.\n\nWorkstream 4: Performance Management\nImplement rigorous tracking mechanisms to sustain improvements and drive continuous optimization."
        }
      },
      {
        "id": "impact",
        "type": "image",
        "title": "Projected Impact",
        "order": 5,
        "content": {
          "imageUrl": "/placeholder.svg?height=500&width=900",
          "caption": "Three-year value creation trajectory"
        }
      },
      {
        "id": "approach",
        "type": "text",
        "title": "Engagement Approach",
        "order": 6,
        "content": {
          "text": "Phase 1: Deep Dive (Weeks 1-4)\nComprehensive diagnostic across all value drivers with executive interviews and data analysis.\n\nPhase 2: Solution Design (Weeks 5-10)\nDevelop detailed implementation blueprints with pilot testing and refinement.\n\nPhase 3: Implementation (Weeks 11-26)\nExecute transformation with dedicated team, weekly steercos, and real-time performance tracking.\n\nPhase 4: Sustainability (Weeks 27-32)\nEmbed capabilities and transition to internal ownership with ongoing advisory support."
        }
      },
      {
        "id": "team",
        "type": "text",
        "title": "Proposed Team",
        "order": 7,
        "content": {
          "text": "We will deploy a senior team with deep operational transformation experience:\n\n• 1 Engagement Partner (20+ years experience)\n• 2 Project Leaders (12+ years each)\n• 4 Senior Consultants (specialized by workstream)\n• 2 Implementation Specialists\n• Analytics & Research Support\n\nTotal team investment: 12,000+ hours over 32 weeks"
        }
      },
      {
        "id": "fees",
        "type": "pricing",
        "title": "Fee Structure",
        "order": 8,
        "content": {
          "packages": [
            {"name": "Diagnostic", "price": "$350,000", "description": "4-week comprehensive assessment", "features": ["Executive interviews", "Process mapping", "Benchmarking analysis", "Opportunity sizing", "Roadmap development"]},
            {"name": "Full Transformation", "price": "$2,400,000", "description": "32-week end-to-end engagement", "features": ["All diagnostic deliverables", "Solution design", "Implementation leadership", "Change management", "Capability building"]},
            {"name": "Performance Guarantee", "price": "$2,800,000", "description": "Outcomes-linked partnership", "features": ["Everything above", "20% fee at risk", "Performance milestones", "Value sharing above target", "Extended support"]}
          ]
        }
      }
    ],
    "settings": {
      "fontFamily": "Inter",
      "primaryColor": "#0f172a",
      "accentColor": "#0ea5e9",
      "headerStyle": "executive"
    }
  }',
  true,
  true,
  623,
  4.8,
  NOW(),
  NOW()
);

-- Template 5: Series A Fundraising Pitch (fundraising category)
INSERT INTO templates (
  id, name, description, category, thumbnail_url, content, is_public, is_premium, usage_count, rating, created_at, updated_at
) VALUES (
  'a5000000-0000-0000-0000-000000000005',
  'Series A Fundraising Pitch',
  'Investor-ready pitch deck template optimized for Series A fundraising. Includes traction metrics, market sizing, competitive moats, and financial projections.',
  'fundraising',
  '/placeholder.svg?height=400&width=600',
  '{
    "sections": [
      {
        "id": "cover",
        "type": "hero",
        "title": "[Company Name]",
        "order": 1,
        "content": {
          "subtitle": "Series A Investment Opportunity",
          "tagline": "Revolutionizing [Industry] Through [Innovation]",
          "raise": "Raising $15M",
          "heroImage": "/placeholder.svg?height=600&width=1200"
        }
      },
      {
        "id": "problem",
        "type": "text",
        "title": "The Problem",
        "order": 2,
        "content": {
          "text": "A $50B industry is broken.\n\nToday''s solutions are:\n• Slow — Average resolution time: 14 days\n• Expensive — Enterprises spend $2M+ annually\n• Fragmented — 7+ tools required for basic workflows\n• Frustrating — NPS scores averaging -12\n\n73% of enterprises cite this as a top-3 operational pain point, yet no dominant solution exists."
        }
      },
      {
        "id": "solution",
        "type": "image",
        "title": "Our Solution",
        "order": 3,
        "content": {
          "imageUrl": "/placeholder.svg?height=500&width=900",
          "caption": "One platform. Infinite possibilities."
        }
      },
      {
        "id": "traction",
        "type": "text",
        "title": "Traction",
        "order": 4,
        "content": {
          "text": "We''ve achieved product-market fit with exceptional metrics:\n\n$4.2M ARR\n Growing 25% month-over-month\n\n156 Enterprise Customers\nIncluding 12 Fortune 500 companies\n\n94% Net Revenue Retention\nWith 140% gross retention in enterprise segment\n\n-$18 CAC Payback\nAchieving payback in under 6 months\n\n72 NPS Score\nTop decile for B2B SaaS"
        }
      },
      {
        "id": "market",
        "type": "image",
        "title": "Market Opportunity",
        "order": 5,
        "content": {
          "imageUrl": "/placeholder.svg?height=500&width=900",
          "caption": "$50B TAM with clear path to $5B serviceable market"
        }
      },
      {
        "id": "business-model",
        "type": "text",
        "title": "Business Model",
        "order": 6,
        "content": {
          "text": "Land & Expand SaaS Model\n\nLand: Self-serve product with $299/mo starting point\nExpand: Usage-based pricing scales with customer success\nEnterprise: Custom contracts averaging $180K ACV\n\nUnit Economics:\n• Gross Margin: 82%\n• LTV:CAC Ratio: 5.2x\n• Magic Number: 1.4\n• Rule of 40: 67"
        }
      },
      {
        "id": "competition",
        "type": "image",
        "title": "Competitive Landscape",
        "order": 7,
        "content": {
          "imageUrl": "/placeholder.svg?height=500&width=900",
          "caption": "We occupy a unique position in the market"
        }
      },
      {
        "id": "team",
        "type": "text",
        "title": "World-Class Team",
        "order": 8,
        "content": {
          "text": "Built by operators who''ve done this before:\n\nCEO — Former VP Product at [Unicorn]. Stanford CS.\n\nCTO — Ex-Principal Engineer at [FAANG]. MIT PhD.\n\nCRO — Built $0-$100M ARR at [Public SaaS]. Wharton MBA.\n\nVP Eng — Founded and sold [Acquired Startup]. 50+ engineers managed.\n\nAdvisors include founders/executives from Stripe, Datadog, and Snowflake."
        }
      },
      {
        "id": "financials",
        "type": "image",
        "title": "Financial Projections",
        "order": 9,
        "content": {
          "imageUrl": "/placeholder.svg?height=500&width=900",
          "caption": "Path to $100M ARR by 2028"
        }
      },
      {
        "id": "ask",
        "type": "pricing",
        "title": "The Ask",
        "order": 10,
        "content": {
          "packages": [
            {"name": "Series A", "price": "$15M", "description": "24-month runway to Series B", "features": ["Scale GTM team (10→40)", "Expand product platform", "International expansion", "Enterprise features", "Target: $25M ARR"]}
          ]
        }
      },
      {
        "id": "close",
        "type": "text",
        "title": "Why Now",
        "order": 11,
        "content": {
          "text": "Three converging forces create a once-in-a-decade opportunity:\n\n1. Market Timing — Regulatory changes forcing enterprise adoption\n2. Technology Shift — AI capabilities now enable our core innovation\n3. Team Readiness — We''ve assembled the team to win this market\n\nWe''re building a generational company. Join us."
        }
      }
    ],
    "settings": {
      "fontFamily": "Inter",
      "primaryColor": "#059669",
      "accentColor": "#8b5cf6",
      "headerStyle": "startup"
    }
  }',
  true,
  true,
  1567,
  5.0,
  NOW(),
  NOW()
);
