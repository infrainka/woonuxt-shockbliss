<script lang="ts" setup>
import { StockStatusEnum } from '#gql/default';
import type { Product } from '#types/gql';

const { setProducts, updateProductList } = useProducts();
const route = useRoute();
const { storeSettings } = useAppConfig();

const { data, error, status } = await useAsyncGql('getProducts');
const allProducts = computed<Product[]>(() => (data.value?.products?.nodes ?? []) as Product[]);
const isLoading = computed<boolean>(() => status.value === 'idle' || status.value === 'pending');
const hasError = computed<boolean>(() => Boolean(error.value));
const hasProducts = computed<boolean>(() => allProducts.value.length > 0);

watchEffect(() => {
  setProducts(allProducts.value);
});

onMounted(() => {
  if (Object.keys(route.query).length > 0) updateProductList();
});

watch(
  () => route.query,
  () => {
    if (!['products', 'product-page-pager'].includes(String(route.name))) return;
    updateProductList();
  },
);

// Not every product type in the catalog exposes `stockStatus` (e.g. external products), so those
// are treated as purchasable by default rather than excluded.
const isPurchasable = (product: Product): boolean => (product as { stockStatus?: StockStatusEnum }).stockStatus !== StockStatusEnum.OutOfStock;
const purchasableProducts = computed<Product[]>(() => allProducts.value.filter(isPurchasable));

// While the shop has exactly one purchasable product, show a focused gallery for it instead of
// the usual filterable grid. This automatically reverts to the normal grid below as soon as a
// second purchasable product is added to the catalog.
const featuredProduct = computed<Product | null>(() => (purchasableProducts.value.length === 1 ? purchasableProducts.value[0] : null));

useHead({
  title: `Tuotteet`,
  meta: [{ name: 'description', content: 'Discover our products' }],
});
</script>

<template>
  <main>
    <div v-if="isLoading" class="container flex items-center justify-center min-h-96">
      <LoadingIcon size="32" stroke="3" />
    </div>
    <FeaturedProductGallery v-else-if="featuredProduct" :product="featuredProduct" />
    <div v-else-if="hasProducts" class="container flex items-start gap-16">
      <Filters v-if="storeSettings.showFilters" />

      <div class="w-full">
        <div class="flex items-center justify-between w-full gap-4 mt-8 md:gap-8">
          <ProductResultCount />
          <OrderByDropdown v-if="storeSettings.showOrderByDropdown" class="hidden md:inline-flex" />
          <ShowFilterTrigger v-if="storeSettings.showFilters" class="md:hidden" />
        </div>
        <ProductGrid />
      </div>
    </div>
    <NoProductsFound v-else-if="hasError">We couldn't load products right now. Please refresh and try again.</NoProductsFound>
    <NoProductsFound v-else>No products found. Please try adjusting your filters or check back later.</NoProductsFound>
  </main>
</template>
