import { createApp } from 'vue'
import { createPinia } from 'pinia' // <--- 1. Импортируем Pinia
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia()) // <--- 2. Подключаем Pinia ПЕРЕД роутером
app.use(router)

app.mount('#app')