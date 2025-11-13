import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap';
import axios from "axios";

const app = createApp(App);
app.config.globalProperties.$socket = {};

axios.defaults.withCredentials = true;
