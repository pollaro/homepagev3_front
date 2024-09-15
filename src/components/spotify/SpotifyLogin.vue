<script setup lang="ts">
  import { ref } from 'vue'
  import type { Ref } from 'vue'
  import { useUserStore } from '@/stores/spotifyUser'

  const userStore = useUserStore()
  const loading: Ref<boolean> = ref(false)

  function handleSubmit(): void {
    loading.value = true
    userStore.loginSpotify()
    loading.value = false
  }
</script>

<template>
  <div class="container">
    <div class="col-md-6 mx-auto">
      <span>To use this feature, logging in to Spotify is required</span>
      <div class="card-container col-md-6 mx-auto">
        <button type="button" class="btn btn-success" @click="handleSubmit" :disabled="loading">
          Go To Spotify Login
        </button>
        <span class="spinner-border spinner-border-sm" v-show="loading" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
