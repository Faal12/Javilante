<template>
  <div class="viewport" ref="viewportRef">
    
    <svg style="width:0;height:0;position:absolute;" aria-hidden="true">
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFD700" />
          <stop offset="100%" stop-color="#FFA000" />
        </linearGradient>
      </defs>
    </svg>

    <div class="hud">
      <div class="hud-panel star-panel">
        <svg class="star-svg-icon" viewBox="0 0 24 24">
           <path fill="url(#goldGradient)" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
        </svg>
        <span class="hud-text">{{ store.totalStars }}</span>
      </div>
      
      <div class="hud-panel progress-panel">
        <span class="hud-label">Fortschritt</span>
        <div class="progress-bar-container">
          <div class="progress-fill" :style="{ width: store.progressPercent + '%' }">
             <div class="progress-shine"></div>
          </div>
        </div>
        <span class="percent-text">{{ store.progressPercent }}%</span>
      </div>
    </div>

    <div 
      class="game-world" 
      ref="worldRef"
      @mousedown="startDrag" @touchstart="startDrag" 
      @mousemove="onDrag" @touchmove="onDrag"
      @mouseup="stopDrag" @touchend="stopDrag"
      @mouseleave="stopDrag"
      :style="{ transform: `translate(${pX}px, ${pY}px) scale(${scale})` }"
    >
      <div class="world-bg"></div>

      <svg class="connections">
        <line 
          v-for="(level, index) in store.levels.slice(0, -1)" 
          :key="'line-'+index"
          :x1="level.x + 50" :y1="level.y + 35"
          :x2="store.levels[index+1].x + 50" :y2="store.levels[index+1].y + 35"
          class="path-line"
        />
      </svg>

      <div 
        class="mascot-container"
        :style="pandaStyle"
        @transitionend="onMovementEnd"
      >
        <MascotFigure :isWalking="isPandaWalking" />
      </div>

      <div 
        v-for="level in store.levels" 
        :key="level.id"
        class="level-node"
        :class="{ 
          'locked': !level.unlocked, 
          'completed': level.completed,
          'current': level.unlocked && !level.completed,
          'boss': level.isBoss 
        }"
        :style="{ left: level.x + 'px', top: level.y + 'px' }"
        @click="handleNodeClick(level)"
      >
        <div class="platform-body">
           <div class="platform-surface">
              <span v-if="!level.unlocked" class="icon lock-icon">🔒</span>
              <span v-else-if="level.isBoss" class="icon boss-icon">☠️</span>
              <span v-else class="level-number">{{ level.id }}</span>
           </div>
        </div>

        <div class="stars-display" v-if="level.unlocked && !level.isBoss">
           <svg v-for="n in 3" :key="n" class="level-star" :class="{ filled: n <= level.stars }" viewBox="0 0 24 24">
             <path class="star-path" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
           </svg>
        </div>
        
        <div class="tooltip">{{ level.title }}</div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="lockedMessage" class="locked-toast">
        <span class="toast-icon">⚠️</span> {{ lockedMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore';
import MascotFigure from '@/components/MascotFigure.vue';

const router = useRouter();
const store = useGameStore();

const MAP_WIDTH = 2400;
const MAP_HEIGHT = 1792;
const viewportRef = ref(null); 
const worldRef = ref(null);

// Координаты камеры
const pX = ref(0);
const pY = ref(0);
const scale = ref(1); // Масштаб для "зума"

const isPandaWalking = ref(false);
const targetLevelId = ref(null);
const lockedMessage = ref("");
const pandaVisX = ref(0);
const pandaVisY = ref(0);

// --- НАСТРОЙКИ КООРДИНАТ ---
const OFFSET_X = -20; 
const OFFSET_Y = -160;

// === РАСЧЕТ МАСШТАБА И ГРАНИЦ ===
const updateLayout = () => {
  if (!viewportRef.value) return;
  const vw = viewportRef.value.clientWidth;
  
  // Адаптивный зум:
  // На больших экранах (1920px) масштаб ~1.0
  // На мобильных (400px) масштаб ~0.5 (чтобы видеть больше карты, а не один пиксель)
  // Ограничиваем минимум 0.5, максимум 1.0
  scale.value = Math.min(Math.max(vw / 1600, 0.5), 1.0);

  clampCamera();
};

const clampCamera = () => {
  if (!viewportRef.value) return;
  const vw = viewportRef.value.clientWidth;
  const vh = viewportRef.value.clientHeight;
  
  // Реальные размеры карты с учетом масштаба
  const scaledMapW = MAP_WIDTH * scale.value;
  const scaledMapH = MAP_HEIGHT * scale.value;

  // Если карта меньше экрана (по ширине), центрируем её
  if (scaledMapW < vw) {
    pX.value = (vw - scaledMapW) / 2;
  } else {
    // Иначе не даем уйти за границы (стандартный clamp)
    // max X = 0, min X = vw - scaledMapW
    pX.value = Math.min(0, Math.max(pX.value, vw - scaledMapW));
  }

  // Аналогично для высоты
  if (scaledMapH < vh) {
    pY.value = (vh - scaledMapH) / 2;
  } else {
    pY.value = Math.min(0, Math.max(pY.value, vh - scaledMapH));
  }
};

const centerOnActiveLevel = () => {
  // Находим текущий уровень (последний открытый)
  const levelId = store.currentLevelId;
  const level = store.levels.find(l => l.id === levelId) || store.levels[0];
  
  if (!viewportRef.value || !level) return;

  const vw = viewportRef.value.clientWidth;
  const vh = viewportRef.value.clientHeight;

  // Координаты центра уровня на карте (без масштаба)
  const targetX = level.x + 50; 
  const targetY = level.y + 35;

  // Формула центрирования: Половина экрана - (Координата * Масштаб)
  pX.value = (vw / 2) - (targetX * scale.value);
  pY.value = (vh / 2) - (targetY * scale.value);

  // Применяем границы, чтобы не показать пустоту
  clampCamera();
  
  // Сохраняем в стор
  store.setCamera(pX.value, pY.value);
};

// === ПАНДА ===
const updatePandaCoords = (level) => {
  pandaVisX.value = level.x + OFFSET_X;
  pandaVisY.value = level.y + OFFSET_Y;
};

const initPanda = () => {
  const startId = store.currentLevelId || 1;
  const currentLvl = store.levels.find(l => l.id === startId) || store.levels[0];
  if (currentLvl) updatePandaCoords(currentLvl);
};

const pandaStyle = computed(() => ({
  left: pandaVisX.value + 'px',
  top: pandaVisY.value + 'px',
  transition: isPandaWalking.value ? 'all 1.0s linear' : 'none',
  zIndex: 100 
}));

const handleNodeClick = (level) => {
  if (isPandaWalking.value) return;

  const isAtTarget = Math.abs((level.x + OFFSET_X) - pandaVisX.value) < 1 && 
                     Math.abs((level.y + OFFSET_Y) - pandaVisY.value) < 1;

  if (isAtTarget) {
    checkAndEnterLevel(level);
  } else {
    targetLevelId.value = level.id;
    isPandaWalking.value = true;
    updatePandaCoords(level);
  }
};

const onMovementEnd = () => {
  if (!isPandaWalking.value) return;
  isPandaWalking.value = false;
  const level = store.levels.find(l => l.id === targetLevelId.value);
  if (level) checkAndEnterLevel(level);
};

const checkAndEnterLevel = (level) => {
  if (level.unlocked) {
    setTimeout(() => {
        store.setCamera(pX.value, pY.value);
        router.push(`/level/${level.id}`);
    }, 200);
  } else {
    lockedMessage.value = "Level gesperrt! 🔒";
    setTimeout(() => lockedMessage.value = "", 2000);
  }
};

// === DRAG LOGIC ===
let isDragging = false;
let startX = 0, startY = 0, initialPX = 0, initialPY = 0;

const startDrag = (e) => {
  if (e.type === 'mousedown' && e.button !== 0) return;
  isDragging = true;
  const c = e.touches ? e.touches[0] : e;
  startX = c.clientX; startY = c.clientY;
  initialPX = pX.value; initialPY = pY.value;
  if(worldRef.value) worldRef.value.style.cursor = 'grabbing';
};

const onDrag = (e) => {
  if (!isDragging) return;
  if(e.cancelable) e.preventDefault();
  const c = e.touches ? e.touches[0] : e;
  
  // Просто добавляем смещение мыши. 
  // Так как мы двигаем весь контейнер (translate), масштаб не влияет на "ощущение" движения мыши 1 к 1.
  pX.value = initialPX + (c.clientX - startX);
  pY.value = initialPY + (c.clientY - startY);
  
  clampCamera();
};

const stopDrag = () => {
  isDragging = false;
  if(worldRef.value) worldRef.value.style.cursor = 'grab';
  store.setCamera(pX.value, pY.value);
};

onMounted(() => {
  window.addEventListener('resize', updateLayout);
  
  // Сначала инициализируем панду
  initPanda();
  
  // Затем рассчитываем размеры экрана и масштаб
  updateLayout();
  
  // И наконец центрируем камеру на панде (активном уровне)
  // Небольшой таймаут, чтобы DOM успел отрисоваться для точных размеров
  setTimeout(() => {
    centerOnActiveLevel();
  }, 10);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateLayout);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap');

/* Базовые стили */
.viewport { 
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
  overflow: hidden; background-color: #2c3e50; 
  user-select: none; font-family: 'Fredoka', sans-serif; 
}

.hud { position: absolute; top: 30px; left: 20px; right: 20px; z-index: 90; display: flex; justify-content: space-between; pointer-events: none; }
.hud-panel { background: rgba(62, 39, 35, 0.9); border: 2px solid rgba(255, 215, 0, 0.4); border-radius: 25px; padding: 8px 20px; color: #ffd700; display: flex; align-items: center; box-shadow: 0 10px 25px rgba(0,0,0,0.4); pointer-events: auto; }
.star-svg-icon { width: 30px; height: 30px; margin-right: 10px; filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.7)); }
.hud-text { font-size: 1.5rem; font-weight: bold; }
.progress-bar-container { width: 200px; height: 15px; background: rgba(0,0,0,0.6); border-radius: 10px; margin: 0 15px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; position: relative; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #76ff03, #00e676); box-shadow: 0 0 15px #76ff03; transition: width 0.5s ease-out; }
.progress-shine { position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent); animation: shineLoad 2s infinite; }
@keyframes shineLoad { from {transform: translateX(-100%);} to {transform: translateX(100%);}}

.game-world { 
  width: 2400px; height: 1792px; 
  position: absolute; cursor: grab; 
  /* ВАЖНО: Точка трансформации сверху-слева для корректной работы координат при масштабировании */
  transform-origin: 0 0; 
  will-change: transform;
}
.game-world:active { cursor: grabbing; }

.world-bg { width: 100%; height: 100%; position: absolute; top: 0; left: 0; background-image: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url('@/views/background.png'); background-size: cover; z-index: 0; }
.connections { position: absolute; width: 100%; height: 100%; z-index: 1; pointer-events: none; }
.path-line { stroke: #fff; stroke-width: 8; stroke-linecap: round; fill: none; opacity: 0.6; stroke-dasharray: 15, 20; filter: drop-shadow(0 4px 4px rgba(0,0,0,0.5)); }

/* === 3D ПЛАТФОРМЫ === */
.level-node {
  position: absolute;
  width: 100px; height: 70px;
  z-index: 5;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.level-node:hover { transform: scale(1.1) translateY(-5px); z-index: 6; }

.platform-body { width: 100%; height: 100%; position: relative; }

.platform-surface {
  width: 100%; height: 100%; border-radius: 50%;
  background: radial-gradient(circle at 50% 30%, #ffd54f, #f57f17);
  border: 4px solid #fff;
  box-shadow: 0 8px 0 #bf360c, 0 15px 10px rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; font-weight: 800; color: #5d4037;
  text-shadow: 0 1px 0 rgba(255,255,255,0.4);
  position: relative; z-index: 2;
}

.level-node.locked .platform-surface {
  background: radial-gradient(circle at 50% 30%, #cfd8dc, #607d8b);
  border-color: #eceff1; color: #546e7a;
  box-shadow: 0 8px 0 #455a64, 0 15px 10px rgba(0,0,0,0.4);
}

.level-node.boss { width: 120px; height: 85px; }
.level-node.boss .platform-surface {
  background: radial-gradient(circle at 50% 30%, #ef5350, #c62828);
  border-color: #ffcdd2; color: #fff;
  box-shadow: 0 10px 0 #8e0000, 0 20px 15px rgba(0,0,0,0.5);
}

.level-node.current .platform-surface {
  animation: bouncePlatform 2s infinite ease-in-out;
  border-color: #fff;
}
@keyframes bouncePlatform {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.stars-display { position: absolute; top: -30px; display: flex; gap: 4px; z-index: 10; transform: translateY(0); }
.level-star { width: 20px; height: 20px; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5)); }
.level-star:nth-child(2) { margin-bottom: 8px; }
.star-path { fill: #455a64; stroke: #263238; stroke-width: 1.5px; }
.level-star.filled .star-path { fill: url(#goldGradient); stroke: #e65100; }

.tooltip { position: absolute; top: -60px; background: rgba(62, 39, 35, 0.95); color: #ffd700; padding: 6px 12px; border-radius: 12px; font-weight: bold; opacity: 0; pointer-events: none; white-space: nowrap; border: 1px solid rgba(255, 215, 0, 0.4); box-shadow: 0 5px 15px rgba(0,0,0,0.4); transition: opacity 0.3s; z-index: 20; }
.level-node:hover .tooltip { opacity: 1; }
.mascot-container { position: absolute; pointer-events: none; z-index: 100; }
.locked-toast { position: fixed; bottom: 60px; left: 50%; transform: translateX(-50%); background: rgba(198, 40, 40, 0.95); color: white; padding: 15px 30px; border-radius: 30px; font-size: 1.2rem; font-weight: bold; box-shadow: 0 10px 20px rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.2); z-index: 200; display: flex; align-items: center; gap: 10px; }
</style>