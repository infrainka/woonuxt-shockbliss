/**
 * Shockbliss app-level overrides.
 * Merged on top of woonuxt_base/app/app.config.ts
 */
const baseUrl = 'https://shop.shockbliss.com';

export default defineAppConfig({
  siteName: 'Shockbliss',
  shortDescription: 'Shockbliss. Pue taidetta, ole taide.',
  description: 'Shockbliss on rohkean esteettinen verkkokauppa, jossa tuotteet vaihtelevat mutta tyyli pysyy. Tuotteet suunnitellaan ja valmistetaan käsityönä.',
  baseUrl,
  siteImage: `${baseUrl}/Shockbliss.png`,
});
