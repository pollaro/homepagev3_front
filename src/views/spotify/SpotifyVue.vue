<script setup lang="ts">
  import SpotifyLogin from '@/components/spotify/SpotifyLogin.vue'
  import { useUserStore } from '@/stores/spotifyUser'
  import { useSpotifyStore } from '@/stores/spotify'
  import { useRouter } from 'vue-router'
  import { ref } from 'vue'

  interface Tool {
    id: number
    name: string
    displayName: string
    path: string
  }

  const userStore = useUserStore()
  const spotifyStore = useSpotifyStore()
  const selectedPlaylist = ref('')
  const playlistType = ref('')
  const selectedTool = ref('/')
  const router = useRouter()
  const tools: Tool[] = [
    { id: 1, displayName: 'SetList FM', name: 'SpotifySetlistTool', path: '/setlist' },
    { id: 2, displayName: 'Decade', name: 'SpotifyDecadeTool', path: '/decade' }
    // { id: 3, displayName: 'Manual', name: 'SpotifyManualTool', path: '/manual' }
  ]

  function changeRoute(): void {
    router.push({ path: `/spotify${selectedTool.value}` })
  }

  userStore.$subscribe((mutation, state) => {
    if (state.spotifyLoggedIn == true) {
      spotifyStore.getUserInfo()
      spotifyStore.getPlaylists()
      spotifyStore.getSavedTracks()
    }
  })
</script>

<template>
  <div class="container">
    <SpotifyLogin v-if="!userStore.spotifyLoggedIn" />
    <div v-if="userStore.spotifyLoggedIn">
      <!--      Banner-->
      <div class="row mt-4 justify-content-center">
        <div class="col-md-6 text-center">
          <h3>Welcome to my Spotify Apps, {{ spotifyStore.spotifyName }}</h3>
        </div>
      </div>
      <!--      Top lists area-->
      <div class="row mt-3 mb-3">
        <div class="col text-end">
          <div class="topListsHeads">
            <h4>Top Artists last 12 months</h4>
          </div>
          <ol class="list-group list-group-numbered">
            <li v-for="item in spotifyStore.topArtists" :key="item.id" class="topListsItems list-group-item p-0">
              {{ item.name }}
            </li>
          </ol>
        </div>
        <div class="col">
          <div class="topListsHeads">
            <h4>Top Songs last 12 months</h4>
          </div>
          <ol>
            <li v-for="(item, index) in spotifyStore.topTracks" :key="index" class="topListsItems">
              "<span class="topListsSongs">{{ item?.name }}</span
              >" by
              <span v-for="childItem in item?.artists" :key="childItem.id">{{ childItem?.name }}</span>
            </li>
          </ol>
        </div>
      </div>
      <!--      Playlist creator selector-->
      <div class="row mt-3">
        <h4 class="text-center">Playlist Creator</h4>
      </div>
      <!--Tool select-->
      <div class="row justify-content-center m-1">
        <div class="col-md-6 text-center">
          <label for="toolSelect">Playlist Tool:</label>
          <select v-model="selectedTool" @change="changeRoute" id="toolSelect">
            <option v-for="tool in tools" :value="tool.path" :key="tool.id">
              {{ tool.displayName }}
            </option>
          </select>
        </div>
      </div>
      <!--      source playlist select-->
      <div class="row justify-content-center m-1">
        <div class="col-md-6 text-center" v-show="selectedTool == '/decade' || selectedTool == '/manual'">
          <label for="playlistType">Source playlist:</label>
          <select v-model="playlistType" id="playlistType">
            <option value="playlist">Playlist</option>
            <option value="savedSongs">Saved Tracks</option>
          </select>
        </div>
      </div>
      <!--      playlist selector-->
      <div class="row justify-content-center m-1" v-show="playlistType === 'playlist'">
        <div class="col-md-6 text-center">
          <label for="playlistName">Playlist:</label>
          <select v-model="selectedPlaylist" v-show="playlistType === 'playlist'" id="playlistName">
            <option
              v-for="playlist in spotifyStore.playlists.sort((a, b) => a.name.localeCompare(b.name))"
              :value="playlist"
              :key="playlist.id"
            >
              {{ playlist.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="col">
        <router-view v-show="selectedTool != '/'" :playlistType="playlistType" :playlist="selectedPlaylist" />
      </div>
    </div>
  </div>
</template>

<style>
  select {
    margin-left: 0.5%;
  }
  label {
    padding-right: 5px;
  }
  .topListsItems {
    border: none;
  }
  .topListsHeads {
    font-weight: bold;
  }
  .topListsSongs {
    font-style: italic;
  }
</style>
