// composables/auth.js
import { ref } from 'vue'

export const isLoggedIn = ref(false)
export const user = ref(null)


export function login(userdata) { 
  isLoggedIn.value = true 
  user.value = userdata
}
export function logout() { 
  isLoggedIn.value = false
  user.value = null
}
export function getCurrentUser() {
  return user;
}

export const matters = ref([]);

export function setMatter(newMatters) {
  matters.value = newMatters;
}

export function getMatters() {
  return matters.value;
}