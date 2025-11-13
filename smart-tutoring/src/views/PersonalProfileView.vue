<template>
  <main class="profile-container" role="main" aria-labelledby="profileTitle">
    <PersonalProfile
      v-if="user"
      :user="user"
      @view-balance="viewBalance"
      @edit-profile="editProfile"
    />
    <p v-else class="no-user">⚠️ Nessun utente loggato.</p>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUser } from '@/composables/useUser.js'
import PersonalProfile from '@/components/PersonalProfile.vue'

const router = useRouter()
const { currentUser } = useUser()
const user = currentUser

function viewBalance() {
  alert('💰 Funzione saldo non ancora implementata!')
}
function editProfile() {
  router.push('/edit-profile')
}
</script>

<style scoped>
.no-user {
  text-align: center;
  color: var(--muted);
  margin-top: 2rem;
}
.profile-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem 1rem;
}

</style>