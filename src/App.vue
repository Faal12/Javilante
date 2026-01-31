<template>
  <header class="game-nav">
    
    <div class="nav-content">
      <div class="nav-container">
        <router-link to="/map" class="nav-btn" active-class="active">
          🌍 Karte
        </router-link>
        
        <router-link to="/" class="logo">Javilante</router-link>

        <router-link to="/profile" class="nav-btn" active-class="active">
          👤 Profil
        </router-link>
      </div>
    </div>

    <div class="nav-handle">
      <span class="handle-icon">II</span>
      <span class="handle-text">MENU</span>
    </div>

  </header>

  <main>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap');

/* --- ШАПКА-НЕВИДИМКА --- */
.game-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transform: translateY(-100%);
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.game-nav:hover {
  transform: translateY(0);
}

/* --- ВНУТРЕННОСТЬ МЕНЮ --- */
.nav-content {
  background: rgba(58, 46, 42, 0.95);
  border-bottom: 4px solid #d4a373;
  padding: 15px 0;
  box-shadow: 0 10px 20px rgba(0,0,0,0.5);
  backdrop-filter: blur(5px);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* --- ЯЗЫЧОК (HANDLE) --- */
.nav-handle {
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: #d4a373;
  width: 120px;
  height: 35px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 5px 10px rgba(0,0,0,0.3);
  color: #3a2e2a;
  font-family: 'Fredoka', sans-serif;
  font-weight: bold;
  font-size: 0.8rem;
  line-height: 1;
}

.handle-icon {
  font-size: 10px;
  margin-bottom: 2px;
  letter-spacing: 2px;
}

.game-nav:hover .nav-handle {
  background: #FFD700;
  color: #8B4513;
}

/* --- ЛОГОТИП (ОБНОВЛЕННЫЙ) --- */
.logo {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.8rem;
  font-weight: 900;
  color: #FFD700;
  text-shadow: 2px 2px 0 #8B4513;
  text-decoration: none; /* Убираем подчеркивание ссылки */
  cursor: pointer;
  transition: transform 0.2s;
}

.logo:hover {
  transform: scale(1.05); /* Эффект при наведении */
}

/* --- КНОПКИ МЕНЮ --- */
.nav-btn {
  text-decoration: none;
  background: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-family: 'Fredoka', sans-serif;
  font-weight: bold;
  color: #555;
  box-shadow: 0 4px 0 #ccc;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.nav-btn:hover {
  transform: translateY(-2px);
  background: #fff;
  border-color: #FFD700;
}

.nav-btn:active {
  transform: translateY(2px);
  box-shadow: none;
}

.nav-btn.active {
  background: #FFD700;
  color: #8B4513;
  box-shadow: 0 4px 0 #b8860b;
}

/* Анимации страниц */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>