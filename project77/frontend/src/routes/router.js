import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import ProfileView from '@/views/ProfileView.vue'
import BookedView from '@/views/BookedView.vue'
import OfferedView from '@/views/OfferedView.vue'
import { useUser } from '@/composables/useUser.js'


const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { showFilters: true } },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/login', name: 'login', component: LoginView },
  {
    path: '/profile',
    redirect: () => {
      const { currentUser } = useUser()
      return currentUser.value
        ? `/profile/${currentUser.value.email}`
        : '/login'
    }
  },
  { path: '/profile/:email', name: 'profile', component: ProfileView },
  { path: '/booked', name: 'booked', component: BookedView, meta: { showFilters: true } },
  { path: '/offered', name: 'offered', component: OfferedView, meta: { showFilters: true } }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
