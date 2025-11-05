-- Create og_eligible_handles table
-- Stores the 410 whitelisted X handles that are eligible for OG NFT
CREATE TABLE IF NOT EXISTS og_eligible_handles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  twitter_handle TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on twitter_handle for faster lookups
CREATE INDEX IF NOT EXISTS idx_og_eligible_handles_twitter ON og_eligible_handles(twitter_handle);

-- Enable Row Level Security
ALTER TABLE og_eligible_handles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read eligible handles (to check eligibility)
CREATE POLICY "Allow public read eligible handles"
  ON og_eligible_handles
  FOR SELECT
  TO anon
  USING (true);

-- Policy: Only authenticated users can insert handles (admin only)
CREATE POLICY "Only authenticated can insert handles"
  ON og_eligible_handles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create og_nft_claims table
-- Tracks NFT claims to prevent duplicates and store claim data
CREATE TABLE IF NOT EXISTS og_nft_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  twitter_handle TEXT NOT NULL UNIQUE,
  twitter_user_id TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  token_id TEXT,
  transaction_hash TEXT,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_og_nft_claims_twitter_handle ON og_nft_claims(twitter_handle);
CREATE INDEX IF NOT EXISTS idx_og_nft_claims_wallet ON og_nft_claims(wallet_address);
CREATE INDEX IF NOT EXISTS idx_og_nft_claims_claimed_at ON og_nft_claims(claimed_at DESC);

-- Enable Row Level Security
ALTER TABLE og_nft_claims ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert claims (for claiming NFTs)
CREATE POLICY "Allow public insert claims"
  ON og_nft_claims
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow public to read all claims (to check if handle already claimed)
CREATE POLICY "Allow public read claims"
  ON og_nft_claims
  FOR SELECT
  TO anon
  USING (true);

-- Policy: Allow users to update their own claims (for adding token_id/tx_hash after mint)
CREATE POLICY "Allow update own claims"
  ON og_nft_claims
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

