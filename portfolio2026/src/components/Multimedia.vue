<script setup>
import { multimediaProjects } from "../data/multimediaProjects.js";
</script>

<template>
<section id="multimedia" class="py-24 px-6 opacity-0 animate-fadeIn">
  <h2 class="text-4xl font-bold text-center mb-12">
    Multimedia Design Work
  </h2>

  <!-- Asymetrická galéria -->
  <div class="max-w-6xl mx-auto space-y-6">

    <!-- Prvý riadok: 3 obrázky -->
    <div class="grid grid-cols-3 gap-6">
      <div v-for="project in multimediaProjects.slice(0,3)" :key="project.id" class="relative h-80 group rounded-xl overflow-hidden cursor-pointer">
        <img :src="project.image" class="w-full h-full object-cover object-bottom transition-transform duration-300 group-hover:scale-110" />
        <div class="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center text-center p-4 transition-opacity duration-300">
          <h3 class="text-white font-bold text-lg mb-2">{{ project.title }}</h3>
          <p class="text-gray-200 text-sm mb-4">{{ project.shortDescription }}</p>
          <a :href="project.link" class="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition">View More</a>
        </div>
      </div>
    </div>

    <!-- Druhý riadok: 2 väčšie obrázky -->
    <div class="grid grid-cols-2 gap-6">
      <div v-for="project in multimediaProjects.slice(3,5)" :key="project.id" class="relative h-96 group rounded-xl overflow-hidden cursor-pointer">
        <img :src="project.image" class="w-full h-full object-cover object-bottom transition-transform duration-300 group-hover:scale-110" />
        <div class="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center text-center p-4 transition-opacity duration-300">
          <h3 class="text-white font-bold text-lg mb-2">{{ project.title }}</h3>
          <p class="text-gray-200 text-sm mb-4">{{ project.shortDescription }}</p>
          <a :href="project.link" class="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition">View More</a>
        </div>
      </div>
    </div>

    <!-- Tretí riadok: 3 obrázky -->
    <div class="grid grid-cols-3 gap-6">
      <div v-for="project in multimediaProjects.slice(5,8)" :key="project.id" class="relative h-80 group rounded-xl overflow-hidden cursor-pointer">
        <img :src="project.image" class="w-full h-full object-cover object-bottom transition-transform duration-300 group-hover:scale-110" />
        <div class="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center text-center p-4 transition-opacity duration-300">
          <h3 class="text-white font-bold text-lg mb-2">{{ project.title }}</h3>
          <p class="text-gray-200 text-sm mb-4">{{ project.shortDescription }}</p>
          <a :href="project.link" class="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition">View More</a>
        </div>
      </div>
    </div>

  </div>
</section>
</template>