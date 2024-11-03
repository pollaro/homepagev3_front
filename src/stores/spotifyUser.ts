import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import axios, { type AxiosResponse } from 'axios'
export const useUserStore = defineStore('spotifyUser', () => {
  const spotifyLoggedIn: Ref<boolean> = ref(false)

  async function loginSpotify(): Promise<Ref<boolean> | undefined> {
    const response: AxiosResponse = await axios.get('/api/spotify/login/')
    if (response.data.loggedIn !== undefined && response.data.loggedIn) {
      spotifyLoggedIn.value = true
      return spotifyLoggedIn
    }
    const win: Window | null = window.open(response.data)
    setInterval(async (): Promise<Ref<boolean> | undefined> => {
      if (!win || !win.closed) {
        return
      }
      const checkResponse: AxiosResponse = await axios.get('/api/spotify/check/')
      if (checkResponse.data.loggedIn !== undefined) {
        spotifyLoggedIn.value = checkResponse.data.loggedIn
      } else {
        spotifyLoggedIn.value = false
      }
      return spotifyLoggedIn
    }, 500)
  }

  function logoutSpotify(): void {
    spotifyLoggedIn.value = false
  }

  return { spotifyLoggedIn, loginSpotify, logoutSpotify }
})
