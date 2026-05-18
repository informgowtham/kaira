CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  auth_provider TEXT NOT NULL CHECK (auth_provider IN ('google', 'email')),
  display_name TEXT NOT NULL,
  password_hash TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'free' CHECK (subscription_status IN ('free', 'pro')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_name TEXT NOT NULL,
  occasion TEXT NOT NULL CHECK (occasion IN ('birthday', 'farewell', 'anniversary', 'other')),
  theme TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'collecting_messages', 'scheduled', 'delivered', 'archived')),
  contributor_token TEXT UNIQUE NOT NULL,
  reveal_token TEXT UNIQUE NOT NULL,
  plan_tier TEXT NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'pro')),
  scheduled_at TIMESTAMPTZ,
  destination_type TEXT CHECK (destination_type IN ('recipient', 'creator')),
  recipient_contact TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_boards_owner_id ON boards(owner_id);
CREATE INDEX IF NOT EXISTS idx_boards_contributor_token ON boards(contributor_token);
CREATE INDEX IF NOT EXISTS idx_boards_reveal_token ON boards(reveal_token);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  display_name TEXT,
  text TEXT NOT NULL,
  emoji TEXT,
  gif_url TEXT,
  image_url TEXT,
  sticker TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_board_id ON messages(board_id);

CREATE TABLE IF NOT EXISTS deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID UNIQUE NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ,
  destination_type TEXT CHECK (destination_type IN ('recipient', 'creator')),
  recipient_contact TEXT,
  delivery_state TEXT NOT NULL DEFAULT 'draft' CHECK (delivery_state IN ('draft', 'scheduled', 'delivered')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  board_id UUID REFERENCES boards(id) ON DELETE SET NULL,
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
