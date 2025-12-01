<template>
  <main class="profile-container" role="main" aria-labelledby="profileTitle">

    <PersonalProfile
      v-if="isMe && profileUser"
      :user="profileUser"
    />
    <PublicProfile
      v-else-if="profileUser"
      :user="profileUser"
      :isLogged="isLogged.value"
    />
    <p v-else class="loading">⏳ Caricamento profilo...</p>

    <section class="results" id="reviewsList">
      <ReviewCard
        v-for="review in reviews"
        :key="review?._id"
        :review="review"
        v-if="reviews?.length > 0"
      />
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import PersonalProfile from '@/components/PersonalProfile.vue'
import PublicProfile from '@/components/PublicProfile.vue'
import ReviewCard from '@/components/ReviewCard.vue'
import { watch } from "vue"
import { socket } from "@/plugins/socket";
import { getCurrentUser, isLoggedIn } from '@/composables/auth';
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { inject, onMounted, onUnmounted } from "vue";

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

const profileEmail = ref(route.params.email)

const profileUser = ref(null)

userByEmail(profileEmail.value)
  .then(user => {
    console.log("Profilo utente:", user);
    profileUser.value = user;
  })
  .catch(err => {
    console.error("Errore:", err);
  });

const reviews = ref([])

reviewByUserEmail(profileEmail.value)
  .then(userReviews => {
    console.log("Recensioni utente:", userReviews);
    reviews.value = userReviews;
    profileUser.value.numReviews = userReviews.length;
    profileUser.value.avgRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / (userReviews.length || 1);
  })
  .catch(err => {
    console.error("Errore reviews:", err);
    reviews.value = [];
  });

const isMe = computed(() => {
  return isLoggedIn.value && getCurrentUser().value?.email === profileEmail.value
})

onMounted(() => {
  console.log("Mounted ProfileView for:", profileEmail.value);
  socket.on("review:updated", () => {
    reviewByUserEmail(profileEmail.value) // Ricarica lista
      .then(userReviews => {
      console.log("Recensioni utente:", userReviews);
      reviews.value = userReviews;
      profileUser.value.numReviews = userReviews.length;
      profileUser.value.avgRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / (userReviews.length || 1);
    })
    .catch(err => {
      console.error("Errore reviews:", err);
      reviews.value = [];
    });
  });
});

const isLogged = ref(isLoggedIn.value)

const emit = defineEmits(['edit-profile'])

watch(
  () => route.params.email,
  async (newEmail) => {
    profileEmail.value = newEmail
    console.log("🔁 Cambio pagina profilo:", newEmail);
    try {
      profileUser.value = await userByEmail(newEmail).then(user => {
        console.log("Profilo utente:", user);
        return user;
      })
      reviews.value = await reviewByUserEmail(newEmail).then(userReviews => {
          console.log("Recensioni utente:", userReviews);
          return userReviews;
        })
        .catch(err => {
          console.error("Errore reviews:", err);
          return [];
        });
      console.log("isMe:", isMe);  
      isLogged.value = isLoggedIn.value
    } catch (err) {
      console.error("Errore caricando il profilo:", err);
    }
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