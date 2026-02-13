// src/data/map2Levels.js
// Map 2: Objektorientierung – Fokus auf Klassen & Objekte (ohne Vererbung/Kapselung, nur minimal erwähnt)

export function createMap2Levels() {
  return [
    {
      id: 1,
      x: 1348, y: 1458,
      unlocked: true, completed: false, stars: 0,
      title: "Die Tür zum Dōjō der Objekte",
      bgTheme: "theme-dojo",
      waypoints: [],
      theory: {
        title: "Lektion 1: Klassen vs. Objekte – der Unterschied, der alles trägt",
        content: `
          <h3>1) Das Dōjō-Prinzip: Bauplan vs. echtes Ding</h3>
          <p>In der objektorientierten Programmierung (OOP) denkst du nicht zuerst in „Zahlen“ oder „Schleifen“, sondern in <b>Dingen</b>. Dinge haben <b>Eigenschaften</b> (Daten) und <b>Verhalten</b> (Aktionen). Eine <b>Klasse</b> ist dabei der Bauplan: Sie beschreibt, wie so ein Ding aussieht und was es kann. Ein <b>Objekt</b> ist das reale Exemplar, das aus diesem Bauplan erschaffen wurde.</p>

          <p>Stell dir vor, du hast im Dōjō eine Schriftrolle: „Panda-Schüler“. Darauf steht, dass ein Panda-Schüler einen <b>Namen</b> hat, eine <b>Disziplin</b> (z.B. 0–100) und eine Aktion <b>trainieren()</b>. Diese Schriftrolle ist die Klasse. Wenn du jetzt sagst: „Ich erschaffe Renats Panda-Schüler“, dann entsteht ein konkretes Objekt mit echten Werten: Name = „Renat“, Disziplin = 20. Das ist der Moment, wo Code lebendig wird.</p>

          <h3>2) Attribute: Zustand des Objekts</h3>
          <p>Attribute sind Variablen, die <b>im Objekt</b> wohnen. Sie beschreiben den Zustand. Wichtig: Zwei Objekte derselben Klasse teilen sich nicht automatisch den Zustand. Zwei Panda-Schüler können beide „PandaSchueler“ sein, aber der eine ist fleißig, der andere verschläft das Training. Das ist der Kern: <b>gleiche Struktur, eigener Zustand</b>.</p>

          <h3>3) Methoden: Verhalten des Objekts</h3>
          <p>Methoden sind Funktionen, die zur Klasse gehören. Sie greifen meist auf Attribute zu. Wenn du <code>trainieren()</code> aufrufst, verändert sich der Zustand (z.B. Disziplin steigt). Damit wird Programmieren: „Ich sende einem Objekt eine Nachricht: Tu etwas.“ Genau wie im Dōjō: Du gibst den Befehl, und der Schüler reagiert.</p>

          <h3>4) Das Schlüsselwort <code>new</code> und Referenzen</h3>
          <p>In Java erzeugst du ein Objekt mit <code>new</code>. Dabei bekommst du keine „Kopie des Objekts“ wie bei primitiven Datentypen, sondern eine <b>Referenz</b> (eine Art „Adresse“). Das heißt: Wenn zwei Variablen auf dasselbe Objekt zeigen, ändern beide den gleichen Zustand. Das wirkt am Anfang wie Magie – ist aber nur Referenzlogik.</p>

          <h3>5) Mini-Hinweis (nur oberflächlich): Kapselung</h3>
          <p>Du wirst später lernen, dass man Attribute oft schützt (private) und über Methoden zugänglich macht. Heute reicht: Wir verstehen, dass Objekte Zustand und Verhalten bündeln. Das ist der Geist der OOP.</p>

          <p><b>Dōjō-Spruch:</b> „Ein Bauplan ist nur Papier. Ein Objekt ist ein Schüler, der schwitzen kann.“</p>
        `,
        code: `public class PandaSchueler {
    String name;
    int disziplin; // 0..100

    void trainieren() {
        disziplin = disziplin + 10;
        System.out.println(name + " trainiert. Disziplin: " + disziplin);
    }
}

public class Main {
    public static void main(String[] args) {
        PandaSchueler p1 = new PandaSchueler();
        p1.name = "Renat";
        p1.disziplin = 20;

        p1.trainieren(); // Renat trainiert...
    }
}`
      },
      tasks: [
        {
          id: 101,
          type: "quiz",
          question: "Was ist eine Klasse in Java?",
          options: ["Ein konkretes Ding mit Zustand", "Ein Bauplan für Objekte", "Eine Schleife", "Ein Datentyp wie int"],
          correct: "Ein Bauplan für Objekte"
        },
        {
          id: 102,
          type: "input",
          question: "Schreibe den Java-Ausdruck, um ein Objekt zu erzeugen: Klasse heißt 'Katze' (nur new-Zeile).",
          correctRegex: /^Katze\s+\w+\s*=\s*new\s+Katze\s*\(\s*\)\s*;$/ 
        },
        {
          id: 103,
          type: "duolingo",
          question: "Baue: Erzeuge ein Objekt 'p' von 'PandaSchueler'.",
          blocks: ["PandaSchueler", "p", "=", "new", "PandaSchueler()", ";", "int", "String"],
          correctOrder: ["PandaSchueler", "p", "=", "new", "PandaSchueler()", ";"]
        }
      ]
    },

    {
      id: 2,
      x: 823,
      y: 1058,
      unlocked: false, completed: false, stars: 0,
      title: "Die Werkbank der Attribute",
      bgTheme: "theme-dojo",
      waypoints: [
      {
        "x": 1355,
        "y": 1341
      },
      {
        "x": 1090,
        "y": 1280
      },
      {
        "x": 973,
        "y": 1225
      },
      {
        "x": 904,
        "y": 1171
      }
      ],
      theory: {
        title: "Lektion 2: Attribute & Objektzustand – was ein Objekt „ist“",
        content: `
          <h3>1) Zustand ist Persönlichkeit</h3>
          <p>Ein Objekt ist nicht nur „da“ – es hat Zustand. In Java heißt das: <b>Attribute</b> (Felder) speichern Werte, die zu diesem Objekt gehören. Wenn du zwei Objekte derselben Klasse hast, sind sie wie zwei Schüler im Dōjō: gleiche Regeln, unterschiedliche Werte. Genau dadurch kannst du echte Modelle bauen: Spieler, Gegner, Tickets, Bestellungen, Charaktere – alles wird greifbar.</p>

          <h3>2) Attribute lesen und schreiben</h3>
          <p>Du greifst auf Attribute mit dem Punktoperator zu: <code>objekt.attribut</code>. Beispiel: <code>p1.name</code>. Schreibst du <code>p1.name = "Renat";</code>, veränderst du den Zustand dieses Objekts. Bei OOP ist es wichtig, nicht nur „Werte“ zu speichern, sondern die Werte dem richtigen Ding zuzuordnen. „Name“ ohne Objekt wäre wie „Ehre“ ohne Krieger – klingt schön, bringt aber nichts.</p>

          <h3>3) Default-Werte: die Stille vor dem Training</h3>
          <p>Wenn du ein Objekt erzeugst und Attribute nicht initialisierst, setzt Java Default-Werte: Zahlen werden 0, boolean wird false, Referenzen werden null. <b>null</b> ist wie ein leeres Schriftrollenfach: da ist (noch) kein Objekt. Wenn du versuchst, auf <code>null</code> etwas aufzurufen, bekommst du eine Exception (NullPointerException). Das ist kein „Bug des Schicksals“, sondern ein Hinweis: Du hast versucht, einem Nicht-Objekt eine Nachricht zu senden.</p>

          <h3>4) Objektzustand verändern – kontrolliert und sinnvoll</h3>
          <p>In einem Spiel oder Lernprojekt willst du Zustand verändern: Sterne sammeln, Level abschließen, Energie sinkt. OOP hilft dir, diese Änderungen logisch zu halten: Der Zustand gehört dorthin, wo er hingehört. Ein Schüler hat Disziplin, ein Boss hat Leben, ein Ticket hat Preis. Das macht deinen Code lesbar und erweiterbar.</p>

          <h3>5) Mini-Hinweis: Warum man später Kapselung nutzt</h3>
          <p>Später wirst du Attribute oft nicht öffentlich lassen, damit nicht jeder „irgendwas“ rein schreibt. Heute reicht: Du verstehst, dass Attribute der Speicher des Objekts sind – und dass jedes Objekt sein eigenes „Ich“ besitzt.</p>

          <p><b>Dōjō-Spruch:</b> „Ein Objekt ohne Zustand ist ein Schatten. Gib ihm Werte, und es bekommt Gewicht.“</p>
        `,
        code: `public class Ticket {
    String film;
    double preis;
}

public class Main {
    public static void main(String[] args) {
        Ticket t1 = new Ticket();
        t1.film = "Cyber Ninja Saga";
        t1.preis = 9.99;

        Ticket t2 = new Ticket();
        t2.film = "Cyber Ninja Saga";
        t2.preis = 12.99;

        System.out.println(t1.film + " kostet " + t1.preis);
        System.out.println(t2.film + " kostet " + t2.preis);
    }
}`
      },
      tasks: [
        {
          id: 104,
          type: "quiz",
          question: "Was ist der Default-Wert einer Objekt-Referenz in Java (wenn nicht gesetzt)?",
          options: ["0", "false", "null", "\"\""],
          correct: "null"
        },
        {
          id: 105,
          type: "input",
          question: "Schreibe Zugriff mit Punktoperator: Setze bei Objekt 't' das Attribut 'preis' auf 9.99.",
          correctRegex: /^t\s*\.\s*preis\s*=\s*9\.99\s*;$/ 
        }
      ]
    },

    {
      id: 3,
      x: 1109,
      y: 763,
      unlocked: false, completed: false, stars: 0,
      title: "Die Schriftrolle der Methoden",
      bgTheme: "theme-dojo",
      waypoints: [
      {
        "x": 913,
        "y": 1033
      },
      {
        "x": 985,
        "y": 971
      },
      {
        "x": 1054,
        "y": 931
      },
      {
        "x": 1119,
        "y": 889
      }
      ],
      theory: {
        title: "Lektion 3: Methoden – Verhalten, das Zustand bewegt",
        content: `
          <h3>1) Verhalten ist das Herz eines Objekts</h3>
          <p>Attribute beschreiben, <b>was</b> ein Objekt ist. Methoden beschreiben, <b>was es tut</b>. In OOP ist das mächtig, weil du Verhalten direkt an das Ding bindest. Du rufst nicht irgendeine Funktion auf, du sagst: „Dieses Objekt soll handeln.“ Das ergibt eine natürliche Struktur: <code>spieler.heilen()</code>, <code>boss.taunt()</code>, <code>ticket.drucken()</code>.</p>

          <h3>2) Methoden können Zustand verändern</h3>
          <p>Eine Methode kann Attribute lesen und verändern. Beispiel: <code>trainieren()</code> erhöht Disziplin. Das Wichtigste: Die Methode arbeitet auf dem <b>aktuellen Objekt</b>. In Java wird das Objekt, auf dem eine Methode aufgerufen wird, als <code>this</code> bezeichnet. Du musst <code>this</code> nicht immer schreiben, aber es hilft, die Idee zu verstehen: „Ich (dieses Objekt) ändere meinen Zustand.“</p>

          <h3>3) Parameter und Rückgabewerte</h3>
          <p>Methoden können Parameter haben: Daten, die du beim Aufruf mitgibst. Beispiel: <code>nehmeSchaden(int dmg)</code>. Sie können auch etwas zurückgeben: z.B. <code>int berechnePreis()</code>. Damit werden Methoden zu Werkzeugen: Du gibst Input, bekommst Output – oder veränderst Zustand. Viele Spielmechaniken sind genau das.</p>

          <h3>4) Methoden-Aufruf vs. Objekt-Erzeugung</h3>
          <p>Ein typischer Anfängerfehler: Man erzeugt ständig neue Objekte, obwohl man eigentlich nur eine Methode auf dem bestehenden Objekt aufrufen will. Erzeugung (<code>new</code>) ist Geburt. Methodenaufruf ist Training. Du willst nicht bei jedem Schlag einen neuen Schüler erschaffen. Du willst, dass derselbe Schüler stärker wird.</p>

          <h3>5) Saubere Denkweise</h3>
          <p>Wenn du in OOP denkst, stellst du dir immer die Frage: „Welches Objekt ist verantwortlich?“ Nicht: „Wo packe ich den Code hin?“, sondern: „Wer sollte das tun?“ In deinem Projekt bedeutet das z.B.: Ein Level-Objekt könnte wissen, ob es abgeschlossen ist. Ein Boss-Objekt könnte wissen, wie viele Leben es hat und welche Sprüche es sagt.</p>

          <p><b>Dōjō-Spruch:</b> „Ein Objekt ist nicht nur eine Kiste für Werte. Es ist ein Kämpfer mit Techniken.“</p>
        `,
        code: `public class Boss {
    String name;
    int leben;

    void nehmeSchaden(int dmg) {
        leben = leben - dmg;
        System.out.println(name + " nimmt Schaden: -" + dmg + " | Leben: " + leben);
    }

    boolean istBesiegt() {
        return leben <= 0;
    }
}

public class Main {
    public static void main(String[] args) {
        Boss b = new Boss();
        b.name = "Großmeister Objekt";
        b.leben = 30;

        b.nehmeSchaden(10);
        System.out.println("Besiegt? " + b.istBesiegt());
    }
}`
      },
      tasks: [
        {
          id: 106,
          type: "quiz",
          question: "Wofür steht 'this' in einer Instanzmethode?",
          options: ["Für die Klasse selbst", "Für das aktuelle Objekt", "Für ein Array", "Für einen Datentyp"],
          correct: "Für das aktuelle Objekt"
        },
        {
          id: 107,
          type: "input",
          question: "Schreibe einen Methodenaufruf: Objekt 'b' soll nehmeSchaden mit 5 ausführen.",
          correctRegex: /^b\s*\.\s*nehmeSchaden\s*\(\s*5\s*\)\s*;$/ 
        }
      ]
    },

    {
      id: 4,
      x: 743,
      y: 322,
      unlocked: false, completed: false, stars: 0,
      title: "Der Kreis des Konstruktors",
      bgTheme: "theme-dojo",
      waypoints: [
        {
        "x": 1104,
        "y": 749
      },
      {
        "x": 939,
        "y": 713
      },
      {
        "x": 813,
        "y": 720
      },
      {
        "x": 651,
        "y": 711
      },
      {
        "x": 582,
        "y": 681
      },
      {
        "x": 499,
        "y": 628
      },
      {
        "x": 476,
        "y": 515
      },
      {
        "x": 525,
        "y": 436
      },
      {
        "x": 595,
        "y": 396
      },
      {
        "x": 677,
        "y": 372
      }
      ],
      theory: {
        title: "Lektion 4: Konstruktoren – ein Objekt wird richtig geboren",
        content: `
          <h3>1) Warum Konstruktoren existieren</h3>
          <p>Wenn du ein Objekt erzeugst, willst du oft nicht, dass es „leer“ startet. Ein Boss ohne Namen, ein Ticket ohne Preis, ein Schüler ohne Disziplin – das ist wie ein Dōjō ohne Regeln. Genau dafür sind <b>Konstruktoren</b> da: Sie sind spezielle Methoden, die beim Erzeugen mit <code>new</code> automatisch laufen. Sie geben dem Objekt einen sinnvollen Startzustand.</p>

          <h3>2) Der Name des Konstruktors</h3>
          <p>Ein Konstruktor hat <b>denselben Namen wie die Klasse</b> und keinen Rückgabewert. Beispiel: <code>public Ticket(String film, double preis)</code>. Beim Erzeugen schreibst du dann: <code>new Ticket("Film", 9.99)</code>. Dadurch ist das Objekt sofort korrekt initialisiert.</p>

          <h3>3) Überladen (mehrere Konstruktoren)</h3>
          <p>Du kannst mehrere Konstruktoren haben, solange sich die Parameter unterscheiden. Das nennt man Überladen. Beispiel: Ein Standard-Konstruktor ohne Parameter (setzt Default-Werte) und ein Konstruktor mit Parametern (setzt konkrete Werte). Das ist praktisch: Manchmal willst du schnell ein Objekt, manchmal willst du es exakt starten.</p>

          <h3>4) <code>this</code> im Konstruktor</h3>
          <p>Wenn ein Parameter denselben Namen hat wie ein Attribut, nutzt du <code>this</code>, um klar zu sagen, was was ist: <code>this.preis = preis;</code>. Das ist kein Zauber, sondern nur: „Mein Attribut bekommt den Parameterwert.“</p>

          <h3>5) Objektqualität: weniger Fehler, mehr Struktur</h3>
          <p>Mit Konstruktoren machst du deinen Code stabiler. Du reduzierst Situationen, in denen Attribute vergessen werden. Das ist besonders wichtig in Spielen: Ein Objekt muss „ready“ sein, sobald es existiert. Wenn du später tiefer gehst, lernst du, warum Kapselung (private Felder) dazu passt – aber heute reicht: Konstruktoren geben dem Objekt einen sauberen Start.</p>

          <p><b>Dōjō-Spruch:</b> „Ein Krieger beginnt nicht mit leerer Hand. Der Konstruktor legt ihm die Waffe hin.“</p>
        `,
        code: `public class Ticket {
    String film;
    double preis;

    public Ticket(String film, double preis) {
        this.film = film;
        this.preis = preis;
    }

    public void drucken() {
        System.out.println("Ticket: " + film + " | Preis: " + preis);
    }
}

public class Main {
    public static void main(String[] args) {
        Ticket t = new Ticket("Dojo Nights", 11.50);
        t.drucken();
    }
}`
      },
      tasks: [
        {
          id: 108,
          type: "quiz",
          question: "Welche Aussage stimmt über Konstruktoren?",
          options: [
            "Sie haben immer einen Rückgabewert",
            "Sie heißen wie die Klasse",
            "Man ruft sie mit obj.konstruktor() auf",
            "Sie funktionieren nur bei int"
          ],
          correct: "Sie heißen wie die Klasse"
        },
        {
          id: 109,
          type: "input",
          question: "Schreibe einen new-Aufruf für: new Ticket(\"Film\", 9.99);",
          correctRegex: /^new\s+Ticket\s*\(\s*"[^"]+"\s*,\s*9\.99\s*\)\s*;$/ 
        }
      ]
    },

    {
      id: 5,
      x: 1318,
      y: 375,
      unlocked: false, completed: false, stars: 0,
      title: "Das Spiegelzimmer der Referenzen",
      bgTheme: "theme-dojo",
      waypoints: [
        {
        "x": 877,
        "y": 378
      },
      {
        "x": 935,
        "y": 394
      },
      {
        "x": 998,
        "y": 414
      },
      {
        "x": 1071,
        "y": 425
      },
      {
        "x": 1134,
        "y": 422
      },
      {
        "x": 1193,
        "y": 426
      },
      {
        "x": 1255,
        "y": 426
      }
      ],
      theory: {
        title: "Lektion 5: Referenzen, Identität und das Rätsel von null",
        content: `
          <h3>1) Referenzen sind keine Objekte – sie zeigen nur</h3>
          <p>In Java sind viele Werte, mit denen du arbeitest, <b>Referenzen</b>. Eine Referenz ist wie eine Wegbeschreibung zum echten Objekt. Die Variable enthält nicht das Objekt selbst (wie bei <code>int</code>), sondern einen Hinweis darauf, wo das Objekt ist. Das ist entscheidend, weil dadurch mehrere Variablen auf dasselbe Objekt zeigen können.</p>

          <h3>2) Zwei Namen, ein Schüler</h3>
          <p>Wenn du schreibst: <code>Ticket a = new Ticket(...); Ticket b = a;</code>, dann ist <code>b</code> keine Kopie. Es ist ein zweiter Name für dasselbe Objekt. Änderst du <code>b.preis</code>, dann siehst du die Änderung auch über <code>a.preis</code>. Das wirkt zuerst „unfair“, aber es ist logisch: Du hast nur die Wegbeschreibung kopiert, nicht den Schüler geklont.</p>

          <h3>3) Objekt-Identität vs. Gleichheit</h3>
          <p>Mit <code>==</code> vergleichst du bei Referenzen meistens: „Zeigen beide auf dasselbe Objekt?“ Das ist Identität. Zwei verschiedene Objekte können aber inhaltlich gleich sein (gleicher Film, gleicher Preis). Das Thema <code>equals()</code> ist wichtig, aber für heute reicht: <b>== prüft oft die Adresse, nicht den Inhalt</b>. Das ist eine typische Falle – und ein typischer Boss-Move in Prüfungen.</p>

          <h3>4) null: der leere Platz</h3>
          <p><code>null</code> bedeutet: „Hier ist kein Objekt.“ Es ist nicht „0“ und nicht „leer“, sondern wirklich: nichts. Wenn du auf <code>null</code> eine Methode aufrufst, bekommst du die NullPointerException. Dōjō-Regel: Bevor du einem Objekt eine Nachricht schickst, stelle sicher, dass es existiert. Zum Beispiel: <code>if (obj != null) obj.methode();</code></p>

          <h3>5) Warum das für dein Game wichtig ist</h3>
          <p>In deinem Projekt gibt es viele Zustände: Level, Boss, Aufgaben. Wenn du Referenzen verstehst, kannst du Bugs vermeiden: „Warum ändern sich zwei Dinge gleichzeitig?“ – weil sie dasselbe Objekt teilen. Oder: „Warum crasht es?“ – weil eine Referenz null ist. Wer Referenzen beherrscht, beherrscht das Chaos.</p>

          <p><b>Dōjō-Spruch:</b> „Ein Finger zeigt auf den Mond. Verwechsle den Finger nicht mit dem Mond.“</p>
        `,
        code: `public class Main {
    public static void main(String[] args) {
        Ticket a = new Ticket("Dojo Nights", 11.50);
        Ticket b = a; // gleiche Referenz!

        b.preis = 5.00;

        System.out.println(a.preis); // 5.00
        System.out.println(b.preis); // 5.00

        Ticket c = null;
        if (c != null) {
            // sicher
            // c.drucken();
        }
    }
}

class Ticket {
    String film;
    double preis;

    Ticket(String film, double preis) {
        this.film = film;
        this.preis = preis;
    }
}`
      },
      tasks: [
        {
          id: 110,
          type: "quiz",
          question: "Was prüft 'a == b' bei Objekt-Referenzen typischerweise?",
          options: ["Inhaltliche Gleichheit", "Identität (gleiches Objekt)", "Nur die Länge von Strings", "Ob die Klasse public ist"],
          correct: "Identität (gleiches Objekt)"
        },
        {
          id: 111,
          type: "input",
          question: "Schreibe eine Null-Prüfung: Wenn obj nicht null ist, rufe obj.start() auf (eine Zeile).",
          correctRegex: /^if\s*\(\s*obj\s*!=\s*null\s*\)\s*obj\s*\.\s*start\s*\(\s*\)\s*;$/ 
        }
      ]
    },

    {
      id: 6,
      x: 1664,
      y: 433,
      unlocked: false, completed: false, stars: 0,
      title: "Die Sammlung der Gefährten",
      bgTheme: "theme-dojo",
      waypoints: [
        {
        "x": 1448,
        "y": 416
      },
      {
        "x": 1516,
        "y": 420
      },
      {
        "x": 1574,
        "y": 425
      },
      {
        "x": 1625,
        "y": 440
      }
      ],
      theory: {
        title: "Lektion 6: Viele Objekte – Listen, Arrays und Team-Denken",
        content: `
          <h3>1) Ein Objekt ist gut – viele Objekte sind ein System</h3>
          <p>Sobald du OOP verstanden hast, kommt der nächste Schritt: Du willst nicht nur ein Objekt, sondern viele. Ein Dōjō besteht nicht aus einem Schüler, sondern aus einer Gruppe. Im Code heißt das: Arrays oder Listen von Objekten. Du speicherst nicht nur Zahlen, sondern <b>Objekte</b>. Damit kannst du komplexe Welten bauen: Inventar (Items), Gegner-Wellen, Level-Knoten, Aufgaben.</p>

          <h3>2) Arrays von Objekten</h3>
          <p>Ein Array kann Referenzen speichern: <code>PandaSchueler[] team = new PandaSchueler[3];</code>. Wichtig: Das erzeugt nur das Array, aber die Plätze enthalten zuerst <code>null</code>. Du musst jedes Objekt separat mit <code>new</code> erschaffen. Das ist ein Klassiker: Du denkst, du hast drei Schüler, aber du hast drei leere Plätze. Erst wenn du jeden Platz füllst, wird es ein Team.</p>

          <h3>3) Iterieren und handeln</h3>
          <p>Wenn du Objekte sammelst, willst du oft auf alle Methoden aufrufen: „Alle trainieren“, „Alle erhalten Schaden“, „Alle bekommen Sterne“. Das geht sauber mit Schleifen. Und hier siehst du die Stärke von OOP: Du musst nicht wissen, wie genau ein Schüler trainiert – du rufst einfach <code>trainieren()</code> auf. Der Rest ist intern im Objekt geregelt.</p>

          <h3>4) Objekt-Design für dein Projekt</h3>
          <p>In deinem Game könnte jeder Level ein Objekt sein. Du hast es ja schon: id, unlocked, completed, stars, title, theory, tasks. Das ist praktisch ein Level-Objekt. Auf der Map bewegst du einen Mascot – und die Map liest die Level-Objekte. Genau so denkt OOP: Daten + Struktur, die zusammen bleiben.</p>

          <h3>5) Nur ein Hauch von „guter Praxis“</h3>
          <p>Später wirst du lernen: Man nutzt oft Listen (ArrayList), private Felder und klare Methoden. Heute reicht: Du kannst viele Objekte verwalten, ohne den Überblick zu verlieren. Das ist wie Formationstraining im Dōjō.</p>

          <p><b>Dōjō-Spruch:</b> „Ein einzelner Kämpfer ist stark. Ein geordnetes Team ist unaufhaltsam.“</p>
        `,
        code: `class PandaSchueler {
    String name;
    int disziplin;

    PandaSchueler(String name, int disziplin) {
        this.name = name;
        this.disziplin = disziplin;
    }

    void trainieren() {
        disziplin += 5;
    }
}

public class Main {
    public static void main(String[] args) {
        PandaSchueler[] team = new PandaSchueler[3];
        team[0] = new PandaSchueler("Aki", 10);
        team[1] = new PandaSchueler("Beni", 20);
        team[2] = new PandaSchueler("Caro", 30);

        for (int i = 0; i < team.length; i++) {
            team[i].trainieren();
            System.out.println(team[i].name + ": " + team[i].disziplin);
        }
    }
}`
      },
      tasks: [
        {
          id: 112,
          type: "quiz",
          question: "Was enthält ein neues Objekt-Array direkt nach 'new Panda[3]'?",
          options: ["3 fertige Objekte", "3 mal null", "Zufällige Daten", "Nur int-Werte"],
          correct: "3 mal null"
        },
        {
          id: 113,
          type: "input",
          question: "Schreibe eine Zuweisung: team[0] bekommt ein neues Objekt von 'PandaSchueler' (mit leeren Klammern).",
          correctRegex: /^team\s*\[\s*0\s*\]\s*=\s*new\s+PandaSchueler\s*\(\s*\)\s*;$/ 
        }
      ]
    },

    {
      id: 7,
      x: 2038, y: 406,
      unlocked: false, completed: false, stars: 0,
      title: "Finaler Meister der Instanzen",
      isBoss: true,
      bgTheme: "theme-boss2",
      waypoints: [
        {
        "x": 1824,
        "y": 492
      },
      {
        "x": 1885,
        "y": 492
      },
      {
        "x": 1942,
        "y": 482
      },
      {
        "x": 1990,
        "y": 485
      }
      ],
      theory: {
        title: "Finale Prüfung: Klassen & Objekte – der Schwur des Dōjō",
        content: `
          <h3>Der Meister spricht</h3>
          <p>Du hast gelernt: Klassen sind Baupläne, Objekte sind reale Instanzen. Attribute geben Zustand, Methoden geben Verhalten. Konstruktoren geben sauberen Start, Referenzen erklären Identität und <code>null</code>. Jetzt kommt die Prüfung: Du musst eine Klasse so bauen, dass sie wie ein Werkzeug funktioniert – nicht wie eine zufällige Sammlung von Zeilen.</p>

          <p>Ein würdiger Schüler kann eine Klasse schreiben, ein Objekt erzeugen, Attribute setzen, Methoden aufrufen und dabei verstehen, was in welchem Objekt passiert. Keine Vererbung, keine großen Patterns – nur die reine Kunst: <b>Klassen & Objekte</b>.</p>

          <p><b>Dōjō-Spruch:</b> „Wer den Bauplan versteht, baut Welten.“</p>
        `,
        code: `// Der Boss verlangt: Klasse + Objekt + Methode.
// Halte es klar und sauber.`
      },
      bossData: {
  name: 'Bamboo Grandmaster',
  timeSeconds: 170,
  health: 3,

  dialogues: [
  'Du bist also wirklich bis hierher gekommen… durch Wind, Zweifel und schlechte Syntax.',
  'Im Bambus-Dojo zählt keine Geschwindigkeit. Hier zählt Präzision. Kontrolle. Disziplin.',
  'Jeder Fehler hallt wie ein Schlag im Wald wider. Und ich höre alles.',
  'Drei Prüfungen. Drei Treffer. Bestehst du sie – oder zerbrichst du wie hohler Bambus?',
  'Zeig mir, was in dir steckt. Der Kampf beginnt jetzt. 🍃'
],


  taunts: [
    'Du tippst wie ein RNG — ohne Seed.',
    'Das ist kein Zauber, das ist ein Tippfehler-Ritual.',
    'Dein Code hat Aura. Leider die von Chaos.',
    'Ich sehe Potential… irgendwo weit hinten.',
    'Atme ein. Schreibe richtig. Atme aus.'
  ],

  tauntsOnHit: [
    'Treffer. Nicht schlecht. Beunruhigend sogar.',
    'Okay. Das war sauber. Noch zwei.',
    'Du hast mich… leicht beeindruckt. Nur leicht.'
  ],

  tauntsOnMiss: [
    'Nope. Das ist kein Java. Das ist Fan-Fiction.',
    'Du hast gerade Logik beleidigt.',
    'Falsch. Aber mutig. Leider nur mutig.',
    'Das war so nah dran, dass es trotzdem falsch ist.',
    'Ich gebe dir noch eine Chance, bevor ich dich debugge.'
  ],

  tasks: [
  {
    // ✅ 1 строка: выражение
    type: "input",
    question:
      "Phase 1 — Array-Index:\n" +
      "Gegeben: int[] a = {2, 4, 6};\n" +
      "Schreibe NUR den Ausdruck, der das letzte Element liefert.",
    // принимает: a[a.length-1] / a[a.length - 1] / (a[a.length-1]) и т.п.
    correctRegex: /^\s*\(?\s*a\s*\[\s*a\s*\.\s*length\s*-\s*1\s*\]\s*\)?\s*;?\s*$/m,
    hint:
      "Tipp: Das letzte Element steht an Index length-1.",
    solution:
      "a[a.length - 1]"
  },

  {
    // ✅ 1 строка: boolean-условие
    type: "input",
    question:
      "Phase 2 — Gerade Zahl:\n" +
      "Schreibe NUR die Bedingung (ohne if), die true ist, wenn n gerade ist.",
    correctRegex: /^\s*\(?\s*n\s*%\s*2\s*==\s*0\s*\)?\s*;?\s*$/m,
    hint:
      "Tipp: Gerade bedeutet: Rest bei Division durch 2 ist 0.",
    solution:
      "n % 2 == 0"
  },

  {
    // ✅ 1 строка: конструктор (минимум)
    type: "input",
    question:
      "Phase 3 — OOP Konstruktor:\n" +
      "In einer Klasse Ninja gibt es ein Feld: String name;\n" +
      "Schreibe NUR die Zeile im Konstruktor, die den Parameter name ins Feld speichert.",
    // принимает: this.name=name; / this.name = name; / name = name; (но лучше this.name)
    // Я оставлю строго: this.name = name; чтобы не было тупого name=name;
    correctRegex: /^\s*this\s*\.\s*name\s*=\s*name\s*;?\s*$/m,
    hint:
      "Tipp: Mit this unterscheidest du Feld und Parameter.",
    solution:
      "this.name = name;"
  }
]
},
      tasks: []
    }
  ];
}
