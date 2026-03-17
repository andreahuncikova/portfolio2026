<script setup>
import { ref } from "vue"

const open = ref(false)
</script>

<template>

<section id="skills" class="py-24 px-6 text-center">

<h2 class="text-4xl font-bold mb-16">
Skills
</h2>

<!-- MAIN FOLDER -->
<div class="flex justify-center">

<div
@click="open = !open"
class="cursor-pointer bg-white border-2 border-black px-10 py-6 rounded-lg shadow hover:scale-105 transition"
>

📂 skills

</div>

</div>


<!-- SKILL FOLDERS -->
<div
class="flex justify-center gap-12 mt-16 transition-all duration-500"
:class="open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'"
>

<div class="bg-[#f3a0ad]/20 border border-black px-8 py-6 rounded-lg">

<h3 class="font-bold mb-4">Frontend</h3>

<ul class="text-sm space-y-1">
<li>Vue</li>
<li>JavaScript</li>
<li>HTML</li>
<li>CSS</li>
<li>Tailwind</li>
</ul>

</div>


<div class="bg-[#f3a0ad]/20 border border-black px-8 py-6 rounded-lg">

<h3 class="font-bold mb-4">Tools</h3>

<ul class="text-sm space-y-1">
<li>Git</li>
<li>Firebase</li>
<li>VS Code</li>
<li>Figma</li>
</ul>

</div>


<div class="bg-[#f3a0ad]/20 border border-black px-8 py-6 rounded-lg">

<h3 class="font-bold mb-4">Design</h3>

<ul class="text-sm space-y-1">
<li>UX/UI</li>
<li>Photoshop</li>
<li>Illustrator</li>
<li>Premiere Pro</li>
</ul>

</div>

</div>

</section>

</template>