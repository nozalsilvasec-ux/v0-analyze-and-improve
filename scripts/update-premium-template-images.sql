-- Update Executive Business Strategy template with meaningful image captions
UPDATE templates 
SET content = jsonb_set(
  content,
  '{sections}',
  (
    SELECT jsonb_agg(
      CASE 
        WHEN section->>'type' = 'image' THEN
          jsonb_set(
            section,
            '{content}',
            jsonb_build_object(
              'src', '',
              'alt', COALESCE(section->'content'->>'alt', 'Business Analytics'),
              'caption', COALESCE(section->'content'->>'caption', 'Business analytics chart showing key metrics')
            )
          )
        ELSE section
      END
    )
    FROM jsonb_array_elements(content->'sections') AS section
  )
)
WHERE name = 'Executive Business Strategy'
AND is_premium = true;

-- Update SaaS Product Launch template
UPDATE templates 
SET content = jsonb_set(
  content,
  '{sections}',
  (
    SELECT jsonb_agg(
      CASE 
        WHEN section->>'type' = 'image' THEN
          jsonb_set(
            section,
            '{content}',
            jsonb_build_object(
              'src', '',
              'alt', COALESCE(section->'content'->>'alt', 'Product Dashboard'),
              'caption', COALESCE(section->'content'->>'caption', 'SaaS product dashboard showing key features')
            )
          )
        ELSE section
      END
    )
    FROM jsonb_array_elements(content->'sections') AS section
  )
)
WHERE name = 'SaaS Product Launch Blueprint'
AND is_premium = true;

-- Update Creative Agency Pitch template
UPDATE templates 
SET content = jsonb_set(
  content,
  '{sections}',
  (
    SELECT jsonb_agg(
      CASE 
        WHEN section->>'type' = 'image' THEN
          jsonb_set(
            section,
            '{content}',
            jsonb_build_object(
              'src', '',
              'alt', COALESCE(section->'content'->>'alt', 'Creative Portfolio'),
              'caption', COALESCE(section->'content'->>'caption', 'Creative team collaboration and design process')
            )
          )
        ELSE section
      END
    )
    FROM jsonb_array_elements(content->'sections') AS section
  )
)
WHERE name = 'Creative Agency Pitch Deck'
AND is_premium = true;

-- Update Management Consulting template
UPDATE templates 
SET content = jsonb_set(
  content,
  '{sections}',
  (
    SELECT jsonb_agg(
      CASE 
        WHEN section->>'type' = 'image' THEN
          jsonb_set(
            section,
            '{content}',
            jsonb_build_object(
              'src', '',
              'alt', COALESCE(section->'content'->>'alt', 'Process Framework'),
              'caption', COALESCE(section->'content'->>'caption', 'Business process workflow and framework diagram')
            )
          )
        ELSE section
      END
    )
    FROM jsonb_array_elements(content->'sections') AS section
  )
)
WHERE name = 'Management Consulting Framework'
AND is_premium = true;

-- Update Series A Fundraising template
UPDATE templates 
SET content = jsonb_set(
  content,
  '{sections}',
  (
    SELECT jsonb_agg(
      CASE 
        WHEN section->>'type' = 'image' THEN
          jsonb_set(
            section,
            '{content}',
            jsonb_build_object(
              'src', '',
              'alt', COALESCE(section->'content'->>'alt', 'Market Opportunity'),
              'caption', COALESCE(section->'content'->>'caption', 'Market TAM growth chart and revenue projections')
            )
          )
        ELSE section
      END
    )
    FROM jsonb_array_elements(content->'sections') AS section
  )
)
WHERE name = 'Series A Fundraising Pitch'
AND is_premium = true;
