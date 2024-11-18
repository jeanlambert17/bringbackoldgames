export interface IGamePlatform {
  id: number
  name: string
  abbreviation: string
  logo_url?: string
}
export interface IGame {
  id: number;
  name: string;
  release_year: number;
  votes?: number;
  image_url?: string;
  platforms: IGamePlatform[]
}