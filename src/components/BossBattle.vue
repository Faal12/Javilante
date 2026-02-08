<template>
  <div class="boss-battle-container">
    
    <div class="cyber-bg">
      <div class="grid-floor"></div>
      <div class="neon-rain"></div>
      <div class="vignette"></div>
      <div class="damage-glitch" :class="{ active: showDamage }"></div>
    </div>

    <div v-if="phase === 'intro'" class="intro-layer" @click="advanceDialog">
      <div class="hologram-projector">
        <div class="holo-beam"></div>
        <img src="@/assets/boss_idle.webp" class="boss-holo" alt="Grandmaster" />
        <div class="holo-base"></div>
      </div>
      
      <div class="cyber-dialog">
        <div class="dialog-header">
          <div class="boss-icon">師</div>
          <span class="boss-name">{{ bossData.name }}</span>
          <div class="dialog-loading"></div>
        </div>
        <p class="dialog-text">
          <span class="prompt">root@dojo:~$</span> 
          {{ currentDialogText }}<span class="cursor">_</span>
        </p>
        <div class="dialog-footer">
          CLICK_TO_CONTINUE [ENTER]
        </div>
      </div>
    </div>

    <div v-else-if="phase === 'fight'" class="fight-layer">
      
      <div class="cyber-hud">
        <div class="hud-frame">
          <div class="hud-section life-section">
            <span class="hud-label">INTEGRITY</span>
            <div class="life-bar">
              <div 
                v-for="n in 3" 
                :key="n" 
                class="life-block" 
                :class="{ active: n <= lives, lost: n > lives }"
              ></div>
            </div>
          </div>
          
          <div class="hud-section timer-section">
            <span class="hud-label">SYSTEM PURGE</span>
            <div class="digital-clock" :class="{ critical: timeLeft < 20 }">
              {{ formattedTime }}
            </div>
            <div class="time-bar-bg">
              <div class="time-bar-fill" :style="{ width: timePercent + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="arena-stage">
        
        <transition name="glitch-pop">
          <div v-if="activeTaunt" class="cyber-taunt">
            <span class="taunt-text">{{ activeTaunt }}</span>
            <div class="taunt-line"></div>
          </div>
        </transition>

        <div class="boss-entity">
          <img 
            src="@/assets/boss_idle.webp" 
            class="boss-image" 
            :class="{ damaged: showDamage }" 
            alt="Boss"
          />
          <div class="neon-shadow"></div>
        </div>

      </div>

      <div class="cyber-terminal">
        <div class="terminal-header">
          <span class="status-dot"></span>
          <span class="title">DOJO_PROTOCOL_V2.EXE</span>
        </div>
        <div class="terminal-body">
          <div class="code-comment">// {{ bossData.task.question }}</div>
          <div class="input-line">
            <span class="prompt">>></span>
            <input 
              ref="inputRef"
              v-model="userCode" 
              class="hacking-input" 
              type="text" 
              placeholder="Inject code..." 
              spellcheck="false"
              autocomplete="off"
              @keydown.enter="submitAnswer"
            />
          </div>
          <button class="execute-btn" @click="submitAnswer">
            EXECUTE();
          </button>
        </div>
      </div>

    </div>

    <div v-else class="result-layer">
      <div class="result-card" :class="phase">
        <div class="result-glitch-icon">{{ phase === 'win' ? '👑' : '☠️' }}</div>
        <h1 class="result-title">{{ phase === 'win' ? 'SYSTEM HACKED' : 'FATAL ERROR' }}</h1>
        <p class="result-desc">
          {{ phase === 'win' ? 'Access Granted. The Dojo is yours.' : 'Connection Terminated by Host.' }}
        </p>
        <button class="cyber-btn" @click="handleResultAction">
          {{ phase === 'win' ? 'LOGOUT' : 'REBOOT SYSTEM' }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  bossData: { type: Object, required: true }
});

const emit = defineEmits(['level-completed']);

// === STATE ===
const phase = ref('intro');
const lives = ref(props.bossData.health || 3);
const timeLeft = ref(props.bossData.timeSeconds || 120);
const userCode = ref('');
const inputRef = ref(null);

const currentDialogIndex = ref(0);
const currentDialogText = ref('');
const isTyping = ref(false);

const showDamage = ref(false);
const activeTaunt = ref(null);

let timerInterval = null;
let tauntInterval = null;
let typeInterval = null;

// === COMPUTED ===
const timePercent = computed(() => (timeLeft.value / (props.bossData.timeSeconds || 120)) * 100);

const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60);
  const s = timeLeft.value % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
});

// === LIFECYCLE ===
onMounted(() => {
  startDialog();
});

onUnmounted(() => {
  clearIntervals();
});

function clearIntervals() {
  clearInterval(timerInterval);
  clearInterval(tauntInterval);
  clearInterval(typeInterval);
}

// === DIALOG LOGIC ===
function startDialog() {
  if (!props.bossData.dialogues?.length) return startFight();
  typeText(props.bossData.dialogues[0]);
}

function typeText(text) {
  isTyping.value = true;
  currentDialogText.value = '';
  let i = 0;
  clearInterval(typeInterval);
  typeInterval = setInterval(() => {
    if (i < text.length) {
      currentDialogText.value += text.charAt(i);
      i++;
    } else {
      isTyping.value = false;
      clearInterval(typeInterval);
    }
  }, 30);
}

function advanceDialog() {
  if (isTyping.value) {
    clearInterval(typeInterval);
    currentDialogText.value = props.bossData.dialogues[currentDialogIndex.value];
    isTyping.value = false;
    return;
  }
  if (currentDialogIndex.value < props.bossData.dialogues.length - 1) {
    currentDialogIndex.value++;
    typeText(props.bossData.dialogues[currentDialogIndex.value]);
  } else {
    startFight();
  }
}

// === FIGHT LOGIC ===
function startFight() {
  phase.value = 'fight';
  timeLeft.value = props.bossData.timeSeconds;
  lives.value = props.bossData.health;
  userCode.value = '';
  
  timerInterval = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) gameOver();
  }, 1000);

  startBehavior();
  setTimeout(() => inputRef.value?.focus(), 200);
}

function startBehavior() {
  // Только таунты, без движения
  tauntInterval = setInterval(() => {
    if (Math.random() > 0.5 && props.bossData.taunts) {
      activeTaunt.value = props.bossData.taunts[Math.floor(Math.random() * props.bossData.taunts.length)];
      setTimeout(() => activeTaunt.value = null, 3000);
    }
  }, 4500);
}

function submitAnswer() {
  const regex = props.bossData.task.correctRegex;
  if (regex.test(userCode.value.trim())) {
    victory();
  } else {
    damagePlayer();
  }
}

function damagePlayer() {
  showDamage.value = true;
  lives.value--;
  userCode.value = '';
  if (navigator.vibrate) navigator.vibrate(200);
  setTimeout(() => showDamage.value = false, 300);
  if (lives.value <= 0) gameOver();
}

function victory() {
  clearIntervals();
  phase.value = 'win';
}

function gameOver() {
  clearIntervals();
  phase.value = 'lose';
}

function handleResultAction() {
  if (phase.value === 'win') {
    emit('level-completed');
  } else {
    phase.value = 'intro';
    currentDialogIndex.value = 0;
    lives.value = props.bossData.health;
    startDialog();
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

/* === КОНТЕЙНЕР === */
.boss-battle-container {
  width: 100%; height: 100%; position: relative; overflow: hidden;
  background-color: #050505; color: #e0e0e0;
  font-family: 'Share Tech Mono', monospace;
}

/* === ФОН === */
.cyber-bg {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background: radial-gradient(circle at center, #0a0a12 0%, #000000 100%);
}
.grid-floor {
  position: absolute; bottom: 0; width: 200%; height: 50%; left: -50%;
  background-image: 
    linear-gradient(rgba(255, 0, 85, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 0, 85, 0.2) 1px, transparent 1px);
  background-size: 60px 60px;
  transform: perspective(600px) rotateX(60deg);
  mask-image: linear-gradient(to top, black 20%, transparent 100%);
  animation: gridMove 20s linear infinite;
}
.matrix-rain {
  position: absolute; inset: 0; opacity: 0.1;
  background: repeating-linear-gradient(0deg, transparent, transparent 50%, #00e5ff 50%, #00e5ff 51%);
  background-size: 100% 4px;
  animation: scanline 8s linear infinite;
}
.vignette { position: absolute; inset: 0; background: radial-gradient(circle, transparent 60%, #000000 100%); }
.damage-glitch {
  position: absolute; inset: 0; background: #ff0055; opacity: 0;
  mix-blend-mode: color-dodge; transition: opacity 0.1s; z-index: 100;
}
.damage-glitch.active { opacity: 0.6; }

/* === ИНТРО === */
.intro-layer {
  position: absolute; inset: 0; z-index: 50;
  background: rgba(0,0,0,0.9); backdrop-filter: blur(10px);
  display: flex; flex-direction: column; justify-content: center; align-items: center;
}
.hologram-projector { position: relative; width: 200px; height: 200px; margin-bottom: 30px; }
.boss-holo {
  width: 100%; height: 100%; object-fit: contain;
  filter: drop-shadow(0 0 15px rgba(0, 229, 255, 0.5)); 
  opacity: 0.95;
  animation: float 4s ease-in-out infinite;
}
.holo-beam {
  position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%);
  width: 150px; height: 50px; 
  background: radial-gradient(ellipse, rgba(0, 229, 255, 0.4) 0%, transparent 70%);
  filter: blur(10px);
}
.cyber-dialog {
  width: 90%; max-width: 600px; padding: 25px;
  background: rgba(10, 15, 20, 0.95); border: 1px solid #00e5ff;
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.1);
  position: relative;
}
.dialog-header {
  display: flex; align-items: center; gap: 15px; border-bottom: 1px solid #00e5ff; padding-bottom: 10px; margin-bottom: 15px;
}
.boss-icon {
  background: #00e5ff; color: #000; font-weight: bold; width: 30px; height: 30px;
  display: flex; justify-content: center; align-items: center; font-size: 1.2rem;
}
.boss-name { font-family: 'Orbitron'; color: #00e5ff; font-size: 1.2rem; letter-spacing: 2px; }
.dialog-text { font-size: 1.2rem; line-height: 1.5; color: #fff; min-height: 3em; }
.prompt { color: #ff0055; margin-right: 8px; }
.dialog-footer { text-align: right; font-size: 0.8rem; color: #00e5ff; margin-top: 15px; animation: blink 1.5s infinite; }

/* === FIGHT UI === */
.fight-layer {
  position: relative; z-index: 10; width: 100%; height: 100%;
  display: flex; flex-direction: column; 
  padding: 80px 15px 15px 15px; 
}
.cyber-hud { display: flex; justify-content: center; width: 100%; margin-bottom: 10px; }
.hud-frame {
  display: flex; gap: 40px; align-items: center;
  background: rgba(0,0,0,0.8); border: 1px solid #ff0055;
  padding: 10px 30px; border-radius: 4px;
  box-shadow: 0 0 20px rgba(255, 0, 85, 0.15);
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
}
.hud-label { display: block; font-size: 0.7rem; color: #ff0055; letter-spacing: 1px; margin-bottom: 5px; opacity: 0.8; }
.life-bar { display: flex; gap: 6px; }
.life-block { width: 25px; height: 12px; background: #330011; border: 1px solid #550022; transition: all 0.3s; }
.life-block.active { background: #ff0055; border-color: #ff99bb; box-shadow: 0 0 8px #ff0055; }

.timer-section { text-align: right; }
.digital-clock { font-family: 'Orbitron'; font-size: 1.8rem; color: #fff; line-height: 1; }
.digital-clock.critical { color: #ff0055; text-shadow: 0 0 10px #ff0055; animation: blink 0.5s infinite; }
.time-bar-bg { width: 120px; height: 4px; background: #333; margin-top: 5px; }
.time-bar-fill { height: 100%; background: #00e5ff; transition: width 1s linear; box-shadow: 0 0 5px #00e5ff; }

/* === АРЕНА (ЦЕНТР) === */
.arena-stage { 
  flex: 1; position: relative; width: 100%; overflow: hidden; 
  display: flex; justify-content: center; align-items: flex-end;
}

/* БОСС (СТАТИЧНЫЙ ЦЕНТР) */
.boss-entity {
  position: relative; /* Не absolute! Чтобы был в потоке flex */
  width: 280px; height: 280px; 
  margin-bottom: 20px;
  z-index: 5;
}
@media (min-width: 768px) {
  .boss-entity { width: 400px; height: 400px; }
}

/* ПРОСТО КАРТИНКА */
.boss-image {
  width: 100%; height: 100%;
  object-fit: contain;
  /* Легкое дыхание */
  animation: float 3s ease-in-out infinite;
  /* Мягкая тень */
  filter: drop-shadow(0 0 8px rgba(255, 0, 85, 0.4));
}
.boss-image.damaged {
  filter: brightness(2) sepia(1) hue-rotate(-50deg) saturate(300%);
  animation: shake 0.4s;
}

.neon-shadow {
  position: absolute; bottom: 10px; left: 20%; width: 60%; height: 15px;
  background: #ff0055; filter: blur(20px); opacity: 0.3; transform: scaleY(0.5);
}

/* НАСМЕШКА */
.cyber-taunt {
  position: absolute; 
  top: 10%; /* Над боссом */
  left: 50%; /* Центр экрана */
  transform: translateX(-50%);
  background: rgba(0,0,0,0.9); border: 2px solid #ff0055;
  padding: 8px 16px; color: #ff0055; font-weight: bold; font-size: 1rem;
  white-space: nowrap; z-index: 20;
  box-shadow: 0 0 15px rgba(255, 0, 85, 0.3);
}
.cyber-taunt::after {
  content: ''; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%);
  border-width: 10px 6px 0; border-style: solid; border-color: #ff0055 transparent transparent;
}

/* === ТЕРМИНАЛ === */
.cyber-terminal {
  position: relative; z-index: 20;
  width: 100%; max-width: 700px; margin: 0 auto;
  background: rgba(10, 15, 20, 0.95); border: 1px solid #00e5ff;
  border-radius: 6px 6px 0 0; box-shadow: 0 -5px 30px rgba(0, 229, 255, 0.1);
}
.terminal-header {
  background: rgba(0, 229, 255, 0.15); padding: 8px 15px;
  display: flex; align-items: center; gap: 10px;
  font-size: 0.8rem; color: #00e5ff; letter-spacing: 1px;
}
.status-dot { width: 8px; height: 8px; background: #00e5ff; border-radius: 50%; box-shadow: 0 0 5px #00e5ff; }
.terminal-body { padding: 20px; }
.code-comment { color: #00e5ff; opacity: 0.7; margin-bottom: 12px; font-style: italic; }
.input-line { display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #333; padding-bottom: 5px; }
.prompt { color: #ff0055; font-weight: bold; font-size: 1.2rem; }
.hacking-input {
  background: transparent; border: none; color: #fff; flex: 1;
  font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; outline: none;
}
.execute-btn {
  width: 100%; margin-top: 15px; padding: 15px;
  background: #00e5ff; color: #000; font-weight: bold; border: none;
  font-family: 'Orbitron'; letter-spacing: 2px; cursor: pointer;
  transition: all 0.2s;
}
.execute-btn:hover { background: #fff; box-shadow: 0 0 20px #00e5ff; }

/* === РЕЗУЛЬТАТ === */
.result-layer {
  position: absolute; inset: 0; background: rgba(0,0,0,0.95); z-index: 100;
  display: flex; justify-content: center; align-items: center;
}
.result-card {
  text-align: center; border: 3px solid; padding: 50px; max-width: 500px; background: #000;
  box-shadow: 0 0 50px rgba(0,0,0,0.8);
}
.result-card.win { border-color: #00e5ff; color: #00e5ff; }
.result-card.lose { border-color: #ff0055; color: #ff0055; }
.result-icon { font-size: 3rem; margin-bottom: 20px; }
.result-title { font-family: 'Orbitron'; font-size: 3rem; margin: 0; }
.result-desc { font-size: 1.2rem; margin-top: 10px; opacity: 0.8; }
.cyber-btn {
  margin-top: 40px; padding: 15px 50px; background: transparent;
  border: 2px solid currentColor; color: currentColor;
  font-family: 'Orbitron'; font-weight: bold; cursor: pointer; transition: all 0.3s;
}
.cyber-btn:hover { background: currentColor; color: #000; box-shadow: 0 0 20px currentColor; }

/* === АНИМАЦИИ === */
@keyframes gridMove { from { transform: perspective(600px) rotateX(60deg) translateY(0); } to { transform: perspective(600px) rotateX(60deg) translateY(60px); } }
@keyframes scanline { 0% { background-position: 0 0; } 100% { background-position: 0 100%; } }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
@keyframes blink { 50% { opacity: 0; } }
@keyframes load { 0% { left: -100%; } 100% { left: 200%; } }
.glitch-pop-enter-active, .glitch-pop-leave-active { transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.glitch-pop-enter-from { opacity: 0; transform: scale(0.8) translateY(20px); }
</style>