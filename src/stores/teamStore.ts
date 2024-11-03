import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import axios, { type AxiosResponse } from 'axios'
import type { HblTeam } from '@/interfaces/hblTeam'

export const useTeamStore = defineStore('teams', () => {
  const teams: Ref<HblTeam[]> = ref([])
  const rosters: Ref<object[]> = ref([])

  async function getAllTeams(): Promise<Ref | undefined> {
    if (!teams.value.length) {
      const response: AxiosResponse = await axios.get('/api/hbl/teams')
      if (response.data.length > 0) {
        teams.value = response.data
        return teams
      }
    }
  }

  return { teams, rosters, getAllTeams }
})
