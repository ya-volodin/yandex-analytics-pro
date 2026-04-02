import React from 'react'
import { Anomaly } from '@/types'
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'
import clsx from 'clsx'

interface AnomalyDetectionProps {
  anomalies: Anomaly[]
  onSelect?: (anomaly: Anomaly) => void
}

export const AnomalyDetection: React.FC<AnomalyDetectionProps> = ({ anomalies, onSelect }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
      case 'medium':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
      case 'low':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
      default:
        return ''
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
      case 'low':
        return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
      default:
        return ''
    }
  }

  if (anomalies.length === 0) {
    return (
      <div className="card p-12 text-center">
        <AlertCircle size={48} className="mx-auto text-green-500 mb-4 opacity-50" />
        <p className="text-slate-600 dark:text-slate-400 text-lg">No anomalies detected</p>
        <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">Your campaigns are running smoothly</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {anomalies.map((anomaly) => (
        <div
          key={anomaly.id}
          onClick={() => onSelect?.(anomaly)}
          className={clsx(
            'card p-6 border-2 transition-all cursor-pointer hover:shadow-card-hover',
            getSeverityColor(anomaly.severity)
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <AlertCircle size={24} className="mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{anomaly.targetName}</h3>
                <p className="text-sm opacity-75 mt-1">{anomaly.message}</p>
              </div>
            </div>
            <span className={clsx('px-3 py-1 rounded-full text-xs font-semibold capitalize', getSeverityBadge(anomaly.severity))}>
              {anomaly.severity}
            </span>
          </div>

          {/* Metric Details */}
          <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-current opacity-75">
            <div>
              <p className="text-xs opacity-75 uppercase tracking-wide mb-1">Metric</p>
              <p className="font-semibold">{anomaly.metric}</p>
            </div>
            <div>
              <p className="text-xs opacity-75 uppercase tracking-wide mb-1">Actual Value</p>
              <p className="font-semibold">{anomaly.actualValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs opacity-75 uppercase tracking-wide mb-1">Change</p>
              <div className="flex items-center gap-1">
                {anomaly.change > 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                <p className="font-semibold">{anomaly.change > 0 ? '+' : ''}{anomaly.change.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Expected Range */}
          <div className="mb-4">
            <p className="text-xs opacity-75 uppercase tracking-wide mb-2">Expected Range</p>
            <div className="flex items-center gap-2">
              <span className="text-sm">{anomaly.expectedRange[0].toFixed(2)}</span>
              <div className="flex-1 bg-current opacity-20 rounded-full h-2">
                <div
                  className="bg-current opacity-50 h-2 rounded-full transition-all"
                  style={{
                    left: `${((anomaly.expectedRange[0] / anomaly.expectedRange[1]) * 100).toFixed(1)}%`,
                    width: `${(((anomaly.expectedRange[1] - anomaly.expectedRange[0]) / anomaly.expectedRange[1]) * 100).toFixed(1)}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm">{anomaly.expectedRange[1].toFixed(2)}</span>
            </div>
          </div>

          {/* Suggestions */}
          {anomaly.suggestions && anomaly.suggestions.length > 0 && (
            <div className="pt-4 border-t border-current opacity-75">
              <p className="text-xs opacity-75 uppercase tracking-wide mb-2">Suggested Actions</p>
              <ul className="space-y-1">
                {anomaly.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-sm opacity-90 flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
