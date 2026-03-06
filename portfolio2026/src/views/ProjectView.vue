<script setup>
import { useRoute } from "vue-router"
import { projects } from "../data/projects"

const route = useRoute()

const project = projects.find(
p => p.id === route.params.id
)
</script>

<template>

<section class="max-w-4xl mx-auto py-24 px-6">

<img
:src="project.image"
class="rounded-xl mb-8"
/>

<h1 class="text-4xl font-bold mb-6">
{{ project.title }}
</h1>

<p class="text-slate-300 mb-6">
{{ project.longDescription }}
</p>

<div class="flex gap-4 mb-8">

<span
v-for="tech in project.tech"
class="bg-slate-800 px-3 py-1 rounded"
>
{{ tech }}
</span>

</div>

<div class="flex gap-6">

<a
:href="project.github"
class="text-indigo-400"
>
GitHub
</a>

<a
:href="project.demo"
class="text-indigo-400"
>
Live Demo
</a>

</div>

</section>

</template>