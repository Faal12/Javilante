<template>
  <div class="level-page theme-sakura">
    
    <div class="sakura-decor">
      <div class="falling-petals">
        <span v-for="(style, index) in petalsStyles" :key="index" :style="style">🌸</span>
      </div>

      <svg class="branch left" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
        <g class="swaying-branch">
          <path d="M-20,50 Q150,20 280,150 T400,100" fill="none" stroke="#4e342e" stroke-width="6" stroke-linecap="round" opacity="0.6" />
          <path d="M100,100 Q150,250 120,400" fill="none" stroke="#4e342e" stroke-width="5" stroke-linecap="round" opacity="0.6" />
          
          <path d="M-50,20 Q150,100 250,450" fill="none" stroke="#3e2723" stroke-width="18" stroke-linecap="round" />
          <path d="M-20,150 Q180,200 350,120" fill="none" stroke="#3e2723" stroke-width="14" stroke-linecap="round" />
          <path d="M180,300 Q220,450 150,600" fill="none" stroke="#3e2723" stroke-width="10" stroke-linecap="round" />
          
          <path d="M250,450 Q280,500 320,480" fill="none" stroke="#3e2723" stroke-width="6" stroke-linecap="round" />
          <path d="M150,220 Q200,300 280,320" fill="none" stroke="#3e2723" stroke-width="5" stroke-linecap="round" />
          <path d="M350,120 Q400,100 450,150" fill="none" stroke="#3e2723" stroke-width="6" stroke-linecap="round" />

          <g fill="#ffcdd2" stroke="#e57373" stroke-width="1">
            <circle cx="100" cy="150" r="15" /> <circle cx="120" cy="160" r="18" /> <circle cx="90" cy="170" r="12" />
            <circle cx="250" cy="450" r="16" /> <circle cx="270" cy="430" r="14" /> <circle cx="230" cy="470" r="12" />
            <circle cx="350" cy="120" r="15" /> <circle cx="380" cy="110" r="18" /> <circle cx="330" cy="140" r="14" />
            <circle cx="150" cy="600" r="14" /> <circle cx="170" cy="580" r="12" />
            
            <circle cx="200" cy="250" r="10" /> <circle cx="220" cy="200" r="11" />
            <circle cx="300" cy="150" r="9" />  <circle cx="400" cy="130" r="13" />
            <circle cx="50" cy="300" r="12" />  <circle cx="80" cy="350" r="10" />
            <circle cx="180" cy="400" r="11" /> <circle cx="300" cy="320" r="10" />
            <circle cx="450" cy="150" r="12" /> <circle cx="420" cy="180" r="9" />
            <circle cx="280" cy="320" r="11" /> <circle cx="320" cy="480" r="10" />
          </g>
        </g>
      </svg>

      <svg class="branch right" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
        <g class="swaying-branch reverse">
          <path d="M620,100 Q400,50 300,200 T200,100" fill="none" stroke="#4e342e" stroke-width="6" stroke-linecap="round" opacity="0.6" />
          <path d="M500,200 Q450,350 520,500" fill="none" stroke="#4e342e" stroke-width="5" stroke-linecap="round" opacity="0.6" />

          <path d="M650,20 Q450,150 400,550" fill="none" stroke="#3e2723" stroke-width="18" stroke-linecap="round" />
          <path d="M620,200 Q400,250 200,180" fill="none" stroke="#3e2723" stroke-width="14" stroke-linecap="round" />
          <path d="M420,350 Q480,500 550,650" fill="none" stroke="#3e2723" stroke-width="10" stroke-linecap="round" />

          <path d="M400,550 Q350,600 300,580" fill="none" stroke="#3e2723" stroke-width="6" stroke-linecap="round" />
          <path d="M200,180 Q150,160 100,200" fill="none" stroke="#3e2723" stroke-width="6" stroke-linecap="round" />
          <path d="M450,280 Q350,350 300,400" fill="none" stroke="#3e2723" stroke-width="5" stroke-linecap="round" />

          <g fill="#ffcdd2" stroke="#e57373" stroke-width="1">
            <circle cx="500" cy="200" r="16" /> <circle cx="480" cy="220" r="13" /> <circle cx="520" cy="190" r="14" />
            <circle cx="400" cy="550" r="17" /> <circle cx="380" cy="530" r="15" /> <circle cx="420" cy="570" r="12" />
            <circle cx="200" cy="180" r="15" /> <circle cx="180" cy="200" r="12" /> <circle cx="220" cy="170" r="14" />
            
            <circle cx="300" cy="300" r="11" /> <circle cx="350" cy="250" r="10" />
            <circle cx="100" cy="200" r="13" /> <circle cx="150" cy="220" r="10" />
            <circle cx="300" cy="400" r="12" /> <circle cx="300" cy="580" r="11" />
            <circle cx="550" cy="650" r="14" /> <circle cx="520" cy="500" r="10" />
            <circle cx="250" cy="100" r="9" />  <circle cx="600" cy="300" r="12" />
            <circle cx="450" cy="450" r="11" /> <circle cx="350" cy="500" r="10" />
          </g>
        </g>
      </svg>
    </div>

    <div v-if="step === 'theory'" class="view-container">
      <div class="glass-panel theory-panel">
        <div class="panel-header">
          <div class="asian-seal">
            <span>{{ levelData?.id }}</span>
          </div>
          <h1>{{ levelData?.theory.title }}</h1>
        </div>
        
        <div class="scrollable-content">
          <div class="theory-text" v-html="levelData?.theory.content"></div>
          
          <div class="code-block-wrapper" v-if="levelData?.theory.code">
            <div class="code-label">Java Code</div>
            <pre>{{ levelData?.theory.code }}</pre>
          </div>
        </div>

        <div class="panel-footer">
          <button class="primary-btn glow" @click="startTasks">
            <span class="icon">🌸</span> Wissen testen
          </button>
        </div>
      </div>
    </div>

    <div v-else class="view-container">
      <div class="glass-panel game-panel">
        
        <div class="game-top">
          <span class="progress-pill">Aufgabe {{ step }} / {{ levelData?.tasks.length }}</span>
          <div class="lives-container">
            <span v-for="n in 3" :key="n" class="heart">
              {{ n <= lives ? '❤️' : '🖤' }}
            </span>
          </div>
        </div>

        <div class="game-content" v-if="currentTask">
          <h2 class="question">{{ currentTask.question }}</h2>

          <div v-if="currentTask.type === 'duolingo'" class="duolingo-layout">
            <div class="answer-zone" :class="{ error: isError }">
              <div v-for="(word, idx) in userAnswerArray" :key="idx" class="tile" @click="removeFromAnswer(idx)">
                {{ word }}
              </div>
              <span v-if="userAnswerArray.length === 0" class="placeholder">Wähle Bausteine...</span>
            </div>
            <div class="tile-bank">
              <button 
                v-for="(word, idx) in currentTask.blocks" 
                :key="'bank-'+idx" 
                class="tile bank" 
                :class="{ used: isWordUsed(word) }"
                @click="addToAnswer(word)"
                :disabled="isWordUsed(word)"
              >
                {{ word }}
              </button>
            </div>
          </div>

          <div v-else-if="currentTask.type === 'quiz'" class="quiz-layout">
            <button 
              v-for="opt in currentTask.options" 
              :key="opt"
              class="quiz-card"
              :class="{ selected: userAnswerString === opt, error: isError && userAnswerString === opt }"
              @click="selectQuizOption(opt)"
            >
              <div class="marker"></div>
              <span>{{ opt }}</span>
            </button>
          </div>

          <div v-else-if="currentTask.type === 'input'" class="input-layout">
            <div class="input-container">
              <span class="line-num">1</span>
              <input 
                v-model="userAnswerString" 
                class="code-input" 
                placeholder="// Code hier eingeben..."
                :class="{ error: isError }"
                @input="isError = false"
                spellcheck="false"
              />
            </div>
          </div>
        </div>

        <div v-if="step === 'win'" class="result-screen win">
          <div class="result-icon">🏮</div>
          <h2>Ausgezeichnet!</h2>
          <p>Du hast diese Lektion gemeistert.</p>
          <div class="big-stars">
  <svg v-for="n in 3" :key="n" class="big-star-svg" :class="{ filled: n <= calcStars() }" viewBox="0 0 24 24">
    <defs>
       <linearGradient id="bigGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFD700" />
          <stop offset="100%" stop-color="#FF6F00" />
       </linearGradient>
    </defs>
    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
  </svg>
</div>
        </div>

        <div v-if="step === 'gameover'" class="result-screen lose">
          <div class="result-icon">🐼💔</div>
          <h2>Oh nein!</h2>
          <p>Deine Konzentration hat nachgelassen.</p>
          <p class="sub-text">Lies die Theorie noch einmal und versuche es erneut.</p>
        </div>

        <div class="game-actions">
          <div v-if="isError && step !== 'gameover'" class="feedback shake">
            ❌ Falsch! Ein Leben verloren.
          </div>
          
          <button v-if="typeof step === 'number'" class="primary-btn" @click="checkAnswer">
            Überprüfen
          </button>
          
          <button v-else-if="step === 'win'" class="primary-btn success" @click="finishLevel">
            Weiter zur Karte
          </button>
          
          <button v-else-if="step === 'gameover'" class="primary-btn fail" @click="restartTheory">
            Zurück zur Theorie
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, onMounted } from 'vue';
import { useGameStore } from '@/stores/gameStore';

const route = useRoute();
const router = useRouter();
const store = useGameStore();

const levelId = route.params.id;
const levelData = computed(() => store.activeLevelData(levelId));

const step = ref('theory');
const lives = ref(3);
const userAnswerArray = ref([]);
const userAnswerString = ref("");
const isError = ref(false);

const currentTask = computed(() => {
  if (typeof step.value === 'number') {
    return levelData.value?.tasks[step.value - 1];
  }
  return null;
});

// === ФИКС: Генерируем стили лепестков один раз ===
const petalsStyles = ref([]);

const initPetals = () => {
  petalsStyles.value = Array.from({ length: 40 }).map(() => ({
    left: Math.random() * 100 + '%',
    animationDelay: Math.random() * 5 + 's',
    animationDuration: 5 + Math.random() * 5 + 's',
    opacity: 0.4 + Math.random() * 0.6,
    transform: `scale(${0.5 + Math.random()})`
  }));
};

const addToAnswer = (word) => { userAnswerArray.value.push(word); isError.value = false; };
const removeFromAnswer = (idx) => { userAnswerArray.value.splice(idx, 1); };
const isWordUsed = (word) => {
  const inAnswer = userAnswerArray.value.filter(w => w === word).length;
  const inBank = currentTask.value.blocks.filter(w => w === word).length;
  return inAnswer >= inBank;
};
const selectQuizOption = (opt) => { userAnswerString.value = opt; isError.value = false; };

const startTasks = () => { 
  step.value = 1; 
  lives.value = 3; 
  resetInputs(); 
};

const resetInputs = () => { 
  userAnswerArray.value = []; 
  userAnswerString.value = ""; 
  isError.value = false; 
};

const finishLevel = () => router.push('/map');

const restartTheory = () => {
  step.value = 'theory';
  lives.value = 3;
  resetInputs();
};

const calcStars = () => Math.max(1, lives.value);

const checkAnswer = () => {
  const task = currentTask.value;
  let correct = false;

  if (task.type === 'duolingo') {
    correct = JSON.stringify(userAnswerArray.value) === JSON.stringify(task.correctOrder);
  } else if (task.type === 'quiz') {
    correct = userAnswerString.value === task.correct;
  } else if (task.type === 'input') {
    correct = task.correctRegex.test(userAnswerString.value.trim());
  }

  if (correct) {
    if (step.value < levelData.value.tasks.length) {
      step.value++;
      resetInputs();
    } else {
      step.value = 'win';
      store.completeLevel(parseInt(levelId), calcStars());
    }
  } else {
    isError.value = true;
    lives.value--; 
    
    if (lives.value <= 0) {
      setTimeout(() => {
        step.value = 'gameover';
      }, 500); 
    }
  }
};

onMounted(() => {
  initPetals(); // Запускаем генерацию при старте
  if (!levelData.value) router.push('/map');
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&display=swap');

.level-page {
  width: 100%; height: 100vh;
  font-family: 'Fredoka', sans-serif;
  overflow: hidden;
  position: relative;
  background: radial-gradient(circle at center, #fff3e0 0%, #ffccbc 100%);
  --accent: #d81b60; 
  --text-dark: #3e2723;
}

/* === SAKURA DECOR === */
.sakura-decor {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none; overflow: hidden; z-index: 0;
}

.branch {
  position: absolute; top: -20px;
  width: 600px; height: 800px;
  filter: drop-shadow(5px 10px 10px rgba(0,0,0,0.15));
  animation: sway 10s infinite ease-in-out;
}
.branch.left { left: -100px; transform-origin: top left; }
.branch.right { right: -100px; transform-origin: top right; }

.swaying-branch.reverse {
  animation: sway-reverse 12s infinite ease-in-out;
  transform-origin: top right;
}

.falling-petals span {
  position: absolute; top: -50px; font-size: 20px;
  animation: fall linear infinite;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

@keyframes sway {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(2deg); }
}
@keyframes sway-reverse {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-2deg); }
}
@keyframes fall {
  to { transform: translateY(110vh) rotate(720deg) translateX(100px); }
}

/* === GLASSMORPHISM === */
.view-container {
  width: 100%; height: 100%;
  display: flex; justify-content: center; align-items: center;
  padding: 80px 20px 40px;
  position: relative; z-index: 10;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(15px) saturate(120%);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  width: 100%; max-width: 800px;
  height: 90%;
  display: flex; flex-direction: column;
  overflow: hidden;
}

/* --- THEORY --- */
.theory-panel { max-width: 900px; }
.panel-header {
  padding: 30px 40px; border-bottom: 2px solid rgba(216, 27, 96, 0.1);
  display: flex; align-items: center; gap: 20px; background: rgba(255,255,255,0.5);
}
.asian-seal {
  width: 50px; height: 50px; border: 3px solid var(--accent); border-radius: 50%;
  color: var(--accent); display: flex; justify-content: center; align-items: center;
  font-weight: bold; font-size: 1.2rem; background: #fff;
}
.panel-header h1 { font-family: 'Noto Serif', serif; font-size: 2rem; color: var(--accent); margin: 0; }

.scrollable-content { flex: 1; overflow-y: auto; padding: 40px; }
.theory-text { font-family: 'Noto Serif', serif; font-size: 1.2rem; line-height: 1.8; color: var(--text-dark); }
.theory-text :deep(h3) { font-family: 'Fredoka', sans-serif; color: var(--accent); margin-top: 30px; }
.theory-text :deep(.code-box) { background: #fce4ec; padding: 5px 10px; border-radius: 5px; display: inline-block; font-family: monospace; color: #880e4f; }

.code-block-wrapper {
  background: #282c34; border-radius: 12px; overflow: hidden; margin-top: 30px;
}
.code-label { background: #21252b; color: #e06c75; padding: 8px 15px; font-size: 0.8rem; text-transform: uppercase; font-weight: bold; }
.code-block-wrapper pre { padding: 20px; color: #abb2bf; font-family: 'Consolas', monospace; font-size: 1.1rem; }

.panel-footer { padding: 25px; text-align: center; border-top: 1px solid rgba(0,0,0,0.05); background: rgba(255,255,255,0.6); }

/* --- GAME UI --- */
.game-panel { max-width: 650px; }
.game-top { padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid rgba(0,0,0,0.05); }
.progress-pill { background: #fff; padding: 6px 16px; border-radius: 20px; font-weight: bold; color: var(--accent); border: 1px solid #f8bbd0; }

.lives-container { font-size: 1.5rem; display: flex; gap: 5px; }
.heart { transition: all 0.3s; }

.game-content { padding: 40px; flex: 1; display: flex; flex-direction: column; justify-content: center; }
.question { text-align: center; color: var(--text-dark); margin-bottom: 40px; font-size: 1.5rem; }

/* Duolingo */
.answer-zone {
  min-height: 80px; border-bottom: 2px solid #f8bbd0; margin-bottom: 30px;
  display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; padding-bottom: 10px;
}
.answer-zone.error { border-color: #ff5252; animation: shake 0.4s; }
.tile {
  background: white; border: 1px solid #f48fb1; border-bottom: 4px solid #f06292;
  padding: 12px 20px; border-radius: 12px; font-weight: bold; color: #880e4f; cursor: pointer;
  transition: transform 0.1s;
}
.tile:active { transform: translateY(4px); border-bottom-width: 0; }
.tile.bank:hover { background: #fce4ec; }
.tile.used { opacity: 0; pointer-events: none; }

/* Quiz */
.quiz-layout { display: flex; flex-direction: column; gap: 15px; }
.quiz-card {
  background: white; border: 2px solid #fce4ec; padding: 20px; border-radius: 16px;
  text-align: left; cursor: pointer; font-size: 1.2rem; font-family: 'Fredoka', sans-serif;
  display: flex; align-items: center; gap: 15px; transition: all 0.2s; color: var(--text-dark);
}
.marker { width: 24px; height: 24px; border: 2px solid #f8bbd0; border-radius: 50%; }
.quiz-card:hover { border-color: var(--accent); background: #fff; transform: scale(1.02); }
.quiz-card.selected { background: #fce4ec; border-color: var(--accent); }
.quiz-card.selected .marker { background: var(--accent); border-color: var(--accent); }
.quiz-card.error { background: #ffebee; border-color: #ff5252; animation: shake 0.4s; }

/* Input */
.input-container {
  display: flex; align-items: center; background: #282c34; border-radius: 12px; padding: 15px;
}
.code-input {
  background: transparent; border: none; color: #fff; font-family: 'Consolas', monospace; font-size: 1.2rem; width: 100%; outline: none;
}
.code-input.error { color: #ff5252; }

/* RESULT SCREENS */
.result-screen { text-align: center; padding: 40px; }
.result-icon { font-size: 6rem; animation: bounce 2s infinite; display: block; margin-bottom: 10px; }
.win h2 { color: #4caf50; }
.lose h2 { color: #d32f2f; }
.big-stars { font-size: 3rem; margin-top: 20px; }
.big-stars span { filter: grayscale(1); opacity: 0.3; transition: all 0.5s; }
.big-stars span.filled { filter: grayscale(0); opacity: 1; text-shadow: 0 0 10px gold; }
.big-star-svg {
  width: 60px; height: 60px;
  margin: 0 5px;
  fill: #e0e0e0; /* Пустая */
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.big-star-svg.filled {
  fill: url(#bigGold);
  filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
  transform: scale(1.2);
}

/* ACTIONS */
.game-actions { padding: 30px; text-align: center; height: 100px; display: flex; flex-direction: column; justify-content: center; align-items: center; }
.feedback { color: #d32f2f; font-weight: bold; margin-bottom: 10px; font-size: 1.1rem; }

.primary-btn {
  background: var(--accent); color: white;
  border: none; padding: 16px 50px; font-size: 1.3rem; font-weight: 700;
  border-radius: 50px; cursor: pointer; transition: all 0.2s;
  box-shadow: 0 8px 20px rgba(216, 27, 96, 0.3);
  font-family: 'Fredoka', sans-serif; display: inline-flex; align-items: center; gap: 10px;
}
.primary-btn:hover { transform: translateY(-3px); filter: brightness(1.1); }
.primary-btn.success { background: #4caf50; box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3); }
.primary-btn.fail { background: #d32f2f; box-shadow: 0 8px 20px rgba(211, 47, 47, 0.3); }

/* ANIMATIONS */
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(216, 27, 96, 0.4); } 70% { box-shadow: 0 0 0 20px rgba(216, 27, 96, 0); } 100% { box-shadow: 0 0 0 0 rgba(216, 27, 96, 0); } }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
</style>