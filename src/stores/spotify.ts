import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { Ref } from 'vue'

export const useSpotifyStore = defineStore('spotify', () => {
  const spotifyName: Ref<string> = ref('')
  const spotifyCountry: Ref<string> = ref('')
  const topTracks: Ref<any[]> = ref([])
  const topArtists: Ref<any[]> = ref([])
  const playlists: Ref<any[]> = ref([])
  const savedTracks: Ref<any[]> = ref([])

  function getUserInfo() {
    return axios({ method: 'get', url: '/api/spotify/user/' }).then((response: AxiosResponse) => {
      const { user, top_tracks, top_artists } = response.data
      spotifyName.value = user.display_name
      spotifyCountry.value = user.country
      topTracks.value = top_tracks.items
      topArtists.value = top_artists.items
      return { spotifyName, spotifyCountry }
    })
  }

  function getPlaylists(): void {
    axios({ method: 'get', url: '/api/spotify/playlists/' }).then((response: AxiosResponse): void => {
      const playlistResponse = response.data
      playlists.value = playlistResponse.map(({ name, tracks, id }) => ({ name, tracks, id }))
    })
  }

  async function getSavedTracks() {
    await getUserInfo()
    const country = spotifyCountry.value
    axios({ method: 'get', url: '/api/spotify/user/tracks/', params: { market: country } }).then(
      (response: AxiosResponse): void => {
        savedTracks.value = response.data
      }
    )
  }

  return {
    spotifyName,
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
