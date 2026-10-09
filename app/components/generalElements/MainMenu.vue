<script setup lang="ts">
const { navigateToLogin } = useAuth();
const route = useRoute();
</script>

<template>
  <nav>
    <NuxtLink active-class="text-shock-gold" class="shock-neon-link uppercase font-semibold tracking-wide" to="/">{{ $t('general.home') }}</NuxtLink>
    <NuxtLink active-class="text-shock-gold" class="shock-neon-link uppercase font-semibold tracking-wide" to="/products">{{ $t('general.products') }}</NuxtLink>
    <NuxtLink active-class="text-shock-gold" class="shock-neon-link uppercase font-semibold tracking-wide" to="/about">{{ $t('general.about') }}</NuxtLink>
  </nav>
</template>
