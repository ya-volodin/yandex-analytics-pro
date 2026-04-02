# 🚀 START HERE

Welcome to **Yandex.Direct Analytics Pro** - Enterprise-level PPC analytics dashboard!

## What is this?

This is a production-ready React dashboard for analyzing Yandex.Direct campaigns. Think **Google Analytics Pro** or **Semrush** - but specifically for Russian PPC advertising.

**Key features:**
- 📊 20+ metrics dashboard
- 🎯 Campaign comparison
- 🔍 Keyword analysis
- 📈 Advanced forecasting
- 🚨 Anomaly detection
- 📤 Export to CSV/PDF/Google Sheets
- 🌙 Dark/light mode
- 📱 Fully responsive

## 5-Minute Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```

Open http://localhost:5173

### 3. Connect Yandex.Direct API

Edit `src/services/yandex-api.service.ts`:

```typescript
yandexApiService.setCredentials(
  'your_access_token',
  'your_client_login'
)
```

Get tokens from [api.direct.yandex.com](https://api.direct.yandex.com)

## Project Structure

```
src/
├── components/       # React components (20+)
├── services/        # Business logic (8+)
├── hooks/           # Custom hooks (5+)
├── types/           # TypeScript types
├── store/           # Zustand stores
├── utils/           # Utilities
├── styles/          # CSS
└── App.tsx          # Main app
```

## Key Components to Know

### DashboardPro.tsx
Main dashboard - Entry point, widget management

### MetricsGrid.tsx
Shows 20+ KPI cards (Impressions, Clicks, CTR, CPC, etc)

### CampaignComparator.tsx
Compare 2-5 campaigns head-to-head

### KeywordAnalyzer.tsx
Detailed keyword performance table with 1000+ keywords

### Charts/
Advanced visualizations:
- HeatmapChart - Performance heatmap
- TreemapChart - Budget visualization
- WaterfallChart - Conversion flow
- SankeyDiagram - User journey

## Key Services

### yandex-api.service
```typescript
// Get campaigns
const campaigns = await yandexApiService.getCampaigns(dateFrom, dateTo)

// Get search terms
const terms = await yandexApiService.getSearchTerms(campaignId, dateFrom, dateTo)
```

### metrics.service
```typescript
// Calculate metrics
const metrics = metricsService.calculateMetrics(rawData)

// Detect trends
const trend = metricsService.calculateTrend(metric, values, dates)

// Compare periods
const comparison = metricsService.compareMetrics(current, previous)
```

### forecast.service
```typescript
// Generate forecast
const forecast = forecastService.generateForecast(config, values, dates)

// Quick forecasts
const forecasts = forecastService.generateQuickForecasts(metrics)
```

### anomaly-detection.service
```typescript
// Detect anomalies
const anomaly = anomalyDetectionService.detectMetricAnomalies(values)

// Generate alerts
const alerts = anomalyDetectionService.generateAlerts(anomalies)
```

## Common Tasks

### Add a new metric
1. Update `src/types/Metrics.ts`
2. Update `metrics.service.ts` calculation
3. Add to `MetricsGrid.tsx` display

### Create a new chart
1. Create `src/components/Charts/MyChart.tsx`
2. Use Recharts or Nivo
3. Import and add to dashboard

### Add a filter
1. Update `src/store/filterStore.ts`
2. Add UI in `FilterPanel.tsx`
3. Update queries to use filter

### Export data
```typescript
const result = await exportService.exportToCSV(data, columns)
const result = await exportService.exportToExcel(data, columns)
const result = await exportService.exportToPDF(html)
```

## Styling

### Theme Colors
- Primary: `#0066ff` (blue)
- Success: `#00cc00` (green)
- Warning: `#ff9900` (orange)
- Danger: `#ff3333` (red)

### CSS Classes
```html
<!-- Cards -->
<div class="card">...</div>
<div class="card-lg">...</div>

<!-- Buttons -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-danger">Danger</button>

<!-- Inputs -->
<input class="input" type="text" />

<!-- Tables -->
<table class="table">...</table>

<!-- Alerts -->
<div class="alert alert-info">...</div>
<div class="alert alert-warning">...</div>
<div class="alert alert-danger">...</div>
```

## State Management (Zustand)

```typescript
// Dashboard state
import { useDashboardStore } from '@/store/dashboardStore'
const { widgets, addWidget, removeWidget } = useDashboardStore()

// Filters
import { useFilterStore } from '@/store/filterStore'
const { dateFrom, dateTo, setDateRange } = useFilterStore()

// Theme
import { useThemeStore } from '@/store/themeStore'
const { theme, toggleTheme } = useThemeStore()
```

## Hooks

```typescript
// Load metrics
const { metrics, loading } = useMetrics(dateFrom, dateTo)

// Load campaigns
const { campaigns, loading } = useCampaigns(dateFrom, dateTo)

// Compare periods
const { comparePeriods } = useComparison()

// Generate forecast
const { generateForecast } = useForecast()

// Export data
const { exportData } = useExport()
```

## Performance Tips

1. **Caching** - Data cached for 5 minutes by default
2. **Auto-refresh** - Dashboard refreshes every 5 minutes
3. **Lazy loading** - Charts load on demand
4. **Code splitting** - Large charts are code-split
5. **Query optimization** - Use React Query for caching

## Next Steps

1. **Read** `ARCHITECTURE.md` - System design
2. **Explore** `COMPONENTS.md` - Component reference
3. **Check** `SERVICES.md` - Service layer
4. **Deploy** `DEPLOYMENT.md` - Production setup

## Troubleshooting

### API not working?
- Check Yandex token is valid
- Verify client login
- Check API quotas

### Charts not showing?
- Ensure data exists
- Check browser console for errors
- Verify date range

### Dark mode not working?
- Run `useThemeStore().loadFromLocalStorage()`
- Check localStorage theme value

## Getting Help

- 📚 Read the docs in `/docs`
- 🔍 Search codebase (Ctrl+Shift+F)
- 💬 Check GitHub issues
- 📧 Contact support

---

**Ready to dive in?** Start with the dashboard:

```bash
npm run dev
# Open http://localhost:5173
```

Good luck! 🚀
