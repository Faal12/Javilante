<template>
  <div class="home-page">
    <div class="decor-bg">
      <div 
        v-for="(petal, index) in petals" 
        :key="index" 
        class="petal"
        :style="petal.style"
      ></div>
    </div>

    <div class="hero-content">
      
      <div class="logo-container">
        <img src="@/assets/smoke.png" class="smoke-img" alt="Smoke" />
        
        <img src="@/assets/logo.png" class="logo-img" alt="Logo" />
      </div>
      <h1 class="main-title">
        <span class="typing-text">{{ displayText }}</span>
        <span class="cursor"></span>
      </h1>
      
      <p class="subtitle">Entfessle deinen inneren Coder.</p>
      <router-link to="/map" class="start-btn">Zum Abenteuer beginnen! 🚀</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// === ЛОГИКА ЛЕПЕСТКОВ (Без изменений) ===
const petals = ref([]);
const initPetals = () => {
  const newPetals = [];
  for (let i = 0; i < 40; i++) { 
    const randomDrift = (Math.random() - 0.5) * 400 + 'px';
    newPetals.push({
      style: {
        '--delay': Math.random() * -60 + 's',
        '--duration': 30 + Math.random() * 30 + 's',
        '--left-start': (Math.random() * 120 - 10) + '%',
        '--scale': 1.2 + Math.random() * 1.0, 
        '--rotation': Math.random() * 360 + 'deg',
        '--drift-end': randomDrift 
      }
    });
  }
  petals.value = newPetals;
};

// === ЛОГИКА ПЕЧАТНОЙ МАШИНКИ (Без изменений) ===
const phrases = ["Javilante", "The best way to learn Java"];
const displayText = ref(""); 
let phraseIndex = 0; 
let charIndex = 0; 
let isDeleting = false; 
let typingTimeout = null;

const typeLoop = () => {
  const currentPhrase = phrases[phraseIndex];
  
  if (isDeleting) {
    displayText.value = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    displayText.value = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let typeSpeed = 100; 

  if (isDeleting) {
    typeSpeed = 80; 
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    typeSpeed = 3500; 
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length; 
    typeSpeed = 1000; 
  }

  typingTimeout = setTimeout(typeLoop, typeSpeed);
};

onMounted(() => {
  initPetals();
  typeLoop(); 
});

onUnmounted(() => {
  clearTimeout(typingTimeout); 
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;900&display=swap');

.home-page {
  width: 100%; height: 100vh;
  background: linear-gradient(135deg, #fbe9c6 0%, #eace9b 100%);
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden; font-family: 'Fredoka', sans-serif;
}

.hero-content {
  text-align: center; z-index: 10; display: flex; flex-direction: column; align-items: center;
  width: 100%; 
  max-width: 800px;
}

/* === НОВЫЕ СТИЛИ ДЛЯ ЛОГО И ДЫМА === */
.logo-container {
  position: relative;
  width: 250px; /* Настрой ширину под размер своего лого */
  height: 250px;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: flex-end; /* Логотип стоит внизу */
}

.logo-img {
  width: 150%;
  height: auto;
  position: relative;
  z-index: 5; /* Лого поверх дыма */
  filter: drop-shadow(0 10px 15px rgba(0,0,0,0.3));
  animation: floatLogo 4s ease-in-out infinite;
}

.smoke-img {
  position: absolute;
  /* Настрой эти значения, чтобы дым выходил из нужного места логотипа */
  bottom: 100%; 
  left: 35%;
  width: 180px; /* Размер дыма */
  height: auto;
  transform-origin: bottom center; /* Качается от основания */
  transform: translateX(-50%);
  opacity: 0.8;
  z-index: 6; /* Дым позади логотипа (или поставь 6, если нужен спереди) */
  animation: smokeSway 5s ease-in-out infinite;
  pointer-events: none;
}

/* Анимация логотипа: легкое парение вверх-вниз */
@keyframes floatLogo {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Анимация дыма: покачивание и изменение прозрачности */
@keyframes smokeSway {
  0% { 
    transform: translateX(-50%) rotate(-5deg) scale(0.9); 
    opacity: 0.7; 
  }
  50% { 
    transform: translateX(-50%) rotate(5deg) scale(1.05); 
    opacity: 0.9; 
  }
  100% { 
    transform: translateX(-50%) rotate(-5deg) scale(0.9); 
    opacity: 0.7; 
  }
}

/* === СТИЛИ ЗАГОЛОВКА === */
.main-title {
  font-size: 3.5rem; 
  font-weight: 900;
  color: #d84315;
  margin: 0;
  text-shadow: 4px 4px 0 #4e342e;
  min-height: 1.2em; 
  line-height: 1.2;
}

/* === КУРСОР === */
.cursor {
  display: inline-block;
  width: 3px;
  background-color: #d84315;
  animation: blink 1s infinite;
  margin-left: 5px;
  height: 1em;
  vertical-align: text-bottom;
  text-shadow: none; 
  box-shadow: none;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@media (max-width: 600px) {
  .main-title { font-size: 2rem; } 
  .logo-container { width: 180px; height: 180px; }
}

.subtitle { font-size: 1.6rem; color: #5d4037; margin: 25px 0 45px; font-weight: 700; }

/* --- ТЕКСТ КНОПКИ --- */
.start-btn { 
  padding: 18px 45px; background: #FFD700; color: #4e342e; text-decoration: none; font-size: 1.6rem; font-weight: 900;
  border-radius: 50px; border: 5px solid #fff; box-shadow: 0 10px 0 #cba108, 0 20px 30px rgba(0,0,0,0.3);
  transition: transform 0.1s; will-change: transform;
}
.start-btn:hover { transform: scale(1.05) translateY(-5px); background: #ffe066; }
.start-btn:active { transform: translateY(5px); box-shadow: 0 0 0 #cba108; }

/* --- ФОН --- */
.decor-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
.petal {
  position: absolute; left: var(--left-start); top: -10%; width: calc(20px * var(--scale)); height: calc(20px * var(--scale));
  background: linear-gradient(135deg, #ffcdd2, #f8bbd0); border-radius: 100% 0% 100% 0% / 100% 0% 100% 0%; opacity: 0.8;
  transform: rotate(var(--rotation)) scale(var(--scale));
  animation: fallHeavy linear infinite; animation-delay: var(--delay); animation-duration: var(--duration); will-change: transform;
}
@keyframes fallHeavy {
  0% { opacity: 0; transform: translate3d(0, 0, 0) rotate(var(--rotation)); }
  10% { opacity: 0.9; } 90% { opacity: 0.9; }
  100% { opacity: 0; transform: translate3d(var(--drift-end), 120vh, 0) rotate(calc(var(--rotation) + 360deg)); }
}
</style>