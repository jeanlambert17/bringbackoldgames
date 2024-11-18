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
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip'

interface GameVoteDialogProps {
  game?: IGame
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GameVoteDialog({ game, open, onOpenChange }: GameVoteDialogProps) {
  const { toast } = useToast()
  const { user, votes, setVotes } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const vote = game ? votes[game.id] : null

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
      setLoading(true)
      // First, ensure the game exists in our database
      const { error: upsertError } = await supabase
        .from('games')
        .upsert({
          ...game,
          platforms: undefined
        })
      if (upsertError) throw upsertError

      const { error: platformsError } = await supabase
        .from('platforms')
        .upsert(game.platforms)
      if (platformsError) throw platformsError

      const { error: gamePlatformsError } = await supabase
        .from('game_platforms')
        .upsert(game.platforms.map(platform => ({
          game_id: game.id,
          platform_id: platform.id
        })))
      if (gamePlatformsError) throw gamePlatformsError

      // Then record the vote
      const { error: voteError } = await supabase
        .from('user_votes')
        .insert({
          game_id: game.id,
          user_email: user.email,
        })
      setVotes(votes => ({
        ...votes,
        [game.id]: {
          id: '',
          game_id: game.id,
          user_email: user.email as string,
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
      setLoading(false)
    }
  }

  console.log({ game })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogModal aria-describedby="I want this game">
        <DialogHeader>
          <DialogTitle>I want {game?.name} back!</DialogTitle>
        </DialogHeader>
        <DialogMain className="">
          {/* {user? null : (
          )} */}
          <DialogDescription className="mb-6">
            {/* Sign in with Google to vote for this game. We only use your email to prevent duplicate votes. */}
            Express your interest in seeing {game?.name} on modern platforms as a remake, refactor, or just a port on newer platforms.
            {/* It provides an opportunity to engage with the gaming community and let developers know there&apos;s demand for the game.
            Key Features:
            •	Vote for Revival: Share your enthusiasm for bringing back this game.
            •	Community Insight: See how many others want this game revived.
            •	Developer Engagement: Your vote contributes to highlighting interest for developers or publishers.

            Purpose:
            This feature bridges the gap between gamers and developers, showing which classic or beloved games have strong demand for a return or reimagining on newer platforms. */}
          </DialogDescription>
          <div className="flex justify-center space-x-2">
            {game?.image_url && (
              <div className="relative flex overflow-hidden rounded-md">
                <img
                  src={game?.image_url}
                  alt={game?.name}
                  className="object-cover"
                />
                <div className="flex flex-col gap-y-1.5 ml-2">
                  {game?.platforms?.map(platform => (
                    <TooltipProvider key={platform.id} delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger>
                          <img
                            src={platform.logo_url}
                            style={{
                              height: 24,
                              width: 24,
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          {platform.name}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogMain>
        <DialogFooter>
          <Button
            onClick={handleVote}
            disabled={loading || !!vote}
          >
            {loading ? 'Processing...' : vote ? `You've already requested this game` : 'I want this game back!'}
          </Button>
        </DialogFooter>
      </DialogModal>
    </Dialog>
  )
}