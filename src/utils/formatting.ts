/**
 * Formatting Utilities
 */

export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(value)
}

export const formatNumber = (value: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value)
}

export const formatPercent = (value: number, decimals: number = 1): string => {
  return `${formatNumber(value, decimals)}%`
}

export const formatDate = (date: Date, format: string = 'short'): string => {
  const options: any = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  }

  return new Intl.DateTimeFormat('en-US', options[format] || options.short).format(date)
}

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
}

export const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} ${formatTime(date)}`
}

export const formatChange = (change: number): string => {
  const sign = change > 0 ? '+' : ''
  return `${sign}${formatNumber(change, 2)}%`
}

export const formatMetricValue = (value: number, metric: string): string => {
  if (metric.includes('ctr') || metric.includes('rate') || metric.includes('share')) {
    return formatPercent(value, 2)
  }
  if (metric.includes('cost') || metric.includes('cpa') || metric.includes('cpc')) {
    return formatCurrency(value)
  }
  if (metric.includes('cpm') || metric.includes('roas')) {
    return formatNumber(value, 2)
  }
  return formatNumber(value, 0)
}

export const abbreviateNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toFixed(0)
}

export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}
