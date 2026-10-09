<script setup>
const { t } = useI18n();

// Team bios are sourced from i18n so they're translated for every locale.
// TODO: swap the placeholder image for a real portrait once available,
// e.g. '/images/team/inka.webp' and '/images/team/ani.webp'.
const founders = computed(() => [
  {
    key: 'inka',
    title: t('aboutPage.founders.inka.title'),
    name: t('aboutPage.founders.inka.name'),
    bio: t('aboutPage.founders.inka.bio'),
    email: t('aboutPage.founders.inka.email'),
    phone: t('aboutPage.founders.inka.phone'),
    image: '/images/placeholder.jpg',
  },
  {
    key: 'ani',
    title: t('aboutPage.founders.ani.title'),
    name: t('aboutPage.founders.ani.name'),
    bio: t('aboutPage.founders.ani.bio'),
    email: t('aboutPage.founders.ani.email'),
    phone: t('aboutPage.founders.ani.phone'),
    image: '/images/placeholder.jpg',
  },
]);

useSeoMeta({
  title: t('aboutPage.title'),
});
</script>

<template>
  <div class="container my-8">
    <section class="shock-intro">
      <h1>{{ $t('aboutPage.title') }}</h1>
      <p>{{ $t('aboutPage.greeting') }}</p>
      <p>{{ $t('aboutPage.p1') }}</p>
      <p>{{ $t('aboutPage.p2') }}</p>
      <p>{{ $t('aboutPage.p3') }}</p>

      <!-- The <br /> is safely hardcoded in the template -->
      <p class="shock-signoff"><em>{{ $t('aboutPage.signoff1') }}<br />{{ $t('aboutPage.signoff2') }}</em></p>
    </section>

    <section class="shock-founders">
      <h2 class="sb-form-title">{{ $t('aboutPage.foundersTitle') }}</h2>
      <div class="founders-grid">
        <article v-for="founder in founders" :key="founder.key" class="founder-card">
          <h3 class="founder-title">{{ founder.title }}</h3>

          <div class="founder-image-wrap">
            <NuxtImg :src="founder.image" :alt="founder.name" width="200" height="200" loading="lazy" class="founder-image" />
          </div>

          <div class="info-box">
            <h4 class="founder-name">{{ founder.name }}</h4>
            <p class="founder-bio">{{ founder.bio }}</p>

            <div class="contact-info">
              <a class="email" :href="`mailto:${founder.email}`">{{ founder.email }}</a>
              <div class="phone">{{ founder.phone }}</div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="contact-form-section">
      <ContactForm :title="$t('aboutPage.contactFormTitle')" />
    </section>
  </div>
</template>

<style scoped>
.shock-intro {
  margin: 2rem auto 3rem auto;
  padding: 2rem;
  max-width: 700px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  text-align: center;
}

.shock-intro p {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #e5e7eb;
}

.shock-intro p:last-child {
  margin-bottom: 0;
}

.shock-signoff {
  color: var(--color-shock-gold);
}

.shock-founders {
  margin: 3rem 0;
}

.founders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  max-width: 700px;
  margin: 0 auto;
}

.founder-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.founder-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-shock-purple);
}

.founder-image-wrap {
  width: 180px;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  margin-bottom: 0.75rem;
}

.founder-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.info-box {
  width: 100%;
  max-width: 320px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
}

.founder-name {
  margin: 0;
  font-size: 1.05rem;
  color: #ffffff;
}

.founder-bio {
  margin: 0.5rem 0;
  color: #d1d5db;
  font-size: 0.95rem;
}

.contact-info {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.email {
  color: var(--color-shock-glow);
  text-decoration: none;
  word-break: break-all;
}

.phone {
  color: #d1d5db;
  font-size: 0.95rem;
}

.contact-faq {
  margin-top: 2rem;
}

.contact-form-section {
  margin-top: 1rem;
}

.sb-form-title {
  text-align: center;
  color: #ffffff;
  font-family: 'Lora', serif;
  font-weight: 400;
  margin-bottom: 30px;
  letter-spacing: 2px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  padding-bottom: 15px;
  font-size: 30px;
}
</style>
