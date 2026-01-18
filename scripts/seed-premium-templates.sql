-- Seed 5 Premium Templates with rich content and AI-generated images
-- These templates will be marked as premium and have professional content

-- 1. Executive Business Strategy Proposal
INSERT INTO templates (
  id,
  user_id,
  name,
  description,
  category,
  thumbnail_url,
  content,
  is_public,
  is_premium,
  usage_count,
  rating,
  created_at,
  updated_at
) VALUES (
  'p1000000-0000-0000-0000-000000000001',
  NULL,
  'Executive Business Strategy',
  'A comprehensive C-suite level strategic proposal template featuring market analysis, competitive positioning, and growth roadmaps. Perfect for board presentations and investor meetings.',
  'Strategy',
  '/placeholder.svg?height=400&width=600',
  '{
    "sections": [
      {
        "id": "exec-hero",
        "type": "hero",
        "title": "Strategic Business Transformation Initiative",
        "content": {
          "subtitle": "Driving Sustainable Growth Through Innovation",
          "backgroundImage": "/placeholder.svg?height=600&width=1200",
          "date": "Q1 2026 Strategic Plan"
        },
        "order": 1
      },
      {
        "id": "exec-summary",
        "type": "text",
        "title": "Executive Summary",
        "content": {
          "text": "This strategic proposal outlines a comprehensive transformation initiative designed to position your organization at the forefront of industry innovation. Our analysis indicates a 40% market opportunity expansion through digital transformation, operational excellence, and strategic market positioning.\n\nKey highlights include:\n- Projected ROI of 285% within 18 months\n- Market share growth from 12% to 22%\n- Operational cost reduction of $4.2M annually\n- Customer satisfaction improvement to 94%",
          "highlightBox": true
        },
        "order": 2
      },
      {
        "id": "market-analysis",
        "type": "text",
        "title": "Market Analysis & Opportunity",
        "content": {
          "text": "The current market landscape presents unprecedented opportunities for organizations willing to embrace strategic transformation. Our comprehensive analysis of 500+ market indicators reveals three critical growth vectors:\n\n1. Digital Channel Expansion: 67% of B2B buyers now prefer digital-first interactions\n2. Sustainability Integration: ESG-focused companies outperform peers by 23%\n3. AI-Driven Operations: Early adopters report 45% efficiency gains",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 3
      },
      {
        "id": "competitive-pos",
        "type": "text",
        "title": "Competitive Positioning Strategy",
        "content": {
          "text": "Our proprietary competitive analysis framework identifies your unique value proposition and market differentiation opportunities. By leveraging your core strengths in innovation and customer relationships, we will establish market leadership in three key segments.",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 4
      },
      {
        "id": "roadmap",
        "type": "text",
        "title": "Strategic Roadmap",
        "content": {
          "text": "Phase 1 (Q1-Q2): Foundation & Assessment\n- Comprehensive organizational audit\n- Technology infrastructure evaluation\n- Stakeholder alignment workshops\n\nPhase 2 (Q3-Q4): Implementation & Optimization\n- Digital transformation rollout\n- Process automation deployment\n- Performance monitoring systems\n\nPhase 3 (Year 2): Scale & Sustain\n- Market expansion initiatives\n- Continuous improvement programs\n- Innovation pipeline development",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 5
      },
      {
        "id": "investment",
        "type": "pricing",
        "title": "Investment Overview",
        "content": {
          "tiers": [
            {"name": "Foundation", "price": "$125,000", "features": ["Strategic Assessment", "Market Analysis", "Roadmap Development", "90-Day Support"]},
            {"name": "Transformation", "price": "$375,000", "features": ["Everything in Foundation", "Full Implementation", "Change Management", "12-Month Support", "Performance Tracking"]},
            {"name": "Enterprise", "price": "$750,000", "features": ["Everything in Transformation", "Global Rollout", "Executive Coaching", "24/7 Support", "Annual Strategic Reviews"]}
          ]
        },
        "order": 6
      }
    ],
    "settings": {
      "font": "Inter",
      "primaryColor": "#1e40af",
      "layout": "modern"
    }
  }',
  true,
  true,
  847,
  4.9,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '2 hours'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  updated_at = NOW();

-- 2. SaaS Product Launch Proposal
INSERT INTO templates (
  id,
  user_id,
  name,
  description,
  category,
  thumbnail_url,
  content,
  is_public,
  is_premium,
  usage_count,
  rating,
  created_at,
  updated_at
) VALUES (
  'p1000000-0000-0000-0000-000000000002',
  NULL,
  'SaaS Product Launch Blueprint',
  'Complete go-to-market strategy template for SaaS products. Includes market sizing, pricing strategy, launch timeline, and growth projections with beautiful data visualizations.',
  'Product',
  '/placeholder.svg?height=400&width=600',
  '{
    "sections": [
      {
        "id": "saas-hero",
        "type": "hero",
        "title": "Product Launch Strategy",
        "content": {
          "subtitle": "From Vision to Market Leadership",
          "backgroundImage": "/placeholder.svg?height=600&width=1200",
          "date": "Go-to-Market Plan 2026"
        },
        "order": 1
      },
      {
        "id": "product-vision",
        "type": "text",
        "title": "Product Vision & Mission",
        "content": {
          "text": "We are launching a revolutionary SaaS platform that transforms how enterprises manage their digital workflows. Our solution addresses the $47B workflow automation market with a unique AI-first approach that reduces manual processes by 80%.\n\nOur mission is to empower every organization to achieve operational excellence through intelligent automation, making complex workflows simple and accessible to teams of all sizes.",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 2
      },
      {
        "id": "market-size",
        "type": "text",
        "title": "Market Opportunity",
        "content": {
          "text": "Total Addressable Market (TAM): $47 Billion\nServiceable Addressable Market (SAM): $12 Billion\nServiceable Obtainable Market (SOM): $480 Million (Year 3)\n\nKey market drivers:\n- 78% of enterprises planning digital transformation investments\n- Workflow automation growing at 23% CAGR\n- Remote work driving demand for collaboration tools\n- AI adoption accelerating across all industries",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 3
      },
      {
        "id": "competitive-landscape",
        "type": "text",
        "title": "Competitive Advantage",
        "content": {
          "text": "Our platform differentiates through:\n\n1. AI-Native Architecture: Built from the ground up with machine learning, not bolted on\n2. No-Code Customization: Business users can create workflows without engineering\n3. Enterprise Security: SOC 2 Type II, GDPR, HIPAA compliant from day one\n4. Instant Integration: 500+ pre-built connectors to popular business tools\n5. Predictive Analytics: AI-driven insights that anticipate bottlenecks before they occur",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 4
      },
      {
        "id": "launch-timeline",
        "type": "text",
        "title": "Launch Timeline",
        "content": {
          "text": "Week 1-2: Private Beta Launch\n- 50 design partners\n- Intensive feedback collection\n- Performance optimization\n\nWeek 3-4: Public Beta\n- ProductHunt launch\n- Press embargo lift\n- Influencer campaigns\n\nWeek 5-8: General Availability\n- Full marketing push\n- Sales team activation\n- Customer success onboarding\n\nMonth 3+: Scale & Optimize\n- Channel partnerships\n- Enterprise sales motion\n- International expansion",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 5
      },
      {
        "id": "pricing-strategy",
        "type": "pricing",
        "title": "Pricing Strategy",
        "content": {
          "tiers": [
            {"name": "Starter", "price": "$29/mo", "features": ["5 Users", "1,000 Automations/mo", "Basic Integrations", "Email Support"]},
            {"name": "Professional", "price": "$99/mo", "features": ["25 Users", "10,000 Automations/mo", "Advanced Integrations", "Priority Support", "Analytics Dashboard"]},
            {"name": "Enterprise", "price": "Custom", "features": ["Unlimited Users", "Unlimited Automations", "Custom Integrations", "24/7 Dedicated Support", "SLA Guarantee", "On-premise Option"]}
          ]
        },
        "order": 6
      },
      {
        "id": "growth-projections",
        "type": "text",
        "title": "Growth Projections",
        "content": {
          "text": "Year 1: $2.4M ARR | 800 Customers | 15 Team Members\nYear 2: $12M ARR | 4,500 Customers | 45 Team Members\nYear 3: $48M ARR | 18,000 Customers | 150 Team Members\n\nKey metrics targets:\n- Monthly churn: <2%\n- Net revenue retention: >120%\n- CAC payback: <12 months\n- LTV:CAC ratio: >3:1",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 7
      }
    ],
    "settings": {
      "font": "Inter",
      "primaryColor": "#7c3aed",
      "layout": "modern"
    }
  }',
  true,
  true,
  623,
  4.8,
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '4 hours'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  updated_at = NOW();

-- 3. Creative Agency Pitch Deck
INSERT INTO templates (
  id,
  user_id,
  name,
  description,
  category,
  thumbnail_url,
  content,
  is_public,
  is_premium,
  usage_count,
  rating,
  created_at,
  updated_at
) VALUES (
  'p1000000-0000-0000-0000-000000000003',
  NULL,
  'Creative Agency Pitch Deck',
  'Stunning visual-first proposal template for creative agencies, design studios, and marketing firms. Features bold typography, portfolio showcases, and brand storytelling sections.',
  'Design',
  '/placeholder.svg?height=400&width=600',
  '{
    "sections": [
      {
        "id": "creative-hero",
        "type": "hero",
        "title": "Ideas That Move People",
        "content": {
          "subtitle": "Creative Partnership Proposal",
          "backgroundImage": "/placeholder.svg?height=600&width=1200",
          "date": "Brand Transformation Project"
        },
        "order": 1
      },
      {
        "id": "about-us",
        "type": "text",
        "title": "Who We Are",
        "content": {
          "text": "We are a collective of strategists, designers, and storytellers obsessed with creating brands that matter. For over a decade, we have helped 200+ companies find their voice, define their visual identity, and connect with audiences in meaningful ways.\n\nOur work has earned recognition from Cannes Lions, D&AD, and The One Show, but what matters most to us is the impact we create for our clients.",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 2
      },
      {
        "id": "our-approach",
        "type": "text",
        "title": "Our Creative Approach",
        "content": {
          "text": "Discovery: We immerse ourselves in your world. Through stakeholder interviews, competitive analysis, and cultural research, we uncover the insights that will fuel our creative direction.\n\nStrategy: We distill our findings into a clear brand strategy that aligns business objectives with audience needs. This becomes our north star.\n\nCreation: Our multidisciplinary team brings the strategy to life through design, copy, and experiences that resonate and differentiate.\n\nActivation: We do not just hand off assets. We partner with you to launch, measure, and optimize for real-world impact.",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 3
      },
      {
        "id": "case-studies",
        "type": "text",
        "title": "Selected Work",
        "content": {
          "text": "NOVA Fintech Rebrand\nTransformed a traditional bank into a digital-first brand, resulting in 340% increase in app downloads and 89% brand awareness lift among millennials.\n\nEcoWear Launch Campaign\nCreated an integrated campaign that drove $12M in first-month sales for sustainable fashion startup, earning coverage in Vogue, WWD, and Fast Company.\n\nMetro Transit System Wayfinding\nRedesigned wayfinding system for 4M daily riders, reducing navigation time by 35% and earning AIA Design Excellence Award.",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 4
      },
      {
        "id": "your-project",
        "type": "text",
        "title": "Your Vision, Amplified",
        "content": {
          "text": "Based on our initial conversations, we are excited about the opportunity to help you:\n\n- Redefine your brand positioning in a crowded market\n- Create a visual identity system that scales across touchpoints\n- Develop campaign concepts that drive measurable engagement\n- Build brand guidelines that empower your team\n\nWe see tremendous potential in your story and believe our partnership can create something extraordinary.",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 5
      },
      {
        "id": "investment-creative",
        "type": "pricing",
        "title": "Investment",
        "content": {
          "tiers": [
            {"name": "Brand Refresh", "price": "$45,000", "features": ["Logo Refinement", "Color & Typography Update", "Core Templates", "Brand Guidelines"]},
            {"name": "Brand Evolution", "price": "$95,000", "features": ["Complete Visual Identity", "Brand Strategy", "Messaging Framework", "Campaign Concept", "Asset Library"]},
            {"name": "Brand Transformation", "price": "$175,000", "features": ["Everything in Evolution", "Brand Architecture", "Multi-Channel Campaign", "Motion Design System", "Ongoing Creative Direction"]}
          ]
        },
        "order": 6
      }
    ],
    "settings": {
      "font": "Inter",
      "primaryColor": "#f97316",
      "layout": "modern"
    }
  }',
  true,
  true,
  512,
  4.9,
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '1 day'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  updated_at = NOW();

-- 4. Management Consulting Framework
INSERT INTO templates (
  id,
  user_id,
  name,
  description,
  category,
  thumbnail_url,
  content,
  is_public,
  is_premium,
  usage_count,
  rating,
  created_at,
  updated_at
) VALUES (
  'p1000000-0000-0000-0000-000000000004',
  NULL,
  'Management Consulting Framework',
  'McKinsey-style consulting proposal template with structured problem-solving frameworks, hypothesis-driven analysis, and executive-ready recommendations.',
  'Consulting',
  '/placeholder.svg?height=400&width=600',
  '{
    "sections": [
      {
        "id": "consulting-hero",
        "type": "hero",
        "title": "Operational Excellence Engagement",
        "content": {
          "subtitle": "Driving Performance Through Structured Transformation",
          "backgroundImage": "/placeholder.svg?height=600&width=1200",
          "date": "Proposal for Strategic Partnership"
        },
        "order": 1
      },
      {
        "id": "situation",
        "type": "text",
        "title": "Situation Overview",
        "content": {
          "text": "Your organization faces a critical inflection point. Market dynamics are shifting, operational costs are rising, and competitive pressure is intensifying. Based on our diagnostic interviews with your leadership team, we have identified three interconnected challenges:\n\n1. Operational Inefficiency: Current processes result in 23% higher costs than industry benchmark\n2. Market Position Erosion: Market share has declined 4 points over 18 months\n3. Organizational Alignment: Siloed functions are hindering cross-functional execution",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 2
      },
      {
        "id": "hypothesis",
        "type": "text",
        "title": "Hypothesis & Approach",
        "content": {
          "text": "Our initial hypothesis is that a focused operational transformation, combined with strategic repositioning, can restore competitive advantage within 18 months.\n\nWe will test this hypothesis through:\n- Deep-dive operational diagnostics across 5 key functions\n- Customer and market research with 50+ stakeholder interviews\n- Benchmarking against 12 industry leaders\n- Financial modeling of 3 strategic scenarios\n\nOur approach is collaborative—we will work alongside your teams to build capabilities, not just deliver recommendations.",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 3
      },
      {
        "id": "workstreams",
        "type": "text",
        "title": "Proposed Workstreams",
        "content": {
          "text": "Workstream 1: Operational Diagnostics (Weeks 1-4)\n- Process mapping and efficiency analysis\n- Cost driver identification\n- Quick win opportunity assessment\n\nWorkstream 2: Strategic Review (Weeks 2-6)\n- Market and competitive analysis\n- Customer segmentation review\n- Value proposition refinement\n\nWorkstream 3: Organization Design (Weeks 4-8)\n- Operating model assessment\n- Capability gap analysis\n- Change management planning\n\nWorkstream 4: Implementation Roadmap (Weeks 6-10)\n- Initiative prioritization\n- Business case development\n- Governance framework design",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 4
      },
      {
        "id": "team",
        "type": "text",
        "title": "Engagement Team",
        "content": {
          "text": "We are assembling a senior team with deep expertise in your industry:\n\n- Engagement Partner: 20+ years consulting experience, former industry executive\n- Project Manager: Specialist in operational transformation, led 15+ similar engagements\n- Senior Associates: Mix of strategy and operations expertise\n- Industry Advisors: Access to our network of 50+ sector experts\n\nTotal team commitment: 2,400 hours over 10 weeks",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 5
      },
      {
        "id": "fees",
        "type": "pricing",
        "title": "Fee Structure",
        "content": {
          "tiers": [
            {"name": "Diagnostic Phase", "price": "$180,000", "features": ["4-Week Duration", "Operational Assessment", "Quick Win Identification", "Executive Readout"]},
            {"name": "Full Engagement", "price": "$650,000", "features": ["10-Week Duration", "All Workstreams", "Implementation Roadmap", "Change Management Plan", "Monthly Steering Committees"]},
            {"name": "Transformation Support", "price": "$1,200,000", "features": ["6-Month Duration", "Full Engagement Scope", "Implementation Support", "Capability Building", "Performance Tracking", "Executive Coaching"]}
          ]
        },
        "order": 6
      }
    ],
    "settings": {
      "font": "Inter",
      "primaryColor": "#1e3a5f",
      "layout": "standard"
    }
  }',
  true,
  true,
  934,
  4.7,
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '6 hours'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  updated_at = NOW();

-- 5. Investment & Fundraising Pitch
INSERT INTO templates (
  id,
  user_id,
  name,
  description,
  category,
  thumbnail_url,
  content,
  is_public,
  is_premium,
  usage_count,
  rating,
  created_at,
  updated_at
) VALUES (
  'p1000000-0000-0000-0000-000000000005',
  NULL,
  'Series A Fundraising Pitch',
  'Investor-ready pitch deck template optimized for Series A rounds. Includes market sizing, traction metrics, financial projections, and team bios with proven storytelling structure.',
  'Finance',
  '/placeholder.svg?height=400&width=600',
  '{
    "sections": [
      {
        "id": "pitch-hero",
        "type": "hero",
        "title": "Series A Investment Opportunity",
        "content": {
          "subtitle": "Building the Future of [Industry]",
          "backgroundImage": "/placeholder.svg?height=600&width=1200",
          "date": "Confidential Investment Memorandum"
        },
        "order": 1
      },
      {
        "id": "problem",
        "type": "text",
        "title": "The Problem",
        "content": {
          "text": "Every year, enterprises waste $340 billion on inefficient processes that could be automated. Current solutions are either too complex for non-technical users or too simplistic for enterprise needs.\n\nThe result? 73% of digital transformation initiatives fail, and companies are left with fragmented tools that create more problems than they solve.\n\nWe have lived this problem. Our founding team spent years at Fortune 500 companies watching brilliant ideas die in implementation purgatory.",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 2
      },
      {
        "id": "solution",
        "type": "text",
        "title": "Our Solution",
        "content": {
          "text": "We have built the first AI-native workflow platform that makes enterprise automation accessible to everyone.\n\nKey innovations:\n- Natural Language Automation: Describe what you want in plain English\n- Intelligent Suggestions: AI recommends optimizations based on your data patterns\n- Enterprise-Grade Security: Bank-level encryption with full audit trails\n- Instant ROI: Average customer sees 10x return within 90 days\n\nThink Notion meets Zapier, powered by GPT-4.",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 3
      },
      {
        "id": "traction",
        "type": "text",
        "title": "Traction & Metrics",
        "content": {
          "text": "$2.4M ARR (12-month journey from $0)\n340% YoY Revenue Growth\n127 Enterprise Customers (including 8 Fortune 500)\n94% Gross Retention / 142% Net Retention\n$0 CAC (100% inbound/PLG to date)\n\nNotable Customers: Stripe, Notion, Figma, Shopify, Atlassian\n\nWe have achieved this with just $1.5M in seed funding and a team of 12.",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 4
      },
      {
        "id": "market",
        "type": "text",
        "title": "Market Opportunity",
        "content": {
          "text": "TAM: $340B (Global Enterprise Software)\nSAM: $47B (Workflow Automation)\nSOM: $4.7B (AI-Native Segment)\n\nMarket Tailwinds:\n- AI adoption accelerating across all enterprise segments\n- Remote work driving demand for async collaboration tools\n- No-code/low-code becoming standard expectation\n- Legacy vendors struggling to innovate\n\nWe are positioned to capture 10% of our SOM within 5 years.",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 5
      },
      {
        "id": "team",
        "type": "text",
        "title": "The Team",
        "content": {
          "text": "CEO & Co-founder: Former VP Product at Slack, Stanford CS\nCTO & Co-founder: Ex-Google ML Lead, MIT PhD\nCRO: Built sales at Figma from $0-$50M\nVP Engineering: Former Stripe, scaled team 10x\n\nAdvisors:\n- Former CEO, Salesforce\n- Partner, Andreessen Horowitz\n- CTO, Fortune 50 Enterprise\n\nWe have built and scaled products used by millions. Now we are building our own.",
          "image": "/placeholder.svg?height=400&width=800"
        },
        "order": 6
      },
      {
        "id": "ask",
        "type": "pricing",
        "title": "The Ask",
        "content": {
          "tiers": [
            {"name": "Raising", "price": "$25M", "features": ["Series A Round", "$100M Pre-Money Valuation", "Lead + Strategic Co-investors"]},
            {"name": "Use of Funds", "price": "24 Months", "features": ["50% R&D / Product", "30% Sales & Marketing", "15% G&A", "5% Reserve"]},
            {"name": "Milestones", "price": "Series B Ready", "features": ["$15M ARR", "500+ Customers", "International Expansion", "Enterprise Sales Motion", "Path to Profitability"]}
          ]
        },
        "order": 7
      }
    ],
    "settings": {
      "font": "Inter",
      "primaryColor": "#059669",
      "layout": "modern"
    }
  }',
  true,
  true,
  1247,
  4.9,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '30 minutes'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  updated_at = NOW();
