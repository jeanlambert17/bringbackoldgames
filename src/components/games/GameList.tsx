import { useEffect, useState } from 'react'
import { Trophy } from 'lucide-react'
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

interface Props {
  openVoteModal: ({ game }: { game: IGame }) => void
  voteModalProps?: { open: boolean }
}

export function GameList({ openVoteModal, voteModalProps }: Props) {
  const [games, setGames] = useState<IGame[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (voteModalProps?.open) return
    async function fetchTopGames() {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*, platforms (id, name, abbreviation, logo_url), genres (id, name)')
          .order('votes', { ascending: false })
          // .limit(20)
        if (error) throw error
        setGames(data || [])
      } catch (error) {
        console.error('Error fetching top games:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTopGames()
  }, [voteModalProps?.open])

  const data = loading ? createFixedArray(20) : games

  return (
    <main>
      <h2 className="flex items-center gap-2 mb-4 text-2xl font-bold dark:text-white">
        <Trophy className="w-6 h-6 text-yellow-400" />
        Top Asked Games
      </h2>
      <section aria-label="Game list" className="flex flex-col gap-2.5">
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground">No games found</p>
        )}
        {data.map((game, i) => game ? (
          <article key={game.id} className="flex cursor-pointer gap-x-2">
            <span className="font-medium dark:text-white">{i + 1}.</span>
            <Card className="flex flex-1 truncate" onClick={() => openVoteModal({ game })}>
              {game.cover_url && (
                <div className="flex h-20 overflow-hidden rounded-l-md">
                  <img src={game.cover_url} alt={game.name} />
                </div>
              )}
              <CardHeader className="truncate">
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
        ) : (
          <Skeleton key={i} className="h-[82px] w-full" />
        ))}
      </section>
    </main>
  )
}