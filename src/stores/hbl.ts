import { defineStore } from 'pinia'
import { computed, type ComputedRef, type Ref, ref } from 'vue'
import axios, { type AxiosResponse } from 'axios'

export const useHBLStore = defineStore('hbl', () => {
  const hblLoggedIn: Ref<boolean> = ref(false)
  const user: Ref<string> = ref('')
  const jimOrGreg: Ref<boolean> = ref(false)

  async function loginHBL(): Promise<Ref<boolean> | undefined> {
    const response: AxiosResponse = await axios.get('/api/hbl/login/')
    if (response.data.loggedIn !== undefined && response.data.loggedIn) {
      hblLoggedIn.value = true
      return hblLoggedIn
    }
    const win: Window | null = window.open(response.data)
    setInterval(async (): Promise<Ref<boolean> | undefined> => {
      if (!win || !win.closed) {
        return
      }
      await checkLoggedIn()
    }, 500)
  }

  function logoutHBL(): void {
    hblLoggedIn.value = false
  }

  async function checkLoggedIn(): Promise<{
    loggedIn: Ref<boolean>
    user: Ref<String> | null
    jimOrGreg: Ref<boolean>
  }> {
    const response: AxiosResponse = await axios.get('/api/hbl/check/')
    if (response.data.loggedIn !== undefined) {
      hblLoggedIn.value = response.data.loggedIn
      jimOrGreg.value = response.data.jimOrGreg
      user.value = response.data.user
      return { loggedIn: hblLoggedIn, user: user, jimOrGreg: jimOrGreg }
    }
    hblLoggedIn.value = false
    jimOrGreg.value = false
    return { loggedIn: hblLoggedIn, user: null, jimOrGreg: jimOrGreg }
  }

  return { hblLoggedIn, loginHBL, logoutHBL, checkLoggedIn, jimOrGreg }
})
