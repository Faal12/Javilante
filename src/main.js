import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n' 
import App from './App.vue'
import router from './router'
import './assets/main.css'
import de from './locales/de.json'

const app = createApp(App)
const i18n = createI18n({
  legacy: false, 
  locale: 'de',  
  fallbackLocale: 'de',
  messages: {
    de
  }
})

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')