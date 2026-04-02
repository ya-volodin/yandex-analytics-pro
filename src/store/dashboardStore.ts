/**
 * Dashboard Store
 * Управление состоянием dashboard'а
 */

import create from 'zustand'
import { Widget, DashboardLayout } from '@/types'

interface DashboardState {
  layouts: DashboardLayout[]
  activeLayoutId: string
  widgets: Widget[]
  autoRefreshInterval: number
  isRefreshing: boolean

  // Actions
  addLayout: (layout: DashboardLayout) => void
  updateLayout: (layoutId: string, layout: DashboardLayout) => void
  deleteLayout: (layoutId: string) => void
  setActiveLayout: (layoutId: string) => void

  addWidget: (widget: Widget) => void
  removeWidget: (widgetId: string) => void
  updateWidget: (widgetId: string, widget: Widget) => void
  reorderWidgets: (widgets: Widget[]) => void

  setAutoRefreshInterval: (interval: number) => void
  setIsRefreshing: (isRefreshing: boolean) => void

  // Persistence
  saveToLocalStorage: () => void
  loadFromLocalStorage: () => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  layouts: [],
  activeLayoutId: '',
  widgets: [],
  autoRefreshInterval: 5 * 60 * 1000,
  isRefreshing: false,

  addLayout: (layout) =>
    set((state) => ({
      layouts: [...state.layouts, layout],
    })),

  updateLayout: (layoutId, layout) =>
    set((state) => ({
      layouts: state.layouts.map((l) => (l.id === layoutId ? layout : l)),
    })),

  deleteLayout: (layoutId) =>
    set((state) => ({
      layouts: state.layouts.filter((l) => l.id !== layoutId),
    })),

  setActiveLayout: (layoutId) =>
    set((state) => {
      const layout = state.layouts.find((l) => l.id === layoutId)
      return {
        activeLayoutId: layoutId,
        widgets: layout?.widgets || [],
      }
    }),

  addWidget: (widget) =>
    set((state) => ({
      widgets: [...state.widgets, widget],
    })),

  removeWidget: (widgetId) =>
    set((state) => ({
      widgets: state.widgets.filter((w) => w.id !== widgetId),
    })),

  updateWidget: (widgetId, widget) =>
    set((state) => ({
      widgets: state.widgets.map((w) => (w.id === widgetId ? widget : w)),
    })),

  reorderWidgets: (widgets) =>
    set(() => ({
      widgets,
    })),

  setAutoRefreshInterval: (interval) =>
    set(() => ({
      autoRefreshInterval: interval,
    })),

  setIsRefreshing: (isRefreshing) =>
    set(() => ({
      isRefreshing,
    })),

  saveToLocalStorage: () => {
    set((state) => {
      const data = {
        layouts: state.layouts,
        activeLayoutId: state.activeLayoutId,
        widgets: state.widgets,
        autoRefreshInterval: state.autoRefreshInterval,
      }
      localStorage.setItem('dashboardState', JSON.stringify(data))
      return state
    })
  },

  loadFromLocalStorage: () => {
    const stored = localStorage.getItem('dashboardState')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        set({
          layouts: data.layouts || [],
          activeLayoutId: data.activeLayoutId || '',
          widgets: data.widgets || [],
          autoRefreshInterval: data.autoRefreshInterval || 5 * 60 * 1000,
        })
      } catch (error) {
        console.error('Failed to load dashboard state:', error)
      }
    }
  },
}))
