<script setup lang="ts">
  import { computed, onRenderTracked, onRenderTriggered, reactive, ref, watch } from 'vue'
  import type { Track } from '@/interfaces/track'
  import axios from 'axios'
  import type { Setlist, SetlistArtist, SetlistSong } from '@/interfaces/setlist'
  import { useSpotifyStore } from '@/stores/spotify'

  const concertUrl = ref<string>('')
  let concertSetlist = reactive<Setlist>({} as Setlist)
  let playlistTracks = reactive<Track[]>([])
  let songResults = reactive<{ [key: string]: Track[] }>({})
  const concertPlaylistName = ref<string>('')
  const concertPlaylistDescription = ref<string>('')
  const publicYesNo = ref<boolean>(false)
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

  async function createPlaylist(): Promise<void> {
    if (concertPlaylistName.value == '' || concertPlaylistDescription.value == '') {
      error.status = true
      error.msg = 'Playlist name and description are required'
    }
    if (concertPlaylist.value) {
      concertPlaylist.value.name = concertPlaylistName.value
      concertPlaylist.value.description = concertPlaylistDescription.value
      concertPlaylist.value.public = publicYesNo.value
      concertPlaylist.value.id = spotifyStore.spotifyId
      const response = await axios({
        method: 'post',
        data: { playlist: concertPlaylist.value },
        url: '/api/spotify/playlists/'
      })
    }
  }

  function moveItem(from: number, to: number, array_in: Track[]): void {
    array_in.splice(to, 0, array_in.splice(from, 1)[0])
  }
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        Setlist concert url: <input v-model="concertUrl" placeholder="Enter url" autocomplete="off" />
        <button @click="getConcertSetlist">Get Setlist</button>
      </div>
      <div class="col-md-6">
        <span>New Playlist Name: <input v-model="concertPlaylistName" placeholder="" /></span>
        <span class="row">Description: <input class="col-md-4" v-model="concertPlaylistDescription" /></span>
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
          <div class="row">
            <div class="col-md-2 offset-md-2">
              <button type="button" class="btn btn-secondary" @click="createPlaylist">Create</button>
            </div>
          </div>
        </div>
        <div class="row">
          <div
            class="col-md-6"
            v-show="concertPlaylist.tracks.length > 0"
            v-if="concertPlaylist.tracks && concertPlaylist.tracks.length > 0"
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
                <tr v-for="(item, index) in concertPlaylist.tracks" :key="item.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ concertSetlist.artist?.name }}</td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-secondary"
                      v-if="index > 0"
                      @click="moveItem(index, index - 1, playlistTracks)"
                    >
                      <i class="bi bi-arrow-up" /></button
                    ><button
                      type="button"
                      class="btn btn-secondary"
                      v-if="index < playlistTracks.length - 1"
                      @click="moveItem(index, index + 1, playlistTracks)"
                    >
                      <i class="bi bi-arrow-down" />
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-outline-danger"
                      @click="concertPlaylist.tracks.splice(index, 1)"
                    >
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
            <table class="table table-striped">
              <tbody v-for="(setNumber, setIndex) in concertSetlist.sets?.set" :key="setIndex">
                <tr>
                  <td>{{ setNumber.name }}</td>
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
                                <td>
                                  Song: {{ songResult.name
                                  }}<span v-if="songResult.album?.name"> on {{ songResult.album.name }}</span>
                                </td>
                                <td>
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

<style scoped></style>
