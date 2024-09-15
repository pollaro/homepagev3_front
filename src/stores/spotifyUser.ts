import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import axios from 'axios'
export const useUserStore = defineStore('spotifyUser', () => {
  const spotifyLoggedIn: Ref<boolean> = ref(false)

  async function loginSpotify(): Promise<Ref<boolean> | undefined> {
    return axios.get('/api/spotify/login/').then((response) => {
      if (response.data.loggedIn !== undefined && response.data.loggedIn) {
        spotifyLoggedIn.value = true
        return spotifyLoggedIn
      }
      const win: Window | null = window.open(response.data)
      const checkWin: number = setInterval(() => {
        if (!win || !win.closed) {
          return
        }
        clearInterval(checkWin)
        spotifyLoggedIn.value = true
        return spotifyLoggedIn
      }, 500)
    })
  }
  function logoutSpotify(): void {
    spotifyLoggedIn.value = false
  }

  return { spotifyLoggedIn, loginSpotify, logoutSpotify }
})
