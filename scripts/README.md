# Scripts

## Import OG Eligible Handles

This script imports the list of 410 eligible X handles from a CSV file into the Supabase database.

### Prerequisites

1. Make sure your `.env.local` is configured with Supabase credentials
2. Make sure the dev server is running: `npm run dev`
3. Run the SQL migration: `supabase/03_create_og_nft_claims.sql`

### CSV Format

Your CSV file should have one X handle per line. The format can be:

**Option 1: With header**
```csv
twitter_handle
@user1
user2
@user3
```

**Option 2: Without header (just handles)**
```csv
@user1
user2
@user3
```

The script will automatically:
- Remove the `@` symbol if present
- Convert to lowercase
- Remove duplicates
- Trim whitespace

### Usage

1. Place your CSV file in the project (e.g., `og-handles.csv`)

2. Install tsx if not already installed:
```bash
npm install -g tsx
```

3. Run the import script:
```bash
npx tsx scripts/import-handles.ts og-handles.csv
```

4. The script will output the number of handles imported

### Alternative: Manual Import via SQL

If you prefer to import directly via SQL:

1. Open your Supabase SQL Editor
2. Run this query (replace handles with your actual list):

```sql
INSERT INTO og_eligible_handles (twitter_handle) VALUES
  ('user1'),
  ('user2'),
  ('user3')
ON CONFLICT (twitter_handle) DO NOTHING;
```

### Verify Import

Check the count of imported handles:

```sql
SELECT COUNT(*) FROM og_eligible_handles;
```

List all handles:

```sql
SELECT * FROM og_eligible_handles ORDER BY created_at DESC;
```

