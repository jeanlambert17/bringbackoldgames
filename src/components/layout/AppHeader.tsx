import { useAuthContext } from '@/contexts/auth.context'
import { Button } from '../ui/button'
import { supabase } from '@/lib/supabase'
import appIcon from '@/assets/icons/app-icon.svg'
import { LogOutIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'

export const AppHeader = () => {
  const { user } = useAuthContext()
  const { theme, setTheme } = useTheme()

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
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto mr-2"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <SunIcon className="w-5 h-5 transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute w-5 h-5 transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        {user && (
          <Button variant="ghost" onClick={handleLogout}>
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