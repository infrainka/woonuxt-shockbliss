<script setup lang="ts">
const { siteName } = useAppConfig();
</script>

<template>
  <NuxtLink to="/" class="inline-flex items-center gap-2 shock-logo">
    <picture class="inline-flex">
      <source
        type="image/avif"
        srcset="/sb-teksti-80.avif 80w, /sb-teksti-160.avif 160w, /sb-teksti-240.avif 240w, /sb-teksti-320.avif 320w, /sb-teksti-480.avif 480w"
        sizes="(min-width: 640px) 96px, 84px" />
      <img
        src="/sb-teksti-320.webp"
        srcset="/sb-teksti-160.webp 160w, /sb-teksti-320.webp 320w, /sb-teksti-480.webp 480w"
        sizes="(min-width: 640px) 96px, 84px"
        width="786"
        height="524"
        :alt="siteName"
        class="object-contain h-14 w-auto sm:h-16" />
    </picture>
  </NuxtLink>
</template>

<style scoped>
.shock-logo img {
  /* Brightens and shifts the lettering's muted tones toward pink instead of gray */
  filter: brightness(1.1) saturate(1.5) drop-shadow(0 0 3px rgba(230, 175, 75, 0.35));
}
</style>
