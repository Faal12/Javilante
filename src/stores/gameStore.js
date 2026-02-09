import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useGameStore = defineStore('game', () => {
  const playerName = ref('Java Schüler');
  const cameraPos = ref({ x: 0, y: 0 });
  const mascotStage = ref(1); 
  // HINZUGEFÜGT: Avatar State (Standard ist Panda)
  const avatar = ref('🐼');

  const levels = ref([
    { 
      id: 1, 
      x: 450, y: 460, 
      unlocked: true, completed: false, stars: 0, 
      title: "Der Anfang aller Dinge", 
      bgTheme: "theme-sakura", 
      waypoints: [], 
      theory: {
        title: "Lektion 1: Variablen & Datentypen",
        content: `
          <h3>1. Die Philosophie der Speicherung</h3>
          <p>Willkommen, Schüler. Bevor du die Welt verändern kannst, musst du lernen, sie zu beschreiben. In der Programmierung geschieht dies durch Daten. Aber Daten sind flüchtig wie der Wind. Um sie festzuhalten, nutzen wir <b>Variablen</b>.</p>
          <p>Stell dir eine Variable als eine Teetasse vor. Sie hat einen Zweck (Tee halten) und einen Namen (z.B. "Lieblingstasse"). In Java müssen wir dem Computer genau sagen, welche Art von Inhalt in die Tasse darf. Das nennen wir <b>Datentypen</b>.</p>
          
          <h3>2. Die Anatomie einer Variable</h3>
          <p>Um eine Variable zu erschaffen (wir nennen das <i>Deklaration</i>), folgen wir einer strengen Formel:</p>
          <div class="code-box"><code>Typ name = Wert;</code></div>
          <ul>
            <li><b>Typ:</b> Bestimmt die Form des Containers (z.B. Ganzzahl).</li>
            <li><b>Name:</b> Wie wir den Container ansprechen (z.B. <code>alter</code>).</li>
            <li><b>Wert:</b> Der tatsächliche Inhalt (z.B. <code>25</code>).</li>
          </ul>

          <h3>3. Die Primitiven Datentypen (Die Elemente)</h3>
          <p>Java ist eine streng typisierte Sprache. Du kannst kein Feuer in einen Papierkorb legen. Hier sind die vier wichtigsten Grundbausteine:</p>
          
          <h4>A. int (Die Ganzzahl)</h4>
          <p>Der Fels in der Brandung. <code>int</code> speichert ganze Zahlen ohne Komma. Wir nutzen es für Level, Leben, Anzahl von Gegenständen oder Zähler.</p>
          <p><i>Beispiel:</i> <code>int level = 1;</code> oder <code>int gegner = 5;</code></p>

          <h4>B. double (Die Fließkommazahl)</h4>
          <p>Wie Wasser fließt die Kommazahl. <code>double</code> ist für alles, was Präzision erfordert: Preise, Gewicht, Physikberechnungen. <b>Wichtig:</b> Der Computer nutzt einen Punkt <code>.</code> statt eines Kommas!</p>
          <p><i>Beispiel:</i> <code>double preis = 19.99;</code></p>

          <h4>C. boolean (Die Wahrheit)</h4>
          <p>Licht oder Schatten. Wahr oder Falsch. Ein <code>boolean</code> kennt nur zwei Zustände: <code>true</code> oder <code>false</code>. Er ist das Herzstück jeder Entscheidung im Code.</p>
          <p><i>Beispiel:</i> <code>boolean istTag = true;</code></p>

          <h4>D. char (Das Zeichen)</h4>
          <p>Ein einzelnes Blatt am Baum. <code>char</code> speichert exakt ein Zeichen (Buchstabe, Ziffer, Symbol). Es wird immer von einfachen Anführungszeichen <code>' '</code> umschlossen.</p>
          <p><i>Beispiel:</i> <code>char rang = 'S';</code></p>

          <h3>4. Der String (Die Schriftrolle)</h3>
          <p>Ein <code>String</code> ist kein primitiver Typ, sondern eine Kette von Zeichen. Er ist mächtig und komplex. Wir nutzen ihn für Namen, Texte und Dialoge. Strings tragen immer doppelte Anführungszeichen <code>" "</code>.</p>
          <p><i>Beispiel:</i> <code>String name = "Meister Panda";</code></p>
        `,
        code: `public class Main {
    public static void main(String[] args) {
        // Deklaration & Initialisierung
        int alter = 100;
        double groesse = 1.75;
        boolean istWeise = true;
        char klasse = 'A';
        
        // String ist eine Klasse (Großgeschrieben!)
        String name = "Sensei Wu";
        
        System.out.println(name + " ist " + alter + " Jahre alt.");
    }
}`
      },
      tasks: [
        {
          id: 1,
          type: "duolingo",
          question: "Baue den Code: Erstelle eine int-Variable 'kraft' mit dem Wert 9000.",
          blocks: ["int", "kraft", "=", "9000", ";", "String", "double"],
          correctOrder: ["int", "kraft", "=", "9000", ";"]
        },
        {
          id: 2,
          type: "quiz",
          question: "Welchen Datentyp wählst du für den Zustand 'Spiel beendet'?",
          options: ["int", "boolean", "String", "double"],
          correct: "boolean"
        },
        {
          id: 3,
          type: "input",
          question: "Schreibe Code: Erstelle eine double-Variable 'pi' mit dem Wert 3.14.",
          correctRegex: /^double\s+pi\s*=\s*3\.14\s*;$/
        }
      ]
    },
    { 
      id: 2, 
      x: 650, y: 1250, 
      unlocked: false, completed: false, stars: 0, 
      title: "Die Kunst der Balance", 
      bgTheme: "theme-sakura", 
      waypoints: [
      { x: 427, y: 651 },
      { x: 208, y: 851 },
      { x: 225, y: 1028 },
      { x: 338, y: 1129 },
      { x: 446, y: 1243 },
      { x: 564, y: 1293 }
      ],
      theory: {
        title: "Lektion 2: Operatoren einsetzen",
        content: `
          <h3>1. Die Dynamik der Welt</h3>
          <p>Daten, die sich nicht verändern, sind wie stehendes Gewässer. Um Leben in unser Programm zu bringen, müssen wir rechnen, vergleichen und verknüpfen. Dafür nutzen wir <b>Operatoren</b>.</p>
          
          <h3>2. Arithmetische Operatoren (Mathematik)</h3>
          <p>Der Computer ist ein perfekter Rechner. Wir nutzen diese Symbole für Berechnungen:</p>
          <ul>
            <li><code>+</code> (Addition): Zusammenfügen.</li>
            <li><code>-</code> (Subtraktion): Wegnehmen.</li>
            <li><code>*</code> (Multiplikation): Vervielfachen (Sternchen).</li>
            <li><code>/</code> (Division): Teilen. Vorsicht bei ganzen Zahlen (int): 5 / 2 ergibt 2, nicht 2.5!</li>
            <li><code>%</code> (Modulo): Der Rest einer Division.</li>
          </ul>
          <p><b>Das Geheimnis des Modulo (%):</b> Es ist nützlicher, als du denkst! <code>10 % 3</code> ist <code>1</code> (weil 3 dreimal in 10 passt und 1 übrig bleibt). Wir nutzen es oft, um zu prüfen, ob eine Zahl gerade ist (<code>x % 2 == 0</code>) oder um zyklische Ereignisse zu programmieren.</p>

          <h3>3. Vergleichsoperatoren (Die Waage)</h3>
          <p>Oft müssen wir wissen: Ist A schwerer als B? Sind sie gleich? Das Ergebnis ist immer ein <b>boolean</b> (wahr/falsch).</p>
          <ul>
            <li><code>==</code> Gleich (Zwei Ist-Gleich-Zeichen! Ein einzelnes <code>=</code> ist eine Zuweisung!)</li>
            <li><code>!=</code> Ungleich (Das Ausrufezeichen steht für "NICHT")</li>
            <li><code>&lt;</code> Kleiner als</li>
            <li><code>&gt;</code> Größer als</li>
            <li><code>&lt;=</code> Kleiner oder gleich</li>
            <li><code>&gt;=</code> Größer oder gleich</li>
          </ul>

          <h3>4. Logische Operatoren (Die Verknüpfung)</h3>
          <p>Ein weiser Code trifft komplexe Entscheidungen. "Wenn ich Hunger habe UND Essen da ist...".</p>
          <ul>
            <li><code>&&</code> (UND): Beide Seiten müssen wahr sein. Wenn eine Seite falsch ist, ist alles falsch.</li>
            <li><code>||</code> (ODER): Mindestens eine Seite muss wahr sein. Nur wenn beide falsch sind, ist das Ergebnis falsch.</li>
            <li><code>!</code> (NICHT): Kehrt den Wert um. Aus <code>true</code> wird <code>false</code>.</li>
          </ul>
        `,
        code: `int energie = 50;
int schaden = 10;

// Rechnen
energie = energie - schaden; // 40

// Vergleichen
boolean istBesiegt = (energie <= 0); // false

// Logik
boolean kannKämpfen = (energie > 0) && !istBesiegt; // true`
      },
      tasks: [
        {
          id: 4,
          type: "quiz",
          question: "Was ist das Ergebnis von: 14 % 5?",
          options: ["2.8", "4", "2", "0"],
          correct: "4"
        },
        {
          id: 5,
          type: "input",
          question: "Schreibe eine Bedingung: 'score ist gleich 100' (nutze ==)",
          correctRegex: /^score\s*==\s*100$/
        }
      ]
    },
    { 
      id: 3, 
      x: 1000, y: 250, 
      unlocked: false, completed: false, stars: 0, 
      title: "Der Pfad der Entscheidung", 
      bgTheme: "theme-sakura",
      waypoints: [
        { x: 803, y: 1254 },
      { x: 928, y: 1121 },
      { x: 922, y: 965 },
      { x: 896, y: 826 },
      { x: 862, y: 695 },
      { x: 855, y: 541 },
      { x: 864, y: 421 },
      { x: 916, y: 344 },
      { x: 959, y: 318 }
      ],
      theory: {
        title: "Lektion 3: Verzweigungen mit if/else",
        content: `
          <h3>1. Der Fluss des Schicksals</h3>
          <p>Ein Programm, das immer nur geradeaus läuft, ist wie ein Stein, der den Berg hinunterrollt. Es kann nicht reagieren. Um Intelligenz zu simulieren, müssen wir dem Code erlauben, abzubiegen. Wir nennen das <b>Kontrollstrukturen</b>.</p>

          <h3>2. Die If-Anweisung (Der Wächter)</h3>
          <p>Das Schlüsselwort <code>if</code> (wenn) prüft eine Bedingung in Klammern <code>( )</code>. Nur wenn diese Bedingung <b>wahr</b> (true) ist, wird der folgende Codeblock in den geschweiften Klammern <code>{ }</code> ausgeführt. Ist sie falsch, wird der Block übersprungen.</p>
          <pre><code>if (wetter == "Regen") {
    nimmSchirm(); // Wird nur bei Regen ausgeführt
}</code></pre>

          <h3>3. Else (Der andere Weg)</h3>
          <p>Was passiert, wenn die Bedingung nicht zutrifft? Dafür gibt es <code>else</code> (sonst). Es ist der Plan B.</p>
          <pre><code>if (gold >= 100) {
    kaufeSchwert();
} else {
    System.out.println("Nicht genug Gold!");
}</code></pre>

          <h3>4. Die Kette (Else If)</h3>
          <p>Das Leben ist selten schwarz-weiß. Oft gibt es viele Optionen. Mit <code>else if</code> können wir beliebig viele Bedingungen nacheinander prüfen. Der Computer prüft von oben nach unten. Sobald eine Bedingung zutrifft, führt er sie aus und ignoriert den Rest der Kette.</p>
          
          <h3>5. Verschachtelung (Das Labyrinth)</h3>
          <p>Du kannst ein <code>if</code> in ein anderes <code>if</code> packen. Das nennt man "Nesting".</p>
          <pre><code>if (tuerOffen) {
    if (raumDunkel) {
        macheLichtAn();
    }
}</code></pre>
          <p>Aber Vorsicht, junger Schüler: Zu tiefe Verschachtelungen verwirren den Geist und machen den Code schwer lesbar.</p>
        `,
        code: `int note = 2;

if (note == 1) {
    System.out.println("Perfekt!");
} else if (note == 2) {
    System.out.println("Gut gemacht.");
} else if (note == 3) {
    System.out.println("Bestanden.");
} else {
    System.out.println("Du musst mehr lernen.");
}`
      },
      tasks: [
        {
          id: 6,
          type: "duolingo",
          question: "Baue: Wenn (if) leben kleiner 0, dann GameOver.",
          blocks: ["if", "(", "leben", "<", "0", ")", "{", "GameOver();", "}"],
          correctOrder: ["if", "(", "leben", "<", "0", ")", "{", "GameOver();", "}"]
        },
        {
          id: 7,
          type: "input",
          question: "Vervollständige: ___ (x > 10) { ... }",
          correctRegex: /^if$/i
        }
      ]
    },
    { 
      id: 4, 
      x: 1450, y: 1220, 
      unlocked: false, completed: false, stars: 0, 
      title: "Die Halle der tausend Türen", 
      bgTheme: "theme-sakura",
      waypoints: [
      { x: 1198, y: 336 },
      { x: 1275, y: 451 },
      { x: 1279, y: 557 },
      { x: 1271, y: 678 },
      { x: 1237, y: 773 },
      { x: 1220, y: 904 },
      { x: 1220, y: 1021 },
      { x: 1235, y: 1112 },
      { x: 1286, y: 1181 },
      { x: 1334, y: 1218 },
      { x: 1420, y: 1251 }
      ],
      theory: {
        title: "Lektion 4: Die Switch-Case Anweisung",
        content: `
          <h3>1. Wenn If nicht mehr reicht</h3>
          <p>Stell dir vor, du programmierst einen Getränkeautomaten. Der Nutzer kann die Zahlen 1 bis 50 drücken. Würdest du wirklich 50 mal <code>else if</code> schreiben wollen? Das wäre unlesbar und langsam. Für solche Fälle, in denen wir eine Variable auf viele <b>konkrete Werte</b> prüfen, schenkt uns Java den <code>switch</code>.</p>

          <h3>2. Die Struktur des Switch</h3>
          <p>Der Switch ist wie ein großer Verteilerbahnhof. Ein Zug (die Variable) kommt an und wird auf das richtige Gleis (Case) geleitet.</p>
          <ul>
            <li><code>switch(variable)</code>: Hier beginnt die Weiche.</li>
            <li><code>case wert:</code>: Ein Zielbahnhof. Wenn die Variable diesen Wert hat, wird der Code hier ausgeführt.</li>
            <li><code>break;</code>: <b>Die Bremse!</b> Ohne dieses Wort fährt der Zug einfach weiter in den nächsten Case (Fall-Through). Das ist eine häufige Fehlerquelle!</li>
            <li><code>default:</code>: Das Auffangnetz. Wenn kein Case passt, landet der Zug hier (wie das letzte <code>else</code>).</li>
          </ul>

          <h3>3. Wann nutzen wir Switch?</h3>
          <p>Switch ist elegant, aber wählerisch. Es funktioniert am besten mit:</p>
          <ul>
            <li>Ganzen Zahlen (<code>int</code>, <code>byte</code>, <code>short</code>)</li>
            <li>Zeichen (<code>char</code>)</li>
            <li>Texten (<code>String</code>)</li>
            <li>Enums (spezielle Listen)</li>
          </ul>
          <p>Für komplexe Bedingungen wie "Größer als 10 aber kleiner als 20" ist <code>if-else</code> immer noch der Meister.</p>
        `,
        code: `int tag = 3;
String wochentag;

switch (tag) {
    case 1:
        wochentag = "Montag";
        break;
    case 2:
        wochentag = "Dienstag";
        break;
    case 3:
        wochentag = "Mittwoch";
        break;
    default:
        wochentag = "Ein anderer Tag";
        break;
}`
      },
      tasks: [
        {
          id: 8,
          type: "quiz",
          question: "Welches Keyword verhindert, dass der Code in den nächsten Case 'fällt'?",
          options: ["stop", "break", "return", "exit"],
          correct: "break"
        },
        {
          id: 9,
          type: "input",
          question: "Wie nennt man den Fall, der eintritt, wenn kein anderer Case passt?",
          correctRegex: /^default:?$/i
        }
      ]
    },
    { 
      id: 5, 
      x: 1800, y: 550, 
      unlocked: false, completed: false, stars: 0, 
      title: "Der Kreis und die Armee", 
      bgTheme: "theme-sakura",
      waypoints: [
      { x: 1602, y: 1250 },
      { x: 1712, y: 1200 },
      { x: 1784, y: 1119 },
      { x: 1812, y: 1029 },
      { x: 1830, y: 934 },
      { x: 1835, y: 864 },
      { x: 1851, y: 761 },
      { x: 1846, y: 689 },
      { x: 1849, y: 638 }
      ],
      theory: {
        title: "Lektion 5: Arrays & Schleifen",
        content: `
          <h3>1. Die Armee: Arrays (Felder)</h3>
          <p>Bisher hatte jede Variable nur einen Wert. Aber was, wenn du die Namen von 100 Pandas speichern willst? 100 Variablen (<code>panda1, panda2...</code>) zu erstellen, ist Wahnsinn.</p>
          <p>Die Lösung ist ein <b>Array</b>. Ein Array ist wie ein Regal mit vielen nummerierten Fächern. Alle Fächer enthalten den gleichen Datentyp.</p>
          <p><b>Deklaration:</b> <code>int[] zahlen = {10, 20, 30, 40};</code></p>
          <p><b>Zugriff:</b> Wir nutzen den <b>Index</b> in eckigen Klammern. <br>⚠️ <b>Warnung:</b> In der Informatik beginnen wir bei <b>0</b> zu zählen! Das erste Element ist also <code>zahlen[0]</code>.</p>

          <h3>2. Der ewige Kreis: Schleifen (Loops)</h3>
          <p>Arrays und Schleifen sind beste Freunde. Um alle 100 Pandas zu begrüßen, schreiben wir den Code nur einmal und lassen ihn 100 mal laufen.</p>

          <h4>A. Die For-Schleife (Der Zähler)</h4>
          <p>Perfekt, wenn du genau weißt, wie oft etwas passieren soll (z.B. "Für jedes Element im Array").</p>
          <pre><code>for (int i = 0; i < 5; i++) {
    System.out.println("Runde: " + i);
}</code></pre>
          <p>Aufbau: <i>Startwert; Bedingung; Schrittweite</i>.</p>

          <h4>B. Die While-Schleife (Der Wächter)</h4>
          <p>Perfekt, wenn du nicht weißt, wie oft, aber eine Bedingung hast (z.B. "Solange der Spieler noch lebt").</p>
          <pre><code>while (energie > 0) {
    kämpfen();
}</code></pre>
          <p>Vorsicht vor der <b>Endlosschleife</b>! Wenn die Bedingung niemals falsch wird, läuft das Programm bis in alle Ewigkeit (oder bis der Akku leer ist).</p>
        `,
        code: `// Ein Array mit 4 Namen erstellen
String[] ninjas = {"Kai", "Jay", "Cole", "Zane"};

// Mit einer Schleife durch das Array laufen
// ninjas.length gibt uns die Größe (4)
for (int i = 0; i < ninjas.length; i++) {
    // i ist erst 0, dann 1, 2, 3
    System.out.println("Ninja Nr. " + i + ": " + ninjas[i]);
}`
      },
      tasks: [
        {
          id: 10,
          type: "quiz",
          question: "Ein Array hat 5 Elemente. Welchen Index hat das LETZTE Element?",
          options: ["5", "4", "6", "-1"],
          correct: "4"
        },
        {
          id: 11,
          type: "input",
          question: "Schreibe den Beginn einer for-Schleife: int i = 0; i < 10; i++",
          correctRegex: /^for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*10\s*;\s*i\+\+\s*\)$/
        }
      ]
    },
    { 
      id: 6, 
      x: 2150, y: 265, 
      unlocked: false, completed: false, stars: 0, 
      title: "Der Großmeister", 
      isBoss: true, 
      bgTheme: "theme-boss", 
      waypoints: [
        { x: 1858, y: 510 },
        { x: 1878, y: 454 },
        { x: 1910, y: 397 },
        { x: 1959, y: 360 },
        { x: 2007, y: 336 },
        { x: 2044, y: 328 },
        { x: 2109, y: 316 }
      ],
      theory: { 
        title: "Finale Prüfung", 
        content: "Der Meister wartet...", 
        code: "" 
      }, 
      // === BOSS DATA ===
      bossData: {
        name: "GROSSMEISTER NULL", 
        health: 3,
        timeSeconds: 120, // 2 minutes
        dialogues: [
          "Endlich bist du angekommen.",
          "Aber rohe Kraft allein reicht hier nicht.",
          "Dein Code muss fließen wie Tinte auf Reispapier.",
          "Zeig mir: Beherrschst du den Pfad der Iteration?"
        ],
        taunts: [
          "Dein Geist ist leer wie 'null'!", 
          "Zu langsam! Der Compiler wartet nicht!", 
          "Das nennst du Code? Das ist Chaos!", 
          "Vergiss das Semikolon nicht, Schüler!", 
          "Dein Algorithmus hat keine Ehre!",
          "Tick tack... Die Garbage Collection kommt..."
        ],
        task: {
          question: "Schreibe eine for-Schleife, die von 0 bis 20 (inklusive) in 2er-Schritten zählt (i+=2).",
          correctRegex: /for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<=\s*20\s*;\s*i\s*\+=\s*2\s*\)/
        }
      },
      tasks: [] // Empty, as we use bossData
    },
  ]);

  const totalStars = computed(() => levels.value.reduce((sum, lvl) => sum + lvl.stars, 0));
  const progressPercent = computed(() => {
    if (levels.value.length === 0) return 0;
    return Math.round((levels.value.filter(l => l.completed).length / levels.value.length) * 100);
  });
  
  // HINZUGEFÜGT: Rang basierend auf Sternen
  const rank = computed(() => {
    if (totalStars.value >= 15) return "Code Sensei (S)";
    if (totalStars.value >= 10) return "Cyber Ninja (A)";
    if (totalStars.value >= 5) return "Java Ronin (B)";
    return "Novice (C)";
  });

  const currentLevelId = computed(() => {
    const next = levels.value.find(l => l.unlocked && !l.completed);
    return next ? next.id : levels.value[levels.value.length - 1].id;
  });

  const activeLevelData = (id) => levels.value.find(l => l.id === parseInt(id));

  function completeLevel(levelId, starsCount) {
    const level = levels.value.find(l => l.id === levelId);
    if (level) {
      level.completed = true;
      if (starsCount > level.stars) level.stars = starsCount;
      const nextLevel = levels.value.find(l => l.id === levelId + 1);
      if (nextLevel) nextLevel.unlocked = true;
      if (level.isBoss) mascotStage.value = 3;
      else if (levelId === 3) mascotStage.value = 2;
    }
  }

  function setCamera(x, y) { cameraPos.value = { x, y }; }
  
  function resetProgress() {
    levels.value.forEach((l, index) => {
      l.unlocked = index === 0;
      l.completed = false;
      l.stars = 0;
    });
    mascotStage.value = 1;
    cameraPos.value = { x: 0, y: 0 };
    avatar.value = '🐼'; // Avatar auch zurücksetzen
  }

  const savedState = localStorage.getItem('java-game-store-v9');
  if (savedState) {
    const parsed = JSON.parse(savedState);
    if (parsed.levels) {
        levels.value.forEach(l => {
            const savedLvl = parsed.levels.find(sl => sl.id === l.id);
            if (savedLvl) {
                l.unlocked = savedLvl.unlocked;
                l.completed = savedLvl.completed;
                l.stars = savedLvl.stars;
            }
        });
    }
    if (parsed.playerName) playerName.value = parsed.playerName;
    if (parsed.mascotStage) mascotStage.value = parsed.mascotStage;
    if (parsed.avatar) avatar.value = parsed.avatar;
  }

  // WICHTIG: 'avatar' zum Watcher hinzufügen, damit es gespeichert wird!
  watch([levels, playerName, mascotStage, avatar], () => {
    localStorage.setItem('java-game-store-v9', JSON.stringify({
      levels: levels.value,
      playerName: playerName.value,
      mascotStage: mascotStage.value,
      avatar: avatar.value
    }));
  }, { deep: true });

  return { levels, totalStars, progressPercent, currentLevelId, activeLevelData, completeLevel, cameraPos, setCamera, playerName, mascotStage, resetProgress, avatar, rank };
});