<script setup lang="ts">
  import SpotifyLogin from '@/components/spotify/SpotifyLogin.vue'
  import { useUserStore } from '@/stores/user'
  import { useSpotifyStore } from '@/stores/spotify'
  import { BListGroup, BListGroupItem } from 'bootstrap-vue-next'
  import { onMounted, ref } from 'vue'
  import router from '@/router'

  const userStore = useUserStore()
  const spotifyStore = useSpotifyStore()
  const selectedPlaylist = ref()
  const selectedTool = ref()
  const playlists = ref()

  const tools = [
    { id: 1, name: 'SetList FM', path: '/setlist' },
    { id: 2, name: 'Genre', path: '/genre' },
    { id: 3, name: 'Decade', path: '/decade' }
  ]

  function changeRoute() {
    router.push(`/spotify/${selectedTool.value}`)
  }

  onMounted(() => {
    userStore.check()
  })
  userStore.$subscribe((mutation, state) => {
    if (state.spotifyLoggedIn == true) {
      spotifyStore.getUserInfo()
    }
  })
</script>

<template>
  <div class="container">
    <SpotifyLogin v-if="!userStore.spotifyLoggedIn" />
    <div v-if="userStore.spotifyLoggedIn">
      <div class="row">
        <div class="col-md-6 offset-md-3">Welcome to my Spotify Apps {{ spotifyStore.spotifyName }}</div>
      </div>
      <div class="row">
        <div class="col">
          <div class="topListsHeads">Top Artists last 12 months</div>
          <BListGroup>
            <BListGroupItem v-for="(item, index) in spotifyStore.topArtists" :key="item.id" class="topListsItems">
              {{ index + 1 }}. {{ item.name }}
            </BListGroupItem>
          </BListGroup>
        </div>
        <div class="col">
          <div class="topListsHeads">Top Songs last 12 months</div>
          <BListGroup>
            <BListGroupItem v-for="(item, index) in spotifyStore.topTracks" :key="item.id" class="topListsItems">
              {{ index + 1 }}. "<span class="topListsSongs">{{ item.name }}</span
              >" by
              <span v-for="childItem in item.artists" :key="childItem.id">{{ childItem.name }}</span>
            </BListGroupItem>
          </BListGroup>
        </div>
      </div>
      <div class="row">Playlist Creator</div>
      <div class="row">Playlist Tool: {{ selectedTool }}</div>
      <select v-model="selectedTool">
        <option v-for="tool in tools" :value="tool.path" :key="tool.id" @change="changeRoute()">{{ tool.name }}</option>
      </select>
      <div class="row">Source playlist: {{ selectedPlaylist }}</div>
      <select v-model="selectedPlaylist">
        <option v-for="playlist in playlists" :value="playlist" :key="playlist.id">{{ playlist.name }}</option>
      </select>
      <router-view />
    </div>
  </div>
</template>

<style scoped>
  .list-group-item,
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
