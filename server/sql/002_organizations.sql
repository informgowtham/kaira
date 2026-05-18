CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  plan_tier TEXT NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'pro')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organization_members (
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (organization_id, user_id)
);

ALTER TABLE boards ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

INSERT INTO organizations (id, name, slug, status, plan_tier)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'KairaBoard Internal', 'kairaboard-internal', 'active', 'pro'),
  ('10000000-0000-0000-0000-000000000002', 'Demo Customer', 'demo-customer', 'active', 'free'),
  ('10000000-0000-0000-0000-000000000099', 'Default Customer', 'default-customer', 'active', 'free')
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    status = EXCLUDED.status,
    plan_tier = EXCLUDED.plan_tier,
    updated_at = NOW();

INSERT INTO organization_members (organization_id, user_id, role)
SELECT
  CASE
    WHEN email = 'admin@kairaboard.dev' THEN '10000000-0000-0000-0000-000000000001'::uuid
    WHEN email = 'user@kairaboard.dev' THEN '10000000-0000-0000-0000-000000000002'::uuid
    ELSE '10000000-0000-0000-0000-000000000099'::uuid
  END,
  id,
  CASE WHEN email = 'admin@kairaboard.dev' THEN 'admin' ELSE 'owner' END
FROM users
ON CONFLICT (organization_id, user_id) DO NOTHING;

UPDATE boards b
SET organization_id = COALESCE(
  (
    SELECT om.organization_id
    FROM organization_members om
    WHERE om.user_id = b.owner_id
    ORDER BY
      CASE om.role WHEN 'owner' THEN 1 WHEN 'admin' THEN 2 ELSE 3 END,
      om.created_at
    LIMIT 1
  ),
  '10000000-0000-0000-0000-000000000099'::uuid
)
WHERE b.organization_id IS NULL;

ALTER TABLE boards ALTER COLUMN organization_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status);
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_boards_organization_id ON boards(organization_id);
