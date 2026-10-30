<script setup lang="ts">
const { isShowingSearch } = useSearching();
const route = useRoute();
const isHome = computed(() => route.path === '/');
</script>

<template>
  <header class="sticky top-0 z-40 bg-black shadow-md shadow-black/40 border-b border-transparent outline-shock-purple/20 outline">
<div class="flex flex-col sm:flex-row justify-between items-center bg-[#0a0a0a] text-gray-300 text-sm py-3 px-4 sm:px-6 border-b border-shock-purple/20 gap-3 sm:gap-0">
      
      <!-- Phone & email wrap on very small screens -->
      <div class="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
        <a href="mailto:info@shockbliss.com" class="flex items-center gap-2 hover:text-white transition-colors">
          <Icon name="mdi:email" class="text-shock-gold text-lg" /> aninka@shockbliss.com
        </a>
      </div>
      
      <div class="flex items-center gap-4">
        <span>{{ $t('topbar.socials') }}</span>
        <a href="https://www.instagram.com/shockbliss/" aria-label="Instagram" class="flex items-center justify-center w-7 h-7 bg-gray-900 rounded hover:bg-shock-purple/30 transition-colors">
          <Icon name="mdi:instagram" class="text-shock-purple text-md" />
        </a>
        <a href="https://www.tiktok.com/@shockbliss" aria-label="TikTok" class="flex items-center justify-center w-7 h-7 bg-gray-900 rounded hover:bg-shock-purple/30 transition-colors">
          <Icon name="ic:baseline-tiktok" class="text-shock-purple text-md" />
        </a>
      </div>
    </div>

    <div class="container flex items-center justify-between py-4">
      <!-- Hook: Before header navigation -->
      <HookOutlet name="layout.header.beforeNav" as="div" />

      <div class="flex items-center">
        <MenuTrigger class="lg:hidden" :class="{ 'max-md:hidden': isHome }" />
        <Logo class="w-40" />
      </div>
      <MainMenu v-if="!isHome" class="items-center hidden gap-6 text-sm text-white lg:flex lg:px-4" />
      <div class="flex justify-end items-center w-40 flex-1 ml-auto gap-4 md:gap-6">
                  <LangSwitcher class="ml-4" />

        <div class="flex gap-4 items-center">
          <CartTrigger />
        </div>
      </div>
    </div>
    <Transition name="scale-y" mode="out-in">
      <div v-if="isShowingSearch" class="container mb-3 -mt-1 sm:hidden">
        <ProductSearch class="flex w-full" />
      </div>
    </Transition>
  </header>
</template>