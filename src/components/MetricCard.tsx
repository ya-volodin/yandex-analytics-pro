import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import clsx from 'clsx'

interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
  loading?: boolean
  color?: 'default' | 'success' | 'danger' | 'warning' | 'info'
  className?: string
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  change,
  trend = 'neutral',
  icon,
  loading = false,
  color = 'default',
  className,
}) => {
  const colorClasses = {
    default: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    success: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    danger: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    info: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  }

  const trendColor = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-slate-600 dark:text-slate-400',
  }

  return (
    <div className={clsx('card p-6', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            {title}
          </p>
          {loading ? (
            <div className="skeleton h-8 w-24 mb-2"></div>
          ) : (
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {value}
              {unit && <span className="text-lg ml-1 text-slate-500 dark:text-slate-400">{unit}</span>}
            </p>
          )}

          {change !== undefined && (
            <div className={clsx('flex items-center gap-2 text-sm font-medium', trendColor[trend])}>
              {trend === 'up' && <TrendingUp size={16} />}
              {trend === 'down' && <TrendingDown size={16} />}
              {trend === 'neutral' && <Minus size={16} />}
              <span>{change > 0 ? '+' : ''}{change.toFixed(1)}%</span>
            </div>
          )}
        </div>

        {icon && (
          <div className={clsx('p-3 rounded-lg', colorClasses[color])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
