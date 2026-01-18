-- Create anonymous profile for non-authenticated usage
-- This profile is used when authentication is disabled

INSERT INTO profiles (id, email, full_name, avatar_url, subscription_tier, ai_credits_remaining, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'anonymous@localhost.local',
  'Anonymous User',
  NULL,
  'free',
  1000,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  updated_at = NOW();
