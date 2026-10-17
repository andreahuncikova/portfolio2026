<script setup>
import { useRoute, useRouter } from "vue-router"
import { projects } from "../data/projects"
import { computed, ref, onMounted, onUnmounted } from "vue"

const route = useRoute()
const router = useRouter()

const project = computed(() => projects.find(p => p.id === route.params.id))
const isZoomed = ref(false)

const goBack = () => router.push("/")

const handleKeydown = (e) => {
  if (e.key === 'Escape') isZoomed.value = false
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
<section v-if="project" class="project-page max-w-7xl mx-auto py-16 px-6 min-h-screen flex flex-col justify-center">


  <!-- HEADER (back button) -->
  <div class="relative mb-12 lg:mb-4 flex items-center justify-center">
    <button
      @click="goBack"
      class="absolute left-0 px-4 py-2 border border-black text-black rounded-lg hover:bg-black hover:text-white transition"
    >
      ← Back
    </button>
  </div>

  <!-- TITLE -->
  <div class="relative mb-12 flex items-center justify-center">
    <h1 class="text-4xl md:text-5xl font-bold text-[#c45163] text-center">
      {{ project.title }}
    </h1>
  </div>

  <!-- CONTENT -->
<div class="flex flex-col md:flex-row gap-10 items-center">

  <!-- IMAGE ako browser mockup -->
  <div
    class="w-full md:w-3/5 rounded-xl shadow-xl overflow-hidden border border-neutral-200 cursor-zoom-in flex-shrink-0"
    @click="isZoomed = true"
  >
    <!-- Browser bar -->
    <div class="bg-neutral-100 border-b border-neutral-200 px-4 py-2 flex items-center gap-2">
      <span class="w-3 h-3 rounded-full bg-red-400"></span>
      <span class="w-3 h-3 rounded-full bg-yellow-400"></span>
      <span class="w-3 h-3 rounded-full bg-green-400"></span>
      <div class="ml-3 flex-1 bg-white rounded-md px-3 py-1 text-xs text-neutral-400 truncate">
        {{ project.demo || 'localhost' }}
      </div>
    </div>

    <!-- Screenshot -->
    <img
      :src="project.image"
      alt="Project Image"
      class="w-full object-cover object-top"
    />
  </div>

  <!-- RIGHT SIDE -->
  <div class="flex-1">
    <div class="flex flex-wrap gap-3 mb-4">
      <span
        v-for="tech in project.tech"
        :key="tech"
        class="bg-[#c45163]/20 text-[#c45163] border border-[#c45163] px-3 py-1 rounded-lg text-sm font-semibold"
      >
        {{ tech }}
      </span>
    </div>

    <p class="text-black mb-6 text-justify" v-html="project.longDescription"></p>

    <h2 class="text-2xl font-bold text-[#c45163] mt-12 mb-4">See Links:</h2>

    <div class="flex gap-6">
      <a v-if="project.github" :href="project.github" target="_blank" rel="noopener noreferrer"
        class="px-5 py-2 rounded-lg border-2 border-[#c45163] text-[#c45163] font-semibold hover:bg-[#c45163] hover:text-white transition-all">
        GitHub
      </a>
      <a v-if="project.demo" :href="project.demo" target="_blank" rel="noopener noreferrer"
        class="px-5 py-2 rounded-lg border-2 border-[#c45163] text-[#c45163] font-semibold hover:bg-[#c45163] hover:text-white transition-all">
        Live Demo
      </a>
      <a v-if="project.recommendation" :href="project.recommendation" target="_blank" rel="noopener noreferrer"
    class="px-5 py-2 rounded-lg border-2 border-[#c45163] text-[#c45163] font-semibold hover:bg-[#c45163] hover:text-white transition-all">
    Recommendation Letter
  </a>
    </div>
  </div>
</div>

  <!-- LIGHTBOX MODAL -->
  <Teleport to="body">
    <div
      v-if="isZoomed"
      class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      @click="isZoomed = false"
    >
      <!-- ESC hint -->
      <span class="absolute top-4 right-6 text-white/60 text-sm"></span>

      <img
        :src="project.image"
        alt="Zoomed"
        class="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
        @click.stop
      />

      <!-- X button -->
      <button
        class="absolute top-4 right-6 text-white text-2xl hover:text-[#c45163] transition"
        @click="isZoomed = false"
      >
        ✕
      </button>
    </div>
  </Teleport>

</section>

<section v-else class="min-h-screen flex flex-col items-center justify-center gap-4">
  <p class="text-xl font-semibold text-neutral-500">Project not found.</p>
  <button
    @click="router.push('/')"
    class="px-4 py-2 border border-black rounded-lg hover:bg-black hover:text-white transition"
  >
    ← Go Home
  </button>
</section>
</template>