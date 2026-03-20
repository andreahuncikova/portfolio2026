<script setup>
defineProps({
  active: Boolean
});


import { MapPinIcon, UserIcon, PaintBrushIcon, CodeBracketIcon } from '@heroicons/vue/24/solid'

</script>

<template>
<section id="about" class="py-24 max-w-6xl mx-auto px-6 pt-32">

<div class="grid md:grid-cols-2 gap-24 items-center">

<!-- LEFT SIDE -->
<div
  class="transition-all duration-700"
  :class="active 
    ? 'opacity-100 translate-x-0' 
    : 'opacity-0 -translate-x-20'"
>

<h2 class="text-4xl font-bold mb-6 text-[#f3a0ad]">
ABOUT ME
</h2>
<p class="text-neutral-700 mb-6 leading-relaxed">
I'm a Web Development student at <span class="text-[#f3a0ad] font-semibold">SEA – Syddansk Erhvervsakademi</span> in Esbjerg, originally from Slovakia. My education focuses on <span class="text-[#f3a0ad] font-semibold">building modern web applications</span> by combining technical development, web standards, and strong UX and interface design skills from my Multimedia Design background.
</p>

<p class="text-neutral-700 leading-relaxed">
During the programme I learn to work with core areas such as <span class="text-[#f3a0ad] font-semibold">front‑end</span> and <span class="text-[#f3a0ad] font-semibold">back‑end web development</span>, development environments, databases, and user experience principles, as well as completing practical projects and real‑world challenges.
</p>

<!-- skills -->
<div class="flex flex-wrap gap-3 mt-8">
<span class="px-3 py-1 bg-[#f3a0ad]/20 text-black rounded-full text-sm font-semibold">Vue</span>
<span class="px-3 py-1 bg-[#f3a0ad]/20 text-black rounded-full text-sm font-semibold">JavaScript</span>
<span class="px-3 py-1 bg-[#f3a0ad]/20 text-black rounded-full text-sm font-semibold">TypeScript</span>
<span class="px-3 py-1 bg-[#f3a0ad]/20 text-black rounded-full text-sm font-semibold">UI/UX</span>
<span class="px-3 py-1 bg-[#f3a0ad]/20 text-black rounded-full text-sm font-semibold">Figma</span>
</div>

</div>


<!-- RIGHT SIDE -->
<div class="relative">

<div
  class="transition-all duration-700 delay-300"
  :class="active 
    ? 'opacity-100 translate-x-0' 
    : 'opacity-0 translate-x-20'"
>

<div class="bg-white border border-[#f3a0ad] rounded-2xl p-8 shadow-sm">

<h3 class="text-xl font-semibold mb-4 text-[#f3a0ad]">
Quick Facts
</h3>

<ul class="space-y-3 text-neutral-700 mt-6">
  <li class="flex items-center">
    <MapPinIcon class="w-5 h-5 text-black mr-2" />
    Based in Denmark
  </li>
  <li class="flex items-center">
    <UserIcon class="w-5 h-5 text-black mr-2" />
    Current Bachelor's student in Web Development
  </li>
  <li class="flex items-center">
    <PaintBrushIcon class="w-5 h-5 text-black mr-2" />
    AP Degree in Multimedia Design
  </li>
  <li class="flex items-center">
    <CodeBracketIcon class="w-5 h-5 text-black mr-2" />
    Focus on modern frontend development
  </li>
</ul>

</div>

<!-- decoration -->
<div class="absolute -z-10 top-5 right-5 w-full h-full bg-[#f3a0ad]/20 rounded-2xl"></div>

</div>

</div>

</div>
</section>
</template>