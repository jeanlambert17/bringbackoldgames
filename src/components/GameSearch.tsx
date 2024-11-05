import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { searchGames } from '@/lib/igdb';
import { useToast } from '@/hooks/use-toast';
import { type Game } from '@/types/game';

interface GameSearchProps {
  onGameSelect: (game: Game) => void;
}

export function GameSearch({ onGameSelect }: GameSearchProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setGames([]);
      return;
    }

    try {
      setLoading(true);
      const igdbGames = await searchGames(query);
      const formattedGames = igdbGames.map((game) => ({
        id: game.id,
        name: game.name,
        releaseYear: game.first_release_date
          ? new Date(game.first_release_date * 1000).getFullYear()
          : 0,
        imageUrl: game.cover?.url
          ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}`
          : undefined,
      }));

      setGames(formattedGames);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Failed to search games. Please try again.',
        variant: 'destructive',
      });
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <Button
        variant="outline"
        className="w-full justify-start text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search games...
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 p-0">
          <DialogHeader className="px-4 pb-4 pt-5">
            <DialogTitle>Search Games</DialogTitle>
          </DialogHeader>
          <Command className="rounded-t-none border-t">
            <CommandInput
              placeholder="Type a game name..."
              onValueChange={handleSearch}
            />
            <CommandList>
              <CommandEmpty>
                {loading ? 'Searching...' : 'No games found.'}
              </CommandEmpty>
              <CommandGroup>
                {games.map((game) => (
                  <CommandItem
                    key={game.id}
                    onSelect={() => {
                      onGameSelect(game);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2"
                  >
                    {game.imageUrl && (
                      <img
                        src={game.imageUrl}
                        alt={game.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium">{game.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {game.releaseYear || 'Release date unknown'}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
}
