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
.mascot-wrapper {
  width: 140px;  
  height: 220px;
  
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

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

.sprite-window {
  width: 120%;
  height: 100%;
  overflow: hidden;
  position: relative;
  clip-path: inset(0 0% 0 4%);
}

.sprite-strip {
  height: 100%;
  
  background-image: url('@/assets/panda_walk_sprite.png');
  background-repeat: no-repeat;
  background-size: 100% 100%; 
  width: 600%; 
  animation: moveStrip 1.0s steps(6) infinite;
}

@keyframes moveStrip {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}

.idle-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
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