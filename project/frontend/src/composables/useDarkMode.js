import { ref, watchEffect } from 'vue'

const theme = ref(localStorage.getItem('st-theme') || 'light')

export default function useDarkMode() {
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  watchEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('st-theme', theme.value)
  })

  return { theme, toggleTheme }
}
