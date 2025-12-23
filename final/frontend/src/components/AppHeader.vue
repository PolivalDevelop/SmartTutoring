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
        
        <button class="hamburger-btn" @click="toggleMenu" aria-label="Menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div class="nav-menu" :class="{ 'open': isMenuOpen }">
          
          <template v-if="isLoggedIn">
            <div class="logged-menu">
              <RouterLink to="/" class="menu-item" @click="closeMenu">Home</RouterLink>
              <RouterLink to="/reports" class="menu-item" v-if="isAdmin" @click="closeMenu">Report</RouterLink>
              <RouterLink to="/booked" class="menu-item" @click="closeMenu">Lezioni Prenotate</RouterLink>
              <RouterLink :to="`/offered/${getCurrentUser().value?.email}`" class="menu-item" @click="closeMenu">Lezioni Offerte</RouterLink>
              <RouterLink :to="`/profile/${getCurrentUser().value?.email}`" class="menu-item" @click="closeMenu">Profilo</RouterLink>
              <RouterLink to="/" class="menu-item logout-btn" @click="handleLogout(); closeMenu()">Logout</RouterLink>
            </div>
          </template>

          <template v-else>
            <div class="guest-menu">
              <RouterLink to="/" class="menu-item" @click="closeMenu">Home</RouterLink>
              <RouterLink to="/login" class="menu-item" @click="closeMenu">Accedi</RouterLink>
              <RouterLink to="/register" class="menu-item" @click="closeMenu">Iscriviti</RouterLink>
            </div>
          </template>

        </div>

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
import { ref } from 'vue'
import { isLoggedIn, logout } from '@/composables/auth.js'
import useDarkMode from '@/composables/useDarkMode.js'
import { getCurrentUser, isAdmin } from '@/composables/auth.js'

const { toggleTheme, isDark } = useDarkMode()

const isMenuOpen = ref(false)

function handleLogout() {
  logout()
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
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

/* Logged menu */
.guest-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.guest-menu .menu-item {
  padding: 0.45rem 0.9rem;
  border-radius: 9999px;
  background-color: var(--accent-light);
  color: var(--accent-dark);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}
.guest-menu .menu-item:hover {
  background-color: var(--accent);
  color: white;
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
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

.hamburger-btn {
  display: none; 
  background: none;
  border: none;
  cursor: pointer;
  color: var(--accent-dark);
}

@media (max-width: 768px) {

  .lesson-sub {
    display: none;
  }

  .brand h1 {
    font-size: 1rem; 
  }

  .hamburger-btn {
    display: block;
    margin-right: 10px;
  }

  .nav-menu {
    position: absolute;
    top: 100%; 
    left: 0;
    width: 100%;
    background: var(--card); 
    box-shadow: var(--shadow-md);
    padding: 1rem;
    
    display: flex;
    flex-direction: column; 
    
    transform: translateY(-200%);
    opacity: 0;
    pointer-events: none; 
    transition: all 0.3s ease-in-out;
    z-index: 999;
  }

  .nav-menu.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: all;
  }

  .logged-menu, .guest-menu {
    flex-direction: column;
    width: 100%;
    align-items: stretch;
    gap: 10px;
  }

  .menu-item {
    text-align: center;
    width: 100%;
    display: block;
  }
}
</style>
