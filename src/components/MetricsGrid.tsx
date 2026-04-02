/**
 * MetricsGrid
 * Сетка метрик (20+ KPI)
 */

import React from 'react'
import { Metrics, Campaign } from '@/types'
import { formatCurrency, formatPercent, formatNumber } from '@/utils/formatting'
import { getChangeColor } from '@/utils/colors'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricsGridProps {
  metrics: Metrics
  campaigns: Campaign[]
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics, campaigns }) => {
  const metricsData = [
    {
      label: 'Impressions',
      value: formatNumber(metrics.impressions, 0),
      metric: 'impressions',
    },
    {
      label: 'Clicks',
      value: formatNumber(metrics.clicks, 0),
      metric: 'clicks',
    },
    {
      label: 'CTR',
      value: formatPercent(metrics.ctr, 2),
      metric: 'ctr',
    },
    {
      label: 'CPC',
      value: formatCurrency(metrics.cpc),
      metric: 'cpc',
    },
    {
      label: 'CPM',
      value: formatCurrency(metrics.cpm),
      metric: 'cpm',
    },
    {
      label: 'Cost',
      value: formatCurrency(metrics.cost),
      metric: 'cost',
    },
    {
      label: 'Conversions',
      value: formatNumber(metrics.conversions, 0),
      metric: 'conversions',
    },
    {
      label: 'Conv. Rate',
      value: formatPercent(metrics.conversionRate, 2),
      metric: 'conversionRate',
    },
    {
      label: 'CPA',
      value: formatCurrency(metrics.cpa),
      metric: 'cpa',
    },
    {
      label: 'ROAS',
      value: `${metrics.roas.toFixed(2)}x`,
      metric: 'roas',
    },
    {
      label: 'Conv. Value',
      value: formatCurrency(metrics.conversionValue),
      metric: 'conversionValue',
    },
    {
      label: 'Budget Spent',
      value: formatCurrency(metrics.budgetSpent),
      metric: 'budgetSpent',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {metricsData.map((item) => (
        <div key={item.metric} className="card">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
            {item.label}
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {item.value}
          </p>
          <div className="mt-2 flex items-center gap-1 text-sm">
            {metrics.roas > 2 ? (
              <>
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-600 dark:text-green-400">+5.2%</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-red-600 dark:text-red-400">-2.1%</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MetricsGrid
