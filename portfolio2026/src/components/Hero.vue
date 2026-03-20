<script setup>
const emit = defineEmits(["goAbout"]);

defineProps({
  active: Boolean
});
</script>

<template>
<section class="min-h-screen w-full flex flex-col items-center justify-center text-center px-20 bg-[#fcfaf6]">

  <!-- VIDEO -->
  <div 
    class="w-full max-w-[900px] overflow-hidden transition-all duration-700"
    :class="active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'"
  >
    <video autoplay muted loop class="w-full h-auto object-cover 
      [mask-image:radial-gradient(ellipse_at_center,black_80%,transparent_100%)]
      [-webkit-mask-image:radial-gradient(ellipse_at_center,black_75%,transparent_100%)]">
      <source src="/frames.mp4" type="video/mp4" />
    </video>
  </div>

  <!-- BUTTON -->
<div 
  class="mb-10 transition-all duration-700"
  :class="active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'"
  style="transition-delay: 300ms;"  
>
  <button
    @click="emit('goAbout')"
    class="flex items-center justify-center
          w-[400px] h-[120px]
          bg-[url('/tape.png')] bg-contain bg-no-repeat bg-center
          text-white font-semibold text-3xl
          rotate-[-2deg] hover:rotate-0 hover:scale-105 transition"
  >
    ANDREA HUNČÍKOVÁ
  </button>
</div>

</section>
</template>