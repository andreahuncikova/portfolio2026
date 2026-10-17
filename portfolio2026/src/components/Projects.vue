<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue"
import { projects } from "../data/projects"

// každý projekt je kniha na poličke pod lávovou lampou, na chrbte názov a pod ním logo projektu; klik ju otvorí
const covers = [
  { height: 470, width: 112 },
  { height: 430, width: 96 },
  { height: 500, width: 124 },
  { height: 445, width: 104 },
  { height: 480, width: 116 }
]

// farba väzby podľa loga projektu, písmo, ktoré projekt naozaj používa, a akcent do otvorenej knihy
// (light = svetlá väzba, tmavé písmo)
const bindings = {
  visionflow: { color: "linear-gradient(180deg, #6366f1, #8b5cf6)", accent: "#6366f1", font: "Inter, sans-serif" },
  tripplanner: { color: "#e8572a", accent: "#e8572a", font: "'Plus Jakarta Sans', sans-serif" },
  "hidden-spots": { color: "#232325", accent: "#232325", font: "Arial, Helvetica, sans-serif" },
  "valuer-internship": { color: "#1c2333", accent: "#4f6bed", font: "Figtree, sans-serif" },
  // Trapholt má Niveau Grotesk (Adobe Fonts, nedá sa voľne načítať) – najbližšia voľná je Jost
  trapholt: { color: "#f1ede4", accent: "#2b2925", font: "Jost, sans-serif", light: true }
}
const bindingOf = (project) => bindings[project.id] || { color: "#3b4a6b", accent: "#3b4a6b" }

// ilustrácia na chrbte knihy, čo projekt robí – kreslená čiarou vo voľnej hornej časti chrbta
// (dole je logo a číslo); viewBox 120 × 480 ≈ chrbát
const spineArt = {
  // VisionFlow: terč so šípkou (logo) a hviezdičky z vision boardu
  visionflow: `
    <circle cx="60" cy="70" r="28"/><circle cx="60" cy="70" r="17"/><circle cx="60" cy="70" r="6" fill="#fff"/>
    <path d="M60 70 L94 36 M87 36 L94 36 L94 43"/>
    <path d="M16 116 l3 7 7 1 -5 5 1 7 -6 -4 -6 4 1 -7 -5 -5 7 -1 z M100 112 l2 5 5 .6 -4 3.4 1 5 -4 -3 -4 3 1 -5 -4 -3.4 5 -.6 z"/>`,
  // TripPlanner: lietadielko na prerušovanej trase letu
  tripplanner: `
    <path d="M24 78 L96 48 L74 104 L62 84 Z M62 84 L96 48 M62 84 L60 102 L72 92"/>
    <path stroke-dasharray="6 8" d="M48 108 C 18 130, 30 150, 60 156"/>`,
  // Hidden Spots: kompas a bodkovaný chodník ku krížiku
  "hidden-spots": `
    <circle cx="60" cy="68" r="28"/><path d="M60 42 L67 68 L60 94 L53 68 Z" fill="#fff"/><path d="M32 68 H38 M82 68 H88 M60 36 V40"/>
    <path stroke-dasharray="2 7" d="M24 150 C 34 126, 60 136, 72 118"/>
    <path d="M80 104 l12 12 M92 104 l-12 12"/>`,
  // Valuer: rastúci graf s bodmi (AI platforma, ktorá hodnotí startupy)
  "valuer-internship": `
    <path d="M16 112 L40 82 L62 96 L100 46 M88 46 H100 V58"/>
    <circle cx="40" cy="82" r="5" fill="#fff"/><circle cx="62" cy="96" r="5" fill="#fff"/>
    <path d="M16 126 H104"/>`,
  // Trapholt: oblúky múzea
  trapholt: `
    <path d="M22 112 V76 A 13 13 0 0 1 48 76 V112 M54 112 V76 A 13 13 0 0 1 80 76 V112 M86 112 V76 A 13 13 0 0 1 112 76 V112 M14 112 H118"/>
    <circle cx="35" cy="56" r="5"/><path d="M60 44 l4 8 -8 0 z"/><circle cx="99" cy="56" r="5"/>`
}
const spineArtUrl = (project) => {
  const art = spineArt[project.id]
  if (!art) return "none"
  const ink = bindingOf(project).light ? "#2b2925" : "#ffffff"
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 480" preserveAspectRatio="xMidYMin slice"><g fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.38">${art.replaceAll("#fff", ink)}</g></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const openProject = ref(null)
const openIndex = ref(0)
const photoZoomed = ref(false)

const open = (project, index) => {
  openProject.value = project
  openIndex.value = index
  photoZoomed.value = false
}

// otvorená kniha: väzba, akcent a písmo projektu
const openStyle = computed(() => {
  const b = openProject.value ? bindingOf(openProject.value) : bindingOf({})
  return { "--cover": b.color, "--accent": b.accent, "--book-font": b.font || "inherit" }
})

// dlhý popis rozdelený na odseky; prvá veta každého odseku je zvýraznená
// a technológie projektu sú v texte podčiarknuté zvýrazňovačom
const escapeRe = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const highlight = (html, tech) => {
  // prvá veta len v odsekoch s viacerými vetami (inak by bol tučný celý odsek)
  let out = html.replace(/^(.+?[.!?])(\s+)(?=\S)/, '<strong class="book-key">$1</strong>$2')
  tech.forEach((term) => {
    out = out.replace(new RegExp(`(^|[^\\w>])(${escapeRe(term)})(?!\\w)`, "i"), '$1<mark class="book-mark">$2</mark>')
  })
  return out
}
const paragraphs = computed(() =>
  (openProject.value?.longDescription || "")
    .split(/(?:\s*<br\s*\/?>\s*){2,}/i)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => highlight(part, openProject.value.tech || []))
)
const close = () => { openProject.value = null }

// odseky, ktoré sa nezmestia na prvú stranu, pokračujú na druhej (kniha sa nescrolluje)
const leftPage = ref(null)
const leftCount = ref(Infinity)
const leftParagraphs = computed(() => paragraphs.value.slice(0, leftCount.value))
const rightParagraphs = computed(() => paragraphs.value.slice(leftCount.value))
const overflows = (el) => !!el && el.scrollHeight > el.clientHeight + 1
const fitPages = async () => {
  leftCount.value = paragraphs.value.length
  await nextTick()
  while (leftCount.value > 0 && overflows(leftPage.value)) {
    leftCount.value--
    await nextTick()
  }
}
watch(openProject, (project) => { if (project) fitPages() })
const refitPages = () => { if (openProject.value) fitPages() }

// odkazy projektu v knihe
const linksOf = (project) => [
  { label: "Live demo", href: project.demo },
  { label: "GitHub", href: project.github },
  { label: "Recommendation letter", href: project.recommendation }
].filter((link) => link.href)

// listy monstery: [x, y päty listu, natočenie, veľkosť] – stonky vedú z košíka k päte
const monsteraLeaves = [
  [112, 392, -84, 0.95],
  [318, 394, 84, 0.92],
  [150, 330, -55, 1.2],
  [282, 324, 52, 1.15],
  [188, 262, -22, 1.3],
  [240, 256, 16, 1.28],
  [214, 214, 2, 0.95]
]

const handleKeydown = (e) => {
  if (e.key !== "Escape") return
  if (photoZoomed.value) photoZoomed.value = false
  else close()
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown)
  window.addEventListener("resize", refitPages)
})
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown)
  window.removeEventListener("resize", refitPages)
})
</script>

<template>
<!-- kovová polička: Marshall a rastlinka hore, monstera, knihy s projektmi, pod nimi lávová lampa, krabica -->
<section id="projects" class="shelf">
  <span class="shelf-post shelf-post-left" aria-hidden="true"></span>
  <span class="shelf-post shelf-post-right" aria-hidden="true"></span>
  <span v-for="top in [0, 700, 1300, 2000, 2620]" :key="top" class="shelf-board" :style="{ top: `${top}px` }" aria-hidden="true"></span>

  <!-- hore na poličke (kamera pri poličke začína tu a ide dole ku knihám) -->
  <!-- krémový Marshall s mosadzným panelom a gombíkmi -->
  <svg class="marshall" viewBox="0 0 440 344" aria-hidden="true">
    <defs>
      <pattern id="marshall-grille" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#e8dfcb" />
        <path d="M0 0 L8 8 M8 0 L0 8" stroke="#d2c6ad" stroke-width="1" />
      </pattern>
      <linearGradient id="marshall-brass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#efe0ad" />
        <stop offset="0.5" stop-color="#c9a55a" />
        <stop offset="1" stop-color="#a8853f" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="432" height="324" rx="22" fill="#f2ead9" stroke="#d8ccb3" stroke-width="6" />
    <rect x="22" y="18" width="396" height="54" rx="6" fill="url(#marshall-brass)" />
    <g v-for="x in [70, 140, 210, 280]" :key="x">
      <circle :cx="x" cy="45" r="17" fill="#2a2724" />
      <circle :cx="x" cy="45" r="9" fill="url(#marshall-brass)" />
    </g>
    <rect x="344" y="32" width="46" height="26" rx="6" fill="#2a2724" />
    <rect x="350" y="36" width="16" height="18" rx="3" fill="url(#marshall-brass)" />
    <rect x="22" y="84" width="396" height="226" rx="10" fill="url(#marshall-grille)" stroke="#d8ccb3" stroke-width="3" />
    <text x="220" y="218" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="74" fill="#b8954e" stroke="#8f6f30" stroke-width="1">Marshall</text>
    <rect x="40" y="328" width="44" height="14" rx="3" fill="#3a3530" />
    <rect x="356" y="328" width="44" height="14" rx="3" fill="#3a3530" />
  </svg>
  <svg class="small-plant" viewBox="0 0 100 230" aria-hidden="true">
    <path d="M50 150 C 44 110, 30 80, 14 64 C 34 72, 46 96, 50 120" fill="#4f7f45" />
    <path d="M50 150 C 50 100, 48 50, 56 10 C 62 50, 58 100, 54 150" fill="#5f9150" />
    <path d="M52 150 C 60 110, 72 84, 90 70 C 78 92, 64 118, 58 150" fill="#4a7741" />
    <path d="M48 150 C 40 124, 26 116, 8 112 C 26 124, 38 136, 44 150" fill="#5f9150" />
    <path d="M22 150 H 78 L 72 226 Q 50 232 28 226 Z" fill="#f5f4f0" />
    <path d="M22 150 H 78 V 160 H 22 Z" fill="#e6e4de" />
  </svg>

  <!-- monstera v prútenom košíku – listy s typickými výrezmi a dierkami -->
  <svg class="monstera" viewBox="0 0 420 690" aria-hidden="true">
    <defs>
      <linearGradient id="monstera-green" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#4c9a50" />
        <stop offset="0.55" stop-color="#357a3a" />
        <stop offset="1" stop-color="#245a29" />
      </linearGradient>
      <mask id="monstera-cuts" maskUnits="userSpaceOnUse" x="-40" y="-40" width="280" height="270">
        <rect x="-40" y="-40" width="280" height="270" fill="white" />
        <g stroke="black" stroke-width="7" stroke-linecap="round">
          <path d="M8 70 L 62 84 M 14 110 L 66 108 M 32 140 L 76 126 M 28 34 L 68 60" />
          <path d="M192 70 L 138 84 M 186 110 L 134 108 M 168 140 L 124 126 M 172 34 L 132 60" />
        </g>
        <g fill="black">
          <ellipse cx="80" cy="98" rx="4" ry="9" />
          <ellipse cx="120" cy="98" rx="4" ry="9" />
          <ellipse cx="86" cy="130" rx="4" ry="8" />
          <ellipse cx="114" cy="130" rx="4" ry="8" />
          <ellipse cx="88" cy="62" rx="3.5" ry="8" />
          <ellipse cx="112" cy="62" rx="3.5" ry="8" />
        </g>
      </mask>
      <pattern id="monstera-weave" width="28" height="22" patternUnits="userSpaceOnUse">
        <rect width="28" height="22" fill="#cfa970" />
        <rect y="9" width="28" height="4" fill="#b08650" />
        <rect x="4" width="6" height="9" rx="2" fill="#dcb980" />
        <rect x="18" y="13" width="6" height="9" rx="2" fill="#dcb980" />
      </pattern>
    </defs>

    <path
      v-for="(leaf, i) in monsteraLeaves"
      :key="`stem-${i}`"
      :d="`M210 420 C ${210 + (leaf[0] - 210) * 0.2} 380, ${leaf[0]} ${leaf[1] + 60}, ${leaf[0]} ${leaf[1]}`"
      fill="none"
      stroke="#4c7a3c"
      stroke-width="6"
      stroke-linecap="round"
    />

    <g
      v-for="(leaf, i) in monsteraLeaves"
      :key="`leaf-${i}`"
      :transform="`translate(${leaf[0]} ${leaf[1]}) rotate(${leaf[2]}) scale(${leaf[3]}) translate(-100 -182)`"
    >
      <g mask="url(#monstera-cuts)">
        <path d="M100 182 C 92 168, 70 160, 50 150 C 18 132, 4 100, 8 66 C 12 30, 50 6, 100 6 C 150 6, 188 30, 192 66 C 196 100, 182 132, 150 150 C 130 160, 108 168, 100 182 Z" fill="url(#monstera-green)" />
        <path d="M100 178 L 100 14 M 100 80 L 40 52 M 100 80 L 160 52 M 100 112 L 30 100 M 100 112 L 170 100 M 100 140 L 50 140 M 100 140 L 150 140" stroke="#6fb36f" stroke-width="2" stroke-opacity="0.55" fill="none" />
        <ellipse cx="78" cy="44" rx="34" ry="14" fill="#ffffff" fill-opacity="0.12" transform="rotate(-20 78 44)" />
      </g>
    </g>

    <rect x="66" y="396" width="288" height="26" rx="12" fill="#b88f58" />
    <path d="M74 418 H 346 L 332 664 Q 210 694 88 664 Z" fill="url(#monstera-weave)" />
    <path d="M74 418 H 346 L 344 440 H 76 Z" fill="#000" fill-opacity="0.08" />
  </svg>

  <!-- obľúbená lávová lampa – Home z nej berie svetlo pri multimédiách -->
  <span class="lava-lamp" data-light aria-hidden="true">
    <i class="lava-glow"></i>
    <i class="lava-cap"></i>
    <i class="lava-glass"><b></b><b></b><b></b></i>
    <i class="lava-base"></i>
  </span>

  <!-- knihy = web development projekty -->
  <div class="books-focus" data-focus aria-hidden="true"></div>
  <h2 class="sr-only">Web development projects</h2>
  <ul class="books">
    <li
      v-for="(project, index) in projects"
      :key="project.id"
      class="book-slot"
    >
      <button
        type="button"
        class="book"
        :class="{ 'is-light': bindingOf(project).light }"
        :style="{
          '--cover': bindingOf(project).color,
          '--spine-font': bindingOf(project).font || 'inherit',
          '--cover-solid': bindingOf(project).color.startsWith('#') ? bindingOf(project).color : bindingOf(project).accent,
          '--art': spineArtUrl(project),
          height: `${covers[index % covers.length].height}px`,
          width: `${covers[index % covers.length].width}px`
        }"
        :aria-label="`Open ${project.title}`"
        @click="open(project, index)"
      >
        <span class="book-band"></span>
        <span class="book-title">{{ project.title }}</span>
        <img :src="project.thumbnail" alt="" class="book-spine-logo" />
        <span class="book-no">{{ String(index + 1).padStart(2, "0") }}</span>
      </button>
    </li>
    <li class="book-slot" aria-hidden="true">
      <span class="bookend"></span>
    </li>
  </ul>

  <span class="shelf-box" aria-hidden="true"></span>

  <!-- otvorená kniha s detailom projektu -->
  <Teleport to="body">
    <Transition name="book">
      <div v-if="openProject" class="book-overlay" @click="close">
        <article class="open-book" role="dialog" aria-modal="true" :aria-label="openProject.title" :style="openStyle" @click.stop>
          <span class="book-ribbon" aria-hidden="true"></span>
          <div ref="leftPage" class="book-page book-page-left">
            <p class="book-kicker">web development project · {{ String(openIndex + 1).padStart(2, "0") }}</p>
            <div class="book-page-head">
              <span class="book-logo-tile"><img :src="openProject.thumbnail" alt="" class="book-logo" /></span>
              <h3>{{ openProject.title }}</h3>
            </div>
            <p class="book-lead">{{ openProject.description }}</p>
            <!-- odkazy hneď pod úvodom, aby boli vidno na prvý pohľad -->
            <div v-if="linksOf(openProject).length" class="book-links">
              <a v-for="link in linksOf(openProject)" :key="link.label" :href="link.href" target="_blank" rel="noopener noreferrer">
                {{ link.label }} <span class="book-link-arrow" aria-hidden="true">↗</span>
              </a>
            </div>
            <p
              v-for="(text, i) in leftParagraphs"
              :key="i"
              class="book-text"
              :class="{ 'book-text-first': i === 0 }"
              v-html="text"
            ></p>
            <span class="book-page-no" aria-hidden="true">– 1 –</span>
          </div>

          <div class="book-page book-page-right">
            <!-- pokračovanie textu z prvej strany (fotka sa posunie pod neho) -->
            <p v-for="(text, i) in rightParagraphs" :key="`more-${i}`" class="book-text" v-html="text"></p>

            <!-- screenshot v okne prehliadača; klik ho zväčší -->
            <button type="button" class="book-photo" :aria-label="`Zoom ${openProject.title} screenshot`" @click="photoZoomed = true">
              <span class="book-browser" aria-hidden="true">
                <i></i><i></i><i></i>
                <span class="book-url">{{ openProject.demo || "localhost" }}</span>
              </span>
              <img :src="openProject.image" :alt="openProject.title" />
            </button>
            <div class="book-section">
              <p class="book-label">built with</p>
              <ul class="book-tech">
                <li v-for="tag in openProject.tech" :key="tag">{{ tag }}</li>
              </ul>
            </div>

            <span class="book-page-no" aria-hidden="true">– 2 –</span>
          </div>

          <button type="button" class="book-close" aria-label="Close" @click="close">✕</button>
        </article>

        <!-- zväčšený screenshot cez knihu -->
        <div v-if="photoZoomed" class="book-zoom" @click.stop="photoZoomed = false">
          <img :src="openProject.image" :alt="openProject.title" />
        </div>
      </div>
    </Transition>
  </Teleport>
</section>
</template>

<style scoped>
.shelf {
  position: relative;
  width: 820px;
  height: 2660px;
}

.shelf-post {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 26px;
  background: linear-gradient(90deg, #9fa3a6, #e2e4e5 45%, #a7abae);
}

.shelf-post-left { left: 0; }
.shelf-post-right { right: 0; }

.shelf-board {
  position: absolute;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(180deg, #eceeef, #b3b7ba);
  box-shadow: 0 10px 12px rgba(40, 30, 20, 0.12);
}

.marshall {
  position: absolute;
  top: -344px;
  left: 40px;
  width: 440px;
  height: 344px;
  filter: drop-shadow(8px 12px 14px rgba(40, 30, 20, 0.18));
}

.small-plant {
  position: absolute;
  top: -460px;
  right: 40px;
  width: 200px;
  height: 460px;
}

.monstera {
  position: absolute;
  top: 10px;
  left: 200px;
  width: 420px;
  height: 690px;
  overflow: visible;
  filter: drop-shadow(6px 12px 12px rgba(30, 40, 20, 0.18));
}

/* lávová lampa */
.lava-lamp {
  position: absolute;
  top: 1430px;
  left: 300px;
  width: 210px;
  height: 570px;
}

.lava-lamp i,
.lava-lamp b {
  position: absolute;
  display: block;
}

.lava-glow {
  top: -320px;
  left: -460px;
  width: 1130px;
  height: 1200px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(255, 120, 60, 0.36), rgba(255, 90, 60, 0) 65%);
  pointer-events: none;
}

.lava-cap {
  top: 0;
  left: 70px;
  width: 70px;
  height: 70px;
  border-radius: 10px 10px 0 0;
  background: #1c1b1d;
}

.lava-glass {
  top: 70px;
  left: 30px;
  width: 150px;
  height: 330px;
  overflow: hidden;
  background: linear-gradient(180deg, #ff7a3d, #ff4b2b 60%, #ff9a3d);
  clip-path: polygon(28% 0, 72% 0, 100% 100%, 0 100%);
}

.lava-glass b {
  border-radius: 50%;
  background: #ffd23f;
  animation: lava-rise 9s ease-in-out infinite alternate;
}

.lava-glass b:nth-child(1) { left: 44px; bottom: 14px; width: 66px; height: 84px; }
.lava-glass b:nth-child(2) { left: 66px; bottom: 160px; width: 42px; height: 50px; animation-duration: 12s; animation-delay: -4s; }
.lava-glass b:nth-child(3) { left: 34px; bottom: 250px; width: 34px; height: 40px; animation-duration: 15s; animation-delay: -8s; }

@keyframes lava-rise {
  from { transform: translateY(0) scale(1); }
  to { transform: translateY(-160px) scale(0.85, 1.15); }
}

.lava-base {
  bottom: 0;
  left: 0;
  width: 210px;
  height: 170px;
  background: linear-gradient(90deg, #1a191b, #3a383c 45%, #18171a);
  clip-path: polygon(14% 0, 86% 0, 100% 100%, 0 100%);
}

/* knihy – kamera sa pozerá len na poličku s knihami (lávová lampa je pod nimi mimo záberu) */
.books-focus {
  position: absolute;
  top: 700px;
  left: -60px;
  right: -60px;
  height: 680px;
}

.books {
  position: absolute;
  bottom: calc(2660px - 1300px);
  left: 70px;
  display: flex;
  align-items: flex-end;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* kniha s tvrdou väzbou: zaoblený chrbát, plátenná textúra a jemná ilustrácia navrchu */
.book {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 18px;
  padding: 24px 0 44px;
  border: 0;
  border-radius: 9px 9px 4px 4px;
  background:
    var(--art) center / 100% 100% no-repeat,
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.035) 0 2px, transparent 2px 5px),
    repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.03) 0 1px, transparent 1px 4px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.34), rgba(0, 0, 0, 0.06) 7%, rgba(255, 255, 255, 0.24) 22%, rgba(255, 255, 255, 0.05) 42%, rgba(0, 0, 0, 0.04) 72%, rgba(0, 0, 0, 0.3)),
    var(--cover);
  box-shadow:
    inset 0 3px 0 rgba(255, 255, 255, 0.16),
    inset 0 -5px 0 rgba(0, 0, 0, 0.2),
    6px 0 10px -2px rgba(40, 30, 20, 0.3);
  transition: transform 300ms cubic-bezier(0.3, 1.3, 0.5, 1), box-shadow 300ms ease;
}

/* vytiahnutá kniha pri hoveri */
.book:hover,
.book:focus-visible {
  box-shadow:
    inset 0 3px 0 rgba(255, 255, 255, 0.16),
    inset 0 -5px 0 rgba(0, 0, 0, 0.2),
    12px 18px 22px -6px rgba(40, 30, 20, 0.4);
  transform: translateY(-40px) rotate(-2deg);
}

/* voľné miesto navrchu chrbta pre ilustráciu */
.book-band {
  flex: none;
  height: 0;
  margin-bottom: 24px;
}

/* dlhý názov sa zalomí do dvoch riadkov vedľa seba (ako na ozajstnom chrbte), nič sa neoreže */
.book-title {
  max-inline-size: 170px;
  margin-top: auto;
  color: #fffdf8;
  font-family: var(--spine-font);
  font-size: 27px;
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: 0.01em;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  text-wrap: balance;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

/* logo projektu pod názvom – malý okrúhly štítok */
.book-spine-logo {
  flex: none;
  width: 64px;
  height: 64px;
  padding: 9px;
  border-radius: 50%;
  background: #fffdf8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  object-fit: contain;
}


.book.is-light .book-title {
  color: #2f2c28;
  text-shadow: none;
}

.book.is-light .book-no { color: rgba(47, 44, 40, 0.6); }
.book.is-light .book-spine-logo { box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.12); }

.book-no {
  color: rgba(255, 255, 255, 0.75);
  font: 400 18px/1 var(--font-mono);
}

.bookend {
  display: block;
  width: 60px;
  height: 300px;
  margin-left: 18px;
  border-radius: 4px 30px 4px 4px;
  background: linear-gradient(90deg, #d7d2c8, #f3efe7);
  transform: rotate(8deg);
  transform-origin: 0 100%;
}

.shelf-box {
  position: absolute;
  top: 2080px;
  left: 120px;
  width: 580px;
  height: 540px;
  border-radius: 10px;
  background:
    radial-gradient(ellipse 90px 32px at 50% 45%, transparent 0 60%, #3b3632 62% 74%, transparent 76%),
    linear-gradient(180deg, #efe6d4, #e2d6bf);
}

/* otvorená kniha */
.book-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 2rem;
  background: rgba(30, 24, 20, 0.55);
  perspective: 1600px;
}

/* tvrdá väzba vo farbe obalu knihy, stoh strán po okrajoch, tieň v strede */
.open-book {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: min(68rem, 100%);
  padding: 0.9rem 0.9rem 1.2rem;
  border-radius: 10px;
  background:
    repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.03) 0 2px, transparent 2px 5px),
    var(--cover, #3b4a6b);
  box-shadow: 0 40px 70px rgba(0, 0, 0, 0.4), inset 0 0 0 2px rgba(0, 0, 0, 0.12);
  perspective: 2200px;
}

/* žliabok medzi stranami */
.open-book::after {
  position: absolute;
  top: 0.9rem;
  bottom: 1.2rem;
  left: 50%;
  z-index: 2;
  width: 46px;
  content: "";
  background: linear-gradient(90deg, transparent, rgba(60, 40, 20, 0.14) 40%, rgba(60, 40, 20, 0.28) 50%, rgba(60, 40, 20, 0.14) 60%, transparent);
  transform: translateX(-50%);
  pointer-events: none;
}

.book-page {
  position: relative;
  max-height: calc(100vh - 7rem);
  overflow: auto;
  padding: 2.4rem 2.4rem 3rem;
  background-color: #fffdf6;
  background-image: var(--paper-grain);
}

.book-page-left {
  border-radius: 6px 2px 2px 6px;
  background-image:
    var(--paper-grain),
    linear-gradient(90deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%, rgba(60, 40, 20, 0.12));
  box-shadow: -3px 3px 0 #f1ebdf, -6px 6px 0 #e6dfd0;
}

.book-page-right {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  border-radius: 2px 6px 6px 2px;
  background-image:
    var(--paper-grain),
    linear-gradient(90deg, rgba(60, 40, 20, 0.12), rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 0.02));
  box-shadow: 3px 3px 0 #f1ebdf, 6px 6px 0 #e6dfd0;
  transform-origin: 0 50%;
}

.book-page-no {
  position: absolute;
  right: 0;
  bottom: 1rem;
  left: 0;
  color: #a39d92;
  font: 400 0.7rem/1 var(--font-mono);
  text-align: center;
}

/* záložka visiaca z knihy */
.book-ribbon {
  position: absolute;
  bottom: -2.4rem;
  left: calc(50% + 2.4rem);
  z-index: 3;
  width: 1.2rem;
  height: 3.6rem;
  background: #c45163;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%);
}

/* obsah knihy je v písme projektu, akcenty vo farbe jeho loga */
.book-page {
  font-family: var(--book-font);
}

.book-kicker {
  margin: 0 0 0.9rem;
  color: #a39d92;
  font: 400 0.66rem/1 var(--font-mono);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.book-page-head {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 1.4rem;
}

.book-logo-tile {
  display: grid;
  flex: none;
  place-items: center;
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 0.8rem;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06), 0 6px 14px -6px rgba(45, 35, 25, 0.35);
}

.book-logo {
  width: 2.3rem;
  height: 2.3rem;
  object-fit: contain;
}

.book-page-head h3 {
  margin: 0;
  color: #2b2925;
  font: 700 clamp(1.7rem, 3vw, 2.2rem) / 1.1 var(--book-font);
  letter-spacing: -0.01em;
}

/* krátky popis ako zvýraznený úvod */
.book-lead {
  margin: 0 0 1.5rem;
  padding: 0.2rem 0 0.2rem 1rem;
  border-left: 3px solid var(--accent);
  color: #2f2c28;
  font: 500 1.12rem/1.5 var(--book-font);
}

/* odseky: vzdušný riadok, rozumná šírka, prvé písmeno ako iniciála */
.book-text {
  max-width: 36em;
  margin: 0 0 1.1rem;
  color: #4d4840;
  font: 400 0.95rem/1.8 var(--book-font);
}

.book-text :deep(.book-key) {
  color: #2b2925;
  font-weight: 600;
}

.book-text :deep(.book-mark) {
  padding: 0 0.15em;
  border-radius: 2px;
  background: linear-gradient(transparent 55%, color-mix(in srgb, var(--accent) 22%, transparent) 55%);
  color: inherit;
}

.book-text-first::first-letter {
  float: left;
  margin: 0.35rem 0.55rem 0 0;
  color: var(--accent);
  font: 700 3.3rem/0.8 var(--book-font);
}

.book-section {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.book-label {
  margin: 0;
  color: #a39d92;
  font: 400 0.66rem/1 var(--font-mono);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.book-photo {
  display: block;
  padding: 0;
  overflow: hidden;
  border: 1px solid #e3ded4;
  border-radius: 8px;
  background: #fff;
  cursor: zoom-in;
  box-shadow: 0 2px 4px rgba(45, 35, 25, 0.18), 0 10px 18px -6px rgba(45, 35, 25, 0.25);
  transform: rotate(1.2deg);
}

.book-browser {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.6rem;
  border-bottom: 1px solid #ebe6dc;
  background: #f4f1ea;
}

.book-browser i {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #ff5f57;
}

.book-browser i:nth-child(2) { background: #febc2e; }
.book-browser i:nth-child(3) { background: #28c840; }

.book-url {
  flex: 1;
  min-width: 0;
  margin-left: 0.4rem;
  padding: 0.15rem 0.5rem;
  overflow: hidden;
  border-radius: 4px;
  background: #fff;
  color: #9a948a;
  font: 400 0.62rem/1.3 var(--font-mono);
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-photo img {
  display: block;
  width: 100%;
  /* celý screenshot v jeho pomere – nič sa neoreže */
  height: auto;
}

.book-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.book-tech li {
  padding: 0.3rem 0.55rem;
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  border-radius: 4px;
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  color: var(--accent);
  font: 400 0.68rem/1.2 var(--font-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.book-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin: 0 0 1.4rem;
}

/* odkazy ako výrazné tlačidlá: prvé (live demo) plné, ostatné obrysové */
.book-links a {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.75rem 1.2rem;
  border: 2px solid var(--accent);
  border-radius: 999px;
  background: #fffdf8;
  color: var(--accent);
  font: 700 0.78rem/1 var(--font-mono);
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 6px 14px -8px color-mix(in srgb, var(--accent) 70%, transparent);
  transition: background 200ms ease, color 200ms ease, transform 200ms ease, box-shadow 200ms ease;
}

.book-links a:first-child {
  background: var(--accent);
  color: #fffdf8;
}

.book-links a:hover,
.book-links a:focus-visible {
  background: var(--accent);
  color: #fffdf8;
  box-shadow: 0 12px 20px -10px color-mix(in srgb, var(--accent) 85%, transparent);
  transform: translateY(-2px);
}

.book-link-arrow {
  font-size: 1.05em;
  transition: transform 200ms ease;
}

.book-links a:hover .book-link-arrow,
.book-links a:focus-visible .book-link-arrow {
  transform: translate(2px, -2px);
}

.book-zoom {
  position: fixed;
  inset: 0;
  z-index: 110;
  display: grid;
  place-items: center;
  padding: 2rem;
  background: rgba(20, 16, 14, 0.85);
  cursor: zoom-out;
}

.book-zoom img {
  max-width: 92vw;
  max-height: 90vh;
  border-radius: 10px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
  object-fit: contain;
}

.book-close {
  position: absolute;
  top: 1.4rem;
  right: 1.6rem;
  border: 0;
  background: none;
  color: #8a857c;
  font-size: 1.4rem;
}

.book-close:hover {
  color: var(--ink-pink);
}

/* kniha sa otvorí: prichádza zmenšená a mierne naklonená, pravá strana sa rozloží ako list */
.book-enter-active,
.book-leave-active {
  transition: opacity 350ms ease;
}

.book-enter-active .open-book,
.book-leave-active .open-book {
  transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
}

.book-enter-active .book-page-right {
  transition: transform 800ms cubic-bezier(0.22, 1, 0.36, 1) 150ms;
}

.book-enter-from,
.book-leave-to {
  opacity: 0;
}

.book-enter-from .open-book,
.book-leave-to .open-book {
  transform: translateY(2.5rem) rotateX(14deg) scale(0.86);
}

.book-enter-from .book-page-right {
  transform: rotateY(-120deg);
}

@media (max-width: 767px) {
  .open-book { grid-template-columns: 1fr; }
  .book-page-left,
  .book-page-right { border-radius: 4px; box-shadow: none; }
}
</style>
