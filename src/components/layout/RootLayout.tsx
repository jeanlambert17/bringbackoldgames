import { AuthProvider } from '@/contexts/auth.context'
import { Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from '@/components/ui/toaster'
import { useDarkMode } from '@/hooks/use-dark-mode'

export function RootLayout() {
  useDarkMode()
  
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Outlet />
        {/* <TanStackRouterDevtools /> */}
      </div>
      <Toaster />
    </AuthProvider>
  )
} 