# Waitlist Setup Guide

This guide will help you set up the waitlist functionality for your MegaFi landing page.

## Prerequisites

- A Supabase account and project
- Node.js and npm installed

## Step 1: Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is created, navigate to the SQL Editor
3. Run the SQL scripts in the `supabase/` folder in this order:
   - `01_create_waitlist_emails.sql`
   - `02_create_launch_config.sql`

## Step 2: Configure Environment Variables

1. In your Supabase project dashboard, go to Settings > API
2. Copy your Project URL and anon/public key
3. Create a `.env.local` file in the root of your project:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Replace `your-project-url` and `your-anon-key` with your actual values from Supabase.

## Step 3: Install Dependencies

If you haven't already installed the dependencies:

```bash
npm install
```

## Step 4: Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your landing page with the waitlist component in the footer.

## Features

The waitlist component includes:

✅ **Email Validation** - Client-side and server-side email validation
✅ **Submit Button** - Join the waitlist with a click
✅ **People Counter** - Shows total number of people who joined
✅ **Countdown Timer** - Displays days, hours, minutes, and seconds until launch
✅ **Responsive Design** - Works beautifully on all devices
✅ **Error Handling** - Handles duplicate emails and network errors
✅ **Success Messages** - Confirms when someone joins successfully

## Customization

### Adjust Launch Date

To change the launch date:

1. Go to your Supabase project
2. Open the SQL Editor
3. Run:

```sql
UPDATE launch_config 
SET launch_date = '2025-12-31 00:00:00+00'::timestamptz 
WHERE id = (SELECT id FROM launch_config LIMIT 1);
```

Replace the date with your desired launch date.

### Styling

The waitlist component uses CSS-in-JS with `styled-jsx`. The styles automatically adapt to light/dark mode and match your accent color from the hero section.

To customize colors, modify the styles in `components/ui/waitlist.tsx`.

## Database Structure

### waitlist_emails table
- `id` (UUID): Primary key
- `email` (TEXT): Email address (unique)
- `created_at` (TIMESTAMP): When the email was added

### launch_config table
- `id` (UUID): Primary key
- `launch_date` (TIMESTAMP): The launch date for countdown
- `updated_at` (TIMESTAMP): Last updated timestamp

## API Endpoints

- `POST /api/waitlist` - Add an email to the waitlist
- `GET /api/waitlist` - Get the total count of waitlist emails
- `GET /api/launch-date` - Get the launch date for the countdown

## Troubleshooting

### "Failed to fetch count" error
- Check that your Supabase URL and anon key are correct in `.env.local`
- Verify that the SQL scripts have been run successfully
- Check that Row Level Security policies are enabled

### Emails not being saved
- Check the browser console for error messages
- Verify your API routes are working by visiting `/api/waitlist` directly
- Check Supabase logs in your project dashboard

### Countdown not showing
- Verify that the `launch_config` table has a record
- Check the browser console for errors
- Make sure the launch date is in the future

## Support

If you encounter any issues, check:
1. Browser console for client-side errors
2. Terminal/console for server-side errors
3. Supabase logs in your project dashboard

