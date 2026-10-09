<script setup lang="ts">
const { toggleMobileMenu } = useHelpers();
</script>

<template>
  <div class="shock-mobile-nav" @click.self="toggleMobileMenu(false)">
    <MainMenu class="shock-mobile-nav-links" />
  </div>
</template>

<style scoped>
/* Mirrors the Angular app's translucent, blurred full-screen mobile nav (mobile-nav.component.scss) */
.shock-mobile-nav {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
}

.shock-mobile-nav-links {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.shock-mobile-nav-links :deep(a) {
  display: block;
  padding: 10px 20px;
  margin: 10px 0;
  font-size: 1.2em;
  text-decoration: none;
  text-transform: uppercase;
  color: #bc13fe;
  text-shadow:
    0 1px 2px rgba(0, 0, 0, 0.8),
    0 2px 4px rgba(0, 0, 0, 0.5),
    0 0 5px #9d00ff,
    0 0 10px #9d00ff,
    0 0 20px #9d00ff;
}
</style>
