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
    body: `
      fields name, first_release_date, platforms.name, platforms.platform_logo.url, platforms.abbreviation, cover.url;
      search "${q}";
      limit 100;
      where category = (0, 8, 9);
    `,
  })

  const games = await res.json()
  return new Response(
    JSON.stringify(games),
    RESPONSE_CONFIG
  )
})