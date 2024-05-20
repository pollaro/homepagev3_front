import type { Track } from '@/interfaces/track'

interface Playlist {
  collaborative?: boolean
  description: string
  external_urls?: object
  followers?: object
  href?: string
  id?: string
  images?: object[]
  name: string
  owner: object
  public: boolean
  snapshot_id?: string
  tracks: Track[]
  type?: string
  uri?: string
}

export type { Playlist }
