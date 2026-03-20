<template>
<section class="min-h-screen w-full flex flex-col items-center justify-center text-center px-20" style="background-color:#fcfaf6;">
    
    <!-- Video -->
    <div class="w-full max-w-[900px] overflow-hidden">
      <video autoplay muted loop class="w-full h-auto object-cover 
      [mask-image:radial-gradient(ellipse_at_center,black_75%,transparent_100%)]
           [-webkit-mask-image:radial-gradient(ellipse_at_center,black_75%,transparent_100%)]">
        <source src="/frames.mp4" type="video/mp4" />
      </video>
    </div>

    <!-- ONE BUTTON -->
    <div class="mb-10">
      <a 
        href="#about"
        class="flex items-center justify-center text-extra-
              w-[350px] h-[120px]
              bg-[url('/tape.png')] bg-contain bg-no-repeat bg-center
              text-white font-semibold text-3xl
              rotate-[-2deg] hover:rotate-0 hover:scale-105 transition"
      >
        ABOUT ME
      </a>
    </div>

</section>
</template>

<script>
export default {}
</script>

