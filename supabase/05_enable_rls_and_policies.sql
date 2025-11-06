-- ============================================================================
-- Enable RLS and Create Security Policies
-- ============================================================================
-- This migration enables Row Level Security (RLS) on all tables and
-- creates the proper security policies.
--
-- IMPORTANT: Run this AFTER creating the tables but BEFORE going to production
-- ============================================================================

-- ============================================================================
-- 1. WAITLIST_EMAILS TABLE
-- ============================================================================

-- Enable RLS
ALTER TABLE waitlist_emails ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public email count" ON waitlist_emails;
DROP POLICY IF EXISTS "Allow public email inserts" ON waitlist_emails;

-- Create policies
CREATE POLICY "Allow public email count"
ON waitlist_emails
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow public email inserts"
ON waitlist_emails
FOR INSERT
TO anon
WITH CHECK (true);

-- ============================================================================
-- 2. OG_ELIGIBLE_HANDLES TABLE
-- ============================================================================

-- Enable RLS
ALTER TABLE og_eligible_handles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read eligible handles" ON og_eligible_handles;
DROP POLICY IF EXISTS "Only authenticated can insert handles" ON og_eligible_handles;

-- Create policies
CREATE POLICY "Allow public read eligible handles"
ON og_eligible_handles
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Only authenticated can insert handles"
ON og_eligible_handles
FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================================================
-- 3. OG_NFT_CLAIMS TABLE
-- ============================================================================

-- Enable RLS
ALTER TABLE og_nft_claims ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert claims" ON og_nft_claims;
DROP POLICY IF EXISTS "Allow public read claims" ON og_nft_claims;
DROP POLICY IF EXISTS "Allow update own claims" ON og_nft_claims;
DROP POLICY IF EXISTS "Prevent claim deletions" ON og_nft_claims;

-- Policy 1: Allow public to read claims (for checking if claimed, getting latest token)
CREATE POLICY "Allow public read claims"
ON og_nft_claims
FOR SELECT
TO anon
USING (true);

-- Policy 2: Only authenticated users can insert claims
-- This matches your API route which requires auth token
CREATE POLICY "Only authenticated can insert claims"
ON og_nft_claims
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 3: Users can only update their own claims
-- Verify ownership by checking twitter_user_id matches auth.uid()
CREATE POLICY "Allow update own claims"
ON og_nft_claims
FOR UPDATE
TO authenticated
USING (
  -- Match twitter_user_id with authenticated user's ID
  twitter_user_id = auth.uid()
)
WITH CHECK (
  -- Ensure they can't change ownership
  twitter_user_id = auth.uid()
);

-- Policy 4: Prevent deletions (claims should be permanent records)
CREATE POLICY "Prevent claim deletions"
ON og_nft_claims
FOR DELETE
TO authenticated
USING (false);

-- ============================================================================
-- VERIFICATION QUERIES (Optional - run these to verify policies work)
-- ============================================================================

-- Check RLS is enabled on all tables
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('waitlist_emails', 'og_eligible_handles', 'og_nft_claims');

-- List all policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename IN ('waitlist_emails', 'og_eligible_handles', 'og_nft_claims')
-- ORDER BY tablename, policyname;

