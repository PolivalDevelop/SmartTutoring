<template>
  <header class="app-header" role="banner">
    <div class="brand">
      <div class="logo" aria-hidden="true">
        <img src="@/assets/LogoSmartTutoring.png" alt="Logo ripetizioni" width="44" height="44" style="border-radius: 10px;" />
      </div>
      <div>
        <h1>Smart Tutoring</h1>
        <p class="lesson-sub">Trova e prenota lezioni universitarie</p>
      </div>
    </div>

    <div class="top-actions" role="navigation" aria-label="Azioni principali">
      <button class="btn btn-ghost theme-toggle" @click="$emit('toggle-theme')" aria-label="Cambia tema">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 0 1 12.21 3a9.002 9.002 0 0 0 0 18A9 9 0 0 1 21 12.79z"/>
        </svg>
      </button>
      <RouterLink to="/register" class="btn btn-primary">Iscriviti</RouterLink>
      <RouterLink to="/accedi" class="btn btn-ghost">Accedi</RouterLink>
    </div>
  </header>
</template>

<style scoped>
header.app-header {
  position: fixed;
  inset: 0 auto auto 0;
  width: 100%;
  z-index: 1000;
  background: var(--card);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .5rem 1rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: .75rem;
}

.brand .logo {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent), #8b5cf6);
  display: grid;
  place-items: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
}

.brand h1 {
  font-size: 1.1rem;
  margin: 0;
}

.lesson-sub {
  color: var(--muted);
  font-size: .8rem;
}

/* === Tema toggle === */
.theme-toggle {
  width: 2.4rem;
  height: 2.4rem;
  display: inline-flex;
  place-items: center;
  position: relative;
  transition: background .2s ease;
}

.theme-toggle .icon {
  width: 1.4rem;
  height: 1.4rem;
  pointer-events: none;
  transition: opacity .25s ease, transform .25s ease;
}

.theme-toggle .hidden {
  opacity: 0;
  transform: scale(0.7);
  position: absolute;
}

.theme-toggle:hover {
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  border-radius: 50%;
}
</style>


