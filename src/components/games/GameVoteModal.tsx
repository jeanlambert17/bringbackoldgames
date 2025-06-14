import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogModal,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogMain,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/contexts/auth.context'
import { type IGame } from '@/types/game'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../ui/tooltip'
import { ExternalLinkIcon } from 'lucide-react'
import { useAsyncEffect } from '@/hooks/use-async-effect'
import { findIgdbGameById } from '@/lib/igdb'
import { Skeleton } from '../ui/skeleton'

const DetailsSkeleton = () => (
  <div className="flex items-center space-x-2">
    <Skeleton className="inline-block w-20 h-3.5" />
    <Skeleton className="inline-block w-20 h-3.5" />
  </div>
)

interface GameVoteDialogProps {
  game_id?: string
  game?: IGame
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GameVoteModal({ game: _game, game_id, open, onOpenChange }: GameVoteDialogProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [internalGame, setInternalGame] = useState<IGame | null>()
  const { toast } = useToast()
  const { user, votes, setVotes } = useAuthContext()
  const game = _game || internalGame
  const vote = game ? votes[game.id] : null

  useAsyncEffect(async () => {
    if (game_id) {
      try {
        setLoading(true)
        const { data } = await supabase.from('games').select('*').eq('id', game_id)
        if (data && data.length > 0) {
          setInternalGame(data[0])
        } else {
          const game = await findIgdbGameById(game_id)
          if (game) setInternalGame(game)
        }
      } catch (error) {
        console.error('Error loading game:', error)
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 4000)
      }
    }
  }, [game_id])

  const handleVote = async () => {
    try {
      if (!user) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}?game_id=${game?.id}`,
          },
        })
        if (error) throw error
        return
      }

      if (!game) return
      setSaving(true)
      // First, ensure the game exists in our database
      const { error: upsertError } = await supabase
        .from('games')
        .upsert({
          id: game.id,
          name: game.name,
          release_year: game.release_year,
          cover_url: game.cover_url,
          summary: game.summary,
        })
      if (upsertError) throw upsertError

      const { error: platformsError } = await supabase
        .from('platforms')
        .upsert(game.platforms)
      if (platformsError) throw platformsError

      const { error: gamePlatformsError } = await supabase
        .from('games_platforms')
        .upsert(game.platforms.map(platform => ({
          game_id: game.id,
          platform_id: platform.id
        })))
      if (gamePlatformsError) throw gamePlatformsError

      if (game.genres && game.genres.length > 0) {
        const { error: genresError } = await supabase
          .from('genres')
          .upsert(game.genres)
        if (genresError) throw genresError

        const { error: gamesGenresError } = await supabase
          .from('games_genres')
          .upsert(game.genres.map(genre => ({
            game_id: game.id,
            genre_id: genre.id,
          })))
        if (gamesGenresError) throw gamesGenresError
      }

      if (game.companies && game.companies.length > 0) {
        const { error: genresError } = await supabase
          .from('companies')
          .upsert(game.companies.map(company => ({
            id: company.id,
            name: company.name,
            logo_url: company.logo_url,
          })))
        if (genresError) throw genresError

        const { error: gamesGenresError } = await supabase
          .from('games_companies')
          .upsert(game.companies.map(company => ({
            game_id: game.id,
            company_id: company.id,
            is_developer: company.is_developer,
            is_publisher: company.is_publisher,
            is_porting: company.is_porting,
            is_supporting: company.is_supporting,
          })))
        if (gamesGenresError) throw gamesGenresError
      }

      // Then record the vote
      const { error: voteError } = await supabase
        .from('user_votes')
        .insert({
          game_id: game.id,
          user_id: user.id,
        })
      setVotes(votes => ({
        ...votes,
        [game.id]: {
          id: '',
          game_id: game.id,
          user_id: user.id as string,
          created_at: new Date().toISOString()
        }
      }))

      if (voteError) {
        if (voteError.code === '23505') { // Unique violation
          toast({
            title: "Already added",
            description: "You have already requested for this game",
            variant: "destructive",
          })
          return
        }
        throw voteError
      }

      toast({
        title: "Great!",
        description: "Thank you for voting!",
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Error voting:', error)
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogModal aria-describedby="I want this game">
        <div
          className="overflow-y-auto max-h-[95dvh]"
        >


          <DialogHeader>
            <DialogTitle className="w-full" asChild>
              <h2>
                {loading ? (
                  <Skeleton className="w-full h-[18px]" />
                ) : (
                  <>
                    I want <span className="text-sky-500">{game?.name}</span> back!
                  </>
                )}
              </h2>
            </DialogTitle>
          </DialogHeader>
          <DialogMain className="">
            <DialogDescription className="mb-5">
              {loading
                ? (
                  <span className="space-y-2">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-full h-4" />
                  </span>
                )
                : `Express your interest in seeing ${game?.name} on modern platforms as a remake, refactor, or just a port on newer platforms.`
              }
            </DialogDescription>
            <div className="relative flex flex-col space-y-3 overflow-hidden sm:space-y-0 sm:space-x-3 sm:flex-row">
              {loading ? (
                <Skeleton className="w-[264px] h-[352px] self-center" />
              ) : game?.cover_url ? (
                <img
                  src={game.cover_url}
                  alt={game.name}
                  className="self-center object-cover"
                />
              ) : null}
              <div className="flex-1">
                {loading ? (
                  <div className="space-y-1.5 mb-1.5">
                    <Skeleton className="w-full h-3" />
                    <Skeleton className="w-full h-3" />
                    <Skeleton className="w-full h-3" />
                    <Skeleton className="w-full h-3" />
                    <Skeleton className="w-full h-3" />
                    <Skeleton className="w-full h-3" />
                  </div>
                ) : game?.summary ? (
                  <p className="mb-1.5 text-xs" title={game?.summary}>
                    {game.summary.length > 250 ? `${game.summary.slice(0, 250)}...` : game.summary}
                  </p>
                ) : null}
                <ul className="space-y-1.5">
                  <li className="space-x-2 text-sm">
                    {loading ? (
                      <DetailsSkeleton />
                    ) : (
                      <>
                        <span className="font-semibold">Release date:</span>
                        <span>{game?.release_year}</span>
                      </>
                    )}
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    {loading ? (
                      <DetailsSkeleton />
                    ) : (
                      <>
                        <span className="font-semibold">Platforms:</span>
                        {game?.platforms?.map(platform => (
                          <TooltipProvider key={platform.id} delayDuration={200}>
                            <Tooltip>
                              <TooltipTrigger>
                                <img
                                  src={platform.logo_url}
                                  style={{ height: '20px', maxWidth: 'auto' }}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                {platform.name}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </>
                    )}
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    {loading ? (
                      <DetailsSkeleton />
                    ) : (
                      <>
                        <span className="font-semibold">Genres:</span>
                        <span>{game?.genres?.map(genre => genre.name).join(', ')}</span>
                      </>
                    )}
                  </li>
                </ul>
                <a
                  href={`https://www.igdb.com/games/${game?.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-blue-600 transition-colors outline-none hover:text-blue-500 hover:underline focus:underline"
                >
                  {loading ? (
                    <Skeleton className="inline-block h-5 w-28" />
                  ) : (
                    <>
                      <span>See in IGDB</span>
                      <ExternalLinkIcon size={16} />
                    </>
                  )}
                </a>
              </div>
            </div>
          </DialogMain>
          <DialogFooter>
            <Button
              onClick={handleVote}
              disabled={saving || !!vote || !game}
            >
              {saving ? 'Processing...' : loading ? 'Loading...' : vote ? `You've already requested this game` : 'I want this game back!'}
            </Button>
          </DialogFooter>
        </div>
      </DialogModal>
    </Dialog >
  )
}