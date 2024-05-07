<script setup lang="ts">
  import { ref } from 'vue'
  import axios from 'axios'

  const concertUrl = ref('')
  const concertSetlist = ref()
  const concertPlaylistName = ref('')
  function getConcertSetlist() {
    axios
      .get(concertUrl.value)
      .then((response) => {
        concertSetlist.value = response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        Setlist concert url: <input v-model="concertUrl" placeholder="Enter url" autocomplete="off" />
        <button @click="getConcertSetlist()" />
      </div>
      <div class="col-md-6"></div>
    </div>
    <div class="row">
      <div class="col-md-6">New Playlist Name (editable): <input v-model="concertPlaylistName" placeholder="" /></div>
    </div>
  </div>
</template>

<style scoped></style>
