import { GameSearch } from '@/components/games/GameSearch'
import { GameList } from '@/components/games/GameList'
import { GameVoteModal } from '@/components/games/GameVoteModal'
import { useModalProps } from '../hooks/use-modal-props'
import { AppHeader } from '../components/layout/AppHeader'
import { useSearch } from '@tanstack/react-router'
import { useEffect } from 'react'

export function Home() {
  const [voteModalProps, openVoteModal] = useModalProps()
  const { game_id } = useSearch({ strict: false })

  useEffect(() => {
    if (game_id) openVoteModal({ game_id })
  }, [game_id, openVoteModal])

  return (
    <div className="px-6 py-10 md:px-8">
      <AppHeader />
      <div className="max-w-xl mb-8">
        <GameSearch onGameSelect={game => openVoteModal({ game })} />
      </div>
      <GameVoteModal {...voteModalProps} />
      <GameList
        openVoteModal={openVoteModal}
        voteModalProps={voteModalProps}
      />
    </div>
  )
}