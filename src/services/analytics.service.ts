/**
 * Analytics Service
 * Основная логика аналитики
 */

import { Campaign, Metrics, MetricComparison } from '@/types'
import { metricsService } from './metrics.service'
import { comparisonService } from './comparison.service'

class AnalyticsService {
  /**
   * Calculate efficiency metrics
   */
  calculateEfficiency(metrics: Metrics): {
    roas: number
    roi: number
    efficiency: number // 0-100
  } {
    const roas = metrics.roas
    const roi = (roas - 1) * 100 // Convert to percentage

    // Efficiency score (0-100)
    // Based on ROAS and conversion rate
    const roasScore = Math.min((roas / 5) * 50, 50) // 0-50 points
    const conversionScore = Math.min((metrics.conversionRate / 5) * 50, 50) // 0-50 points

    const efficiency = roasScore + conversionScore

    return {
      roas: parseFloat(roas.toFixed(2)),
      roi: parseFloat(roi.toFixed(2)),
      efficiency: parseFloat(efficiency.toFixed(1)),
    }
  }

  /**
   * Get top performers
   */
  getTopPerformers(
    campaigns: Campaign[],
    metric: keyof Metrics = 'roas',
    limit: number = 10
  ): Campaign[] {
    return campaigns.sort((a, b) => (b.metrics[metric] as number) - (a.metrics[metric] as number)).slice(0, limit)
  }

  /**
   * Get underperformers
   */
  getUnderperformers(campaigns: Campaign[], metric: keyof Metrics = 'roas', limit: number = 10): Campaign[] {
    return campaigns.sort((a, b) => (a.metrics[metric] as number) - (b.metrics[metric] as number)).slice(0, limit)
  }

  /**
   * Calculate campaign health score
   */
  calculateCampaignHealth(campaign: Campaign): {
    score: number // 0-100
    status: 'excellent' | 'good' | 'fair' | 'poor'
    issues: string[]
  } {
    const issues: string[] = []
    let score = 100

    // Check CTR
    if (campaign.metrics.ctr < 0.5) {
      issues.push('Low CTR')
      score -= 20
    } else if (campaign.metrics.ctr < 1) {
      issues.push('Below average CTR')
      score -= 10
    }

    // Check conversion rate
    if (campaign.metrics.conversionRate < 1) {
      issues.push('Low conversion rate')
      score -= 15
    }

    // Check ROAS
    if (campaign.metrics.roas < 1) {
      issues.push('Negative ROAS')
      score -= 30
    } else if (campaign.metrics.roas < 2) {
      issues.push('Low ROAS')
      score -= 15
    }

    // Check quality score
    if (campaign.metrics.qualityScore < 5) {
      issues.push('Low quality score')
      score -= 20
    }

    // Ensure score is within 0-100
    score = Math.max(0, Math.min(100, score))

    let status: 'excellent' | 'good' | 'fair' | 'poor'
    if (score >= 80) status = 'excellent'
    else if (score >= 60) status = 'good'
    else if (score >= 40) status = 'fair'
    else status = 'poor'

    return { score, status, issues }
  }

  /**
   * Calculate optimization potential
   */
  calculateOptimizationPotential(
    current: Metrics,
    benchmark: Metrics
  ): {
    potentialRevenue: number
    potentialCostSavings: number
    opportunities: string[]
  } {
    const opportunities: string[] = []
    let potentialRevenue = 0
    let potentialCostSavings = 0

    // CTR optimization
    if (current.ctr < benchmark.ctr) {
      const ctrImprovement = benchmark.ctr - current.ctr
      const additionalClicks = (current.impressions * (ctrImprovement / 100))
      const additionalConversions = additionalClicks * (current.conversionRate / 100)
      potentialRevenue += additionalConversions * 50 // Assume $50 per conversion

      opportunities.push(
        `Увеличьте CTR на ${ctrImprovement.toFixed(2)}% путём улучшения объявлений`
      )
    }

    // CPC optimization
    if (current.cpc > benchmark.cpc) {
      const cpcSavings = (current.cpc - benchmark.cpc) * current.clicks
      potentialCostSavings += cpcSavings
      opportunities.push(`Снизьте CPC на ${((current.cpc / benchmark.cpc - 1) * 100).toFixed(0)}%`)
    }

    // Quality score optimization
    if (current.qualityScore < 7) {
      opportunities.push('Улучшите качество объявлений для повышения Quality Score')
      potentialCostSavings += current.cost * 0.1 // 10% cost savings
    }

    return {
      potentialRevenue: Math.round(potentialRevenue),
      potentialCostSavings: Math.round(potentialCostSavings),
      opportunities,
    }
  }

  /**
   * Get actionable insights
   */
  getInsights(campaigns: Campaign[]): Array<{
    title: string
    description: string
    action: string
    priority: 'high' | 'medium' | 'low'
    impact: string
  }> {
    const insights: any[] = []

    campaigns.forEach((campaign) => {
      const health = this.calculateCampaignHealth(campaign)

      if (health.status === 'poor') {
        insights.push({
          title: `${campaign.name} требует внимания`,
          description: `Health score: ${health.score}/100. Issues: ${health.issues.join(', ')}`,
          action: 'review_campaign',
          priority: 'high',
          impact: 'critical',
        })
      }

      if (campaign.metrics.roas > 3) {
        insights.push({
          title: `${campaign.name} - высокопроизводительная кампания`,
          description: `ROAS: ${campaign.metrics.roas.toFixed(2)}x. Рассмотрите увеличение бюджета`,
          action: 'increase_budget',
          priority: 'high',
          impact: 'high',
        })
      }

      if (campaign.metrics.ctr < 0.5 && campaign.metrics.cost > 100) {
        insights.push({
          title: `${campaign.name} - низкий CTR`,
          description: 'Проверьте релевантность ключевых слов и объявлений',
          action: 'improve_relevance',
          priority: 'medium',
          impact: 'medium',
        })
      }
    })

    return insights.sort((a, b) => (a.priority === 'high' ? -1 : 1))
  }

  /**
   * Calculate growth rate
   */
  calculateGrowthRate(
    current: number,
    previous: number,
    period: 'day' | 'week' | 'month' = 'day'
  ): number {
    if (previous === 0) return 0

    const changePercent = ((current - previous) / previous) * 100

    // Annualize if needed
    let annualizedGrowth = changePercent
    if (period === 'day') {
      annualizedGrowth = changePercent * 365
    } else if (period === 'week') {
      annualizedGrowth = changePercent * 52
    } else if (period === 'month') {
      annualizedGrowth = changePercent * 12
    }

    return parseFloat(annualizedGrowth.toFixed(2))
  }

  /**
   * Calculate LTV (Lifetime Value) based on data
   */
  calculateLTV(
    conversionValue: number,
    acquisitionCost: number,
    repurchaseRate: number = 0.3,
    avgRepurchaseValue: number = 50
  ): number {
    const baseValue = conversionValue
    const repurchaseValue = conversionValue * repurchaseRate * avgRepurchaseValue

    return parseFloat((baseValue + repurchaseValue).toFixed(2))
  }

  /**
   * Calculate CAC Payback Period (in days)
   */
  calculateCACPayback(acquisitionCost: number, monthlyProfit: number): number {
    if (monthlyProfit === 0) return Infinity
    return (acquisitionCost / monthlyProfit) * 30 // Days
  }
}

export const analyticsService = new AnalyticsService()
