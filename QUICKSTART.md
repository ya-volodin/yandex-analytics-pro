# 🚀 Quick Start Guide

Get up and running with Yandex.Direkt Analytics Pro in minutes!

## 1️⃣ Installation (2 minutes)

```bash
# Navigate to the project directory
cd yandex_analytics_pro

# Install dependencies
npm install

# Start the development server
npm run dev
```

The dashboard will open at `http://localhost:5173`

## 2️⃣ First Look

### Main Dashboard
- **Top Metrics**: See your 4 key metrics at a glance
- **Charts**: Visual trends over the selected date range
- **Campaign Table**: Your campaigns with sortable columns
- **Sidebar**: Date range selector and anomaly alerts

### Theme Toggle
Click the 🌙/☀️ button in the bottom-right corner to switch between dark and light modes.

## 3️⃣ Core Features Quick Tour

### 📊 Viewing Campaign Data
1. Dashboard loads with sample data (15 mock campaigns)
2. Click any campaign row to select it
3. Use date picker to change date range
4. Metrics automatically update

### 🔍 Filtering & Sorting
- **Sort Tables**: Click column headers to sort
- **Change Dates**: Use date picker or preset buttons (7 days, 30 days, etc.)
- **Status Filter**: Filter by active/paused/archived campaigns

### 📈 Charts
- **Impressions & Clicks**: Area chart showing trends
- **Cost vs Conversions**: Bar chart comparison
- Click and drag to zoom
- Hover for detailed values

### 🎯 Campaign Comparison
1. Select 2+ campaigns from the table
2. Go to Campaign Comparison tab
3. See side-by-side metrics
4. View advanced analysis (Budget Efficiency, Performance Score)

### 🔑 Keyword Analysis
1. Open Keyword Analysis tab
2. See all keywords with metrics
3. Sort by CTR, CPC, conversions, or quality
4. View top performers and insights

## 4️⃣ Key Shortcuts & Tips

### Navigation Tips
- Use keyboard arrow keys to navigate between campaigns
- Press Enter to select a campaign
- Escape to close modals

### Performance Tips
- Toggle dark mode for better performance (uses less power)
- Collapse sidebars for more screen space
- Use date picker for specific date ranges

### Data Tips
- Mock data refreshes on page reload
- All metrics are calculated in real-time
- Download data as CSV/PDF/JSON

## 5️⃣ Understanding the Metrics

### Key Metrics Glossary

| Metric | Meaning | Good Range |
|--------|---------|-----------|
| **CTR** | Click-through rate (%) | 2-5% |
| **CPC** | Cost per click ($) | Industry dependent |
| **ROAS** | Return on ad spend | >2.0x |
| **CPA** | Cost per action ($) | < Revenue per action |
| **Quality Score** | Ad quality (1-10) | 7+ |
| **Conversion Rate** | % of clicks that convert | 2-5% |

### Understanding Anomalies

When you see an anomaly alert:
1. **High Severity** (🔴): Requires immediate attention
2. **Medium Severity** (🟡): Review and plan action
3. **Low Severity** (🔵): Monitor for patterns

Each anomaly includes:
- **Metric**: What changed
- **Actual Value**: Current value
- **Change**: How much it changed (%)
- **Suggestions**: AI-powered recommendations

## 6️⃣ Common Tasks

### 📥 Export Data
1. Click the "Export" button in Campaign section
2. Choose format (CSV, PDF, XLSX, JSON)
3. Select metrics to include
4. Click "Export"

### 📅 Compare Periods
1. Select first date range
2. Make note of metrics
3. Select second date range
4. Compare % changes

### 🎯 Find Top Campaigns
1. Click "Sort by CTR" (default sort)
2. Look at the top rows
3. Click a campaign to select it
4. View detailed metrics

### 🔔 Get Alerts
- Anomalies appear in left sidebar automatically
- Click an anomaly for detailed analysis
- Red = High priority
- Yellow = Medium priority
- Blue = Low priority

## 7️⃣ Customization

### Dark Mode
- Automatic: Respects system setting
- Manual: Click 🌙 button to toggle
- Saved: Your preference is remembered

### Date Ranges
1. Click calendar in date picker
2. Select start and end dates
3. Or click preset buttons:
   - Today
   - Last 7 days
   - Last 30 days
   - Last 90 days

### Metrics Selection
- Click "Customize" to choose which metrics to display
- Drag to reorder metric cards
- Click X to hide metrics

## 8️⃣ Sample Data Info

The dashboard comes with realistic mock data:
- **15 Campaigns**: Search, Display, Shopping, Video
- **Multiple Ad Groups**: 2-5 per campaign
- **Ads & Keywords**: 100+ keywords across all campaigns
- **Realistic Metrics**: Generated based on industry benchmarks
- **Anomalies**: 3-5 sample anomalies in each view
- **7-Day Forecast**: ML-generated predictions

To refresh mock data:
```javascript
// In browser console
mockDataService.refreshData()
```

## 9️⃣ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `D` | Toggle dark mode |
| `?` | Show help |
| `Cmd/Ctrl + K` | Quick search |
| `Cmd/Ctrl + E` | Export data |
| `Esc` | Close modal |

## 🔟 Next Steps

### For Development
1. Read `README.md` for architecture
2. Check `FEATURES.md` for complete feature list
3. Review `src/types/index.ts` for TypeScript types
4. Explore components in `src/components/`

### For Production
1. Update `mockDataService.ts` with real API calls
2. Configure authentication
3. Set up error handling
4. Deploy to your server
5. Configure environment variables

### Integration
1. Read API documentation
2. Update `services/apiService.ts` with real endpoints
3. Configure authentication headers
4. Test with production data
5. Set up monitoring and alerts

## 📚 Documentation

- **README.md**: Full feature documentation
- **FEATURES.md**: Complete feature list with details
- **QUICKSTART.md**: This file (quick start guide)
- **src/types/index.ts**: TypeScript type definitions
- **Code Comments**: Inline documentation in components

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Use different port
npm run dev -- --port 5174
```

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Dark Mode Not Working
Clear browser localStorage:
```javascript
localStorage.clear()
```

### Charts Not Displaying
Check browser console for errors:
- F12 → Console tab
- Look for red error messages
- Check network tab for failed requests

## 🎉 You're Ready!

You now have a fully functional enterprise-grade analytics dashboard. Start exploring and customize it for your needs!

---

**Questions?** Check the README.md or review the component source code.

**Ready to connect real data?** See the "Integration" section above.

**Want to add features?** Check FEATURES.md for the complete feature roadmap.
