<template>
  <div class="profile-page theme-cute">
    
    <div class="bg-decor">
      <div class="falling-petals">
        <span v-for="n in 15" :key="n" class="petal" :style="getPetalStyle(n)">🌸</span>
      </div>
      <div class="clouds">
        <div class="cloud c1">☁️</div>
        <div class="cloud c2">☁️</div>
      </div>
    </div>

    <div class="content-wrapper">
      
      <div class="profile-card bounce-in">
        <div class="card-header">
          <div class="header-badge">ID-KARTE</div>
        </div>

        <div class="card-body">
          <div class="avatar-section">
            <div class="avatar-wrapper" @click="showAvatarModal = true">
              <div class="avatar-circle">
                <img v-if="isImage(store.avatar)" :src="store.avatar" class="avatar-img" />
                <div v-else class="avatar-emoji">{{ store.avatar }}</div>
                
                <div class="edit-badge">✏️</div>
              </div>
              <div class="decor-ears">🍃</div>
            </div>
            
            <div class="player-info">
              <div class="rank-pill">{{ store.rank || 'Anfänger' }}</div>
              <input v-model="store.playerName" class="name-input" spellcheck="false" placeholder="Dein Name" />
            </div>
          </div>

          <div class="stats-row">
            <div class="stat-bubble gold">
              <div class="icon">⭐</div>
              <div class="value">{{ store.totalStars }}</div>
              <div class="label">Sterne</div>
            </div>
            <div class="stat-bubble blue">
              <div class="icon">🎓</div>
              <div class="value">{{ store.progressPercent }}%</div>
              <div class="label">Fortschritt</div>
            </div>
          </div>

          <div class="divider">
            <span>🌸 WEG DES NINJAS 🌸</span>
          </div>

          <div class="levels-scroll">
            <div 
              v-for="level in store.levels" 
              :key="level.id"
              class="level-row"
              :class="{ 'locked': !level.unlocked, 'completed': level.completed, 'boss': level.isBoss }"
            >
              <div class="lvl-icon">
                {{ level.isBoss ? '👹' : (level.completed ? '✅' : '🔒') }}
              </div>
              <div class="lvl-text">
                <div class="lvl-title">{{ level.title }}</div>
                <div class="lvl-stars" v-if="level.completed">
                  <span v-for="n in 3" :key="n" class="mini-star" :class="{ filled: n <= level.stars }">★</span>
                </div>
              </div>
            </div>
          </div>

          <button class="reset-btn" @click="confirmReset">
            Fortschritt zurücksetzen 🗑️
          </button>

        </div>
      </div>

    </div>

    <transition name="pop">
      <div v-if="showAvatarModal" class="modal-overlay" @click.self="showAvatarModal = false">
        <div class="modal-window">
          <div class="modal-title">Wähle deinen Helden!</div>
          <div class="avatars-grid">
            <button v-for="icon in emojiAvatars" :key="icon" class="avatar-option" @click="selectAvatar(icon)">
              {{ icon }}
            </button>
            <button v-if="pandaUrl" class="avatar-option img-option" @click="selectAvatar(pandaUrl)">
              <img :src="pandaUrl" />
            </button>
            <button v-if="bossUrl" class="avatar-option img-option" @click="selectAvatar(bossUrl)">
              <img :src="bossUrl" />
            </button>
          </div>
          <button class="close-btn" @click="showAvatarModal = false">Schließen</button>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { useGameStore } from '@/stores/gameStore';
import { ref, onMounted } from 'vue';

const store = useGameStore();
const showAvatarModal = ref(false);

const pandaUrl = ref('');
const bossUrl = ref('');

onMounted(() => {
  try {
    pandaUrl.value = new URL('@/assets/panda_idle.png', import.meta.url).href;
    bossUrl.value = new URL('@/assets/boss_idle.webp', import.meta.url).href;
  } catch (e) {
    console.error("Error loading assets:", e);
  }
});

const emojiAvatars = [
  '🐼', '🎋', '👺', '🌸', 
  '🎎', '🏮', '🍙', '🍣', 
  '🥢', '🐉', '🥷', '🧘'
];

const isImage = (val) => {
    if (!val) return false;
    return val.includes('/') || val.includes('http');
};

const selectAvatar = (val) => {
  store.avatar = val;
  showAvatarModal.value = false;
};

const confirmReset = () => {
  if(confirm("Bist du sicher? Dein ganzer Fortschritt wird gelöscht!")) {
    store.resetProgress();
  }
};

const getPetalStyle = (n) => ({
  left: Math.random() * 100 + '%',
  animationDelay: Math.random() * 5 + 's',
  animationDuration: 5 + Math.random() * 5 + 's'
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap');

.profile-page {
  width: 100%; min-height: 100vh;
  background: radial-gradient(circle at top, #fff9c4 0%, #ffccbc 100%);
  font-family: 'Fredoka', 'Kosugi Maru', sans-serif;
  color: #5d4037;
  padding-bottom: 80px;
  overflow-x: hidden;
}

.bg-decor { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.petal { position: absolute; top: -20px; font-size: 20px; animation: fall linear infinite; opacity: 0.7; }
.cloud { position: absolute; font-size: 4rem; opacity: 0.8; animation: floatCloud 20s linear infinite; }
.c1 { top: 10%; left: -10%; animation-duration: 25s; }
.c2 { top: 30%; left: -20%; animation-duration: 35s; animation-delay: 5s; }

.content-wrapper {
  position: relative; z-index: 10;
  display: flex; flex-direction: column; align-items: center;
  padding: 40px 20px;
  width: 100%; max-width: 500px; margin: 0 auto;
}

.profile-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 30px;
  border: 4px solid #fff;
  box-shadow: 0 10px 30px rgba(255, 145, 0, 0.15);
  overflow: hidden;
  animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card-header {
  background: #ffab91;
  padding: 15px; text-align: center;
  border-bottom: 4px solid #fff;
}
.header-badge {
  display: inline-block; background: #fff; color: #ff7043;
  padding: 5px 20px; border-radius: 20px; font-weight: bold;
  font-size: 1.1rem; box-shadow: 0 4px 0 rgba(0,0,0,0.05);
}

.card-body { padding: 30px 20px; }
.avatar-section { display: flex; flex-direction: column; align-items: center; margin-bottom: 30px; }
.avatar-wrapper { position: relative; cursor: pointer; transition: transform 0.2s; }
.avatar-wrapper:hover { transform: scale(1.05) rotate(2deg); }

.avatar-circle {
  width: 120px; height: 120px;
  background: #fff; border: 6px solid #4fc3f7;
  border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
  box-shadow: 0 8px 0 rgba(79, 195, 247, 0.3);
  overflow: hidden; position: relative;
}
.avatar-emoji { font-size: 4.5rem; }
.avatar-img { width: 100%; height: 100%; object-fit: cover; }

.edit-badge {
  position: absolute; bottom: 5px; right: 5px;
  background: #ffeb3b; width: 35px; height: 35px;
  border-radius: 50%; border: 3px solid #fff;
  display: flex; justify-content: center; align-items: center;
  font-size: 1.2rem; box-shadow: 0 3px 0 rgba(0,0,0,0.1);
}
.decor-ears { position: absolute; top: -15px; right: -10px; font-size: 2rem; transform: rotate(20deg); animation: float 3s infinite; }

.player-info { text-align: center; margin-top: 15px; width: 100%; }
.rank-pill {
  display: inline-block; background: #ab47bc; color: white;
  padding: 4px 15px; border-radius: 15px; font-size: 0.9rem;
  margin-bottom: 5px; box-shadow: 0 3px 0 rgba(0,0,0,0.1);
}
.name-input {
  width: 100%; text-align: center; font-size: 1.8rem;
  border: none; background: transparent; font-weight: bold;
  color: #5d4037; outline: none; font-family: 'Fredoka', sans-serif;
  border-bottom: 2px dashed #d7ccc8; padding-bottom: 5px;
  transition: border-color 0.2s;
}
.name-input:focus { border-color: #ff7043; }

.stats-row { display: flex; gap: 15px; justify-content: space-between; margin-bottom: 30px; }
.stat-bubble {
  flex: 1; padding: 15px; border-radius: 20px;
  display: flex; flex-direction: column; align-items: center;
  position: relative; top: 0; transition: top 0.2s;
}
.stat-bubble:hover { top: -5px; }
.stat-bubble.gold { background: #fff3e0; border: 3px solid #ffb74d; color: #f57c00; }
.stat-bubble.blue { background: #e1f5fe; border: 3px solid #4fc3f7; color: #0288d1; }

.stat-bubble .icon { font-size: 1.5rem; margin-bottom: 5px; }
.stat-bubble .value { font-size: 1.5rem; font-weight: bold; }
.stat-bubble .label { font-size: 0.8rem; opacity: 0.8; }
.divider { text-align: center; margin-bottom: 15px; opacity: 0.6; font-size: 0.9rem; letter-spacing: 1px; }
.levels-scroll {
  background: #fff; border: 3px solid #d7ccc8; border-radius: 15px;
  padding: 15px; max-height: 250px; overflow-y: auto;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
}
.level-row {
  display: flex; align-items: center; gap: 15px;
  padding: 12px; background: #fafafa; border-radius: 12px;
  margin-bottom: 8px; border: 2px solid transparent;
  transition: all 0.2s;
}
.level-row:last-child { margin-bottom: 0; }
.level-row.completed { border-color: #81c784; background: #e8f5e9; }
.level-row.locked { opacity: 0.6; filter: grayscale(1); }
.level-row.boss { border-color: #ef5350; background: #ffebee; }

.lvl-icon { font-size: 1.5rem; }
.lvl-title { font-weight: bold; font-size: 1rem; }
.lvl-stars { font-size: 0.9rem; color: #ffca28; }
.mini-star.filled { color: #ffb300; } 
.mini-star { color: #e0e0e0; }
.reset-btn {
  width: 100%; margin-top: 25px; padding: 15px;
  background: #eceff1; color: #90a4ae; border: none;
  border-radius: 15px; font-weight: bold; cursor: pointer;
  font-family: inherit; transition: all 0.2s;
}
.reset-btn:hover { background: #cfd8dc; color: #546e7a; }

.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  backdrop-filter: blur(5px); z-index: 100;
  display: flex; justify-content: center; align-items: center;
}
.modal-window {
  background: #fff; width: 90%; max-width: 400px;
  padding: 25px; border-radius: 30px; text-align: center;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  border: 5px solid #b2dfdb;
}
.modal-title { font-size: 1.5rem; font-weight: bold; margin-bottom: 20px; color: #009688; }
.avatars-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;
}
.avatar-option {
  width: 60px; height: 60px; border-radius: 50%;
  background: #f5f5f5; border: 2px solid #eee;
  font-size: 2rem; display: flex; justify-content: center; align-items: center;
  cursor: pointer; transition: transform 0.2s;
}
.avatar-option:hover { transform: scale(1.1) rotate(5deg); border-color: #26a69a; background: #e0f2f1; }
.img-option img { width: 100%; height: 100%; object-fit: contain; }

.close-btn {
  background: #4db6ac; color: white; border: none;
  padding: 12px 30px; border-radius: 20px; font-weight: bold;
  font-size: 1.1rem; cursor: pointer; box-shadow: 0 4px 0 #00897b;
  transition: transform 0.1s;
}
.close-btn:active { transform: translateY(4px); box-shadow: none; }

@keyframes fall { to { transform: translateY(100vh) rotate(360deg); } }
@keyframes floatCloud { from { transform: translateX(100vw); } to { transform: translateX(-100%); } }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes bounceIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }

.pop-enter-active, .pop-leave-active { transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.5); }
</style>