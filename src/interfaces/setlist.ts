interface Setlist {
  artist?: SetlistArtist
  venue?: SetlistVenue
  tour?: object
  set?: Set[]
  info?: string
  url?: string
  id?: string
  versionId?: string
  lastFmEventId?: number
  eventDate?: string
  lastUpdated?: string
}

interface Set {
  name?: string
  encore?: number
  song?: SetlistSong[]
}
interface SetlistArtist {
  mbid?: string
  tmid?: number
  name?: string
  sortName?: string
  disambiguation?: string
  url?: string
}

interface SetlistSong {
  name?: string
  with?: SetlistArtist
  cover?: SetlistArtist
  info?: string
  tape?: boolean
}

interface SetlistVenue {
  city?: SetlistCity
  url?: string
  id?: string
  name?: string
}

interface SetlistCity {
  id?: string
  name?: string
  stateCode?: string
  state?: string
  coords?: object
  country?: object
}

export type { Setlist, SetlistSong, SetlistArtist, Set, SetlistVenue, SetlistCity }
