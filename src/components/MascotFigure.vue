<template>
  <div class="mascot-wrapper">
    <div class="shadow-blur"></div>

    <div v-if="isWalking" class="sprite-window">
       <div class="sprite-strip"></div>
    </div>

    <img 
      v-else
      src="@/assets/panda_idle.png" 
      class="idle-image" 
      alt="Panda"
    />
  </div>
</template>

<script setup>
defineProps({
  isWalking: { type: Boolean, default: false }
});
</script>

<style scoped>
/* ================= НАСТРОЙКИ ================= */
.mascot-wrapper {
  /* РАЗМЕРЫ:
     Оригинал: 212x322. 
     Уменьшаем пропорционально (делим примерно на 2.6):
     80px ширина, 120px высота.
  */
  width: 140px;  
  height: 220px;
  
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

/* === ТЕНЬ === */
.shadow-blur {
  position: absolute;
  bottom: 5px;
  width: 60%;
  height: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  filter: blur(3px);
  z-index: -1;
  animation: shadowPulse 0.5s infinite alternate;
}

/* === АНИМАЦИЯ ХОДЬБЫ (ИСПРАВЛЕННАЯ) === */

/* 1. Окно просмотра */
.sprite-window {
  width: 120%;
  height: 100%;
  overflow: hidden;
  position: relative;
  left: -10%;
  clip-path: inset(0 15% 0 0%);
}

/* 2. Лента с кадрами */
.sprite-strip {
  height: 100%;
  
  background-image: url('@/assets/panda_walk_sprite.png');
  background-repeat: no-repeat;
  /* Растягиваем картинку точно по высоте и ширине ленты */
  background-size: 100% 100%; 
  
  /* ШИРИНА ЛЕНТЫ:
     5 кадров = 500%
     4 кадра = 400%
  */
  width: 500%; 
  
  /* СКОРОСТЬ:
     steps(5) — должно быть РОВНО количество ваших кадров.
     0.6s — скорость цикла (меньше = быстрее бежит).
  */
  animation: moveStrip 0.6s steps(5) infinite;
}

@keyframes moveStrip {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}

/* === СПОКОЙСТВИЕ === */
.idle-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* Дыхание стало чуть плавнее */
  animation: breathe 2.5s infinite ease-in-out;
  transform-origin: bottom center;
}

@keyframes breathe {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.04) scaleX(0.98); }
}

@keyframes shadowPulse {
  from { transform: scale(1); opacity: 0.3; }
  to { transform: scale(0.85); opacity: 0.2; }
}
</style>