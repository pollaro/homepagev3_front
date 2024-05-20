<script setup lang="ts">
  import axios from 'axios'
  import { BListGroup, BListGroupItem } from 'bootstrap-vue-next'

  const concertUrl = defineModel<string>({ default: '' })
  const concertSetlist = defineModel()
  const concertPlaylistName = defineModel<string>({ default: '' })
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
  <!--  <div class="container">-->
  <!--    <div class="row">-->
  <!--      <div class="col-md-6">-->
  <!--        Setlist concert url: <input v-model="concertUrl" placeholder="Enter url" autocomplete="off" />-->
  <!--        <button @click="getConcertSetlist()" />-->
  <!--      </div>-->
  <!--      <div class="col-md-6">New Playlist Name: <input v-model="concertPlaylistName" placeholder="" /></div>-->
  <!--    </div>-->
  <!--    <div class="row">-->
  <!--      <div class="col-md-6">-->
  <!--        <BListGroup numbered>-->
  <!--          <BListGroupItem v-for="item in blank" :key="item.id">{{ item.name }}</BListGroupItem>-->
  <!--        </BListGroup>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<style scoped></style>
