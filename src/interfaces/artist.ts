interface Artist {
  external_urls: object
  followers: object
  genres: string[]
  href: string
  id: string
  images: object[]
  name: string
  popularity: number
  type: string
  uri: string
}

export type { Artist }
