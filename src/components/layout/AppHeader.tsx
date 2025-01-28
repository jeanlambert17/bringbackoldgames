import { useAuthContext } from '@/contexts/auth.context'
import { UserIcon } from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
  
} from '../ui/dropdown-menu'
import { supabase } from '@/lib/supabase'

export const AppHeader = () => {
  const { user } = useAuthContext()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="mb-8">
      <div className="flex justify-between">
        <h1 className="mb-4 text-4xl font-bold">Bring Back Old Games</h1>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserIcon className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <p className="text-muted-foreground">
        Search and vote for the games you&apos;d love to see brought back on modern platforms or that you&apos;d like the devs to remake!
      </p>
    </header>
  )
}