import React, { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useThemeStore } from '@/store/themeStore'
import DashboardPro from '@/components/DashboardPro'
import '@/styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

const App: React.FC = () => {
  const { loadFromLocalStorage } = useThemeStore()

  useEffect(() => {
    loadFromLocalStorage()
  }, [loadFromLocalStorage])

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardPro />
    </QueryClientProvider>
  )
}

export default App
