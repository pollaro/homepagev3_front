<script setup lang="ts">
  import type { Track } from '@/interfaces/track'

  const playlist = defineModel<Track[]>()
  function moveUpDown(arr: Track[], index: number, direction: string) {
    if (direction == 'up') {
      if (index > 0) {
        const toMove = arr[index]
        arr.splice(index, 1)
        arr.splice(index - 1, 0, toMove)
      }
    } else {
      if (index < arr.length - 1) {
        const toMove = arr[index]
        arr.splice(index, 1)
        arr.splice(index + 1, 0, toMove)
      }
    }
  }
</script>

<template>
  <div class="col" v-show="playlist.length > 0" v-if="playlist && playlist.length > 0">
    <table class="table table-striped table-sm">
      <thead>
        <tr>
          <th scope="col" class="col">#</th>
          <th scope="col" class="col-5">Name</th>
          <th scope="col" class="col-4">Artist</th>
          <th scope="col" class="col text-center">Move</th>
          <th scope="col" class="col text-center">Remove</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in playlist" :key="item.id" class="align-middle">
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.artists[0].name }}</td>
          <td class="text-center">
            <div class="btn-group">
              <button
                class="btn btn-outline-dark btn-sm bi bi-caret-up-fill"
                style="font-size: 0.75em"
                @click="moveUpDown(playlist, index, 'up')"
              />
              <button
                class="btn btn-outline-dark btn-sm bi bi-caret-down-fill"
                style="font-size: 0.75em"
                @click="moveUpDown(playlist, index, 'down')"
              />
            </div>
          </td>
          <td class="text-center">
            <button
              type="button"
              class="col btn btn-outline-danger btn-sm w-50 bi bi-x-lg"
              @click="playlist.splice(index, 1)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
