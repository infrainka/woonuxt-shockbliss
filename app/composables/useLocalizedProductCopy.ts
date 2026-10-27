type ProductCopySource = {
  slug?: string | null;
  description?: string | null;
  shortDescription?: string | null;
};

export function useLocalizedProductCopy(getProduct: () => ProductCopySource | null | undefined) {
  const { t, te, locale } = useI18n();

  return computed(() => {
    const product = getProduct();
    if (!product) {
      return { description: null, shortDescription: null };
    }

    const translationKey = `productDescriptions.${product.slug}`;
    const descriptionKey = `${translationKey}.description`;
    const shortDescriptionKey = `${translationKey}.shortDescription`;
    const description = te(descriptionKey, locale.value) ? t(descriptionKey) : null;
    const shortDescription = te(shortDescriptionKey, locale.value) ? t(shortDescriptionKey) : description;

    return {
      description: description ?? product.description ?? null,
      shortDescription: shortDescription ?? (product.shortDescription || product.description || null),
    };
  });
}
