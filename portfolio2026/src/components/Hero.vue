<template>
<section class="min-h-screen w-full flex flex-col items-center justify-center text-center px-6" style="background-color:#fcfaf6;">
    <!-- Video above text -->
    <div class="w-full max-w-[1000px] overflow-hidden">
      <video autoplay muted loop class="w-full h-auto object-cover rounded-lg">
        <source src="/frames.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>

    <!-- Hero content -->
    <h1 class="text-5xl md:text-6xl font-bold text-white">
      Hi, I'm <span class="text-indigo-400">Andrea</span>
    </h1>


    <!-- Buttons -->
    <div class="flex gap-4 justify-center">
      <a href="#projects" class="bg-indigo-500 px-6 py-3 rounded-lg hover:bg-indigo-600">
        View Projects
      </a>
      <a href="#contact" class="border border-slate-600 px-6 py-3 rounded-lg hover:border-indigo-400">
        Contact Me
      </a>
    </div>

  </section>
</template>

<script>
export default {
  // Nothing special needed
}
</script>

<style scoped>
/* Optional: add shadow or border effect to video frame */
</style>