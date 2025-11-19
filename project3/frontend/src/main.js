import "bootstrap/dist/css/bootstrap.css"
import "bootstrap"
import { createApp } from 'vue'
import './assets/styles/base.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from "./routes/router"

createApp(App)
  .use(router)
  .use(createPinia())
  .mount('#app')
