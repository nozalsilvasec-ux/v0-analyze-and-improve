-- Seed 5 Premium Templates with rich professional content
-- These templates showcase high-quality, polished designs

-- Template 1: Executive Business Strategy Proposal
INSERT INTO templates (
  id, user_id, name, description, category, thumbnail_url, 
  content, is_public, is_premium, usage_count, rating, created_at, updated_at
) VALUES (
  'a1000000-0000-0000-0000-000000000001',
  NULL,
  'Executive Business Strategy',
  'A comprehensive C-suite level proposal template for strategic partnerships and enterprise deals. Features executive summary, market analysis, and ROI projections.',
  'Sales',
  '/placeholder.svg?height=400&width=600',
  '{
    "sections": [
      {
        "id": "exec-1",
        "type": "hero",
        "title": "Strategic Partnership Proposal",
        "order": 1,
        "content": {
          "subtitle": "Transforming Vision into Measurable Business Outcomes",
          "date": "January 2026",
          "image": "/placeholder.svg?height=300&width=500"
        }
      },
      {
        "id": "exec-2",
        "type": "text",
        "title": "Executive Summary",
        "order": 2,
        "content": {
          "text": "This proposal outlines a strategic partnership designed to accelerate your digital transformation initiatives while delivering measurable ROI within the first fiscal quarter. Our approach combines proven methodologies with innovative technologies to address your core business challenges.\n\nKey outcomes include a projected 40% increase in operational efficiency, $2.5M in cost savings over 24 months, and enhanced competitive positioning in your target markets."
        }
      },
      {
        "id": "exec-3",
        "type": "image",
        "title": "Market Opportunity",
        "order": 3,
        "content": {
          "url": "/placeholder.svg?height=400&width=700",
          "caption": "Market Growth Trajectory and Opportunity Analysis"
        }
      },
      {
        "id": "exec-4",
        "type": "text",
        "title": "Strategic Approach",
        "order": 4,
        "content": {
          "text": "Our three-phase implementation strategy ensures minimal disruption while maximizing value delivery:\n\nPhase 1: Discovery & Assessment (Weeks 1-4)\nPhase 2: Solution Design & Pilot (Weeks 5-12)\nPhase 3: Full Deployment & Optimization (Weeks 13-20)"
        }
      },
      {
        "id": "exec-5",
        "type": "pricing",
        "title": "Investment Overview",
        "order": 5,
        "content": {
          "tiers": [
            {"name": "Foundation", "price": "$150,000", "features": ["Core Implementation", "12-Month Support", "Quarterly Reviews"]},
            {"name": "Professional", "price": "$275,000", "features": ["Full Platform Access", "24/7 Support", "Monthly Strategy Sessions", "Custom Integrations"]},
            {"name": "Enterprise", "price": "$450,000", "features": ["Unlimited Users", "Dedicated Success Manager", "Weekly Executive Briefings", "Priority Development"]}
          ]
        }
      }
    ],
    "settings": {
      "fontFamily": "Inter",
      "primaryColor": "#1e3a5f",
      "layout": "modern"
    }
  }',
  true, true, 1250, 4.9,
  NOW(), NOW()
);

-- Template 2: SaaS Product Launch Blueprint
INSERT INTO templates (
  id, user_id, name, description, category, thumbnail_url,
  content, is_public, is_premium, usage_count, rating, created_at, updated_at
) VALUES (
  'a2000000-0000-0000-0000-000000000002',
  NULL,
  'SaaS Product Launch Blueprint',
  'Perfect for software companies launching new products or features. Includes competitive analysis, feature showcase, and implementation timeline.',
  'Marketing',
  '/placeholder.svg?height=400&width=600',
  '{
    "sections": [
      {
        "id": "saas-1",
        "type": "hero",
        "title": "Product Launch Proposal",
        "order": 1,
        "content": {
          "subtitle": "Next-Generation SaaS Solution for Modern Enterprises",
          "date": "Q1 2026 Launch",
          "image": "/placeholder.svg?height=300&width=500"
        }
      },
      {
        "id": "saas-2",
        "type": "text",
        "title": "The Challenge",
        "order": 2,
        "content": {
          "text": "Today''s enterprises face unprecedented challenges in managing distributed workflows, maintaining data security, and scaling operations efficiently. Legacy systems create bottlenecks that cost organizations an average of $4.2M annually in lost productivity.\n\nOur solution addresses these pain points with a unified platform that reduces complexity while enhancing capabilities."
        }
      },
      {
        "id": "saas-3",
        "type": "image",
        "title": "Platform Overview",
        "order": 3,
        "content": {
          "url": "/placeholder.svg?height=400&width=700",
          "caption": "Unified Platform Architecture"
        }
      },
      {
        "id": "saas-4",
        "type": "text",
        "title": "Key Features",
        "order": 4,
        "content": {
          "text": "• AI-Powered Automation: Reduce manual tasks by 70% with intelligent workflow automation\n• Real-Time Analytics: Make data-driven decisions with live dashboards and predictive insights\n• Enterprise Security: SOC 2 Type II certified with end-to-end encryption\n• Seamless Integration: Connect with 200+ enterprise applications out of the box\n• Scalable Infrastructure: Handle 10x growth without performance degradation"
        }
      },
      {
        "id": "saas-5",
        "type": "image",
        "title": "Implementation Roadmap",
        "order": 5,
        "content": {
          "url": "/placeholder.svg?height=300&width=600",
          "caption": "12-Week Implementation Timeline"
        }
      },
      {
        "id": "saas-6",
        "type": "pricing",
        "title": "Subscription Plans",
        "order": 6,
        "content": {
          "tiers": [
            {"name": "Starter", "price": "$499/mo", "features": ["Up to 25 Users", "Core Features", "Email Support", "5GB Storage"]},
            {"name": "Growth", "price": "$1,299/mo", "features": ["Up to 100 Users", "Advanced Analytics", "Priority Support", "50GB Storage", "API Access"]},
            {"name": "Scale", "price": "$3,499/mo", "features": ["Unlimited Users", "Custom Features", "Dedicated Support", "Unlimited Storage", "SLA Guarantee"]}
          ]
        }
      }
    ],
    "settings": {
      "fontFamily": "Inter",
      "primaryColor": "#7c3aed",
      "layout": "modern"
    }
  }',
  true, true, 890, 4.8,
  NOW(), NOW()
);

-- Template 3: Creative Agency Pitch Deck
INSERT INTO templates (
  id, user_id, name, description, category, thumbnail_url,
  content, is_public, is_premium, usage_count, rating, created_at, updated_at
) VALUES (
  'a3000000-0000-0000-0000-000000000003',
  NULL,
  'Creative Agency Pitch Deck',
  'Stunning visual template for creative agencies, design studios, and marketing firms. Showcases portfolio work and creative capabilities.',
  'Design',
  '/placeholder.svg?height=400&width=600',
  '{
    "sections": [
      {
        "id": "creative-1",
        "type": "hero",
        "title": "Creative Partnership Proposal",
        "order": 1,
        "content": {
          "subtitle": "Where Strategy Meets Stunning Design",
          "date": "2026",
          "image": "/placeholder.svg?height=300&width=500"
        }
      },
      {
        "id": "creative-2",
        "type": "text",
        "title": "Our Philosophy",
        "order": 2,
        "content": {
          "text": "We believe great design is not just about aesthetics—it''s about solving problems, telling stories, and creating meaningful connections between brands and their audiences.\n\nFor over a decade, we''ve partnered with Fortune 500 companies and ambitious startups alike, delivering creative solutions that drive measurable business results."
        }
      },
      {
        "id": "creative-3",
        "type": "image",
        "title": "Selected Work",
        "order": 3,
        "content": {
          "url": "/placeholder.svg?height=400&width=700",
          "caption": "Award-Winning Campaigns & Brand Transformations"
        }
      },
      {
        "id": "creative-4",
        "type": "text",
        "title": "Our Services",
        "order": 4,
        "content": {
          "text": "Brand Strategy & Identity\nCreate distinctive brand experiences that resonate with your target audience and stand out in crowded markets.\n\nDigital Experience Design\nCraft intuitive, engaging digital products that users love and that drive conversion.\n\nContent & Campaign Creation\nDevelop compelling narratives and visual content that captures attention and inspires action.\n\nMotion & Interactive Media\nBring brands to life with dynamic animations, video content, and interactive experiences."
        }
      },
      {
        "id": "creative-5",
        "type": "image",
        "title": "The Creative Process",
        "order": 5,
        "content": {
          "url": "/placeholder.svg?height=300&width=600",
          "caption": "Our Proven 4-Phase Creative Process"
        }
      },
      {
        "id": "creative-6",
        "type": "pricing",
        "title": "Engagement Options",
        "order": 6,
        "content": {
          "tiers": [
            {"name": "Project", "price": "From $25K", "features": ["Single Campaign", "2-Month Timeline", "3 Revision Rounds", "Final Asset Delivery"]},
            {"name": "Retainer", "price": "$15K/mo", "features": ["Ongoing Support", "Priority Scheduling", "Unlimited Revisions", "Dedicated Team"]},
            {"name": "Partnership", "price": "Custom", "features": ["Full Agency Access", "Strategic Planning", "Embedded Team Option", "Revenue Share Models"]}
          ]
        }
      }
    ],
    "settings": {
      "fontFamily": "Inter",
      "primaryColor": "#ec4899",
      "layout": "modern"
    }
  }',
  true, true, 720, 4.9,
  NOW(), NOW()
);

-- Template 4: Management Consulting Framework
INSERT INTO templates (
  id, user_id, name, description, category, thumbnail_url,
  content, is_public, is_premium, usage_count, rating, created_at, updated_at
) VALUES (
  'a4000000-0000-0000-0000-000000000004',
  NULL,
  'Management Consulting Framework',
  'Professional consulting proposal template with structured frameworks, diagnostic insights, and transformation roadmaps for enterprise clients.',
  'Consulting',
  '/placeholder.svg?height=400&width=600',
  '{
    "sections": [
      {
        "id": "consult-1",
        "type": "hero",
        "title": "Transformation Advisory Proposal",
        "order": 1,
        "content": {
          "subtitle": "Driving Sustainable Performance Improvement",
          "date": "Engagement Proposal 2026",
          "image": "/placeholder.svg?height=300&width=500"
        }
      },
      {
        "id": "consult-2",
        "type": "text",
        "title": "Situation Assessment",
        "order": 2,
        "content": {
          "text": "Based on our preliminary diagnostic, your organization faces three interconnected challenges:\n\n1. Operational Complexity: Fragmented processes across 12 business units creating inefficiencies estimated at $8.5M annually\n\n2. Digital Readiness Gap: Legacy systems limiting agility and customer responsiveness\n\n3. Talent & Culture: Need for capability building to support transformation agenda"
        }
      },
      {
        "id": "consult-3",
        "type": "image",
        "title": "Diagnostic Findings",
        "order": 3,
        "content": {
          "url": "/placeholder.svg?height=400&width=700",
          "caption": "Current State Assessment Matrix"
        }
      },
      {
        "id": "consult-4",
        "type": "text",
        "title": "Recommended Approach",
        "order": 4,
        "content": {
          "text": "We propose a 16-week engagement structured in three workstreams:\n\nWorkstream A: Process Excellence\nRedesign core processes using lean methodologies to eliminate waste and improve cycle times by 35%.\n\nWorkstream B: Digital Enablement\nImplement integrated technology solutions to automate workflows and enhance data visibility.\n\nWorkstream C: Change Management\nBuild organizational capabilities and drive adoption through structured change management."
        }
      },
      {
        "id": "consult-5",
        "type": "image",
        "title": "Value Creation Roadmap",
        "order": 5,
        "content": {
          "url": "/placeholder.svg?height=300&width=600",
          "caption": "Phased Implementation with Quick Wins"
        }
      },
      {
        "id": "consult-6",
        "type": "pricing",
        "title": "Investment & Returns",
        "order": 6,
        "content": {
          "tiers": [
            {"name": "Diagnostic", "price": "$85,000", "features": ["4-Week Assessment", "Executive Interviews", "Data Analysis", "Recommendations Report"]},
            {"name": "Implementation", "price": "$425,000", "features": ["16-Week Program", "Dedicated Team", "Weekly Steering", "Capability Transfer"]},
            {"name": "Transformation", "price": "$750,000", "features": ["Full Scope Delivery", "Executive Coaching", "Performance Guarantee", "24-Month Support"]}
          ]
        }
      }
    ],
    "settings": {
      "fontFamily": "Inter",
      "primaryColor": "#0f766e",
      "layout": "modern"
    }
  }',
  true, true, 560, 4.7,
  NOW(), NOW()
);

-- Template 5: Series A Fundraising Pitch
INSERT INTO templates (
  id, user_id, name, description, category, thumbnail_url,
  content, is_public, is_premium, usage_count, rating, created_at, updated_at
) VALUES (
  'a5000000-0000-0000-0000-000000000005',
  NULL,
  'Series A Fundraising Pitch',
  'Investor-ready pitch deck template designed for startups seeking Series A funding. Includes traction metrics, market sizing, and financial projections.',
  'Fundraising',
  '/placeholder.svg?height=400&width=600',
  '{
    "sections": [
      {
        "id": "fund-1",
        "type": "hero",
        "title": "Series A Investment Opportunity",
        "order": 1,
        "content": {
          "subtitle": "Revolutionizing [Industry] with AI-Powered Solutions",
          "date": "Confidential - January 2026",
          "image": "/placeholder.svg?height=300&width=500"
        }
      },
      {
        "id": "fund-2",
        "type": "text",
        "title": "The Opportunity",
        "order": 2,
        "content": {
          "text": "We''re addressing a $47B market that''s growing at 23% CAGR. Current solutions are fragmented, expensive, and fail to meet the evolving needs of modern enterprises.\n\nOur platform has achieved remarkable traction:\n• 340% YoY revenue growth\n• 127 enterprise customers\n• 94% gross retention rate\n• $4.2M ARR (as of Q4 2025)"
        }
      },
      {
        "id": "fund-3",
        "type": "image",
        "title": "Traction & Growth",
        "order": 3,
        "content": {
          "url": "/placeholder.svg?height=400&width=700",
          "caption": "Revenue Growth and Key Performance Metrics"
        }
      },
      {
        "id": "fund-4",
        "type": "text",
        "title": "Competitive Advantage",
        "order": 4,
        "content": {
          "text": "Three proprietary moats protect our market position:\n\n1. Technology: Patent-pending AI algorithms deliver 10x faster processing than competitors\n\n2. Data Network Effects: Each customer improves the platform for all users\n\n3. Enterprise Relationships: Deep integrations with Fortune 500 tech stacks create high switching costs\n\nOur NPS of 72 (vs. industry average of 31) reflects genuine product-market fit."
        }
      },
      {
        "id": "fund-5",
        "type": "image",
        "title": "Use of Funds",
        "order": 5,
        "content": {
          "url": "/placeholder.svg?height=300&width=600",
          "caption": "Capital Allocation Strategy"
        }
      },
      {
        "id": "fund-6",
        "type": "text",
        "title": "The Ask",
        "order": 6,
        "content": {
          "text": "We''re raising $18M Series A to:\n\n• Scale Go-to-Market: Expand sales team from 8 to 25, targeting $15M ARR by end of 2026\n\n• Accelerate Product: Launch 3 new product lines addressing adjacent market opportunities\n\n• International Expansion: Establish presence in UK and DACH regions\n\nTarget close: Q1 2026\nLead investor allocation: $10-12M\nCurrent investors participating: Seed investors committing pro-rata"
        }
      },
      {
        "id": "fund-7",
        "type": "pricing",
        "title": "Investment Terms",
        "order": 7,
        "content": {
          "tiers": [
            {"name": "Round Size", "price": "$18M", "features": ["Series A Preferred", "1x Participating Liquidation Pref", "Board Seat for Lead"]},
            {"name": "Pre-Money", "price": "$72M", "features": ["Based on 17x ARR Multiple", "Aligned with Comparable Transactions", "Path to $500M+ Valuation"]},
            {"name": "Milestones", "price": "18 Months", "features": ["$15M ARR Target", "150+ Enterprise Customers", "Series B Ready"]}
          ]
        }
      }
    ],
    "settings": {
      "fontFamily": "Inter",
      "primaryColor": "#2563eb",
      "layout": "modern"
    }
  }',
  true, true, 430, 4.8,
  NOW(), NOW()
);
