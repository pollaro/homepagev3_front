import {
  createRouter,
  createWebHistory,
  type NavigationGuardReturn,
  type NavigationGuardWithThis,
  type RouteLocationNormalized,
  type Router
} from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeVue from '@/views/HomeVue.vue'
import AboutComponent from '@/components/AboutComponent.vue'
import ContactComponent from '@/components/ContactComponent.vue'
import SpotifyVue from '@/views/spotify/SpotifyVue.vue'
import SpotifyLogin from '@/components/spotify/SpotifyLogin.vue'
import SpotifySetlistTool from '@/components/spotify/SpotifySetlistTool.vue'
import SpotifyDecadeTool from '@/components/spotify/SpotifyDecadeTool.vue'
import SpotifyManualTool from '@/components/spotify/SpotifyManualTool.vue'
import HblHome from '@/views/hbl/HblHome.vue'
import HblLogin from '@/components/hbl/HblLogin.vue'
import HblPreseason from '@/components/hbl/HblPreseason.vue'
import HblPostseason from '@/components/hbl/HblPostseason.vue'
import { useUserStore } from '@/stores/spotifyUser'
import { useHBLStore } from '@/stores/hbl'

declare module 'vue-router' {
  interface RouteMeta {
    requiresSpotifyAuth: boolean
    requiresHBLAuth: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeVue,
    meta: { requiresSpotifyAuth: false, requiresHBLAuth: false },
    children: [
      {
        path: 'about',
        name: 'about',
        component: AboutComponent,
        meta: { requiresSpotifyAuth: false, requiresHBLAuth: false }
      },
      {
        path: 'contact',
        name: 'contact',
        component: ContactComponent,
        meta: { requiresSpotifyAuth: false, requiresHBLAuth: false }
      }
    ]
  },
  {
    path: '/spotify',
    name: 'SpotifyHome',
    component: SpotifyVue,
    meta: { requiresSpotifyAuth: false, requiresHBLAuth: false },
    children: [
      {
        path: '/login',
        name: 'SpotifyLogin',
        component: SpotifyLogin,
        meta: { requiresSpotifyAuth: true, requiresHBLAuth: false }
      },
      {
        path: 'setlist',
        name: 'SpotifySetlistTool',
        component: SpotifySetlistTool,
        props: true,
        meta: { requiresSpotifyAuth: true, requiresHBLAuth: false }
      },
      {
        path: 'decade',
        name: 'SpotifyDecadeTool',
        component: SpotifyDecadeTool,
        props: true,
        meta: { requiresSpotifyAuth: true, requiresHBLAuth: false }
      },
      {
        path: 'manual',
        name: 'SpotifyManualTool',
        component: SpotifyManualTool,
        props: true,
        meta: { requiresSpotifyAuth: true, requiresHBLAuth: false }
      }
    ]
  },
  {
    path: '/hbl',
    name: 'HblHome',
    component: HblHome,
    meta: { requiresSpotifyAuth: false, requiresHBLAuth: false },
    children: [
      {
        path: '/login',
        name: 'HblLogin',
        component: HblLogin,
        meta: { requiresSpotifyAuth: false, requiresHBLAuth: true }
      },
      {
        path: '/preseason',
        name: 'HblPreseason',
        component: HblPreseason,
        meta: { requiresSpotifyAuth: false, requiresHBLAuth: true }
      },
      {
        path: '/postseason',
        name: 'HblPostseason',
        component: HblPostseason,
        meta: { requiresSpotifyAuth: false, requiresHBLAuth: true }
      }
    ]
  }
]

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

// router.beforeEach(async (to: RouteLocationNormalized): Promise<NavigationGuardReturn> => {
//   const spotifyStore = useUserStore()
//   const hblStore = useHBLStore()
//   if (!spotifyStore.spotifyLoggedIn && to.meta.requiresSpotifyAuth) {
//     return {
//       path: '/spotify/login',
//       query: { redirect: to.fullPath }
//     }
//   }
//   if (!hblStore.hblLoggedIn && to.meta.requiresHBLAuth) {
//     return {
//       path: '/hbl/login',
//       query: { redirect: to.fullPath }
//     }
//   }
//   return
// })

export default router
