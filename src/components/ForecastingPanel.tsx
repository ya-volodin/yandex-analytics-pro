import React from 'react'
import { format } from 'date-fns'
import { TrendingUp } from 'lucide-react'

interface ForecastData {
  date: Date
  predictedMetrics: {
    clicks: number
    impressions: number
    cost: number
    conversions: number
    roas: number
  }
  confidence: number
}

export const ForecastingPanel: React.FC = () => {
  const forecasts: ForecastData[] = [
    {
      date: new Date(2026, 3, 3),
      predictedMetrics: { clicks: 2100, impressions: 38000, cost: 8500, conversions: 145, roas: 3.5 },
      confidence: 0.92
    },
    {
      date: new Date(2026, 3, 4),
      predictedMetrics: { clicks: 2150, impressions: 39000, cost: 8800, conversions: 150, roas: 3.6 },
      confidence: 0.90
    },
    {
      date: new Date(2026, 3, 5),
      predictedMetrics: { clicks: 2200, impressions: 40000, cost: 9100, conversions: 155, roas: 3.7 },
      confidence: 0.88
    },
    {
      date: new Date(2026, 3, 6),
      predictedMetrics: { clicks: 2180, impressions: 39500, cost: 9000, conversions: 152, roas: 3.65 },
      confidence: 0.87
    },
    {
      date: new Date(2026, 3, 7),
      predictedMetrics: { clicks: 2220, impressions: 40500, cost: 9200, conversions: 157, roas: 3.75 },
      confidence: 0.86
    },
    {
      date: new Date(2026, 3, 8),
      predictedMetrics: { clicks: 2280, impressions: 41500, cost: 9500, conversions: 162, roas: 3.85 },
      confidence: 0.85
    },
    {
      date: new Date(2026, 3, 9),
      predictedMetrics: { clicks: 2320, impressions: 42000, cost: 9700, conversions: 165, roas: 3.90 },
      confidence: 0.84
    }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            7-Day Forecast with ML Predictions
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Date</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-white">Clicks</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-white">Impressions</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-white">Cost</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-white">Conv.</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-white">ROAS</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-900 dark:text-white">Confidence</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-900 dark:text-white">Trend</th>
              </tr>
            </thead>
            <tbody>
              {forecasts.map((forecast, idx) => {
                const trend = idx === 0 ? 'neutral' : forecast.predictedMetrics.clicks > forecasts[idx - 1].predictedMetrics.clicks ? 'up' : 'down'

                return (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700/50">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      {format(forecast.date, 'EEE, MMM dd')}
                    </td>
                    <td className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {forecast.predictedMetrics.clicks.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">
                      {forecast.predictedMetrics.impressions.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">
                      ₽{(forecast.predictedMetrics.cost / 1000).toFixed(1)}K
                    </td>
                    <td className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">
                      {forecast.predictedMetrics.conversions}
                    </td>
                    <td className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {forecast.predictedMetrics.roas.toFixed(2)}x
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                        {Math.round(forecast.confidence * 100)}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`font-semibold ${trend === 'up' ? 'text-green-600 dark:text-green-400' : trend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        {trend === 'up' ? '↑ Up' : trend === 'down' ? '↓ Down' : '→ Stable'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Predicted Clicks</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">2,256</p>
            <p className="text-xs text-blue-700 dark:text-blue-300">±145 (95% CI)</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">Expected Cost</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">₽9,350</p>
            <p className="text-xs text-green-700 dark:text-green-300">+3.5% vs last week</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Forecasted ROAS</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">3.75x</p>
            <p className="text-xs text-purple-700 dark:text-purple-300">Stable trend</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForecastingPanel