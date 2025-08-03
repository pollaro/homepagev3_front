<script setup lang="ts">
  import { computed, reactive, ref } from 'vue'
  import type { Track } from '@/interfaces/track'
  import axios from 'axios'
  import type { Setlist, SetlistArtist, SetlistSong } from '@/interfaces/setlist'
  import { useSpotifyStore } from '@/stores/spotify'
  import SpotifyPlaylistCreate from '@/components/spotify/SpotifyPlaylistCreate.vue'
  import SpotifyPlaylistTable from '@/components/spotify/SpotifyPlaylistTable.vue'

  const concertUrl = ref<string>('')
  let concertSetlist = reactive<Setlist>({} as Setlist)
  let playlistTracks = reactive<Track[]>([])
  let songResults = reactive<{ [key: string]: Track[] }>({})
  let error = { status: false, msg: '' }

  const spotifyStore = useSpotifyStore()

  const concertPlaylist = computed(() => {
    return { tracks: playlistTracks, name: '', description: '', public: false, id: '' }
  })

  const concertDate = computed<string>(() => {
    const dateRegex = new RegExp('([0-9]{1,2})-([0-9]{1,2})-([0-9]{1,4})')
    if (concertSetlist.eventDate) {
      const dateMatch = concertSetlist.eventDate.match(dateRegex)
      if (dateMatch) {
        const month = dateMatch[2]
        const date = dateMatch[1]
        return month.concat('/', date, '/', dateMatch[3])
      }
      return ''
    }
    return ''
  })

  async function getConcertSetlist(): Promise<Setlist> {
    const concertIdRegex = new RegExp('(?<=-)([a-zA-Z0-9]*).html$')
    let concertId: string | null = null
    if (concertUrl.value.length > 0 && concertIdRegex.test(concertUrl.value)) {
      concertId = concertIdRegex.exec(concertUrl.value)![1]
      const response = await axios({
        method: 'get',
        url: '/api/spotify/setlist',
        params: { setlistId: concertId }
      })
      Object.keys(response.data).forEach((key) => (concertSetlist[key as keyof Setlist] = response.data[key]))
    }
    return concertSetlist
  }

  async function searchForSong(artist: SetlistArtist | undefined, song: SetlistSong, songIndex: string): Promise<void> {
    let searchArtist = null
    if (artist || artist !== undefined) {
      searchArtist = artist.name
    }
    const response = await axios({
      method: 'get',
      url: '/api/spotify/song',
      params: { artist: searchArtist, track: song.name }
    })
    songResults[songIndex] = response.data
  }

  async function createPlaylistCallback(
    concertPlaylistName: string,
    concertPlaylistDescription: string,
    publicYesNo: boolean
  ): Promise<void> {
    if (concertPlaylistName == '' || concertPlaylistDescription == '') {
      error.status = true
      error.msg = 'Playlist name and description are required'
    }
    if (concertPlaylist.value) {
      concertPlaylist.value.name = concertPlaylistName
      concertPlaylist.value.description = concertPlaylistDescription
      concertPlaylist.value.public = publicYesNo
      concertPlaylist.value.id = spotifyStore.spotifyId
      const response = await axios({
        method: 'post',
        data: { playlist: concertPlaylist.value },
        url: '/api/spotify/playlists/'
      })
    }
  }
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6 text-center">
        <span class="text-danger fs-5">This is still under development</span>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 text-end">
        Setlist concert url: <input v-model="concertUrl" placeholder="Enter url" autocomplete="off" />
        <button @click="getConcertSetlist">Get Setlist</button>
      </div>
      <div class="col-md-6">
        <SpotifyPlaylistCreate :error="error" @create-playlist.once="createPlaylistCallback" />
        <div class="row mt-1">
          <SpotifyPlaylistTable v-model="concertPlaylist.tracks" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="row">
          <span v-show="concertSetlist.artist?.name">{{ concertSetlist.artist?.name }}</span>
          <div class="row">
            <span v-show="concertSetlist.venue?.city">
              <span v-show="concertSetlist.venue?.city?.name">
                {{ concertSetlist.venue?.city?.name }}
              </span>
              <span v-show="concertSetlist.venue?.city?.state">, {{ concertSetlist.venue?.city?.state }} </span>
            </span>
            <div class="row" v-show="concertDate">
              <span>{{ concertDate }}</span>
            </div>
          </div>
        </div>
        <div class="row" v-show="concertSetlist.sets">
          <div class="col-md-6">
            <table class="table table-striped align-middle">
              <tbody v-for="(setNumber, setIndex) in concertSetlist.sets?.set" :key="setIndex">
                <tr>
                  <td>Set {{ setIndex + 1 }}{{ setNumber.name }}</td>
                </tr>
                <tr v-for="(song, songIndex) in setNumber.song" :key="songIndex" :id="`${setIndex}-${songIndex}-row`">
                  <td>
                    {{ songIndex + 1 }}
                  </td>
                  <td
                    v-if="!('tape' in song) || song.tape == false"
                    class="accordion"
                    :id="`accordian-${setIndex}-${songIndex}`"
                  >
                    <div class="accordion-item">
                      <div class="accordion-header">
                        <button
                          type="button"
                          class="accordion-button collapsed"
                          data-bs-toggle="collapse"
                          :data-bs-target="`#song-${setIndex}-${songIndex}`"
                          aria-expanded="false"
                          :aria-controls="`song-${setIndex}-${songIndex}`"
                        >
                          {{ song.name }}
                        </button>
                        <div
                          :id="`song-${setIndex}-${songIndex}`"
                          class="accordion-collapse collapse"
                          :data-bs-parent="`#accordian-${setIndex}-${songIndex}`"
                        >
                          <div class="accordion-body">
                            <button
                              @click="searchForSong(concertSetlist.artist, song, `song-${setIndex}-${songIndex}`)"
                            >
                              Search Spotify
                            </button>
                            <table
                              class="table"
                              v-if="
                                songResults[`song-${setIndex}-${songIndex}`] &&
                                songResults[`song-${setIndex}-${songIndex}`].length > 0
                              "
                            >
                              <tr
                                v-for="(songResult, songResultIndex) in songResults[`song-${setIndex}-${songIndex}`]"
                                :key="songResultIndex"
                              >
                                <td class="results">
                                  Song: {{ songResult.name
                                  }}<span v-if="songResult.album?.name"> on {{ songResult.album.name }}</span>
                                </td>
                                <td class="results">
                                  <button @click="playlistTracks.push(songResult)">Add To Playlist</button>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td v-if="'tape' in song && song.tape == true">
                    {{ song.name }} <span v-if="'cover' in song"><br />(Cover of {{ song.cover?.name }})</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  span {
    padding: 0;
  }
  .results {
    font-size: 0.8em;
  }
</style>
