<template>
  <div :class="['app', showFilters ? 'with-sidebar' : 'no-sidebar']" role="application" aria-label="Piattaforma prenotazioni ripetizioni">

    <AppHeader @toggle-theme="toggleTheme" />
    
    <SidebarFilters v-if="showFilters" />
    <RouterView 
      @book="openBooking"
      @publish-request="publishDialog.visible = true"
      @edit-profile="openEditProfile"
    />


    <!-- FAB pubblicazione lezione -->
    <button
      v-if="isLoggedIn"
      class="fab-main"
      aria-label="Pubblica nuova lezione"
      title="Pubblica nuova lezione"
      @click="publishDialog.visible = true"
    >
      +
    </button>
      

    <BookingDialog
      v-if="bookingDialog.visible"
      :lesson="bookingDialog.lesson"
      @close="bookingDialog.visible = false"
      @confirm="confirmBooking"
    />

    <PublishDialog
      v-if="publishDialog.visible"
      @close="publishDialog.visible = false"
      @publish="handlePublish"
    />

    <EditProfileDialog
      v-if="editProfileDialog.visible"
      :user="currentUser"
      @close="editProfileDialog.visible = false"
      @save="updateUser"
    />

    <ToastNotification v-if="toast.visible" :message="toast.message" @close="toast.visible = false" />
  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import SidebarFilters from './components/SidebarFilters.vue'
import BookingDialog from './components/BookingDialog.vue'
import PublishDialog from './components/PublishDialog.vue'
import EditProfileDialog from './components/EditProfileDialog.vue'
import ToastNotification from './components/ToastNotification.vue'
import useDarkMode from './composables/useDarkMode.js'
import { isLoggedIn } from '@/composables/auth.js'
import { addLesson, removeLesson, bookLesson } from '@/composables/useLessons.js'
import { useUser } from '@/composables/useUser.js'


const { currentUser, updateUser: updateUserInStore } = useUser()

const { toggleTheme } = useDarkMode()

const route = useRoute()
const router = useRouter()
const showFilters = computed(() => route.meta.showFilters)



const bookingDialog = ref({ visible: false, lesson: null })
const publishDialog = ref({ visible: false })
const editProfileDialog = ref({ visible: false })


const toast = ref({ visible: false, message: '' })

function openBooking(lesson) {
  if (!isLoggedIn) {
    showToast('⚠️ Devi effettuare l’accesso per prenotare una lezione.')
    router.push('/login')
    return
  }

  bookingDialog.value = { visible: true, lesson }
}


function confirmBooking() {
  const lesson = bookingDialog.value.lesson
  bookingDialog.value.visible = false

  if (bookingDialog.value.lesson) {
    bookLesson(lesson.id)
  }

  showToast('✅ Lezione prenotata con successo! Il costo è stato addebitato dal tuo saldo Smart Tutoring.')
}


function handlePublish(lesson) {
  addLesson(lesson)
  showToast('✅ Lezione pubblicata con successo!')
  publishDialog.value.visible = false
}

function openEditProfile() {
  const name = currentUser.value?.name || 'utente'
  showToast('Ciao ' + name)
  editProfileDialog.value.visible = true
}

function updateUser(updatedUser) {
  updateUserInStore(updatedUser) 
  editProfileDialog.value.visible = false
}



function showToast(message) {
  toast.value.message = message
  toast.value.visible = true
  setTimeout(() => (toast.value.visible = false), 2000)
}
</script>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
  gap: var(--gap);
  padding-top: 4.5rem;

  &.no-sidebar {
    display: grid;
    grid-template-columns: 1fr;
  }

  &.with-sidebar {
    @media (min-width: 880px) {
      display: grid;
      grid-template-columns: var(--sidebar-w) 1fr;
    }

    @media (max-width: 879px) {
      display: flex;
      flex-direction: column;
    }
  }
}

.fab-main {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: var(--accent);
  color: white;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1001;
}

.fab-main:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
</style>
