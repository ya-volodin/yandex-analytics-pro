export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  
  role: 'admin' | 'manager' | 'analyst' | 'viewer'
  
  preferences: {
    theme: 'dark' | 'light' | 'auto'
    timezone: string
    language: 'en' | 'ru'
    defaultMetrics: string[]
    defaultDashboardLayout: string
  }
  
  permissions: {
    viewAllCampaigns: boolean
    editCampaigns: boolean
    editBudgets: boolean
    viewReports: boolean
    exportData: boolean
    manageAlerts: boolean
  }
  
  createdAt: Date
  lastLoginAt?: Date
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'auto'
  timezone: string
  language: string
  defaultMetrics: string[]
  emailNotifications: boolean
  slackIntegration?: {
    webhookUrl: string
    enabled: boolean
  }
  googleSheetsIntegration?: {
    enabled: boolean
    defaultSpreadsheetId: string
  }
}

export interface UserActivity {
  userId: string
  action: string
  resource: string
  timestamp: Date
  details?: Record<string, any>
}
