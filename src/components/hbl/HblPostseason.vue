<script setup lang="ts">
  import { useHBLStore } from '@/stores/hbl'
  import { useTeamStore } from '@/stores/teamStore'
  import { type Ref, ref } from 'vue'
  import axios from 'axios'

  const hblStore = useHBLStore()
  const teamStore = useTeamStore()
  const loading: Ref<boolean> = ref(false)

  async function downloadRosters(): Promise<void> {
    const response = await axios({ method: 'get', url: '/api/hbl/download' })
  }
</script>

<template>
  <div class="container">
    <div v-if="hblStore.jimOrGreg" class="col-md-6 mx-auto">
      <div class="row col-md-2">
        <button type="button" class="btn-secondary" @click="downloadRosters">Download rosters</button>
      </div>
      <table v-if="teamStore.rosters.length > 0" class="table table-striped table-bordered table-sm">
        <thead>
          <tr>
            <th class="col-1">Team</th>
            <th class="col-1">Manager</th>
            <th class="col-1">Players</th>
            <th class="col-1">Prospects</th>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
