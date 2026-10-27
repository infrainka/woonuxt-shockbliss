<script setup lang="ts">
const { wooNuxtVersionInfo } = useHelpers();
const { openCookieSettings } = useCookieConsent();
</script>

<template>
  <footer class="site-footer bg-black text-white py-12 mt-12 order-last border-t border-shock-purple/30">
    <div class="container flex flex-col gap-8">
      
      <div class="flex flex-col items-center md:items-start text-center md:text-left max-w-lg mx-auto md:mx-0">
        <Logo />
        <p class="mt-4 text-sm leading-relaxed">{{ $t('site.description') }}</p>
      </div>

      <hr class="border-shock-purple/30" />

      <div class="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
        
        <div class="copyright text-center md:text-left">
          {{ $t('footer.copyright') }}
        </div>
        
          <button type="button" class="shock-neon-link cursor-pointer" @click="openCookieSettings">
            {{ $t('footer.cookieSettings') }}
          </button>

          <LangSwitcher class="ml-4" />
        </div>
        
      </div>
      
    <HookOutlet name="layout.footer.bottom" as="div" />
  </footer>
</template>

<style scoped>
.copyright {
  color: rgba(255, 255, 255, 0.6);
}
</style>
