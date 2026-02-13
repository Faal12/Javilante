<!-- src/views/LevelPage.vue -->
<template>
  <div class="level-page" :style="pageStyle" :class="pageClass">

    <!-- ✅ Boss мод остаётся как есть -->
    <BossBattle
      v-if="isBossMode"
      :bossData="levelData.bossData"
      @win="handleBossWin"
    />

    <template v-else>
      <!-- ✅ КАРТА 1: твой Sakura decor (НЕ ТРОГАЮ анимации/структуру) -->
      <div v-if="store.currentMapId === 1" class="sakura-decor">
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

      <!-- ✅ КАРТА 2: “каждый уровень = перформанс” (Map1 не трогаем) -->
      <div v-else class="bamboo-decor" :class="map2DecorClass">
        <!-- overlays for mood -->
        <div class="map2-colorgrade" :style="map2Fx.colorgradeStyle"></div>
        <div class="map2-motif" :class="map2Fx.motifClass"></div>
        <div class="map2-atmo" :class="map2Fx.atmoClass"></div>
        <div class="map2-setpiece" :class="map2Fx.setpieceClass"></div>

        <!-- Dense bamboo background -->
        <div class="bamboo-field">
          <div
            v-for="(style, index) in bambooStalks"
            :key="'bamboo-'+index"
            class="bamboo-stalk"
            :style="style"
          >
            <svg class="bamboo-svg" viewBox="0 0 240 900" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <g opacity="0.95">
                <rect x="90" y="0" width="60" height="900" rx="28" fill="#2e7d32"/>
                <rect x="92" y="80" width="56" height="16" rx="8" fill="#1b5e20"/>
                <rect x="92" y="220" width="56" height="16" rx="8" fill="#1b5e20"/>
                <rect x="92" y="360" width="56" height="16" rx="8" fill="#1b5e20"/>
                <rect x="92" y="500" width="56" height="16" rx="8" fill="#1b5e20"/>
                <rect x="92" y="640" width="56" height="16" rx="8" fill="#1b5e20"/>
                <rect x="92" y="780" width="56" height="16" rx="8" fill="#1b5e20"/>
              </g>
            </svg>
          </div>

          <div class="bamboo-haze" :style="map2Fx.hazeStyle"></div>
        </div>

        <div class="floating-leaves" :class="map2Fx.particleClass">
          <span
            v-for="(style, index) in leavesStyles"
            :key="index"
            class="leaf"
            :style="style"
          >{{ map2Fx.particleEmoji }}</span>
        </div>

        <div class="map2-stamp" :class="map2Fx.stampClass">
          {{ map2Fx.stampEmoji }}
        </div>
      </div>

      <div v-if="step === 'theory'" class="view-container">
        <div class="glass-panel theory-panel">
          <div class="panel-header">
            <div class="asian-seal" :class="sealClass">
              <span>{{ levelData?.id }}</span>
              <i v-if="store.currentMapId === 2" class="seal-icon">{{ map2Fx.stampEmoji }}</i>
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
            <button class="primary-btn glow" :class="accentBtnClass" @click="startTasks">
              <span class="icon">{{ store.currentMapId === 2 ? map2Fx.particleEmoji : '🌸' }}</span> Wissen testen
            </button>
          </div>
        </div>
      </div>

      <div v-else class="view-container">
        <div class="glass-panel game-panel">
          <div class="game-top">
            <span class="progress-pill" :class="accentPillClass">Aufgabe {{ step }} / {{ levelData?.tasks.length }}</span>
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
            <div class="result-icon">{{ store.currentMapId === 2 ? map2Fx.stampEmoji : '🏮' }}</div>
            <h2>Ausgezeichnet!</h2>
            <p>Du hast diese Lektion gemeistert.</p>

            <div class="big-stars">
              <svg width="0" height="0" style="position: absolute; visibility: hidden;">
                <defs>
                  <linearGradient id="bigGold" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FFD700" />
                    <stop offset="100%" stop-color="#FF6F00" />
                  </linearGradient>
                </defs>
              </svg>

              <svg v-for="n in 3" :key="n" class="big-star-svg" :class="{ filled: n <= calcStars() }" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
              </svg>
            </div>

            <button class="primary-btn success" @click="finishLevel">
              Weiter zur Karte
            </button>
          </div>

          <div v-if="step === 'gameover'" class="result-screen lose">
            <div class="result-icon">🐼💔</div>
            <h2>Oh nein!</h2>
            <p>Deine Konzentration hat nachgelassen.</p>
            <p class="sub-text">Lies die Theorie noch einmal und versuche es erneut.</p>
            <button class="primary-btn fail" @click="restartTheory">
              Zurück zur Theorie
            </button>
          </div>

          <div class="game-actions" v-if="typeof step === 'number'">
            <div v-if="isError" class="feedback shake">
              ❌ Falsch! Ein Leben verloren.
            </div>
            <button class="primary-btn" :class="accentBtnClass" @click="checkAnswer">
              Überprüfen
            </button>
          </div>

        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, onMounted } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import BossBattle from '@/components/BossBattle.vue';

const route = useRoute();
const router = useRouter();
const store = useGameStore();

const levelId = route.params.id;
const levelData = computed(() => store.activeLevelData(levelId));
const isBossMode = computed(() => levelData.value?.isBoss);

const step = ref('theory');
const lives = ref(3);
const userAnswerArray = ref([]);
const userAnswerString = ref("");
const isError = ref(false);

const currentTask = computed(() => {
  if (typeof step.value === 'number') return levelData.value?.tasks[step.value - 1];
  return null;
});

/* ✅ темы карты */
const mapThemeClass = computed(() => (store.currentMapId === 2 ? 'map2' : 'map1'));

/* ✅ key темы для Map2: 1..6 (boss живёт отдельно) */
const map2ThemeKey = computed(() => {
  if (store.currentMapId !== 2) return 1;
  const id = parseInt(levelId);
  // нормальные уровни 1..6, если вдруг что — зажимаем
  const clamped = Math.max(1, Math.min(6, Number.isFinite(id) ? id : 1));
  return clamped;
});

/* ✅ классы для bamboo decor (оставляем v1..v4 как “мелкая вариативность”, плюс t1..t6 как тема) */
const map2DecorClass = computed(() => {
  if (store.currentMapId !== 2) return '';
  const id = parseInt(levelId);
  const v = ((id - 1) % 4) + 1;
  return `v${v} t${map2ThemeKey.value}`;
});

/* ✅ ДИНАМИЧЕСКИЙ ФОН: НЕ ломаем Map1 */
const bgStyle = computed(() => {
  const id = parseInt(levelId);

  const gradientsMap1 = {
    1: 'radial-gradient(circle at center, #fff3e0 0%, #ffccbc 100%)',
    2: 'radial-gradient(circle at center, #e0f2f1 0%, #80cbc4 100%)',
    3: 'radial-gradient(circle at center, #e3f2fd 0%, #64b5f6 100%)',
    4: 'radial-gradient(circle at center, #f3e5f5 0%, #ba68c8 100%)',
    5: 'radial-gradient(circle at center, #fff8e1 0%, #ffd54f 100%)',
    6: 'radial-gradient(circle at center, #263238 0%, #000000 100%)'
  };

  const gradientsMap2 = {
    1: 'radial-gradient(circle at 50% 35%, #f1f8e9 0%, #c5e1a5 60%, #8bc34a 100%)',
    2: 'radial-gradient(circle at 50% 35%, #e8f5e9 0%, #a5d6a7 60%, #66bb6a 100%)',
    3: 'radial-gradient(circle at 50% 35%, #e0f7fa 0%, #b2ebf2 60%, #4dd0e1 100%)',
    4: 'radial-gradient(circle at 50% 35%, #f9fbe7 0%, #dcedc8 60%, #9ccc65 100%)',
    5: 'radial-gradient(circle at 50% 35%, #fffde7 0%, #fff9c4 60%, #cddc39 100%)',
    6: 'radial-gradient(circle at 50% 35%, #e8f5e9 0%, #c8e6c9 60%, #43a047 100%)',
    7: 'radial-gradient(circle at center, #102018 0%, #000000 100%)'
  };

  const chosen = store.currentMapId === 2 ? gradientsMap2 : gradientsMap1;
  return { background: chosen[id] || (store.currentMapId === 2 ? gradientsMap2[1] : gradientsMap1[1]) };
});

/* ✅ “перформанс” + акцент + форма печати/кнопок (ТОЛЬКО Map2) */
const map2Fx = computed(() => {
  if (store.currentMapId !== 2) {
    return {
      particleEmoji: '🍃',
      particleClass: '',
      stampEmoji: '🍃',
      stampClass: '',
      motifClass: '',
      atmoClass: '',
      setpieceClass: '',
      hazeStyle: {},
      colorgradeStyle: {},
      cssVars: {}
    };
  }

  const themes = {
    1: {
      stampEmoji: '🥋',
      stampClass: 'dojo',
      particleEmoji: '🍃',
      particleClass: 'p-soft',
      motifClass: 'motif-katana',
      atmoClass: 'atmo-sunrays',
      setpieceClass: 'setpiece-torii',
      hazeStyle: {
        background:
          'radial-gradient(circle at 25% 35%, rgba(118,255,3,0.18), rgba(118,255,3,0.00) 58%),' +
          'radial-gradient(circle at 78% 72%, rgba(0,230,118,0.14), rgba(0,230,118,0.00) 62%),' +
          'linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.18))'
      },
      colorgradeStyle: { background: 'linear-gradient(180deg, rgba(46,125,50,0.10), rgba(0,0,0,0.06))' },
      cssVars: {
        '--accent': '#2e7d32',
        '--accent-2': '#7cb342',
        '--accent-soft': 'rgba(46,125,50,0.12)',
        '--accent-border': 'rgba(46,125,50,0.22)',
        '--accent-shadow': 'rgba(46,125,50,0.28)'
      }
    },

    2: {
      stampEmoji: '🧩',
      stampClass: 'blocks',
      particleEmoji: '🌿',
      particleClass: 'p-spiral',
      motifClass: 'motif-origami',
      atmoClass: 'atmo-paper',
      setpieceClass: 'setpiece-scroll',
      hazeStyle: {
        background:
          'radial-gradient(circle at 30% 30%, rgba(77,208,225,0.14), rgba(77,208,225,0.00) 55%),' +
          'radial-gradient(circle at 74% 72%, rgba(118,255,3,0.12), rgba(118,255,3,0.00) 60%),' +
          'linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.20))'
      },
      colorgradeStyle: { background: 'linear-gradient(180deg, rgba(77,208,225,0.12), rgba(0,0,0,0.07))' },
      cssVars: {
        '--accent': '#26a69a',
        '--accent-2': '#4dd0e1',
        '--accent-soft': 'rgba(38,166,154,0.12)',
        '--accent-border': 'rgba(38,166,154,0.22)',
        '--accent-shadow': 'rgba(38,166,154,0.26)'
      }
    },

    3: {
      stampEmoji: '🧠',
      stampClass: 'mind',
      particleEmoji: '✨',
      particleClass: 'p-spark',
      motifClass: 'motif-ink',
      atmoClass: 'atmo-ink',
      setpieceClass: 'setpiece-inkblot',
      hazeStyle: {
        background:
          'radial-gradient(circle at 26% 34%, rgba(255,249,196,0.14), rgba(255,249,196,0.00) 55%),' +
          'radial-gradient(circle at 74% 70%, rgba(205,220,57,0.10), rgba(205,220,57,0.00) 60%),' +
          'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.24))'
      },
      colorgradeStyle: { background: 'linear-gradient(180deg, rgba(255,249,196,0.12), rgba(0,0,0,0.09))' },
      cssVars: {
        '--accent': '#6a1b9a',
        '--accent-2': '#ba68c8',
        '--accent-soft': 'rgba(106,27,154,0.12)',
        '--accent-border': 'rgba(106,27,154,0.22)',
        '--accent-shadow': 'rgba(106,27,154,0.26)'
      }
    },

    4: {
      stampEmoji: '⚙️',
      stampClass: 'gear',
      particleEmoji: '🌊',
      particleClass: 'p-drift',
      motifClass: 'motif-wave',
      atmoClass: 'atmo-waves',
      setpieceClass: 'setpiece-koi',
      hazeStyle: {
        background:
          'radial-gradient(circle at 22% 32%, rgba(0,230,118,0.12), rgba(0,230,118,0.00) 58%),' +
          'radial-gradient(circle at 80% 75%, rgba(186,104,200,0.10), rgba(186,104,200,0.00) 62%),' +
          'linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.18))'
      },
      colorgradeStyle: { background: 'linear-gradient(180deg, rgba(79,195,247,0.10), rgba(0,0,0,0.07))' },
      cssVars: {
        '--accent': '#0288d1',
        '--accent-2': '#4fc3f7',
        '--accent-soft': 'rgba(2,136,209,0.12)',
        '--accent-border': 'rgba(2,136,209,0.22)',
        '--accent-shadow': 'rgba(2,136,209,0.25)'
      }
    },

    5: {
      stampEmoji: '📜',
      stampClass: 'scroll',
      particleEmoji: '🍀',
      particleClass: 'p-soft',
      motifClass: 'motif-scroll',
      atmoClass: 'atmo-stamps',
      setpieceClass: 'setpiece-seals',
      hazeStyle: {
        background:
          'radial-gradient(circle at 28% 28%, rgba(255,255,255,0.12), rgba(255,255,255,0.00) 55%),' +
          'radial-gradient(circle at 76% 72%, rgba(205,220,57,0.12), rgba(205,220,57,0.00) 60%),' +
          'linear-gradient(180deg, rgba(0,0,0,0.07), rgba(0,0,0,0.22))'
      },
      colorgradeStyle: { background: 'linear-gradient(180deg, rgba(205,220,57,0.11), rgba(0,0,0,0.08))' },
      cssVars: {
        '--accent': '#c62828',
        '--accent-2': '#ef5350',
        '--accent-soft': 'rgba(198,40,40,0.12)',
        '--accent-border': 'rgba(198,40,40,0.22)',
        '--accent-shadow': 'rgba(198,40,40,0.25)'
      }
    },

    6: {
      stampEmoji: '🐉',
      stampClass: 'dragon',
      particleEmoji: '🔥',
      particleClass: 'p-ember',
      motifClass: 'motif-dragon',
      atmoClass: 'atmo-embers',
      setpieceClass: 'setpiece-dragon',
      hazeStyle: {
        background:
          'radial-gradient(circle at 30% 32%, rgba(239,83,80,0.10), rgba(239,83,80,0.00) 55%),' +
          'radial-gradient(circle at 74% 74%, rgba(118,255,3,0.12), rgba(118,255,3,0.00) 60%),' +
          'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.26))'
      },
      colorgradeStyle: { background: 'linear-gradient(180deg, rgba(239,83,80,0.10), rgba(0,0,0,0.12))' },
      cssVars: {
        '--accent': '#ff6f00',
        '--accent-2': '#ffd54f',
        '--accent-soft': 'rgba(255,111,0,0.12)',
        '--accent-border': 'rgba(255,111,0,0.22)',
        '--accent-shadow': 'rgba(255,111,0,0.26)'
      }
    }
  };

  return themes[map2ThemeKey.value] || themes[1];
});

/* ✅ итоговые классы/стили страницы */
const pageClass = computed(() => [mapThemeClass.value, store.currentMapId === 2 ? `m2-theme-${map2ThemeKey.value}` : ''].join(' ').trim());
const pageStyle = computed(() => ({ ...bgStyle.value, ...(store.currentMapId === 2 ? map2Fx.value.cssVars : {}) }));

/* ✅ классы для “asian-seal” и акцентов UI */
const sealClass = computed(() => {
  if (store.currentMapId !== 2) return '';
  const k = map2ThemeKey.value;
  // разные формы печати
  if (k === 1) return 'seal-round seal-dojo';
  if (k === 2) return 'seal-squircle seal-origami';
  if (k === 3) return 'seal-hex seal-ink';
  if (k === 4) return 'seal-diamond seal-wave';
  if (k === 5) return 'seal-stamp seal-scroll';
  return 'seal-round seal-dragon';
});
const accentBtnClass = computed(() => (store.currentMapId === 2 ? `accent-${map2ThemeKey.value}` : ''));
const accentPillClass = computed(() => (store.currentMapId === 2 ? `accent-pill-${map2ThemeKey.value}` : ''));

/* === ЛОГИКА БОССА === */
const handleBossWin = () => {
  store.completeLevel(parseInt(levelId), 3);

  if (store.currentMapId === 1) {
    if (typeof store.startMapTransition === 'function') {
      store.startMapTransition(2);
    }
  }

  router.push('/map');
};

/* === ОРИГИНАЛЬНАЯ ЛОГИКА === */
const petalsStyles = ref([]);
const leavesStyles = ref([]);
const bambooStalks = ref([]);

const initPetals = () => {
  petalsStyles.value = Array.from({ length: 40 }).map(() => ({
    left: Math.random() * 100 + '%',
    animationDelay: Math.random() * 5 + 's',
    animationDuration: 5 + Math.random() * 5 + 's',
    opacity: 0.4 + Math.random() * 0.6,
    transform: `scale(${0.5 + Math.random()})`
  }));
};

const initLeaves = () => {
  // чуть варьируем по v1..v4, но “перформанс” идёт через atmo/setpiece
  const id = parseInt(levelId);
  const v = ((id - 1) % 4) + 1;

  const count = v === 3 ? 26 : (v === 2 ? 34 : (v === 4 ? 30 : 34));
  const baseDur = v === 1 ? 6 : (v === 2 ? 7 : (v === 3 ? 8 : 6.5));
  const driftX = v === 3 ? 90 : (v === 2 ? 140 : 120);

  leavesStyles.value = Array.from({ length: count }).map(() => ({
    left: Math.random() * 100 + '%',
    animationDelay: Math.random() * 6 + 's',
    animationDuration: (baseDur + Math.random() * 7) + 's',
    opacity: 0.30 + Math.random() * 0.55,
    transform: `scale(${0.55 + Math.random()}) rotate(${Math.random() * 90 - 45}deg)`,
    '--driftX': driftX + 'px'
  }));
};

const initBamboo = () => {
  const count = 24;
  bambooStalks.value = Array.from({ length: count }).map((_, i) => {
    const base = (i / (count - 1)) * 100;
    const jitter = (Math.random() * 8) - 4; // ±4%
    const left = Math.max(-6, Math.min(106, base + jitter));

    const scale = 0.65 + Math.random() * 1.15;
    const opacity = 0.12 + Math.random() * 0.46;

    const blur = Math.random() * 0.9;
    const dur = 7 + Math.random() * 7;
    const delay = Math.random() * 2.5;

    const z = Math.round(1 + scale * 10);

    return {
      left: left + '%',
      '--scale': scale,
      opacity,
      filter: `blur(${blur}px)`,
      animationDuration: dur + 's',
      animationDelay: delay + 's',
      zIndex: z
    };
  });
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
  if (store.currentMapId === 1) initPetals();
  else { initLeaves(); initBamboo(); }

  if (!levelData.value) router.push('/map');
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&display=swap');

.level-page {
  width: 100%;
  height: 100vh;
  font-family: 'Fredoka', sans-serif;
  overflow: hidden;
  position: relative;
  transition: background 1s ease;
  --accent: #d81b60;
  --accent-2: #ff80ab;
  --accent-soft: rgba(216,27,96,0.12);
  --accent-border: rgba(216,27,96,0.22);
  --accent-shadow: rgba(216,27,96,0.30);
  --text-dark: #3e2723;
}

/* ✅ Map2: базовые */
.level-page.map2 {
  --text-dark: #102018;
}

/* === SAKURA DECOR (оставлено без изменений) === */
.sakura-decor {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.branch {
  position: absolute;
  top: -20px;
  width: 600px;
  height: 800px;
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
  position: absolute;
  top: -50px;
  font-size: 20px;
  animation: fall linear infinite;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

@keyframes sway { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(2deg); } }
@keyframes sway-reverse { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-2deg); } }
@keyframes fall { to { transform: translateY(110vh) rotate(720deg) translateX(100px); } }

/* === MAP2: BAMBOO DECOR === */
.bamboo-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

/* overlays */
.map2-colorgrade{
  position:absolute; inset:0;
  z-index: 0;
  pointer-events:none;
  opacity: .9;
}
.map2-motif{
  position:absolute; inset:0;
  z-index: 1;
  pointer-events:none;
  opacity: .7;
}
.map2-motif::before{
  content:"";
  position:absolute;
  right:-10%;
  bottom:-15%;
  width: 70%;
  height: 60%;
  background: radial-gradient(circle at 70% 60%, rgba(255,255,255,0.10), rgba(255,255,255,0) 60%);
  filter: blur(1px);
  mix-blend-mode: soft-light;
}

/* tiny themed hints (very subtle) */
.map2-motif.motif-katana::before{
  background:
    linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0) 60%),
    radial-gradient(circle at 70% 60%, rgba(255,255,255,0.08), rgba(255,255,255,0) 60%);
}
.map2-motif.motif-origami::before{
  background:
    repeating-linear-gradient(135deg, rgba(255,255,255,0.10) 0 10px, rgba(255,255,255,0.00) 10px 26px);
  mix-blend-mode: soft-light;
}
.map2-motif.motif-ink::before{
  background:
    radial-gradient(circle at 55% 55%, rgba(0,0,0,0.10), rgba(0,0,0,0) 60%);
  mix-blend-mode: multiply;
}
.map2-motif.motif-wave::before{
  background:
    repeating-radial-gradient(circle at 50% 90%, rgba(255,255,255,0.10) 0 7px, rgba(255,255,255,0.00) 7px 18px);
  mix-blend-mode: soft-light;
}
.map2-motif.motif-scroll::before{
  background:
    radial-gradient(circle at 30% 35%, rgba(198,40,40,0.10), rgba(198,40,40,0.00) 55%);
  mix-blend-mode: multiply;
}
.map2-motif.motif-dragon::before{
  background:
    radial-gradient(circle at 60% 55%, rgba(255,111,0,0.12), rgba(255,111,0,0.00) 60%),
    radial-gradient(circle at 40% 40%, rgba(255,255,255,0.06), rgba(255,255,255,0.00) 60%);
  mix-blend-mode: screen;
}

/* ✅ Dense bamboo field */
.bamboo-field {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}

.bamboo-stalk {
  position: absolute;
  bottom: -80px;
  width: 240px;
  height: 135%;
  transform-origin: bottom center;
  transform: translateX(-50%) scale(var(--scale, 1));
  animation: bambooSwayVar ease-in-out infinite;
}

.bamboo-svg {
  width: 240px;
  height: 100%;
  filter: drop-shadow(8px 14px 18px rgba(0,0,0,0.18));
}

.bamboo-haze {
  position: absolute;
  inset: 0;
  mix-blend-mode: screen;
  opacity: 0.9;
  z-index: 3;
}

@keyframes bambooSwayVar {
  0%, 100% { transform: translateX(-50%) rotate(0deg) scale(var(--scale, 1)); }
  50% { transform: translateX(-50%) rotate(1.6deg) scale(var(--scale, 1)); }
}

/* Leaves */
.floating-leaves{
  position:absolute; inset:0;
  z-index: 5;
}
.floating-leaves .leaf {
  position: absolute;
  top: -60px;
  font-size: 18px;
  animation: leafFall linear infinite;
  filter: drop-shadow(0 6px 10px rgba(0,0,0,0.12));
}
@keyframes leafFall {
  0%   { transform: translateY(-10vh) translateX(0) rotate(0deg); }
  100% { transform: translateY(110vh) translateX(var(--driftX, 140px)) rotate(540deg); }
}
/* extra feels per particle mode */
.floating-leaves.p-spark .leaf{ filter: drop-shadow(0 6px 14px rgba(0,0,0,0.14)) saturate(1.2); }
.floating-leaves.p-ember .leaf{ filter: drop-shadow(0 8px 16px rgba(0,0,0,0.18)) saturate(1.3); }
.floating-leaves.p-spiral .leaf{ animation-timing-function: cubic-bezier(0.2,0.8,0.2,1); }

/* Map2 stamp */
.map2-stamp{
  position:absolute;
  left: 18px;
  bottom: 18px;
  z-index: 6;
  width: 56px;
  height: 56px;
  display:flex;
  align-items:center;
  justify-content:center;
  background: rgba(255,255,255,0.78);
  border: 2px solid var(--accent-border);
  box-shadow: 0 10px 22px rgba(0,0,0,0.10);
  color: var(--accent);
  font-size: 26px;
  border-radius: 18px;
  transform: rotate(-6deg);
  opacity: .95;
}

/* ✅ Variants per level for Map2 (оставил твои мелкие отличия) */
.bamboo-decor.v1 .bamboo-svg { filter: drop-shadow(8px 14px 18px rgba(0,0,0,0.18)) saturate(1.05); }
.bamboo-decor.v2 .bamboo-svg { filter: drop-shadow(8px 14px 18px rgba(0,0,0,0.18)) hue-rotate(-18deg) contrast(1.05); }
.bamboo-decor.v3 .bamboo-svg { filter: drop-shadow(8px 14px 18px rgba(0,0,0,0.18)) hue-rotate(12deg) saturate(0.95) contrast(1.08); }
.bamboo-decor.v4 .bamboo-svg { filter: drop-shadow(8px 14px 18px rgba(0,0,0,0.18)) hue-rotate(22deg) saturate(1.10); }

/* =========================
   MAP2 PERFORMANCE LAYERS
   ========================= */
.map2-atmo,
.map2-setpiece{
  position:absolute;
  inset:0;
  pointer-events:none;
}

/* --- ATMO --- */
.map2-atmo.atmo-sunrays{ z-index: 1; opacity: .9; }
.map2-atmo.atmo-sunrays::before{
  content:"";
  position:absolute; inset:-20%;
  background:
    conic-gradient(from 200deg,
      rgba(255,255,255,0.12),
      rgba(255,255,255,0.00) 12%,
      rgba(255,255,255,0.10) 22%,
      rgba(255,255,255,0.00) 36%,
      rgba(255,255,255,0.08) 50%,
      rgba(255,255,255,0.00) 68%,
      rgba(255,255,255,0.10) 82%,
      rgba(255,255,255,0.00)
    );
  filter: blur(0.6px);
  animation: m2Rays 10s linear infinite;
  transform-origin: 50% 50%;
  mix-blend-mode: screen;
}
@keyframes m2Rays { to { transform: rotate(360deg); } }

.map2-atmo.atmo-paper{ z-index: 1; opacity: .75; }
.map2-atmo.atmo-paper::before{
  content:"";
  position:absolute; inset:0;
  background:
    repeating-linear-gradient(135deg,
      rgba(255,255,255,0.10) 0 10px,
      rgba(255,255,255,0.00) 10px 26px
    ),
    radial-gradient(circle at 70% 30%, rgba(255,255,255,0.12), rgba(255,255,255,0.00) 55%);
  mix-blend-mode: soft-light;
  animation: m2Paper 7s ease-in-out infinite;
}
@keyframes m2Paper{
  0%,100%{ transform: translateY(0) translateX(0); opacity:.7; }
  50%{ transform: translateY(-10px) translateX(12px); opacity:.9; }
}

.map2-atmo.atmo-ink{ z-index: 1; opacity: .8; }
.map2-atmo.atmo-ink::before{
  content:"";
  position:absolute; inset:-10%;
  background:
    radial-gradient(circle at 25% 70%, rgba(0,0,0,0.14), rgba(0,0,0,0) 52%),
    radial-gradient(circle at 75% 30%, rgba(0,0,0,0.10), rgba(0,0,0,0) 48%),
    radial-gradient(circle at 55% 55%, rgba(0,0,0,0.08), rgba(0,0,0,0) 55%);
  filter: blur(2px);
  mix-blend-mode: multiply;
  animation: m2Ink 8.5s ease-in-out infinite;
}
@keyframes m2Ink{
  0%,100%{ transform: translateY(0) scale(1); }
  50%{ transform: translateY(-14px) scale(1.02); }
}

.map2-atmo.atmo-waves{ z-index: 1; opacity: .7; }
.map2-atmo.atmo-waves::before{
  content:"";
  position:absolute; inset:0;
  background:
    repeating-radial-gradient(circle at 50% 85%,
      rgba(255,255,255,0.10) 0 7px,
      rgba(255,255,255,0.00) 7px 18px
    );
  mix-blend-mode: soft-light;
  animation: m2Waves 6s ease-in-out infinite;
}
@keyframes m2Waves{
  0%,100%{ transform: translateY(0); }
  50%{ transform: translateY(-10px); }
}

.map2-atmo.atmo-stamps{ z-index: 1; opacity: .75; }
.map2-atmo.atmo-stamps::before{
  content:"";
  position:absolute; inset:0;
  background:
    radial-gradient(circle at 22% 32%, rgba(198,40,40,0.10), rgba(198,40,40,0.00) 40%),
    radial-gradient(circle at 70% 60%, rgba(198,40,40,0.08), rgba(198,40,40,0.00) 44%),
    radial-gradient(circle at 55% 20%, rgba(0,0,0,0.06), rgba(0,0,0,0.00) 50%);
  mix-blend-mode: multiply;
  animation: m2Stamps 9s ease-in-out infinite;
}
@keyframes m2Stamps{
  0%,100%{ transform: translateX(0) rotate(0deg); }
  50%{ transform: translateX(14px) rotate(0.6deg); }
}

.map2-atmo.atmo-embers{ z-index: 1; opacity: .9; }
.map2-atmo.atmo-embers::before{
  content:"";
  position:absolute; inset:0;
  background:
    radial-gradient(circle at 25% 80%, rgba(255,140,0,0.10), rgba(255,140,0,0) 55%),
    radial-gradient(circle at 70% 65%, rgba(239,83,80,0.10), rgba(239,83,80,0) 58%),
    radial-gradient(circle at 55% 40%, rgba(255,255,255,0.05), rgba(255,255,255,0) 55%);
  mix-blend-mode: screen;
  animation: m2Embers 5.5s ease-in-out infinite;
}
@keyframes m2Embers{
  0%,100%{ transform: translateY(0); }
  50%{ transform: translateY(-12px); }
}

/* --- SETPIECE --- */
.map2-setpiece{ z-index: 4; opacity: .85; }

.map2-setpiece.setpiece-torii::before{
  content:"";
  position:absolute;
  left: -10%;
  bottom: -8%;
  width: 55%;
  height: 45%;
  background:
    radial-gradient(circle at 30% 70%, rgba(0,0,0,0.16), rgba(0,0,0,0) 60%),
    linear-gradient(180deg, rgba(0,0,0,0.10), rgba(0,0,0,0));
  clip-path: polygon(0 100%, 0 60%, 12% 60%, 12% 78%, 20% 78%, 20% 50%, 80% 50%, 80% 78%, 88% 78%, 88% 60%, 100% 60%, 100% 100%);
  filter: blur(0.6px);
  mix-blend-mode: multiply;
  animation: m2SetpieceFloat 8s ease-in-out infinite;
}

.map2-setpiece.setpiece-scroll::before{
  content:"";
  position:absolute;
  right: -8%;
  top: 12%;
  width: 42%;
  height: 38%;
  background:
    radial-gradient(circle at 10% 50%, rgba(255,255,255,0.22), rgba(255,255,255,0) 55%),
    linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.02));
  border-radius: 28px;
  filter: blur(0.4px);
  mix-blend-mode: soft-light;
  animation: m2SetpieceFloat 10s ease-in-out infinite;
}

.map2-setpiece.setpiece-inkblot::before{
  content:"";
  position:absolute;
  left: 50%;
  top: 55%;
  width: 64%;
  height: 54%;
  transform: translate(-50%, -50%);
  background:
    radial-gradient(circle at 40% 40%, rgba(0,0,0,0.16), rgba(0,0,0,0) 58%),
    radial-gradient(circle at 60% 60%, rgba(0,0,0,0.12), rgba(0,0,0,0) 62%),
    radial-gradient(circle at 52% 48%, rgba(0,0,0,0.10), rgba(0,0,0,0) 65%);
  filter: blur(2px);
  mix-blend-mode: multiply;
  animation: m2InkPulse 7s ease-in-out infinite;
}
@keyframes m2InkPulse{
  0%,100%{ transform: translate(-50%,-50%) scale(1); opacity:.75; }
  50%{ transform: translate(-50%,-50%) scale(1.03); opacity:.95; }
}

.map2-setpiece.setpiece-koi::before,
.map2-setpiece.setpiece-koi::after{
  content:"";
  position:absolute;
  width: 180px;
  height: 80px;
  border-radius: 999px;
  background: rgba(0,0,0,0.10);
  filter: blur(1.2px);
  mix-blend-mode: multiply;
  opacity: .55;
  animation: m2Koi 9s linear infinite;
}
.map2-setpiece.setpiece-koi::before{ left: -10%; top: 62%; transform: rotate(-8deg); }
.map2-setpiece.setpiece-koi::after{ right: -12%; top: 38%; transform: rotate(12deg); animation-duration: 11s; }
@keyframes m2Koi{
  0%{ transform: translateX(0) rotate(0deg); }
  100%{ transform: translateX(140vw) rotate(0deg); }
}

.map2-setpiece.setpiece-seals::before{
  content:"";
  position:absolute;
  left: 10%;
  top: 10%;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  border: 6px solid rgba(198,40,40,0.22);
  box-shadow: inset 0 0 0 3px rgba(198,40,40,0.12);
  transform: rotate(-12deg);
  mix-blend-mode: multiply;
  animation: m2Seal 8s ease-in-out infinite;
}
@keyframes m2Seal{
  0%,100%{ transform: rotate(-12deg) translateY(0); opacity:.65; }
  50%{ transform: rotate(-9deg) translateY(-10px); opacity:.9; }
}

.map2-setpiece.setpiece-dragon::before{
  content:"";
  position:absolute;
  inset: -10%;
  background:
    radial-gradient(circle at 55% 65%, rgba(239,83,80,0.12), rgba(239,83,80,0.00) 55%),
    radial-gradient(circle at 35% 40%, rgba(255,193,7,0.10), rgba(255,193,7,0.00) 58%),
    radial-gradient(circle at 70% 30%, rgba(255,255,255,0.06), rgba(255,255,255,0.00) 60%);
  mix-blend-mode: screen;
  filter: blur(1px);
  animation: m2Dragon 6s ease-in-out infinite;
}
@keyframes m2Dragon{
  0%,100%{ transform: scale(1); opacity:.75; }
  50%{ transform: scale(1.03); opacity:.95; }
}

@keyframes m2SetpieceFloat{
  0%,100%{ transform: translateY(0); }
  50%{ transform: translateY(-12px); }
}

/* === GLASSMORPHISM UI === */
.view-container {
  width: 100%; height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px 40px;
  position: relative;
  z-index: 10;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(15px) saturate(120%);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  width: 100%;
  max-width: 800px;
  height: 90%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.theory-panel { max-width: 900px; }

.panel-header {
  padding: 30px 40px;
  border-bottom: 2px solid rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(255,255,255,0.5);
}
.level-page.map2 .panel-header {
  border-bottom-color: var(--accent-soft);
}

/* ✅ ASIAN SEAL: теперь “форма по теме” */
.asian-seal {
  width: 54px; height: 54px;
  border: 3px solid var(--accent);
  color: var(--accent);
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 1.1rem;
  background: rgba(255,255,255,0.92);
  position: relative;
  box-shadow: 0 10px 22px rgba(0,0,0,0.10);
}
.asian-seal span{ position: relative; z-index: 2; }
.asian-seal .seal-icon{
  position:absolute;
  right:-10px;
  bottom:-10px;
  width: 28px;
  height: 28px;
  display:grid;
  place-items:center;
  background: rgba(255,255,255,0.85);
  border: 2px solid var(--accent-border);
  border-radius: 12px;
  font-style: normal;
  font-size: 16px;
  box-shadow: 0 10px 18px rgba(0,0,0,0.10);
  transform: rotate(-10deg);
}

/* forms */
.asian-seal.seal-round{ border-radius: 50%; }
.asian-seal.seal-squircle{ border-radius: 16px; }
.asian-seal.seal-hex{
  border-radius: 14px;
  clip-path: polygon(25% 6%, 75% 6%, 96% 50%, 75% 94%, 25% 94%, 4% 50%);
}
.asian-seal.seal-diamond{
  border-radius: 16px;
  transform: rotate(45deg);
}
.asian-seal.seal-diamond span{ transform: rotate(-45deg); }
.asian-seal.seal-diamond .seal-icon{ transform: rotate(-55deg); }

.asian-seal.seal-stamp{
  border-radius: 50%;
  box-shadow: 0 10px 22px rgba(0,0,0,0.10), inset 0 0 0 4px rgba(0,0,0,0.03);
}
.asian-seal.seal-stamp::before{
  content:"";
  position:absolute; inset:-6px;
  border-radius: 50%;
  border: 3px dashed rgba(0,0,0,0.10);
  opacity: .7;
}

/* tiny themed details */
.asian-seal.seal-dojo{ background: rgba(255,255,255,0.95); }
.asian-seal.seal-origami::after{
  content:"";
  position:absolute; inset:0;
  border-radius: inherit;
  background: repeating-linear-gradient(135deg, rgba(0,0,0,0.04) 0 6px, rgba(0,0,0,0.00) 6px 16px);
  opacity: .6;
}
.asian-seal.seal-ink{ background: rgba(255,255,255,0.92); }
.asian-seal.seal-ink::after{
  content:"";
  position:absolute; inset:0;
  border-radius: inherit;
  background: radial-gradient(circle at 60% 70%, rgba(0,0,0,0.08), rgba(0,0,0,0) 60%);
  mix-blend-mode: multiply;
}
.asian-seal.seal-wave::after{
  content:"";
  position:absolute; inset:0;
  border-radius: inherit;
  background: repeating-radial-gradient(circle at 50% 80%, rgba(0,0,0,0.05) 0 4px, rgba(0,0,0,0) 4px 10px);
  opacity: .55;
}
.asian-seal.seal-dragon::after{
  content:"";
  position:absolute; inset:-8px;
  border-radius: 999px;
  background: radial-gradient(circle at 50% 50%, rgba(255,111,0,0.18), rgba(255,111,0,0) 65%);
  mix-blend-mode: screen;
  filter: blur(1px);
  animation: dragonAura 4.6s ease-in-out infinite;
}
@keyframes dragonAura{
  0%,100%{ opacity:.55; transform: scale(1); }
  50%{ opacity:.9; transform: scale(1.03); }
}

.panel-header h1 {
  font-family: 'Noto Serif', serif;
  font-size: 2rem;
  color: var(--accent);
  margin: 0;
}

.scrollable-content { flex: 1; overflow-y: auto; padding: 40px; }
.theory-text { font-family: 'Noto Serif', serif; font-size: 1.2rem; line-height: 1.8; color: var(--text-dark); }
.theory-text :deep(h3) { font-family: 'Fredoka', sans-serif; color: var(--accent); margin-top: 30px; }
.theory-text :deep(.code-box) { background: var(--accent-soft); padding: 5px 10px; border-radius: 5px; display: inline-block; font-family: monospace; color: var(--accent); }

.code-block-wrapper { background: #282c34; border-radius: 12px; overflow: hidden; margin-top: 30px; }
.code-label { background: #21252b; color: #e06c75; padding: 8px 15px; font-size: 0.8rem; text-transform: uppercase; font-weight: bold; }
.code-block-wrapper pre { padding: 20px; color: #abb2bf; font-family: 'Consolas', monospace; font-size: 1.1rem; }

.panel-footer { padding: 25px; text-align: center; border-top: 1px solid rgba(0,0,0,0.05); background: rgba(255,255,255,0.6); }

/* --- GAME UI --- */
.game-panel { max-width: 650px; }
.game-top { padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid rgba(0,0,0,0.05); }

.progress-pill {
  background: #fff;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: bold;
  color: var(--accent);
  border: 1px solid var(--accent-border);
}

.lives-container { font-size: 1.5rem; display: flex; gap: 5px; }
.heart { transition: all 0.3s; }

.game-content { padding: 40px; flex: 1; display: flex; flex-direction: column; justify-content: center; }
.question { text-align: center; color: var(--text-dark); margin-bottom: 40px; font-size: 1.5rem; }

/* Duolingo */
.answer-zone {
  min-height: 80px;
  border-bottom: 2px solid var(--accent-border);
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  padding-bottom: 10px;
}
.answer-zone.error { border-color: #ff5252; animation: shake 0.4s; }

.tile {
  background: white;
  border: 1px solid var(--accent-border);
  border-bottom: 4px solid rgba(0,0,0,0.10);
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: bold;
  color: var(--accent);
  cursor: pointer;
  transition: transform 0.1s;
}
.tile:active { transform: translateY(4px); border-bottom-width: 0; }
.tile.bank:hover { background: var(--accent-soft); }
.tile.used { opacity: 0; pointer-events: none; }

/* Quiz */
.quiz-layout { display: flex; flex-direction: column; gap: 15px; }
.quiz-card {
  background: white;
  border: 2px solid rgba(0,0,0,0.06);
  padding: 20px;
  border-radius: 16px;
  text-align: left;
  cursor: pointer;
  font-size: 1.2rem;
  font-family: 'Fredoka', sans-serif;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.2s;
  color: var(--text-dark);
}
.quiz-card:hover { border-color: var(--accent); background: #fff; transform: scale(1.02); }
.quiz-card.selected { background: var(--accent-soft); border-color: var(--accent); }

.marker { width: 24px; height: 24px; border: 2px solid var(--accent-border); border-radius: 50%; }
.quiz-card.selected .marker { background: var(--accent); border-color: var(--accent); }
.quiz-card.error { background: #ffebee; border-color: #ff5252; animation: shake 0.4s; }

/* Input */
.input-container { display: flex; align-items: center; background: #282c34; border-radius: 12px; padding: 15px; }
.code-input { background: transparent; border: none; color: #fff; font-family: 'Consolas', monospace; font-size: 1.2rem; width: 100%; outline: none; }
.code-input.error { color: #ff5252; }

/* RESULT SCREENS */
.result-screen { text-align: center; padding: 40px; }
.result-icon { font-size: 6rem; animation: bounce 2s infinite; display: block; margin-bottom: 10px; }
.win h2 { color: #4caf50; }
.lose h2 { color: #d32f2f; }

.big-stars { font-size: 3rem; margin-top: 20px; display: flex; justify-content: center; }
.big-star-svg {
  width: 60px; height: 60px;
  margin: 0 5px;
  color: #e0e0e0;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.big-star-svg.filled {
  color: #FFD700;
  fill: #FFD700;
  filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
  transform: scale(1.2);
}

/* ACTIONS */
.game-actions { padding: 30px; text-align: center; height: 100px; display: flex; flex-direction: column; justify-content: center; align-items: center; }
.feedback { color: #d32f2f; font-weight: bold; margin-bottom: 10px; font-size: 1.1rem; }

/* Buttons */
.primary-btn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 16px 50px;
  font-size: 1.3rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 8px 20px var(--accent-shadow);
  font-family: 'Fredoka', sans-serif;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.primary-btn:hover { transform: translateY(-3px); filter: brightness(1.06); }

/* we keep your success/fail */
.primary-btn.success { background: #4caf50; box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3); }
.primary-btn.fail { background: #d32f2f; box-shadow: 0 8px 20px rgba(211, 47, 47, 0.3); }

/* ANIMATIONS */
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
</style>
