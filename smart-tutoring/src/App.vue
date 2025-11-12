<template>
  <div class="app" role="application" aria-label="Piattaforma prenotazioni ripetizioni">
    <AppHeader @toggle-theme="toggleTheme" />
    
    <!-- Sidebar e contenuto principali come figli diretti di .app -->
    <SidebarFilters v-if="showFilters" />
    <RouterView />
      

    <BookingDialog
      v-if="bookingDialog.visible"
      :lesson="bookingDialog.lesson"
      @close="bookingDialog.visible = false"
      @confirm="confirmBooking"
    />

    <ToastNotification v-if="toast.visible" :message="toast.message" @close="toast.visible = false" />
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import SidebarFilters from './components/SidebarFilters.vue'
import HomeView from './views/HomeView.vue'
import BookingDialog from './components/BookingDialog.vue'
import ToastNotification from './components/ToastNotification.vue'
import useDarkMode from './composables/useDarkMode.js'

const { toggleTheme } = useDarkMode()

const showFilters = ref(true)
const bookingDialog = ref({ visible: false, lesson: null })
const toast = ref({ visible: false, message: '' })

function openBooking(lesson) {
  bookingDialog.value = { visible: true, lesson }
}

function confirmBooking() {
  bookingDialog.value.visible = false
  toast.value = {
    visible: true,
    message: '✅ Lezione prenotata con successo! Il costo è stato addebitato dal tuo saldo Smart Tutoring.'
  }
}
</script>