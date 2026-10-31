<script setup>
const { locales, locale, setLocale, setLocaleCookie } = useI18n();

const switchLanguage = async (newLocale) => {
  await setLocale(newLocale);
};

watch(locale, (newLocale) => {
  if (newLocale) {
    setLocaleCookie(newLocale);
  }
});

// Locale names are authored as "Language Name <flag emoji>" (e.g. "Suomi 🇫🇮");
// the switcher only needs to show the flag to stay compact.
const flagFor = (name) => name?.trim().split(/\s+/).pop() ?? '';

const currentLocale = computed(() => locales.value.find((loc) => loc.code === locale.value));
</script>

<template>
  <select
    id="language-switcher"
    :value="locale"
    :title="currentLocale?.name"
    aria-label="Language switcher"
    class="shock-lang-switcher"
    @change="switchLanguage($event.target.value)">
    <option v-for="loc in locales" :key="loc.code" :value="loc.code" :title="loc.name">{{ flagFor(loc.name) }}</option>
  </select>
</template>

<style scoped>
.shock-lang-switcher {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: linear-gradient(180deg, rgba(60, 60, 60, 1) 0%, rgba(0, 0, 0, 1) 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  flex: 0 0 auto;
  padding: 0;
  font-size: 1.1rem;
  line-height: 1;
  text-align: center;
  text-align-last: center;
  color: #fff;
}

.shock-lang-switcher:hover {
  background: linear-gradient(180deg, rgba(80, 80, 80, 1) 0%, rgba(20, 20, 20, 1) 100%);
}

.shock-lang-switcher:focus-visible {
  outline: 2px solid var(--color-shock-purple);
  outline-offset: 2px;
}

.shock-lang-switcher option {
  background: #1a1a1a;
  color: #fff;
  text-align: center;
}
</style>
