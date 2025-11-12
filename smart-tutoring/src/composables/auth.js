// composables/auth.js
import { ref, watch } from 'vue'

const stored = localStorage.getItem('loggedIn') === 'true'
export const isLoggedIn = ref(stored)

watch(isLoggedIn, (val) => {
  localStorage.setItem('loggedIn', val)
})

export function login() { isLoggedIn.value = true }
export function logout() { isLoggedIn.value = false }
