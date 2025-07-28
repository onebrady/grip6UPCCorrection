# Vercel Deployment Guide

This guide will help you deploy the UPC Dashboard to Vercel for easy sharing.

## Quick Deployment

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI:**

```bash
npm install -g vercel
```

2. **Login to Vercel:**

```bash
vercel login
```

3. **Deploy:**

```bash
vercel
```

### Option 2: Deploy via GitHub

1. **Push your code to GitHub**
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Vite project

### Option 3: Deploy via Vercel Dashboard

1. **Install Vercel CLI:**

```bash
npm install -g vercel
```

2. **Deploy:**

```bash
vercel --prod
```

## Configuration

The project is already configured for Vercel deployment with:

- ✅ `vercel.json` configuration file
- ✅ Proper build settings
- ✅ Static file serving
- ✅ Client-side routing support

## Environment Variables

For static deployment (no server), no environment variables are needed.

For multi-user collaboration, add:

```
VITE_API_URL=https://your-server-url.com/api
```

## Features Available

### Static Deployment (Default)

- ✅ CSV upload and processing
- ✅ UPC editing and management
- ✅ Local storage persistence
- ✅ Export functionality
- ✅ All filtering and search features
- ✅ Beautiful responsive UI

### With Server (Optional)

- ✅ Real-time multi-user collaboration
- ✅ Server-side data persistence
- ✅ Automatic sync across users

## Troubleshooting

### Blank Dashboard

If the dashboard appears blank:

1. **Check browser console** for JavaScript errors
2. **Verify build output** - run `npm run build` locally
3. **Check network tab** for failed requests
4. **Clear browser cache** and reload

### Build Errors

If you get build errors:

1. **Run locally first:** `npm run dev`
2. **Check TypeScript:** `npx tsc --noEmit`
3. **Check linting:** `npm run lint`
4. **Verify dependencies:** `npm install`

### Deployment Issues

If deployment fails:

1. **Check Vercel logs** in the dashboard
2. **Verify build command:** `npm run build`
3. **Check output directory:** `dist`
4. **Verify Node.js version:** 18+ recommended

## Performance

The dashboard is optimized for:

- ✅ Fast loading (minimal bundle size)
- ✅ Responsive design
- ✅ Offline functionality
- ✅ SEO-friendly

## Security

The static deployment is secure by default:

- ✅ No server-side code execution
- ✅ Client-side only processing
- ✅ Local storage for data persistence
- ✅ No external dependencies for core functionality

## Customization

To customize the deployment:

1. **Modify `vercel.json`** for custom routing
2. **Add environment variables** for server integration
3. **Customize build settings** in Vercel dashboard
4. **Add custom domains** in Vercel settings

## Support

For issues:

1. Check the browser console for errors
2. Verify all files are properly committed
3. Check Vercel deployment logs
4. Test locally before deploying
