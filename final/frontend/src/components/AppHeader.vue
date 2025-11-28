<template>
  <header class="app-header" role="banner">
    <div class="brand">
      <div class="logo" aria-hidden="true">
        <img src="@/assets/LogoSmartTutoring.png" alt="Logo ripetizioni" width="44" height="44" />
      </div>
      <div>
        <h1>Smart Tutoring</h1>
        <p class="lesson-sub">Trova e prenota lezioni universitarie</p>
      </div>
    </div>

    <nav class="top-actions" role="navigation" aria-label="Azioni principali">
      <!-- Guest/Logged menu -->
      <template v-if="isLoggedIn">
        <div class="logged-menu">
          <RouterLink to="/" class="menu-item">Home</RouterLink>
          <RouterLink to="/reports" class="menu-item" v-if="isAdmin.value">Report</RouterLink>
          <RouterLink to="/booked" class="menu-item">Lezioni Prenotate</RouterLink>
          <RouterLink to="/offered" class="menu-item">Lezioni Offerte</RouterLink>
          <RouterLink :to="`/profile/${getCurrentUser().value?.email}`" class="menu-item">Profilo</RouterLink>
          <button class="menu-item logout-btn" @click="handleLogout">Logout</button>
        </div>
      </template>
      <template v-else>
        <div class="guest-menu">
          <RouterLink to="/" class="menu-item">Home</RouterLink>
          <RouterLink to="/login" class="btn btn-ghost">Accedi</RouterLink>
          <RouterLink to="/register" class="btn btn-primary">Iscriviti</RouterLink>
        </div>
      </template>

      <!-- Toggle tema sempre visibile in fondo -->
      <button class="theme-toggle" :class="{ dark: isDark }" @click="toggleTheme" aria-label="Cambia tema">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5" class="sun" />
          <g class="rays">
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </g>
        </svg>
      </button>
    </nav>
  </header>
</template>

<script setup>
import { isLoggedIn, logout } from '@/composables/auth.js'
import useDarkMode from '@/composables/useDarkMode.js'
import { getCurrentUser, isAdmin } from '@/composables/auth.js'

const { toggleTheme, isDark } = useDarkMode()

function handleLogout() {
  logout()
}
</script>

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
  padding: 0.5rem 1rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand .logo img {
  border-radius: 10px;
}

.brand h1 {
  font-size: 1.2rem;
  margin: 0;
}

.lesson-sub {
  color: var(--muted);
  font-size: 0.8rem;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Guest menu */
.guest-menu .btn {
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  font-weight: 500;
  transition: all 0.2s ease;
}
.guest-menu .btn:hover {
  transform: translateY(-1px);
}

/* Logged menu */
.logged-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.logged-menu .menu-item {
  padding: 0.45rem 0.9rem;
  border-radius: 9999px;
  background-color: var(--accent-light);
  color: var(--accent-dark);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}
.logged-menu .menu-item:hover {
  background-color: var(--accent);
  color: white;
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}
.logout-btn {
  cursor: pointer;
  border: none;
  background-color: var(--danger-light);
  color: var(--danger-dark);
}
.logout-btn:hover {
  background-color: var(--danger);
  color: white;
}

/* Toggle tema */
.theme-toggle {
  width: 3rem;
  height: 3rem;
  display: flex;
  place-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}
.theme-toggle svg {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease, fill 0.3s ease, stroke 0.3s ease;
}
.theme-toggle.dark svg {
  transform: rotate(180deg);
  stroke: #f0f0f0;
  fill: #f0f0f0;
}
</style>
