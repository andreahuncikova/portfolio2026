<template>
<section class="min-h-screen w-full flex flex-col items-center justify-center text-center px-6" style="background-color:#fcfaf6;">
    <!-- Video above text -->
    <div class="w-full max-w-[1000px] overflow-hidden">
      <video autoplay muted loop class="w-full h-auto object-cover rounded-lg">
        <source src="/frames.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>



      <div class="flex gap-6 justify-center mb-40">

    <a 
    href="#about"
    class="bg-[#f3a0ad] text-white px-8 py-3 font-semibold rotate-[-2deg] shadow-md hover:rotate-0 transition"
    >
    ABOUT ME
    </a>

    <a 
    href="#projects"
    class="bg-black text-white px-8 py-3 font-semibold rotate-[2deg] shadow-md hover:rotate-0 transition"
    >
    MY WORK
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