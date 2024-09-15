import { defineStore } from 'pinia'
import { computed, type ComputedRef, type Ref, ref } from 'vue'
import axios from 'axios'

export const useHBLStore = defineStore('hbl', () => {
  const loggedIn: Ref<boolean> = ref(false)
  const user: Ref<string> = ref('')
  const jimOrGreg: ComputedRef<boolean> = computed(() => {
    const gregGUID: string = 'IGC7L7N4I3ZVMIT24STE44IIMQ'
    const jimGUID: string = 'AI7PH5BPPZJCLQO5UQE3XM3Z6A'
    return [gregGUID, jimGUID].includes(user.value)
  })

  async function loginHBL(): Promise<Ref<boolean> | undefined> {
    return axios.get('/api/hbl/login/').then((response) => {
      if (response.data.loggedIn !== undefined && response.data.loggedIn) {
        loggedIn.value = true
        return loggedIn
      }
      const win: Window | null = window.open(response.data)
      const checkWin: number = setInterval(() => {
        if (!win || !win.closed) {
          return
        }
        clearInterval(checkWin)
        loggedIn.value = true
        return loggedIn
      }, 500)
    })
  }

  function logoutHBL(): void {
    loggedIn.value = false
  }

  async function checkLoggedIn(): Promise<{ loggedIn: Ref<boolean>; user: Ref<String> | null }> {
    return axios.get('/api/hbl/checkLoggedIn').then((response) => {
      if (response.data.loggedIn !== undefined) {
        loggedIn.value = response.data.loggedIn
        user.value = response.data.user
        return { loggedIn: loggedIn, user: user }
      }
      loggedIn.value = false
      return { loggedIn: loggedIn, user: null }
    })
  }
  return { loggedIn, loginHBL, logoutHBL, checkLoggedIn, jimOrGreg }
})
