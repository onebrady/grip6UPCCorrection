# Supabase Setup Guide

This guide will help you set up Supabase for persistent data storage in the UPC Dashboard.

## Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Click "Start your project"**
3. **Sign in with GitHub**
4. **Click "New Project"**
5. **Choose your organization**
6. **Enter project details:**
   - **Name:** `upc-dashboard`
   - **Database Password:** (generate a strong password)
   - **Region:** Choose closest to you
7. **Click "Create new project"**

## Step 2: Create Database Table

1. **Go to your Supabase dashboard**
2. **Click "SQL Editor" in the left sidebar**
3. **Create a new query and paste this SQL:**

```sql
-- Create the sync data table
CREATE TABLE upc_sync_data (
  id INTEGER PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial record
INSERT INTO upc_sync_data (id, data)
VALUES (1, '{"products": [], "editedProducts": [], "lastUpdated": 0}');

-- Enable Row Level Security (optional but recommended)
ALTER TABLE upc_sync_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for simplicity)
CREATE POLICY "Allow all operations" ON upc_sync_data
  FOR ALL USING (true);
```

4. **Click "Run" to execute the SQL**

## Step 3: Get API Keys

1. **Go to "Settings" → "API" in your Supabase dashboard**
2. **Copy the following values:**
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 4: Configure Environment Variables

### For Local Development

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### For Vercel Deployment

1. **Go to your Vercel dashboard**
2. **Select your project**
3. **Go to "Settings" → "Environment Variables"**
4. **Add these variables:**
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** `https://your-project.supabase.co`
   - **Environment:** Production, Preview, Development
5. **Add another variable:**
   - **Name:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `your-anon-key-here`
   - **Environment:** Production, Preview, Development

## Step 5: Test the Setup

1. **Start your development server:** `npm run dev`
2. **Open the dashboard**
3. **Check the browser console for Supabase connection messages**
4. **Try uploading a CSV file**
5. **Check if data persists after page reload**

## Troubleshooting

### Connection Issues

- **Check environment variables** are set correctly
- **Verify Supabase URL** and API key
- **Check browser console** for error messages
- **Ensure table exists** in Supabase dashboard

### Data Not Persisting

- **Check RLS policies** in Supabase
- **Verify table structure** matches the code
- **Check browser console** for save/load errors

### Performance Issues

- **Consider pagination** for large datasets
- **Optimize queries** if needed
- **Monitor Supabase usage** in dashboard

## Security Notes

- **The anon key is safe** to use in client-side code
- **Row Level Security** is enabled by default
- **Consider adding authentication** for production use
- **Monitor API usage** in Supabase dashboard

## Next Steps

Once Supabase is configured:

1. **Deploy to Vercel** with environment variables
2. **Test multi-user collaboration**
3. **Monitor performance** and usage
4. **Consider adding user authentication** if needed

## Support

For issues:

1. **Check Supabase logs** in dashboard
2. **Verify environment variables**
3. **Test with simple data first**
4. **Check browser console** for errors
