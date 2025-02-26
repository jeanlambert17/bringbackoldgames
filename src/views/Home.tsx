import { useEffect } from 'react'
import { GameSearch } from '@/components/games/GameSearch'
import { GameList } from '@/components/games/GameList'
import { GameVoteModal } from '@/components/games/GameVoteModal'
import { useModalProps } from '../hooks/use-modal-props'
import { AppHeader } from '../components/layout/AppHeader'
import { useSearch } from '@tanstack/react-router'
import { AppFooter } from '@/components/layout/AppFooter'

export function Home() {
  const [voteModalProps, openVoteModal] = useModalProps()
  const { game_id } = useSearch({ strict: false })

  useEffect(() => {
    if (game_id) openVoteModal({ game_id })
  }, [game_id, openVoteModal])

  return (
    <div className="flex flex-col min-h-screen px-6 py-10 md:px-8">
      <AppHeader />
      <GameSearch onGameSelect={game => openVoteModal({ game })} className="mb-8" />
      <GameVoteModal {...voteModalProps} />
      <GameList
        openVoteModal={openVoteModal}
        voteModalProps={voteModalProps}
      />
      <AppFooter />
    </div>
  )
}