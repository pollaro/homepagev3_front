<script setup lang="ts">
  defineProps(['error'])

  const playlistDescription = defineModel('playlistDescription')
  const playlistName = defineModel('playlistName')
  const publicYesNo = defineModel('publicYesNo')
</script>

<template>
  <span v-show="error.status" class="row text-danger">{{ error.msg }}</span>
  <div class="row mt-1">
    <div>
      <label class="col-md-3 text-end" for="playlistName">New Playlist Name:</label>
      <input id="playlistName" v-model="playlistName" />
    </div>
  </div>
  <div class="row mt-1">
    <div>
      <label class="col-md-3 text-end" for="playlistDescription">Description:</label>
      <input id="playlistDescription" v-model="playlistDescription" />
    </div>
  </div>
  <div class="row mt-1">
    <div class="offset-md-3 pr-1">
      <input type="radio" class="btn-check" name="public" id="public" :value="true" v-model="publicYesNo" /><label
        class="btn btn-outline-secondary"
        for="public"
        >Public
      </label>
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
  </div>
  <div class="row mt-1">
    <div class="offset-md-3 pr-1">
      <button type="button" class="btn btn-secondary" @click="$emit('createPlaylist')">Create</button>
    </div>
  </div>
</template>

<style scoped></style>
