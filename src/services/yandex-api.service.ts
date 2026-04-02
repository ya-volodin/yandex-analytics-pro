/**
 * Yandex.Direct API Service
 * Работа с API Яндекс.Директ
 */

import axios, { AxiosInstance } from 'axios'
import { Campaign, Ad, Keyword, SearchTerm, Metrics } from '@/types'
import { cacheService } from './cache.service'

class YandexApiService {
  private api: AxiosInstance
  private accessToken: string = ''
  private clientLogin: string = ''

  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.direct.yandex.com/json/v5',
      timeout: 30000,
    })
  }

  setCredentials(accessToken: string, clientLogin: string): void {
    this.accessToken = accessToken
    this.clientLogin = clientLogin
    this.api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    this.api.defaults.headers.common['Client-Login'] = clientLogin
  }

  /**
   * Get campaigns with metrics
   */
  async getCampaigns(dateFrom: Date, dateTo: Date): Promise<Campaign[]> {
    const cacheKey = `campaigns_${dateFrom.getTime()}_${dateTo.getTime()}`
    const cached = cacheService.get<Campaign[]>(cacheKey)
    if (cached) return cached

    try {
      const response = await this.api.post('/campaigns', {
        method: 'get',
        params: {
          SelectionCriteria: {},
          FieldNames: [
            'Id',
            'Name',
            'Status',
            'State',
            'Type',
            'DailyBudget',
            'NotificationEmail',
            'StartDate',
            'EndDate',
          ],
        },
      })

      // Get statistics for campaigns
      const campaignIds = response.data.result.Campaigns.map((c: any) => c.Id)
      const stats = await this.getCampaignStats(campaignIds, dateFrom, dateTo)

      const campaigns: Campaign[] = response.data.result.Campaigns.map((c: any) => ({
        id: c.Id.toString(),
        name: c.Name,
        status: (c.Status === 'ON' ? 'active' : 'paused') as any,
        type: c.Type.toLowerCase() as any,
        budget: c.DailyBudget?.Amount || 0,
        budgetType: 'daily',
        startDate: new Date(c.StartDate),
        endDate: c.EndDate ? new Date(c.EndDate) : undefined,
        metrics: stats[c.Id] || this.getEmptyMetrics(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

      cacheService.set(cacheKey, campaigns, 300)
      return campaigns
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      throw error
    }
  }

  /**
   * Get ads
   */
  async getAds(campaignId: string): Promise<Ad[]> {
    const cacheKey = `ads_${campaignId}`
    const cached = cacheService.get<Ad[]>(cacheKey)
    if (cached) return cached

    try {
      // Mock data - в реальном приложении использовать API
      const ads: Ad[] = []
      cacheService.set(cacheKey, ads, 300)
      return ads
    } catch (error) {
      console.error('Error fetching ads:', error)
      throw error
    }
  }

  /**
   * Get keywords
   */
  async getKeywords(campaignId: string): Promise<Keyword[]> {
    const cacheKey = `keywords_${campaignId}`
    const cached = cacheService.get<Keyword[]>(cacheKey)
    if (cached) return cached

    try {
      // Mock data
      const keywords: Keyword[] = []
      cacheService.set(cacheKey, keywords, 300)
      return keywords
    } catch (error) {
      console.error('Error fetching keywords:', error)
      throw error
    }
  }

  /**
   * Get search terms report
   */
  async getSearchTerms(campaignId: string, dateFrom: Date, dateTo: Date): Promise<SearchTerm[]> {
    const cacheKey = `search_terms_${campaignId}_${dateFrom.getTime()}_${dateTo.getTime()}`
    const cached = cacheService.get<SearchTerm[]>(cacheKey)
    if (cached) return cached

    try {
      // Mock data
      const terms: SearchTerm[] = []
      cacheService.set(cacheKey, terms, 600)
      return terms
    } catch (error) {
      console.error('Error fetching search terms:', error)
      throw error
    }
  }

  /**
   * Private helper: Get campaign statistics
   */
  private async getCampaignStats(
    campaignIds: number[],
    dateFrom: Date,
    dateTo: Date
  ): Promise<Record<number, Metrics>> {
    const stats: Record<number, Metrics> = {}

    try {
      const response = await this.api.post('/reports', {
        method: 'get',
        params: {
          SelectionCriteria: {
            DateFrom: this.formatDate(dateFrom),
            DateTo: this.formatDate(dateTo),
            CampaignIds: campaignIds,
          },
          FieldNames: [
            'CampaignId',
            'Impressions',
            'Clicks',
            'Cost',
            'Conversions',
            'ConversionRate',
            'AvgCpc',
            'Ctr',
            'AvgPosition',
          ],
          ReportType: 'CAMPAIGN_PERFORMANCE_REPORT',
          DateRangeType: 'CUSTOM_DATE',
          Format: 'JSON',
        },
      })

      response.data.result.forEach((row: any) => {
        stats[row.CampaignId] = {
          impressions: row.Impressions || 0,
          clicks: row.Clicks || 0,
          ctr: row.Ctr || 0,
          cpc: row.AvgCpc || 0,
          cpm: (row.Cost || 0) / ((row.Impressions || 1) / 1000),
          conversions: row.Conversions || 0,
          conversionRate: row.ConversionRate || 0,
          conversionValue: 0,
          cpa: 0,
          roas: 0,
          qualityScore: 0,
          avgPosition: row.AvgPosition || 0,
          impressionShare: 0,
          clickShare: 0,
          cost: row.Cost || 0,
          budgetSpent: row.Cost || 0,
          budgetRemaining: 0,
          budgetUtilization: 0,
          effectiveCPM: 0,
          bounceRate: 0,
          avgSessionDuration: 0,
          engagementRate: 0,
          viewThroughRate: 0,
        }
      })
    } catch (error) {
      console.error('Error fetching campaign stats:', error)
    }

    return stats
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  private getEmptyMetrics(): Metrics {
    return {
      impressions: 0,
      clicks: 0,
      ctr: 0,
      cpc: 0,
      cpm: 0,
      conversions: 0,
      conversionRate: 0,
      conversionValue: 0,
      cpa: 0,
      roas: 0,
      qualityScore: 0,
      avgPosition: 0,
      impressionShare: 0,
      clickShare: 0,
      cost: 0,
      budgetSpent: 0,
      budgetRemaining: 0,
      budgetUtilization: 0,
      effectiveCPM: 0,
      bounceRate: 0,
      avgSessionDuration: 0,
      engagementRate: 0,
      viewThroughRate: 0,
    }
  }
}

export const yandexApiService = new YandexApiService()
