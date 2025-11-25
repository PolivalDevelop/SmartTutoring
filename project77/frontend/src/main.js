import "bootstrap/dist/css/bootstrap.css"
import "bootstrap"
import { createApp } from 'vue'
import './assets/styles/base.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from "./routes/router"
import SocketPlugin from './plugins/socket'

createApp(App)
  .use(router)
  .use(createPinia())
  .use(SocketPlugin)
  .mount('#app')
