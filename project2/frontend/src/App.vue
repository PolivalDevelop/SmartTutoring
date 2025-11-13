<template>
  <div class="app" role="application" aria-label="Piattaforma prenotazioni ripetizioni">
    <AppHeader @toggle-theme="toggleTheme" />
    <div class="main-layout">
      <SidebarFilters v-if="showFilters" />
      <main class="content" role="main" aria-labelledby="mainTitle">
        <HomeView />
        <FooterNote />
      </main>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

@import'~bootstrap/dist/css/bootstrap.css';
</style>