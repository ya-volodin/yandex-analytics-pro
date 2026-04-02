export type ExportFormat = 'csv' | 'pdf' | 'excel' | 'google_sheets' | 'email'

export interface ExportConfig {
  format: ExportFormat
  includeMetrics: string[]
  dateRange: {
    startDate: Date
    endDate: Date
  }
  filters?: {
    campaigns?: string[]
    adGroups?: string[]
    status?: string
  }
  
  // For scheduled exports
  scheduled?: boolean
  frequency?: 'daily' | 'weekly' | 'monthly'
  recipients?: string[]
  
  // For Google Sheets
  spreadsheetId?: string
  sheetName?: string
}

export interface ExportResult {
  format: ExportFormat
  filename: string
  url?: string
  size: number
  createdAt: Date
  status: 'pending' | 'completed' | 'failed'
  error?: string
}

export interface ReportConfig {
  title: string
  description?: string
  metrics: string[]
  visualizations: 'charts' | 'tables' | 'both'
  groupBy?: 'campaign' | 'adGroup' | 'none'
  format: ExportFormat
  recipients?: string[]
}
