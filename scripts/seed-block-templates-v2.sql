-- Seed Block Templates and Stock Images
-- Version 2: Fixed to include name column for stock_images

-- Clear existing data to avoid duplicates
DELETE FROM block_templates WHERE id IN (
  'b1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000002',
  'b1000000-0000-0000-0000-000000000003',
  'b1000000-0000-0000-0000-000000000004',
  'b1000000-0000-0000-0000-000000000005',
  'b1000000-0000-0000-0000-000000000006',
  'b1000000-0000-0000-0000-000000000007',
  'b1000000-0000-0000-0000-000000000008',
  'b1000000-0000-0000-0000-000000000009',
  'b1000000-0000-0000-0000-000000000010',
  'b1000000-0000-0000-0000-000000000011',
  'b1000000-0000-0000-0000-000000000012',
  'b1000000-0000-0000-0000-000000000013',
  'b1000000-0000-0000-0000-000000000014',
  'b1000000-0000-0000-0000-000000000015',
  'b1000000-0000-0000-0000-000000000016',
  'b1000000-0000-0000-0000-000000000017',
  'b1000000-0000-0000-0000-000000000018',
  'b1000000-0000-0000-0000-000000000019',
  'b1000000-0000-0000-0000-000000000020',
  'b1000000-0000-0000-0000-000000000021',
  'b1000000-0000-0000-0000-000000000022',
  'b1000000-0000-0000-0000-000000000023',
  'b1000000-0000-0000-0000-000000000024'
);

-- =============================================
-- BLOCK TEMPLATES
-- =============================================

-- HEADER BLOCKS
INSERT INTO block_templates (id, name, description, category, preview_url, content, is_premium) VALUES
('b1000000-0000-0000-0000-000000000001', 'Hero Banner', 'Full-width hero section with title, subtitle and CTA', 'header', '/placeholder.svg?height=120&width=200', '{"type":"hero","title":"Your Compelling Headline","content":{"subtitle":"A powerful subheading that captures attention and explains your value proposition","cta":"Get Started","ctaLink":"#"}}', false),
('b1000000-0000-0000-0000-000000000002', 'Gradient Hero', 'Hero section with gradient background', 'header', '/placeholder.svg?height=120&width=200', '{"type":"hero","title":"Transform Your Business","content":{"subtitle":"Innovative solutions for modern challenges","cta":"Learn More","ctaLink":"#","style":{"backgroundColor":"linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}}}', false),
('b1000000-0000-0000-0000-000000000003', 'Video Hero', 'Hero section with video background placeholder', 'header', '/placeholder.svg?height=120&width=200', '{"type":"hero","title":"See It In Action","content":{"subtitle":"Watch how our solution transforms workflows","videoUrl":"","cta":"Watch Demo","ctaLink":"#"}}', true),
('b1000000-0000-0000-0000-000000000004', 'Minimal Header', 'Clean, minimalist header section', 'header', '/placeholder.svg?height=120&width=200', '{"type":"hero","title":"Simple. Powerful. Effective.","content":{"subtitle":"Less is more"}}', false);

-- CONTENT BLOCKS
INSERT INTO block_templates (id, name, description, category, preview_url, content, is_premium) VALUES
('b1000000-0000-0000-0000-000000000005', 'Text Block', 'Simple text content section', 'content', '/placeholder.svg?height=120&width=200', '{"type":"text","title":"Section Title","content":{"text":"Your content goes here. This is a versatile text block that can be used for any type of written content including descriptions, explanations, or detailed information."}}', false),
('b1000000-0000-0000-0000-000000000006', 'Two Column', 'Content split into two columns', 'content', '/placeholder.svg?height=120&width=200', '{"type":"text","title":"Two Column Layout","content":{"text":"Left column content with important information.","rightColumn":"Right column content with complementary details."}}', false),
('b1000000-0000-0000-0000-000000000007', 'Feature Grid', 'Grid of features with icons', 'content', '/placeholder.svg?height=120&width=200', '{"type":"text","title":"Our Features","content":{"features":[{"icon":"⚡","title":"Fast","description":"Lightning quick performance"},{"icon":"🔒","title":"Secure","description":"Enterprise-grade security"},{"icon":"📈","title":"Scalable","description":"Grows with your business"},{"icon":"🎯","title":"Precise","description":"Accurate results every time"}]}}', false),
('b1000000-0000-0000-0000-000000000008', 'Numbered List', 'Sequential numbered content', 'content', '/placeholder.svg?height=120&width=200', '{"type":"text","title":"How It Works","content":{"steps":["Sign up for an account","Configure your settings","Start using the platform","See results immediately"]}}', false);

-- PRICING BLOCKS
INSERT INTO block_templates (id, name, description, category, preview_url, content, is_premium) VALUES
('b1000000-0000-0000-0000-000000000009', 'Pricing Table', 'Three-tier pricing comparison', 'pricing', '/placeholder.svg?height=120&width=200', '{"type":"pricing","title":"Choose Your Plan","content":{"plans":[{"name":"Starter","price":"$29","period":"/month","features":["5 Users","10GB Storage","Email Support"],"cta":"Get Started"},{"name":"Professional","price":"$79","period":"/month","features":["25 Users","100GB Storage","Priority Support","API Access"],"cta":"Most Popular","highlighted":true},{"name":"Enterprise","price":"$199","period":"/month","features":["Unlimited Users","Unlimited Storage","24/7 Support","Custom Integration"],"cta":"Contact Sales"}]}}', false),
('b1000000-0000-0000-0000-000000000010', 'Single Price Card', 'Focused single pricing option', 'pricing', '/placeholder.svg?height=120&width=200', '{"type":"pricing","title":"Simple Pricing","content":{"plans":[{"name":"All-In-One","price":"$99","period":"/month","features":["Everything included","No hidden fees","Cancel anytime"],"cta":"Start Free Trial"}]}}', false),
('b1000000-0000-0000-0000-000000000011', 'Comparison Table', 'Feature comparison across plans', 'pricing', '/placeholder.svg?height=120&width=200', '{"type":"table","title":"Plan Comparison","content":{"headers":["Feature","Basic","Pro","Enterprise"],"rows":[["Users","5","25","Unlimited"],["Storage","10GB","100GB","Unlimited"],["Support","Email","Priority","24/7"],["API Access","No","Yes","Yes"]]}}', true);

-- TESTIMONIAL BLOCKS
INSERT INTO block_templates (id, name, description, category, preview_url, content, is_premium) VALUES
('b1000000-0000-0000-0000-000000000012', 'Quote Card', 'Single testimonial quote', 'testimonial', '/placeholder.svg?height=120&width=200', '{"type":"quote","title":"What Our Clients Say","content":{"quote":"This solution transformed our business operations completely. We saw a 40% increase in efficiency within the first month.","author":"Sarah Johnson","role":"CEO, TechCorp","avatar":"/placeholder.svg?height=60&width=60"}}', false),
('b1000000-0000-0000-0000-000000000013', 'Testimonial Grid', 'Multiple testimonials in grid', 'testimonial', '/placeholder.svg?height=120&width=200', '{"type":"text","title":"Trusted by Industry Leaders","content":{"testimonials":[{"quote":"Exceptional service and results.","author":"John D.","company":"Acme Inc"},{"quote":"Game-changing platform.","author":"Lisa M.","company":"GlobalTech"},{"quote":"Highly recommended.","author":"Mike R.","company":"StartupXYZ"}]}}', false),
('b1000000-0000-0000-0000-000000000014', 'Logo Wall', 'Client logos showcase', 'testimonial', '/placeholder.svg?height=120&width=200', '{"type":"text","title":"Trusted By","content":{"logos":["Company 1","Company 2","Company 3","Company 4","Company 5","Company 6"]}}', false);

-- CTA BLOCKS
INSERT INTO block_templates (id, name, description, category, preview_url, content, is_premium) VALUES
('b1000000-0000-0000-0000-000000000015', 'Button CTA', 'Call-to-action with prominent button', 'cta', '/placeholder.svg?height=120&width=200', '{"type":"text","title":"Ready to Get Started?","content":{"text":"Join thousands of satisfied customers today.","cta":"Start Free Trial","ctaLink":"#"}}', false),
('b1000000-0000-0000-0000-000000000016', 'Form CTA', 'CTA with email capture form', 'cta', '/placeholder.svg?height=120&width=200', '{"type":"text","title":"Stay Updated","content":{"text":"Subscribe to our newsletter for the latest updates.","formType":"email","cta":"Subscribe"}}', false),
('b1000000-0000-0000-0000-000000000017', 'Split CTA', 'Two-option call to action', 'cta', '/placeholder.svg?height=120&width=200', '{"type":"text","title":"Choose Your Path","content":{"text":"Whether you are just starting or ready to scale.","primaryCta":"Start Free","secondaryCta":"Talk to Sales"}}', true);

-- DATA BLOCKS
INSERT INTO block_templates (id, name, description, category, preview_url, content, is_premium) VALUES
('b1000000-0000-0000-0000-000000000018', 'Stats Grid', 'Key statistics showcase', 'data', '/placeholder.svg?height=120&width=200', '{"type":"text","title":"By The Numbers","content":{"stats":[{"value":"10K+","label":"Active Users"},{"value":"99.9%","label":"Uptime"},{"value":"50M+","label":"Transactions"},{"value":"24/7","label":"Support"}]}}', false),
('b1000000-0000-0000-0000-000000000019', 'Chart Block', 'Data visualization placeholder', 'data', '/placeholder.svg?height=120&width=200', '{"type":"image","title":"Growth Metrics","content":{"src":"/placeholder.svg?height=300&width=600","alt":"Growth Chart","caption":"Year-over-year growth metrics"}}', false),
('b1000000-0000-0000-0000-000000000020', 'Data Table', 'Structured data table', 'data', '/placeholder.svg?height=120&width=200', '{"type":"table","title":"Performance Metrics","content":{"headers":["Metric","Q1","Q2","Q3","Q4"],"rows":[["Revenue","$1.2M","$1.5M","$1.8M","$2.1M"],["Users","5,000","7,500","10,000","15,000"],["NPS","72","75","78","82"]]}}', false),
('b1000000-0000-0000-0000-000000000021', 'Timeline', 'Project timeline or roadmap', 'data', '/placeholder.svg?height=120&width=200', '{"type":"text","title":"Project Timeline","content":{"milestones":[{"date":"Week 1-2","title":"Discovery","description":"Requirements gathering"},{"date":"Week 3-4","title":"Design","description":"UI/UX design phase"},{"date":"Week 5-8","title":"Development","description":"Building the solution"},{"date":"Week 9-10","title":"Launch","description":"Deployment and training"}]}}', true);

-- MEDIA BLOCKS
INSERT INTO block_templates (id, name, description, category, preview_url, content, is_premium) VALUES
('b1000000-0000-0000-0000-000000000022', 'Image Gallery', 'Multiple images in gallery format', 'media', '/placeholder.svg?height=120&width=200', '{"type":"text","title":"Gallery","content":{"images":["/placeholder.svg?height=200&width=300","/placeholder.svg?height=200&width=300","/placeholder.svg?height=200&width=300"]}}', false),
('b1000000-0000-0000-0000-000000000023', 'Video Embed', 'Embedded video player', 'media', '/placeholder.svg?height=120&width=200', '{"type":"image","title":"Product Demo","content":{"videoUrl":"","thumbnail":"/placeholder.svg?height=300&width=600","caption":"Watch our 2-minute product overview"}}', false),
('b1000000-0000-0000-0000-000000000024', 'Before After', 'Comparison slider for before/after', 'media', '/placeholder.svg?height=120&width=200', '{"type":"text","title":"The Transformation","content":{"before":"/placeholder.svg?height=300&width=300","after":"/placeholder.svg?height=300&width=300"}}', true);

-- =============================================
-- STOCK IMAGES (with name column)
-- =============================================

-- Business category
INSERT INTO stock_images (name, url, category, tags, is_premium) VALUES
('Business Meeting', '/placeholder.svg?height=200&width=300', 'business', ARRAY['meeting', 'office', 'corporate'], false),
('Handshake Deal', '/placeholder.svg?height=200&width=300', 'business', ARRAY['handshake', 'partnership', 'deal'], false),
('Office Workspace', '/placeholder.svg?height=200&width=300', 'business', ARRAY['office', 'workspace', 'desk'], false),
('Presentation', '/placeholder.svg?height=200&width=300', 'business', ARRAY['presentation', 'meeting', 'audience'], false),
('Strategy Session', '/placeholder.svg?height=200&width=300', 'business', ARRAY['strategy', 'planning', 'team'], true);

-- Technology category
INSERT INTO stock_images (name, url, category, tags, is_premium) VALUES
('Data Dashboard', '/placeholder.svg?height=200&width=300', 'technology', ARRAY['dashboard', 'data', 'analytics'], false),
('Code Screen', '/placeholder.svg?height=200&width=300', 'technology', ARRAY['code', 'programming', 'developer'], false),
('Cloud Computing', '/placeholder.svg?height=200&width=300', 'technology', ARRAY['cloud', 'infrastructure', 'server'], false),
('AI Robot', '/placeholder.svg?height=200&width=300', 'technology', ARRAY['ai', 'robot', 'automation'], true),
('Mobile Apps', '/placeholder.svg?height=200&width=300', 'technology', ARRAY['mobile', 'app', 'interface'], false);

-- Team category
INSERT INTO stock_images (name, url, category, tags, is_premium) VALUES
('Team Collaboration', '/placeholder.svg?height=200&width=300', 'team', ARRAY['team', 'collaboration', 'work'], false),
('Diverse Team', '/placeholder.svg?height=200&width=300', 'team', ARRAY['diversity', 'team', 'portrait'], false),
('Remote Work', '/placeholder.svg?height=200&width=300', 'team', ARRAY['remote', 'video call', 'virtual'], false),
('Brainstorming', '/placeholder.svg?height=200&width=300', 'team', ARRAY['brainstorm', 'creative', 'ideas'], false),
('Leadership', '/placeholder.svg?height=200&width=300', 'team', ARRAY['leader', 'executive', 'ceo'], true);

-- Abstract category
INSERT INTO stock_images (name, url, category, tags, is_premium) VALUES
('Gradient Abstract', '/placeholder.svg?height=200&width=300', 'abstract', ARRAY['gradient', 'colorful', 'background'], false),
('Geometric Shapes', '/placeholder.svg?height=200&width=300', 'abstract', ARRAY['geometric', 'shapes', 'pattern'], false),
('Network Nodes', '/placeholder.svg?height=200&width=300', 'abstract', ARRAY['network', 'connection', 'nodes'], false),
('Wave Pattern', '/placeholder.svg?height=200&width=300', 'abstract', ARRAY['wave', 'flow', 'pattern'], false),
('Particle Effect', '/placeholder.svg?height=200&width=300', 'abstract', ARRAY['particle', 'digital', 'effect'], true);

-- Charts category
INSERT INTO stock_images (name, url, category, tags, is_premium) VALUES
('Growth Chart', '/placeholder.svg?height=200&width=300', 'charts', ARRAY['growth', 'chart', 'upward'], false),
('Pie Chart', '/placeholder.svg?height=200&width=300', 'charts', ARRAY['pie', 'chart', 'data'], false),
('Bar Graph', '/placeholder.svg?height=200&width=300', 'charts', ARRAY['bar', 'graph', 'comparison'], false),
('Analytics Dashboard', '/placeholder.svg?height=200&width=300', 'charts', ARRAY['analytics', 'dashboard', 'multiple'], false),
('Financial Report', '/placeholder.svg?height=200&width=300', 'charts', ARRAY['financial', 'report', 'graphs'], true);

-- Nature category (bonus for backgrounds)
INSERT INTO stock_images (name, url, category, tags, is_premium) VALUES
('Mountain Landscape', '/placeholder.svg?height=200&width=300', 'nature', ARRAY['mountain', 'landscape', 'scenic'], false),
('Ocean Waves', '/placeholder.svg?height=200&width=300', 'nature', ARRAY['ocean', 'waves', 'water'], false),
('Forest Path', '/placeholder.svg?height=200&width=300', 'nature', ARRAY['forest', 'path', 'trees'], false),
('Sunset Sky', '/placeholder.svg?height=200&width=300', 'nature', ARRAY['sunset', 'sky', 'clouds'], false);
