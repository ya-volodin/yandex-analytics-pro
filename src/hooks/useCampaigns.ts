/**
 * Hook: useCampaigns
 * Загрузка и управление кампаниями
 */

import { useState, useEffect, useCallback } from 'react'
import { Campaign } from '@/types'
import { yandexApiService } from '@/services/yandex-api.service'

export const useCampaigns = (dateFrom: Date, dateTo: Date) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCampaigns = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await yandexApiService.getCampaigns(dateFrom, dateTo)
      setCampaigns(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns')
      console.error('Error fetching campaigns:', err)
    } finally {
      setLoading(false)
    }
  }, [dateFrom, dateTo])

  useEffect(() => {
    fetchCampaigns()

    // Auto-refresh
    const interval = setInterval(fetchCampaigns, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchCampaigns])

  const getCampaign = useCallback(
    (id: string) => {
      return campaigns.find((c) => c.id === id)
    },
    [campaigns]
  )

  const getCampaignsByStatus = useCallback(
    (status: 'active' | 'paused' | 'ended' | 'archived') => {
      return campaigns.filter((c) => c.status === status)
    },
    [campaigns]
  )

  return {
    campaigns,
    loading,
    error,
    refetch: fetchCampaigns,
    getCampaign,
    getCampaignsByStatus,
  }
}
