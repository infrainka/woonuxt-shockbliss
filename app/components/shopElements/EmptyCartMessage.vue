<script setup lang="ts">
const { toggleCart } = useCart();
</script>

<template>
  <div class="flex flex-col items-center justify-center flex-1 mb-20 shock-empty-cart">
    <Icon name="ion:cart-outline" size="96" class="mb-5 shock-empty-cart-icon" />
    <div class="mb-2 text-xl font-semibold shock-empty-cart-text">{{ $t('shop.cartEmpty') }}</div>
    <span class="mb-8 shock-empty-cart-text">{{ $t('shop.addProductsInYourCart') }}</span>
    <NuxtLink
      to="/products"
      class="flex items-center justify-center gap-3 p-2 px-3 mt-4 font-semibold text-center text-white rounded-lg shadow-md bg-primary hover:bg-primary-dark"
      @click="toggleCart(false)">
      {{ $t('shop.browseOurProducts') }}
    </NuxtLink>
  </div>
</template>

<style scoped>

.shock-empty-cart-icon {
  color: #000;
  filter: drop-shadow(0 1px 1px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 6px rgba(255, 255, 255, 0.6));
}

.shock-empty-cart-text {
  color: #000;
  text-shadow:
    0 1px 2px rgba(255, 255, 255, 0.9),
    0 0 8px rgba(255, 255, 255, 0.6);
}
</style>
