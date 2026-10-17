<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { multimediaProjects } from "../data/multimediaProjects.js"

// fotky visia na šnúre – každá sa trochu inak natočí
const rotations = ["-2.5deg", "1.5deg", "-1deg", "2deg", "-1.5deg", "2.5deg"]

const zoomedProject = ref(null) // pre lightbox


// label tlačidla
const typeLabel = (type) => {
  if (type === "video") return "Watch Video"
  if (type === "design") return "View Design"
  return "View More"
}

// funkcia pre tlačidlo
const openLink = (project) => {
  zoomedProject.value = project
}

const closeZoom = () => {
  zoomedProject.value = null
}

const handleKeydown = (e) => {
  if (e.key === 'Escape') closeZoom()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
<!-- fotky na šnúrach so svetielkami na stene (bez viditeľného nadpisu – sekciu pomenuje mapka dole) -->
<section id="multimedia" class="photo-wall" data-focus>
  <h2 class="sr-only">Multimedia projects</h2>


  <!-- POLAROIDY zavesené štipcami na šnúre so svetielkami -->
  <div class="multimedia-board">
    <div v-for="(project, index) in multimediaProjects" :key="project.id" class="line-slot">
      <button
        @click="openLink(project)"
        type="button"
        class="bi polaroid is-pinned"
        :style="{ '--note-rotation': rotations[index % rotations.length], '--d': `${(index % 3) * 120}ms` }"
      >
        <span class="clothespin" aria-hidden="true"></span>
        <div class="bi-paper polaroid-paper">
          <div class="polaroid-photo">
            <img :src="project.image" :alt="project.title" decoding="async" />
            <span v-if="project.type === 'video'" class="polaroid-play" aria-hidden="true">▶</span>
          </div>
          <span class="hand polaroid-caption">{{ project.title }}</span>
          <span class="polaroid-hint">{{ typeLabel(project.type) }}</span>
        </div>
      </button>
    </div>
  </div>

  <!-- LIGHTBOX MODAL pre fotky a videá -->
<Teleport to="body">
  <div
    v-if="zoomedProject"
    class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
    @click="closeZoom"
  >
    <div class="zoom-box" @click.stop>
      <img
        v-if="zoomedProject.type !== 'video'"
        :src="zoomedProject.zoomImage || zoomedProject.image"
        class="zoom-media"
      />

      <iframe
        v-else
        :src="zoomedProject.embedUrl"
        class="zoom-media zoom-video"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>

      <!-- popis projektu pod obrázkom / videom -->
      <div v-if="zoomedProject.shortDescription" class="zoom-caption">
        <h3 class="zoom-caption-title">{{ zoomedProject.title }}</h3>
        <p class="zoom-caption-text">{{ zoomedProject.shortDescription }}</p>
      </div>
    </div>

    <button
      class="absolute top-4 right-6 text-white text-2xl hover:text-[#c45163] transition"
      @click="closeZoom"
    >
      ✕
    </button>
  </div>
</Teleport>
</section>
</template>
<style scoped>
/* zväčšená fotka / video s popisom */
.zoom-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-height: 94vh;
  padding: 0.5rem;
  overflow-y: auto;
}

.zoom-media {
  max-width: 90vw;
  /* obrázok sa zmenší, aby sa popis pod ním zmestil bez scrollu (aj na notebooku) */
  max-height: calc(92vh - 14rem);
  border-radius: 0.75rem;
  object-fit: contain;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.zoom-video {
  width: min(90vw, calc((92vh - 14rem) * 16 / 9));
  max-width: 64rem;
  aspect-ratio: 16 / 9;
}

/* lístok s popisom */
.zoom-caption {
  width: min(90vw, 44rem);
  padding: 1rem 1.4rem 1.1rem;
  border-radius: 0.6rem;
  background: #fdfbf7;
  box-shadow: 0 18px 40px -16px rgba(0, 0, 0, 0.6);
  transform: rotate(-0.6deg);
}

.zoom-caption-title {
  margin: 0 0 0.35rem;
  color: #c0283a;
  font: 700 1.8rem/1.05 var(--font-hand);
}

.zoom-caption-text {
  margin: 0;
  color: #3d3a35;
  font: 400 0.98rem/1.6 var(--font-text);
}
</style>
