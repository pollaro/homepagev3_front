import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
export const useUserStore = defineStore('user', () => {
  const spotifyLoggedIn = ref(false)
  const hblLoggedIn = ref(false)

  async function loginSpotify() {
    return axios.get('/api/spotify/login/').then((response) => {
      if (response.data.loggedIn !== undefined && response.data.loggedIn) {
        spotifyLoggedIn.value = true
        return spotifyLoggedIn
      }
      const win = window.open(response.data)
      const checkWin = setInterval(() => {
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
