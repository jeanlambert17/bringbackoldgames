import { startTransition, useCallback, useEffect, useRef, useState } from 'react'
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
  CommandLoading
} from '@/components/ui/command'
import { findIgdbGames } from '@/lib/igdb'
import { useToast } from '@/hooks/use-toast'
import { type IGame } from '@/types/game'
import debounce from '@/utils/debounce'
import { useAsyncEffect } from '@/hooks/use-async-effect'
import { Skeleton } from '../ui/skeleton'
import { isAbortError } from '@/utils/http'
import { clsx } from '@/lib/utils'

interface GameSearchProps {
  onGameSelect: (game: IGame) => void
  className?: string
}

export function GameSearch({ onGameSelect, className }: GameSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [games, setGames] = useState<IGame[]>([])
  const [text, setText] = useState('')
  const [search, setSearch] = useState('')
  const { toast } = useToast()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounced = useCallback(debounce(async (q: string) => {
    setSearch(q)
  }, 500), [])



  useEffect(() => {
    debounced.cancel()
    debounced(text)
  }, [text, debounced])

  useAsyncEffect(async () => {
    try {
      setLoading(true)
      setGames(await findIgdbGames(search))
      startTransition(() => {
        setLoading(false)
      })
    } catch (err) {
      if (isAbortError(err)) return
      setLoading(false)
      toast({
        title: 'Error',
        description: 'Failed to search games. Please try again.',
        variant: 'destructive',
      })
    }
  }, [search])

  return (
    <div className={clsx('w-full max-w-sm', className)}>
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
                autoFocus
                placeholder="Search games..."
                value={text}
                ref={inputRef}
                onValueChange={setText}
                onClear={text === '' ? undefined : () => {
                  setText('')
                  inputRef.current?.focus()
                }}
              />
              <CommandList className="py-2 max-h-[50vh]">
                {!loading && <CommandEmpty>No games found.</CommandEmpty>}
                {loading && games.length === 0 && (
                  <CommandLoading>
                    Searching...
                  </CommandLoading>
                )}
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
                      {loading ? <Skeleton className="w-10 h-10 rounded" /> : game.cover_url ? (
                        <img
                          src={game.cover_url}
                          alt={game.name}
                          className="object-cover w-10 h-10 rounded"
                        />
                      ) : null}
                      <div className={clsx('flex flex-col flex-1', loading ? 'space-y-2' : '')}>
                        <span className="font-medium">
                          {loading ? <Skeleton className="w-full h-4" /> : game.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {loading ? <Skeleton className="w-full h-4" /> : (game.release_year || 'Release date unknown')}
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
