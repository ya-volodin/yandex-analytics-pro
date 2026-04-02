export type WidgetType =
  | 'metrics_grid'
  | 'campaign_comparator'
  | 'ad_performance'
  | 'keyword_analyzer'
  | 'period_comparison'
  | 'heatmap'
  | 'treemap'
  | 'waterfall'
  | 'sankey'
  | 'gauge'
  | 'alerts'
  | 'forecast'
  | 'trends'
  | 'top_performers'

export interface Widget {
  id: string
  type: WidgetType
  title: string
  position: {
    x: number
    y: number
  }
  size: {
    width: number // in grid units
    height: number
  }
  config?: {
    metrics?: string[]
    campaigns?: string[]
    filters?: Record<string, any>
    chartType?: 'bar' | 'line' | 'pie' | 'area'
  }
  isHidden?: boolean
  isPinned?: boolean
}

export interface DashboardLayout {
  id: string
  name: string
  description?: string
  widgets: Widget[]
  preset?: 'manager' | 'analyst' | 'specialist' | 'custom'
  isDefault?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface DashboardConfig {
  userId: string
  layouts: DashboardLayout[]
  activeLayoutId: string
  autoRefreshInterval: number // ms
  theme: 'dark' | 'light'
  compactMode: boolean
}

export interface DashboardMetrics {
  totalWidgets: number
  activeFilters: number
  lastRefresh: Date
  refreshing: boolean
  dataQuality: number // 0-100
}
