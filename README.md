# Shockbliss E-Commerce Frontend

The decoupled frontend application for the Shockbliss art brand, built with Nuxt 4 and connected to a headless WordPress/WooCommerce backend via WPGraphQL.

## Architecture & Stack

* **Frontend:** Nuxt 4 / Vue.js, built on top of the open-source [WooNuxt](https://woonuxt.com) base theme using Nuxt Layers
* **Backend:** Headless WooCommerce (WPGraphQL)
* **Hosting / CI-CD:** Both Netlify (`netlify.toml`) and Vercel (`vercel.json`) build configs are provided
* **Styling:** Tailwind CSS v4, Vue Scoped Styles (`<style scoped>`), plus the Shockbliss theme stylesheet (`app/assets/css/shockbliss-theme.css`)
* **i18n:** `@nuxtjs/i18n`, currently Finnish (`fi_FI`) only

### Project layout

This repo extends the vendored base theme with Shockbliss-specific branding and customizations via Nuxt Layers:

* [`woonuxt_base/`](./woonuxt_base) - the vendored WooNuxt base theme (pages, components, composables, default config)
* [`app/`](./app) - Shockbliss overrides; any page/component here takes priority over the same-named file in `woonuxt_base/`
* [`i18n/locales/fi-FI.json`](./i18n/locales/fi-FI.json) - Shockbliss translations, merged with and taking priority over the base theme's `fi-FI.json`

When changing branding, copy, or contact details, prefer adding/overriding files under `app/` (and `i18n/locales/`) rather than editing `woonuxt_base/` directly, so Shockbliss customizations survive future updates to the base theme.

## Environment Variables

These variables are read from a local `.env` file (and should be configured in your hosting provider's dashboard for deployments):

* `GQL_HOST` - **Required.** The GraphQL endpoint for the WordPress backend (must end with `/graphql`)
* `NUXT_IMAGE_DOMAINS` - **Required.** Comma-separated list of hostnames (no `https://`) allowed for image optimization
* `NUXT_IMAGE_PROVIDER` - Optional. Image provider override: `ipx` (default), `netlify`, `vercel`, or `none`
* `APP_HOST` - Optional. Set only if the deployed storefront uses a different origin than `GQL_HOST`
* `CATALOG_ISR_TTL` - ISR cache lifetime, in seconds, for catalog routes (product, products, product-category)
* `NUXT_PUBLIC_PRODUCTS_PER_PAGE` - Number of products displayed per page
* `NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable API key
* `PRIMARY_COLOR` - Accent color used for input and button elements

## 🛠 Development Commands

Project uses `npm` and `package-lock.json`. GraphQL types are regenerated automatically (`graphql:codegen`) before `dev`, `build`, `generate`, and `typecheck`.

* **Install dependencies:** `npm install`
* **Start development server:** `npm run dev`
* **Build for production:** `npm run build`
* **Generate static site:** `npm run generate`
* **Preview a production build:** `npm run preview`
* **Type-check:** `npm run typecheck`
* **Lint / auto-fix:** `npm run lint` / `npm run lint:fix`
* **Format / check formatting:** `npm run format` / `npm run format:check`

## Homepage media

The homepage uses responsive `tv-*.avif` and `shockbliss-logo-*.avif` images with
WebP fallbacks from
[`public/`](./public). Keep their aspect ratios unchanged when replacing artwork.
The TV image has high fetch priority and explicit dimensions; the videos and
sound button are mounted only after that image has loaded successfully.

`shockbliss-static.mp4` replaces the large animated GIF without removing its
animation. `mainos-480.mp4` is the mobile advertising video, while desktop uses
`output_mainos3.mp4`. Both advertising versions retain sound. Regenerate the
derived media when updating the PNG, GIF, or original video: WebP images use
quality 82 (TV) / 85 (logo), and AVIF images use quality 45; MP4 derivatives use H.264, CRF 26, and fast-start,
with 540px static animation and 480px mobile video (AAC audio at 64 kbps).

Roboto and Righteous are self-hosted as WOFF2 Latin and Latin Extended subsets in
[`public/fonts/`](./public/fonts), with their Open Font Licenses included.
The theme declares these fonts with `font-display: swap`; the primary Roboto
subset is preloaded without a blocking third-party stylesheet.

## License

GNU GPLv3 - see [LICENSE](./LICENSE).
