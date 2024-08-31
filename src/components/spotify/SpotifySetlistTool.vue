<script setup lang="ts">
  import { computed, ref } from 'vue'
  import type { Track } from '@/interfaces/track'
  import axios from 'axios'
  import type { Setlist } from '@/interfaces/setlist'

  const concertUrl = ref<string>('')
  const concertSetlist = ref<Setlist>()
  const concertPlaylistName = ref<string>('')

  const concertPlaylist = computed(() => {
    const playlistTracks: Track[] = []
    return { tracks: playlistTracks, name: '', description: '', public: false, id: '' }
  })

  async function getConcertSetlist() {
    const concertIdRegex = new RegExp('(?<=-)([a-zA-Z0-9]*).html$')
    let concertId: string | null = null
    if (concertUrl.value.length > 0 && concertIdRegex.test(concertUrl.value) && concertIdRegex.exec(concertUrl.value)) {
      concertId = concertIdRegex.exec(concertUrl.value)[1]
      const response = await axios({
        method: 'get',
        url: '/api/setlist/',
        params: { setlistId: concertId }
      })
      concertSetlist.value = response.data
    }
  }
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        Setlist concert url: <input v-model="concertUrl" placeholder="Enter url" autocomplete="off" />
        <button @click="getConcertSetlist">Get Setlist</button>
      </div>
      <div class="col-md-6">New Playlist Name: <input v-model="concertPlaylistName" placeholder="" /></div>
    </div>
    <div class="row">
      <div class="col-md-6" v-show="concertSetlist" v-if="concertSetlist">
        <div class="row">
          <span v-if="concertSetlist.artist && concertSetlist.artist.name">{{ concertSetlist.artist.name }}</span>
          <div class="row">
            <span v-if="concertSetlist.venue">
              <span v-if="concertSetlist.venue.city && concertSetlist.venue.city.name">
                {{ concertSetlist.venue.city.name }}
              </span>
              <span v-if="concertSetlist.venue.city && concertSetlist.venue.city.state">
                ,{{ concertSetlist.venue.city.state }}
              </span>
              <span v-if="concertSetlist.eventDate">{{ concertSetlist.eventDate }}</span>
            </span>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6" v-show="concertSetlist.set && concertSetlist.set.length > 0">
            <table class="table table-striped">
              <tbody v-for="(set, setIndex) in concertSetlist.set" :key="setIndex">
                <tr v-show="set.name" v-if="set.name">
                  <td>{{ set.name }}</td>
                </tr>
                <tr v-for="(song, songIndex) in set.song" :key="songIndex">
                  <td>{{ songIndex }}</td>
                  <td>{{ song.name }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
