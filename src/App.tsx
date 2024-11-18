import { GameSearch } from '@/components/GameSearch'
import { GameList } from '@/components/GameList'
import { Toaster } from '@/components/ui/toaster'
import { GameVoteDialog } from '@/components/GameVoteDialog'
import { useModalProps } from './hooks/use-modal-props'
import { AuthProvider } from './contexts/auth.context'

export function App() {
  const [voteModalProps, openVoteModal] = useModalProps()

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <div className="px-8 py-8">
          <header className="mb-8">
            <h1 className="mb-4 text-4xl font-bold">Bring Back Old Games</h1>
            <p className="text-muted-foreground">
              Search and vote for the games you’d love to see brought back on modern platforms or that you&apos;d like the devs to remake!
            </p>
          </header>
          <div className="max-w-xl mb-8">
            <GameSearch onGameSelect={game => openVoteModal({ game })} />
          </div>
          <GameVoteDialog {...voteModalProps} />
          <GameList
            openVoteModal={openVoteModal}
            voteModalProps={voteModalProps}
          />
        </div>
        <Toaster />
      </div>
    </AuthProvider>
  )
}