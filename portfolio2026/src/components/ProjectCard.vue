<script setup>
defineProps(["project"])
</script>

<template>

<router-link :to="'/project/' + project.id">

<div class="bg-slate-900 rounded-xl overflow-hidden hover:scale-105 transition cursor-pointer fade-up">

<img :src="project.image" class="w-full h-48 object-cover"/>

<div class="p-6">

<h3 class="text-xl font-semibold mb-2">
{{ project.title }}
</h3>

<p class="text-slate-400 text-sm mb-4">
{{ project.description }}
</p>

<div class="flex gap-2 flex-wrap">

<span
v-for="tech in project.tech"
class="text-xs bg-slate-800 px-2 py-1 rounded"
>
{{ tech }}
</span>

</div>

</div>

</div>

</router-link>

</template>