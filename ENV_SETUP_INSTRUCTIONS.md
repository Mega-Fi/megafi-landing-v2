# Environment Variables Setup

## ⚠️ IMPORTANT: Create .env.local File

The app is now running but Supabase is not configured yet. Follow these steps:

## Step 1: Create .env.local File

Create a new file named `.env.local` in the project root directory:

```
C:\Users\sami-\Downloads\Projects\megafi-landing\.env.local
```

## Step 2: Add Your Supabase Credentials

Open the `.env.local` file and add these two lines:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Get Your Supabase Credentials

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project (or create a new one)
3. Click on **Settings** (gear icon) in the left sidebar
4. Click on **API** in the settings menu
5. Copy the following values:
   - **Project URL** → Replace `your-project-url-here`
   - **anon public** key → Replace `your-anon-key-here`

## Step 4: Example .env.local File

Your completed `.env.local` file should look like this:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG0iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODMwMDAwMCwiZXhwIjoxOTUzODc2MDAwfQ.example-signature-here
```

## Step 5: Restart Your Development Server

After creating the `.env.local` file:

1. Stop the dev server (Ctrl+C in the terminal)
2. Start it again:
```bash
npm run dev
```

3. The app should now load without errors!

## Step 6: Run SQL Migrations

Once the app is running, you need to set up the database tables:

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Run the SQL files in the `supabase/` folder:
   - First: `supabase/01_create_waitlist_emails.sql`
   - Second: `supabase/02_create_launch_config.sql`

See `supabase/README.md` for detailed instructions.

## Current Status

✅ The app will now run without crashing  
⚠️ Supabase features are disabled until you add credentials  
⚠️ You'll see a warning message if you try to submit an email  

When you add the credentials and restart:
✅ Email collection will work  
✅ Dynamic countdown will work  
✅ Real-time signup count will work  

## Fallback Behavior (Without Configuration)

Until you configure Supabase, the app uses fallback values:
- Countdown: 30 days from current time
- Signup count: Shows "Be the first to join!"
- Email submission: Shows configuration warning

## Need Help?

See these files for more information:
- `SUPABASE_SETUP.md` - Complete setup guide
- `supabase/README.md` - Database setup instructions
- `.env.example` - Environment variable template

