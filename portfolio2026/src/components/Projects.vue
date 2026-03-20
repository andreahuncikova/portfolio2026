<script setup>
import { projects } from "../data/projects"
</script>

<template>

<section id="projects" class="py-24 px-6">

<h2 class="text-4xl font-bold text-center mb-16 text-[#f3a0ad]">
PROJECTS
</h2>

<div class="max-w-4xl mx-auto space-y-6">

<RouterLink
v-for="project in projects"
:key="project.id"
:to="`/project/${project.id}`"
class="group block border border-black rounded-xl p-5 bg-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
>

<div class="flex items-start gap-6">

<!-- IMAGE -->
<img
:src="project.image"
class="w-20 h-20 object-cover rounded-lg transition-all duration-300 group-hover:w-28 group-hover:h-28"
/>

<div class="flex-1">

<!-- TITLE -->
<h3 class="text-xl font-semibold mb-2">
{{ project.title }}
</h3>

<!-- SHORT DESCRIPTION (always visible) -->
<p class="text-sm text-neutral-600">
{{ project.shortDescription }}
</p>

<!-- HOVER INFO -->
<div class="overflow-hidden max-h-0 transition-all duration-300 group-hover:max-h-40">

<p class="text-sm text-neutral-500 mt-3">
{{ project.description }}
</p>

<div class="flex gap-2 mt-3 flex-wrap">

<span
v-for="tag in project.tech"
:key="tag"
class="text-xs border border-black px-2 py-1 rounded"
>
{{ tag }}
</span>

</div>

</div>

</div>

<!-- ARROW -->
<span class="text-[#f3a0ad] text-xl transition-transform duration-300 group-hover:translate-x-1">
→
</span>

</div>

</RouterLink>

</div>

</section>

</template>