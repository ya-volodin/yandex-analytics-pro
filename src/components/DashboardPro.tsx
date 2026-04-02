/**
 * DashboardPro
 * Главный dashboard с draggable widgets
 */

import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useDashboardStore } from '@/store/dashboardStore'
import { useThemeStore } from '@/store/themeStore'
import { useFilterStore } from '@/store/filterStore'
import { Widget, Campaign, Metrics, Alert } from '@/types'
import { useCampaigns } from '@/hooks/useCampaigns'
import { useMetrics } from '@/hooks/useMetrics'
import { yandexApiService } from '@/services/yandex-api.service'
import { anomalyDetectionService } from '@/services/anomaly-detection.service'
import { analyticsService } from '@/services/analytics.service'
import MetricsGrid from './MetricsGrid'
import AlertsPanel from './Common/AlertsPanel'
import FilterPanel from './Common/FilterPanel'
import ThemeToggle from './Common/ThemeToggle'
import { Menu, LayoutDashboard, RefreshCw } from 'lucide-react'

const DashboardPro: React.FC = () => {
  const { loadFromLocalStorage: loadDashboard, widgets, isRefreshing, setIsRefreshing } = useDashboardStore()
  const { loadFromLocalStorage: loadTheme } = useThemeStore()
  const { dateFrom, dateTo } = useFilterStore()
  
  const { campaigns, loading: campaignsLoading } = useCampaigns(dateFrom, dateTo)
  const { metrics, loading: metricsLoading } = useMetrics(dateFrom, dateTo)
  const [alerts, setAlerts] = useState<Alert[]>([])

  // Load persisted state
  useEffect(() => {
    loadDashboard()
    loadTheme()
  }, [])

  // Generate alerts
  useEffect(() => {
    if (!campaigns || campaigns.length === 0) return

    const newAlerts: Alert[] = []

    // Check each campaign for issues
    campaigns.forEach((campaign) => {
      const health = analyticsService.calculateCampaignHealth(campaign)
      
      if (health.status === 'poor') {
        newAlerts.push({
          id: `alert_${campaign.id}`,
          type: 'low_performance',
          severity: 'critical',
          title: `${campaign.name} has poor health`,
          message: `Health score: ${health.score}/100`,
          timestamp: new Date(),
          read: false,
          acknowledged: false,
          campaignId: campaign.id,
        })
      }

      // CTR anomaly detection
      if (campaign.metrics.ctr < 0.5) {
        newAlerts.push({
          id: `alert_ctr_${campaign.id}`,
          type: 'ctr_drop',
          severity: 'warning',
          title: `Low CTR in ${campaign.name}`,
          message: `CTR: ${campaign.metrics.ctr.toFixed(2)}%`,
          timestamp: new Date(),
          read: false,
          acknowledged: false,
          campaignId: campaign.id,
        })
      }
    })

    setAlerts(newAlerts)
  }, [campaigns])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Trigger refetch
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const isLoading = campaignsLoading || metricsLoading

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Analytics Pro
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="btn btn-secondary flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <ThemeToggle />
            <button className="btn btn-ghost">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterPanel />
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="mb-6">
              <AlertsPanel alerts={alerts} />
            </div>
          )}

          {/* Metrics Grid */}
          {metrics && !isLoading && (
            <div className="mb-6">
              <MetricsGrid metrics={metrics} campaigns={campaigns} />
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="card-lg text-center py-12">
              <div className="inline-block spinner mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
            </div>
          )}

          {/* Widgets Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {widgets.map((widget) => (
                <div key={widget.id} className="card-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    {widget.title}
                  </h3>
                  <div className="h-64 bg-gray-100 dark:bg-slate-800 rounded animate-pulse" />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default DashboardPro
