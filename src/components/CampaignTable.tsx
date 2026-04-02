import React, { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronUpDown } from 'lucide-react'
import { Campaign } from '@/types'
import clsx from 'clsx'

type SortKey = keyof Campaign
type SortOrder = 'asc' | 'desc'

interface CampaignTableProps {
  campaigns: Campaign[]
  onSelect?: (campaign: Campaign) => void
  loading?: boolean
}

export const CampaignTable: React.FC<CampaignTableProps> = ({
  campaigns,
  onSelect,
  loading = false,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    const aVal = a[sortKey]
    const bVal = b[sortKey]

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    }

    const aStr = String(aVal).toLowerCase()
    const bStr = String(bVal).toLowerCase()

    return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
  })

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ChevronUpDown size={16} className="text-slate-400" />
    return sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
      case 'paused':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
      case 'archived':
        return 'bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-300'
      default:
        return 'bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-300'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'search':
        return 'text-blue-600 dark:text-blue-400'
      case 'display':
        return 'text-purple-600 dark:text-purple-400'
      case 'shopping':
        return 'text-green-600 dark:text-green-400'
      case 'video':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-slate-600 dark:text-slate-400'
    }
  }

  if (loading) {
    return (
      <div className="card p-6">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-12 w-full rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 hover:text-yandex-500"
                >
                  Name <SortIcon column="name" />
                </button>
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">
                Type
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-2 hover:text-yandex-500"
                >
                  Status <SortIcon column="status" />
                </button>
              </th>
              <th className="px-6 py-3 text-right font-semibold text-slate-900 dark:text-white">
                <button
                  onClick={() => handleSort('metrics')}
                  className="flex items-center justify-end gap-2 hover:text-yandex-500 w-full"
                >
                  CTR (%) <SortIcon column="metrics" />
                </button>
              </th>
              <th className="px-6 py-3 text-right font-semibold text-slate-900 dark:text-white">
                Cost
              </th>
              <th className="px-6 py-3 text-right font-semibold text-slate-900 dark:text-white">
                Conv.
              </th>
              <th className="px-6 py-3 text-right font-semibold text-slate-900 dark:text-white">
                ROAS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {sortedCampaigns.map((campaign) => (
              <tr
                key={campaign.id}
                onClick={() => onSelect?.(campaign)}
                className={clsx('hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors', {
                  'cursor-pointer': !!onSelect,
                })}
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 dark:text-white">{campaign.name}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={clsx('capitalize text-sm font-medium', getTypeColor(campaign.type))}>
                    {campaign.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={clsx(
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      getStatusColor(campaign.status)
                    )}
                  >
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">
                  {campaign.metrics.ctr.toFixed(2)}%
                </td>
                <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">
                  ${campaign.metrics.cost.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">
                  {campaign.metrics.conversions}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={campaign.metrics.roas > 1 ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-red-600 dark:text-red-400'}>
                    {campaign.metrics.roas.toFixed(2)}x
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          No campaigns found
        </div>
      )}
    </div>
  )
}
