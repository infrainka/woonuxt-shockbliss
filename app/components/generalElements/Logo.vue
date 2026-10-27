<script setup lang="ts">
const { siteName } = useAppConfig();
</script>

<template>
  <NuxtLink to="/" class="inline-flex items-center gap-2 shock-logo">
    <picture class="inline-flex">
      <source
        type="image/avif"
        srcset="/shockbliss-logo-80.avif 80w, /shockbliss-logo-160.avif 160w, /shockbliss-logo-240.avif 240w, /shockbliss-logo-320.avif 320w"
        sizes="75px" />
      <img
        src="/shockbliss-logo-160.webp"
        srcset="/shockbliss-logo-160.webp 160w, /shockbliss-logo-320.webp 320w"
        sizes="75px"
        width="786"
        height="420"
        :alt="siteName"
        class="object-contain h-10 w-auto" />
    </picture>
  </NuxtLink>
</template>

<style scoped>
.shock-logo img {
  filter: drop-shadow(0 0 6px rgba(230, 175, 75, 0.6));
}
</style>
