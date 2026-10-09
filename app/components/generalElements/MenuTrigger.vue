<script setup lang="ts">
const { toggleMobileMenu, isShowingMobileMenu } = useHelpers();
</script>

<template>
  <button
    type="button"
    class="shock-hamburger mr-4"
    :class="{ 'shock-hamburger--open': isShowingMobileMenu }"
    :aria-expanded="isShowingMobileMenu"
    aria-label="Toggle menu"
    @click="toggleMobileMenu()">
    <span class="shock-hamburger-bar shock-hamburger-bar--top"></span>
    <span class="shock-hamburger-bar shock-hamburger-bar--mid"></span>
    <span class="shock-hamburger-bar shock-hamburger-bar--bot"></span>
  </button>
</template>

<style scoped>
.shock-hamburger {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: linear-gradient(180deg, rgba(60, 60, 60, 1) 0%, rgba(0, 0, 0, 1) 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  flex: 0 0 auto;
}

.shock-hamburger:hover {
  background: linear-gradient(180deg, rgba(80, 80, 80, 1) 0%, rgba(20, 20, 20, 1) 100%);
}

.shock-hamburger-bar {
  position: absolute;
  left: 10px;
  width: 24px;
  height: 3px;
  border-radius: 2px;
  background: #fff;
  transition: transform 0.3s ease, opacity 0.3s ease, top 0.3s ease;
}

.shock-hamburger-bar--top {
  top: 15px;
}

.shock-hamburger-bar--mid {
  top: 21px;
}

.shock-hamburger-bar--bot {
  top: 27px;
}

.shock-hamburger--open .shock-hamburger-bar--top {
  top: 21px;
  transform: rotate(45deg);
  background: var(--color-shock-purple);
}

.shock-hamburger--open .shock-hamburger-bar--mid {
  opacity: 0;
}

.shock-hamburger--open .shock-hamburger-bar--bot {
  top: 21px;
  transform: rotate(-45deg);
  background: var(--color-shock-purple);
}
</style>
