-- Create launch_config table
CREATE TABLE IF NOT EXISTS launch_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  launch_date TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial launch date (adjust this date as needed)
-- Currently set to ~225 days from now (approximately mid-June 2026)
INSERT INTO launch_config (launch_date)
VALUES (NOW() + INTERVAL '225 days')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE launch_config ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read the launch date
CREATE POLICY "Allow public read launch date"
  ON launch_config
  FOR SELECT
  TO anon
  USING (true);

-- Policy: Only authenticated users can update launch date
CREATE POLICY "Only authenticated can update launch date"
  ON launch_config
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_launch_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
CREATE TRIGGER update_launch_config_updated_at_trigger
  BEFORE UPDATE ON launch_config
  FOR EACH ROW
  EXECUTE FUNCTION update_launch_config_updated_at();

