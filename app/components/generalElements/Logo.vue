<script setup lang="ts">
const { siteName } = useAppConfig();
</script>

<template>
  <NuxtLink to="/" class="inline-flex items-center gap-2 shock-logo">
    <img src="/Shockbliss.png" :alt="siteName" class="object-contain h-10" />
  </NuxtLink>
</template>

<style scoped>
.shock-logo img {
  filter: drop-shadow(0 0 6px rgba(230, 175, 75, 0.6));
}
</style>
