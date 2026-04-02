/**
 * Hook: useExport
 * Управление экспортом данных
 */

import { useState, useCallback } from 'react'
import { ExportConfig, ExportResult } from '@/types'
import { exportService } from '@/services/export.service'

export const useExport = () => {
  const [exporting, setExporting] = useState(false)
  const [result, setResult] = useState<ExportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const exportData = useCallback(
    async (format: 'csv' | 'excel' | 'pdf', data: any[], columns: string[], filename: string) => {
      setExporting(true)
      setError(null)

      try {
        let result: ExportResult

        switch (format) {
          case 'csv':
            result = exportService.exportToCSV(data, columns, filename)
            break
          case 'excel':
            result = await exportService.exportToExcel(data, columns, filename)
            break
          case 'pdf':
            result = await exportService.exportToPDF(JSON.stringify(data), filename)
            break
          default:
            throw new Error('Unsupported format')
        }

        setResult(result)
        return result
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Export failed'
        setError(message)
        console.error('Export error:', err)
      } finally {
        setExporting(false)
      }
    },
    []
  )

  return {
    exporting,
    result,
    error,
    exportData,
  }
}
