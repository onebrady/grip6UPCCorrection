# UPC Management Dashboard

A modern, responsive web application for managing UPC codes for Shopify products. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Local Development

```bash
npm install
npm run dev
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## ✨ Features

- **🔐 Password Protection**: Simple password gate to protect sensitive pricing data
- **📊 CSV Import/Export**: Upload Shopify product exports and export updated data
- **🔍 Smart Filtering**: Filter out test products and products without SKUs
- **✏️ UPC Editing**: Easy inline editing of UPC codes with validation
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **💾 Local Storage**: Data persists between sessions
- **🔄 Multi-User Ready**: Optional server integration for team collaboration
- **🎨 Modern UI**: Beautiful gradient design with smooth animations

## 🛠️ Tech Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icons
- **PapaParse** - CSV parsing library

## 📁 Project Structure

```
src/
├── components/
│   └── UPCDashboard.tsx    # Main dashboard component
├── utils/
│   ├── apiService.ts       # Server communication
│   └── csvUtils.ts         # CSV processing utilities
├── types/
│   └── product.ts          # TypeScript interfaces
└── App.tsx                 # Root component
```

## 🚀 Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `npm install -g vercel`
2. Deploy: `vercel`
3. Your app will be live at a Vercel URL

### Other Platforms

- **Netlify**: Connect your GitHub repo
- **GitHub Pages**: Use the `gh-pages` branch
- **Any static hosting**: Build with `npm run build`

## 🔧 Configuration

### Environment Variables

- `VITE_API_URL`: Server URL for multi-user features (optional)

### Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## 📊 Usage

1. **Enter Password**: Use the password "grip6upc" to access the dashboard
2. **Load CSV**: Import your Shopify product export
3. **Filter Products**: Use filters to find specific products
4. **Edit UPCs**: Click the edit icon next to any UPC to modify it
5. **Export Data**: Click "Export CSV" to download updated data

## 🎯 Key Features

### Smart Filtering

- Automatically excludes products with "copy" in the handle (test products)
- Filters out products without SKUs
- Search by title, handle, or SKU
- Filter to show only missing UPCs

### UPC Management

- Inline editing with validation
- Clear visual indicators for missing vs. present UPCs
- Bulk export with all changes

### Multi-User Support

- Optional server integration
- Real-time sync across users
- Conflict resolution
- Offline capability

## 🐛 Troubleshooting

### Blank Dashboard

- Check browser console for errors
- Clear browser cache
- Verify all dependencies are installed

### Build Issues

- Run `npm install` to ensure all dependencies
- Check TypeScript: `npx tsc --noEmit`
- Verify linting: `npm run lint`

### Deployment Issues

- Check Vercel logs
- Verify build command works locally
- Ensure all files are committed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own needs.

## 🆘 Support

For issues or questions:

1. Check the browser console for errors
2. Review the deployment logs
3. Test locally before deploying
4. Check the troubleshooting section above
