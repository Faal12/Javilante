import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue' // <--- 1. Импортируем новую страницу
import MapPage from '../views/MapPage.vue'
import LevelPage from '../views/LevelPage.vue'
import ProfilePage from '../views/ProfilePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', // Главная страница теперь здесь
      name: 'home',
      component: HomePage
    },
    {
      path: '/map', // Карта переехала сюда
      name: 'map',
      component: MapPage
    },
    {
      path: '/level/:id',
      name: 'level',
      component: LevelPage
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage
    }
  ]
})

export default router