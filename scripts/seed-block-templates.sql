-- Seed block templates with professional designs
-- Categories: header, content, pricing, testimonial, cta, data, media, footer

-- HEADER BLOCKS
INSERT INTO block_templates (name, description, category, preview_url, content, is_premium) VALUES
(
  'Hero Banner',
  'Full-width hero section with title, subtitle, and call-to-action',
  'header',
  '/placeholder.svg?height=120&width=200',
  '{"type": "hero", "title": "Your Compelling Headline", "content": {"subtitle": "A powerful subheadline that captures attention and drives action", "cta": "Get Started"}, "style": {"backgroundColor": "#1e3a5f", "textColor": "#ffffff"}}'::jsonb,
  false
),
(
  'Simple Header',
  'Clean header with logo area and navigation placeholder',
  'header',
  '/placeholder.svg?height=120&width=200',
  '{"type": "text", "title": "Company Name", "content": {"text": "Welcome to our proposal. We are excited to present our solution."}, "style": {"backgroundColor": "#ffffff"}}'::jsonb,
  false
),
(
  'Video Hero',
  'Hero section with video background placeholder',
  'header',
  '/placeholder.svg?height=120&width=200',
  '{"type": "hero", "title": "Experience the Difference", "content": {"subtitle": "Watch how we transform businesses", "hasVideo": true}, "style": {"backgroundColor": "#0f172a"}}'::jsonb,
  true
),
(
  'Gradient Hero',
  'Modern gradient hero with animated feel',
  'header',
  '/placeholder.svg?height=120&width=200',
  '{"type": "hero", "title": "Innovation Meets Excellence", "content": {"subtitle": "Driving results through cutting-edge solutions"}, "style": {"backgroundColor": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}}'::jsonb,
  true
),

-- CONTENT BLOCKS
(
  'Text Block',
  'Simple text paragraph section',
  'content',
  '/placeholder.svg?height=120&width=200',
  '{"type": "text", "title": "Section Title", "content": {"text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."}}'::jsonb,
  false
),
(
  'Two Column',
  'Side-by-side content layout',
  'content',
  '/placeholder.svg?height=120&width=200',
  '{"type": "text", "title": "Key Benefits", "content": {"text": "Our solution provides comprehensive benefits across multiple dimensions.", "layout": "two-column", "columns": [{"title": "Efficiency", "text": "Streamline your operations"}, {"title": "Growth", "text": "Scale your business faster"}]}}'::jsonb,
  false
),
(
  'Three Column',
  'Three column feature layout',
  'content',
  '/placeholder.svg?height=120&width=200',
  '{"type": "text", "title": "Our Approach", "content": {"layout": "three-column", "columns": [{"title": "Discover", "text": "Deep dive into your needs"}, {"title": "Design", "text": "Craft the perfect solution"}, {"title": "Deliver", "text": "Execute with precision"}]}}'::jsonb,
  false
),
(
  'Feature Grid',
  'Grid of features with icons',
  'content',
  '/placeholder.svg?height=120&width=200',
  '{"type": "text", "title": "Features & Capabilities", "content": {"layout": "grid", "items": [{"icon": "check", "title": "Fast Setup", "text": "Get started in minutes"}, {"icon": "shield", "title": "Secure", "text": "Enterprise-grade security"}, {"icon": "chart", "title": "Analytics", "text": "Real-time insights"}, {"icon": "users", "title": "Collaboration", "text": "Team-friendly"}]}}'::jsonb,
  false
),

-- PRICING BLOCKS
(
  'Pricing Table',
  'Three-tier pricing comparison',
  'pricing',
  '/placeholder.svg?height=120&width=200',
  '{"type": "pricing", "title": "Investment Options", "content": {"tiers": [{"name": "Starter", "price": "$999", "features": ["Core features", "Email support", "5 users"]}, {"name": "Professional", "price": "$2,499", "features": ["All Starter features", "Priority support", "25 users", "API access"], "highlighted": true}, {"name": "Enterprise", "price": "Custom", "features": ["All Pro features", "Dedicated support", "Unlimited users", "Custom integrations"]}]}}'::jsonb,
  false
),
(
  'Single Price Card',
  'Highlighted single pricing option',
  'pricing',
  '/placeholder.svg?height=120&width=200',
  '{"type": "pricing", "title": "Our Investment", "content": {"price": "$15,000", "period": "one-time", "description": "Complete solution implementation", "features": ["Full implementation", "Training included", "90-day support"]}}'::jsonb,
  false
),
(
  'Comparison Table',
  'Feature comparison across options',
  'pricing',
  '/placeholder.svg?height=120&width=200',
  '{"type": "table", "title": "Solution Comparison", "content": {"headers": ["Feature", "Basic", "Pro", "Enterprise"], "rows": [["Users", "5", "25", "Unlimited"], ["Storage", "10GB", "100GB", "Unlimited"], ["Support", "Email", "Priority", "Dedicated"]]}}'::jsonb,
  true
),

-- TESTIMONIAL BLOCKS
(
  'Quote Card',
  'Single testimonial with photo',
  'testimonial',
  '/placeholder.svg?height=120&width=200',
  '{"type": "quote", "title": "What Our Clients Say", "content": {"quote": "This solution transformed our business operations and exceeded all expectations.", "author": "Jane Smith", "role": "CEO, TechCorp", "image": "/placeholder.svg?height=80&width=80"}}'::jsonb,
  false
),
(
  'Testimonial Grid',
  'Multiple testimonials in grid',
  'testimonial',
  '/placeholder.svg?height=120&width=200',
  '{"type": "quote", "title": "Client Success Stories", "content": {"layout": "grid", "testimonials": [{"quote": "Incredible results!", "author": "John D.", "company": "StartupXYZ"}, {"quote": "Best decision we made.", "author": "Sarah M.", "company": "Enterprise Inc"}, {"quote": "Highly recommend!", "author": "Mike R.", "company": "Growth Co"}]}}'::jsonb,
  false
),
(
  'Logo Wall',
  'Client logos showcase',
  'testimonial',
  '/placeholder.svg?height=120&width=200',
  '{"type": "image", "title": "Trusted By Industry Leaders", "content": {"layout": "logo-wall", "logos": ["/placeholder.svg?height=60&width=120", "/placeholder.svg?height=60&width=120", "/placeholder.svg?height=60&width=120"]}}'::jsonb,
  false
),

-- CTA BLOCKS
(
  'Button CTA',
  'Call-to-action with prominent button',
  'cta',
  '/placeholder.svg?height=120&width=200',
  '{"type": "text", "title": "Ready to Get Started?", "content": {"text": "Take the first step toward transforming your business today.", "cta": {"text": "Schedule a Call", "style": "primary"}}, "style": {"backgroundColor": "#1e40af", "textColor": "#ffffff"}}'::jsonb,
  false
),
(
  'Form CTA',
  'Contact form call-to-action',
  'cta',
  '/placeholder.svg?height=120&width=200',
  '{"type": "text", "title": "Let''s Connect", "content": {"text": "Fill out the form below and we''ll be in touch within 24 hours.", "hasForm": true, "fields": ["name", "email", "message"]}}'::jsonb,
  true
),
(
  'Newsletter Signup',
  'Email subscription section',
  'cta',
  '/placeholder.svg?height=120&width=200',
  '{"type": "text", "title": "Stay Updated", "content": {"text": "Subscribe to receive the latest insights and updates.", "hasForm": true, "fields": ["email"]}}'::jsonb,
  false
),

-- DATA BLOCKS
(
  'Stats Grid',
  'Key metrics in grid layout',
  'data',
  '/placeholder.svg?height=120&width=200',
  '{"type": "text", "title": "By The Numbers", "content": {"layout": "stats", "stats": [{"value": "500+", "label": "Clients Served"}, {"value": "98%", "label": "Satisfaction Rate"}, {"value": "$50M+", "label": "Revenue Generated"}, {"value": "24/7", "label": "Support Available"}]}}'::jsonb,
  false
),
(
  'Chart Block',
  'Data visualization placeholder',
  'data',
  '/placeholder.svg?height=120&width=200',
  '{"type": "image", "title": "Growth Trajectory", "content": {"src": "/placeholder.svg?height=300&width=600", "caption": "Projected growth over 18 months", "chartType": "line"}}'::jsonb,
  false
),
(
  'Timeline',
  'Project timeline visualization',
  'data',
  '/placeholder.svg?height=120&width=200',
  '{"type": "text", "title": "Implementation Timeline", "content": {"layout": "timeline", "items": [{"phase": "Phase 1", "title": "Discovery", "duration": "2 weeks"}, {"phase": "Phase 2", "title": "Development", "duration": "8 weeks"}, {"phase": "Phase 3", "title": "Launch", "duration": "2 weeks"}]}}'::jsonb,
  false
),
(
  'Data Table',
  'Structured data in table format',
  'data',
  '/placeholder.svg?height=120&width=200',
  '{"type": "table", "title": "Deliverables Breakdown", "content": {"headers": ["Item", "Description", "Timeline"], "rows": [["Discovery Workshop", "Full-day strategic session", "Week 1"], ["Technical Audit", "Comprehensive system review", "Week 2-3"], ["Implementation", "Core solution deployment", "Week 4-10"]]}}'::jsonb,
  false
),

-- MEDIA BLOCKS
(
  'Image Gallery',
  'Multiple images in gallery layout',
  'media',
  '/placeholder.svg?height=120&width=200',
  '{"type": "image", "title": "Project Gallery", "content": {"layout": "gallery", "images": ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"]}}'::jsonb,
  false
),
(
  'Video Embed',
  'Embedded video player',
  'media',
  '/placeholder.svg?height=120&width=200',
  '{"type": "image", "title": "See It In Action", "content": {"hasVideo": true, "videoUrl": "", "thumbnail": "/placeholder.svg?height=400&width=700"}}'::jsonb,
  false
),
(
  'Before/After',
  'Comparison slider for transformations',
  'media',
  '/placeholder.svg?height=120&width=200',
  '{"type": "image", "title": "The Transformation", "content": {"layout": "comparison", "before": "/placeholder.svg?height=300&width=400", "after": "/placeholder.svg?height=300&width=400"}}'::jsonb,
  true
),

-- FOOTER BLOCKS
(
  'Simple Footer',
  'Clean footer with contact info',
  'footer',
  '/placeholder.svg?height=120&width=200',
  '{"type": "text", "title": "Get In Touch", "content": {"text": "Questions? We''re here to help.", "contact": {"email": "hello@company.com", "phone": "+1 (555) 123-4567"}}, "style": {"backgroundColor": "#1f2937", "textColor": "#ffffff"}}'::jsonb,
  false
),
(
  'Detailed Footer',
  'Footer with multiple sections',
  'footer',
  '/placeholder.svg?height=120&width=200',
  '{"type": "text", "title": "", "content": {"layout": "footer", "sections": [{"title": "Contact", "items": ["email@company.com", "+1 555-123-4567"]}, {"title": "Follow Us", "items": ["LinkedIn", "Twitter"]}, {"title": "Legal", "items": ["Privacy Policy", "Terms of Service"]}]}, "style": {"backgroundColor": "#111827", "textColor": "#9ca3af"}}'::jsonb,
  false
);

-- SEED STOCK IMAGES
INSERT INTO stock_images (url, category, tags, is_premium) VALUES
-- Business category
('/placeholder.svg?height=200&width=300', 'business', ARRAY['meeting', 'corporate', 'team'], false),
('/placeholder.svg?height=200&width=300', 'business', ARRAY['office', 'workspace', 'modern'], false),
('/placeholder.svg?height=200&width=300', 'business', ARRAY['handshake', 'deal', 'partnership'], false),
('/placeholder.svg?height=200&width=300', 'business', ARRAY['presentation', 'audience', 'speaking'], false),
('/placeholder.svg?height=200&width=300', 'business', ARRAY['executive', 'boardroom', 'leadership'], true),

-- Technology category
('/placeholder.svg?height=200&width=300', 'technology', ARRAY['code', 'developer', 'programming'], false),
('/placeholder.svg?height=200&width=300', 'technology', ARRAY['servers', 'data', 'infrastructure'], false),
('/placeholder.svg?height=200&width=300', 'technology', ARRAY['mobile', 'app', 'smartphone'], false),
('/placeholder.svg?height=200&width=300', 'technology', ARRAY['cloud', 'network', 'computing'], false),
('/placeholder.svg?height=200&width=300', 'technology', ARRAY['ai', 'robot', 'artificial intelligence'], true),

-- Team category
('/placeholder.svg?height=200&width=300', 'team', ARRAY['diverse', 'collaboration', 'teamwork'], false),
('/placeholder.svg?height=200&width=300', 'team', ARRAY['brainstorming', 'ideas', 'creative'], false),
('/placeholder.svg?height=200&width=300', 'team', ARRAY['remote', 'video call', 'virtual'], false),
('/placeholder.svg?height=200&width=300', 'team', ARRAY['celebration', 'success', 'achievement'], false),
('/placeholder.svg?height=200&width=300', 'team', ARRAY['startup', 'casual', 'young'], false),

-- Charts category
('/placeholder.svg?height=200&width=300', 'charts', ARRAY['bar chart', 'analytics', 'growth'], false),
('/placeholder.svg?height=200&width=300', 'charts', ARRAY['line graph', 'trend', 'growth'], false),
('/placeholder.svg?height=200&width=300', 'charts', ARRAY['pie chart', 'statistics', 'breakdown'], false),
('/placeholder.svg?height=200&width=300', 'charts', ARRAY['dashboard', 'metrics', 'kpi'], false),
('/placeholder.svg?height=200&width=300', 'charts', ARRAY['financial', 'stock', 'market'], true),

-- Abstract category
('/placeholder.svg?height=200&width=300', 'abstract', ARRAY['gradient', 'blue', 'purple'], false),
('/placeholder.svg?height=200&width=300', 'abstract', ARRAY['geometric', 'pattern', 'minimal'], false),
('/placeholder.svg?height=200&width=300', 'abstract', ARRAY['waves', 'flowing', 'dynamic'], false),
('/placeholder.svg?height=200&width=300', 'abstract', ARRAY['bokeh', 'particles', 'light'], false),
('/placeholder.svg?height=200&width=300', 'abstract', ARRAY['network', 'connections', 'digital'], true),

-- Nature category
('/placeholder.svg?height=200&width=300', 'nature', ARRAY['mountain', 'landscape', 'sunrise'], false),
('/placeholder.svg?height=200&width=300', 'nature', ARRAY['ocean', 'beach', 'calm'], false),
('/placeholder.svg?height=200&width=300', 'nature', ARRAY['forest', 'trees', 'green'], false),
('/placeholder.svg?height=200&width=300', 'nature', ARRAY['city', 'skyline', 'urban'], false);
