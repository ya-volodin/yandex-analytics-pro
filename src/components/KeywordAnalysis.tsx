import React, { useState } from 'react'
import { Keyword } from '@/types'
import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react'
import { mockDataService } from '@/services/mockDataService'
import clsx from 'clsx'

interface KeywordAnalysisProps {
  campaignId?: string
}

export const KeywordAnalysis: React.FC<KeywordAnalysisProps> = ({ campaignId }) => {
  const [sortBy, setSortBy] = useState<'ctr' | 'cpc' | 'conversions' | 'quality'>('ctr')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const keywords = campaignId
    ? mockDataService.getAllKeywords().filter((k) => k.campaignId === campaignId)
    : mockDataService.getAllKeywords()

  const sortedKeywords = [...keywords].sort((a, b) => {
    let aVal: number
    let bVal: number

    switch (sortBy) {
      case 'ctr':
        aVal = a.metrics.ctr
        bVal = b.metrics.ctr
        break
      case 'cpc':
        aVal = a.metrics.cpc
        bVal = b.metrics.cpc
        break
      case 'conversions':
        aVal = a.metrics.conversions
        bVal = b.metrics.conversions
        break
      case 'quality':
        aVal = a.qualityScore
        bVal = b.qualityScore
        break
      default:
        return 0
    }

    return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
  })

  const topPerformers = sortedKeywords.slice(0, 10)

  const getQualityColor = (score: number) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400'
    if (score >= 5) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getMatchTypeColor = (type: string) => {
    switch (type) {
      case 'exact':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
      case 'phrase':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
      case 'broad':
        return 'bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-300'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Sort Controls */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Keyword Analysis</h2>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="ctr">Sort by CTR</option>
              <option value="cpc">Sort by CPC</option>
              <option value="conversions">Sort by Conversions</option>
              <option value="quality">Sort by Quality Score</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              {sortOrder === 'desc' ? <ArrowDown size={20} /> : <ArrowUp size={20} />}
            </button>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-400">
          Total Keywords: <span className="font-bold text-slate-900 dark:text-white">{keywords.length}</span>
        </p>
      </div>

      {/* Keywords Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">Keyword</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">Match Type</th>
                <th className="px-6 py-3 text-right font-semibold text-slate-900 dark:text-white">CTR</th>
                <th className="px-6 py-3 text-right font-semibold text-slate-900 dark:text-white">CPC</th>
                <th className="px-6 py-3 text-right font-semibold text-slate-900 dark:text-white">Quality Score</th>
                <th className="px-6 py-3 text-right font-semibold text-slate-900 dark:text-white">Conversions</th>
                <th className="px-6 py-3 text-right font-semibold text-slate-900 dark:text-white">Bid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {sortedKeywords.map((keyword) => (
                <tr key={keyword.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{keyword.text}</td>
                  <td className="px-6 py-4">
                    <span
                      className={clsx('px-3 py-1 rounded-full text-xs font-semibold capitalize', getMatchTypeColor(keyword.matchType))}
                    >
                      {keyword.matchType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-900 dark:text-white font-semibold">
                    {keyword.metrics.ctr.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">
                    ${keyword.metrics.cpc.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={clsx('font-bold', getQualityColor(keyword.qualityScore))}>
                      {keyword.qualityScore}/10
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-900 dark:text-white font-medium">
                    {keyword.metrics.conversions}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">
                    ${keyword.bid.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performers Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Top Keywords by CTR
          </h3>
          <div className="space-y-3">
            {topPerformers.slice(0, 5).map((keyword, idx) => (
              <div key={keyword.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">#{idx + 1}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{keyword.text}</p>
                </div>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {keyword.metrics.ctr.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Keyword Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm font-medium text-green-900 dark:text-green-200">High Quality Keywords</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">
                {keywords.filter((k) => k.qualityScore >= 8).length}
              </p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">Low Quality Keywords</p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mt-1">
                {keywords.filter((k) => k.qualityScore < 5).length}
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">Avg Quality Score</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
                {(keywords.reduce((sum, k) => sum + k.qualityScore, 0) / keywords.length).toFixed(1)}/10
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
