<template>
  <div class="boss-battle-container">

    <div class="mystic-bg">
      <div class="fog-layer layer-1"></div>
      <div class="fog-layer layer-2"></div>
      <div class="particles">
        <span v-for="n in 20" :key="n" class="firefly" :style="getFireflyStyle(n)"></span>
      </div>

      <div class="crit-flash" :class="{ active: showFlash }"></div>

      <div v-if="hitBurst" class="hit-burst">
        <span v-for="n in 10" :key="n" class="spark" :style="getSparkStyle(n)"></span>
      </div>
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
          <div class="hearts-container player">
            <transition-group name="heart-break">
              <span v-for="n in lives" :key="'p'+n" class="heart">❤️</span>
            </transition-group>
          </div>
        </div>

        <div class="boss-stats">
          <div class="stat-label boss-label">BOSS-ESSENZ</div>
          <div class="hearts-container boss">
            <span v-for="n in bossMaxHp" :key="'b'+n" class="boss-heart">
              {{ n <= bossHp ? '💠' : '▫️' }}
            </span>
          </div>
          <div class="boss-stage">
            Treffer: {{ bossMaxHp - bossHp }} / {{ bossMaxHp }}
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

          <transition name="float-pop">
            <div v-if="floatingDmg" class="floating-dmg">-1</div>
          </transition>

          <div class="boss-aura-wrapper">
            <div class="aura-waves"></div>
            <img
              src="@/assets/boss_idle.webp"
              class="boss-figure"
              :class="{ damaged: bossDamaged }"
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
          <div class="quest-text">// {{ currentBossTask?.question }}</div>

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

          <div class="hint-line" v-if="currentBossTask?.hint">
            Tipp: <span>{{ currentBossTask.hint }}</span>
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

const emit = defineEmits(['level-completed', 'win']);

const phase = ref('intro');

const lives = ref(props.bossData.health || 3);
const timeLeft = ref(props.bossData.timeSeconds || 120);

const userCode = ref('');
const inputRef = ref(null);

const currentDialogIndex = ref(0);
const currentDialogText = ref('');
const isTyping = ref(false);

const activeTaunt = ref(null);

const isAttacking = ref(false);

const bossDamaged = ref(false);
const showFlash = ref(false);
const floatingDmg = ref(false);
const hitBurst = ref(false);

let timerInterval = null;
let tauntInterval = null;
let typeInterval = null;


const bossTasks = computed(() => {

  if (Array.isArray(props.bossData.tasks) && props.bossData.tasks.length) return props.bossData.tasks;
  if (props.bossData.task) return [props.bossData.task];
  return [];
});

const taskIndex = ref(0);
const bossMaxHp = computed(() => bossTasks.value.length || 3);
const bossHp = ref(bossMaxHp.value);

const currentBossTask = computed(() => bossTasks.value[taskIndex.value]);


const timePercent = computed(() => {
  const total = props.bossData.timeSeconds || 120;
  return (timeLeft.value / total) * 100;
});


onMounted(() => startDialog());
onUnmounted(() => clearIntervals());

function clearIntervals() {
  clearInterval(timerInterval);
  clearInterval(tauntInterval);
  clearInterval(typeInterval);
}


const getFireflyStyle = () => ({
  top: Math.random() * 100 + '%',
  left: Math.random() * 100 + '%',
  animationDelay: Math.random() * 5 + 's',
  animationDuration: 3 + Math.random() * 5 + 's'
});

const getSparkStyle = (n) => {
  const angle = (Math.PI * 2 * n) / 10;
  const dist = 30 + Math.random() * 35;
  const x = Math.cos(angle) * dist;
  const y = Math.sin(angle) * dist;
  return {
    '--x': `${x}px`,
    '--y': `${y}px`,
    animationDelay: (Math.random() * 0.05) + 's'
  };
};


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

function startFight() {
  phase.value = 'fight';

  timeLeft.value = props.bossData.timeSeconds || 120;
  lives.value = props.bossData.health || 3;
  userCode.value = '';

  taskIndex.value = 0;
  bossHp.value = bossMaxHp.value;

  timerInterval = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) gameOver();
  }, 1000);

  startBehavior();
  setTimeout(() => inputRef.value?.focus(), 200);
}

function startBehavior() {
  tauntInterval = setInterval(() => {
    if (Math.random() > 0.35 && props.bossData.taunts?.length) {
      activeTaunt.value = props.bossData.taunts[Math.floor(Math.random() * props.bossData.taunts.length)];
      setTimeout(() => (activeTaunt.value = null), 2800);
    }
  }, 6500);
}
function showTauntFrom(list, fallbackList = []) {
  const arr = Array.isArray(list) && list.length ? list : fallbackList;
  if (!arr.length) return;

  activeTaunt.value = arr[Math.floor(Math.random() * arr.length)];
  setTimeout(() => (activeTaunt.value = null), 2400);
}

function triggerAttack() {
  if (!userCode.value || !currentBossTask.value?.correctRegex) return;

  const regex = currentBossTask.value.correctRegex;
  const isCorrect = regex.test(userCode.value.trim());

  if (isCorrect) {
    isAttacking.value = true;


    setTimeout(() => {
      isAttacking.value = false;
      damageBoss();
    }, 600);
  } else {
    damagePlayer();
  }
}

function damageBoss() {
  bossDamaged.value = true;
  showFlash.value = true;
  floatingDmg.value = true;
  hitBurst.value = true;

  if (navigator.vibrate) navigator.vibrate(60);
  showTauntFrom(props.bossData.tauntsOnHit, props.bossData.taunts);
  setTimeout(() => (bossDamaged.value = false), 260);
  setTimeout(() => (showFlash.value = false), 140);
  setTimeout(() => (floatingDmg.value = false), 520);
  setTimeout(() => (hitBurst.value = false), 420);

  bossHp.value = Math.max(0, bossHp.value - 1);
  userCode.value = '';

  if (bossHp.value <= 0) {
    victory();
    return;
  }

  taskIndex.value = Math.min(taskIndex.value + 1, bossTasks.value.length - 1);

  setTimeout(() => inputRef.value?.focus(), 180);
}

function damagePlayer() {
  showFlash.value = true;
  lives.value--;
  userCode.value = '';

  if (navigator.vibrate) navigator.vibrate(140);
  showTauntFrom(props.bossData.tauntsOnMiss, props.bossData.taunts);

  setTimeout(() => (showFlash.value = false), 180);

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
    emit('win');
  } else {
    phase.value = 'intro';
    currentDialogIndex.value = 0;
    lives.value = props.bossData.health || 3;
    startDialog();
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap');

.boss-battle-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: #1a0b2e;
  color: #fff;
  font-family: 'Cinzel', serif;
}

.mystic-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(circle at bottom, #2d1b4e 0%, #0d0221 100%);
}

.fog-layer {
  position: absolute;
  inset: 0;
  opacity: 0.3;
  background: url('https://www.transparenttextures.com/patterns/foggy-birds.png');
  animation: fogMove 60s linear infinite;
}

.layer-2 {
  animation-direction: reverse;
  animation-duration: 80s;
  opacity: 0.2;
}

.firefly {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #ffd700;
  border-radius: 50%;
  box-shadow: 0 0 10px #ffd700;
  animation: fireflyFloat linear infinite;
}

.crit-flash {
  position: absolute;
  inset: 0;
  background: #ff0055;
  opacity: 0;
  transition: opacity 0.12s;
  mix-blend-mode: hard-light;
  z-index: 100;
}
.crit-flash.active { opacity: 0.45; }

.hit-burst {
  position: absolute;
  left: 50%;
  top: 48%;
  transform: translate(-50%, -50%);
  z-index: 120;
}
.spark {
  position: absolute;
  width: 10px;
  height: 2px;
  background: #ffd700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
  transform: translate(0,0);
  animation: sparkOut 0.35s ease-out forwards;
  border-radius: 2px;
}

.intro-layer {
  position: absolute;
  inset: 0;
  z-index: 50;
  background: rgba(13, 2, 33, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.boss-summon-circle {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
}
.mandala {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 50%;
}
.mandala.outer {
  border: 4px dashed #ffd700;
  animation: spin 20s linear infinite;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.2);
}
.mandala.inner {
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
  border: 2px solid #ff0055;
  animation: spin 10s linear infinite reverse;
}
.boss-portrait.floating {
  width: 80%;
  height: 80%;
  object-fit: contain;
  z-index: 2;
  filter: drop-shadow(0 0 20px rgba(255, 0, 85, 0.5));
  animation: float 3s ease-in-out infinite;
}

.dialog-scroll {
  width: 90%;
  max-width: 500px;
  background: #fff8e1;
  color: #3e2723;
  padding: 30px;
  border-radius: 4px;
  border-top: 5px solid #d32f2f;
  border-bottom: 5px solid #d32f2f;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  text-align: center;
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

.fight-layer {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.battle-hud {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: center;
  gap: 18px;
  width: 100%;
  max-width: 860px;
  margin: 0 auto 20px;
}

.stat-label {
  font-size: 0.7rem;
  color: #ffd700;
  letter-spacing: 2px;
  margin-bottom: 5px;
  opacity: 0.85;
}
.boss-label { text-align: center; }

.hearts-container {
  display: flex;
  gap: 8px;
  font-size: 1.8rem;
  filter: drop-shadow(0 0 5px rgba(255, 0, 85, 0.35));
}
.hearts-container.boss {
  justify-content: center;
  filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.25));
}
.boss-heart { font-size: 1.4rem; }
.boss-stage {
  text-align: center;
  font-family: 'JetBrains Mono';
  font-size: 0.85rem;
  opacity: 0.85;
  margin-top: 4px;
}

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

.arena-stage {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
  padding-bottom: 40px;
}

.boss-container {
  position: relative;
  width: 300px;
  height: 300px;
  z-index: 5;
}

.boss-figure {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 0 15px rgba(100, 0, 255, 0.4));
  animation: float 4s ease-in-out infinite;
}
.boss-figure.damaged {
  filter: brightness(2) sepia(1) hue-rotate(-40deg) saturate(320%);
  animation: bossHit 0.28s;
}

.floating-dmg {
  position: absolute;
  left: 50%;
  top: 25%;
  transform: translate(-50%, -50%);
  font-family: 'JetBrains Mono';
  font-size: 2.4rem;
  color: #ffd700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
  z-index: 30;
}

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

.magic-projectile {
  position: absolute;
  bottom: -100px;
  left: 50%;
  font-size: 3rem;
  transform: translateX(-50%);
  z-index: 20;
  text-shadow: 0 0 20px #ff9900;
}

.boss-taunt {
  position: absolute; top: -40px; left: 50%; transform: translateX(-50%);
  background: rgba(0,0,0,0.8); border: 1px solid #ffd700; color: #ffd700;
  padding: 10px 20px; font-weight: bold; border-radius: 4px;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3); white-space: nowrap; z-index: 10;
}

.spell-input {
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  background: #150529;
  border: 2px solid #9d4edd;
  border-radius: 12px;
  box-shadow: 0 0 30px rgba(157, 78, 221, 0.2);
  z-index: 20;
}
.spell-header {
  background: #240046;
  padding: 10px;
  text-align: center;
  color: #e0aaff;
  font-size: 0.9rem;
  letter-spacing: 2px;
  border-bottom: 1px solid #9d4edd;
}
.rune { color: #ffd700; margin: 0 10px; }
.spell-body { padding: 20px; }
.quest-text {
  color: #c77dff;
  font-family: 'JetBrains Mono';
  margin-bottom: 15px;
  font-size: 1rem;
}
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

.hint-line {
  margin-top: 12px;
  font-family: 'JetBrains Mono';
  font-size: 0.9rem;
  opacity: 0.9;
  color: #ffd700;
}
.hint-line span { color: #fff; opacity: 0.95; }

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

.projectile-fly-enter-active, .projectile-fly-leave-active { transition: all 0.6s ease; }
.projectile-fly-enter-from { transform: translate(-50%, 0); opacity: 0; }
.projectile-fly-enter-to { transform: translate(-50%, -240px); opacity: 1; }
.projectile-fly-leave-from { opacity: 1; }
.projectile-fly-leave-to { opacity: 0; }

.float-pop-enter-active, .float-pop-leave-active { transition: all 0.5s ease; }
.float-pop-enter-from { transform: translate(-50%, -50%) scale(0.6); opacity: 0; }
.float-pop-enter-to { transform: translate(-50%, -90%) scale(1); opacity: 1; }
.float-pop-leave-to { transform: translate(-50%, -130%) scale(0.8); opacity: 0; }

@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 50% { opacity: 0.55; } }
@keyframes bossHit {
  0% { transform: translateX(0) scale(1); }
  35% { transform: translateX(-10px) scale(1.02); }
  70% { transform: translateX(10px) scale(1.02); }
  100% { transform: translateX(0) scale(1); }
}
@keyframes fogMove { from { background-position: 0 0; } to { background-position: 1000px 0; } }
@keyframes fireflyFloat {
  0% { transform: translate(0, 0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translate(50px, -50px); opacity: 0; }
}
@keyframes sparkOut {
  from { transform: translate(0,0) rotate(0deg); opacity: 1; }
  to { transform: translate(var(--x), var(--y)) rotate(18deg); opacity: 0; }
}
</style>
