import { Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface GameCardProps {
  game: {
    id: number;
    name: string;
    votes: number;
    releaseYear: number;
    imageUrl: string;
  };
  onVote: () => void;
  rank: number;
}

export function GameCard({ game, onVote, rank }: GameCardProps) {
  const { toast } = useToast();

  const handleVote = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote for games",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('votes')
        .insert([
          { game_id: game.id, user_email: user.email }
        ]);

      if (error) throw error;

      onVote();
      toast({
        title: "Vote recorded!",
        description: `You voted for ${game.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record your vote",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          {rank <= 3 ? (
            <Trophy className={`h-6 w-6 ${rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-gray-400' : 'text-amber-600'}`} />
          ) : (
            <span className="text-xl font-bold">{rank}</span>
          )}
        </div>
        <div>
          <CardTitle>{game.name}</CardTitle>
          <CardDescription>Released: {game.releaseYear}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="text-2xl font-bold">{game.votes} votes</div>
        <Button onClick={handleVote}>Vote</Button>
      </CardContent>
    </Card>
  );
}