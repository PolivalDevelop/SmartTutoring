<template>
  <main class="profile-container" role="main" aria-labelledby="profileTitle">
    <PersonalProfile
      v-if="isMe && profileUser"
      :user="profileUser"
    />
    <PublicProfile
      v-else-if="profileUser"
      :user="profileUser"
      :isLogged="isLogged"
    />
    <p v-else class="loading">⏳ Caricamento profilo...</p>

    <section class="results" id="reviewsList">
      <ReviewCard
        v-for="review in reviews"
        :key="review._id"
        :review="review"
        v-if="reviews.length > 0"
      />
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import PersonalProfile from '@/components/PersonalProfile.vue'
import PublicProfile from '@/components/PublicProfile.vue'
import ReviewCard from '@/components/ReviewCard.vue'
import { watch } from "vue"
import { socket } from "@/plugins/socket";
import { getCurrentUser, isLoggedIn } from '../composables/auth';

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

function reviewByUserEmail(email) {
  return new Promise((resolve, reject) => {
    socket.emit("review:getByUserEmail", email, (response) => {
      if (!response.success) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
}

const route = useRoute()
const currentUser = getCurrentUser()

const profileEmail = route.params.email

let profileUser = ref(null)

userByEmail(profileEmail)
  .then(user => {
    console.log("Profilo utente:", user);
    profileUser.value = user;
  })
  .catch(err => {
    console.error("Errore:", err);
  });

const reviews = ref([])

reviewByUserEmail(profileEmail)
  .then(userReviews => {
    console.log("Recensioni utente:", userReviews);
    reviews.value = userReviews;
  })
  .catch(err => {
    console.error("Errore reviews:", err);
    reviews.value = [];
  });

let isMe = false  
if(isLoggedIn.value){
  console.log("Utente loggato:", currentUser.value);
  isMe = currentUser.value && currentUser.value?.email === profileEmail
} else {
  console.log("Nessun utente loggato.");
  isMe = false
}
const isLogged = isLoggedIn.value

const emit = defineEmits(['edit-profile'])


watch(
  () => route.params.email,
  async (newEmail) => {
    console.log("🔁 Cambio pagina profilo:", newEmail);
    try {
      profileUser.value = await userByEmail(newEmail).then(user => {
          console.log("Profilo utente:", user);
          profileUser.value = user;
        })
        .catch(err => {
          console.error("Errore:", err);
        });
      reviews.value = await reviewByUserEmail(newEmail).then(userReviews => {
          console.log("Recensioni utente:", userReviews);
          reviews.value = userReviews;
        })
        .catch(err => {
          console.error("Errore reviews:", err);
          reviews.value = [];
        });
    } catch (err) {
      console.error("Errore caricando il profilo:", err);
    }

    // Aggiorna isMe
    isMe = isLoggedIn.value && currentUser.value?.email === newEmail;
  }
);

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