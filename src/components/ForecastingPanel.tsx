import React from 'react'
import { Forecast } from '@/types'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { TrendingUp, Zap } from 'lucide-react'
import { format } from 'date-fns'
import clsx from 'clsx'

interface ForecastingPanelProps {
  forecasts: Forecast[]
  historicalData?: Array<{ date: string; [key: string]: any }>
  metricKey?: string
}

export const ForecastingPanel: React.FC<ForecastingPanelProps> = ({
  forecasts,
  historicalData = [],
  metricKey = 'impressions',
}) => {
  // Transform forecast data for charts
  const chartData = [
    ...(historicalData || []).slice(-7),
    ...forecasts.map((f) => ({
      date: format(f.date, 'MMM dd'),
      [metricKey]: f.predictedMetrics[metricKey as keyof typeof f.predictedMetrics],
      lower: f.lowerBound[metricKey as keyof typeof f.lowerBound],
      upper: f.upperBound[metricKey as keyof typeof f.upperBound],
      isForecast: true,
    })),
  ]

  // Calculate average confidence
  const avgConfidence = (forecasts.reduce((sum, f) => sum + f.confidence, 0) / forecasts.length) * 100

  // Get highest predicted value
  const highestPredicted = Math.max(
    ...forecasts
      .map((f) => f.predictedMetrics[metricKey as keyof typeof f.predictedMetrics] || 0)
      .filter((v) => typeof v === 'number')
  )

  // Get lowest predicted value
  const lowestPredicted = Math.min(
    ...forecasts
      .map((f) => f.predictedMetrics[metricKey as keyof typeof f.predictedMetrics] || 0)
      .filter((v) => typeof v === 'number')
  )

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                Forecast Confidence
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {avgConfidence.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Zap size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-4">
            ML confidence in predicted values
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                Highest Predicted
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {highestPredicted.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-4">
            Next 7 days peak
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                Lowest Predicted
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {lowestPredicted.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
              <TrendingUp size={24} className="rotate-180" />
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-4">
            Next 7 days low
          </p>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
          {metricKey.charAt(0).toUpperCase() + metricKey.slice(1)} Forecast (7 Days)
        </h3>

        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f8b90c" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f8b90c" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />

            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#f1f5f9',
              }}
              labelStyle={{ color: '#f1f5f9' }}
            />

            <Legend />

            {/* Confidence Band */}
            <Area
              type="monotone"
              dataKey="upper"
              fill="#cbd5e1"
              stroke="none"
              fillOpacity={0.2}
              name="Upper Bound"
            />
            <Area
              type="monotone"
              dataKey="lower"
              fill="#cbd5e1"
              stroke="none"
              fillOpacity={0.2}
              name="Lower Bound"
            />

            {/* Actual Line */}
            <Area
              type="monotone"
              dataKey={metricKey}
              stroke="#f8b90c"
              fill="url(#colorMetric)"
              strokeWidth={3}
              dot={false}
              name="Forecast"
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <span className="font-semibold">📊 How to Read:</span> The shaded area represents the confidence interval. The
            yellow line is the predicted value. Wider bands indicate lower prediction certainty.
          </p>
        </div>
      </div>

      {/* Daily Forecasts Table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Daily Breakdown
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">
                  Date
                </th>
                <th className="px-6 py-3 text-right font-semibold text-slate-900 dark:text-white">
                  Predicted Value
                </th>
                <th className="px-6 py-3 text-right font-semibold text-slate-900 dark:text-white">
                  Lower Bound
                </th>
                <th className="px-6 py-3 text-right font-semibold text-slate-900 dark:text-white">
                  Upper Bound
                </th>
                <th className="px-6 py-3 text-center font-semibold text-slate-900 dark:text-white">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {forecasts.map((forecast, idx) => {
                const trend =
                  idx === 0
                    ? 'neutral'
                    : forecast.predictedMetrics[metricKey as keyof typeof forecast.predictedMetrics] >
                        (forecasts[idx - 1].predictedMetrics[metricKey as keyof typeof forecasts[idx - 1].predictedMetrics] || 0)
                    ? 'up'
                    : 'down'

                return (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {format(forecast.date, 'EEE, MMM dd')}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">
                      {(forecast.predictedMetrics[metricKey as keyof typeof forecast.predictedMetrics] || 0).toLocaleString(
                        undefined,
                        { maximumFractionDigits: 0 }
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">
                      {(forecast.lowerBound[metricKey as keyof typeof forecast.lowerBound] || 0).toLocaleString(
                        undefined,
                        { maximumFractionDigits: 0 }
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">
                      {(forecast.upperBound[metricKey as keyof typeof forecast.upperBound] || 0).toLocaleString(
                        undefined,
                        { maximumFractionDigits: 0 }
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-24 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-yandex-500 h-2 rounded-full"
                            style={{ width: `${forecast.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                          {(forecast.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={clsx('text-sm font-semibold', {
                          'text-green-600 dark:text-green-400': trend === 'up',
                          'text-red-600 dark:text-red-400': trend === 'down',
                          'text-slate-600 dark:text-slate-400': trend === 'neutral',
                        })}
                      >
                        {trend === 'up' ? '↑ Rising' : trend === 'down' ? '↓ Falling' : '→ Stable'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
