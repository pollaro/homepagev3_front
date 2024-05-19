<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { Ref } from 'vue'

  interface Props {
    playlist?: any
  }

  interface Decade {
    id: number
    name: string
    lowerLimit: number
    upperLimit: number
  }

  const props = defineProps<Props>()

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

  const decadePlaylistName: Ref<string> = ref('')
  const selectedDecade: Ref<Decade> = ref({ id: 99, name: '', lowerLimit: 0, upperLimit: 0 })
  let decadePlaylist = []

  function inDecade(track, decade) {
    const releaseYear = parseInt(track.album.release_date.slice(0, 4))
    return releaseYear >= decade.value.lowerLimit && releaseYear <= decade.value.upperLimit
  }
  function changeDecadePlaylist() {
    decadePlaylist = []
    props.playlist.tracks.forEach((track) => {
      if (inDecade(track, selectedDecade)) {
        decadePlaylist.push(track)
      }
    })
    return decadePlaylist
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
      <div class="col-md-6">New Playlist Name: <input v-model="decadePlaylistName" /></div>
    </div>
    <div class="row">
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
          <tr v-for="(item, index) in decadePlaylist" :key="item.id">
            <td>{{ index }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.artist }}</td>
            <td></td>
            <td><button class="btn btn-outline-danger" @click="decadePlaylist.splice(index, 1)">X</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
