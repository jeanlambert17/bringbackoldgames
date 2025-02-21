import { useEffect } from 'react'
import { GameSearch } from '@/components/games/GameSearch'
import { GameList } from '@/components/games/GameList'
import { GameVoteModal } from '@/components/games/GameVoteModal'
import { useModalProps } from '../hooks/use-modal-props'
import { AppHeader } from '../components/layout/AppHeader'
import { useSearch } from '@tanstack/react-router'

export function Home() {
  const [voteModalProps, openVoteModal] = useModalProps()
  const { game_id } = useSearch({ strict: false })

  useEffect(() => {
    if (game_id) openVoteModal({ game_id })
  }, [game_id, openVoteModal])

  useEffect(() => {
    // Add meta tags dynamically
    document.title = 'Bring Back Old Games - Vote on Your Favorite Games'
    const metaDescription = document.createElement('meta')
    metaDescription.name = 'description'
    metaDescription.content = 'Rank your favorite games that you want to see be remade or ported to modern platforms.'
    document.head.appendChild(metaDescription)
    const metaKeywords = document.createElement('meta')
    metaKeywords.name = 'keywords'
    metaKeywords.content = 'game voting, video games, gaming community, game rankings, popular games, remakes, ports, modern platforms, remasters, retro games, old games'
    document.head.appendChild(metaKeywords)
    return () => {
      document.head.removeChild(metaDescription)
      document.head.removeChild(metaKeywords)
    }
  }, [])

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