import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { Ref } from 'vue'

export const useSpotifyStore = defineStore('spotify', () => {
  const spotifyName = ref('')
  const topTracks: Ref<any[]> = ref([])
  const topArtists: Ref<any[]> = ref([])
  const playlists: Ref<any[]> = ref([])
  const savedTracks: Ref<any[]> = ref([])

  async function getUserInfo() {
    return axios.get('/api/spotify/user/').then((response) => {
      const { user, top_tracks, top_artists } = response.data
      spotifyName.value = user.display_name
      topTracks.value = top_tracks.items
      topArtists.value = top_artists.items
    })
  }

  return { spotifyName, topTracks, topArtists, playlists, savedTracks, getUserInfo }
})
