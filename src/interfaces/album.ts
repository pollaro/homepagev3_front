import type { Track } from '@/interfaces/track'
import type { Artist } from '@/interfaces/artist'

interface Album {
  album_type: string
  total_tracks: number
  available_markets: string[]
  external_urls: object
  href: string
  id: string
  images: object[]
  name: string
  release_date: string
  release_date_precision: string
  restrictions: object
  type: string
  uri: string
  artists: Artist[]
  tracks: Track[]
  copyrights: object[]
  external_ids: object
  genre: string[]
  label: string
  popularity: number
}

export type { Album }
