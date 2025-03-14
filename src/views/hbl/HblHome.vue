<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import HblLogin from '@/components/hbl/HblLogin.vue'
  import { useHBLStore } from '@/stores/hbl'

  const hblStore = useHBLStore()

  onMounted(() => {
    hblStore.checkLoggedIn()
  })
</script>

<template>
  <div class="container">
    <HblLogin v-if="!hblStore.hblLoggedIn" />
    <div v-if="hblStore.hblLoggedIn">
      <div class="row justify-content-center">
        <div class="h2 col-6">Huckleberry Baseball League</div>
      </div>
      <nav class="navbar navbar-expand-lg mb-2 mb-lg-0">
        <ul class="navbar-nav me-auto">
          <li class="nav-item"><router-link class="nav-link" to="/hbl/teams">Teams</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/hbl/roster">Rosters</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/hbl/prospects">Prospects</router-link></li>
          <li class="nav-item" v-if="hblStore.jimOrGreg">
            <router-link class="nav-link" to="/preseason">Preseason</router-link>
          </li>
          <li class="nav-item" v-if="hblStore.jimOrGreg">
            <router-link class="nav-link" to="/postseason">Postseason</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
  <router-view />
</template>

<style scoped>
  .nav-item {
    font-size: 1rem;
  }
</style>
