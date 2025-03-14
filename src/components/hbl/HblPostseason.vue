<script setup lang="ts">
  import { useHBLStore } from '@/stores/hbl'
  import { onMounted, type Ref, ref } from 'vue'
  import axios from 'axios'

  interface rosterCount {
    name: string
    manager: string
    player_count: number
    prospect_count: number
  }

  const hblStore = useHBLStore()
  const rosterInformation: Ref<rosterCount[]> = ref([])
  const loading: Ref<boolean> = ref(false)

  async function getRosterCount(): Promise<void> {
    const response = await axios({ method: 'get', url: 'api/hbl/postseason' })
    rosterInformation.value = response.data
  }

  async function downloadRosters(): Promise<void> {
    loading.value = true
    const response = await axios({ method: 'get', url: '/api/hbl/download' })
    rosterInformation.value = response.data
    loading.value = false
  }

  onMounted(() => {
    getRosterCount()
  })
</script>

<template>
  <div class="container">
    <div v-if="hblStore.jimOrGreg">
      <div class="row col-md-3 offset-md-1">
        <button type="button" class="btn-secondary" @click="downloadRosters" :disabled="loading">
          <span v-if="!loading">Download rosters</span>
          <span class="spinner-border spinner-border-sm" aria-hidden="true" v-if="loading"></span>
          <span role="status" v-if="loading">Loading...</span>
        </button>
      </div>
      <div class="col-md-5 offset-md-6">
        <table v-if="!loading && rosterInformation.length > 0" class="table table-striped table-bordered table-sm">
          <thead>
            <tr>
              <th class="col-4">Team</th>
              <th class="col-4">Manager</th>
              <th class="col-1">Players</th>
              <th class="col-1">Prospects</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(team, index) in rosterInformation" :key="index">
              <td>{{ team.name }}</td>
              <td>{{ team.manager }}</td>
              <td>{{ team.player_count }}</td>
              <td>{{ team.prospect_count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
