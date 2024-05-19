import type { Album } from '@/interfaces/album'
import type { Artist } from '@/interfaces/artist'

interface Track {
  album: Album
  artists: Artist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: object
  href: string
  id: string
  is_playable: boolean
  linked_from: object
  restrictions: object
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
  is_local: boolean
}

export type { Track }
