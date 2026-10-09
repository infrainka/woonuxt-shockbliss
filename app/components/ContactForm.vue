<script setup>
import { ref } from 'vue';
const { t } = useI18n();

// Allows pages (e.g. About) to override the default heading, similar to the
// Angular app's `[formTitle]` input on its contact-form component.
const props = defineProps({
  title: { type: String, default: null },
});

// State to handle the feedback message after submission
const formStatus = ref(null);
const feedbackMessage = ref('');
const isSubmitting = ref(false);

const handleSubmit = (event) => {
  event.preventDefault();
  isSubmitting.value = true;

  const myForm = event.target;
  const formData = new FormData(myForm);

  // Send the form data to Netlify's built-in form handler
  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(formData).toString(),
  })
    .then(() => {
      formStatus.value = 'success';
      feedbackMessage.value = t('contactForm.successMsg');
      myForm.reset();
    })
    .catch(() => {
      formStatus.value = 'error';
      feedbackMessage.value = t('contactForm.errorMsg');
    })
    .finally(() => {
      isSubmitting.value = false;
    });
};
</script>

<template>
  <div class="shock-form-container">
    <div v-if="formStatus" class="shock-feedback" :class="formStatus === 'success' ? 'shock-success' : 'shock-error'">
      {{ feedbackMessage }}
    </div>

    <form name="shockbliss-contact" method="POST" data-netlify="true" class="shock-contact-form" @submit="handleSubmit">
      <input type="hidden" name="form-name" value="shockbliss-contact" />

      <h2 class="shock-form-title">{{ props.title || $t('contactForm.title') }}</h2>

      <div class="shock-form-group">
        <label for="shock-name">{{ $t('contactForm.nameLabel') }}</label>
        <input type="text" id="shock-name" name="name" :placeholder="$t('contactForm.namePlaceholder')" required />
      </div>

      <div class="shock-form-group">
        <label for="shock-email">{{ $t('contactForm.emailLabel') }}</label>
        <input type="email" id="shock-email" name="email" :placeholder="$t('contactForm.emailPlaceholder')" required />
      </div>

      <div class="shock-form-group">
        <label for="shock-message">{{ $t('contactForm.messageLabel') }}</label>
        <textarea id="shock-message" name="message" rows="5" :placeholder="$t('contactForm.messagePlaceholder')" required></textarea>
      </div>

      <button type="submit" class="shock-button" :disabled="isSubmitting">
        {{ isSubmitting ? $t('contactForm.btnSending') : $t('contactForm.btnSend') }}
      </button>
    </form>
  </div>
</template>

<style scoped>
/* Shockbliss-themed contact form — ported 1:1 from the Angular app's cyberpunk glow
   (contact-form.component.scss). Glow colors are defined locally (rather than relying
   on the global --color-shock-* theme variables) so this component's look never
   depends on the Tailwind theme file having been processed. */
.shock-form-container {
  --shock-primary-glow: #9d00ff;
  --shock-cyan-glow: #00f0ff;

  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  background: rgba(10, 10, 25, 0.75);
  border: 1px solid var(--shock-primary-glow);
  border-radius: 8px;
  box-shadow:
    0 0 5px var(--shock-primary-glow),
    0 0 15px var(--shock-primary-glow),
    inset 0 0 5px rgba(157, 0, 255, 0.5);
  backdrop-filter: blur(10px);
  transition:
    transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
}

.shock-form-container:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow:
    0 0 10px var(--shock-primary-glow),
    0 0 30px var(--shock-primary-glow),
    0 0 50px var(--shock-cyan-glow),
    inset 0 0 10px rgba(157, 0, 255, 0.5);
}

.shock-form-title {
  text-align: center;
  margin-bottom: 25px;
  text-shadow: 0 0 5px var(--shock-cyan-glow);
}

.shock-form-group {
  margin-bottom: 20px;
}

.shock-form-group label {
  display: block;
  color: #e0e0e0;
  margin-bottom: 8px;
  font-size: 0.85em;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.shock-form-group input,
.shock-form-group textarea {
  width: 100%;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.45);
  border: none;
  border-bottom: 1px solid #444;
  color: #f1f1f1;
  font-family: 'Roboto', 'Helvetica Neue', sans-serif;
  font-size: 1em;
  outline: none;
  border-radius: 4px 4px 0 0;
  box-sizing: border-box;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.shock-form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.shock-form-group input:focus,
.shock-form-group textarea:focus {
  border-bottom-color: var(--shock-cyan-glow);
  box-shadow: 0 5px 15px -5px var(--shock-cyan-glow);
}

.shock-button {
  width: 100%;
  padding: 15px;
  border: 1px solid var(--shock-primary-glow);
  border-radius: 4px;
  background-color: transparent;
  color: #e0e0e0;
  font-size: 1.05em;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  text-shadow: 0 0 5px var(--shock-primary-glow);
  transition:
    background-color 0.3s,
    color 0.3s,
    text-shadow 0.3s;
}

.shock-button:hover:not(:disabled) {
  background-color: var(--shock-primary-glow);
  color: #000;
  text-shadow: none;
}

.shock-button:disabled {
  border-color: #444;
  color: #666;
  cursor: not-allowed;
  text-shadow: none;
}

.shock-feedback {
  padding: 15px;
  margin-bottom: 25px;
  border-radius: 4px;
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.shock-success {
  background-color: rgba(30, 80, 30, 0.15);
  border: 1px solid #2d6a2d;
  color: #81c784;
}

.shock-error {
  background-color: rgba(157, 0, 255, 0.1);
  border: 1px solid var(--shock-primary-glow);
  color: #e57373;
}
</style>
