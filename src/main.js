import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n' // 1. Импортируем i18n
import App from './App.vue'
import router from './router'
import './assets/main.css'

// 2. Импортируем файл с переводами (убедитесь, что он существует по этому пути)
import de from './locales/de.json'

const app = createApp(App)

// 3. Создаем экземпляр i18n
const i18n = createI18n({
  legacy: false, // Обязательно false для Composition API (script setup)
  locale: 'de',  // Язык по умолчанию
  fallbackLocale: 'de',
  messages: {
    de
  }
})

app.use(createPinia())
app.use(router)
app.use(i18n) // 4. Подключаем i18n к приложению

app.mount('#app')