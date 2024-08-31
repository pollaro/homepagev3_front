import { createRouter, createWebHistory } from 'vue-router'
import HomeVue from '@/views/HomeVue.vue'
import AboutComponent from '@/components/AboutComponent.vue'
import ContactComponent from '@/components/ContactComponent.vue'
import SpotifyVue from '@/views/spotify/SpotifyVue.vue'
import SpotifyLogin from '@/components/spotify/SpotifyLogin.vue'
import SpotifySetlistTool from '@/components/spotify/SpotifySetlistTool.vue'
import SpotifyGenreTool from '@/components/spotify/SpotifyGenreTool.vue'
import SpotifyDecadeTool from '@/components/spotify/SpotifyDecadeTool.vue'
import SpotifyManualTool from '@/components/spotify/SpotifyManualTool.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeVue,
    children: [
      {
        path: 'about',
        name: 'about',
        component: AboutComponent
      },
      {
        path: 'contact',
        name: 'contact',
        component: ContactComponent
      }
    ]
  },
  {
    path: '/spotify',
    name: 'spotify home',
    component: SpotifyVue,
    children: [
      {
        path: 'login',
        name: 'SpotifyLogin',
        component: SpotifyLogin
      },
      {
        path: 'setlist',
        name: 'SpotifySetlistTool',
        component: SpotifySetlistTool,
        props: true
      },
      {
        path: 'genre',
        name: 'SpotifyGenreTool',
        component: SpotifyGenreTool,
        props: true
      },
      {
        path: 'decade',
        name: 'SpotifyDecadeTool',
        component: SpotifyDecadeTool,
        props: true
      },
      {
        path: 'manual',
        name: 'SpotifyManualTool',
        component: SpotifyManualTool,
        props: true
      },
      {
        path: 'setlist'
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
