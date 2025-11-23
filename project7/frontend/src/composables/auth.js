// composables/auth.js
import { ref, watch } from 'vue'

export const isLoggedIn = ref(localStorage.getItem('loggedIn') === 'true')


watch(isLoggedIn, (val) => {
  localStorage.setItem('loggedIn', val)
})

export function login(user) { 
  isLoggedIn.value = true 
  if (user) localStorage.setItem('user', JSON.stringify(user))
}
export function logout() { 
  isLoggedIn.value = false
  localStorage.removeItem('loggedIn')
  localStorage.removeItem('user')
}
export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('user')) || null
}

export const matters = ref([]);

export function setMatter(newMatters) {
  matters.value = newMatters;
}

export function getMatters() {
  return matters.value;
}