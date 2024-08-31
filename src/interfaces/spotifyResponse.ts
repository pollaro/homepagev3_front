import type { Track } from '@/interfaces/track'

interface SpotifyResponseItem {
  added_at: string
  track: Track
}

interface SpotifyResponse {
  href: string
  limit: number
  next: string
  offset: number
  previous: string
  total: number
  items: SpotifyResponseItem[]
}

export type { SpotifyResponse, SpotifyResponseItem }
