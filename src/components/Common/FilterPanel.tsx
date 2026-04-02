/**
 * FilterPanel
 * Advanced фильтры для dashboard'а
 */

import React, { useState } from 'react'
import { useFilterStore } from '@/store/filterStore'
import { ChevronDown, X } from 'lucide-react'

const FilterPanel: React.FC = () => {
  const {
    dateFrom,
    dateTo,
    setDateRange,
    selectedStatuses,
    setSelectedStatuses,
    reset,
  } = useFilterStore()

  const [isOpen, setIsOpen] = useState(false)

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => {
    const date = new Date(e.target.value)
    if (type === 'from') {
      setDateRange(date, dateTo)
    } else {
      setDateRange(dateFrom, date)
    }
  }

  const statuses = ['active', 'paused', 'ended', 'archived']

  return (
    <div className="px-6 py-3 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Date Range */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">From:</label>
          <input
            type="date"
            value={dateFrom.toISOString().split('T')[0]}
            onChange={(e) => handleDateChange(e, 'from')}
            className="input w-32 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">To:</label>
          <input
            type="date"
            value={dateTo.toISOString().split('T')[0]}
            onChange={(e) => handleDateChange(e, 'to')}
            className="input w-32 text-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-secondary text-sm flex items-center gap-2"
          >
            Status
            <ChevronDown className="w-4 h-4" />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg p-2 z-10">
              {statuses.map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStatuses([...selectedStatuses, status])
                      } else {
                        setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm capitalize text-gray-900 dark:text-white">
                    {status}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            reset()
            setIsOpen(false)
          }}
          className="btn btn-ghost text-sm flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  )
}

export default FilterPanel
