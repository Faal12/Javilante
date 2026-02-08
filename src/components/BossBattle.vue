<template>
  <div class="boss-battle-container">
    
    <div class="mystic-bg">
      <div class="fog-layer layer-1"></div>
      <div class="fog-layer layer-2"></div>
      <div class="particles">
        <span v-for="n in 20" :key="n" class="firefly" :style="getFireflyStyle(n)"></span>
      </div>
      <div class="crit-flash" :class="{ active: showDamage }"></div>
    </div>

    <div v-if="phase === 'intro'" class="intro-layer" @click="advanceDialog">
      <div class="boss-summon-circle">
        <div class="mandala outer"></div>
        <div class="mandala inner"></div>
        <div class="energy-core"></div>
        
        <img src="@/assets/boss_idle.webp" class="boss-portrait floating" alt="Grandmaster" />
      </div>
      
      <div class="dialog-scroll pop-in">
        <div class="scroll-header">
          <span class="boss-title">GRANDMASTER</span>
          <h2 class="boss-name">{{ bossData.name }}</h2>
        </div>
        <div class="scroll-body">
          <p class="dialog-text">
            {{ currentDialogText }}<span class="cursor">|</span>
          </p>
        </div>
        <div class="scroll-footer">
          Klicke zum Fortfahren ⚔️
        </div>
      </div>
    </div>

    <div v-else-if="phase === 'fight'" class="fight-layer">
      
      <div class="battle-hud slide-down">
        <div class="player-stats">
          <div class="stat-label">DEINE ENERGIE</div>
          <div class="hearts-container">
            <transition-group name="heart-break">
              <span v-for="n in lives" :key="n" class="heart">❤️</span>
            </transition-group>
          </div>
        </div>
        
        <div class="boss-timer" :class="{ critical: timeLeft < 20 }">
          <div class="timer-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" class="bg-ring" />
              <circle 
                cx="50" cy="50" r="45" 
                class="progress-ring" 
                :stroke-dasharray="283" 
                :stroke-dashoffset="283 * (1 - timePercent / 100)"
              />
            </svg>
            <span class="timer-value">{{ timeLeft }}</span>
          </div>
        </div>
      </div>

      <div class="arena-stage">
        <transition name="scale-fade">
          <div v-if="activeTaunt" class="boss-taunt">
            {{ activeTaunt }}
          </div>
        </transition>

        <div class="boss-container">
          <transition name="projectile-fly">
            <div v-if="isAttacking" class="magic-projectile">🔥</div>
          </transition>

          <div class="boss-aura-wrapper">
            <div class="aura-waves"></div>
            <img 
              src="@/assets/boss_idle.webp" 
              class="boss-figure" 
              :class="{ damaged: showDamage }" 
              alt="Boss"
            />
          </div>
          <div class="shadow-portal"></div>
        </div>
      </div>

      <div class="spell-input slide-up">
        <div class="spell-header">
          <span class="rune">⚡</span> CODE-ZAUBER <span class="rune">⚡</span>
        </div>
        <div class="spell-body">
          <div class="quest-text">// {{ bossData.task.question }}</div>
          <div class="input-group">
            <input 
              ref="inputRef"
              v-model="userCode" 
              class="magic-input" 
              type="text" 
              placeholder="Forme deinen Code..." 
              spellcheck="false"
              autocomplete="off"
              @keydown.enter="triggerAttack"
            />
            <button class="cast-btn" @click="triggerAttack">
              FEUER!
            </button>
          </div>
        </div>
      </div>

    </div>

    <div v-else class="result-layer">
      <div class="victory-seal pop-in" :class="phase">
        <div class="seal-icon">{{ phase === 'win' ? '🏆' : '💀' }}</div>
        <h1 class="seal-title">{{ phase === 'win' ? 'LEGENDÄR!' : 'BESIEGT' }}</h1>
        <p class="seal-desc">
          {{ phase === 'win' ? 'Du hast die Prüfung gemeistert.' : 'Deine Konzentration war zu schwach.' }}
        </p>
        <button class="epic-btn" @click="handleResultAction">
          {{ phase === 'win' ? 'WEITERREISEN' : 'WIEDERAUFSTEHEN' }}
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

// STATE
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
const isAttacking = ref(false); // Для анимации снаряда

let timerInterval = null;
let tauntInterval = null;
let typeInterval = null;

// COMPUTED
const timePercent = computed(() => (timeLeft.value / (props.bossData.timeSeconds || 120)) * 100);

const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60);
  const s = timeLeft.value % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
});

// LIFECYCLE
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

// Random Fireflies
const getFireflyStyle = (n) => ({
  top: Math.random() * 100 + '%',
  left: Math.random() * 100 + '%',
  animationDelay: Math.random() * 5 + 's',
  animationDuration: 3 + Math.random() * 5 + 's'
});

// DIALOG
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

// FIGHT
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
  tauntInterval = setInterval(() => {
    if (Math.random() > 0.5 && props.bossData.taunts) {
      activeTaunt.value = props.bossData.taunts[Math.floor(Math.random() * props.bossData.taunts.length)];
      setTimeout(() => activeTaunt.value = null, 3000);
    }
  }, 4500);
}

// АНИМАЦИЯ АТАКИ + ПРОВЕРКА
function triggerAttack() {
  if (!userCode.value) return;
  
  const regex = props.bossData.task.correctRegex;
  const isCorrect = regex.test(userCode.value.trim());

  if (isCorrect) {
    // Запускаем снаряд
    isAttacking.value = true;
    setTimeout(() => {
      isAttacking.value = false;
      victory();
    }, 600); // Ждем пока долетит снаряд (600ms)
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
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap');

/* === ГЛОБАЛЬНЫЙ КОНТЕЙНЕР === */
.boss-battle-container {
  width: 100%; height: 100%; position: relative; overflow: hidden;
  background-color: #1a0b2e; /* Темно-фиолетовый мистический */
  color: #fff;
  font-family: 'Cinzel', serif;
}

/* === ФОН (MYSTIC) === */
.mystic-bg {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background: radial-gradient(circle at bottom, #2d1b4e 0%, #0d0221 100%);
}
.fog-layer {
  position: absolute; inset: 0; opacity: 0.3;
  background: url('https://www.transparenttextures.com/patterns/foggy-birds.png');
  animation: fogMove 60s linear infinite;
}
.layer-2 { animation-direction: reverse; animation-duration: 80s; opacity: 0.2; }

/* Светлячки */
.firefly {
  position: absolute; width: 4px; height: 4px; background: #ffd700;
  border-radius: 50%; box-shadow: 0 0 10px #ffd700;
  animation: fireflyFloat linear infinite;
}

/* Вспышка урона */
.crit-flash {
  position: absolute; inset: 0; background: #ff0055; opacity: 0; transition: opacity 0.1s;
  mix-blend-mode: hard-light; z-index: 100;
}
.crit-flash.active { opacity: 0.6; }

/* === ИНТРО (MANDALA SUMMON) === */
.intro-layer {
  position: absolute; inset: 0; z-index: 50;
  background: rgba(13, 2, 33, 0.9); backdrop-filter: blur(8px);
  display: flex; flex-direction: column; justify-content: center; align-items: center;
}
.boss-summon-circle {
  position: relative; width: 300px; height: 300px;
  display: flex; justify-content: center; align-items: center;
  margin-bottom: 40px;
}
.mandala {
  position: absolute; inset: 0; border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 50%;
}
.mandala.outer {
  border: 4px dashed #ffd700; animation: spin 20s linear infinite;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.2);
}
.mandala.inner {
  width: 70%; height: 70%; top: 15%; left: 15%;
  border: 2px solid #ff0055; animation: spin 10s linear infinite reverse;
}
.boss-portrait.floating {
  width: 80%; height: 80%; object-fit: contain; z-index: 2;
  filter: drop-shadow(0 0 20px rgba(255, 0, 85, 0.5));
  animation: float 3s ease-in-out infinite;
}

.dialog-scroll {
  width: 90%; max-width: 500px; background: #fff8e1; color: #3e2723;
  padding: 30px; border-radius: 4px;
  border-top: 5px solid #d32f2f; border-bottom: 5px solid #d32f2f;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5); text-align: center;
  position: relative;
}
.scroll-header { border-bottom: 1px solid #d32f2f; padding-bottom: 10px; margin-bottom: 15px; }
.boss-title { font-size: 0.8rem; color: #d32f2f; letter-spacing: 3px; font-weight: bold; }
.boss-name { font-size: 2rem; margin: 5px 0; }
.dialog-text { font-family: 'JetBrains Mono', monospace; font-size: 1.1rem; line-height: 1.5; min-height: 60px; }
.scroll-footer {
  margin-top: 20px; font-weight: bold; color: #d32f2f; font-size: 0.9rem;
  animation: pulse 1.5s infinite; cursor: pointer;
}

/* === HUD (BATTLE) === */
.fight-layer {
  position: relative; z-index: 10; width: 100%; height: 100%;
  display: flex; flex-direction: column; padding: 20px;
}
.battle-hud {
  display: flex; justify-content: space-between; align-items: center;
  width: 100%; max-width: 700px; margin: 0 auto 20px;
}
.stat-label { font-size: 0.7rem; color: #ffd700; letter-spacing: 2px; margin-bottom: 5px; opacity: 0.8; }
.hearts-container { display: flex; gap: 8px; font-size: 2rem; filter: drop-shadow(0 0 5px #ff0055); }

/* Крутой таймер */
.boss-timer { position: relative; width: 80px; height: 80px; }
.timer-ring { width: 100%; height: 100%; position: relative; }
.timer-ring svg { transform: rotate(-90deg); width: 100%; height: 100%; }
.bg-ring { fill: none; stroke: rgba(255,255,255,0.1); stroke-width: 6; }
.progress-ring { 
  fill: none; stroke: #00e5ff; stroke-width: 6; stroke-linecap: round;
  transition: stroke-dashoffset 1s linear;
}
.boss-timer.critical .progress-ring { stroke: #ff0055; filter: drop-shadow(0 0 10px #ff0055); }
.timer-value {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  font-family: 'JetBrains Mono'; font-size: 1.5rem; font-weight: bold;
}

/* === АРЕНА И БОСС === */
.arena-stage {
  flex: 1; display: flex; justify-content: center; align-items: flex-end;
  position: relative; padding-bottom: 40px;
}

.boss-container { position: relative; width: 300px; height: 300px; z-index: 5; }
.boss-figure {
  width: 100%; height: 100%; object-fit: contain;
  filter: drop-shadow(0 0 15px rgba(100, 0, 255, 0.4));
  animation: float 4s ease-in-out infinite;
}
.boss-figure.damaged {
  filter: brightness(2) sepia(1) hue-rotate(-50deg) saturate(300%);
  animation: shake 0.4s;
}

/* Магическая Аура */
.boss-aura-wrapper { position: relative; width: 100%; height: 100%; }
.aura-waves {
  position: absolute; inset: -20px; border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(138, 43, 226, 0.3);
  animation: pulse 3s infinite;
}
.shadow-portal {
  position: absolute; bottom: 0; left: 10%; width: 80%; height: 20px;
  background: radial-gradient(ellipse, #000 0%, transparent 70%);
  opacity: 0.6; transform: scaleY(0.5);
}

/* Снаряд (Атака) */
.magic-projectile {
  position: absolute; bottom: -100px; left: 50%; font-size: 3rem;
  transform: translateX(-50%); z-index: 20;
  text-shadow: 0 0 20px #ff9900;
}

/* Насмешка */
.boss-taunt {
  position: absolute; top: -40px; left: 50%; transform: translateX(-50%);
  background: rgba(0,0,0,0.8); border: 1px solid #ffd700; color: #ffd700;
  padding: 10px 20px; font-weight: bold; border-radius: 4px;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3); white-space: nowrap; z-index: 10;
}

/* === SPELL INPUT (TERMINAL) === */
.spell-input {
  width: 100%; max-width: 650px; margin: 0 auto;
  background: #150529; border: 2px solid #9d4edd; border-radius: 12px;
  box-shadow: 0 0 30px rgba(157, 78, 221, 0.2); z-index: 20;
}
.spell-header {
  background: #240046; padding: 10px; text-align: center;
  color: #e0aaff; font-size: 0.9rem; letter-spacing: 2px;
  border-bottom: 1px solid #9d4edd;
}
.rune { color: #ffd700; margin: 0 10px; }
.spell-body { padding: 20px; }
.quest-text { color: #c77dff; font-family: 'JetBrains Mono'; margin-bottom: 15px; font-size: 1rem; }
.input-group { display: flex; gap: 10px; }
.magic-input {
  flex: 1; background: #3c096c; border: 1px solid #5a189a; border-radius: 6px;
  color: #fff; font-family: 'JetBrains Mono'; font-size: 1.1rem; padding: 12px;
  outline: none; transition: all 0.3s;
}
.magic-input:focus { border-color: #e0aaff; box-shadow: 0 0 10px #e0aaff; }
.cast-btn {
  background: #ff9100; border: none; padding: 0 25px; border-radius: 6px;
  color: #fff; font-weight: bold; font-family: 'Cinzel'; font-size: 1.1rem;
  cursor: pointer; transition: transform 0.1s;
}
.cast-btn:active { transform: scale(0.95); }

/* === RESULT === */
.result-layer {
  position: absolute; inset: 0; background: rgba(13, 2, 33, 0.95); z-index: 100;
  display: flex; justify-content: center; align-items: center;
}
.victory-seal {
  text-align: center; border: 4px double #ffd700; padding: 50px;
  background: #1a0b2e; border-radius: 8px; box-shadow: 0 0 60px rgba(255, 215, 0, 0.4);
  width: 90%; max-width: 450px;
}
.victory-seal.lose { border-color: #ff0055; box-shadow: 0 0 60px rgba(255, 0, 85, 0.4); }
.seal-icon { font-size: 4rem; margin-bottom: 20px; }
.seal-title { font-size: 2.5rem; margin: 0; letter-spacing: 4px; color: #ffd700; }
.seal-desc { color: #e0e0e0; font-family: 'JetBrains Mono'; margin: 20px 0 30px; }
.epic-btn {
  background: transparent; border: 2px solid #ffd700; color: #ffd700;
  padding: 15px 40px; font-weight: bold; font-size: 1.2rem; cursor: pointer;
  transition: all 0.3s; font-family: 'Cinzel';
}
.epic-btn:hover { background: #ffd700; color: #000; box-shadow: 0 0 20px #ffd700; }

/* === ANIMATIONS === */
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 50% { opacity: 0.5; } }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
@keyframes fogMove { from { background-position: 0 0; } to { background-position: 1000px 0; } }
@keyframes fireflyFloat { 
  0% { transform: translate(0, 0); opacity: 0; } 
  50% { opacity: 1; } 
  100% { transform: translate(50px, -50px); opacity: 0; } 
}

/* Анимация полета снаряда */
.projectile-fly-enter-active { transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
.projectile-fly-enter-from { opacity: 0; transform: translateY(100px) scale(0.5); }
.projectile-fly-leave-to { opacity: 0; transform: translateY(-300px) scale(2); }

.pop-in { animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes popIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }

.slide-down { animation: slideDown 0.8s ease-out; }
@keyframes slideDown { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.slide-up { animation: slideUp 0.8s ease-out; }
@keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.scale-fade-enter-active, .scale-fade-leave-active { transition: all 0.3s; }
.scale-fade-enter-from { opacity: 0; transform: translateY(10px) scale(0.8); }
</style>