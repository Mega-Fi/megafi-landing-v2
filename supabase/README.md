# Supabase Database Setup

This folder contains SQL migration files for the MegaFi waitlist functionality.

## Prerequisites

- A Supabase project (create one at https://supabase.com)
- Access to your Supabase project dashboard

## Setup Instructions

### 1. Run SQL Migrations

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of each SQL file in order:

#### Step 1: Create Waitlist Emails Table
- Open `01_create_waitlist_emails.sql`
- Copy the entire contents
- Paste into the SQL Editor
- Click **Run** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

#### Step 2: Create Launch Config Table
- Open `02_create_launch_config.sql`
- Copy the entire contents
- Paste into the SQL Editor
- Click **Run** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

### 2. Verify Tables Created

After running both migrations, verify the tables exist:

1. Go to **Table Editor** in the left sidebar
2. You should see two new tables:
   - `waitlist_emails`
   - `launch_config`

### 3. Configure Environment Variables

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy your **Project URL** (looks like: `https://xxxxx.supabase.co`)
3. Copy your **anon/public** key (starts with `eyJ...`)
4. Add these to your `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Database Schema

### waitlist_emails

Stores email addresses from waitlist signups.

| Column     | Type      | Description                          |
|------------|-----------|--------------------------------------|
| id         | UUID      | Primary key (auto-generated)         |
| email      | TEXT      | Email address (unique)               |
| created_at | TIMESTAMP | Timestamp of signup (auto-generated) |

**RLS Policies:**
- Public can insert emails (anonymous signups allowed)
- Public can read/count emails (for displaying signup count)

### launch_config

Stores the target launch date for countdown timer.

| Column      | Type      | Description                      |
|-------------|-----------|----------------------------------|
| id          | UUID      | Primary key (auto-generated)     |
| launch_date | TIMESTAMP | Target launch date               |
| updated_at  | TIMESTAMP | Last update time (auto-updated)  |

**RLS Policies:**
- Public can read launch date
- Only authenticated users can update launch date

## Updating Launch Date

To update the launch date, you can run this SQL in the SQL Editor:

```sql
UPDATE launch_config
SET launch_date = '2026-12-31 00:00:00+00'
WHERE id = (SELECT id FROM launch_config LIMIT 1);
```

Replace the date with your desired launch date.

## Testing

You can test the tables by inserting a test email:

```sql
INSERT INTO waitlist_emails (email)
VALUES ('test@example.com');

SELECT COUNT(*) FROM waitlist_emails;
```

## Troubleshooting

### "permission denied" errors
- Check that RLS policies are enabled and configured correctly
- Verify you're using the correct anon key in your `.env.local`

### Duplicate email errors
- This is expected behavior - the unique constraint prevents duplicate signups
- The frontend will handle this gracefully with a user-friendly message

### Launch date not showing
- Verify the `launch_config` table has at least one row
- Check the SQL Editor for any errors during migration

