<script setup lang="ts">
  import type { Playlist } from '@/interfaces/playlist'
  import type { Track } from '@/interfaces/track'
  import axios from 'axios'
  import { useSpotifyStore } from '@/stores/spotify'

  interface Decade {
    id: number
    name: string
    lowerLimit: number
    upperLimit: number
  }

  const spotifyStore = useSpotifyStore()

  const decades: Decade[] = [
    { id: 50, name: '50s', lowerLimit: 1950, upperLimit: 1959 },
    { id: 60, name: '60s', lowerLimit: 1960, upperLimit: 1969 },
    { id: 70, name: '80s', lowerLimit: 1970, upperLimit: 1979 },
    { id: 80, name: '80s', lowerLimit: 1980, upperLimit: 1989 },
    { id: 90, name: '90s', lowerLimit: 1990, upperLimit: 1999 },
    { id: 0, name: '2000s', lowerLimit: 2000, upperLimit: 2009 },
    { id: 10, name: '10s', lowerLimit: 2010, upperLimit: 2019 },
    { id: 20, name: '20s', lowerLimit: 2020, upperLimit: 2029 }
  ]
  const playlist = defineModel<Playlist | null>('playlist', { default: null })
  const decadePlaylistName = defineModel<string>({ default: '' })
  const decadePlaylistDescription = defineModel<string>({ default: '' })
  const publicYesNo = defineModel<boolean>({ default: false })
  const decadePlaylist = defineModel<Playlist | null>({ default: null })
  const selectedDecade = defineModel<Decade>({ default: { id: 99, name: '', lowerLimit: 0, upperLimit: 0 } })
  let error = { status: false, msg: '' }

  function inDecade(track: Track, decade: Decade): boolean {
    const releaseYear = parseInt(track.album.release_date.slice(0, 4))
    return releaseYear >= decade.lowerLimit && releaseYear <= decade.upperLimit
  }

  function changeDecadePlaylist(): void {
    if (decadePlaylist.value && 'tracks' in decadePlaylist.value) {
      decadePlaylist.value.tracks = []
      if (playlist.value) {
        playlist.value.tracks.forEach((track: Track) => {
          if (inDecade(track, selectedDecade.value)) {
            decadePlaylist.value.tracks.push(track)
          }
        })
      }
    }
  }

  async function createPlaylist(): void {
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
        data: JSON.stringify({ playlist: decadePlaylist }),
        url: '/spotify/playlist/create'
      })
    }
  }
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        Decade:
        <select v-model="selectedDecade" @change="changeDecadePlaylist">
          <option v-for="decade in decades" :value="decade.name" :key="decade.id">{{ decade.name }}</option>
        </select>
      </div>
      <div class="col-md-6">
        <span v-if="error.status" class="text-danger">{{ error.msg }}</span>
        New Playlist Name: <input v-model="decadePlaylistName" /> Description:
        <input v-model="decadePlaylistDescription" />
        <input type="checkbox" class="btn-check" autocomplete="off" id="public" v-model="publicYesNo" /><label
          class="btn btn-outline-secondary"
          for="public"
        >
          Public
        </label>
        <button type="button" class="btn btn-secondary" @click="createPlaylist">Create</button>
      </div>
    </div>
    <div class="row" v-show="decadePlaylist">
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
            <td>{{ index }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.artists[0] }}</td>
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
</template>

<style scoped></style>
