// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const TWITCH_OAUTH2_URL = 'https://id.twitch.tv/oauth2'
const IGDB_API_URL = 'https://api.igdb.com/v4'
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}
const RESPONSE_CONFIG = {
  headers: {
    ...CORS_HEADERS,
    'Content-Type': 'application/json'
  }
}

export const mapIgdbToGame = game => ({
  id: game.id,
  name: game.name,
  summary: game.summary,
  release_year: game.first_release_date
    ? new Date(game.first_release_date * 1000).getFullYear()
    : 0,
  cover_url: game.cover?.url
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
  companies: game.involved_companies?.map(company => ({
    id: company.id,
    name: company.company.name,
    logo_url: company.company?.logo?.url,
    is_publisher: company.publisher,
    is_developer: company.developer,
    is_porting: company.porting,
    is_supporting: company.supporting,
  })),
  genres: game.genres?.map(genre => ({
    id: genre.id,
    name: genre.name,
  })),
  ports: game.ports?.map(port => ({
    id: port.id,
    name: port.name,
    release_year: game.first_release_date
      ? new Date(game.first_release_date * 1000).getFullYear()
      : 0,
    cover_url: port.cover?.url 
      ? `https:${port.cover.url.replace('t_thumb', 't_cover_big')}`
      : undefined
  })),
  remakes: game.remakes?.map(remake => ({
    id: remake.id,
    name: remake.name,
    release_year: game.first_release_date
      ? new Date(game.first_release_date * 1000).getFullYear()
      : 0,
    cover_url: remake.cover?.url
      ? `https:${remake.cover.url.replace('t_thumb', 't_cover_big')}`
      : undefined,
  })),
  remasters: game.remasters?.map(remaster => ({
    id: remaster.id,
    name: remaster.name,
    release_year: game.first_release_date
      ? new Date(game.first_release_date * 1000).getFullYear()
      : 0,
    cover_url: remaster.cover?.url
      ? `https:${remaster.cover.url.replace('t_thumb', 't_cover_big')}`
      : undefined
  }))
})

Deno.serve(async (req) => {
  const { method } = req

  if (method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }
  const clientId = Deno.env.get('IGDB_CLIENT_ID') ?? ''
  const secret = Deno.env.get('IGDB_SECRET') ?? ''
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: secret,
    grant_type: 'client_credentials'
  })
  const tokenResponse = await fetch(`${TWITCH_OAUTH2_URL}/token?${params.toString()}`, {
    method: 'POST'
  })
  const { access_token } = await tokenResponse.json()

  const { q } = await req.json()
  const res = await fetch(`${IGDB_API_URL}/games`, {
    method: 'POST',
    headers: {
      'Client-ID': clientId,
      Accept: 'application/json',
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    // Add "ports", "remakes"
    body: `
      fields name, summary, first_release_date, platforms.name, platforms.platform_logo.url, platforms.abbreviation, cover.url, involved_companies.publisher, involved_companies.developer, involved_companies.porting, involved_companies.supporting, involved_companies.company.name, involved_companies.company.logo.url, genres.name, ports.name, ports.first_release_date, ports.cover.url, remakes.name, remakes.first_release_date, remakes.cover.url, remasters.name, remasters.first_release_date, remasters.cover.url;
      search "${q}";
      limit 100;
      where category = (0, 8, 9);
    `,
  })

  const games = await res.json()
  return new Response(
    JSON.stringify(games.map(mapIgdbToGame)),
    RESPONSE_CONFIG
  )
})