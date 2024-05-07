<script setup lang="ts">
  import { RouterView } from 'vue-router';
  import { BNavbar } from 'bootstrap-vue-next';
</script>

<template>
  <header></header>
  <div class="container">
    <BNavbar class="navbar navbar-expand-lg sticky-top mb-2 mb-lg-0">
      <ul class="navbar-nav me-auto">
        <li class="nav-item"><router-link class="nav-link" to="/">Home</router-link></li>
        <li class="nav-item"><router-link class="nav-link" to="/hbl">HBL</router-link></li>
        <li class="nav-item"><router-link class="nav-link" to="/spotify">Spotify Apps</router-link></li>
      </ul>
    </BNavbar>
  </div>
  <router-view />
</template>

<style scoped>
  .nav-item {
    font-size: 1.5rem;
  }
</style>
