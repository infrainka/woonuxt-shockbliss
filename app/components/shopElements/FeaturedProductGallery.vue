<script setup lang="ts">
import type { ImageFragment, Product } from '#types/gql';

const props = defineProps({
  product: { type: Object as PropType<Product>, required: true },
});

const { FALLBACK_IMG } = useHelpers();
const localizedCopy = useLocalizedProductCopy(() => props.product);

// Combine the featured image (if any) with the gallery images set in WordPress, removing
// duplicates. This product has no dedicated featured image set, only gallery images, so the
// gallery list alone already covers every photo for both colour/pattern variations.
const galleryImages = computed<ImageFragment[]>(() => {
  const nodes = [props.product.image, ...(props.product.galleryImages?.nodes ?? [])].filter((img): img is ImageFragment => Boolean(img));
  return nodes.filter((img, index, self) => index === self.findIndex((t) => t.databaseId === img.databaseId));
});

const productLink = computed(() => `/product/${props.product.slug}`);
</script>

<template>
  <div class="container py-8 md:py-12">
    <div class="max-w-3xl">
      <h1 class="text-3xl font-sesmibold md:text-4xl">{{ product.name }}</h1>
      <ProductPrice v-if="product.regularPrice" class="mt-3 text-xl" :sale-price="product.salePrice" :regular-price="product.regularPrice" />
      <div v-if="localizedCopy.description" class="mt-4 text-gray-600 prose max-w-none" v-html="localizedCopy.description"></div>
      <Button :to="productLink" icon="ion:arrow-forward-outline" icon-position="right" class="mt-6">{{ $t('shop.viewProduct') }}</Button>
    </div>

    <div v-if="galleryImages.length" class="pinterest-gallery mt-10">
      <NuxtLink v-for="(image, index) in galleryImages" :key="image.databaseId ?? index" :to="productLink" class="pinterest-tile group">
        <NuxtImg
          :src="image.sourceUrl || FALLBACK_IMG"
          :alt="image.altText || product.name || ''"
          :title="image.title || product.name"
          :loading="index === 0 ? 'eager' : 'lazy'"
          sizes="sm:50vw md:33vw lg:25vw"
          class="w-full h-auto rounded-xl transition-transform duration-300 group-hover:scale-[1.02]" />
        <span
          class="absolute inset-0 flex items-end rounded-xl bg-gradient-to-t from-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span class="text-sm font-semibold text-white">{{ $t('shop.viewProduct') }}</span>
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.pinterest-gallery {
  column-count: 2;
  column-gap: 1rem;
}

@media (min-width: 640px) {
  .pinterest-gallery {
    column-count: 3;
  }
}

@media (min-width: 1024px) {
  .pinterest-gallery {
    column-count: 4;
  }
}

.pinterest-tile {
  position: relative;
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  break-inside: avoid;
}
</style>
