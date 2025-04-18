import { useAuthContext } from '@/contexts/auth.context'
import { Button } from '../ui/button'
import { supabase } from '@/lib/supabase'
import appIcon from '@/assets/icons/app-icon.svg'
import { LogOutIcon } from 'lucide-react'

export const AppHeader = () => {
  const { user } = useAuthContext()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="mb-8">
      <nav className="flex items-center mb-4">
        <img src={appIcon} alt="BringBackOldGames Icon" width="44" height="44" />
        <h1 className="ml-3 text-4xl font-bold truncate dark:text-white">
          Bring Back Old Games
        </h1>
        {user && (
          <Button className="ml-auto" variant="ghost" onClick={handleLogout}>
            <LogOutIcon className="w-4 h-4 sm:hidden" />
            <span className="sr-only sm:not-sr-only">Logout</span>
          </Button>
        )}
      </nav>
      <p className="text-muted-foreground">
        Search for your favorite games and rank the ones you&apos;d love to see remade, remastered, or ported to modern platforms!
      </p>
    </header>
  )
}