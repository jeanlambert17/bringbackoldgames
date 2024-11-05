import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { type Game } from '@/types/game';

export function GameList() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopGames() {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .order('votes', { ascending: false })
          .limit(10);

        if (error) throw error;
        setGames(data || []);
      } catch (error) {
        console.error('Error fetching top games:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopGames();
  }, []);

  if (loading) {
    return <div className="text-center">Loading top games...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-2xl font-bold">
        <Trophy className="h-6 w-6 text-yellow-500" />
        Top Voted Games
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <Card key={game.id}>
            {game.imageUrl && (
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={game.imageUrl}
                  alt={game.name}
                  className="object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle>{game.name}</CardTitle>
              <CardDescription>
                Released: {game.releaseYear || 'Unknown'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{game.votes} votes</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}