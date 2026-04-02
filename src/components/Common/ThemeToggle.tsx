/**
 * ThemeToggle
 * Dark/Light mode toggle
 */

import React, { useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { Moon, Sun } from 'lucide-react'

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, loadFromLocalStorage } = useThemeStore()

  useEffect(() => {
    loadFromLocalStorage()
  }, [loadFromLocalStorage])

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost p-2 rounded-lg"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600" />
      )}
    </button>
  )
}

export default ThemeToggle
