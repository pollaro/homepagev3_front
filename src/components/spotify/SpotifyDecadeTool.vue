<script setup lang="ts">
  import type { Track } from '@/interfaces/track'
  import axios from 'axios'
  import { useSpotifyStore } from '@/stores/spotify'
  import { storeToRefs } from 'pinia'
  import { computed, ref } from 'vue'

  interface Decade {
    id: number
    name: string
    lowerLimit: number
    upperLimit: number
  }

  let error = { status: false, msg: '' }

  const spotifyStore = useSpotifyStore()
  const { savedTracks, playlists } = storeToRefs(spotifyStore)

  const props = defineProps({ playlistType: String, playlist: null })
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

  const decadePlaylistName = ref<string>('')
  const decadePlaylistDescription = ref<string>('')
  const publicYesNo = ref<boolean>(false)
  const selectedDecade = ref<Decade>({ id: 0, name: '', lowerLimit: 0, upperLimit: 0 })

  const decadePlaylist = computed(() => {
    let sourcePlaylistTracks
    if (props.playlistType === 'savedSongs') {
      sourcePlaylistTracks = savedTracks.value
    } else if (props.playlistType === 'playlist') {
      if (Array.isArray(playlists) && playlists.length > 0) {
        const sourcePlaylist = playlists.find((playlist) => playlist.name === props.playlist.name)
        sourcePlaylistTracks = sourcePlaylist.tracks
      }
    } else {
      console.error('Playlist not found.')
      return { tracks: null, name: '', description: '', public: '', id: '' }
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
    return { tracks: decadeTracks, name: '', description: '', public: false, id: '' }
  })

  async function createPlaylist(): Promise<void> {
    if (decadePlaylistName.value == '' || decadePlaylistDescription.value == '') {
      error.status = true
      error.msg = 'Playlist name and description are required'
    }
    if (decadePlaylist.value) {
      decadePlaylist.value.name = decadePlaylistName.value
      decadePlaylist.value.description = decadePlaylistDescription.value
      decadePlaylist.value.public = publicYesNo.value
      decadePlaylist.value.id = spotifyStore.spotifyId
      const response = await axios({
        method: 'post',
        data: { playlist: decadePlaylist.value },
        url: '/api/spotify/playlists/'
      })
    }
  }
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        Decade:
        <select v-model.lazy="selectedDecade">
          <option v-for="decade in decades" :value="decade" :key="decade.id">{{ decade.name }}</option>
        </select>
      </div>
      <div class="col-md-6">
        <span v-show="error.status" class="row text-danger">{{ error.msg }}</span>
        <span class="row">New Playlist Name: <input class="col-md-4" v-model="decadePlaylistName" /></span>
        <span class="row">Description: <input class="col-md-4" v-model="decadePlaylistDescription" /></span>
        <div class="row">
          <div class="col-md-2 offset-md-1">
            <input type="radio" class="btn-check" name="public" id="public" :value="true" v-model="publicYesNo" /><label
              class="btn btn-outline-secondary"
              for="public"
              >Public
            </label>
          </div>
          <div class="col-md-2">
            <input
              type="radio"
              class="btn-check"
              id="private"
              name="private"
              :value="false"
              v-model="publicYesNo"
              checked
            /><label class="btn btn-outline-secondary" for="private">Private </label>
          </div>
        </div>
        <div class="row col-md-2 offset-md-2">
          <button type="button" class="btn btn-secondary" @click="createPlaylist">Create</button>
        </div>
      </div>
      <div class="row">
        <div
          class="col-md-6"
          v-show="decadePlaylist.tracks.length > 0"
          v-if="decadePlaylist.tracks !== null && decadePlaylist.tracks && decadePlaylist.tracks.length > 0"
        >
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Artist</th>
                <th scope="col">Move</th>
                <th scope="col">Remove</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in decadePlaylist.tracks" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.artists[0].name }}</td>
                <td></td>
                <td>
                  <button type="button" class="btn btn-outline-danger" @click="decadePlaylist.tracks.splice(index, 1)">
                    X
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
