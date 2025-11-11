import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/./views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  // potrai aggiungere qui /accedi, /register, /profilo ecc.
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
