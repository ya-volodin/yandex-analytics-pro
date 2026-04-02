/**
 * Hook: useMetrics
 * Загрузка и управление метриками
 */

import { useState, useEffect, useCallback } from 'react'
import { Metrics } from '@/types'
import { yandexApiService } from '@/services/yandex-api.service'
import { metricsService } from '@/services/metrics.service'

export const useMetrics = (dateFrom: Date, dateTo: Date) => {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Get campaigns with metrics
      const campaigns = await yandexApiService.getCampaigns(dateFrom, dateTo)

      // Aggregate metrics from all campaigns
      if (campaigns.length === 0) {
        setMetrics(null)
        return
      }

      const aggregated = campaigns.reduce((acc, campaign) => ({
        impressions: acc.impressions + campaign.metrics.impressions,
        clicks: acc.clicks + campaign.metrics.clicks,
        cost: acc.cost + campaign.metrics.cost,
        conversions: acc.conversions + campaign.metrics.conversions,
        conversionValue: acc.conversionValue + campaign.metrics.conversionValue,
        ctr: 0,
        cpc: 0,
        cpm: 0,
        conversionRate: 0,
        cpa: 0,
        roas: 0,
        qualityScore: acc.qualityScore + campaign.metrics.qualityScore,
        avgPosition: acc.avgPosition + campaign.metrics.avgPosition,
        impressionShare: 0,
        clickShare: 0,
        budgetSpent: acc.budgetSpent + campaign.metrics.budgetSpent,
        budgetRemaining: acc.budgetRemaining + campaign.metrics.budgetRemaining,
        budgetUtilization: 0,
        effectiveCPM: 0,
        bounceRate: acc.bounceRate + campaign.metrics.bounceRate,
        avgSessionDuration: acc.avgSessionDuration + campaign.metrics.avgSessionDuration,
        engagementRate: acc.engagementRate + campaign.metrics.engagementRate,
        viewThroughRate: acc.viewThroughRate + campaign.metrics.viewThroughRate,
      }))

      // Recalculate derived metrics
      const calculated = metricsService.calculateMetrics({
        ...aggregated,
        budget: aggregated.budgetSpent + aggregated.budgetRemaining,
      })

      setMetrics(calculated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics')
      console.error('Error fetching metrics:', err)
    } finally {
      setLoading(false)
    }
  }, [dateFrom, dateTo])

  useEffect(() => {
    fetchMetrics()

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [fetchMetrics])

  return { metrics, loading, error, refetch: fetchMetrics }
}
