import { createResolver } from '@nuxt/kit';

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  // Get all the pages, components, composables and plugins from the parent theme
  extends: ['./woonuxt_base'],

  components: [{ path: './components', pathPrefix: false }],

  // main.css owns the Tailwind import (and the woonuxt_base utility-color overrides, now
  // customized for this project) now that it's in this layer; shockbliss-theme.css layers
  // the brand-specific styling on top. woonuxt_base/nuxt.config.ts no longer loads its own
  // copy of main.css, so Tailwind and these overrides are only generated once.
  css: [resolve('./app/assets/css/main.css'), resolve('./app/assets/css/shockbliss-theme.css')],

  app: {
    head: {
      link: [
        { rel: 'preload', href: '/fonts/roboto-latin.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
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

  // Register this layer's own fi-FI and en-US translations (i18n/locales/*.json) so they are
  // merged with - and take priority over - the base theme's translations of the same locale.
  // Without this, @nuxtjs/i18n only loads woonuxt_base/i18n/locales/*.json and edits
  // here are never picked up.
  i18n: {
    // Product descriptions contain trusted, repository-authored HTML rendered with v-html.
    compilation: {
      strictMessage: false,
    },
    locales: [
      { code: 'fi_FI', file: 'fi-FI.json' },
      { code: 'en_US', file: 'en-US.json' },
    ],
  },
});
