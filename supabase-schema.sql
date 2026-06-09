-- user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  credits INTEGER DEFAULT 5,
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- content_history table
CREATE TABLE IF NOT EXISTS content_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) NOT NULL,
  topic TEXT NOT NULL,
  niche TEXT NOT NULL,
  platform TEXT NOT NULL,
  caption TEXT,
  hashtags JSONB,
  post_ideas JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user history queries
CREATE INDEX IF NOT EXISTS idx_content_history_user_id ON content_history(user_id);
CREATE INDEX IF NOT EXISTS idx_content_history_created_at ON content_history(created_at DESC);
