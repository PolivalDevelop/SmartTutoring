<template>
  <div :class="['app', showFilters ? 'with-sidebar' : 'no-sidebar']" role="application" aria-label="Piattaforma prenotazioni ripetizioni">

    <AppHeader @toggle-theme="toggleTheme"/>
    
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
import BookingDialog from './components/BookingDialog.vue'
import PublishDialog from './components/PublishDialog.vue'
import EditProfileDialog from './components/EditProfileDialog.vue'
import ToastNotification from './components/ToastNotification.vue'
import useDarkMode from './composables/useDarkMode.js'
import { isLoggedIn, setMatter } from '@/composables/auth.js'
import { inject, onMounted, onBeforeUnmount } from "vue";
import { getCurrentUser } from './composables/auth.js'


const { toggleTheme } = useDarkMode()

const route = useRoute()
const router = useRouter()
const showFilters = computed(() => route.meta.showFilters)


const bookingDialog = ref({ visible: false, lesson: null })
const publishDialog = ref({ visible: false })
const editProfileDialog = ref({ visible: false })


const toast = ref({ visible: false, message: '' })

function openBooking(lesson) {
  console.log("Tentativo di prenotazione lezione:", lesson);
  if (!isLoggedIn.value) {
    console.log("Utente non loggato, reindirizzamento alla pagina di login.");
    showToast('⚠️ Devi effettuare l’accesso per prenotare una lezione.')
    router.push('/login')
    return
  }
  console.log("Apertura dialog di prenotazione per la lezione");

  bookingDialog.value = { visible: true, lesson }
}


const socket = inject("socket");

onMounted(() => {
  socket.emit("lessons:getMatter", (response) => {
    if (response?.success) {
      setMatter(response.matters);
      console.log("Materie ricevute:", response.matters);
    } else {
      console.error("Errore nel recupero delle materie:", response?.error);
    }
  });

  window.addEventListener("beforeunload", () => {
    if(isLoggedIn.value) {
      logout();
      socket.emit("user:logout");
    }
  });
});


onBeforeUnmount(() => {
  window.addEventListener("beforeunload", () => {
    if(isLoggedIn.value) {
      logout();
      socket.emit("user:logout");
    }
  });
});

function confirmBooking() {
  console.log("Conferma prenotazione lezione: ", bookingDialog.value.lesson);
  const lesson = bookingDialog.value.lesson;
  console.log("Lezione da prenotare:", lesson);
  bookingDialog.value.visible = false;
  console.log("Dialog di prenotazione chiuso.");
  const userEmail = getCurrentUser().value?.email || null;
  console.log("Email utente corrente:", userEmail);

  if (!lesson) return;

  socket.emit("lesson:book", {
    lessonId: lesson._id,
    studentEmail: userEmail
  }, (response) => {
    if (!response.success) {
      console.error("Errore durante la prenotazione:", response.error);
      showToast("❌ Errore durante la prenotazione: " + response.error);
      return;
    }
    console.log("Lezione prenotata:", response.data);
    showToast(
      "✅ Lezione prenotata con successo! Il costo è stato addebitato dal tuo saldo Smart Tutoring."
    );
  });
}



function handlePublish(lesson) {
  publishDialog.value.visible = false;
  console.log("Pubblicazione lezione:", lesson);

  socket.emit("lesson:create", lesson, (response) => {
    if (!response.success) {
      console.error("Errore durante la pubblicazione:", response.error);
      showToast("❌ Errore durante la pubblicazione: " + response.error);
      return;
    }
    console.log("Lezione pubblicata:", response.data);
    showToast("✅ Lezione pubblicata con successo!");

  });
}

function openEditProfile() {
  const name = currentUser.value?.name || 'utente'
  showToast('Ciao ' + name)
  editProfileDialog.value.visible = true
}

function updateUser(updatedUser) {
  socket.emit("user:updateProfile", currentUser.value?.email, updatedUser, (response) => {
    if (!response.success) {
      showToast("❌ Errore durante l'aggiornamento del profilo: " + response.error);
      return;
    }
    currentUser.value = response.data;
    showToast("✅ Profilo aggiornato con successo!");
  }); 
  editProfileDialog.value.visible = false
}

function showToast(message) {
  toast.value.message = message
  toast.value.visible = true
  setTimeout(() => (toast.value.visible = false), 2000)
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  gap: var(--gap);
  padding-top: 4.5rem;

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
