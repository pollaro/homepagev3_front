<script setup lang="ts">
  import { useHBLStore } from '@/stores/hbl'
  import { type Ref, ref } from 'vue'

  const hblStore = useHBLStore()
  const loading: Ref<boolean> = ref(false)

  function handleSubmit(): void {
    loading.value = true
    hblStore.loginHBL()
    loading.value = false
  }
</script>

<template>
  <div class="container">
    <div class="col-md-6 mx-auto">
      <span>To access the Huckleberry Baseball League, Yahoo authorization is required.</span>
      <div class="card-container col-md-6 mx-auto">
        <Form @submit="handleSubmit">
          <button class="btn btn-primary btn-block" :disabled="loading">
            Sign in with Yahoo
            <span v-show="loading" class="spinner-border spinner-border-sm" />
          </button>
        </Form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
