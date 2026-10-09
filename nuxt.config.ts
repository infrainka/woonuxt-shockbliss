import { createResolver } from '@nuxt/kit';

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  // Get all the pages, components, composables and plugins from the parent theme
  extends: ['./woonuxt_base'],

  components: [{ path: './components', pathPrefix: false }],

  css: [resolve('./app/assets/css/shockbliss-theme.css')],

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Righteous&family=Roboto:wght@300;400;500&display=swap' },
      ],
    },
  },

  /**
   * Depending on your servers capabilities, you may need to adjust the following settings.
   * It will affect the build time but also increase the reliability of the build process.
   * If you have a server with a lot of memory and CPU, you can remove the following settings.
   * @property {number} concurrency - How many pages to prerender at once
   * @property {number} interval - How long to wait between prerendering pages
   * @property {boolean} failOnError - This stops the build from failing but the page will not be statically generated
   */
  nitro: {
    prerender: {
      concurrency: 10,
      interval: 1000,
      failOnError: false,
    },
  },

  // Register this layer's own fi-FI translations (i18n/locales/fi-FI.json) so they are
  // merged with - and take priority over - the base theme's translations of the same locale.
  // Without this, @nuxtjs/i18n only loads woonuxt_base/i18n/locales/fi-FI.json and edits
  // here are never picked up.
  i18n: {
    locales: [{ code: 'fi_FI', file: 'fi-FI.json' }],
  },
});
