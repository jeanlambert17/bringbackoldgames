import { useEffect, useState } from 'react'
import { Trophy } from 'lucide-react'
import { Virtuoso } from 'react-virtuoso'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { type IGame } from '@/types/game'
import { Skeleton } from '../ui/skeleton'
import { createFixedArray } from '@/utils/array'
import { useToast } from '@/hooks/use-toast'

const PAGE_SIZE = 100

interface Props {
  openVoteModal: ({ game }: { game: IGame }) => void
  voteModalProps?: { open: boolean }
}


export function GameList({ openVoteModal, voteModalProps }: Props) {
  const { toast } = useToast()
  const [games, setGames] = useState<IGame[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  async function fetchGames(from: number) {
    try {
      const to = from + PAGE_SIZE - 1
      const { data, count, error } = await supabase
        .from('games')
        .select('*, platforms (id, name, abbreviation, logo_url), genres (id, name)', {
          count: 'estimated',
        })
        .order('votes', { ascending: false })
        .range(from, to)
      
      if (error) throw error
      if (count &&count < to) setHasMore(false)
      setGames(previous => from === 0 ? data : [...previous, ...data])
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error fetching games',
        description: (err as Error).message,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (voteModalProps?.open) return
    fetchGames(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voteModalProps?.open])

  const GameItem = (index: number, game: IGame) => (
    <article className="flex cursor-pointer gap-x-2 px-0.5 py-1">
      <span className="font-medium dark:text-white">{index + 1}.</span>
      <Card className="flex flex-1 truncate" onClick={() => openVoteModal({ game })}>
        {game.cover_url && (
          <div className="h-20 overflow-hidden w-fit rounded-l-md">
            <img className="w-auto h-full" src={game.cover_url} alt={game.name} />
          </div>
        )}
        <CardHeader className="flex-1 truncate">
          <CardTitle title={game.name} className="truncate">
            {game.name}
          </CardTitle>
          <CardDescription className="text-sm mt-0.5">
            {game.release_year}
          </CardDescription>
        </CardHeader>
        <span className="flex items-center ml-auto mr-4 font-semibold">
          {game.votes}
        </span>
      </Card>
    </article>
  )

  const LoadingItem = (index: number) => (
    <Skeleton key={index} className="h-[82px] w-full my-1" />
  )

  return (
    <main>
      <h2 className="flex items-center gap-2 mb-4 text-2xl font-bold dark:text-white">
        <Trophy className="w-6 h-6 text-yellow-400" />
        Top Asked Games
      </h2>
      <section aria-label="Game list">
        {loading && games.length === 0 ? (
          <div className="flex flex-col gap-2">
            {createFixedArray(10).map((_, i) => LoadingItem(i))}
          </div>
        ) : games.length === 0 ? (
          <p className="text-sm text-muted-foreground">No games found</p>
        ) : (
          <Virtuoso
            useWindowScroll
            data={games}
            endReached={() => hasMore && fetchGames(games.length)}
            overscan={200}
            itemContent={(index, game) => GameItem(index, game)}
            components={{
              Footer: () => 
                hasMore ? (
                  <div className="py-2">
                    <Skeleton className="h-[82px] w-full" />
                  </div>
                ) : null
            }}
          />
        )}
      </section>
    </main>
  )
}