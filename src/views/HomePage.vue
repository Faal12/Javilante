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
      
      <div class="mug-wrapper">
        <svg class="steam-svg" viewBox="0 0 500 800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="steamRad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style="stop-color:white; stop-opacity:0.8" />
              <stop offset="60%" style="stop-color:white; stop-opacity:0.3" />
              <stop offset="100%" style="stop-color:white; stop-opacity:0" />
            </radialGradient>
            <filter id="fluffBlur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
            </filter>
          </defs>

          <g filter="url(#fluffBlur)" class="steam-container">
             <circle class="puff p1" cx="250" cy="750" r="40" fill="url(#steamRad)" />
             <circle class="puff p2" cx="250" cy="750" r="30" fill="url(#steamRad)" />
             <circle class="puff p3" cx="250" cy="750" r="50" fill="url(#steamRad)" />
             <circle class="puff p4" cx="250" cy="750" r="35" fill="url(#steamRad)" />
             <circle class="puff p5" cx="250" cy="750" r="55" fill="url(#steamRad)" />
             <circle class="puff p6" cx="250" cy="750" r="25" fill="url(#steamRad)" />
             <circle class="puff p7" cx="250" cy="750" r="45" fill="url(#steamRad)" />
          </g>
        </svg>
        
        <div class="panda-mug">
          <div class="ear left"></div>
          <div class="ear right"></div>
          <div class="mug-body">
            <div class="stripes"></div>
            <div class="mug-face"><span class="java-text">Java</span></div>
          </div>
          <div class="mug-handle"></div>
        </div>
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

// === ЛОГИКА ЛЕПЕСТКОВ ===
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

// === ЛОГИКА ПЕЧАТНОЙ МАШИНКИ ===
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

.mug-wrapper {
  position: relative; width: 200px; height: 240px; margin-bottom: 50px;
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

/* === КУРСОР (ИДЕАЛЬНЫЙ) === */
.cursor {
  display: inline-block;
  width: 3px; /* Тонкая, аккуратная линия */
  background-color: #d84315; /* Цвет курсора */
  animation: blink 1s infinite;
  margin-left: 5px;
  height: 1em; /* Высота равна высоте буквы */
  vertical-align: text-bottom; /* Выравнивание по низу текста */
  
  /* Гарантируем отсутствие теней */
  text-shadow: none; 
  box-shadow: none;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@media (max-width: 600px) {
  .main-title { font-size: 2rem; } 
}

.subtitle { font-size: 1.6rem; color: #5d4037; margin: 25px 0 45px; font-weight: 700; }

/* === ПАР === */
.steam-svg {
  position: absolute; left: 50%; transform: translateX(-50%); bottom: 40px;
  width: 500px; height: 800px; pointer-events: none; z-index: 1; overflow: visible;
}
.puff {
  opacity: 0; transform-origin: 250px 750px;
  animation: riseUp 4s infinite ease-out;
}
.p1 { animation-delay: 0s;   animation-duration: 3.5s; }
.p2 { animation-delay: 0.5s; animation-duration: 4.0s; cx: 240px; }
.p3 { animation-delay: 1.0s; animation-duration: 3.8s; cx: 260px; }
.p4 { animation-delay: 1.5s; animation-duration: 4.2s; }
.p5 { animation-delay: 2.0s; animation-duration: 3.6s; cx: 230px; }
.p6 { animation-delay: 2.5s; animation-duration: 4.5s; cx: 270px; }
.p7 { animation-delay: 3.0s; animation-duration: 3.9s; }

@keyframes riseUp {
  0% { opacity: 0; transform: translateY(0) scale(0.3); }
  15% { opacity: 0.8; }
  50% { opacity: 0.6; }
  100% { opacity: 0; transform: translateY(-650px) scale(3.5); }
}

/* --- КРУЖКА --- */
.panda-mug { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 140px; height: 120px; z-index: 5; }
.mug-body { width: 100%; height: 100%; background: #e65100; border-radius: 20px 20px 60px 60px; border: 5px solid #4e342e; position: relative; overflow: hidden; box-shadow: inset -10px -5px 20px rgba(0,0,0,0.2); }
.stripes { position: absolute; bottom: 0; width: 100%; height: 40%; background: #ffe0b2; border-top: 5px solid #4e342e; }
.mug-face { position: absolute; top: 20px; width: 100%; text-align: center; }
.java-text { font-size: 1.8rem; font-weight: 900; color: #4e342e; }
.mug-handle { position: absolute; right: -40px; top: 25px; width: 50px; height: 70px; border: 8px solid #e65100; border-left: none; border-radius: 0 35px 35px 0; box-shadow: 4px 4px 0 #4e342e; z-index: -1; }
.ear { position: absolute; top: -15px; width: 35px; height: 35px; background: #4e342e; border-radius: 50%; border: 4px solid #e65100; }
.ear.left { left: 5px; } .ear.right { right: 5px; }

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