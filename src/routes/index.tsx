import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import { RootLayout } from '@/components/layout/RootLayout'
import { Home } from '@/views/Home'

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  path: '/',
  getParentRoute: () => rootRoute,
  component: Home,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      game_id: search.game_id as string | undefined,
    }
  },
})

const routeTree = rootRoute.addChildren([indexRoute])

export const router = createRouter({ 
  routeTree,
  // Disable development mode
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

// Register the router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
} 