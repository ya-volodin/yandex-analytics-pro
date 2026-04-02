/**
 * AlertsPanel
 * Уведомления об аномалиях
 */

import React, { useState } from 'react'
import { Alert } from '@/types'
import { getSeverityColor } from '@/utils/colors'
import { X, AlertTriangle, AlertCircle, Info } from 'lucide-react'

interface AlertsPanelProps {
  alerts: Alert[]
  onDismiss?: (alertId: string) => void
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onDismiss }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(new Set([...dismissedAlerts, alertId]))
    onDismiss?.(alertId)
  }

  const visibleAlerts = alerts.filter((a) => !dismissedAlerts.has(a.id))

  if (visibleAlerts.length === 0) return null

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 flex-shrink-0" />
      default:
        return <Info className="w-5 h-5 flex-shrink-0" />
    }
  }

  return (
    <div className="space-y-2">
      {visibleAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`alert alert-${alert.severity}`}
          style={{
            borderLeftColor: getSeverityColor(alert.severity),
            borderLeftWidth: '4px',
          }}
        >
          {getIcon(alert.severity)}
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{alert.title}</h4>
            <p className="text-sm mt-1">{alert.message}</p>
          </div>
          <button
            onClick={() => handleDismiss(alert.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default AlertsPanel
