<script setup lang="ts">
  import { useHBLStore } from '@/stores/hbl'
  import { type Ref, ref } from 'vue'

  const hblStore = useHBLStore()
  const loading: Ref<boolean> = ref(false)
</script>

<template></template>

<style scoped></style>
