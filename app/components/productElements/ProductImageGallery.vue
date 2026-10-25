<script setup lang="ts">
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

const imageToShow = ref<ImageFragment>(primaryImage.value);

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

const imageLabel = (galleryImg: ImageFragment): string => {
  const variationLabel = galleryImg.databaseId ? variationLabelByImageId.value[galleryImg.databaseId] : undefined;
  if (!variationLabel) return galleryImg.altText || props.node.name || '';
  return `${props.node.name} – ${variationLabel}`;
};

const changeImage = (image: ImageFragment) => {
  if (image) imageToShow.value = image;
};

const changeImageByOffset = (offset: number) => {
  const images = galleryImages.value;
  if (images.length <= 1) return false;

  const currentIndex = images.findIndex((image) => image.databaseId === imageToShow.value.databaseId);
  const fallbackIndex = offset > 0 ? 0 : images.length - 1;
  const nextIndex = currentIndex === -1 ? fallbackIndex : (currentIndex + offset + images.length) % images.length;
  const nextImage = images[nextIndex];
  if (nextImage) {
    changeImage(nextImage);
    return true;
  }
  return false;
};

watch(
  () => props.activeVariation,
  (newVal) => {
    const variationImage = newVal?.image;
    if (!variationImage) return;
    // Match by databaseId rather than sourceUrl: the gallery and variation image fields
    // request different WordPress image sizes, so their sourceUrl strings never line up.
    const foundImage = galleryImages.value.find((img) => img.databaseId && variationImage.databaseId && img.databaseId === variationImage.databaseId);
    changeImage(
      foundImage || { sourceUrl: variationImage.sourceUrl, srcSet: null, altText: variationImage.altText, title: variationImage.title, databaseId: variationImage.databaseId },
    );
  },
);

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
    <div class="relative group aspect-square w-full min-w-0 overflow-hidden rounded-xl bg-gray-100">
      <SaleBadge :node class="absolute text-base top-4 right-4" />
      <NuxtPicture
        :width="imgWidth"
        :height="imgWidth"
        sizes="412px:100vw sm:100vw md:50vw lg:50vw xl:640px"
        :alt="imageLabel(imageToShow)"
        :title="imageLabel(imageToShow)"
        :src="imageToShow.sourceUrl || FALLBACK_IMG"
        :preload="{ fetchPriority: 'high' }"
        :img-attrs="{ class: 'h-full w-full object-cover object-top' }" />

      <button
        v-if="galleryImages.length > 1"
        class="absolute left-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 text-gray-900 opacity-0 shadow-md transition-[opacity,background-color,box-shadow] ease-in hover:bg-white/70 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary group-hover:opacity-100"
        type="button"
        :aria-label="`Previous image for ${node.name}`"
        @click="changeImageByOffset(-1)">
        <Icon name="ion:chevron-back-outline" size="24" />
      </button>

      <button
        v-if="galleryImages.length > 1"
        class="absolute right-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 text-gray-900 opacity-0 shadow-md transition-[opacity,background-color,box-shadow] ease-in hover:bg-white/70 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary group-hover:opacity-100"
        type="button"
        :aria-label="`Next image for ${node.name}`"
        @click="changeImageByOffset(1)">
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
