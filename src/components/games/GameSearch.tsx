import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogModal,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { findIgdbGames } from '@/lib/igdb'
import { useToast } from '@/hooks/use-toast'
import { type IGame } from '@/types/game'
import debounce from '@/utils/debounce'

interface GameSearchProps {
  onGameSelect: (game: IGame) => void
}

export function GameSearch({ onGameSelect }: GameSearchProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [games, setGames] = useState<IGame[]>([])
  const { toast } = useToast()
  
  const search = debounce(async (q: string) => {
    if (q.length < 2) {
      setGames([])
      return
    }

    try {
      setGames([])
      setLoading(true)
      setGames(await findIgdbGames(q))
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error',
        description: 'Failed to search games. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, 600)

  const handleSearch = async (q: string) => {
    search(q)
  }

  return (
    <div className="w-full max-w-sm">
      <Button
        variant="outline"
        className="justify-start w-full text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="w-4 h-4 mr-2" />
        Search games...
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogModal>
          <DialogHeader>
            <DialogTitle>Search for games</DialogTitle>
          </DialogHeader>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search games..."
              onValueChange={handleSearch}
              autoFocus
            />
            <CommandList className="py-2 max-h-[50vh]">
              <CommandEmpty>
                {loading ? 'Searching...' : `No games found. ${games.length}`}
              </CommandEmpty>
              <CommandGroup>
                {games.map((game) => (
                  <CommandItem
                    key={game.id}
                    className="flex items-center gap-2 px-3"
                    onSelect={() => {
                      onGameSelect(game)
                      setOpen(false)
                    }}
                  >
                    {game.image_url && (
                      <img
                        src={game.image_url}
                        alt={game.name}
                        className="object-cover w-10 h-10 rounded"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium">{game.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {game.release_year || 'Release date unknown'}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogModal>
      </Dialog>
    </div>
  )
}
