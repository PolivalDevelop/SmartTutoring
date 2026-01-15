<template>
  <main class="profile-container" role="main" aria-labelledby="profileTitle">

    <div class="profile-wrapper">
      <PersonalProfile
        v-if="isMe && profileUser"
        :user="profileUser"
      />
      <PublicProfile
        v-else-if="profileUser"
        :user="profileUser"
        :isLogged="isLogged.value"
        @show-toast="$emit('show-toast', $event)"
      />
      <p v-else class="loading">⏳ Caricamento profilo...</p>

      <section class="reviews-section" id="reviewsList">
        <h3 class="reviews-title" v-if="reviews?.length > 0">Recensioni</h3>

        <ReviewCard
          v-for="review in reviews"
          :key="review?._id"
          :review="review"
          v-if="reviews?.length > 0"
        />

        <p v-else class="no-reviews">Nessuna recensione presente.</p>
      </section>
    </div>

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
    profileUser.value = user;
  })
  .catch(err => {
    console.error("Errore:", err);
  });

const reviews = ref([])

reviewByUserEmail(profileEmail.value)
  .then(userReviews => {
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
  socket.on("review:updated", () => {
    reviewByUserEmail(profileEmail.value) 
      .then(userReviews => {
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

const emit = defineEmits(['edit-profile', 'show-toast']);

watch(
  () => route.params.email,
  async (newEmail) => {
    profileEmail.value = newEmail
    try {
      profileUser.value = await userByEmail(newEmail).then(user => {
        return user;
      })
      reviews.value = await reviewByUserEmail(newEmail).then(userReviews => {
          return userReviews;
        })
        .catch(err => {
          console.error("Errore reviews:", err);
          return [];
        }); 
      isLogged.value = isLoggedIn.value
    } catch (err) {
      console.error("Errore caricando il profilo:", err);
    }
  }
);

</script>

<style scoped>

.profile-container {
  display: flex;
  justify-content: center;
  padding: 1.2rem 0.8rem;
}

.profile-wrapper {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.loading {
  text-align: center;
  color: var(--muted);
  font-size: 1rem;
}

.reviews-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--card);
  border-radius: var(--radius);
  padding: 1.2rem;
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
}

.reviews-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text);
}

.no-reviews {
  color: var(--muted);
  text-align: center;
  padding: 1rem 0;
}

@media (min-width: 700px) {
  .profile-container {
    padding: 2rem 1.5rem;
  }

  .reviews-section {
    padding: 1.5rem;
  }
}

@media (min-width: 1000px) {
  .profile-wrapper {
    gap: 2.5rem;
  }

  .reviews-section {
    padding: 2rem;
  }
}

</style>