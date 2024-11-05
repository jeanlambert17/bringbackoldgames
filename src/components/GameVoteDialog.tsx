import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type Game } from '@/types/game';

interface GameVoteDialogProps {
  game: Game;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GameVoteDialog({ game, open, onOpenChange }: GameVoteDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleVote = async () => {
    try {
      setLoading(true);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        
        if (error) throw error;
        return;
      }

      // First, ensure the game exists in our database
      const { error: upsertError } = await supabase
        .from('games')
        .upsert({
          id: game.id,
          name: game.name,
          release_year: game.releaseYear,
          image_url: game.imageUrl,
        });

      if (upsertError) throw upsertError;

      // Then record the vote
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          game_id: game.id,
          user_email: user.email,
        });

      if (voteError) {
        if (voteError.code === '23505') { // Unique violation
          toast({
            title: "Already voted",
            description: "You have already voted for this game",
            variant: "destructive",
          });
          return;
        }
        throw voteError;
      }

      toast({
        title: "Vote recorded",
        description: "Thank you for voting!",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to record vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vote for {game.name}</DialogTitle>
          <DialogDescription>
            Sign in with Google to vote for this game. We only use your email to prevent duplicate votes.
          </DialogDescription>
        </DialogHeader>
        {game.imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <img
              src={game.imageUrl}
              alt={game.name}
              className="object-cover"
            />
          </div>
        )}
        <DialogFooter>
          <Button
            onClick={handleVote}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Vote Now'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}