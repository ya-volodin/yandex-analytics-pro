# 📦 Component Library

## Completed Components

### DashboardPro.tsx
Main dashboard container with layout management.

**Props**: None (uses stores)

**Features**:
- Auto-loads theme and dashboard state
- Generates alerts from campaigns
- 5-minute auto-refresh
- Header with controls
- Filter panel
- Metrics grid

**Example**:
```tsx
<DashboardPro />
```

---

### MetricsGrid.tsx
Displays 12+ KPI cards in responsive grid.

**Props**:
```typescript
interface MetricsGridProps {
  metrics: Metrics
  campaigns: Campaign[]
}
```

**Shows**:
- Impressions, Clicks, CTR
- CPC, CPM, Cost
- Conversions, Conversion Rate, CPA
- ROAS, Conv Value, Budget Spent

**Example**:
```tsx
<MetricsGrid metrics={metrics} campaigns={campaigns} />
```

---

### FilterPanel.tsx
Date range and status filters with presets.

**Props**: None (uses stores)

**Features**:
- Date picker (from/to)
- Status filter (active, paused, ended)
- Reset button
- Preset saving/loading

**Example**:
```tsx
<FilterPanel />
```

---

### AlertsPanel.tsx
Displays alerts with severity colors.

**Props**:
```typescript
interface AlertsPanelProps {
  alerts: Alert[]
  onDismiss?: (alertId: string) => void
}
```

**Features**:
- Color-coded by severity
- Dismissible alerts
- Icons for different types
- Multiple alerts stacked

**Example**:
```tsx
<AlertsPanel alerts={alerts} onDismiss={handleDismiss} />
```

---

### ThemeToggle.tsx
Dark/light mode toggle button.

**Props**: None (uses store)

**Features**:
- Sun/moon icon
- Saves to localStorage
- Applies to document class

**Example**:
```tsx
<ThemeToggle />
```

---

## To Be Implemented Components

### CampaignComparator.tsx
Head-to-head campaign comparison.

**Planned Props**:
```typescript
interface CampaignComparatorProps {
  campaigns: Campaign[]
  onSelect?: (id: string) => void
}
```

**Features**:
- Select 2-5 campaigns
- Compare all metrics
- Ranking by metric
- Anomaly detection
- AI recommendations

---

### AdPerformance.tsx
A/B test matrix with statistical significance.

**Planned Props**:
```typescript
interface AdPerformanceProps {
  campaignId: string
  dateFrom: Date
  dateTo: Date
}
```

**Features**:
- Performance matrix
- Statistical significance (p-value)
- Copy analysis
- Creative performance
- Winner selection

---

### KeywordAnalyzer.tsx
Detailed keyword performance table.

**Planned Props**:
```typescript
interface KeywordAnalyzerProps {
  campaignId?: string
  keywords: Keyword[]
}
```

**Features**:
- Sortable table
- 1000+ keywords support
- Bidding recommendations
- Quality score display
- Negative keyword suggestions

---

### HeatmapChart.tsx
Nivo heatmap for performance patterns.

**Planned Props**:
```typescript
interface HeatmapChartProps {
  data: any[]
  xAxis: string
  yAxis: string
  value: string
  colorBy?: 'value' | 'ctr' | 'cost'
}
```

**Example**: Hours (X) vs Days (Y), colored by CTR

---

### TreemapChart.tsx
Nivo treemap for budget visualization.

**Planned Props**:
```typescript
interface TreemapChartProps {
  data: Campaign[]
  sizeBy: 'cost' | 'conversions'
  colorBy: 'roas' | 'ctr'
}
```

**Example**: Each rectangle = campaign, size = cost, color = ROAS

---

### WaterfallChart.tsx
Waterfall chart showing conversion flow.

**Planned Props**:
```typescript
interface WaterfallChartProps {
  data: {
    stage: string
    value: number
  }[]
}
```

**Shows**: Impressions → Clicks → Conversions (loss at each stage)

---

### SankeyDiagram.tsx
User journey visualization.

**Planned Props**:
```typescript
interface SankeyDiagramProps {
  data: {
    source: string
    target: string
    value: number
  }[]
}
```

**Shows**: Traffic flow through different stages

---

### PeriodComparison.tsx
Week/Month/Year comparison with forecast.

**Planned Props**:
```typescript
interface PeriodComparisonProps {
  metric: string
  period: 'week' | 'month' | 'year'
}
```

**Features**:
- Side-by-side metrics
- Percentage change
- Forecast for next period
- Recommendations

---

### ExportManager.tsx
Export data in multiple formats.

**Planned Props**:
```typescript
interface ExportManagerProps {
  data: any[]
  columns: string[]
}
```

**Formats**:
- CSV (Excel compatible)
- Excel (.xlsx)
- PDF (formatted)
- Google Sheets (direct upload)

---

### ForecastingChart.tsx
Visual forecast with confidence intervals.

**Planned Props**:
```typescript
interface ForecastingChartProps {
  forecast: Forecast
  metric: string
}
```

**Shows**:
- Historical data
- Forecast line
- Confidence intervals (95%)
- Trend direction

---

### CustomizableDashboard.tsx
Widget customization interface.

**Features**:
- Drag & drop widgets
- Resize widgets
- Hide/show widgets
- Save layouts
- Preset layouts (Manager, Analyst, Specialist)

---

## Chart Components (Detailed)

### Using Recharts (Simple Charts)

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

<LineChart data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="conversions" stroke="#00cc00" />
</LineChart>
```

### Using Nivo (Advanced Charts)

```tsx
import { HeatMap } from '@nivo/heatmap'

<HeatMap
  data={data}
  keys={keys}
  margin={{ top: 100, right: 100, bottom: 100, left: 100 }}
  forceSquare={true}
  colors="blues"
/>
```

---

## Common Patterns

### Loading State
```tsx
if (loading) {
  return <div className="spinner">Loading...</div>
}
```

### Error State
```tsx
if (error) {
  return <div className="alert alert-danger">{error}</div>
}
```

### Empty State
```tsx
if (!data || data.length === 0) {
  return <div className="text-center py-8">No data available</div>
}
```

### Card Layout
```tsx
<div className="card">
  <h3 className="font-semibold mb-4">Title</h3>
  {/* Content */}
</div>
```

---

## Component Tree

```
App
└─ DashboardPro
   ├─ Header
   │  ├─ Logo
   │  ├─ Refresh Button
   │  ├─ ThemeToggle ✅
   │  └─ Menu
   ├─ FilterPanel ✅
   │  └─ Filters
   ├─ AlertsPanel ✅
   │  └─ Alert[] (multiple)
   └─ MainContent
      ├─ MetricsGrid ✅
      │  └─ MetricCard[] (12+)
      ├─ CampaignComparator 🚧
      │  └─ ComparisonCard[]
      ├─ KeywordAnalyzer 🚧
      │  └─ KeywordTable
      ├─ AdPerformance 🚧
      │  └─ AdMatrix
      ├─ PeriodComparison 🚧
      │  └─ ComparisonChart
      ├─ Charts 🚧
      │  ├─ HeatmapChart
      │  ├─ TreemapChart
      │  ├─ WaterfallChart
      │  ├─ SankeyDiagram
      │  └─ GaugeChart
      ├─ ForecastingChart 🚧
      │  └─ ForecastLine
      └─ ExportManager 🚧
         └─ ExportForm

Legend:
✅ Completed
🚧 In Progress
⚪ To Be Built
```

---

## Props Drilling Strategy

To avoid prop drilling, use Zustand stores:

```typescript
// ❌ Don't do this:
<Component 
  campaigns={campaigns}
  metrics={metrics}
  filters={filters}
  onFilter={onFilter}
  // ... more props
/>

// ✅ Do this:
const campaigns = useCampaignStore((s) => s.campaigns)
const filters = useFilterStore((s) => s.filters)
const setFilters = useFilterStore((s) => s.setFilters)
```

---

## Styling Guidelines

### Use Tailwind Classes
```tsx
<div className="bg-white dark:bg-slate-900 rounded-lg shadow-card p-4">
  {/* content */}
</div>
```

### Use CSS Classes for Complex Styles
```tsx
<div className="card">
  {/* Use predefined .card class */}
</div>
```

### Dark Mode Support
```tsx
// Always add dark: prefix for dark mode
<h1 className="text-gray-900 dark:text-white">Title</h1>
```

---

## Testing Components

```typescript
import { render, screen } from '@testing-library/react'
import MetricsGrid from './MetricsGrid'

describe('MetricsGrid', () => {
  it('renders all metrics', () => {
    const metrics = { /* mock metrics */ }
    render(<MetricsGrid metrics={metrics} campaigns={[]} />)
    expect(screen.getByText('Impressions')).toBeInTheDocument()
  })
})
```

---

## Performance Tips

1. **Memoize expensive components**:
   ```typescript
   export default React.memo(MetricsGrid)
   ```

2. **Use useCallback for event handlers**:
   ```typescript
   const handleClick = useCallback(() => { /* ... */ }, [])
   ```

3. **Split large charts into separate components**
4. **Use React.lazy() for chart components**:
   ```typescript
   const HeatmapChart = lazy(() => import('./Charts/HeatmapChart'))
   ```

---

**See README.md for general architecture overview.**
