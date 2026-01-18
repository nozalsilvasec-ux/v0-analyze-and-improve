-- Create an anonymous profile for non-authenticated usage
-- This profile is required because the proposals table has a foreign key constraint to profiles

INSERT INTO public.profiles (id, full_name, avatar_url, subscription_tier, ai_credits)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Anonymous User',
  NULL,
  'free',
  100
)
ON CONFLICT (id) DO NOTHING;
