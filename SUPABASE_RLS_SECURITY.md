# Supabase RLS Security Review & Recommendations

## 🚨 CRITICAL ISSUE: RLS is Disabled

**All three tables have RLS disabled** - this is a major security risk! Anyone with your Supabase URL can:

- Read all data
- Insert fake records
- Update/delete records
- Bypass all security checks

**Action Required:** Enable RLS on all tables immediately.

---

## 📊 Current Policy Analysis

### 1. `waitlist_emails` Table

**Current Status:** ❌ RLS Disabled

**Current Policies:**

- ✅ Allow public email count (SELECT for anon)
- ✅ Allow public email inserts (INSERT for anon)

**Recommendation:** ✅ Policies are correct, but **ENABLE RLS**

**Required Policies:**

```sql
-- Enable RLS
ALTER TABLE waitlist_emails ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public to count emails (for display)
CREATE POLICY "Allow public email count"
ON waitlist_emails
FOR SELECT
TO anon
USING (true);

-- Policy 2: Allow public to insert emails (signups)
CREATE POLICY "Allow public email inserts"
ON waitlist_emails
FOR INSERT
TO anon
WITH CHECK (true);
```

---

### 2. `og_eligible_handles` Table

**Current Status:** ❌ RLS Disabled

**Current Policies:**

- ✅ Allow public read eligible handles (SELECT for anon)
- ✅ Only authenticated can insert handles (INSERT for authenticated)

**Recommendation:** ✅ Policies are correct, but **ENABLE RLS**

**Required Policies:**

```sql
-- Enable RLS
ALTER TABLE og_eligible_handles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public to read eligible handles (for eligibility checks)
CREATE POLICY "Allow public read eligible handles"
ON og_eligible_handles
FOR SELECT
TO anon
USING (true);

-- Policy 2: Only authenticated users can insert handles (admin uploads)
CREATE POLICY "Only authenticated can insert handles"
ON og_eligible_handles
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Optional: Add UPDATE/DELETE policies if admins need to modify handles
-- CREATE POLICY "Only authenticated can update handles"
-- ON og_eligible_handles
-- FOR UPDATE
-- TO authenticated
-- USING (true);
```

---

### 3. `og_nft_claims` Table ⚠️ NEEDS FIXES

**Current Status:** ❌ RLS Disabled

**Current Policies:**

- ❌ **Allow public insert claims** - TOO PERMISSIVE!
- ✅ Allow public read claims (SELECT for anon)
- ⚠️ Allow update own claims (UPDATE for anon) - Need to verify ownership check

**Issues:**

1. **Public INSERT is dangerous** - Anyone can create fake claim records
2. **UPDATE policy needs ownership verification** - Must check `twitter_user_id` matches authenticated user
3. **Missing DELETE policy** - Should prevent deletions (or restrict to admins)

**Required Policies:**

```sql
-- Enable RLS
ALTER TABLE og_nft_claims ENABLE ROW LEVEL SECURITY;

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

-- Policy 4: Prevent deletions (or restrict to admins)
-- Option A: No deletions allowed
CREATE POLICY "Prevent claim deletions"
ON og_nft_claims
FOR DELETE
TO authenticated
USING (false);

-- Option B: Only admins can delete (if you add admin role)
-- CREATE POLICY "Only admins can delete claims"
-- ON og_nft_claims
-- FOR DELETE
-- TO authenticated
-- USING (
--   EXISTS (
--     SELECT 1 FROM user_roles
--     WHERE user_id = auth.uid()
--     AND role = 'admin'
--   )
-- );
```

---

## 🔧 Step-by-Step Fix Instructions

### Step 1: Enable RLS on All Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Enable RLS
ALTER TABLE waitlist_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE og_eligible_handles ENABLE ROW LEVEL SECURITY;
ALTER TABLE og_nft_claims ENABLE ROW LEVEL SECURITY;
```

### Step 2: Drop Existing Policies (if they exist)

```sql
-- Drop existing policies (they won't work with RLS disabled anyway)
DROP POLICY IF EXISTS "Allow public email count" ON waitlist_emails;
DROP POLICY IF EXISTS "Allow public email inserts" ON waitlist_emails;
DROP POLICY IF EXISTS "Allow public read eligible handles" ON og_eligible_handles;
DROP POLICY IF EXISTS "Only authenticated can insert handles" ON og_eligible_handles;
DROP POLICY IF EXISTS "Allow public insert claims" ON og_nft_claims;
DROP POLICY IF EXISTS "Allow public read claims" ON og_nft_claims;
DROP POLICY IF EXISTS "Allow update own claims" ON og_nft_claims;
```

### Step 3: Create Correct Policies

**For `waitlist_emails`:**

```sql
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
```

**For `og_eligible_handles`:**

```sql
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
```

**For `og_nft_claims`:**

```sql
CREATE POLICY "Allow public read claims"
ON og_nft_claims
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Only authenticated can insert claims"
ON og_nft_claims
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update own claims"
ON og_nft_claims
FOR UPDATE
TO authenticated
USING (twitter_user_id = auth.uid())
WITH CHECK (twitter_user_id = auth.uid());

CREATE POLICY "Prevent claim deletions"
ON og_nft_claims
FOR DELETE
TO authenticated
USING (false);
```

---

## ✅ Verification Checklist

After applying policies, test:

- [ ] Public can read `og_eligible_handles` (eligibility check works)
- [ ] Public can read `og_nft_claims` (latest token check works)
- [ ] Public can insert into `waitlist_emails` (signup works)
- [ ] Authenticated users can insert into `og_nft_claims` (claim recording works)
- [ ] Users can only update their own claims (test with different users)
- [ ] Unauthenticated users CANNOT insert into `og_nft_claims` (security test)
- [ ] Unauthenticated users CANNOT insert into `og_eligible_handles` (security test)

---

## 🔒 Security Best Practices

1. **Always enable RLS** - Never disable it in production
2. **Principle of least privilege** - Only grant minimum permissions needed
3. **Verify ownership** - Always check `auth.uid()` matches record ownership
4. **Test policies** - Verify both allowed and denied operations
5. **Monitor logs** - Watch for policy violations in Supabase logs

---

## 🐛 Troubleshooting

### "Policy violation" errors after enabling RLS

- Check that policies match your API route authentication
- Verify `auth.uid()` matches your `twitter_user_id` field
- Test with authenticated vs unauthenticated requests

### "Permission denied" for legitimate operations

- Verify the policy `USING` clause matches your query
- Check that user is authenticated (for authenticated policies)
- Ensure `auth.uid()` is available (user must be logged in)

### Policies not applying

- Ensure RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- Check policy target role matches request (anon vs authenticated)
- Verify policy is active (not dropped or disabled)

---

## 📚 Additional Resources

- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [RLS Policy Examples](https://supabase.com/docs/guides/auth/row-level-security#policies)
- [Auth Context](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

---

## 🎯 Summary

**Current Status:** ❌ Insecure (RLS disabled)

**Required Actions:**

1. ✅ Enable RLS on all tables
2. ✅ Fix `og_nft_claims` INSERT policy (require authentication)
3. ✅ Add ownership check to UPDATE policy
4. ✅ Add DELETE prevention policy
5. ✅ Test all policies

**After Fix:** ✅ Secure (RLS enabled with proper policies)
