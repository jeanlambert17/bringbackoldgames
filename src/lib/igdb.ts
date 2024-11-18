import { IGame } from '@/types/game'
import { supabase } from './supabase'
interface IGDBGame {
  id: number
  cover: {
    id: number
    url: string // Image URL as a string
  }
  first_release_date: number // Unix timestamp
  name: string
  platforms: {
    id: number
    name: string
    abbreviation: string
    platform_logo?: {
      id: number
      url: string // Image URL as a string
    }
  }[]
}

export const mapIgdbToGame = (game: IGDBGame): IGame => ({
  id: game.id,
  name: game.name,
  release_year: game.first_release_date
    ? new Date(game.first_release_date * 1000).getFullYear()
    : 0,
  image_url: game.cover?.url
    ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}`
    : undefined,
  platforms: game.platforms?.map(platform => ({
    id: platform.id,
    name: platform.name,
    abbreviation: platform.abbreviation,
    logo_url: platform.platform_logo?.url
      ? `https:${platform.platform_logo.url.replace('t_thumb', 't_thumb')}`
      : undefined,
  })),
})

export async function findIgdbGames(q: string): Promise<IGame[]> {
  try {
    const { data, error } = await supabase.functions.invoke('old-games', {
      body: { q },
    })
    if(error) {
      console.log({ error })
      throw error
    }
    return data.map(mapIgdbToGame)
  } catch (error) {
    console.error('Error fetching games:', error)
    throw error
  }
}
