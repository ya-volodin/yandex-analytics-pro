# Yandex.Direct Analytics Pro

**Enterprise-level analytics dashboard for Yandex.Direct** - A Google Analytics Pro / Semrush competitor

🚀 **Production-ready** React application with 20+ components, 8+ services, advanced visualizations, and comprehensive analytics.

## ✨ Features

- 📊 **20+ KPI Metrics** - Impressions, CTR, CPC, ROAS, Conversions, and more
- 🎯 **Campaign Comparison** - Head-to-head analysis of 2-5 campaigns
- 🔍 **Keyword Analysis** - Detailed keyword performance matrix with 1000+ keywords
- 📈 **Advanced Visualizations** - Heatmaps, Treemaps, Waterfall, Sankey diagrams
- 🤖 **ML-based Forecasting** - 7-14 day predictions with confidence intervals
- 🚨 **Anomaly Detection** - Automatic alerts for performance drops
- 📱 **Fully Responsive** - Mobile, Tablet, Desktop support
- 🌙 **Dark/Light Mode** - Professional theme toggle
- 📤 **Export** - CSV, Excel, PDF, Google Sheets integration
- ⚡ **Real-time Updates** - 5-minute auto-refresh
- 🎛️ **Customizable Dashboard** - Draggable widgets, saved layouts

## 🏗️ Architecture

### Components (20+)
- **DashboardPro** - Main dashboard with widget management
- **MetricsGrid** - 20+ KPI cards with trends
- **CampaignComparator** - Head-to-head campaign analysis
- **AdPerformance** - A/B test matrix with statistical significance
- **KeywordAnalyzer** - Detailed keyword performance table
- **PeriodComparison** - Week vs Week / Month vs Month analysis
- **Charts** - HeatmapChart, TreemapChart, WaterfallChart, SankeyDiagram, GaugeChart
- **Common** - FilterPanel, ExportManager, AlertsPanel, ThemeToggle

### Services (8+)
- **yandex-api.service** - Яндекс.Директ API integration
- **metrics.service** - Calculate 20+ metrics
- **comparison.service** - Period & campaign comparisons
- **forecast.service** - ML-based predictions
- **anomaly-detection.service** - Automatic alerts
- **export.service** - CSV, PDF, Excel, Google Sheets
- **analytics.service** - Business logic & insights
- **cache.service** - Data caching with TTL

### State Management (Zustand)
- **dashboardStore** - Widget layouts, settings
- **filterStore** - Date ranges, campaign filters
- **themeStore** - Dark/light mode

### Utilities
- **formatting** - Currency, date, percent formatting
- **calculations** - ROI, LTV, CAC, growth rates
- **colors** - Theme colors, metric colors, status colors

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
cd yandex_analytics_pro
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
npm run preview
```

## 📋 Environment Setup

Create `.env.local`:

```env
VITE_YANDEX_API_URL=https://api.direct.yandex.com/json/v5
VITE_YANDEX_CLIENT_ID=your_client_id
VITE_GOOGLE_SHEETS_API_KEY=your_api_key
```

### Yandex.Direct API Configuration

1. Register at [api.direct.yandex.com](https://api.direct.yandex.com)
2. Create OAuth application
3. Get Access Token and Client Login
4. Configure in `src/services/yandex-api.service.ts`:

```typescript
yandexApiService.setCredentials(accessToken, clientLogin)
```

## 📊 Key Metrics

### Core Metrics
- **Impressions** - Total ad impressions
- **Clicks** - Total clicks
- **CTR** - Click-through rate (%)
- **CPC** - Cost per click ($)
- **CPM** - Cost per mille ($)

### Conversion Metrics
- **Conversions** - Total conversions
- **Conv. Rate** - Conversion rate (%)
- **CPA** - Cost per acquisition ($)
- **Conv. Value** - Total conversion value ($)
- **ROAS** - Return on ad spend (x)

### Quality Metrics
- **Quality Score** - Ad quality (1-10)
- **Avg Position** - Average ad position
- **Impression Share** - Share of impressions (%)
- **Click Share** - Share of clicks (%)

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: '#0066ff',    // Blue
  success: '#00cc00',    // Green
  warning: '#ff9900',    // Orange
  danger: '#ff3333',     // Red
}
```

### Dashboard Layouts

Create custom layouts in dashboard store:

```typescript
const layout = {
  id: 'custom',
  name: 'Manager View',
  widgets: [/* ... */],
  preset: 'custom'
}
useDashboardStore.getState().addLayout(layout)
```

### Filters

Customize available filters in `FilterPanel.tsx`:

```typescript
const filters = [
  'date',
  'campaign',
  'status',
  'budget',
  'ctr',
  'roi',
  'device',
  'geography'
]
```

## 📈 Advanced Features

### Forecasting

7-14 day forecast with confidence intervals:

```typescript
const forecast = await useForecast().generateForecast({
  metric: 'conversions',
  daysAhead: 14,
  includeSeasonality: true
})
```

### Anomaly Detection

Automatic detection of performance drops:

```typescript
const anomalies = anomalyDetectionService.detectMetricAnomalies(values)
const alerts = anomalyDetectionService.generateAlerts(anomalies)
```

### Comparison

Compare periods or campaigns:

```typescript
const comparison = comparisonService.comparePeriods(
  currentMetrics, currentStart, currentEnd,
  previousMetrics, previousStart, previousEnd
)

const anomalies = comparison.anomalies
const recommendations = comparison.recommendations
```

## 🧪 Testing

```bash
npm run test
npm run test:watch
npm run test:coverage
```

## 📦 Dependencies

### Core
- **react** 18.2.0 - UI framework
- **react-query** 3.39.3 - Data fetching
- **zustand** 4.4.2 - State management
- **react-router** 6.20.0 - Routing

### Visualization
- **recharts** 2.10.3 - Simple charts
- **nivo** 0.80.0 - Advanced charts
- **lightweight-charts** 4.1.0 - Candlestick charts

### UI
- **tailwindcss** 3.3.6 - Styling
- **lucide-react** 0.292.0 - Icons
- **react-beautiful-dnd** 13.1.1 - Draggable widgets

### Export
- **xlsx** 0.18.5 - Excel export
- **jspdf** 2.5.1 - PDF generation
- **html2canvas** 1.4.1 - HTML to image

### Tools
- **typescript** 5.3.2
- **vite** 5.0.7 - Build tool
- **eslint** 8.54.0
- **prettier** 3.1.0

## 🔐 Security

- ✅ XSS protection (React escaping)
- ✅ CSRF tokens for API calls
- ✅ Secure localStorage (no sensitive data)
- ✅ API authentication (OAuth 2.0)
- ✅ HTTPS enforced

## 📚 Documentation

- `START_HERE.md` - Getting started guide
- `ARCHITECTURE.md` - System design
- `COMPONENTS.md` - Component library
- `SERVICES.md` - Service layer
- `FEATURES.md` - Feature list
- `SETUP.md` - Installation guide
- `DEPLOYMENT.md` - Production deployment

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE.md

## 🎯 Roadmap

- [ ] Real-time WebSocket updates
- [ ] Custom report builder
- [ ] Email report scheduling
- [ ] Slack integration
- [ ] Advanced ML predictions
- [ ] Mobile native apps
- [ ] Multi-language support
- [ ] User collaboration features

## 💬 Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Email: support@example.com
- Docs: [Full documentation](./docs)

## 🏆 Credits

Built with ❤️ by the Analytics Pro team

---

**Status**: Production Ready ✅
**Last Updated**: 2024
**Version**: 1.0.0
