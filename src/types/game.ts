import { IPlatform } from './platform'
import { ICompany } from './company'
import { IGenre } from './genre'

export interface IReferenceGame {
  id: number
  name: string
  release_year: number
  cover_url: string
}

export interface IGame {
  id: number
  name: string
  release_year: number
  votes?: number
  cover_url?: string
  summary?: string
  platforms: IPlatform[]
  companies?: ICompany[]
  genres?: IGenre[]
  ports?: IReferenceGame[]
  remakes?: IReferenceGame[]
  remasters?: IReferenceGame[]
}