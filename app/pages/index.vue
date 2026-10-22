<script lang="ts" setup>
import { ProductsOrderByEnum } from '#gql/default';
const { siteName, description, shortDescription, siteImage } = useAppConfig();

const [{ data }, { data: productData }] = await Promise.all([
  useAsyncGql('getProductCategories', { first: 6 }),
  useAsyncGql('getProducts', { first: 5, orderby: ProductsOrderByEnum.Popularity }),
]);

const productCategories = data.value?.productCategories?.nodes || [];
const popularProducts = productData.value?.products?.nodes || [];

const mainosVideo = ref<HTMLVideoElement | null>(null);
const isMainosMuted = ref(true);

function toggleMainosSound() {
  const video = mainosVideo.value;
  if (!video) return;
  video.muted = !video.muted;
  isMainosMuted.value = video.muted;
  if (!video.muted) video.play().catch(() => {});
}

useSeoMeta({
  title: `Etusivu`,
  ogTitle: siteName,
  description: description,
  ogDescription: shortDescription,
  ogImage: siteImage,
  twitterCard: `summary_large_image`,
});
</script>

<template>
  <main>
    <section class="shock-intro-section bg-black py-10 px-4">
      <div class="shock-intro">
        <img src="/THINK.png" alt="tv" class="shock-tv" loading="eager" />
        <img src="/Shockbliss.png" :alt="siteName" class="shock-sb-text" />

        <div class="shock-mainos-wrapper">
          <video ref="mainosVideo" src="/output_mainos3.mp4" class="w-full h-full object-cover " autoplay loop muted playsinline></video>
          <button
            type="button"
            class="shock-mainos-sound-toggle"
            :aria-label="isMainosMuted ? 'Laita mainosvideon ääni päälle' : 'Mykistä mainosvideo'"
            @click="toggleMainosSound">
            {{ isMainosMuted ? '🔇' : '🔊' }}
          </button>
        </div>
        <img src="/shockbliss.gif" alt="Static screen" class="shock-static-gif" loading="lazy" />

        <!-- Desktop Navigation Column -->
        <div class="shock-button-column">
          <NuxtLink to="/" class="shock-nav-button"><span class="shock-nav-button-text">Start</span></NuxtLink>
          <NuxtLink to="/products" class="shock-nav-button"><span class="shock-nav-button-text">Shop</span></NuxtLink>
          <NuxtLink to="/about" class="shock-nav-button"><span class="shock-nav-button-text">Tietoa</span></NuxtLink>
        </div>

        <!-- Mobile Navigation Menu Button -->
        <div class="shock-mobile-menu">
          <span class="shock-mobile-text">Menu</span>
          <MenuTrigger class="!mr-0" />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.brand img {
  max-height: min(8vw, 120px);
  object-fit: contain;
  object-position: center;
}

.feature-icon {
  filter: brightness(0) saturate(100%) invert(76%) sepia(28%) saturate(1116%) hue-rotate(349deg) brightness(93%) contrast(92%);
  flex: 0 0 auto;
}

.shock-intro {
  margin: 20px auto;
  text-align: center;
  position: relative;
  max-width: 800px;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.7);
}

.shock-intro img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

.shock-sb-text {
  position: absolute;
  width: 33%;
  height: auto;
  left: 30%;
  top: -35px;
  z-index: 2;
}

.shock-static-gif {
  position: absolute;
  left: 9.5%;
  top: 51%;
  width: 65%;
  height: auto;
  overflow: hidden;
  object-fit: cover;
  display: block;
  z-index: 1;
}

/* Sits in the upper TV screen, same framing as .shock-static-gif below it */
.shock-mainos-wrapper {
  position: absolute;
  left: 8.5%;
  top: 7%;
  width: 66%;
  z-index: 1;
}

.shock-mainos-video {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  object-fit: contain;
}

.shock-mainos-sound-toggle {
  position: absolute;
  right: 6%;
  bottom: 6%;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
  background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(235, 235, 235, 1) 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  z-index: 2;
}

.shock-mainos-sound-toggle:hover {
background: linear-gradient(180deg, rgba(240, 240, 240, 1) 0%, rgba(215, 215, 215, 1) 100%);}

/* --- Desktop Navigation --- */
.shock-button-column {
  position: absolute;
  left: 85%;
  top: 33%;
}

.shock-nav-button {
  position: absolute;
  display: block;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(60, 60, 60, 1) 0%, rgba(0, 0, 0, 1) 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  color: #fe019a;
}

.shock-nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.4);
  background: linear-gradient(180deg, rgba(80, 80, 80, 1) 0%, rgba(20, 20, 20, 1) 100%);
}

.shock-nav-button:hover .shock-nav-button-text {
  opacity: 1;
}

.shock-nav-button:nth-child(1) {
  top: 0;
}

.shock-nav-button:nth-child(2) {
  top: 60px;
}

.shock-nav-button:nth-child(3) {
  top: 120px;
}

.shock-nav-button-text {
  position: absolute;
  color: #bc13fe;
  text-shadow: 0 0 5px #9d00ff, 0 0 10px #9d00ff, 0 0 20px #9d00ff;
  /* Dark purple outline so the glowing text stays legible against bright backgrounds */
  -webkit-text-stroke: 1px #2d004d;
  paint-order: stroke fill;
  opacity: 0;
  transition: opacity 0.3s ease;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 2rem;
}

/* --- Mobile Navigation --- */
.shock-mobile-menu {
  display: none; /* Hidden on desktop */
  position: absolute;
  left: 79%;
  top: 33%;
  width: 50px;
  z-index: 10;
}

.shock-mobile-text {
  position: absolute;
  top: -17px; /* Places the text right above the button */
  left: 50%;
  transform: translateX(-50%);
  color: #bc13fe;
  text-shadow: 0 0 2px #9d00ff, 0 0 2px #9d00ff;
  font-size: 11px;
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Override positioning specifically for the mobile button to prevent nth-child interference */
.shock-mobile-menu .shock-mobile-nav-button {
  position: relative; 
  top: 0;
  border: none;
  cursor: pointer;
  padding: 0;
}

/* --- Media Queries --- */
@media (max-width: 767px) {
  .shock-button-column {
    display: none; /* Hide desktop column */
  }

  .shock-mobile-menu {
    display: block; /* Show mobile menu wrapper */
  }

  .shock-sb-text {
    top: -20px;
  }

  .shock-mainos-wrapper {
    width: 63%;
    left: 10.5%;
    top: 8.2%;
  }
}
</style>