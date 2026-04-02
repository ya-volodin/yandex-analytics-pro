/**
 * Calculation Utilities
 */

export const calculateChange = (current: number, previous: number): number => {
  if (previous === 0) return 0
  return ((current - previous) / Math.abs(previous)) * 100
}

export const calculateGrowth = (current: number, previous: number): number => {
  return calculateChange(current, previous)
}

export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}

export const calculateSum = (values: number[]): number => {
  return values.reduce((a, b) => a + b, 0)
}

export const calculateMin = (values: number[]): number => {
  return Math.min(...values)
}

export const calculateMax = (values: number[]): number => {
  return Math.max(...values)
}

export const calculateMedian = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export const calculateStandardDeviation = (values: number[]): number => {
  const avg = calculateAverage(values)
  const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length
  return Math.sqrt(variance)
}

export const isPositiveChange = (change: number, metric: string): boolean => {
  const negativeMetrics = ['cost', 'cpc', 'cpa', 'cpm', 'bounce_rate']
  const isNegativeMetric = negativeMetrics.some((m) => metric.toLowerCase().includes(m))

  return isNegativeMetric ? change < 0 : change > 0
}

export const getDaysInRange = (from: Date, to: Date): number => {
  const diffTime = Math.abs(to.getTime() - from.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export const getLastNDays = (n: number): Date[] => {
  const dates: Date[] = []
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date)
  }
  return dates
}

export const getWeekDates = (date: Date): { start: Date; end: Date } => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const start = new Date(d.setDate(diff))
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return { start, end }
}

export const getMonthDates = (date: Date): { start: Date; end: Date } => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 0)
  return { start, end }
}

export const calculateROI = (revenue: number, cost: number): number => {
  if (cost === 0) return 0
  return ((revenue - cost) / cost) * 100
}

export const calculateLTV = (avgOrderValue: number, repeatPurchaseRate: number, avgRepurchases: number): number => {
  return avgOrderValue * (1 + repeatPurchaseRate * avgRepurchases)
}

export const calculateCAC = (cost: number, conversions: number): number => {
  if (conversions === 0) return 0
  return cost / conversions
}

export const calculateLTVtoCAC = (ltv: number, cac: number): number => {
  if (cac === 0) return 0
  return ltv / cac
}

export const calculatePaybackPeriod = (cac: number, monthlyRevenue: number): number => {
  if (monthlyRevenue === 0) return Infinity
  return cac / monthlyRevenue
}
