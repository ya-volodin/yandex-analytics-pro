# 🔧 Services Documentation

## Service Layer Architecture

Services contain business logic and API integration. They're independent of React.

```
Services (Pure JavaScript/TypeScript)
├─ yandex-api.service.ts
├─ metrics.service.ts
├─ comparison.service.ts
├─ forecast.service.ts
├─ anomaly-detection.service.ts
├─ export.service.ts
├─ analytics.service.ts
└─ cache.service.ts
```

---

## yandex-api.service.ts

API integration with Yandex.Direct

### Methods

#### `setCredentials(accessToken, clientLogin)`
```typescript
yandexApiService.setCredentials(
  'your_access_token',
  'your_client_login'
)
```

#### `getCampaigns(dateFrom, dateTo): Promise<Campaign[]>`
```typescript
const campaigns = await yandexApiService.getCampaigns(
  new Date('2024-01-01'),
  new Date('2024-01-31')
)
// Returns: Campaign[] with metrics
```

#### `getAds(campaignId): Promise<Ad[]>`
```typescript
const ads = await yandexApiService.getAds('campaign_123')
// Returns: Ad[] with performance data
```

#### `getKeywords(campaignId): Promise<Keyword[]>`
```typescript
const keywords = await yandexApiService.getKeywords('campaign_123')
// Returns: Keyword[] with bids and quality scores
```

#### `getSearchTerms(campaignId, dateFrom, dateTo): Promise<SearchTerm[]>`
```typescript
const terms = await yandexApiService.getSearchTerms(
  'campaign_123',
  new Date('2024-01-01'),
  new Date('2024-01-31')
)
// Returns: SearchTerm[] with user search queries
```

### Caching

All API calls are cached for 5 minutes using cache.service:

```typescript
// First call: API
const campaigns = await yandexApiService.getCampaigns(from, to)

// Second call (within 5 min): Cache
const cached = await yandexApiService.getCampaigns(from, to) // instant!
```

---

## metrics.service.ts

Calculate metrics from raw data

### Methods

#### `calculateMetrics(rawData): Metrics`
```typescript
const metrics = metricsService.calculateMetrics({
  impressions: 10000,
  clicks: 500,
  cost: 1000,
  conversions: 25,
  conversionValue: 5000,
  qualityScore: 8,
  // ... more fields
})
// Returns: Full Metrics object with all 20+ metrics calculated
```

#### `calculateTrend(metric, values, dates): MetricsTrend`
```typescript
const trend = metricsService.calculateTrend(
  'ctr',
  [1.5, 1.6, 1.7, 1.65, 1.7, 1.8, 1.75],
  dates
)
// Returns: {
//   metric: 'ctr',
//   values: [1.5, 1.6, ...],
//   trend: 'up',
//   changePercent: 16.67
// }
```

#### `compareMetrics(current, previous): MetricComparison[]`
```typescript
const comparisons = metricsService.compareMetrics(
  currentMetrics,
  previousMetrics
)
// Returns: Array of metric changes with percent differences
```

#### `detectAnomaly(values, threshold): AnomalyDetection`
```typescript
const anomaly = metricsService.detectAnomaly(
  [100, 105, 102, 101, 99, 500], // Last value is spike!
  2 // 2 standard deviations
)
// Returns: {
//   isAnomaly: true,
//   score: 0.95,
//   expectedRange: [99, 105]
// }
```

---

## comparison.service.ts

Compare periods and campaigns

### Methods

#### `comparePeriods(currentMetrics, currentStart, currentEnd, previousMetrics, previousStart, previousEnd): PeriodComparison`
```typescript
const comparison = comparisonService.comparePeriods(
  currentMetrics,
  new Date('2024-01-15'),
  new Date('2024-01-31'),
  previousMetrics,
  new Date('2024-01-01'),
  new Date('2024-01-14')
)
// Returns: {
//   currentPeriod: { metrics, dates },
//   previousPeriod: { metrics, dates },
//   changes: [{ metric, current, previous, change, changePercent }],
//   forecast: [...],
//   recommendations: ["Increase CTR by..."],
//   anomalies: ["CTR dropped 20%"]
// }
```

#### `compareCampaigns(campaigns): CampaignComparison`
```typescript
const comparison = comparisonService.compareCampaigns(campaigns)
// Returns: {
//   campaigns: [...],
//   rankings: [{ metric: 'roas', order: [...] }],
//   anomalies: [{ campaignId, message, severity }],
//   recommendations: [{ campaignId, action, expectedImpact }]
// }
```

#### `segmentComparison(data, segmentBy): SegmentedComparison`
```typescript
const comparison = comparisonService.segmentComparison(
  data,
  'device' // or 'dayOfWeek', 'hour', 'geography'
)
// Returns: {
//   segment: 'device',
//   data: [{ label: 'desktop', metrics: {...} }],
//   topPerformer: 'desktop',
//   topPerformerMetric: 3.5
// }
```

---

## forecast.service.ts

ML-based forecasting

### Methods

#### `generateForecast(config, values, dates): Forecast`
```typescript
const forecast = forecastService.generateForecast(
  {
    metric: 'conversions',
    daysAhead: 14,
    includeSeasonality: true,
    baselineMode: 'trend'
  },
  [10, 12, 11, 13, 14, 15, 16],
  dates
)
// Returns: {
//   metric: 'conversions',
//   period: 'month',
//   projections: [
//     { date, value, lowerBound, upperBound, confidence }
//   ],
//   trend: 'increasing',
//   seasonalityFactor: 1.1,
//   confidence: 0.85
// }
```

#### `generateQuickForecasts(metrics): Array`
```typescript
const forecasts = forecastService.generateQuickForecasts(metrics)
// Returns: Quick 7 & 14-day forecasts for main metrics
// [
//   { metric: 'impressions', projected7Days: 50000, projected14Days: 100000 },
//   { metric: 'conversions', projected7Days: 125, projected14Days: 250 },
//   ...
// ]
```

#### `analyzeTrend(values): TrendAnalysis`
```typescript
const trend = forecastService.analyzeTrend(values)
// Returns: {
//   trendType: 'uptrend' | 'downtrend' | 'no_trend',
//   trendStrength: 0.75,
//   momentum: 50,
//   volatility: 5.2,
//   movingAverage: [...]
// }
```

---

## anomaly-detection.service.ts

Automatic alert generation

### Methods

#### `detectMetricAnomalies(values, threshold): AnomalyDetection`
```typescript
const anomaly = anomalyDetectionService.detectMetricAnomalies(values, 2)
// Returns: {
//   isAnomaly: true,
//   anomalyScore: 0.85,
//   expectedRange: [100, 110],
//   actualValue: 250,
//   explanation: "Critical deviation..."
// }
```

#### `generateAlerts(anomalies, context): Alert[]`
```typescript
const alerts = anomalyDetectionService.generateAlerts(anomalies, {
  campaignId: 'camp_123'
})
// Returns: Alert objects ready to display
```

#### `detectPerformanceDegradation(currentMetrics, historicalMetrics): Object`
```typescript
const degradation = anomalyDetectionService.detectPerformanceDegradation(
  currentMetrics,
  [prev1, prev2, prev3, prev4, prev5]
)
// Returns: {
//   isDegraded: true,
//   metrics: ['ctr', 'conversions'],
//   severity: 'warning'
// }
```

#### `detectBudgetIssues(spent, budget, daysLeft): Alert | null`
```typescript
const alert = anomalyDetectionService.detectBudgetIssues(
  9500,    // spent
  10000,   // budget
  2        // days left
)
// Returns: Alert if budget will run out soon
```

#### `detectQualityScoreDrop(currentScore, historicalScores, threshold): boolean`
```typescript
const isDrop = anomalyDetectionService.detectQualityScoreDrop(
  5,                    // current
  [7, 8, 8, 7, 8],     // historical
  2                     // threshold
)
// Returns: true if quality score dropped significantly
```

---

## export.service.ts

Export data in multiple formats

### Methods

#### `exportToCSV(data, columns, filename): ExportResult`
```typescript
const result = exportService.exportToCSV(
  campaigns,
  ['id', 'name', 'status', 'cost', 'roas'],
  'campaigns.csv'
)
// Downloads: campaigns.csv
// Returns: { format: 'csv', status: 'completed', ... }
```

#### `exportToExcel(data, columns, filename): Promise<ExportResult>`
```typescript
const result = await exportService.exportToExcel(
  campaigns,
  ['id', 'name', 'status', 'cost', 'roas'],
  'campaigns.xlsx'
)
// Downloads: campaigns.xlsx
```

#### `exportToPDF(htmlContent, filename): Promise<ExportResult>`
```typescript
const result = await exportService.exportToPDF(
  '<h1>Report</h1><p>...</p>',
  'report.pdf'
)
// Downloads: report.pdf
```

#### `exportToGoogleSheets(data, spreadsheetId, sheetName): Promise<ExportResult>`
```typescript
const result = await exportService.exportToGoogleSheets(
  data,
  'YOUR_SPREADSHEET_ID',
  'Sheet1'
)
// Appends data to Google Sheet
```

#### `generateReport(config, data): string`
```typescript
const html = exportService.generateReport(
  {
    title: 'Campaign Report',
    metrics: ['ctr', 'conversions', 'roas'],
    visualizations: 'charts'
  },
  campaignsData
)
// Returns: HTML string of formatted report
```

---

## analytics.service.ts

Business logic and insights

### Methods

#### `calculateEfficiency(metrics): { roas, roi, efficiency }`
```typescript
const eff = analyticsService.calculateEfficiency(metrics)
// Returns: { roas: 2.5, roi: 150, efficiency: 75.3 }
```

#### `getTopPerformers(campaigns, metric, limit): Campaign[]`
```typescript
const top = analyticsService.getTopPerformers(
  campaigns,
  'roas',
  10
)
// Returns: Top 10 campaigns by ROAS
```

#### `calculateCampaignHealth(campaign): { score, status, issues }`
```typescript
const health = analyticsService.calculateCampaignHealth(campaign)
// Returns: {
//   score: 75,
//   status: 'good',
//   issues: ['Low CTR', 'Below average CPA']
// }
```

#### `calculateOptimizationPotential(current, benchmark): Object`
```typescript
const potential = analyticsService.calculateOptimizationPotential(
  currentMetrics,
  benchmarkMetrics
)
// Returns: {
//   potentialRevenue: 5000,
//   potentialCostSavings: 1500,
//   opportunities: [...]
// }
```

#### `getInsights(campaigns): Insight[]`
```typescript
const insights = analyticsService.getInsights(campaigns)
// Returns: Actionable insights sorted by priority
// [
//   {
//     title: "Campaign X needs attention",
//     description: "...",
//     action: "review_campaign",
//     priority: "high",
//     impact: "critical"
//   }
// ]
```

---

## cache.service.ts

Data caching with TTL

### Methods

#### `set(key, data, ttlSeconds)`
```typescript
cacheService.set('campaigns_jan', campaigns, 300) // 5 min
```

#### `get(key): T | null`
```typescript
const cached = cacheService.get('campaigns_jan')
```

#### `has(key): boolean`
```typescript
if (cacheService.has('campaigns_jan')) {
  // Use cache
}
```

#### `clear(pattern?)`
```typescript
cacheService.clear()        // Clear all
cacheService.clear('campaigns.*') // Clear campaigns cache
```

#### `size(): number`
```typescript
console.log(`Cache size: ${cacheService.size()} items`)
```

#### `keys(): string[]`
```typescript
const allKeys = cacheService.keys()
```

---

## Usage Examples

### Complete Flow: Load & Compare Campaigns

```typescript
// 1. Load campaigns
const campaigns = await yandexApiService.getCampaigns(from, to)

// 2. Get top performers
const topCampaigns = analyticsService.getTopPerformers(campaigns, 'roas', 5)

// 3. Compare campaigns
const comparison = comparisonService.compareCampaigns(topCampaigns)

// 4. Check for issues
const alerts = comparison.anomalies
  .map((a) => anomalyDetectionService.generateAlerts([a]))
  .flat()

// 5. Export results
const result = await exportService.exportToCSV(
  comparison.campaigns,
  ['campaignName', 'roas', 'ctr', 'cost']
)
```

### Complete Flow: Forecast & Alert

```typescript
// 1. Get historical data
const metrics = [10, 12, 11, 13, 15, 14, 16]
const dates = getLastNDays(7)

// 2. Generate forecast
const forecast = forecastService.generateForecast(
  { metric: 'conversions', daysAhead: 14 },
  metrics,
  dates
)

// 3. Analyze trend
const trend = forecastService.analyzeTrend(metrics)

// 4. Detect anomalies
const anomaly = metricsService.detectAnomaly(metrics)

// 5. Generate alert if needed
if (anomaly.isAnomaly) {
  const alert = anomalyDetectionService.generateAlerts([anomaly])[0]
  console.log(`⚠️ ${alert.title}: ${alert.message}`)
}
```

---

## Error Handling

All services catch errors and return appropriate responses:

```typescript
try {
  const campaigns = await yandexApiService.getCampaigns(from, to)
} catch (error) {
  console.error('API Error:', error.message)
  // Service handles logging, components display error UI
}
```

---

**See START_HERE.md for quick reference.**
