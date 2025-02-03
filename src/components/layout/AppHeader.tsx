import { useAuthContext } from '@/contexts/auth.context'
import { Button } from '../ui/button'
import { supabase } from '@/lib/supabase'

export const AppHeader = () => {
  const { user } = useAuthContext()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <h1 className="mb-4 text-4xl font-bold dark:text-white">
          Bring Back Old Games
        </h1>
        {user && (
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </div>
      <p className="text-muted-foreground">
        Search and vote for the games you&apos;d love to see brought back on modern platforms or that you&apos;d like the devs to remake!
      </p>
    </header>
  )
}