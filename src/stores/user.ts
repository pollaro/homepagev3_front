import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
export const useUserStore = defineStore('user', () => {
  const spotifyLoggedIn = ref(false)
  const hblLoggedIn = ref(false)

  function loginSpotify() {
    return axios.get('/api/spotify/login/').then((response) => {
      const win = window.open(response.data)
      const checkWin = setInterval(() => {
        if (!win || !win.closed) {
          return
        }
        clearInterval(checkWin)
        spotifyLoggedIn.value = true
      }, 500)
    })
  }
  function logoutSpotify(): void {
    spotifyLoggedIn.value = false
  }

  function check(): void {
    axios.get('/api/spotify/check/').then((response) => {
      spotifyLoggedIn.value = response.data
    })
  }

  return { spotifyLoggedIn, loginSpotify, logoutSpotify, check }
})
