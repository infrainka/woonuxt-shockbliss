<script lang="ts" setup>
const { siteName, siteImage } = useAppConfig();
const { t } = useI18n();

const tvImage = ref<HTMLImageElement | null>(null);
const isTvReady = ref(false);
const mainosVideo = ref<HTMLVideoElement | null>(null);
const isMainosMuted = ref(true);

function revealTvMedia() {
  const image = tvImage.value;
  if (!image?.complete || !image.naturalWidth || isTvReady.value) return;
  isTvReady.value = true;
}

onMounted(revealTvMedia);

async function toggleMainosSound() {
  const video = mainosVideo.value;
  if (!video) return;
  video.muted = !video.muted;
  isMainosMuted.value = video.muted;
  if (!video.muted) {
    try {
      await video.play();
    } catch (error) {
      video.muted = true;
      isMainosMuted.value = true;
      console.error('Unable to play the homepage video with sound.', error);
    }
  }
}

useSeoMeta({
  title: () => t('general.home'),
  ogTitle: siteName,
  description: () => t('site.description'),
  ogDescription: () => t('site.shortDescription'),
  ogImage: siteImage,
  twitterCard: `summary_large_image`,
});
</script>

<template>
  <main>
    <section class="shock-intro-section bg-black py-10 px-4">
      <div class="shock-intro">
        <img
          ref="tvImage"
          src="/tv-800.webp"
          srcset="/tv-480.webp 480w, /tv-800.webp 800w, /tv-1080.webp 1080w"
          sizes="(max-width: 831px) calc(100vw - 72px), 760px"
          width="1080"
          height="1920"
          alt="tv"
          class="shock-tv"
          loading="eager"
          fetchpriority="high"
          @load="revealTvMedia" />
        <img
          src="/shockbliss-logo-320.webp"
          srcset="/shockbliss-logo-160.webp 160w, /shockbliss-logo-320.webp 320w, /shockbliss-logo-480.webp 480w, /shockbliss-logo-786.webp 786w"
          sizes="(max-width: 831px) 33vw, 264px"
          width="786"
          height="420"
          :alt="siteName"
          class="shock-sb-text" />

        <div v-if="isTvReady" class="shock-mainos-wrapper">
          <video ref="mainosVideo" class="shock-mainos-video" width="800" height="800" autoplay loop muted playsinline>
            <source src="/mainos-480.mp4" type="video/mp4" media="(max-width: 767px)" />
            <source src="/output_mainos3.mp4" type="video/mp4" />
          </video>
          <button
            type="button"
            class="shock-mainos-sound-toggle"
            :aria-label="isMainosMuted ? $t('accessibility.unmuteVideo') : $t('accessibility.muteVideo')"
            @click="toggleMainosSound">
            {{ isMainosMuted ? '🔇' : '🔊' }}
          </button>
        </div>
        <video
          v-if="isTvReady"
          src="/shockbliss-static.mp4"
          class="shock-static-video"
          width="540"
          height="540"
          autoplay
          loop
          muted
          playsinline
          aria-hidden="true"></video>

        <!-- Desktop Navigation Column -->
        <div class="shock-button-column">
          <NuxtLink to="/" class="shock-nav-button"
            ><span class="shock-nav-button-text">{{ $t('general.home') }}</span></NuxtLink
          >
          <NuxtLink to="/products" class="shock-nav-button"
            ><span class="shock-nav-button-text">{{ $t('general.products') }}</span></NuxtLink
          >
          <NuxtLink to="/about" class="shock-nav-button"
            ><span class="shock-nav-button-text">{{ $t('general.about') }}</span></NuxtLink
          >
        </div>

        <!-- Mobile Navigation Menu Button -->
        <div class="shock-mobile-menu">
          <span class="shock-mobile-text">{{ $t('general.menu') }}</span>
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

.shock-static-video {
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

/* Sits in the upper TV screen, above the static animation. */
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
  background: linear-gradient(180deg, rgba(240, 240, 240, 1) 0%, rgba(215, 215, 215, 1) 100%);
}

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
  text-shadow:
    0 0 5px #9d00ff,
    0 0 10px #9d00ff,
    0 0 20px #9d00ff;
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
  text-shadow:
    0 0 2px #9d00ff,
    0 0 2px #9d00ff;
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
