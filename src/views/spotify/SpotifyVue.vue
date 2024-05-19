<script setup lang="ts">
  import SpotifyLogin from '@/components/spotify/SpotifyLogin.vue'
  import { useUserStore } from '@/stores/user'
  import { useSpotifyStore } from '@/stores/spotify'
  import { BListGroup, BListGroupItem } from 'bootstrap-vue-next'
  import { onMounted, ref } from 'vue'
  import type { Ref } from 'vue'
  import { useRouter } from 'vue-router'

  interface Tool {
    id: number
    name: string
    path: string
  }

  const userStore = useUserStore()
  const spotifyStore = useSpotifyStore()
  const selectedPlaylist = ref()
  const playlistType = ref('')
  const selectedTool: Ref<Tool> = ref({ id: 0, name: '', path: '/' })
  const router = useRouter()

  const tools: Tool[] = [
    { id: 1, name: 'SetList FM', path: '/setlist' },
    { id: 2, name: 'Genre', path: '/genre' },
    { id: 3, name: 'Decade', path: '/decade' },
    { id: 4, name: 'Manual', path: '/manual' }
  ]

  function changeRoute(): void {
    router.push({ path: `/spotify${selectedTool.value}` })
  }

  onMounted(() => {
    userStore.check()
  })
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
      <div class="row">
        <div class="col-md-6">
          Playlist Tool:
          <select v-model="selectedTool" @change="changeRoute()">
            <option v-for="tool in tools" :value="tool.path" :key="tool.id">
              {{ tool.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          Source playlist:
          <select v-model="playlistType">
            <option value="playlist">Playlist</option>
            <option value="savedSongs">Saved Tracks</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col-md-5 offset-1">
          <select v-model="selectedPlaylist" v-show="playlistType === 'playlist'">
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
      <router-view v-show="selectedTool" v-slot="{ Component }">
        <component
          :is="Component"
          :playlist="`${playlistType} === 'savedSongs' ? 'Saved Tracks' : ${selectedPlaylist.name}`"
        />
      </router-view>
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
