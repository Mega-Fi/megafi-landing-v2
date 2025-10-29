# Supabase Waitlist Setup Guide

## Overview

The MegaFi landing page now integrates with Supabase for:
1. Email collection (waitlist signups)
2. Countdown timer (based on launch date)
3. Real-time signup count display

## Quick Start

### 1. Configure Supabase Credentials

Open the `.env.local` file in the project root and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key-here
```

**To get these values:**
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the **Project URL** and **anon public** key

### 2. Run SQL Migrations

Execute the SQL files in the `supabase/` folder in order:

**Option A: Using Supabase Dashboard**
1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query
3. Copy and paste the contents of `supabase/01_create_waitlist_emails.sql`
4. Click **Run** (or press Ctrl+Enter / Cmd+Enter)
5. Repeat for `supabase/02_create_launch_config.sql`

**Option B: Using Supabase CLI (if installed)**
```bash
supabase db reset
```

### 3. Verify Setup

After running the migrations, verify in your Supabase dashboard:

**Table Editor** should show:
- `waitlist_emails` table (empty)
- `launch_config` table (with 1 row containing launch date ~225 days from now)

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and test the waitlist form!

## Features Implemented

### ✅ Email Collection
- Emails are stored in `waitlist_emails` table
- Duplicate email prevention (shows user-friendly error)
- Email validation and normalization (lowercase, trimmed)
- Error handling for network issues

### ✅ Dynamic Countdown
- Fetches launch date from `launch_config` table
- Calculates countdown client-side in real-time
- Updates every second
- Stops at zero (doesn't go negative)

### ✅ Real-time Signup Count
- Displays actual count from database
- Updates after each successful signup
- Shows "Be the first to join!" when count is 0
- Proper singular/plural handling

### ✅ Loading States
- Submit button shows "Joining..." while submitting
- Form inputs disabled during submission
- Prevents double-submission

### ✅ Error Messages
- "This email is already on the waitlist!" for duplicates
- "Something went wrong. Please try again." for database errors
- "Network error. Please check your connection." for network issues

## Testing the Integration

### Test Email Submission

1. Enter an email and click "Get Notified"
2. Check Supabase dashboard → **Table Editor** → `waitlist_emails`
3. Your email should appear in the table
4. Try submitting the same email again → should show duplicate error

### Test Countdown

1. The countdown should display time remaining until launch
2. Initial launch date is set to ~225 days from migration time
3. To change the launch date, run this SQL:

```sql
UPDATE launch_config
SET launch_date = '2026-06-15 00:00:00+00'
WHERE id = (SELECT id FROM launch_config LIMIT 1);
```

### Test Signup Count

1. Fresh page load should show "Be the first to join!" (if no signups)
2. After submitting an email, count should update
3. Refresh the page → count persists

## Customization

### Change Launch Date

**Via Supabase Dashboard:**
1. Go to **Table Editor** → `launch_config`
2. Click the row to edit
3. Update `launch_date` field
4. Save changes

**Via SQL Editor:**
```sql
UPDATE launch_config
SET launch_date = '2026-12-31 23:59:59+00'
WHERE id = (SELECT id FROM launch_config LIMIT 1);
```

### View All Signups

**Via Supabase Dashboard:**
- Go to **Table Editor** → `waitlist_emails`

**Via SQL Editor:**
```sql
SELECT * FROM waitlist_emails
ORDER BY created_at DESC;
```

### Export Email List

**Via Supabase Dashboard:**
1. Go to **Table Editor** → `waitlist_emails`
2. Click the **•••** menu (top right)
3. Select **Export as CSV**

## Database Schema

### waitlist_emails
```sql
CREATE TABLE waitlist_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### launch_config
```sql
CREATE TABLE launch_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  launch_date TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Security (Row Level Security)

Both tables have RLS policies configured:

**waitlist_emails:**
- ✅ Anyone can INSERT (anonymous signups)
- ✅ Anyone can SELECT for counting
- ❌ Cannot UPDATE or DELETE (requires authentication)

**launch_config:**
- ✅ Anyone can SELECT (read launch date)
- ❌ Only authenticated users can UPDATE
- ❌ Cannot INSERT or DELETE (requires authentication)

## Troubleshooting

### Error: "Missing Supabase environment variables"

**Solution:** Ensure `.env.local` exists with correct values:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Then restart the dev server:
```bash
npm run dev
```

### Error: "permission denied for table"

**Solution:** Check that RLS policies were created correctly:
1. Go to **Authentication** → **Policies**
2. Verify policies exist for both tables
3. Re-run the SQL migration files if needed

### Countdown shows all zeros

**Solutions:**
1. Check that `launch_config` table has a row with future date
2. Verify the launch date is in the future
3. Check browser console for errors

### Signup count shows 0 but emails exist

**Solution:** Check RLS policies allow SELECT on `waitlist_emails`:
```sql
-- Run this in SQL Editor
SELECT * FROM waitlist_emails;
```

If you get a permission error, re-run `01_create_waitlist_emails.sql`

## Production Deployment

### Environment Variables

Add these to your hosting platform (Vercel, Netlify, etc.):
```
NEXT_PUBLIC_SUPABASE_URL=your-production-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
```

### Database Backup

Supabase provides automatic backups, but you can also:
1. Export waitlist emails regularly
2. Keep a copy of SQL migration files
3. Enable Point-in-Time Recovery (paid plans)

## Support

- **Supabase Docs:** https://supabase.com/docs
- **SQL Migrations:** Check `supabase/README.md`
- **Database Schema:** See `lib/types/database.ts`

---

**Status:** ✅ Ready for Production
**Last Updated:** October 29, 2025

