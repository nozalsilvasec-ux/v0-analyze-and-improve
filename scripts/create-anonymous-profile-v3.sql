-- Create anonymous profile for non-authenticated usage
-- The profiles table columns: id, email, full_name, avatar_url, subscription_tier, ai_credits, created_at, updated_at

INSERT INTO profiles (
  id,
  email,
  full_name,
  avatar_url,
  subscription_tier,
  ai_credits,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'anonymous@localhost.local',
  'Anonymous User',
  NULL,
  'free',
  100,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;
