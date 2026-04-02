/**
 * Color Utilities
 */

export const colors = {
  primary: '#0066ff',
  success: '#00cc00',
  warning: '#ff9900',
  danger: '#ff3333',
  
  // Gradients
  gradients: {
    success: 'linear-gradient(135deg, #00cc00 0%, #00aa00 100%)',
    warning: 'linear-gradient(135deg, #ff9900 0%, #ff7700 100%)',
    danger: 'linear-gradient(135deg, #ff3333 0%, #ff0000 100%)',
    primary: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
  },
}

export const getMetricColor = (metric: string, value: number, threshold: number): string => {
  const isPositiveMetric = ![
    'cost',
    'cpc',
    'cpa',
    'cpm',
    'bounce_rate',
  ].some((m) => metric.toLowerCase().includes(m))

  if (isPositiveMetric) {
    return value >= threshold ? colors.success : colors.warning
  } else {
    return value <= threshold ? colors.success : colors.warning
  }
}

export const getStatusColor = (status: 'active' | 'paused' | 'ended' | 'archived'): string => {
  switch (status) {
    case 'active':
      return colors.success
    case 'paused':
      return colors.warning
    case 'ended':
      return '#999999'
    case 'archived':
      return '#666666'
    default:
      return '#999999'
  }
}

export const getChangeColor = (change: number, metric: string): string => {
  const isPositiveMetric = ![
    'cost',
    'cpc',
    'cpa',
    'cpm',
    'bounce_rate',
  ].some((m) => metric.toLowerCase().includes(m))

  if (isPositiveMetric) {
    return change > 0 ? colors.success : colors.danger
  } else {
    return change < 0 ? colors.success : colors.danger
  }
}

export const getTrendColor = (
  trend: 'up' | 'down' | 'stable'
): string => {
  switch (trend) {
    case 'up':
      return colors.success
    case 'down':
      return colors.danger
    case 'stable':
      return colors.warning
    default:
      return '#999999'
  }
}

export const getSeverityColor = (severity: 'info' | 'warning' | 'critical'): string => {
  switch (severity) {
    case 'info':
      return '#3399ff'
    case 'warning':
      return colors.warning
    case 'critical':
      return colors.danger
    default:
      return '#999999'
  }
}

export const getHealthColor = (score: number): string => {
  if (score >= 80) return colors.success
  if (score >= 60) return colors.warning
  if (score >= 40) return '#ff9900'
  return colors.danger
}

export const getPercentColor = (percent: number): string => {
  if (percent >= 75) return colors.success
  if (percent >= 50) return colors.warning
  if (percent >= 25) return '#ff9900'
  return colors.danger
}

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

export const lightenColor = (color: string, percent: number): string => {
  const rgb = hexToRgb(color)
  if (!rgb) return color

  const r = Math.min(255, rgb.r + (255 - rgb.r) * (percent / 100))
  const g = Math.min(255, rgb.g + (255 - rgb.g) * (percent / 100))
  const b = Math.min(255, rgb.b + (255 - rgb.b) * (percent / 100))

  return rgbToHex(Math.round(r), Math.round(g), Math.round(b))
}

export const darkenColor = (color: string, percent: number): string => {
  const rgb = hexToRgb(color)
  if (!rgb) return color

  const r = Math.max(0, rgb.r * (1 - percent / 100))
  const g = Math.max(0, rgb.g * (1 - percent / 100))
  const b = Math.max(0, rgb.b * (1 - percent / 100))

  return rgbToHex(Math.round(r), Math.round(g), Math.round(b))
}
