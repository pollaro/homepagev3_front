<script setup lang="ts"></script>

<template>
  <div class="container text-center">
    <div class="row align-items-start">
      <div class="col">
        <p class="lead">Welcome to my website. I'm Jim Pollaro, web developer.</p>
        <p>
          Technologies used:
          <img :src="`/src/assets/djangoproject.svg`" :alt="`Django logo`" height="30" />
          <img :src="`/src/assets/vue_logo.svg`" :alt="`Vuejs logo`" height="30" />
          <img :src="`/src/assets/bootstrap.svg`" :alt="`Bootstrap logo`" height="30" />
        </p>
        <p>This site is very much under construction at the moment, please forgive the lack of design.</p>
      </div>
      <div class="col">
        <ul class="list-unstyled">
          <li>
            <a :href="`/src/assets/Pollaro_Resume_2024.pdf`" class="fs-1 text-reset text-decoration-none" download
              >Resume</a
            >
          </li>
          <li><router-link class="fs-1 text-reset text-decoration-none" to="/about">About</router-link></li>
          <li><router-link class="fs-1 text-reset text-decoration-none" to="/contact">Contact</router-link></li>
        </ul>
      </div>
    </div>
  </div>
  <router-view />
</template>

<style scoped>
  img {
    margin-left: 1em;
  }
</style>
