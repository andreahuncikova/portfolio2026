<script setup>
import { projects } from "../data/projects"
import ProjectCard from "./ProjectCard.vue"
</script>

<template>

<section id="projects" class="py-24">

<h2 class="text-4xl font-bold text-center mb-12">
Projects
</h2>

<div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

<ProjectCard
v-for="project in projects"
:key="project.id"
:project="project"
/>

</div>

</section>

</template>