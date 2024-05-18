<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { Ref } from 'vue'

  const genrePlaylistName: Ref<string> = ref('')
  const selectedGenre = ref()
  const placeholder = computed<string>(() => selectedGenre.value.name)
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <select v-model="selectedGenre"></select>
      </div>
      <div class="col-md-6">New Playlist Name: <input v-model="genrePlaylistName" :placeholder="placeholder" /></div>
    </div>
  </div>
</template>

<style scoped></style>
