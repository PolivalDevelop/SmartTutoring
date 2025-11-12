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


