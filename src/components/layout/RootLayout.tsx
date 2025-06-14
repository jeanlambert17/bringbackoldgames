import { AuthProvider } from '@/contexts/auth.context'
import { Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from '@/components/ui/toaster'

export function RootLayout() {
  
  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  )
} 