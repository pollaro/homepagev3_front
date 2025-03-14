import type { RouteRecordInfo } from 'vue-router'

export interface RouteNamedMap {
  home: RouteRecordInfo<'home', '/', Record<never, never>, Record<never, never>>
  spotify: RouteRecordInfo<'spotify', '/spotify', Record<never, never>>
  hbl: RouteRecordInfo<'hbl', '/hbl', Record<never, never>>
}

declare module 'vue-router' {
  interface TypesConfig {
    RouteNamedMap: RouteNamedMap
  }
}
