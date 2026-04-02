import React, { useState } from 'react'
import { Campaign } from '@/types'
import { mockDataService } from '@/services/mockDataService'
import clsx from 'clsx'

interface CampaignComparisonProps {
  selectedCampaigns?: Campaign[]
}

export const CampaignComparison: React.FC<CampaignComparisonProps> = ({ selectedCampaigns = [] }) => {
  const [compareCampaigns, setCompareCampaigns] = useState<Campaign[]>(selectedCampaigns.length > 0 ? selectedCampaigns : mockDataService.getCampaigns().slice(0, 2))
  const [showAdvanced, setShowAdvanced] = useState(false)

  const allCampaigns = mockDataService.getCampaigns()

  const getWinner = (values: number[]): number | null => {
    if (values.length < 2) return null
    const maxValue = Math.max(...values)
    const maxIndex = values.indexOf(maxValue)
    return values.filter((v) => v === maxValue).length === 1 ? maxIndex : null
  }

  const metrics = [
    { key: 'impressions', label: 'Impressions', format: (v: number) => v.toLocaleString() },
    { key: 'clicks', label: 'Clicks', format: (v: number) => v.toLocaleString() },
    { key: 'ctr', label: 'CTR (%)', format: (v: number) => v.toFixed(2) + '%' },
    { key: 'cpc', label: 'CPC ($)', format: (v: number) => '$' + v.toFixed(2) },
    { key: 'cost', label: 'Total Cost ($)', format: (v: number) => '$' + v.toFixed(2) },
    { key: 'conversions', label: 'Conversions', format: (v: number) => v.toString() },
    { key: 'convValue', label: 'Conv. Value ($)', format: (v: number) => '$' + v.toFixed(2) },
    { key: 'roas', label: 'ROAS (x)', format: (v: number) => v.toFixed(2) + 'x' },
    { key: 'conversionRate', label: 'Conv. Rate (%)', format: (v: number) => v.toFixed(2) + '%' },
    { key: 'cpa', label: 'CPA ($)', format: (v: number) => '$' + v.toFixed(2) },
    { key: 'qualityScore', label: 'Quality Score', format: (v: number) => Math.round(v).toString() + '/10' },
    { key: 'avgPosition', label: 'Avg Position', format: (v: number) => v.toFixed(2) },
  ]

  const handleCampaignSelect = (idx: number, campaign: Campaign) => {
    const newCampaigns = [...compareCampaigns]
    newCampaigns[idx] = campaign
    setCompareCampaigns(newCampaigns)
  }

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced)
  }

  return (
    <div className="space-y-6">
      {/* Campaign Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {compareCampaigns.map((campaign, idx) => (
          <div key={idx} className="card p-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Campaign {idx + 1}
            </label>
            <select
              value={campaign.id}
              onChange={(e) => {
                const selected = allCampaigns.find((c) => c.id === e.target.value)
                if (selected) handleCampaignSelect(idx, selected)
              }}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              {allCampaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">Status</p>
              <p className="font-semibold text-slate-900 dark:text-white capitalize">{campaign.status}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">Metric</th>
                {compareCampaigns.map((campaign, idx) => (
                  <th key={idx} className="px-6 py-3 text-right font-semibold text-slate-900 dark:text-white">
                    {campaign.name}
                  </th>
                ))}
                <th className="px-6 py-3 text-right font-semibold text-slate-900 dark:text-white">Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {metrics.map((metric, midx) => {
                const metricKey = metric.key as keyof typeof compareCampaigns[0]['metrics']
                const values = compareCampaigns.map((c) => (c.metrics as any)[metricKey] || 0)
                const winner = getWinner(values)
                const diff = Math.abs(values[0] - values[1])
                const diffPercent = values[0] !== 0 ? ((diff / values[0]) * 100).toFixed(1) : '0'

                return (
                  <tr key={midx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{metric.label}</td>
                    {values.map((value, idx) => (
                      <td
                        key={idx}
                        className={clsx('px-6 py-4 text-right font-semibold', {
                          'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300': winner === idx,
                          'text-slate-900 dark:text-white': winner !== idx,
                        })}
                      >
                        {metric.format(value)}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">
                      {diffPercent}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advanced Analysis */}
      <button
        onClick={toggleAdvanced}
        className="px-4 py-2 text-sm font-medium text-yandex-600 dark:text-yandex-400 border border-yandex-300 dark:border-yandex-700 hover:bg-yandex-50 dark:hover:bg-yandex-900/20 rounded-lg transition-colors"
      >
        {showAdvanced ? 'Hide Advanced Analysis' : 'Show Advanced Analysis'}
      </button>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Budget Efficiency</h3>
            <div className="space-y-3">
              {compareCampaigns.map((campaign, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400">{campaign.name}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {(campaign.metrics.conversions / campaign.metrics.cost).toFixed(4)} conv/dollar
                  </p>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mt-2">
                    <div
                      className="bg-yandex-500 h-2 rounded-full"
                      style={{
                        width: `${(100 * (campaign.metrics.conversions / campaign.metrics.cost)) / Math.max(...compareCampaigns.map((c) => c.metrics.conversions / c.metrics.cost))}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Performance Score</h3>
            <div className="space-y-3">
              {compareCampaigns.map((campaign, idx) => {
                const score =
                  (campaign.metrics.ctr * 2 + campaign.metrics.roas * 10 + campaign.metrics.qualityScore * 5) / 17
                return (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-sm text-slate-600 dark:text-slate-400">{campaign.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-yandex-500 h-3 rounded-full"
                          style={{ width: `${Math.min(100, score * 3)}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white text-sm whitespace-nowrap">
                        {score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
