<template>
  <div class="profile-page">
    <div class="profile-card">
      <div class="avatar-section">
        <div class="avatar-circle">{{ store.avatar }}</div>
        <input v-model="store.playerName" class="name-input" />
      </div>

      <div class="stats-grid">
        <div class="stat-item gold">
          <span class="stat-icon">⭐</span>
          <span class="stat-value">{{ store.totalStars }}</span>
          <span class="stat-label">Gesamtsterne</span>
        </div>
        <div class="stat-item green">
          <span class="stat-icon">🚀</span>
          <span class="stat-value">{{ store.progressPercent }}%</span>
          <span class="stat-label">Fortschritt</span>
        </div>
      </div>

      <div class="achievements-list">
        <h3>Dein Weg:</h3>
        <div class="level-badge-container">
          <div 
            v-for="level in store.levels" 
            :key="level.id"
            class="level-badge"
            :class="{ 'locked': !level.unlocked, 'completed': level.completed }"
          >
            <span class="lvl-num">{{ level.id }}</span>
            <div class="lvl-stars" v-if="level.completed">
  <svg v-for="n in level.stars" :key="n" class="mini-star" viewBox="0 0 24 24">
    <path fill="#FFD700" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
  </svg>
</div>
          </div>
        </div>
      </div>

      <button class="reset-btn" @click="confirmReset">Neustart (Сброс)</button>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '@/stores/gameStore';

const store = useGameStore();

const confirmReset = () => {
  if(confirm("Bist du sicher? Весь прогресс будет удален!")) {
    store.resetProgress();
  }
};
</script>

<style scoped>
/* Стиль как в мобильных играх */
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap');

.profile-page {
  width: 100%;
  height: 100vh;
  background: #5dade2; /* Цвет воды */
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fredoka', sans-serif;
  overflow-y: auto; /* Разрешаем скролл, если экран маленький */
}

.profile-card {
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 30px;
  padding: 30px;
  box-shadow: 0 10px 0 rgba(0,0,0,0.1), 0 20px 40px rgba(0,0,0,0.2);
  text-align: center;
  border: 4px solid #fff;
}

.avatar-circle {
  width: 100px;
  height: 100px;
  background: #ffeb3b;
  border-radius: 50%;
  font-size: 50px;
  line-height: 100px;
  margin: 0 auto 10px;
  border: 4px solid #fbc02d;
  box-shadow: 0 4px 0 #f9a825;
}

.name-input {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  border: none;
  background: #f0f0f0;
  padding: 5px 10px;
  border-radius: 10px;
  color: #333;
  width: 80%;
}

.stats-grid {
  display: flex;
  gap: 15px;
  margin: 30px 0;
}

.stat-item {
  flex: 1;
  border-radius: 20px;
  padding: 15px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 5px 0 rgba(0,0,0,0.2);
}

.stat-item.gold { background: linear-gradient(135deg, #FFD700, #FFA500); }
.stat-item.green { background: linear-gradient(135deg, #7CFC00, #32CD32); }

.stat-value { font-size: 2rem; font-weight: 800; }
.stat-label { font-size: 0.9rem; opacity: 0.9; }

.level-badge-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
}

.level-badge {
  width: 50px;
  height: 50px;
  background: #ddd;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #777;
  font-weight: bold;
}

.level-badge.completed {
  background: #4caf50;
  color: white;
  box-shadow: 0 3px 0 #2e7d32;
}

.level-badge.locked {
  opacity: 0.5;
}

.lvl-stars { 
  display: flex; gap: 1px; margin-top: 2px; 
}
.mini-star {
  width: 10px; height: 10px;
  filter: drop-shadow(0 0 1px rgba(0,0,0,0.5));
}
.reset-btn {
  margin-top: 30px;
  background: #ff5252;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-family: inherit;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 0 #b71c1c;
}
.reset-btn:active { transform: translateY(4px); box-shadow: none; }
</style>