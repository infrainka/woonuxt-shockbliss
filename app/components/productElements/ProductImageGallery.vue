<script setup lang="ts">
import { useSwipe } from '@vueuse/core';
import type { ImageFragment, Product, Variation } from '#types/gql';

const { FALLBACK_IMG } = useHelpers();
const { storeSettings } = useAppConfig();

type Gallery = { nodes: ImageFragment[] };
type ThumbnailPosition = 'bottom' | 'left';

const props = defineProps({
  mainImage: { type: Object as PropType<ImageFragment>, required: true },
  gallery: { type: Object as PropType<Gallery>, required: true },
  node: { type: Object as PropType<Product | Variation>, required: true },
  activeVariation: { type: Object as PropType<Variation | null>, default: null },
  // All product variations (e.g. one per "kuosi"/pattern), used so each variation's own
  // photo shows up as a selectable/labelled thumbnail and can be matched to the active selection.
  variations: { type: Array as PropType<Variation[]>, default: () => [] },
});

const primaryImage = computed<ImageFragment>(() => ({
  sourceUrl: props.mainImage.sourceUrl || FALLBACK_IMG,
  title: props.mainImage.title,
  altText: props.mainImage.altText,
  databaseId: props.mainImage.databaseId,
}));

// The gallery is a "card deck": every image is a card, the one at currentIndex is on top/active,
// and its neighbours peek out from behind it on each side.
const currentIndex = ref(0);

// Maps a variation's image databaseId to a readable label built from that variation's
// attributes (e.g. "Keijukainen"), so the matching thumbnail can be identified by pattern.
const variationLabelByImageId = computed<Record<number, string>>(() => {
  const map: Record<number, string> = {};
  for (const variationNode of props.variations) {
    const imageId = variationNode?.image?.databaseId;
    if (!imageId || map[imageId]) continue;
    const labels = (variationNode.attributes?.nodes || []).map((attr) => attr?.label || attr?.value).filter((label): label is string => Boolean(label));
    if (labels.length) map[imageId] = labels.join(', ');
  }
  return map;
});

const galleryImages = computed<ImageFragment[]>(() => {
  // Add the primary image, the product gallery and every variation's own image (e.g. one
  // per "kuosi"/pattern) to the start of the gallery and remove duplicates
  const variationImages: ImageFragment[] = props.variations
    .map((variationNode) => variationNode?.image)
    .filter((img): img is NonNullable<typeof img> => Boolean(img?.sourceUrl))
    .map((img) => ({ sourceUrl: img.sourceUrl, srcSet: null, altText: img.altText, title: img.title, databaseId: img.databaseId }));
  return [primaryImage.value, ...(props.gallery.nodes || []), ...variationImages].filter(
    (img, index, self) => index === self.findIndex((t) => t?.databaseId === img?.databaseId),
  );
});

const imageToShow = computed<ImageFragment>(() => galleryImages.value[currentIndex.value] ?? primaryImage.value);

const imageLabel = (galleryImg: ImageFragment): string => {
  const variationLabel = galleryImg.databaseId ? variationLabelByImageId.value[galleryImg.databaseId] : undefined;
  if (!variationLabel) return galleryImg.altText || props.node.name || '';
  return `${props.node.name} – ${variationLabel}`;
};

const findImageIndex = (databaseId?: number | null): number => {
  if (!databaseId) return -1;
  return galleryImages.value.findIndex((img) => img.databaseId === databaseId);
};

// Accepts anything with a databaseId (a full gallery ImageFragment, or just a variation's
// smaller image field) since matching into galleryImages only ever needs that id.
const changeImage = (image?: { databaseId?: number | null } | null) => {
  const index = findImageIndex(image?.databaseId);
  if (index !== -1) currentIndex.value = index;
};

const changeIndexByOffset = (offset: number) => {
  const total = galleryImages.value.length;
  if (total <= 1) return;
  currentIndex.value = (currentIndex.value + offset + total) % total;
};

watch(
  () => props.activeVariation,
  (newVal) => {
    const variationImage = newVal?.image;
    if (!variationImage) return;
    // Match by databaseId rather than sourceUrl: the gallery and variation image fields
    // request different WordPress image sizes, so their sourceUrl strings never line up.
    // Every variation image is already included in galleryImages (see above), so it's always found.
    changeImage(variationImage);
  },
);

// How many cards peek out on each side of the active one: just the active card plus one neighbour peeking from behind on each side.
const DECK_RADIUS = 1;
// Every card (including the active one) sits in the same box, inset from the deck's edges
// (inset-[8%] below). That reserved margin is what makes the fan visible: it's the gap the
// active photo leaves clear for its neighbours' rotated/shifted corners to peek into, instead
// of the neighbours being entirely hidden behind an edge-to-edge active image.
const DECK_LAYOUT: Record<number, { x: number; y: number; rotate: number; scale: number; opacity: number }> = {
  0: { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
  1: { x: 18, y: 5, rotate: 7, scale: 0.95, opacity: 0.9 },
};

type DeckCard = { img: ImageFragment; index: number; offset: number; clickable: boolean };

// Shortest signed distance from currentIndex to index, wrapping around both ends of the
// gallery (so swiping past the last image loops to the first one, and vice versa).
const circularOffset = (index: number, total: number): number => {
  let diff = index - currentIndex.value;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
};

const deckCards = computed<DeckCard[]>(() => {
  const total = galleryImages.value.length;
  if (!total) return [];
  return galleryImages.value
    .map((img, index) => {
      const offset = circularOffset(index, total);
      return { img, index, offset, clickable: Math.abs(offset) === 1 };
    })
    .filter((card) => Math.abs(card.offset) <= DECK_RADIUS);
});

const cardStyle = (offset: number) => {
  const abs = Math.min(Math.abs(offset), DECK_RADIUS);
  const sign = Math.sign(offset);
  const layout = DECK_LAYOUT[abs] ?? DECK_LAYOUT[0] ?? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 };
  return {
    transform: `translate(${sign * layout.x}%, ${layout.y}%) rotate(${sign * layout.rotate}deg) scale(${layout.scale})`,
    opacity: layout.opacity,
    zIndex: DECK_RADIUS + 1 - abs,
  };
};

const deckRef = ref<HTMLElement | null>(null);
useSwipe(deckRef, {
  onSwipeEnd(_event, direction) {
    if (direction === 'left') changeIndexByOffset(1);
    else if (direction === 'right') changeIndexByOffset(-1);
  },
});


const imgWidth = 640;

const thumbnailPosition = computed<ThumbnailPosition>(() => (storeSettings.productGalleryThumbnailsPosition === 'left' ? 'left' : 'bottom'));
const showLeftThumbnails = computed(() => thumbnailPosition.value === 'left');

const galleryRootClasses = computed(() => [
  'w-full min-w-0',
  { 'lg:grid lg:grid-cols-[88px_minmax(0,1fr)] lg:items-start lg:gap-4': showLeftThumbnails.value },
]);

const thumbnailListClasses = computed(() => [
  'mt-4 flex gap-3 overflow-auto scrollbar-none p-1 [&::-webkit-scrollbar]:hidden',
  showLeftThumbnails.value ? 'lg:order-first lg:mt-0 lg:max-h-[min(640px,calc(100vh-160px))] lg:w-24 lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto' : '',
]);

const thumbnailButtonClasses = (galleryImg: ImageFragment) => [
  'size-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-offset-2 transition',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
  showLeftThumbnails.value ? 'lg:size-22' : '',
  galleryImg.databaseId === imageToShow.value.databaseId ? 'ring-2 ring-primary' : 'ring-1 ring-gray-200 hover:ring-gray-400',
];
</script>

<template>
  <div :class="galleryRootClasses">
    <div ref="deckRef" class="relative group aspect-square w-full min-w-0 touch-pan-y select-none overflow-hidden rounded-xl bg-gray-50 shadow-inner">
      <SaleBadge :node class="absolute z-10 text-base top-4 right-4" />

      <button
        v-for="card in deckCards"
        :key="card.img.databaseId ?? card.index"
        type="button"
        tabindex="-1"
        :aria-hidden="card.offset !== 0 ? 'true' : undefined"
        class="deck-card absolute inset-[8%] overflow-hidden rounded-2xl bg-white shadow-[0_12px_28px_-6px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transition-none"
        :class="card.clickable ? 'cursor-pointer' : 'pointer-events-none cursor-default'"
        :style="cardStyle(card.offset)"
        @click="card.clickable && changeIndexByOffset(card.offset > 0 ? 1 : -1)">
        <NuxtPicture
          :width="card.offset === 0 ? imgWidth : 400"
          :height="card.offset === 0 ? imgWidth : 400"
          :sizes="card.offset === 0 ? '412px:100vw sm:100vw md:50vw lg:50vw xl:640px' : undefined"
          :quality="card.offset === 0 ? undefined : 65"
          :alt="imageLabel(card.img)"
          :title="imageLabel(card.img)"
          :src="card.img.sourceUrl || FALLBACK_IMG"
          :loading="card.offset === 0 ? undefined : 'lazy'"
          :preload="card.offset === 0 ? { fetchPriority: 'high' } : undefined"
          :img-attrs="{ class: 'h-full w-full object-cover object-top rounded-2xl' }" />
      </button>

      <button
        v-if="galleryImages.length > 1"
        class="absolute left-4 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 text-gray-900 opacity-0 shadow-md transition-[opacity,background-color,box-shadow] ease-in hover:bg-white/70 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary group-hover:opacity-100"
        type="button"
        :aria-label="`Previous image for ${node.name}`"
        @click="changeIndexByOffset(-1)">
        <Icon name="ion:chevron-back-outline" size="24" />
      </button>

      <button
        v-if="galleryImages.length > 1"
        class="absolute right-4 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 text-gray-900 opacity-0 shadow-md transition-[opacity,background-color,box-shadow] ease-in hover:bg-white/70 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary group-hover:opacity-100"
        type="button"
        :aria-label="`Next image for ${node.name}`"
        @click="changeIndexByOffset(1)">
        <Icon name="ion:chevron-forward-outline" size="24" />
      </button>
    </div>

    <div v-if="galleryImages.length > 1" :class="thumbnailListClasses">
      <button
        v-for="galleryImg in galleryImages"
        :key="galleryImg.databaseId"
        :class="thumbnailButtonClasses(galleryImg)"
        type="button"
        :title="imageLabel(galleryImg)"
        :aria-label="`Show image for ${imageLabel(galleryImg)}`"
        :aria-pressed="galleryImg.databaseId === imageToShow.databaseId"
        @click="changeImage(galleryImg)">
        <NuxtPicture
          :width="160"
          :height="160"
          :src="galleryImg.sourceUrl || FALLBACK_IMG"
          :alt="imageLabel(galleryImg)"
          loading="lazy"
          :img-attrs="{ class: 'h-full w-full object-contain' }" />
      </button>
    </div>
  </div>
</template>
