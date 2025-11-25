<template>
  <main class="profile-container" role="main" aria-labelledby="profileTitle">
    <PersonalProfile
      v-if="isMe && profileUser"
      :user="profileUser"
      @view-balance="viewBalance"
      @edit-profile="editProfile"
    />
    <PublicProfile
      v-else-if="profileUser"
      :user="profileUser"
      :is-logged="isLogged"
    />
    <p v-else>⚠️ Utente non trovato.</p>
  </main>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useUser } from '@/composables/useUser.js'
import PersonalProfile from '@/components/PersonalProfile.vue'
import PublicProfile from '@/components/PublicProfile.vue'

import { socket } from "@/plugins/socket";
import { getCurrentUser } from '../composables/auth';

function userByEmail(email) {
  return new Promise((resolve, reject) => {
    socket.emit("user:getByEmail", { email }, (response) => {
      if (!response.success) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
}

const route = useRoute()
const { currentUser } = getCurrentUser()

const profileEmail = route.params.email

//const profileUser = userById(profileId)
let profileUser

userByEmail(profileEmail)
  .then(user => {
    console.log("Profilo utente:", user);
    profileUser = user;
  })
  .catch(err => {
    console.error("Errore:", err);
  });

const isMe = currentUser.value && currentUser.value?.email === profileEmail
const isLogged = !!currentUser.value

const emit = defineEmits(['edit-profile'])


function viewBalance() {
  alert('💰 Funzione saldo non ancora implementata!')
}
function editProfile() {
  emit('edit-profile')
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