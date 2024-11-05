const IGDB_API_URL = 'https://api.igdb.com/v4';
const clientId = import.meta.env.VITE_IGDB_CLIENT_ID;
// const accessToken = import.meta.env.VITE_IGDB_ACCESS_TOKEN;

if (!clientId) {
  throw new Error('Missing IGDB API credentials');
}

export interface IGDBGame {
  id: number;
  name: string;
  first_release_date?: number;
  cover?: {
    url: string;
  };
}

export async function searchGames(query: string): Promise<IGDBGame[]> {
  try {
    const response = await fetch(`${IGDB_API_URL}/games`, {
      method: 'POST',
      headers: {
        'Client-ID': clientId,
        Accept: 'application/json',
        // 'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: `
        fields name, first_release_date, cover.url;
        search "${query}";
        limit 10;
        where category = (0, 8, 9);
      `,
    });
    if (!response.ok) throw new Error(`IGDB API error: ${response.statusText}`);
    const games = await response.json();
    return games;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
}
