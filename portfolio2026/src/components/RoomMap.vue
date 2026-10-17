<script setup>
import { ref } from "vue"

// navigácia dole: šípky, ikonky zastávok v izbe (aktívna ukáže svoj názov)
// a pod nimi posuvník – ukazuje, kde v izbe si, a dá sa ťahať myšou aj prstom
const props = defineProps({
  // [{ id, label }]
  items: { type: Array, required: true },
  activeId: { type: String, default: "" },
  canPrev: Boolean,
  canNext: Boolean
})

const emit = defineEmits(["navigate", "step", "scrub", "scrub-end"])

// jednoduché čiarové ikonky (viewBox 24×24)
const icons = {
  hero: "M3 7h18v10H3zM3 9.5h18M3 14.5h18M9 9.5v5M15 9.5v5M6 7v-1M10 7v-1M14 7v-1M18 7v-1",
  about: "M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5M12 6.5c2-1.5 5-2 8-1.5v13c-3-.5-6 0-8 1.5M12 6.5v13",
  skills: "M5 6l1.5 1.5L9 5M5 12l1.5 1.5L9 11M5 18l1.5 1.5L9 17M12 6.5h7M12 12.5h7M12 18.5h7",
  projects: "M5 19V7h3v12M8 19V5h3.5v14M11.5 19V8h3v11M15.5 18.5l2.5-10 2.8.7-2.5 10M3.5 19.5h17",
  multimedia: "M3 6c6 2 12 2 18 0M6.5 7.2v1.3M17.5 7.2v1.3M5 9h5v7H5zM14 9h5v7h-5z",
  contact: "M4 4h16v11H4zM12 15v4M8 19h8M7 7l5 4 5-4"
}

// Home posúva posuvník každý snímok priamo (bez prekresľovania Vue);
// slot = poradie zastávky, medzi zastávkami desatinné číslo
const track = ref(null)
const fill = ref(null)
const thumb = ref(null)
const dragging = ref(false)

// len transformácie (bez prepočtu rozloženia) a len pri zmene
let lastFraction = -1
const show = (fraction) => {
  const f = Math.round(fraction * 1000) / 1000
  if (!fill.value || f === lastFraction) return
  lastFraction = f
  fill.value.style.transform = `scaleX(${f})`
  thumb.value.style.transform = `translateX(${f * 100}%)`
}

const setProgress = (slot) => {
  if (dragging.value || props.items.length < 2) return
  show(slot / (props.items.length - 1))
}

// ťahanie: posuvník ide presne za myšou, kamera ide za ním
const slotAt = (clientX) => {
  const rect = track.value.getBoundingClientRect()
  const fraction = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
  show(fraction)
  return fraction * (props.items.length - 1)
}

let lastSlot = 0
const onPointerDown = (e) => {
  dragging.value = true
  track.value.setPointerCapture(e.pointerId)
  lastSlot = slotAt(e.clientX)
  emit("scrub", lastSlot)
}
const onPointerMove = (e) => {
  if (!dragging.value) return
  lastSlot = slotAt(e.clientX)
  emit("scrub", lastSlot)
}
const onPointerUp = () => {
  if (!dragging.value) return
  dragging.value = false
  // po pustení kamera dôjde k najbližšej veci
  emit("scrub-end", lastSlot)
}

const onKeydown = (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowDown") emit("step", -1)
  else if (e.key === "ArrowRight" || e.key === "ArrowUp") emit("step", 1)
  else return
  e.preventDefault()
}

defineExpose({ setProgress })
</script>

<template>
  <nav class="room-map" aria-label="Room">
    <div class="room-map-row">
    <button type="button" class="room-map-arrow" aria-label="Previous" :disabled="!canPrev" @click="emit('step', -1)">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
    </button>
    <ul class="room-map-list">
      <li v-for="item in items" :key="item.id">
        <button
          type="button"
          class="room-map-item"
          :class="{ 'is-active': activeId === item.id }"
          :aria-current="activeId === item.id ? 'true' : null"
          @click="emit('navigate', item.id)"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="icons[item.id]" /></svg>
          <span class="room-map-label">{{ item.label }}</span>
        </button>
      </li>
    </ul>
    <button type="button" class="room-map-arrow" aria-label="Next" :disabled="!canNext" @click="emit('step', 1)">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
    </button>
    </div>

    <!-- posuvník po izbe -->
    <div
      ref="track"
      class="room-map-scrub"
      :class="{ 'is-dragging': dragging }"
      role="slider"
      tabindex="0"
      aria-label="Move through the room"
      :aria-valuemin="1"
      :aria-valuemax="items.length"
      :aria-valuenow="Math.max(1, items.findIndex((i) => i.id === activeId) + 1)"
      :aria-valuetext="items.find((i) => i.id === activeId)?.label"
      @pointerdown.prevent="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @keydown="onKeydown"
    >
      <span class="room-map-rail"></span>
      <span ref="fill" class="room-map-fill"></span>
      <span
        v-for="(item, i) in items"
        :key="item.id"
        class="room-map-tick"
        :style="{ left: `${(i / Math.max(1, items.length - 1)) * 100}%` }"
      ></span>
      <span ref="thumb" class="room-map-thumb-run"><span class="room-map-thumb"></span></span>
    </div>
  </nav>
</template>

<style scoped>
.room-map {
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  bottom: 1.25rem;
  left: 50%;
  z-index: 50;
  padding: 0.4rem;
  border: 1px solid rgba(61, 58, 53, 0.1);
  border-radius: 999px;
  background: rgba(253, 251, 247, 0.82);
  box-shadow: 0 10px 30px -12px rgba(45, 35, 25, 0.35);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transform: translateX(-50%);
}

/* šípky na krajoch: o jednu vec dozadu / dopredu */
.room-map-arrow {
  display: grid;
  flex: none;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  border: 1px solid rgba(61, 58, 53, 0.12);
  border-radius: 50%;
  background: #fffdf8;
  color: var(--ink-pink);
  transition: background-color 250ms ease, color 250ms ease, opacity 250ms ease;
}

.room-map-arrow svg {
  width: 1.2rem;
  height: 1.2rem;
}

.room-map-arrow path {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.room-map-arrow:hover:not(:disabled) {
  background: var(--ink-pink);
  color: #fffdf8;
}

.room-map-arrow:disabled {
  opacity: 0.3;
  cursor: default;
}

.room-map-row {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.room-map-list {
  display: flex;
  gap: 0.2rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.room-map-item {
  display: flex;
  align-items: center;
  gap: 0;
  height: 2.6rem;
  padding: 0 0.7rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--ink);
  transition: background-color 250ms ease, color 250ms ease, gap 300ms ease;
}

.room-map-item svg {
  flex: none;
  width: 1.35rem;
  height: 1.35rem;
}

.room-map-item path {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* názov je skrytý, aktívna vec ho rozbalí */
.room-map-label {
  max-width: 0;
  overflow: hidden;
  font: 700 1.35rem/1 var(--font-hand);
  white-space: nowrap;
  transition: max-width 350ms ease;
}

.room-map-item:hover {
  background: rgba(196, 81, 99, 0.08);
  color: var(--ink-pink);
}

.room-map-item.is-active {
  gap: 0.45rem;
  background: var(--ink-pink);
  color: #fffdf8;
}

.room-map-item.is-active .room-map-label {
  max-width: 8rem;
  padding-right: 0.1em;
}

/* posuvník: koľajnička s bodkami za každú vec a guľôčka, ktorá sa dá chytiť a ťahať */
.room-map-scrub {
  position: relative;
  height: 1.5rem;
  margin: 0 1.5rem 0.1rem;
  cursor: grab;
  touch-action: none;
}

.room-map-scrub.is-dragging {
  cursor: grabbing;
}

.room-map-scrub:focus-visible {
  outline: 2px solid rgba(196, 81, 99, 0.45);
  outline-offset: 2px;
  border-radius: 999px;
}

.room-map-rail,
.room-map-fill {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  height: 6px;
  margin-top: -3px;
  border-radius: 999px;
}

.room-map-rail {
  background: rgba(61, 58, 53, 0.12);
}

.room-map-fill {
  background: var(--ink-pink);
  transform: scaleX(0);
  transform-origin: 0 50%;
}

.room-map-tick {
  position: absolute;
  top: 50%;
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  border-radius: 50%;
  background: #fffdf8;
  box-shadow: 0 0 0 1.5px rgba(61, 58, 53, 0.25);
}

/* pás cez celú koľajničku, posúva sa transformáciou; guľôčka je na jeho ľavom okraji */
.room-map-thumb-run {
  position: absolute;
  inset: 0;
  pointer-events: none;
  will-change: transform;
}

.room-map-thumb {
  position: absolute;
  top: 50%;
  left: 0;
  width: 18px;
  height: 18px;
  margin: -9px 0 0 -9px;
  border: 3px solid #fffdf8;
  border-radius: 50%;
  background: var(--ink-pink);
  box-shadow: 0 2px 6px rgba(45, 35, 25, 0.35);
  transition: transform 200ms ease;
}

.room-map-scrub:hover .room-map-thumb,
.room-map-scrub.is-dragging .room-map-thumb {
  transform: scale(1.25);
}

/* na počítači je mapka širšia a názvy všetkých sekcií sú stále vidno */
@media (min-width: 900px) {
  .room-map { padding: 0.5rem 1.3rem; }
  .room-map-list { gap: 0.4rem; }
  .room-map-item { gap: 0.45rem; padding: 0 1.1rem; height: 2.8rem; }
  /* ručné písmo trochu presahuje svoj box ("!" v "hi!") – na počítači sa názov neorezáva */
  .room-map-label { max-width: 8rem; overflow: visible; padding-right: 0.1em; }
  .room-map-arrow { width: 2.8rem; height: 2.8rem; }
  .room-map-scrub { margin: 0.1rem 2.3rem 0.15rem; }
}

@media (max-width: 600px) {
  .room-map { bottom: 0.75rem; }
  .room-map-item { padding: 0 0.55rem; height: 2.4rem; }
  .room-map-item.is-active .room-map-label { max-width: 6rem; }
}
</style>
