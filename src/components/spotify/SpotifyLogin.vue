<script setup lang="ts">
  import { ref } from 'vue';
  import type { Ref } from 'vue';
  import { useUserStore } from '@/stores/user';

  const store = useUserStore();
  const loading: Ref<boolean> = ref(false);
  function handleSubmit() {
    loading.value = true;
    store.loginSpotify();
    loading.value = false;
  }
</script>

<template>
  <div class="container">
    <div class="col-md-6 mx-auto">
      <span>To use this feature, logging in to Spotify is required</span>
      <div class="card-container col-md-6 mx-auto">
        <button @click="handleSubmit" class="btn btn-primary btn-block" :disabled="loading" />
        Submit
        <span class="spinner-border spinner-border-sm" v-show="loading" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
