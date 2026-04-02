import React, { useState } from 'react'
import { Download, Mail, Clock } from 'lucide-react'
import { ExportOptions, ScheduledReport } from '@/types'
import clsx from 'clsx'

interface ExportPanelProps {
  onExport?: (options: ExportOptions) => void
  onSchedule?: (report: ScheduledReport) => void
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ onExport, onSchedule }) => {
  const [activeTab, setActiveTab] = useState<'export' | 'schedule'>('export')
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | 'xlsx' | 'json'>('csv')
  const [filename, setFilename] = useState('analytics_report')
  const [selectedMetrics, setSelectedMetrics] = useState([
    'impressions',
    'clicks',
    'ctr',
    'cost',
    'conversions',
    'roas',
  ])

  const [reportName, setReportName] = useState('')
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [time, setTime] = useState('09:00')
  const [recipients, setRecipients] = useState('')

  const metrics = [
    'impressions',
    'clicks',
    'ctr',
    'cpc',
    'cost',
    'conversions',
    'conversionRate',
    'roas',
    'cpa',
    'qualityScore',
    'avgPosition',
  ]

  const handleExport = () => {
    if (onExport) {
      onExport({
        format: exportFormat,
        filename,
        includeMetadata: true,
        dateRange: {
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: new Date(),
        },
        selectedMetrics,
      })
    }
  }

  const handleSchedule = () => {
    if (onSchedule) {
      onSchedule({
        id: Math.random().toString(36).substr(2, 9),
        name: reportName,
        frequency,
        time,
        recipients: recipients.split(',').map((r) => r.trim()),
        format: exportFormat,
        metrics: selectedMetrics,
        enabled: true,
        nextRun: new Date(),
      })
    }
  }

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Export & Reporting
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('export')}
          className={clsx(
            'px-4 py-2 font-medium border-b-2 transition-colors',
            activeTab === 'export'
              ? 'border-yandex-500 text-yandex-600 dark:text-yandex-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          )}
        >
          <Download size={18} className="inline mr-2" />
          Quick Export
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={clsx(
            'px-4 py-2 font-medium border-b-2 transition-colors',
            activeTab === 'schedule'
              ? 'border-yandex-500 text-yandex-600 dark:text-yandex-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          )}
        >
          <Clock size={18} className="inline mr-2" />
          Schedule Report
        </button>
      </div>

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['csv', 'pdf', 'xlsx', 'json'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => setExportFormat(format)}
                  className={clsx(
                    'px-4 py-3 rounded-lg border-2 font-medium transition-all uppercase text-sm',
                    exportFormat === format
                      ? 'border-yandex-500 bg-yandex-50 dark:bg-yandex-900/20 text-yandex-700 dark:text-yandex-300'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  )}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          {/* Filename */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Filename
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              placeholder="analytics_report"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              .{exportFormat} extension will be added automatically
            </p>
          </div>

          {/* Metrics Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Include Metrics
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {metrics.map((metric) => (
                <label
                  key={metric}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedMetrics.includes(metric)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMetrics([...selectedMetrics, metric])
                      } else {
                        setSelectedMetrics(selectedMetrics.filter((m) => m !== metric))
                      }
                    }}
                    className="rounded border-slate-300 text-yandex-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                    {metric.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="w-full px-6 py-3 bg-yandex-500 hover:bg-yandex-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Export {exportFormat.toUpperCase()}
          </button>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* Report Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Report Name
            </label>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              placeholder="Weekly Performance Report"
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                <button
                  key={freq}
                  onClick={() => setFrequency(freq)}
                  className={clsx(
                    'px-4 py-2 rounded-lg border-2 font-medium transition-all capitalize',
                    frequency === freq
                      ? 'border-yandex-500 bg-yandex-50 dark:bg-yandex-900/20 text-yandex-700 dark:text-yandex-300'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  )}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Send Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Recipients (comma-separated emails)
            </label>
            <textarea
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              placeholder="email1@example.com, email2@example.com"
              rows={3}
            />
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Report Format
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['csv', 'pdf', 'xlsx', 'json'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => setExportFormat(format)}
                  className={clsx(
                    'px-4 py-3 rounded-lg border-2 font-medium transition-all uppercase text-sm',
                    exportFormat === format
                      ? 'border-yandex-500 bg-yandex-50 dark:bg-yandex-900/20 text-yandex-700 dark:text-yandex-300'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  )}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Button */}
          <button
            onClick={handleSchedule}
            className="w-full px-6 py-3 bg-yandex-500 hover:bg-yandex-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Clock size={20} />
            Schedule Report
          </button>

          {/* Info */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <span className="font-semibold">💡 Tip:</span> Scheduled reports will be automatically sent to all recipients
              at the specified time every {frequency}.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
