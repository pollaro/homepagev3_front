import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { Ref } from 'vue'
import type { Playlist } from '@/interfaces/playlist'
import type { Track } from '@/interfaces/track'
import type { Artist } from '@/interfaces/artist'
import type { SpotifyResponseItem } from '@/interfaces/spotifyResponse'

export const useSpotifyStore = defineStore('spotify', () => {
  const spotifyName: Ref<string> = ref('')
  const spotifyCountry: Ref<string> = ref('')
  const topTracks: Ref<Track[]> = ref([])
  const topArtists: Ref<Artist[]> = ref([])
  const playlists: Ref<Playlist[]> = ref([])
  const savedTracks: Ref<Track[]> = ref([])
  const spotifyId: Ref<string> = ref('')

  async function getUserInfo() {
    try {
      const response = await axios({ method: 'get', url: '/api/spotify/user/' })
      const { user, top_tracks, top_artists } = response.data
      spotifyName.value = user.display_name
      spotifyId.value = user.id
      spotifyCountry.value = user.country
      topTracks.value = top_tracks.items
      topArtists.value = top_artists.items
      return { spotifyName, spotifyCountry, spotifyId }
    } catch (error) {
      console.error(error)
    }
  }

  async function getPlaylists(): Promise<void> {
    try {
      const response: AxiosResponse<any, any> = await axios({ method: 'get', url: '/api/spotify/playlists/' })
      playlists.value = response.data
    } catch (error) {
      console.error(error)
    }
  }

  async function getSavedTracks(): Promise<void> {
    try {
      await getUserInfo()
      const country: string = spotifyCountry.value
      const response = await axios({ method: 'get', url: '/api/spotify/user/tracks/', params: { market: country } })
      savedTracks.value = response.data.map((item: SpotifyResponseItem) => item.track)
    } catch (error) {
      console.error(error)
    }
  }

  return {
    spotifyName,
    spotifyId,
    topTracks,
    topArtists,
    playlists,
    savedTracks,
    spotifyCountry,
    getUserInfo,
    getPlaylists,
    getSavedTracks
  }
})
