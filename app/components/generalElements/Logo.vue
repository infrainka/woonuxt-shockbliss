<script setup lang="ts">
const { siteName } = useAppConfig();
</script>

<template>
  <NuxtLink to="/" class="inline-flex items-center gap-2 shock-logo">
    <img
      src="/shockbliss-logo-160.webp"
      srcset="/shockbliss-logo-160.webp 160w, /shockbliss-logo-320.webp 320w"
      sizes="75px"
      width="786"
      height="420"
      :alt="siteName"
      class="object-contain h-10 w-auto" />
  </NuxtLink>
</template>

<style scoped>
.shock-logo img {
  filter: drop-shadow(0 0 6px rgba(230, 175, 75, 0.6));
}
</style>
