<script setup lang="ts">

import { RouterView } from 'vue-router'


</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
    </div>
  </header>

  <main>

    <RouterView />

  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;500;600;700&family=League+Spartan:wght@500;600;700;800&display=swap');

:root {
  --color-bg: #0a0a0c;
  --color-accent: #e23c3c;
  --color-on-accent: #ffffff;
  --color-heading: #f8fafc;
  --color-subtitle: #a1a1aa;
  --color-card-bg: rgba(255, 255, 255, 0.04);
  --color-card-bg-hover: rgba(255, 255, 255, 0.07);
  --color-card-border: rgba(255, 255, 255, 0.08);
  --color-card-text: #f4f4f5;
  --font-display: 'League Spartan', system-ui, sans-serif;
  --font-body: 'Kumbh Sans', system-ui, sans-serif;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --radius-lg: 1.25rem;
  --radius-full: 999px;
}

html,
body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  background: var(--color-bg);
}

#app {
  min-height: 100dvh;
}
</style>