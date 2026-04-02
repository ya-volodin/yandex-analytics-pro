# 🏗️ System Architecture

## Layers

```
┌─────────────────────────────────┐
│   Components (React)            │
│   - Pages, Widgets, Charts      │
├─────────────────────────────────┤
│   Hooks (Custom)                │
│   - useMetrics, useCampaigns   │
├─────────────────────────────────┤
│   Store (Zustand)               │
│   - Dashboard, Filter, Theme    │
├─────────────────────────────────┤
│   Services (Business Logic)     │
│   - API, Analytics, Export      │
├─────────────────────────────────┤
│   Types (TypeScript)            │
│   - Metrics, Campaign, Alert    │
├─────────────────────────────────┤
│   Utils (Helpers)               │
│   - Format, Colors, Calc        │
├─────────────────────────────────┤
│   External APIs                 │
│   - Yandex.Direct, Google       │
└─────────────────────────────────┘
```

## Data Flow

```
User Action
    ↓
Component (DashboardPro.tsx)
    ↓
Hook (useMetrics)
    ↓
Service (yandex-api.service, metrics.service)
    ↓
Store (Dashboard, Filter stores)
    ↓
Re-render Component
    ↓
Display Updated UI
```

## Component Hierarchy

```
App
└─ DashboardPro
   ├─ Header
   │  ├─ Logo
   │  ├─ Refresh Button
   │  ├─ ThemeToggle
   │  └─ Menu
   ├─ FilterPanel
   │  ├─ DateRange
   │  ├─ StatusFilter
   │  └─ Reset
   ├─ AlertsPanel
   │  └─ Alert[] (multiple)
   └─ MainContent
      ├─ MetricsGrid (20+ cards)
      │  └─ MetricCard[] (12+)
      ├─ CampaignComparator
      ├─ KeywordAnalyzer
      ├─ Charts
      │  ├─ HeatmapChart
      │  ├─ TreemapChart
      │  ├─ WaterfallChart
      │  ├─ SankeyDiagram
      │  └─ GaugeChart
      └─ ExportManager
```

## Service Architecture

```
yandex-api.service
├─ getCampaigns()
├─ getAds()
├─ getKeywords()
├─ getSearchTerms()
└─ getCampaignStats()
    ↓
    Uses: cache.service

metrics.service
├─ calculateMetrics()
├─ calculateTrend()
├─ compareMetrics()
└─ detectAnomaly()

comparison.service
├─ comparePeriods()
├─ compareCampaigns()
└─ segmentComparison()
    ↓
    Uses: metrics.service, forecast.service

forecast.service
├─ generateForecast()
├─ generateQuickForecasts()
└─ analyzeTrend()

anomaly-detection.service
├─ detectMetricAnomalies()
├─ generateAlerts()
├─ detectPerformanceDegradation()
└─ detectBudgetIssues()

export.service
├─ exportToCSV()
├─ exportToExcel()
├─ exportToPDF()
├─ exportToGoogleSheets()
└─ generateReport()

analytics.service
├─ calculateEfficiency()
├─ getTopPerformers()
├─ calculateCampaignHealth()
├─ calculateOptimizationPotential()
└─ getInsights()

cache.service
├─ set()
├─ get()
├─ clear()
└─ keys()
```

## State Management

```
DashboardStore (Zustand)
├─ layouts: DashboardLayout[]
├─ activeLayoutId: string
├─ widgets: Widget[]
├─ autoRefreshInterval: number
└─ Actions
   ├─ addLayout(), updateLayout(), deleteLayout()
   ├─ addWidget(), removeWidget(), updateWidget()
   └─ saveToLocalStorage(), loadFromLocalStorage()

FilterStore (Zustand)
├─ dateFrom: Date
├─ dateTo: Date
├─ selectedCampaigns: string[]
├─ selectedStatuses: string[]
├─ budgetRange, ctrRange, roiRange, etc.
└─ Actions
   ├─ setDateRange(), setSelectedCampaigns()
   ├─ savePreset(), loadPreset()
   └─ reset()

ThemeStore (Zustand)
├─ theme: 'dark' | 'light'
└─ Actions
   ├─ setTheme(), toggleTheme()
   └─ loadFromLocalStorage(), saveToLocalStorage()
```

## Data Flow Example: Load Dashboard

```
1. App Component Mounts
   ↓
2. Load Theme from localStorage
   (useThemeStore.loadFromLocalStorage())
   ↓
3. Load Dashboard State from localStorage
   (useDashboardStore.loadFromLocalStorage())
   ↓
4. Load Filters from localStorage
   (useFilterStore, with default last 30 days)
   ↓
5. Load Campaigns
   useHook: useCampaigns(dateFrom, dateTo)
   ↓
   Service: yandexApiService.getCampaigns()
   ↓
   API: Yandex.Direct API call
   ↓
   Cache: Store result for 5 minutes
   ↓
6. Load Metrics
   useHook: useMetrics(dateFrom, dateTo)
   ↓
   Service: metricsService.calculateMetrics()
   ↓
7. Generate Alerts
   Service: anomalyDetectionService.generateAlerts()
   ↓
8. Render Dashboard
   Display: MetricsGrid, Campaigns, Widgets
   ↓
9. Auto-Refresh
   Repeat steps 5-7 every 5 minutes
```

## Performance Optimizations

1. **Caching** - 5-minute TTL
2. **Memoization** - React.memo on expensive components
3. **Code Splitting** - Charts loaded on-demand
4. **Query Caching** - React Query handles deduplication
5. **Lazy Loading** - Routes lazy-loaded with React.lazy()
6. **CSS-in-JS** - Tailwind purges unused styles in production

## Error Handling

```
API Error
  ↓
Service catches error
  ↓
Returns error message
  ↓
Hook sets error state
  ↓
Component displays error UI
  ↓
User can retry
```

## Authentication Flow

```
User Login
  ↓
Request OAuth from Yandex
  ↓
Get Access Token + Client Login
  ↓
Store in sessionStorage (temporary)
  ↓
Pass to yandexApiService.setCredentials()
  ↓
All API calls include Auth headers
  ↓
Token expires? → Refresh token
```

## Type Safety

All data flows through TypeScript interfaces:

```typescript
// Request
{
  dateFrom: Date
  dateTo: Date
  campaignIds?: string[]
}

// Response
{
  campaigns: Campaign[]
  metrics: Metrics
  timestamp: Date
}

// State
{
  data: Campaign[]
  loading: boolean
  error: string | null
}
```

## Browser Storage

```
localStorage
├─ theme (dark|light)
├─ dashboardState
│  ├─ layouts
│  ├─ activeLayoutId
│  └─ widgets
├─ filterState
│  ├─ dateFrom, dateTo
│  ├─ selectedCampaigns
│  └─ filters...
└─ filterPresets
   ├─ preset_manager
   ├─ preset_analyst
   └─ preset_custom

sessionStorage
├─ accessToken (temporary)
└─ clientLogin (temporary)
```

## API Integration Points

```
Yandex.Direct API
├─ GET /campaigns
├─ GET /adgroups
├─ GET /ads
├─ GET /keywords
├─ GET /reports
├─ POST /changes
└─ Rate limit: 10k calls/day

Google Sheets API
├─ Append values
├─ Update cells
└─ Read sheets

Optional: Slack, Email services
```

---

See `COMPONENTS.md` for detailed component architecture.
