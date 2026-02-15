
<template>
  <div class="viewport" ref="viewportRef">
    

    <div
      class="map-transition"
      :class="{
        active: overlayActive,
        right: overlayDirection === 'right',
        left: overlayDirection === 'left'
      }"
      @animationend="onOverlayAnimationEnd"
    >
      <div class="cloud-swipe">
        <div class="cloud-pack left-pack">
          <div class="cloud cloud-1"></div>
          <div class="cloud cloud-2"></div>
          <div class="cloud cloud-3"></div>
          <div class="cloud cloud-4"></div>
        </div>

        <div class="cloud-pack right-pack">
          <div class="cloud cloud-5"></div>
          <div class="cloud cloud-6"></div>
          <div class="cloud cloud-7"></div>
          <div class="cloud cloud-8"></div>
        </div>

        <div class="wipe-fog"></div>

        <div class="dojo-stamp">
          <div class="stamp-inner">
            <div class="stamp-title">{{ mapTitle }}</div>
            <div class="stamp-sub">章 (Kapitel)</div>
          </div>
        </div>
      </div>
    </div>

    <svg style="width:0;height:0;position:absolute;" aria-hidden="true">
      <defs>
        <radialGradient id="cartoonGold" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#FFF9C4" /> <stop offset="40%" stop-color="#FFD54F" /> <stop offset="100%" stop-color="#FF6F00" />
        </radialGradient>
        <radialGradient id="cartoonSilver" cx="40%" cy="30%" r="70%">
           <stop offset="0%" stop-color="#FAFAFA" /> <stop offset="40%" stop-color="#E0E0E0" /> <stop offset="100%" stop-color="#9E9E9E" />
        </radialGradient>
        <linearGradient id="hudGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFD700" /> <stop offset="100%" stop-color="#FFA000" />
        </linearGradient>
        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="rgba(0,0,0,0.4)"/>
        </filter>
      </defs>
    </svg>

    <div class="hud hud-bottom">
      <div class="hud-left">
        <div class="hud-panel star-panel">
          <svg class="star-svg-icon" viewBox="0 0 24 24">
             <path fill="url(#hudGold)" stroke="#BF360C" stroke-width="0.5" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
          </svg>
          <span class="hud-text">{{ store.totalStars }}</span>
        </div>

        <div class="hud-panel map-switch">
          <button
            class="map-btn"
            :class="{ active: store.currentMapId === 1 }"
            @click="switchMap(1)"
          >
            🌸 Map 1
          </button>

          <button
            class="map-btn"
            :class="{ active: store.currentMapId === 2, locked: !store.map2Unlocked }"
            :disabled="!store.map2Unlocked"
            @click="switchMap(2)"
            :title="store.map2Unlocked ? '' : 'Map 2 ist noch gesperrt'"
          >
            🍃 Map 2
          </button>
        </div>
      </div>

      <div class="hud-right">
        <div class="hud-panel progress-panel">
          <span class="hud-label hide-mobile">Fortschritt</span>
          <div class="progress-bar-container">
            <div class="progress-fill" :style="{ width: store.progressPercent + '%' }">
               <div class="progress-shine"></div>
            </div>
          </div>
          <span class="percent-text">{{ store.progressPercent }}%</span>
        </div>

        <div class="hud-panel map-pill">
          <span class="map-dot" :class="{ m2: store.currentMapId === 2 }"></span>
          <span class="hud-text small">{{ mapTitle }}</span>
        </div>
      </div>
    </div>

    <div
      class="game-world"
      ref="worldRef"
      @mousedown="startDrag" @touchstart="startDrag"
      @mousemove="onDrag" @touchmove="onDrag"
      @mouseup="stopDrag" @touchend="stopDrag"
      @mouseleave="stopDrag"
      :style="worldStyle"
      :class="{ 'disable-input': overlayActive }"
    >
      <div class="world-bg" :class="mapThemeClass" :style="{ backgroundImage: `url(${activeBgUrl})` }"></div>

      <svg class="connections" :width="MAP_WIDTH" :height="MAP_HEIGHT">
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
        @transitionend="onTransitionEnd"
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
           <div class="platform-surface" :class="mapThemeClass">
              <span v-if="!level.unlocked" class="icon lock-icon">🔒</span>
              <span v-else-if="level.isBoss" class="icon boss-icon">☠️</span>
              <span v-else class="level-number">{{ level.id }}</span>
           </div>
        </div>

        <div class="stars-display" v-if="level.unlocked && !level.isBoss">
           <svg v-for="n in 3" :key="n" class="level-star" :class="{ filled: n <= level.stars }" viewBox="0 0 24 24" filter="url(#softShadow)">
             <path class="star-body" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
             <path class="star-facet" d="M12,2 L9.19,8.62 L2,9.24 L7.45,13.97 L5.82,21 L12,17.27 Z" />
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
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore';
import MascotFigure from '@/components/MascotFigure.vue';
import bgUrlMap1 from '@/views/background1.png';
import bgUrlMap2 from '@/views/background2.png';

const router = useRouter();
const store = useGameStore();

const MAP_WIDTH = 2752;
const MAP_HEIGHT = 1536;

const viewportRef = ref(null);
const worldRef = ref(null);

const pX = ref(0);
const pY = ref(0);
const scale = ref(1);

const isPandaWalking = ref(false);
const lockedMessage = ref("");
const pandaVisX = ref(0);
const pandaVisY = ref(0);
const pandaTransitionDuration = ref(0);

const moveQueue = ref([]);
const isMoving = ref(false);

const OFFSET_X = -20;
const OFFSET_Y = -160;
const MOVEMENT_SPEED = 400;

const currentPandaLevelId = ref(1);


const mapThemeClass = computed(() => (store.currentMapId === 2 ? 'map2' : 'map1'));
const mapTitle = computed(() => (store.currentMapId === 2 ? 'Karte 2: OOP-Dojo' : 'Karte 1: Sakura-Weg'));

const activeBgUrl = computed(() => {
  if (store.currentMapId === 2) {
    return bgUrlMap2;
  }
  return bgUrlMap1;
});

const worldStyle = computed(() => ({
  width: `${MAP_WIDTH}px`,
  height: `${MAP_HEIGHT}px`,
  transform: `translate(${pX.value}px, ${pY.value}px) scale(${scale.value})`
}));

const updateLayout = () => {
  if (!viewportRef.value) return;
  const vw = viewportRef.value.clientWidth;
  scale.value = Math.min(Math.max(vw / 1600, 0.45), 1.2);
  clampCamera();
};

const clampCamera = () => {
  if (!viewportRef.value) return;
  const vw = viewportRef.value.clientWidth;
  const vh = viewportRef.value.clientHeight;
  const scaledMapW = MAP_WIDTH * scale.value;
  const scaledMapH = MAP_HEIGHT * scale.value;

  if (scaledMapW < vw) pX.value = (vw - scaledMapW) / 2;
  else pX.value = Math.min(0, Math.max(pX.value, vw - scaledMapW));

  if (scaledMapH < vh) pY.value = (vh - scaledMapH) / 2;
  else pY.value = Math.min(0, Math.max(pY.value, vh - scaledMapH));
};

const centerOnActiveLevel = () => {
  const levelId = currentPandaLevelId.value;
  const level = store.levels.find(l => l.id === levelId) || store.levels[0];
  if (!viewportRef.value || !level) return;

  const vw = viewportRef.value.clientWidth;
  const vh = viewportRef.value.clientHeight;
  const targetX = level.x + 50;
  const targetY = level.y + 35;

  pX.value = (vw / 2) - (targetX * scale.value);
  pY.value = (vh / 2) - (targetY * scale.value);
  clampCamera();
  store.setCamera(pX.value, pY.value);
};

const initPanda = () => {
  const startId = store.currentLevelId || 1;
  currentPandaLevelId.value = startId;

  const currentLvl = store.levels.find(l => l.id === startId) || store.levels[0];
  if (currentLvl) {
    pandaVisX.value = currentLvl.x + OFFSET_X;
    pandaVisY.value = currentLvl.y + OFFSET_Y;
  }
};

const pandaStyle = computed(() => ({
  left: pandaVisX.value + 'px',
  top: pandaVisY.value + 'px',
  transition: isMoving.value
    ? `left ${pandaTransitionDuration.value}s linear, top ${pandaTransitionDuration.value}s linear`
    : 'none',
  zIndex: 100
}));

const handleNodeClick = (level) => {
  if (overlayActive.value) return;
  if (isMoving.value) return;

  const startId = currentPandaLevelId.value;
  const endId = level.id;

  if (startId === endId) {
    checkAndEnterLevel(level);
    return;
  }

  let path = [];

  if (endId > startId) {
    for (let i = startId; i < endId; i++) {
      const nextLvl = store.levels.find(l => l.id === i + 1);
      if (nextLvl) {
        if (nextLvl.waypoints) path.push(...nextLvl.waypoints);
        path.push({ x: nextLvl.x, y: nextLvl.y });
      }
    }
  } else {
    for (let i = startId; i > endId; i--) {
      const currentLvl = store.levels.find(l => l.id === i);
      if (currentLvl && currentLvl.waypoints) path.push(...[...currentLvl.waypoints].reverse());
      const prevLvl = store.levels.find(l => l.id === i - 1);
      if (prevLvl) path.push({ x: prevLvl.x, y: prevLvl.y });
    }
  }

  startMovementSequence(path, endId);
};

const startMovementSequence = (points, finalLevelId) => {
  moveQueue.value = points;
  isPandaWalking.value = true;
  isMoving.value = true;
  processNextPoint();
  moveQueue.value.finalLevelId = finalLevelId;
};

const processNextPoint = async () => {
  if (moveQueue.value.length === 0) {
    isMoving.value = false;
    isPandaWalking.value = false;
    currentPandaLevelId.value = moveQueue.value.finalLevelId;

    const targetLevel = store.levels.find(l => l.id === currentPandaLevelId.value);
    checkAndEnterLevel(targetLevel);
    return;
  }

  const point = moveQueue.value.shift();
  const targetX = point.x + OFFSET_X;
  const targetY = point.y + OFFSET_Y;

  const dist = Math.hypot(targetX - pandaVisX.value, targetY - pandaVisY.value);
  const duration = Math.max(dist / MOVEMENT_SPEED, 0.1);

  pandaTransitionDuration.value = duration;
  await nextTick();

  pandaVisX.value = targetX;
  pandaVisY.value = targetY;
};

const onTransitionEnd = () => {
  if (isMoving.value) processNextPoint();
};

const checkAndEnterLevel = (level) => {
  if (!level) return;

  if (level.unlocked) {
    setTimeout(() => {
      store.setCamera(pX.value, pY.value);
      router.push(`/level/${level.id}`);
    }, 200);
  } else {
    lockedMessage.value = "Level gesperrt! 🔒";
    setTimeout(() => (lockedMessage.value = ""), 2000);
  }
};

let isDragging = false;
let startX = 0, startY = 0, initialPX = 0, initialPY = 0;

const startDrag = (e) => {
  if (overlayActive.value) return;
  if (e.type === 'mousedown' && e.button !== 0) return;
  isDragging = true;
  const c = e.touches ? e.touches[0] : e;
  startX = c.clientX; startY = c.clientY;
  initialPX = pX.value; initialPY = pY.value;
  if (worldRef.value) worldRef.value.style.cursor = 'grabbing';
};

const onDrag = (e) => {
  if (!isDragging) return;
  if (e.cancelable) e.preventDefault();
  const c = e.touches ? e.touches[0] : e;
  pX.value = initialPX + (c.clientX - startX);
  pY.value = initialPY + (c.clientY - startY);
  clampCamera();
};

const stopDrag = () => {
  isDragging = false;
  if (worldRef.value) worldRef.value.style.cursor = 'grab';
  store.setCamera(pX.value, pY.value);
};

function switchMap(id) {
  if (overlayActive.value) return;
  if (typeof store.requestMapSwitch === 'function') store.requestMapSwitch(id);
}
const overlayActive = ref(false);
const overlayDirection = ref('right');
const overlayHandled = ref(false);
let midSwitchTimer = null;

const runMapTransitionIfNeeded = async () => {
  overlayHandled.value = false;
  isMoving.value = false;
  isPandaWalking.value = false;
  moveQueue.value = [];

  overlayActive.value = true;
  clearTimeout(midSwitchTimer);
  midSwitchTimer = setTimeout(async () => {
    if (!store.mapTransition?.active) return;
    store.finishMapTransition();
    await nextTick();
    initPanda();
    await nextTick();
    updateLayout();
    setTimeout(() => centerOnActiveLevel(), 50);
  }, 520);

  await nextTick();
};

const onOverlayAnimationEnd = () => {
  if (overlayHandled.value) return;
  overlayHandled.value = true;

  overlayActive.value = false;
};

watch(
  () => store.mapTransition?.active,
  (active) => {
    if (active) {
      overlayDirection.value = store.mapTransition?.direction || 'right';
      runMapTransitionIfNeeded();
    }
  }
);

watch(
  () => store.currentMapId,
  async () => {
    await nextTick();
    initPanda();
    await nextTick();
    updateLayout();
    setTimeout(() => centerOnActiveLevel(), 50);
  }
);

onMounted(async () => {
  window.addEventListener('resize', updateLayout);

  initPanda();
  await nextTick();
  updateLayout();
  setTimeout(() => centerOnActiveLevel(), 50);

  if (store.mapTransition?.active) {
    overlayDirection.value = store.mapTransition?.direction || 'right';
    runMapTransitionIfNeeded();
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateLayout);
  clearTimeout(midSwitchTimer);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap');

.viewport {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  overflow: hidden;
  background-color: #1a1a1a;
  user-select: none;
  font-family: 'Fredoka', sans-serif;
}

.map-transition {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0;
}
.map-transition.active { opacity: 1; }

.cloud-swipe {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: radial-gradient(circle at 50% 40%, rgba(255,255,255,0.92), rgba(255,255,255,0.65), rgba(255,255,255,0.0));
}

.cloud-pack {
  position: absolute;
  top: 0;
  width: 55%;
  height: 100%;
  display: block;
}
.left-pack { left: 0; transform: translateX(-115%); }
.right-pack { right: 0; transform: translateX(115%); }

.map-transition.active.right .left-pack,
.map-transition.active.right .right-pack,
.map-transition.active.left .left-pack,
.map-transition.active.left .right-pack {
  animation: cloudCoverSplit 1200ms cubic-bezier(0.25, 0.8, 0.2, 1) forwards;
}

@keyframes cloudCoverSplit {
  0%   { transform: translateX(var(--start, 0)); }
  45%  { transform: translateX(0%); }
  60%  { transform: translateX(0%); }
  100% { transform: translateX(var(--end, 0)); }
}

.left-pack {
  --start: -115%;
  --end: -115%;
}
.right-pack {
  --start: 115%;
  --end: 115%;
}

.cloud {
  position: absolute;
  width: 440px; height: 240px;
  border-radius: 999px;
  background: radial-gradient(circle at 35% 35%, #ffffff, rgba(255,255,255,0.78), rgba(255,255,255,0.28));
  filter: blur(0.2px);
  box-shadow: 0 24px 70px rgba(0,0,0,0.10);
}
.cloud::before,
.cloud::after {
  content: "";
  position: absolute;
  border-radius: 999px;
  background: radial-gradient(circle at 35% 35%, #ffffff, rgba(255,255,255,0.78), rgba(255,255,255,0.25));
}
.cloud::before { width: 240px; height: 170px; left: 40px; top: -45px; }
.cloud::after  { width: 190px; height: 150px; left: 220px; top: -25px; }

.cloud-1 { top: 10%; left: 6%; transform: scale(1.15); }
.cloud-2 { top: 30%; left: 18%; transform: scale(0.95); }
.cloud-3 { top: 54%; left: 8%; transform: scale(1.2); }
.cloud-4 { top: 72%; left: 20%; transform: scale(1.05); }

.cloud-5 { top: 12%; right: 6%; transform: scale(1.2); }
.cloud-6 { top: 34%; right: 18%; transform: scale(0.95); }
.cloud-7 { top: 56%; right: 10%; transform: scale(1.25); }
.cloud-8 { top: 74%; right: 22%; transform: scale(1.05); }

.wipe-fog {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(255,255,255,0.0), rgba(255,255,255,0.95), rgba(255,255,255,0.0));
  mix-blend-mode: screen;
  opacity: 0.85;
}

.dojo-stamp {
  position: absolute;
  left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  width: 240px; height: 240px;
  border-radius: 999px;
  background: rgba(198, 40, 40, 0.92);
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 6px solid rgba(255,255,255,0.85);
}
.stamp-inner {
  width: 200px; height: 200px;
  border-radius: 999px;
  border: 3px dashed rgba(255,255,255,0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-align: center;
  padding: 12px;
}
.stamp-title { font-weight: 800; font-size: 1.05rem; line-height: 1.15; }
.stamp-sub { margin-top: 6px; opacity: 0.85; font-weight: 700; }

.hud {
  position: absolute;
  z-index: 90;
  pointer-events: none;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  left: 20px; right: 20px;
}
.hud-bottom {
  bottom: 18px;
  top: auto;
  justify-content: space-between;
  align-items: flex-end;
}
.hud-left, .hud-right {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  pointer-events: none;
}
.hud-panel {
  background: rgba(62, 39, 35, 0.9);
  border: 2px solid rgba(255, 215, 0, 0.4);
  border-radius: 25px;
  padding: 8px 16px;
  color: #ffd700;
  display: flex;
  align-items: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.4);
  pointer-events: auto;
  white-space: nowrap;
}

.star-panel { flex-shrink: 0; }
.progress-panel { flex-shrink: 1; min-width: 0; max-width: 420px; }
.map-pill { gap: 10px; }

.map-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #ff80ab;
  box-shadow: 0 0 0 4px rgba(255,128,171,0.18);
}
.map-dot.m2 {
  background: #76ff03;
  box-shadow: 0 0 0 4px rgba(118,255,3,0.18);
}

.hud-text { font-size: 1.5rem; font-weight: bold; }
.hud-text.small { font-size: 1rem; font-weight: 800; }

.star-svg-icon {
  width: 28px; height: 28px;
  margin-right: 10px;
  filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.7));
}

.progress-bar-container {
  width: 220px;
  height: 15px;
  background: rgba(0,0,0,0.6);
  border-radius: 10px;
  margin: 0 12px;
  border: 1px solid rgba(255,255,255,0.1);
  overflow: hidden;
  position: relative;
  flex: 1;
  min-width: 70px;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #76ff03, #00e676);
  box-shadow: 0 0 15px #76ff03;
  transition: width 0.5s ease-out;
}
.progress-shine {
  position: absolute;
  top:0; left:0;
  width:100%; height:100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
  animation: shineLoad 2s infinite;
}
@keyframes shineLoad { from {transform: translateX(-100%);} to {transform: translateX(100%);} }

.map-switch { gap: 8px; }
.map-btn {
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(0,0,0,0.20);
  color: #ffd700;
  border-radius: 999px;
  padding: 7px 12px;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  transition: transform 0.15s ease, filter 0.15s ease, opacity 0.15s ease;
}
.map-btn:hover { transform: translateY(-1px); filter: brightness(1.08); }
.map-btn.active {
  background: rgba(255, 215, 0, 0.12);
  border-color: rgba(255, 215, 0, 0.45);
}
.map-btn.locked {
  opacity: 0.45;
  cursor: not-allowed;
}
.map-btn:disabled { pointer-events: none; }

@media (max-width: 600px) {
  .hud { left: 10px; right: 10px; }
  .hud-bottom { bottom: 10px; }
  .hud-panel { padding: 6px 10px; }
  .hud-text { font-size: 1.1rem; }
  .hide-mobile { display: none; }
  .progress-bar-container { margin: 0 8px; width: 170px; }
  .map-btn { padding: 6px 10px; font-size: 0.9rem; }
}

.game-world {
  position: absolute;
  cursor: grab;
  transform-origin: 0 0;
  will-change: transform;
  background-color: #222;
}
.game-world:active { cursor: grabbing; }
.game-world.disable-input { pointer-events: none; }

.world-bg {
  width: 100%; height: 100%;
  position: absolute; top: 0; left: 0;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: inset 0 0 100px rgba(0,0,0,0.5);
  z-index: 0;
}

/* (оставил твою стилизацию map2 как временную, пока не добавишь картинку) */


/* Connections */
.connections { position: absolute; width: 100%; height: 100%; z-index: 1; pointer-events: none; }
.path-line { stroke: #fff; stroke-width: 8; stroke-linecap: round; fill: none; opacity: 0; stroke-dasharray: 15, 20; filter: drop-shadow(0 4px 4px rgba(0,0,0,0.5)); }

.level-node {
  position: absolute;
  width: 100px; height: 70px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.level-node:hover { transform: scale(1.1) translateY(-5px); z-index: 6; }
.platform-body { width: 100%; height: 100%; position: relative; }

.platform-surface {
  width: 100%; height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 30%, #ffd54f, #f57f17);
  border: 4px solid #fff;
  box-shadow: 0 8px 0 #bf360c, 0 15px 10px rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;
  color: #5d4037;
  text-shadow: 0 1px 0 rgba(255,255,255,0.4);
  position: relative;
  z-index: 2;
}
.platform-surface.map2 {
  background: radial-gradient(circle at 50% 30%, #dcedc8, #76ff03);
  box-shadow: 0 8px 0 #1b5e20, 0 15px 10px rgba(0,0,0,0.35);
  color: #1b5e20;
}

.level-node.locked .platform-surface {
  background: radial-gradient(circle at 50% 30%, #cfd8dc, #607d8b);
  border-color: #eceff1;
  color: #546e7a;
  box-shadow: 0 8px 0 #455a64, 0 15px 10px rgba(0,0,0,0.4);
}

.level-node.boss { width: 120px; height: 85px; }
.level-node.boss .platform-surface {
  background: radial-gradient(circle at 50% 30%, #ef5350, #c62828);
  border-color: #ffcdd2;
  color: #fff;
  box-shadow: 0 10px 0 #8e0000, 0 20px 15px rgba(0,0,0,0.5);
}

.level-node.current .platform-surface { animation: bouncePlatform 2s infinite ease-in-out; border-color: #fff; }
@keyframes bouncePlatform { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }

.stars-display {
  position: absolute;
  top: -80px;
  width: 200px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: -15px;
  z-index: 10;
  pointer-events: none;
  animation: gentleFloat 3s infinite ease-in-out;
}

.level-star {
  width: 50px; height: 50px;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: popIn 0.5s ease-out backwards;
}
.star-body { fill: url(#cartoonSilver); stroke: #757575; stroke-width: 1.5px; stroke-linejoin: round; transition: all 0.3s ease; }
.star-facet { fill: #FFFFFF; fill-opacity: 0.1; transition: all 0.3s ease; pointer-events: none; }
.level-star.filled .star-body { fill: url(#cartoonGold); stroke: #BF360C; stroke-width: 1.5px; }
.level-star.filled .star-facet { fill: #FFFFFF; fill-opacity: 0.3; }

.level-star:nth-child(2) { width: 80px; height: 80px; margin-bottom: 25px; z-index: 12; animation: popIn 0.5s ease-out backwards, pulseStar 3s infinite ease-in-out; }
.level-star:nth-child(1) { transform: rotate(-20deg); z-index: 11; animation-delay: 0.1s; }
.level-star:nth-child(3) { transform: rotate(20deg); z-index: 11; animation-delay: 0.2s; }

@keyframes popIn { from { transform: scale(0) rotate(var(--rot, 0deg)); opacity: 0; } to { transform: scale(1) rotate(var(--rot, 0deg)); opacity: 1; } }
@keyframes gentleFloat { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-5px); } }
@keyframes pulseStar { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }

.tooltip {
  position: absolute;
  top: -110px;
  background: rgba(62, 39, 35, 0.95);
  color: #ffd700;
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: bold;
  opacity: 0;
  pointer-events: none;
  white-space: nowrap;
  border: 1px solid rgba(255, 215, 0, 0.4);
  box-shadow: 0 5px 15px rgba(0,0,0,0.4);
  transition: opacity 0.3s;
  z-index: 20;
}
.level-node:hover .tooltip { opacity: 1; }

.mascot-container { position: absolute; pointer-events: none; z-index: 100; }

.locked-toast {
  position: fixed;
  bottom: 95px; left: 50%;
  transform: translateX(-50%);
  background: rgba(198, 40, 40, 0.95);
  color: white;
  padding: 15px 30px;
  border-radius: 30px;
  font-size: 1.2rem;
  font-weight: bold;
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  border: 2px solid rgba(255,255,255,0.2);
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 10px;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
