import React from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  [key: string]: string | number
}

interface PerformanceChartProps {
  type?: 'line' | 'area' | 'bar'
  data: DataPoint[]
  xAxis: string
  yAxis: string | string[]
  title?: string
  height?: number
  colors?: string[]
  showLegend?: boolean
  showGrid?: boolean
  loading?: boolean
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  type = 'line',
  data,
  xAxis,
  yAxis,
  title,
  height = 300,
  colors = ['#f8b90c', '#475569', '#06b6d4'],
  showLegend = true,
  showGrid = true,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="card p-6">
        <div className="skeleton h-96 w-full rounded-lg"></div>
      </div>
    )
  }

  const yAxisArray = Array.isArray(yAxis) ? yAxis : [yAxis]

  const commonProps = {
    data,
    margin: { top: 5, right: 30, left: 0, bottom: 5 },
    height,
  }

  const renderChart = () => {
    const content = (
      <>
        <XAxis dataKey={xAxis} stroke="#94a3b8" style={{ fontSize: '12px' }} />
        <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '8px',
            color: '#f1f5f9',
          }}
          labelStyle={{ color: '#f1f5f9' }}
        />
        {showLegend && <Legend />}
        {yAxisArray.map((axis, idx) => (
          <Line
            key={axis}
            type="monotone"
            dataKey={axis}
            stroke={colors[idx % colors.length]}
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        ))}
      </>
    )

    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {content}
            {yAxisArray.map((axis, idx) => (
              <Area
                key={axis}
                type="monotone"
                dataKey={axis}
                stroke={colors[idx % colors.length]}
                fill={colors[idx % colors.length]}
                fillOpacity={0.2}
              />
            ))}
          </AreaChart>
        )
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {content}
            {yAxisArray.map((axis, idx) => (
              <Bar key={axis} dataKey={axis} fill={colors[idx % colors.length]} />
            ))}
          </BarChart>
        )
      default:
        return <LineChart {...commonProps}>{content}</LineChart>
    }
  }

  return (
    <div className="card p-6">
      {title && <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  )
}
