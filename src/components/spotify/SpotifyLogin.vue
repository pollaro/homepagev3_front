<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import type { Ref } from 'vue'
  import { useUserStore } from '@/stores/spotifyUser'
  import { useRouter } from 'vue-router'

  const userStore = useUserStore()
  const router = useRouter()
  const loading: Ref<boolean> = ref(false)

  userStore.$subscribe((mutation, state) => {
    if (state.spotifyLoggedIn == true) {
      router.push({ path: `/spotify` })
    }
  })

  function handleSubmit(): void {
    loading.value = true
    userStore.loginSpotify()
    loading.value = false
  }

  onMounted(() => userStore.checkLogin())
</script>

<template>
  <div class="container">
    <div class="col-md-6 mx-auto text-center">
      <p>To use this feature, logging in to Spotify is required</p>
      <button type="button" class="btn btn-success" @click="handleSubmit" :disabled="loading">
        Go To Spotify Login
      </button>
      <span class="spinner-border spinner-border-sm" v-show="loading" />
    </div>
  </div>
</template>

<style scoped></style>
