import React, { useState, useEffect } from 'react'
import { Eye, Settings, Plus, Download, Bell, TrendingUp } from 'lucide-react'
import { useDashboardStore, useAnalyticsStore } from '@/store/dashboardStore'
import { mockDataService } from '@/services/mockDataService'
import { MetricCard } from './MetricCard'
import { PerformanceChart } from './Charts/PerformanceChart'
import { CampaignTable } from './CampaignTable'
import { DateRangePicker } from './DateRangePicker'
import { Campaign } from '@/types'
import { differenceInDays } from 'date-fns'
import clsx from 'clsx'

export const Dashboard: React.FC = () => {
  const { theme, filters } = useDashboardStore()
  const { campaigns, anomalies, isLoading, setLoading, setCampaigns, setAnomalies } = useAnalyticsStore()
  const [selectedCampaigns, setSelectedCampaigns] = useState<Campaign[]>([])
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    setLoading(true)
    // Simulate data loading
    setTimeout(() => {
      const data = mockDataService.getCampaigns()
      setCampaigns(data)
      setAnomalies(mockDataService.getAnomalies())
      setLoading(false)
    }, 500)
  }, [setCampaigns, setAnomalies, setLoading])

  // Generate chart data
  const generateChartData = () => {
    const days = differenceInDays(filters.dateRange.endDate, filters.dateRange.startDate)
    const data = []

    for (let i = 0; i < days; i++) {
      data.push({
        date: new Date(filters.dateRange.startDate.getTime() + i * 24 * 60 * 60 * 1000)
          .toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        impressions: Math.floor(Math.random() * 50000) + 10000,
        clicks: Math.floor(Math.random() * 5000) + 500,
        cost: Math.floor(Math.random() * 10000) + 1000,
        conversions: Math.floor(Math.random() * 100) + 20,
      })
    }

    return data
  }

  const calculateAggregates = () => {
    if (campaigns.length === 0)
      return {
        totalImpressions: 0,
        totalClicks: 0,
        avgCTR: 0,
        totalCost: 0,
        totalConversions: 0,
        avgROAS: 0,
      }

    const agg = campaigns.reduce(
      (acc, campaign) => ({
        totalImpressions: acc.totalImpressions + campaign.metrics.impressions,
        totalClicks: acc.totalClicks + campaign.metrics.clicks,
        totalCost: acc.totalCost + campaign.metrics.cost,
        totalConversions: acc.totalConversions + campaign.metrics.conversions,
        totalROAS: acc.totalROAS + campaign.metrics.roas,
      }),
      {
        totalImpressions: 0,
        totalClicks: 0,
        totalCost: 0,
        totalConversions: 0,
        totalROAS: 0,
      }
    )

    return {
      ...agg,
      avgCTR: ((agg.totalClicks / agg.totalImpressions) * 100).toFixed(2),
      avgROAS: (agg.totalROAS / campaigns.length).toFixed(2),
    }
  }

  const metrics = calculateAggregates()
  const chartData = generateChartData()

  return (
    <div className={clsx(theme === 'dark' && 'dark')}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-yandex-600 dark:text-yandex-400 flex items-center gap-2">
                  📊 Yandex.Direkt Analytics Pro
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Enterprise-level performance insights
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Bell size={20} className="text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Settings size={20} className="text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </div>

            {/* Info Banner */}
            {anomalies.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-center gap-2">
                <Bell size={18} className="text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm text-yellow-800 dark:text-yellow-200">
                  {anomalies.length} anomalies detected. Review alerts in the sidebar.
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <DateRangePicker />

              {/* Anomalies */}
              {anomalies.length > 0 && (
                <div className="card p-6 mt-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp size={20} />
                    Anomalies
                  </h3>
                  <div className="space-y-3">
                    {anomalies.slice(0, 5).map((anomaly) => (
                      <div
                        key={anomaly.id}
                        className={clsx('p-3 rounded-lg text-sm', {
                          'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800':
                            anomaly.severity === 'high',
                          'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800':
                            anomaly.severity === 'medium',
                          'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800':
                            anomaly.severity === 'low',
                        })}
                      >
                        <p className="font-medium">{anomaly.targetName}</p>
                        <p className="text-xs opacity-75 mt-1">{anomaly.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                  title="Total Impressions"
                  value={(metrics.totalImpressions / 1000000).toFixed(2)}
                  unit="M"
                  change={5.2}
                  trend="up"
                  color="info"
                  loading={isLoading}
                />
                <MetricCard
                  title="Total Clicks"
                  value={(metrics.totalClicks / 1000).toFixed(1)}
                  unit="K"
                  change={3.8}
                  trend="up"
                  color="success"
                  loading={isLoading}
                />
                <MetricCard
                  title="Avg CTR"
                  value={metrics.avgCTR}
                  unit="%"
                  change={-1.2}
                  trend="down"
                  color="warning"
                  loading={isLoading}
                />
                <MetricCard
                  title="Total Cost"
                  value={`$${(metrics.totalCost / 1000).toFixed(1)}K`}
                  change={2.1}
                  trend="up"
                  color="danger"
                  loading={isLoading}
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PerformanceChart
                  type="area"
                  data={chartData}
                  xAxis="date"
                  yAxis={['impressions', 'clicks']}
                  title="Impressions & Clicks Over Time"
                  colors={['#f8b90c', '#06b6d4']}
                  height={300}
                  loading={isLoading}
                />
                <PerformanceChart
                  type="bar"
                  data={chartData}
                  xAxis="date"
                  yAxis={['cost', 'conversions']}
                  title="Cost vs Conversions"
                  colors={['#ef4444', '#10b981']}
                  height={300}
                  loading={isLoading}
                />
              </div>

              {/* Campaign Table */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Campaigns</h2>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-yandex-500 hover:bg-yandex-600 text-white rounded-lg font-medium transition-colors">
                      <Plus size={18} />
                      New Campaign
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors">
                      <Download size={18} />
                      Export
                    </button>
                  </div>
                </div>
                <CampaignTable
                  campaigns={campaigns}
                  onSelect={(campaign) => setSelectedCampaigns([campaign])}
                  loading={isLoading}
                />
              </div>

              {/* Bottom Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                  title="Conversion Rate"
                  value={(metrics.totalConversions > 0 ? ((metrics.totalConversions / metrics.totalClicks) * 100).toFixed(2) : 0)}
                  unit="%"
                  color="success"
                />
                <MetricCard
                  title="Avg ROAS"
                  value={metrics.avgROAS}
                  unit="x"
                  color="info"
                />
                <MetricCard
                  title="Active Campaigns"
                  value={campaigns.filter((c) => c.status === 'active').length}
                  color="default"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
