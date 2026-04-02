/**
 * Hook: useComparison
 * Логика сравнения периодов и кампаний
 */

import { useState, useCallback } from 'react'
import { PeriodComparison, CampaignComparison, Campaign, Metrics } from '@/types'
import { comparisonService } from '@/services/comparison.service'

export const useComparison = () => {
  const [comparison, setComparison] = useState<PeriodComparison | null>(null)
  const [loading, setLoading] = useState(false)

  const comparePeriods = useCallback(
    async (
      currentMetrics: Metrics,
      currentStart: Date,
      currentEnd: Date,
      previousMetrics: Metrics,
      previousStart: Date,
      previousEnd: Date
    ) => {
      setLoading(true)

      try {
        const result = comparisonService.comparePeriods(
          currentMetrics,
          currentStart,
          currentEnd,
          previousMetrics,
          previousStart,
          previousEnd
        )
        setComparison(result)
        return result
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const compareCampaigns = useCallback((campaigns: Campaign[]): CampaignComparison => {
    return comparisonService.compareCampaigns(campaigns)
  }, [])

  return {
    comparison,
    loading,
    comparePeriods,
    compareCampaigns,
  }
}
