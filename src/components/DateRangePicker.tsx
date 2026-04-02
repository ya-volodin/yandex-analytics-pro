import React from 'react'
import { Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { useDashboardStore } from '@/store/dashboardStore'

interface DateRangePickerProps {
  onDateChange?: (startDate: Date, endDate: Date) => void
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateChange }) => {
  const { filters, setFilters } = useDashboardStore()

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value)
    setFilters({
      dateRange: {
        ...filters.dateRange,
        startDate: newDate,
      },
    })
    onDateChange?.(newDate, filters.dateRange.endDate)
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value)
    setFilters({
      dateRange: {
        ...filters.dateRange,
        endDate: newDate,
      },
    })
    onDateChange?.(filters.dateRange.startDate, newDate)
  }

  const presetRanges = [
    { label: 'Today', days: 0 },
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
  ]

  const handlePreset = (days: number) => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    setFilters({
      dateRange: {
        startDate,
        endDate,
      },
    })
    onDateChange?.(startDate, endDate)
  }

  return (
    <div className="card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
        <Calendar size={20} />
        Date Range
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={format(filters.dateRange.startDate, 'yyyy-MM-dd')}
            onChange={handleStartDateChange}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-yandex-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={format(filters.dateRange.endDate, 'yyyy-MM-dd')}
            onChange={handleEndDateChange}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-yandex-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {presetRanges.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePreset(preset.days)}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}
