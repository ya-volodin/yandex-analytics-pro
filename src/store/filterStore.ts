/**
 * Filter Store
 * Управление фильтрами
 */

import create from 'zustand'

interface FilterState {
  dateFrom: Date
  dateTo: Date
  selectedCampaigns: string[]
  selectedStatuses: string[]
  budgetRange: [number, number]
  ctrRange: [number, number]
  roiRange: [number, number]
  qualityScoreRange: [number, number]
  deviceTypes: string[]
  geography: string[]

  // Actions
  setDateRange: (from: Date, to: Date) => void
  setSelectedCampaigns: (campaigns: string[]) => void
  setSelectedStatuses: (statuses: string[]) => void
  setBudgetRange: (range: [number, number]) => void
  setCTRRange: (range: [number, number]) => void
  setROIRange: (range: [number, number]) => void
  setQualityScoreRange: (range: [number, number]) => void
  setDeviceTypes: (devices: string[]) => void
  setGeography: (geos: string[]) => void

  // Presets
  savePreset: (name: string) => void
  loadPreset: (name: string) => void

  // Reset
  reset: () => void
}

const defaultFilters = {
  dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
  dateTo: new Date(),
  selectedCampaigns: [],
  selectedStatuses: ['active'],
  budgetRange: [0, 100000] as [number, number],
  ctrRange: [0, 10] as [number, number],
  roiRange: [0, 1000] as [number, number],
  qualityScoreRange: [1, 10] as [number, number],
  deviceTypes: ['desktop', 'mobile', 'tablet'],
  geography: [],
}

export const useFilterStore = create<FilterState>((set) => ({
  ...defaultFilters,

  setDateRange: (from, to) =>
    set(() => ({
      dateFrom: from,
      dateTo: to,
    })),

  setSelectedCampaigns: (campaigns) =>
    set(() => ({
      selectedCampaigns: campaigns,
    })),

  setSelectedStatuses: (statuses) =>
    set(() => ({
      selectedStatuses: statuses,
    })),

  setBudgetRange: (range) =>
    set(() => ({
      budgetRange: range,
    })),

  setCTRRange: (range) =>
    set(() => ({
      ctrRange: range,
    })),

  setROIRange: (range) =>
    set(() => ({
      roiRange: range,
    })),

  setQualityScoreRange: (range) =>
    set(() => ({
      qualityScoreRange: range,
    })),

  setDeviceTypes: (devices) =>
    set(() => ({
      deviceTypes: devices,
    })),

  setGeography: (geos) =>
    set(() => ({
      geography: geos,
    })),

  savePreset: (name) => {
    set((state) => {
      const preset = {
        dateFrom: state.dateFrom,
        dateTo: state.dateTo,
        selectedCampaigns: state.selectedCampaigns,
        selectedStatuses: state.selectedStatuses,
        budgetRange: state.budgetRange,
        ctrRange: state.ctrRange,
        roiRange: state.roiRange,
        qualityScoreRange: state.qualityScoreRange,
        deviceTypes: state.deviceTypes,
        geography: state.geography,
      }
      localStorage.setItem(`filter_preset_${name}`, JSON.stringify(preset))
      return state
    })
  },

  loadPreset: (name) => {
    const stored = localStorage.getItem(`filter_preset_${name}`)
    if (stored) {
      try {
        const preset = JSON.parse(stored)
        set({
          dateFrom: new Date(preset.dateFrom),
          dateTo: new Date(preset.dateTo),
          selectedCampaigns: preset.selectedCampaigns,
          selectedStatuses: preset.selectedStatuses,
          budgetRange: preset.budgetRange,
          ctrRange: preset.ctrRange,
          roiRange: preset.roiRange,
          qualityScoreRange: preset.qualityScoreRange,
          deviceTypes: preset.deviceTypes,
          geography: preset.geography,
        })
      } catch (error) {
        console.error('Failed to load preset:', error)
      }
    }
  },

  reset: () =>
    set(() => defaultFilters),
}))
