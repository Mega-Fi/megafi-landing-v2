-- Create waitlist_emails table
CREATE TABLE IF NOT EXISTS waitlist_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_emails_email ON waitlist_emails(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_waitlist_emails_created_at ON waitlist_emails(created_at DESC);

-- Enable Row Level Security
ALTER TABLE waitlist_emails ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert their email (anonymous users)
CREATE POLICY "Allow public email inserts"
  ON waitlist_emails
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow anyone to read count (for displaying signup numbers)
CREATE POLICY "Allow public email count"
  ON waitlist_emails
  FOR SELECT
  TO anon
  USING (true);

