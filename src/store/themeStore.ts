/**
 * Theme Store
 * Управление темой (dark/light)
 */

import create from 'zustand'

interface ThemeState {
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => void
  toggleTheme: () => void
  loadFromLocalStorage: () => void
  saveToLocalStorage: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark',

  setTheme: (theme) => {
    set(() => ({
      theme,
    }))
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  },

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark'
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('theme', newTheme)
      return { theme: newTheme }
    })
  },

  loadFromLocalStorage: () => {
    const stored = localStorage.getItem('theme')
    if (stored && (stored === 'dark' || stored === 'light')) {
      const theme = stored as 'dark' | 'light'
      set(() => ({
        theme,
      }))
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      }
    }
  },

  saveToLocalStorage: () => {
    set((state) => {
      localStorage.setItem('theme', state.theme)
      return state
    })
  },
}))
