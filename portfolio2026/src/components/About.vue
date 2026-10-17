<script setup>
import { ref, h } from "vue";
import portraitPhoto from "../assets/images/portfoliome.JPEG";

// zošit na posteli: leží naplocho, pri čítaní sa zdvihne; scroll otočí stranu z "about" na "skills"
defineProps({
  reading: Boolean
});

// klik na list otočí stranu (Home doscrolluje kameru na about / skills)
const emit = defineEmits(["turn"]);

// kresbičky perom (viewBox 80 × 80): d = obrys, accent = plocha vyfarbená zvýrazňovačom, dots = farebné bodky [x, y, farba, r]
const circle = (x, y, r) => `M${x - r} ${y} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;
const doodles = {
  browser: {
    d: "M10 14 Q40 11 70 14 L69 64 Q40 67 11 65 Z M11 26 Q40 24 69 26 M30 38 L22 46 L30 54 M50 38 L58 46 L50 54 M44 35 L36 57",
    accent: "M10 14 Q40 11 70 14 L69 26 Q40 24 11 26 Z"
  },
  flow: {
    d: "M9 12 Q20 10 30 12 L30 30 Q20 31 9 30 Z M50 12 Q60 10 71 12 L71 30 Q60 31 50 30 Z M31 21 Q40 19 48 21 M43 16 L49 21 L43 26 M34 42 L34 72 L41 65 L47 76 L52 74 L46 63 L56 62 Z",
    accent: "M50 12 Q60 10 71 12 L71 30 Q60 31 50 30 Z"
  },
  palette: {
    d: "M40 10 C 18 10 8 26 10 42 C 12 60 30 70 44 66 C 52 64 50 56 46 52 C 42 48 46 42 54 44 C 66 46 72 38 70 28 C 66 16 54 10 40 10 Z",
    dots: [[26, 28, "#e4707f"], [42, 20, "#6f93c8"], [58, 28, "#e8b84a"], [22, 46, "#7fa66f"]]
  },
  pin: {
    d: "M40 72 C 28 54 18 44 18 32 C 18 18 28 10 40 10 C 52 10 62 18 62 32 C 62 44 52 54 40 72 Z",
    accent: "M40 72 C 28 54 18 44 18 32 C 18 18 28 10 40 10 C 52 10 62 18 62 32 C 62 44 52 54 40 72 Z",
    dots: [[40, 32, "#fffdf6", 8]]
  },
  cap: {
    d: "M8 32 L40 18 L72 32 L40 46 Z M22 38 L22 54 Q40 64 58 54 L58 38 M64 35 L64 54",
    accent: "M8 32 L40 18 L72 32 L40 46 Z",
    dots: [[64, 57, "#34323a", 4]]
  },
  briefcase: {
    d: "M12 30 Q40 27 68 30 L66 66 Q40 69 14 66 Z M30 29 L30 21 Q40 18 50 21 L50 29 M13 44 Q40 47 67 44",
    accent: "M13 44 Q40 47 67 44 L66 66 Q40 69 14 66 Z"
  },
  camera: {
    d: `M10 28 Q40 25 70 28 L68 64 Q40 67 12 64 Z M26 27 L31 18 L49 18 L54 27 ${circle(40, 46, 12)}`,
    accent: circle(40, 46, 12),
    dots: [[60, 36, "#34323a", 3]]
  },
  server: {
    d: "M12 10 Q40 8 68 10 L68 28 Q40 30 12 28 Z M12 32 Q40 30 68 32 L68 50 Q40 52 12 50 Z M12 54 Q40 52 68 54 L68 72 Q40 74 12 72 Z M20 19 L40 19 M20 41 L40 41 M20 63 L40 63",
    dots: [[58, 19, "#7fa66f", 3.5], [58, 41, "#7fa66f", 3.5], [58, 63, "#e4707f", 3.5]]
  },
  database: {
    d: "M14 18 C 14 8, 66 8, 66 18 C 66 28, 14 28, 14 18 Z M14 18 L14 62 C 14 72, 66 72, 66 62 L66 18 M14 40 C 14 50, 66 50, 66 40",
    accent: "M14 18 C 14 8, 66 8, 66 18 C 66 28, 14 28, 14 18 Z"
  },
  pen: {
    d: `M40 8 L58 40 L48 66 L32 66 L22 40 Z M40 8 L40 42 M30 66 L50 66 L52 74 L28 74 Z`,
    accent: "M40 8 L58 40 L48 66 L32 66 L22 40 Z",
    dots: [[40, 46, "#34323a", 4]]
  },
  calendar: {
    d: "M12 18 Q40 15 68 18 L66 68 Q40 71 14 68 Z M13 32 Q40 30 67 32 M26 10 L26 24 M54 10 L54 24 M24 44 L32 44 M38 44 L46 44 M52 44 L58 44 M24 56 L32 56 M38 56 L46 56",
    accent: "M12 18 Q40 15 68 18 L67 32 Q40 30 13 32 Z",
    dots: [[55, 56, "#e4707f", 5]]
  },
  tests: {
    d: "M18 14 Q40 12 62 14 L60 72 Q40 74 20 72 Z M30 10 L50 10 L50 18 L30 18 Z M27 32 L31 37 L38 28 M44 33 L54 33 M27 48 L31 53 L38 44 M44 49 L54 49 M27 62 L54 62",
    accent: "M30 10 L50 10 L50 18 L30 18 Z"
  }
};

const ink = { fill: "none", stroke: "#34323a", "stroke-width": 3, "stroke-linecap": "round", "stroke-linejoin": "round" };
const Doodle = ({ name }) => {
  const g = doodles[name];
  return h("svg", { class: "nb-doodle", viewBox: "0 0 80 80", "aria-hidden": "true" }, [
    g.accent && h("path", { d: g.accent, fill: "rgba(242, 177, 184, 0.7)", transform: "translate(3 3)" }),
    h("path", { d: g.d, ...ink }),
    ...(g.dots || []).map(([cx, cy, fill, r = 6]) => h("circle", { cx, cy, r, fill }))
  ]);
};
Doodle.props = ["name"];

// logá technológií nakreslené perom (viewBox 80 × 80): každý tvar má farebnú výplň trochu posunutú
// ako pri vyfarbovaní a obrys perom; t = písmená v logu [text, x, y, farba, veľkosť]
const shield = "M14 9 Q40 7 66 9 L61 64 L40 72 L19 64 Z";
const tile = "M12 12 Q40 10 68 12 L68 68 Q40 70 12 68 Z";
const logos = {
  HTML: { shapes: [[shield, "#ef7a52"]], lines: "M51 24 L29 24 L31 40 L49 40 L47 55 L40 58 L33 55 L32 50", lineColor: "#fffdf6" },
  CSS: { shapes: [[shield, "#5a8fd0"]], lines: "M29 24 L51 24 L39 37 L49 39 L47 55 L40 58 L33 55 L32 50", lineColor: "#fffdf6" },
  JavaScript: { shapes: [[tile, "#f2d34f"]], t: [["JS", 50, 60, "#34323a", 26]] },
  TypeScript: { shapes: [[tile, "#4f7fc9"]], t: [["TS", 50, 60, "#fffdf6", 26]] },
  React: {
    shapes: [[circle(40, 40, 6.5), "#4fc3dd"]],
    lines: "M10 40 A30 11 0 1 0 70 40 A30 11 0 1 0 10 40 M25 14.02 A30 11 60 1 0 55 65.98 A30 11 60 1 0 25 14.02 M25 65.98 A30 11 120 1 0 55 14.02 A30 11 120 1 0 25 65.98",
    lineColor: "#3aaecb"
  },
  Vue: { shapes: [["M6 14 L22 14 L40 46 L58 14 L74 14 L40 70 Z", "#5dbb8a"], ["M22 14 L32 14 L40 28 L48 14 L58 14 L40 46 Z", "#3d5568"]] },
  Tailwind: {
    shapes: [
      ["M22 34 C 26 22, 36 18, 44 24 C 49 28, 52 31, 58 30 C 63 29, 66 26, 68 22 C 64 34, 54 38, 46 32 C 41 28, 38 26, 32 27 C 27 28, 24 31, 22 34 Z", "#4cc3f0"],
      ["M10 54 C 14 42, 24 38, 32 44 C 37 48, 40 51, 46 50 C 51 49, 54 46, 56 42 C 52 54, 42 58, 34 52 C 29 48, 26 46, 20 47 C 15 48, 12 51, 10 54 Z", "#4cc3f0"]
    ]
  },
  Figma: {
    shapes: [
      ["M40 8 L28 8 C 20 8, 20 24, 28 24 L40 24 Z", "#f2694a"],
      ["M40 8 L52 8 C 60 8, 60 24, 52 24 L40 24 Z", "#ff8a7a"],
      ["M40 24 L28 24 C 20 24, 20 40, 28 40 L40 40 Z", "#a66bf2"],
      [circle(48, 32, 8), "#3fbdf4"],
      ["M40 40 L28 40 C 20 40, 20 56, 28 56 C 34 56, 40 52, 40 46 Z", "#36c98a"]
    ]
  },
  Photoshop: { shapes: [[tile, "#0f2a44"]], t: [["Ps", 40, 50, "#4cb2ff", 28]] },
  Illustrator: { shapes: [[tile, "#3a1a0e"]], t: [["Ai", 40, 50, "#ffa52e", 28]] },
  InDesign: { shapes: [[tile, "#4a0d27"]], t: [["Id", 40, 50, "#ff4f7d", 28]] },
  "Premiere Pro": { shapes: [[tile, "#1d1a5c"]], t: [["Pr", 40, 50, "#a8a4ff", 28]] },
  "After Effects": { shapes: [[tile, "#1d1a5c"]], t: [["Ae", 40, 50, "#a8a4ff", 28]] },
  PHP: { shapes: [["M6 40 C 6 22, 74 22, 74 40 C 74 58, 6 58, 6 40 Z", "#8d95c9"]], t: [["php", 40, 48, "#fffdf6", 22]] },
  "Node.js": { shapes: [["M40 6 L70 23 L70 57 L40 74 L10 57 L10 23 Z", "#6aa957"]], t: [["JS", 40, 50, "#fffdf6", 24]] },
  "REST API": {
    shapes: [["M10 20 Q40 16 70 20 L70 60 Q40 64 10 60 Z", "rgba(242, 177, 184, 0.75)"]],
    lines: "M30 26 C 22 26, 27 38, 20 40 C 27 42, 22 54, 30 54 M50 26 C 58 26, 53 38, 60 40 C 53 42, 58 54, 50 54 M37 40 L43 40",
    lineColor: "#34323a"
  },
  MySQL: {
    shapes: [["M14 18 C 14 8, 66 8, 66 18 L66 62 C 66 72, 14 72, 14 62 Z", "#4d86ad"]],
    lines: "M14 18 C 14 28, 66 28, 66 18",
    lineColor: "#34323a",
    t: [["SQL", 40, 54, "#fffdf6", 18]]
  },
  Firebase: {
    shapes: [
      ["M20 64 L28 10 L42 36 Z", "#ffc93a"],
      ["M20 64 L50 22 L60 64 L40 74 Z", "#ff9f1c"],
      ["M20 64 L42 36 L60 64 L40 74 Z", "#f2752b"]
    ]
  },
  MongoDB: {
    shapes: [["M40 6 C 58 24, 58 50, 42 64 L40 76 L38 64 C 22 50, 22 24, 40 6 Z", "#57ad52"]],
    lines: "M40 14 L40 72",
    lineColor: "#2f6b2d"
  },
  Playwright: {
    shapes: [
      ["M8 24 Q26 16 42 22 L40 46 C 38 58, 14 60, 12 46 Z", "#3fb24a"],
      ["M38 26 Q56 20 72 28 L68 52 C 64 64, 40 62, 40 50 Z", "#e2584d"]
    ],
    lines: "M18 32 L24 34 M30 34 L36 32 M20 46 Q26 52 32 46 M48 36 L54 38 M60 40 L66 40 M50 54 Q56 48 62 54",
    lineColor: "#34323a"
  },
  "GitHub Actions": {
    shapes: [[circle(40, 40, 30), "#2f86f0"]],
    lines: "M33 26 L55 40 L33 54 Z",
    lineColor: "#fffdf6"
  }
};

const SkillLogo = ({ name }) => {
  const g = logos[name] || logos[name.replace(" CI/CD", "")];
  if (!g) return null;
  return h("svg", { class: "nb-logo", viewBox: "0 0 80 80", "aria-hidden": "true" }, [
    ...g.shapes.map(([d, fill]) => h("path", { d, fill, transform: "translate(2.5 2.5)" })),
    ...g.shapes.map(([d]) => h("path", { d, ...ink })),
    g.lines && h("path", { d: g.lines, ...ink, stroke: g.lineColor, "stroke-width": 4 }),
    ...(g.t || []).map(([text, x, y, fill, size]) =>
      h("text", { x, y, fill, "text-anchor": "middle", style: `font: 800 ${size}px/1 var(--font-text)` }, text))
  ]);
};
SkillLogo.props = ["name"];

const focus = [
  { icon: "browser", label: "front-end" },
  { icon: "flow", label: "UX" },
  { icon: "server", label: "back-end" },
  { icon: "palette", label: "visual design" }
];

// zoznam pod sebou: súčasná práca, štúdium, kedy môžem nastúpiť, kde som a čo ma formovalo
const rightNow = [
  { icon: "briefcase", label: "UI frontend developer student assistant at Everllence" },
  { icon: "cap", label: "finishing my Web Dev bachelor's" },
  { icon: "calendar", label: "open to full-time roles from February 2027" },
  { icon: "pin", label: "based in Copenhagen" },
  { icon: "camera", label: "Multimedia Design background" }
];

const skills = {
  frontend: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Vue", "Tailwind"],
  design: ["Figma", "Photoshop", "Illustrator", "InDesign", "Premiere Pro", "After Effects"],
  backend: ["PHP", "Node.js", "REST API"],
  databases: ["MySQL", "Firebase", "MongoDB"],
  quality: ["Playwright", "GitHub Actions CI/CD"]
};

// Home posúva otáčanie strany priamo každý snímok (0 = about, 1 = skills)
const root = ref(null);
// zapíše sa len pri zmene – inak by sa štýly celého zošita prepočítavali každý snímok
let lastFlip = -1;
// triedy cez Vue – keby sa pridávali ručne, Vue by ich zmazal pri zmene :class (napr. is-reading)
const turning = ref(false);
const flipped = ref(false);
const setPage = (progress) => {
  const flip = Math.round(progress * 1000) / 1000;
  if (flip === lastFlip || !root.value) return;
  lastFlip = flip;
  root.value.style.setProperty("--flip", flip);
  // 3D priestor treba len počas otáčania; inak je zošit plochý (oveľa lacnejšie vykresľovanie)
  turning.value = flip > 0 && flip < 1;
  flipped.value = flip >= 0.5;
};

defineExpose({ setPage });
</script>

<template>
<section id="about" ref="root" class="notebook-spot" :class="{ 'is-reading': reading, 'is-turning': turning, 'is-flipped': flipped }" data-focus>
  <div class="notebook-stage">
  <div class="notebook">
    <span class="notebook-shadow" aria-hidden="true"></span>
    <span class="notebook-cover" aria-hidden="true"></span>

    <!-- ľavá strana: about me (pod ňou sa po otočení ukáže zadná strana listu) -->
    <div class="notebook-page notebook-page-left">
      <h2 class="nb-title">about me</h2>

      <figure class="nb-photo">
        <span class="tape" aria-hidden="true"></span>
        <img :src="portraitPhoto" alt="Andrea Hunčíková" decoding="async" />
      </figure>

      <p class="nb-line nb-narrow">Hello! I'm Andrea</p>
      <p class="nb-line nb-narrow">I like turning ideas</p>
      <p class="nb-line nb-narrow">into <mark>useful web</mark></p>
      <p class="nb-line nb-narrow"><mark>experiences</mark> ♡</p>

      <!-- cesta nakreslená namiesto textu: Tatry s vlajkou → papierové lietadielko → Nyhavn s vlajkou -->
      <svg class="nb-journey" viewBox="0 0 640 260" role="img" aria-label="From Slovakia to Denmark">
        <g class="j-ink">
          <!-- Tatry: zadné štíty so snehom, vpredu zelené kopce a smreky -->
          <path style="fill: #d6e0ea" d="M14 184 L74 100 L102 130 L140 56 L184 124 L208 104 L250 184 Z" />
          <path class="j-snow" d="M127 80 L140 56 L153 80 L146 75 L140 84 L134 75 Z" />
          <path class="j-snow" d="M66 112 L74 100 L82 112 L77 109 L71 114 Z" />
          <path style="fill: #b9d1a9" d="M8 184 C 48 146, 92 146, 128 172 C 160 152, 210 148, 252 184 Z" />
          <path class="j-tree" d="M34 182 L43 156 L52 182 Z M58 182 L66 162 L74 182 Z M196 182 L205 158 L214 182 Z M218 182 L226 164 L234 182 Z" />
          <path d="M4 185 Q 128 181 256 186" />
          <!-- slovenská vlajka na štíte – so znakom (dvojkríž na troch vrchoch), inak by bola ruská -->
          <path d="M140 56 L140 10" />
          <path style="fill: #ffffff" d="M140 12 Q 168 8 196 13 L196 25 Q 168 20 140 24 Z" />
          <path style="fill: #3f63ad" d="M140 24 Q 168 20 196 25 L196 37 Q 168 32 140 36 Z" />
          <path style="fill: #e05a5f" d="M140 36 Q 168 32 196 37 L196 49 Q 168 44 140 48 Z" />
          <path style="fill: #e05a5f; stroke: #ffffff; stroke-width: 2" d="M148 15 L168 15 L168 31 Q 168 40 158 44 Q 148 40 148 31 Z" />
          <path style="stroke: #ffffff; stroke-width: 2.4; stroke-linecap: butt" d="M158 18 L158 35 M153.5 22 L162.5 22 M152 27.5 L164 27.5" />
          <path style="fill: #3f63ad; stroke: none" d="M150 37 Q 153 32 156 35 Q 158 31 160 35 Q 163 32 166 37 Q 162 41.5 158 43 Q 154 41.5 150 37 Z" />

          <!-- let: prerušovaná čiara s papierovým lietadielkom -->
          <!-- čiara sa pri lietadielku preruší, aby ho nekrížila -->
          <mask id="j-plane-gap" maskUnits="userSpaceOnUse" x="0" y="-20" width="640" height="280">
            <rect x="0" y="-20" width="640" height="280" fill="#fff" />
            <ellipse cx="323" cy="31" rx="34" ry="26" fill="#000" />
          </mask>
          <path class="j-dash" mask="url(#j-plane-gap)" d="M206 64 C 264 22, 380 22, 448 70" />
          <g transform="rotate(18 323 31) translate(6 12)">
            <path class="j-plane" d="M296 22 L338 4 L326 32 L316 22 Z" />
            <path d="M316 22 L338 4 M316 22 L314 34 L322 28" />
          </g>
          <path class="j-heart" d="M432 44 C 428 38, 419 41, 423 48 L432 55 L441 48 C 445 41, 436 38, 432 44 Z" />

          <!-- Nyhavn: farebné domčeky, dánska vlajka, voda a lodička -->
          <path style="fill: #f2cf73" d="M440 182 L440 118 L458 98 L476 118 L476 182" />
          <path style="fill: #e88a8f" d="M476 182 L476 100 L484 100 L484 90 L492 90 L492 80 L500 80 L500 90 L508 90 L508 100 L516 100 L516 182" />
          <path style="fill: #8fb0d8" d="M516 182 L516 112 L534 92 L552 112 L552 182" />
          <path style="fill: #f0a868" d="M552 182 L552 104 L572 84 L592 104 L592 182" />
          <path style="fill: #a9c79a" d="M592 182 L592 120 L609 102 L626 120 L626 182" />
          <path class="j-windows" d="M447 128h8v10h-8Z M461 128h8v10h-8Z M447 150h8v10h-8Z M461 150h8v10h-8Z
            M484 110h8v10h-8Z M500 110h8v10h-8Z M484 134h8v10h-8Z M500 134h8v10h-8Z M491 160h10v22h-10Z
            M523 124h8v10h-8Z M537 124h8v10h-8Z M523 148h8v10h-8Z M537 148h8v10h-8Z
            M560 116h8v10h-8Z M576 116h8v10h-8Z M560 140h8v10h-8Z M576 140h8v10h-8Z M567 162h10v20h-10Z
            M599 130h8v10h-8Z M612 130h8v10h-8Z M599 152h8v10h-8Z M612 152h8v10h-8Z" />
          <path d="M572 84 L572 52" />
          <path style="fill: #e05a5f" d="M572 52 Q 588 49 604 53 L604 71 Q 588 67 572 70 Z" />
          <path style="stroke: #ffffff; stroke-width: 4" d="M580 52 L580 69 M574 61 Q 588 58 602 62" />
          <path style="fill: rgba(143, 176, 216, 0.45); stroke: none" d="M430 184 L634 184 L634 206 Q 532 214 430 206 Z" />
          <path class="j-water" d="M436 196 Q 448 190 460 196 T 484 196 M540 200 Q 552 194 564 200 T 588 200 T 612 200" />
          <path style="fill: #ffffff" d="M486 194 L528 194 L520 206 L494 206 Z" />
          <path d="M507 194 L507 170" />
          <path style="fill: #f2b1b8" d="M507 172 L524 190 L507 190 Z" />
        </g>
        <text x="130" y="240">from Slovakia</text>
        <text class="j-to" x="534" y="244">to Denmark</text>
      </svg>

      <!-- citát pod cestou (na pravej strane tak ostane viac miesta pre "right now") -->
      <p class="nb-line nb-quote"><mark>“Good design should make the next step feel obvious.”</mark></p>
    </div>

    <div class="notebook-spiral" aria-hidden="true"></div>

    <!-- pravá strana pod listom: skills (backend, databázy) -->
    <div class="notebook-page notebook-page-right">
      <h3 class="nb-heading nb-icon-heading"><Doodle name="server" />backend</h3>
      <ul class="nb-skills">
        <li v-for="item in skills.backend" :key="item" class="nb-skill"><SkillLogo :name="item" /><span>{{ item }}</span></li>
      </ul>

      <h3 class="nb-heading nb-icon-heading nb-gap-top"><Doodle name="database" />databases</h3>
      <ul class="nb-skills">
        <li v-for="item in skills.databases" :key="item" class="nb-skill"><SkillLogo :name="item" /><span>{{ item }}</span></li>
      </ul>

      <h3 class="nb-heading nb-icon-heading nb-gap-top"><Doodle name="tests" />testing &amp; CI/CD</h3>
      <ul class="nb-skills">
        <li v-for="item in skills.quality" :key="item" class="nb-skill"><SkillLogo :name="item" /><span>{{ item }}</span></li>
      </ul>
    </div>

    <!-- otáčaný list: predná strana = my focus, zadná strana = skills (frontend, design) -->
    <div class="notebook-leaf" @click="reading && emit('turn')">
      <div class="notebook-page leaf-face leaf-front">
        <h3 class="nb-heading">my focus</h3>
        <ul class="nb-focus">
          <li v-for="item in focus" :key="item.label">
            <Doodle :name="item.icon" />
            <span>{{ item.label }}</span>
          </li>
        </ul>

        <h3 class="nb-heading nb-gap-top">right now</h3>
        <ul class="nb-now">
          <li v-for="item in rightNow" :key="item.label">
            <Doodle :name="item.icon" />
            <span>{{ item.label }}</span>
          </li>
        </ul>

        <button type="button" class="nb-turn" :tabindex="reading ? 0 : -1" @click.stop="emit('turn', 'skills')">turn the page ↷</button>
      </div>

      <div class="notebook-page leaf-face leaf-back">
        <h2 class="nb-title">skills</h2>

        <h3 class="nb-heading nb-icon-heading"><Doodle name="browser" />frontend</h3>
        <ul class="nb-skills">
          <li v-for="item in skills.frontend" :key="item" class="nb-skill"><SkillLogo :name="item" /><span>{{ item }}</span></li>
        </ul>

        <h3 class="nb-heading nb-icon-heading nb-gap-top"><Doodle name="pen" />design</h3>
        <ul class="nb-skills">
          <li v-for="item in skills.design" :key="item" class="nb-skill"><SkillLogo :name="item" /><span>{{ item }}</span></li>
        </ul>

        <button type="button" class="nb-turn nb-turn-back" :tabindex="reading ? 0 : -1" @click.stop="emit('turn', 'about')">↶ back</button>
      </div>
    </div>
  </div>

  <!-- pero položené vedľa zošita -->
  <span class="pen" aria-hidden="true"><i class="pen-cap"></i><i class="pen-tip"></i></span>
  </div>
</section>
</template>

<style scoped>
/* zošit sa kreslí vo veľkom (1720 × 1078) a do izby sa zmenší,
   aby bol primeraný k posteli (≈ 720 × 450 px sveta, posteľ má 3330) */
.notebook-spot {
  --flip: 0;
  --nb-scale: 0.42;
  position: relative;
  width: calc(1720px * var(--nb-scale));
  height: calc(1078px * var(--nb-scale));
}

.notebook-stage {
  position: absolute;
  top: 0;
  left: 0;
  width: 1640px;
  height: 978px;
  padding: 30px 40px 70px;
  perspective: 2600px;
  transform: scale(var(--nb-scale));
  transform-origin: 0 0;
}

/* leží naplocho na pléde; pri čítaní sa zdvihne k nám */
.notebook {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 64px 1fr;
  transform: rotateX(66deg) rotate(-3deg);
  transform-origin: 50% 100%;
  transform-style: preserve-3d;
  transition: transform 1100ms cubic-bezier(0.22, 1, 0.36, 1);
}

.is-reading .notebook {
  transform: rotateX(10deg) rotate(-1deg);
}

/* mäkký tieň ako prechod (rozmazávací filter v 3D by sa pri každom pohybe kamery prekresľoval) */
.notebook-shadow {
  position: absolute;
  inset: -10px -50px -70px -30px;
  z-index: -1;
  background: radial-gradient(closest-side, rgba(30, 25, 35, 0.34), rgba(30, 25, 35, 0.22) 70%, rgba(30, 25, 35, 0));
}

/* plátenná obálka, ktorá vykúka spod strán */
.notebook-cover {
  position: absolute;
  inset: -18px -20px -20px;
  border-radius: 20px;
  background:
    repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.07) 0 2px, transparent 2px 6px),
    repeating-linear-gradient(-45deg, rgba(90, 20, 35, 0.06) 0 2px, transparent 2px 6px),
    linear-gradient(160deg, #dc9aa1, #c7737e);
  box-shadow: 0 3px 0 #b5616c, 0 6px 0 #a3535e;
  transform: translateZ(-2px);
}

/* čistý papier bez linajok */
.notebook-page {
  --line: 46px;
  position: relative;
  height: 880px;
  padding: 58px 56px 40px 92px;
  background-color: #fffdf6;
  background-image: var(--paper-grain), linear-gradient(180deg, #fffdf8, #fbf5e9);
}

.notebook-page-left {
  border-radius: 10px 0 0 10px;
  box-shadow: inset -40px 0 40px -30px rgba(70, 50, 30, 0.3), -2px 3px 0 #ebe5d8, -4px 6px 0 #e2dccd;
}

.notebook-page-right {
  border-radius: 0 10px 10px 0;
  box-shadow: inset 40px 0 40px -30px rgba(70, 50, 30, 0.3), 2px 3px 0 #ebe5d8, 4px 6px 0 #e2dccd;
}

/* kovová špirála v strede: krúžky prechádzajú dierkami na okrajoch oboch strán */
.notebook-spiral {
  position: relative;
  z-index: 2;
}

.notebook-spiral::before {
  content: "";
  position: absolute;
  inset: 0 -16px;
  background:
    radial-gradient(circle 6px at 10px 23px, #6c665d 0 4.5px, rgba(108, 102, 93, 0) 6px) 0 0 / 100% 46px repeat-y,
    radial-gradient(circle 6px at calc(100% - 10px) 23px, #6c665d 0 4.5px, rgba(108, 102, 93, 0) 6px) 0 0 / 100% 46px repeat-y,
    linear-gradient(180deg, transparent 0 17px, #7e848a 17px, #f1f3f5 20.5px, #b8bdc2 24px, #6f757b 29px, transparent 29px) 10px 0 / calc(100% - 20px) 46px repeat-y;
}

/* list, ktorý sa otáča okolo špirály */
.notebook-leaf {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: calc((100% - 64px) / 2);
  transform: rotateY(calc(var(--flip) * -180deg));
  transform-origin: calc(-32px) 50%;
  transform-style: preserve-3d;
}

/* keď sa strana neotáča, zošit je plochý: list leží buď vpravo (predná strana), alebo vľavo (zadná strana)
   – vyzerá rovnako, ale prehliadač nemusí pri každom pohybe kamery skladať 3D vrstvy */
.notebook-spot:not(.is-turning) .notebook,
.notebook-spot:not(.is-turning) .notebook-leaf {
  transform-style: flat;
}

.notebook-spot:not(.is-turning) .notebook-leaf {
  transform: none;
}

.notebook-spot.is-flipped:not(.is-turning) .notebook-leaf {
  transform: translateX(calc(-100% - 64px));
}

.notebook-spot:not(.is-turning) .leaf-face {
  backface-visibility: visible;
  -webkit-backface-visibility: visible;
}

.notebook-spot:not(.is-turning):not(.is-flipped) .leaf-back,
.notebook-spot.is-flipped:not(.is-turning) .leaf-front {
  display: none;
}

.notebook-spot.is-flipped:not(.is-turning) .leaf-back {
  transform: none;
}

.is-reading .notebook-leaf {
  cursor: pointer;
}

.leaf-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.leaf-front {
  border-radius: 0 10px 10px 0;
  box-shadow: inset 40px 0 40px -30px rgba(70, 50, 30, 0.3), 2px 3px 0 #ebe5d8;
}

.leaf-back {
  border-radius: 10px 0 0 10px;
  box-shadow: inset -40px 0 40px -30px rgba(70, 50, 30, 0.3), -2px 3px 0 #ebe5d8;
  transform: rotateY(180deg);
}

/* písmo rukou, riadky v pravidelnom rozostupe */
.nb-line {
  margin: 0;
  color: #34323a;
  font: 600 34px/46px var(--font-hand);
}

.nb-title {
  margin: 0;
  color: #c0283a;
  font: 700 76px/92px var(--font-hand);
}

.nb-heading {
  margin: 0;
  color: var(--ink-pink);
  font: 700 46px/46px var(--font-hand);
  text-decoration: underline wavy rgba(196, 81, 99, 0.45) 2px;
  text-underline-offset: 8px;
}

.nb-narrow { max-width: 390px; }
.nb-gap-top { margin-top: 46px; }

.nb-line mark {
  padding: 0 4px;
  background: linear-gradient(transparent 52%, rgba(242, 177, 184, 0.8) 52%);
  color: inherit;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

.nb-quote {
  margin: 40px 0 0;
  text-align: center;
  color: #5a2430;
}

/* cesta SK → CPH nakreslená perom */
.nb-journey {
  display: block;
  width: 100%;
  height: auto;
  margin-top: 96px;
  overflow: visible;
}

.j-ink path {
  fill: none;
  stroke: #34323a;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.j-ink .j-snow { fill: #fffdf6; stroke-width: 2; }
.j-ink .j-dash { stroke: var(--ink-pink); stroke-dasharray: 9 11; }
.j-ink .j-heart { fill: rgba(242, 177, 184, 0.9); stroke: var(--ink-pink); }
.j-ink .j-water { stroke: #6f93c8; }
.j-ink .j-tree { fill: #7fa66f; stroke-width: 2.5; }
.j-ink .j-plane { fill: #ffffff; }
.j-ink .j-windows { fill: rgba(255, 253, 246, 0.85); stroke-width: 2; }

.nb-journey text {
  fill: #526d4b;
  font: 700 38px var(--font-hand);
  text-anchor: middle;
}

.nb-journey .j-to { fill: var(--ink-pink); }

/* kresbičky */
.notebook-page :deep(.nb-doodle) {
  flex: none;
  overflow: visible;
}

/* my focus: tri kresbičky s krátkym popisom */
.nb-focus {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

.nb-focus li {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #34323a;
  font: 700 34px/40px var(--font-hand);
  text-align: center;
}

.nb-focus :deep(.nb-doodle) {
  width: 92px;
  height: 92px;
}

.nb-focus li:nth-child(2) :deep(.nb-doodle) { transform: rotate(4deg); }
.nb-focus li:nth-child(3) :deep(.nb-doodle) { transform: rotate(-3deg); }
.nb-focus li:nth-child(4) :deep(.nb-doodle) { transform: rotate(-5deg); }

/* right now: ikonka + text v dvoch stĺpcoch */
.nb-now {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
}

.nb-now li {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #34323a;
  font: 600 30px/34px var(--font-hand);
}


.nb-now :deep(.nb-doodle) {
  width: 66px;
  height: 66px;
}

/* nadpis s kresbičkou */
.nb-icon-heading {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nb-icon-heading :deep(.nb-doodle) {
  width: 58px;
  height: 58px;
}

/* skills ako rukou obkreslené štítky */
/* skills: nakreslené logá s malým ručne písaným názvom */
.nb-skills {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px 12px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

/* ľavá strana (frontend, design) má viac lôg – štyri v rade, aby sa zmestili do dvoch radov */
.leaf-back .nb-skills {
  grid-template-columns: repeat(4, 1fr);
}

.nb-skill {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transform: rotate(-2deg);
}

.nb-skill:nth-child(even) { transform: rotate(2.5deg) translateY(4px); }
.nb-skill:nth-child(3n) { transform: rotate(-0.5deg) translateY(-2px); }

.nb-logo {
  width: 64px;
  height: 64px;
  overflow: visible;
}

.nb-skill span {
  color: #34323a;
  font: 700 26px/1 var(--font-hand);
  text-align: center;
  max-width: 100%;
}

.nb-turn {
  position: absolute;
  right: 50px;
  bottom: 30px;
  padding: 6px 14px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ink-pink);
  font: 700 34px/1 var(--font-hand);
  cursor: pointer;
  opacity: 0.85;
  transition: background 200ms ease, opacity 200ms ease;
}

.nb-turn:hover,
.nb-turn:focus-visible {
  background: rgba(242, 177, 184, 0.35);
  opacity: 1;
}

.nb-turn-back {
  right: auto;
  left: 80px;
}

/* fotka nalepená na ľavej strane */
.nb-photo {
  position: absolute;
  top: 46px;
  right: 50px;
  width: 230px;
  margin: 0;
  padding: 12px 12px 40px;
  background: #ffffff;
  box-shadow: 0 2px 3px rgba(45, 35, 25, 0.16), 0 10px 16px -6px rgba(45, 35, 25, 0.25);
  transform: rotate(4deg);
}

.nb-photo img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

/* pero */
.pen {
  position: absolute;
  right: 30px;
  bottom: 22px;
  width: 420px;
  height: 22px;
  border-radius: 11px;
  background: linear-gradient(180deg, #4b6aa8, #2f4a80);
  box-shadow: 0 10px 12px rgba(30, 25, 35, 0.25);
  transform: rotate(-4deg);
}

.pen i {
  position: absolute;
  display: block;
}

.pen-cap {
  top: -4px;
  left: 40px;
  width: 10px;
  height: 30px;
  border-radius: 4px;
  background: #d9dde2;
}

.pen-tip {
  top: 4px;
  right: -26px;
  width: 30px;
  height: 14px;
  background: #c9ccd1;
  clip-path: polygon(0 0, 100% 50%, 0 100%);
}
</style>
