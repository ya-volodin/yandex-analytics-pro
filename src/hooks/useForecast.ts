/**
 * Hook: useForecast
 * Прогнозирование данных
 */

import { useState, useCallback } from 'react'
import { Forecast, ForecastConfig, Metrics } from '@/types'
import { forecastService } from '@/services/forecast.service'

export const useForecast = () => {
  const [forecast, setForecast] = useState<Forecast | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateForecast = useCallback(
    async (config: ForecastConfig, historicalValues: number[], dates: Date[]) => {
      setLoading(true)
      setError(null)

      try {
        const result = forecastService.generateForecast(config, historicalValues, dates)
        setForecast(result)
        return result
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Forecast generation failed'
        setError(message)
        console.error('Forecast error:', err)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const generateQuickForecasts = useCallback((metrics: Metrics) => {
    return forecastService.generateQuickForecasts(metrics)
  }, [])

  return {
    forecast,
    loading,
    error,
    generateForecast,
    generateQuickForecasts,
  }
}
