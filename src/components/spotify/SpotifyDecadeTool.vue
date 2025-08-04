<script setup lang="ts">
  import type { Track } from '@/interfaces/track'
  import axios from 'axios'
  import { useSpotifyStore } from '@/stores/spotify'
  import { storeToRefs } from 'pinia'
  import { onMounted, ref, watch } from 'vue'
  import SpotifyPlaylistCreate from '@/components/spotify/SpotifyPlaylistCreate.vue'
  import SpotifyPlaylistTable from '@/components/spotify/SpotifyPlaylistTable.vue'

  interface Decade {
    id: number
    name: string
    lowerLimit: number
    upperLimit: number
  }
  interface decadePlayList {
    tracks: Track[] | null
    name: string
    description: string
    public: boolean
    id: string
  }

  let error = { status: false, msg: '' }

  const spotifyStore = useSpotifyStore()
  const { savedTracks, playlists } = storeToRefs(spotifyStore)

  const props = defineProps<{ playlistType: string; playlist: null }>()
  const decades: Decade[] = [
    { id: 50, name: '50s', lowerLimit: 1950, upperLimit: 1959 },
    { id: 60, name: '60s', lowerLimit: 1960, upperLimit: 1969 },
    { id: 70, name: '70s', lowerLimit: 1970, upperLimit: 1979 },
    { id: 80, name: '80s', lowerLimit: 1980, upperLimit: 1989 },
    { id: 90, name: '90s', lowerLimit: 1990, upperLimit: 1999 },
    { id: 0, name: '00s', lowerLimit: 2000, upperLimit: 2009 },
    { id: 10, name: '10s', lowerLimit: 2010, upperLimit: 2019 },
    { id: 20, name: '20s', lowerLimit: 2020, upperLimit: 2029 }
  ]

  const selectedDecade = ref<Decade>({ id: 0, name: '', lowerLimit: 0, upperLimit: 0 })
  const decadePlaylist = ref<decadePlayList>({ tracks: null, name: '', description: '', public: false, id: '' })
  function createDecadePlaylist(): void {
    let sourcePlaylistTracks = []
    if (props.playlistType === 'savedSongs') {
      sourcePlaylistTracks = savedTracks.value
    } else if (props.playlistType === 'playlist') {
      if (Array.isArray(playlists) && playlists.length > 0) {
        const sourcePlaylist = playlists.find((playlist) => playlist.name === props.playlist.name)
        sourcePlaylistTracks = sourcePlaylist.tracks
      }
    }
    const decadeTracks: Track[] = []
    if (Array.isArray(sourcePlaylistTracks) && sourcePlaylistTracks.length > 0) {
      sourcePlaylistTracks.forEach((track) => {
        if (
          parseInt(track.album.release_date.slice(0, 4)) >= selectedDecade.value.lowerLimit &&
          parseInt(track.album.release_date.slice(0, 4)) <= selectedDecade.value.upperLimit
        ) {
          decadeTracks.push(track)
        }
      })
    }
    decadePlaylist.value = { tracks: decadeTracks, name: '', description: '', public: false, id: '' }
  }
  async function createPlaylistCallback(
    decadePlaylistName: string,
    decadePlaylistDescription: string,
    publicYesNo: boolean
  ): Promise<void> {
    if (decadePlaylistName == '' || decadePlaylistDescription == '') {
      error.status = true
      error.msg = 'Playlist name and description are required'
    }
    if (decadePlaylist.value) {
      decadePlaylist.value.name = decadePlaylistName
      decadePlaylist.value.description = decadePlaylistDescription
      decadePlaylist.value.public = publicYesNo
      decadePlaylist.value.id = spotifyStore.spotifyId
      await axios({
        method: 'post',
        data: { playlist: decadePlaylist.value },
        url: '/api/spotify/playlists/'
      })
    }
  }

  watch(props, createDecadePlaylist)
</script>

<template>
  <!--  <div class="container">-->
  <div class="row">
    <div class="col-md-6 text-center">
      <label for="selectedDecade">Decade:</label>
      <select v-model="selectedDecade" id="selectedDecade" @change="createDecadePlaylist">
        <option v-for="decade in decades" :value="decade" :key="decade.id">
          {{ decade.name }}
        </option>
      </select>
    </div>
    <div class="col-md-6">
      <SpotifyPlaylistCreate :error="error" @create-playlist.once="createPlaylistCallback" />
    </div>
    <div class="row mt-1">
      <SpotifyPlaylistTable v-model="decadePlaylist.tracks" />
    </div>
  </div>
</template>

<style scoped></style>
