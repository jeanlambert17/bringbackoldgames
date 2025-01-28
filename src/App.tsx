import { GameSearch } from '@/components/games/GameSearch'
import { GameList } from '@/components/games/GameList'
import { Toaster } from '@/components/ui/toaster'
import { GameVoteDialog } from '@/components/games/GameVoteDialog'
import { useModalProps } from './hooks/use-modal-props'
import { AuthProvider } from './contexts/auth.context'
import { AppHeader } from './components/layout/AppHeader'

export function App() {
  const [voteModalProps, openVoteModal] = useModalProps()

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <div className="px-6 py-10 md:px-8">
          <AppHeader />
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