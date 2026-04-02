# 📚 Documentation Index

Welcome to **Yandex.Direct Analytics Pro** - Enterprise analytics dashboard

## 🚀 Getting Started

1. **[START_HERE.md](./START_HERE.md)** ⭐ START HERE
   - 5-minute setup
   - Project structure
   - Key components overview
   - Common tasks
   - Troubleshooting

## 📖 Core Documentation

2. **[ARCHITECTURE.md](./ARCHITECTURE.md)**
   - System layers
   - Data flow
   - Component hierarchy
   - Service architecture
   - State management
   - Performance optimizations

3. **[COMPONENTS.md](./COMPONENTS.md)**
   - Completed components (5)
   - To-be-built components (10+)
   - Chart components
   - Component patterns
   - Component tree
   - Testing & performance tips

4. **[SERVICES.md](./SERVICES.md)**
   - All 8 services documented
   - Method signatures
   - Usage examples
   - Complete workflows
   - Error handling

5. **[DEPLOYMENT.md](./DEPLOYMENT.md)**
   - Production build
   - Hosting options (Vercel, Netlify, AWS, Docker)
   - Environment setup
   - Performance optimization
   - Security checklist
   - Monitoring & maintenance
   - Troubleshooting

## 📋 Quick Reference

### Services (8)
- **yandex-api.service** - Yandex.Direct API
- **metrics.service** - Calculate 20+ metrics
- **comparison.service** - Compare periods/campaigns
- **forecast.service** - ML-based forecasting
- **anomaly-detection.service** - Alert generation
- **export.service** - CSV/PDF/Excel/Google Sheets
- **analytics.service** - Business logic
- **cache.service** - Data caching with TTL

### Components (Built)
- **DashboardPro** - Main dashboard
- **MetricsGrid** - 20+ KPI cards
- **FilterPanel** - Date & status filters
- **AlertsPanel** - Alert display
- **ThemeToggle** - Dark/light mode

### Hooks (5)
- **useMetrics** - Load metrics
- **useCampaigns** - Load campaigns
- **useComparison** - Compare periods
- **useExport** - Export data
- **useForecast** - Generate forecasts

### Stores (Zustand)
- **dashboardStore** - Widget layouts
- **filterStore** - Date ranges & filters
- **themeStore** - Dark/light mode

### Utilities
- **formatting.ts** - Currency, date, percent
- **calculations.ts** - ROI, LTV, CAC, growth
- **colors.ts** - Theme colors & helpers

## 🎯 Features

### Dashboard
- 📊 20+ metrics in responsive grid
- 🎯 Campaign comparison (head-to-head)
- 🔍 Keyword analysis (1000+ keywords)
- 📈 Advanced visualizations (heatmaps, treemaps, waterfalls)
- 🤖 ML-based forecasting (7-14 days)
- 🚨 Anomaly detection (auto alerts)
- 📤 Export (CSV, PDF, Excel, Google Sheets)
- 🌙 Dark/light mode
- ⚡ Real-time updates (5-min refresh)
- 🎛️ Customizable dashboard (drag, resize)

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Simple charts
- **Nivo** - Advanced charts
- **React Query** - Data fetching
- **Zustand** - State management
- **Vite** - Build tool
- **ESLint + Prettier** - Code quality

## 📊 Project Status

**Phase**: Core foundation complete ✅

**Completed**:
- ✅ All types & interfaces
- ✅ All 8 services
- ✅ All 5 custom hooks
- ✅ All 3 stores
- ✅ Utilities & helpers
- ✅ Core components (5)
- ✅ Comprehensive documentation

**To Build**:
- 🚧 Advanced components (10+)
- 🚧 Chart components (5)
- 🚧 Pages & routing
- 🚧 E2E tests

**Estimated time to completion**: 5-7 days

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
# Open http://localhost:5173
```

### Production Build
```bash
npm run build
npm run preview
```

### Connect Yandex API
Edit `src/services/yandex-api.service.ts`:
```typescript
yandexApiService.setCredentials(accessToken, clientLogin)
```

## 📁 Project Structure

```
yandex_analytics_pro/
├── src/
│   ├── components/           # React components
│   ├── services/             # Business logic (8 services)
│   ├── hooks/                # Custom hooks (5)
│   ├── types/                # TypeScript types (10+)
│   ├── store/                # Zustand stores (3)
│   ├── utils/                # Utilities
│   ├── styles/               # CSS & theme
│   ├── App.tsx               # Main app
│   └── main.tsx              # Entry point
├── docs/                     # Documentation
├── index.html                # HTML template
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config
├── tailwind.config.js        # Tailwind config
└── README.md                 # Project overview
```

## 💡 Key Concepts

### Metrics (20+)
**Core**: Impressions, Clicks, CTR, CPC, CPM
**Conversion**: Conversions, Rate, CPA, Value, ROAS
**Quality**: Quality Score, Avg Position, Share %
**Budget**: Cost, Spent, Remaining, Utilization

### Alerts
- CTR drops
- Cost spikes
- Quality score drops
- Budget warnings
- Performance degradation
- Anomalies

### Forecasting
- 7-14 day predictions
- Confidence intervals (95%)
- Trend analysis
- Seasonality adjustments

### Comparisons
- Period vs Period (Week/Month/Year)
- Campaign vs Campaign (2-5 way)
- Segment analysis (device, day, hour, geo)

## 🔗 Related Resources

- **Yandex.Direct API**: https://api.direct.yandex.com
- **React Docs**: https://react.dev
- **TypeScript Docs**: https://www.typescriptlang.org
- **Tailwind CSS**: https://tailwindcss.com
- **Recharts**: https://recharts.org
- **Nivo**: https://nivo.rocks
- **Zustand**: https://zustand-demo.vercel.app
- **React Query**: https://tanstack.com/query

## ❓ FAQ

**Q: Is this production-ready?**
A: Core foundation is production-ready. Advanced components need implementation.

**Q: How to connect to Yandex.Direct API?**
A: See START_HERE.md, step 3. Register at api.direct.yandex.com

**Q: Can I customize the dashboard?**
A: Yes! Fully customizable components, theme, and layout.

**Q: How to add new metrics?**
A: See COMPONENTS.md, "Add a new metric" section.

**Q: Is there a demo?**
A: Project uses mock data by default. Connect your API for real data.

## 📞 Support

- **Documentation**: See docs/ folder
- **Issues**: Check GitHub issues
- **Email**: support@example.com

## 📄 License

MIT License - see LICENSE.md

## 🎯 Roadmap

- [ ] Advanced chart components
- [ ] Campaign management pages
- [ ] Keyword analysis page
- [ ] Custom report builder
- [ ] Email report scheduling
- [ ] Slack integration
- [ ] Mobile native apps
- [ ] Advanced ML predictions

---

**Version**: 1.0.0
**Last Updated**: 2024
**Status**: ✅ Ready to Use

**Start building!** 🚀
