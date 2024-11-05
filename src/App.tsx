import { useState } from 'react';
import { GameSearch } from '@/components/GameSearch';
import { GameList } from '@/components/GameList';
import { Toaster } from '@/components/ui/toaster';
import { GameVoteDialog } from '@/components/GameVoteDialog';
import { type Game } from '@/types/game';

function App() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Game Voter</h1>
          <p className="text-muted-foreground">
            Search and vote for your favorite games
          </p>
        </header>

        <div className="mx-auto mb-8 max-w-xl">
          <GameSearch onGameSelect={setSelectedGame} />
        </div>

        <GameList />
        
        {selectedGame && (
          <GameVoteDialog
            game={selectedGame}
            open={!!selectedGame}
            onOpenChange={(open) => !open && setSelectedGame(null)}
          />
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default App;