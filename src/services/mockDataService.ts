import { Campaign, AdGroup, Ad, Keyword, Metric, Anomaly, Forecast } from '@/types'
import { addDays, subDays } from 'date-fns'

// Generate mock metrics
export const generateMockMetric = (override?: Partial<Metric>): Metric => ({
  impressions: Math.floor(Math.random() * 50000) + 5000,
  clicks: Math.floor(Math.random() * 5000) + 100,
  ctr: parseFloat((Math.random() * 10 + 0.5).toFixed(2)),
  cpc: parseFloat((Math.random() * 50 + 5).toFixed(2)),
  cpm: parseFloat((Math.random() * 100 + 10).toFixed(2)),
  roas: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
  conversionRate: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
  cpa: parseFloat((Math.random() * 100 + 10).toFixed(2)),
  qualityScore: Math.floor(Math.random() * 10) + 1,
  avgPosition: parseFloat((Math.random() * 5 + 1).toFixed(2)),
  impressionsShare: parseFloat((Math.random() * 100).toFixed(2)),
  clickShare: parseFloat((Math.random() * 100).toFixed(2)),
  cost: parseFloat((Math.random() * 10000 + 1000).toFixed(2)),
  budgetSpent: parseFloat((Math.random() * 5000 + 500).toFixed(2)),
  conversions: Math.floor(Math.random() * 200) + 10,
  convValue: parseFloat((Math.random() * 50000 + 5000).toFixed(2)),
  costPerConv: parseFloat((Math.random() * 500 + 50).toFixed(2)),
  effectiveCPM: parseFloat((Math.random() * 100 + 10).toFixed(2)),
  bounceRate: parseFloat((Math.random() * 70 + 10).toFixed(2)),
  avgSessionDuration: Math.floor(Math.random() * 600) + 30,
  ...override,
})

// Generate mock campaigns
export const generateMockCampaigns = (count: number = 10): Campaign[] => {
  const types = ['search', 'display', 'shopping', 'video'] as const
  const campaigns: Campaign[] = []

  for (let i = 0; i < count; i++) {
    campaigns.push({
      id: `campaign_${i + 1}`,
      name: `Campaign ${i + 1}: ${['Search', 'Display', 'Shopping', 'Video'][i % 4]} Campaign`,
      type: types[i % types.length],
      status: Math.random() > 0.2 ? 'active' : 'paused',
      startDate: subDays(new Date(), Math.floor(Math.random() * 90) + 30),
      endDate: null,
      budget: Math.floor(Math.random() * 50000) + 1000,
      dailyBudget: Math.floor(Math.random() * 500) + 50,
      metrics: generateMockMetric(),
      adGroups: Math.floor(Math.random() * 20) + 3,
      keywords: Math.floor(Math.random() * 500) + 50,
      creatives: Math.floor(Math.random() * 100) + 5,
      lastUpdated: new Date(),
    })
  }

  return campaigns
}

// Generate mock ad groups
export const generateMockAdGroups = (campaignId: string, count: number = 5): AdGroup[] => {
  const adGroups: AdGroup[] = []

  for (let i = 0; i < count; i++) {
    adGroups.push({
      id: `adgroup_${campaignId}_${i + 1}`,
      campaignId,
      name: `Ad Group ${i + 1}`,
      status: Math.random() > 0.1 ? 'active' : 'paused',
      defaultBid: parseFloat((Math.random() * 50 + 5).toFixed(2)),
      metrics: generateMockMetric(),
      ads: Math.floor(Math.random() * 10) + 2,
      keywords: Math.floor(Math.random() * 100) + 10,
    })
  }

  return adGroups
}

// Generate mock ads
export const generateMockAds = (adGroupId: string, campaignId: string, count: number = 3): Ad[] => {
  const ads: Ad[] = []

  for (let i = 0; i < count; i++) {
    ads.push({
      id: `ad_${adGroupId}_${i + 1}`,
      adGroupId,
      campaignId,
      title: `Ad ${i + 1} - Headline Text`,
      description: `This is a description for ad ${i + 1}. Click here to learn more about our amazing product.`,
      displayUrl: `example.com/${i + 1}`,
      finalUrl: `https://example.com/product-${i + 1}`,
      type: ['text', 'image', 'video'][i % 3] as any,
      status: ['active', 'paused', 'disapproved'][Math.floor(Math.random() * 3)] as any,
      metrics: generateMockMetric(),
    })
  }

  return ads
}

// Generate mock keywords
export const generateMockKeywords = (adGroupId: string, campaignId: string, count: number = 20): Keyword[] => {
  const matchTypes = ['exact', 'phrase', 'broad'] as const
  const keywords: Keyword[] = []

  const keywordTexts = [
    'luxury watches',
    'organic coffee',
    'fitness equipment',
    'smartphone deals',
    'online courses',
    'travel packages',
    'home automation',
    'cloud storage',
    'project management',
    'video editing software',
  ]

  for (let i = 0; i < count; i++) {
    keywords.push({
      id: `keyword_${adGroupId}_${i + 1}`,
      campaignId,
      adGroupId,
      text: keywordTexts[Math.floor(Math.random() * keywordTexts.length)],
      matchType: matchTypes[Math.floor(Math.random() * matchTypes.length)],
      status: Math.random() > 0.1 ? 'active' : 'paused',
      bid: parseFloat((Math.random() * 100 + 5).toFixed(2)),
      qualityScore: Math.floor(Math.random() * 10) + 1,
      metrics: generateMockMetric(),
      recommendations: Math.random() > 0.5 ? ['Increase bid by 10%', 'Review keyword intent'] : undefined,
    })
  }

  return keywords
}

// Generate mock anomalies
export const generateMockAnomalies = (campaigns: Campaign[]): Anomaly[] => {
  const anomalies: Anomaly[] = []

  // Generate a few random anomalies
  for (let i = 0; i < Math.min(5, campaigns.length); i++) {
    const campaign = campaigns[i]
    const anomalyTypes = ['ctr_drop', 'cost_spike', 'conversion_drop', 'quality_score_drop']
    const type = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)]

    anomalies.push({
      id: `anomaly_${i + 1}`,
      type: 'campaign',
      targetId: campaign.id,
      targetName: campaign.name,
      metric: type.replace('_', ' '),
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
      message: `${type.replace(/_/g, ' ')} detected on ${campaign.name}`,
      change: parseFloat(((Math.random() - 0.5) * 50).toFixed(2)),
      expectedRange: [0, 100],
      actualValue: Math.random() * 100,
      timestamp: new Date(),
      suggestions: ['Review campaign settings', 'Check competitor activity', 'Analyze audience behavior'],
    })
  }

  return anomalies
}

// Generate mock forecasts
export const generateMockForecasts = (): Forecast[] => {
  const forecasts: Forecast[] = []

  for (let i = 1; i <= 7; i++) {
    const baseValue = 1000 + Math.random() * 500
    forecasts.push({
      date: addDays(new Date(), i),
      predictedMetrics: {
        impressions: Math.floor(baseValue * (1 + Math.random() * 0.1)),
        clicks: Math.floor((baseValue / 20) * (1 + Math.random() * 0.1)),
        cost: parseFloat((baseValue / 10).toFixed(2)),
      },
      confidence: 0.75 + Math.random() * 0.2,
      lowerBound: {
        impressions: Math.floor(baseValue * 0.8),
        clicks: Math.floor((baseValue / 20) * 0.8),
      },
      upperBound: {
        impressions: Math.floor(baseValue * 1.2),
        clicks: Math.floor((baseValue / 20) * 1.2),
      },
    })
  }

  return forecasts
}

// Service class
export class MockDataService {
  private campaigns: Campaign[] = []
  private allAdGroups: AdGroup[] = []
  private allAds: Ad[] = []
  private allKeywords: Keyword[] = []

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    this.campaigns = generateMockCampaigns(15)
    this.campaigns.forEach((campaign) => {
      const adGroups = generateMockAdGroups(campaign.id, Math.floor(Math.random() * 5) + 2)
      this.allAdGroups.push(...adGroups)

      adGroups.forEach((adGroup) => {
        const ads = generateMockAds(adGroup.id, campaign.id, Math.floor(Math.random() * 3) + 1)
        this.allAds.push(...ads)

        const keywords = generateMockKeywords(adGroup.id, campaign.id, Math.floor(Math.random() * 30) + 10)
        this.allKeywords.push(...keywords)
      })
    })
  }

  getCampaigns(): Campaign[] {
    return this.campaigns
  }

  getCampaignById(id: string): Campaign | undefined {
    return this.campaigns.find((c) => c.id === id)
  }

  getAdGroupsByCampaign(campaignId: string): AdGroup[] {
    return this.allAdGroups.filter((ag) => ag.campaignId === campaignId)
  }

  getAdsByAdGroup(adGroupId: string): Ad[] {
    return this.allAds.filter((a) => a.adGroupId === adGroupId)
  }

  getKeywordsByAdGroup(adGroupId: string): Keyword[] {
    return this.allKeywords.filter((k) => k.adGroupId === adGroupId)
  }

  getAllKeywords(): Keyword[] {
    return this.allKeywords
  }

  getAnomalies(): Anomaly[] {
    return generateMockAnomalies(this.campaigns)
  }

  getForecasts(): Forecast[] {
    return generateMockForecasts()
  }

  refreshData(): void {
    this.campaigns = generateMockCampaigns(15)
    this.allAdGroups = []
    this.allAds = []
    this.allKeywords = []
    this.initializeMockData()
  }
}

// Create a singleton instance
export const mockDataService = new MockDataService()
