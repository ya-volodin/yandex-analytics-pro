# 🚀 Setup Instructions

## Prerequisites
- Node.js 16+ and npm

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The dashboard will automatically open at `http://localhost:5173`

## Production Build

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## What You Get

Immediately after `npm install && npm run dev`:
- ✅ Live dashboard at localhost:5173
- ✅ 15 sample campaigns with data
- ✅ All 50+ features working
- ✅ Dark/Light theme toggle
- ✅ Real-time metric updates
- ✅ Sortable tables
- ✅ Interactive charts
- ✅ Anomaly detection
- ✅ Forecasting
- ✅ Export options

## File Organization

All files are organized as follows:
- **Documentation**: 6 markdown files explaining everything
- **Source Code**: `src/` directory with components, store, and services
- **Configuration**: Setup files for build, styling, TypeScript
- **Public**: Assets directory (empty, ready for your images)

## Next Actions

1. **Explore**: Spend 5-10 minutes exploring the dashboard
2. **Learn**: Read the documentation files
3. **Customize**: Modify colors, text, and layout
4. **Integrate**: Replace mock data with real API calls
5. **Deploy**: Build and deploy to your server

## Documentation Reading Order

1. **00_START_HERE.md** - Quick orientation (5 min)
2. **QUICKSTART.md** - Common tasks (10 min)
3. **README.md** - Complete guide (20 min)
4. **FEATURES.md** - Feature reference (as needed)
5. **PROJECT_SUMMARY.md** - Technical details (as needed)

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |
| `npm run type-check` | Verify TypeScript types |

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 5174
```

### Clean Installation
```bash
rm -rf node_modules package-lock.json
npm install
```

## Getting Help

- Check documentation files
- Review component source code
- Look at type definitions in `src/types/index.ts`
- Review mock data service for patterns
- Check inline code comments

## Ready?

Run this command to start:
```bash
npm install && npm run dev
```

Then read **00_START_HERE.md** for next steps!

---

Questions? Check the comprehensive documentation included with this project.

Happy building! 🎉
