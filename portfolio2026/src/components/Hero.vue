<script setup>
import { ref, watch } from "vue";

import heroVideo from "../assets/images/videovideo.webm";
import posterTameImpala from "../assets/images/tame impala.jpg";
import posterCreedence from "../assets/images/creedence.jpg";
import posterSaul from "../assets/images/saul.jpg";
import posterSade from "../assets/images/sade.jpg";
import posterBrutalismus from "../assets/images/brutalismus.jpg";

const props = defineProps({
  active: Boolean
});

// plagáty na stene – prilepené priesvitnou páskou cez horné rohy (ako na filmovom páse)
const posters = [
  { id: "sade", src: posterSade },
  { id: "tame", src: posterTameImpala },
  { id: "brutal", src: posterBrutalismus },
  { id: "saul", src: posterSaul },
  { id: "ccr", src: posterCreedence }
];

// video beží len keď je kamera pri úvode – inak sa zastaví, aby nehralo zbytočne v pozadí
const video = ref(null);
watch(
  () => props.active,
  (active) => {
    if (!video.value) return;
    if (active) video.value.play().catch(() => {});
    else video.value.pause();
  }
);
</script>

<template>
<!-- úvod: plagáty na stene nad posteľou, v strede malý filmový pás s mojimi fotkami -->
<section class="wall-gallery" :class="{ 'is-active': active }">
  <!-- nadpis len pre čítačky obrazovky a vyhľadávače -->
  <h1 class="sr-only">Andrea Hunčíková – web developer &amp; designer in Copenhagen</h1>

  <div
    v-for="poster in posters"
    :key="poster.id"
    class="poster"
    :class="`poster-${poster.id}`"
    aria-hidden="true"
  >
    <img :src="poster.src" alt="" class="poster-img" />
    <span class="corner-tape corner-tl"></span>
    <span class="corner-tape corner-tr"></span>
  </div>

  <!-- filmový pás s mojimi fotkami presne v strede – na neho sa kamera pozerá hneď na začiatku -->
  <div class="gallery-film" data-focus>
    <video ref="video" autoplay muted loop playsinline preload="auto" class="hero-filmstrip w-full h-full">
      <source :src="heroVideo" type="video/webm" />
    </video>
  </div>
</section>
</template>

<style scoped>
/* rozmery v px sveta izby (≈ 1 px = 0,6 mm): plagáty A3/A2, filmový pás ako vytlačená fotka */
.wall-gallery {
  --center: 1300px;
  position: relative;
  width: 2600px;
  height: 1700px;
}

.poster {
  position: absolute;
  box-shadow: 8px 14px 22px rgba(40, 30, 20, 0.16);
}

/* plagáty – papier s jemným leskom */
.poster-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster::after {
  position: absolute;
  inset: 0;
  content: "";
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0) 40%, rgba(0, 0, 0, 0.06));
  pointer-events: none;
}

/* priesvitná matná páska šikmo cez horné rohy plagátu – plagát cez ňu presvitá */
.corner-tape {
  position: absolute;
  z-index: 2;
  width: 130px;
  height: 40px;
  background:
    var(--paper-grain),
    linear-gradient(175deg, rgba(250, 250, 248, 0.62), rgba(228, 228, 222, 0.55) 55%, rgba(206, 206, 200, 0.62));
  box-shadow: 0 1px 2px rgba(40, 30, 20, 0.12);
  clip-path: polygon(3% 0, 97% 4%, 100% 30%, 96% 55%, 100% 80%, 97% 100%, 2% 96%, 0 70%, 4% 45%, 0 20%);
}

.corner-tl { top: -6px; left: -34px; transform: rotate(-42deg); }
.corner-tr { top: -6px; right: -34px; transform: rotate(42deg); }

/* Sade a Brutalismus po bokoch filmového pásu, Tame Impala nad ním – stredy 700 px od seba */
.poster-sade {
  top: 470px;
  left: calc(var(--center) - 700px - 220px);
  width: 440px;
  height: 550px;
  transform: rotate(-2deg);
}

.poster-tame {
  top: 300px;
  left: calc(var(--center) - 320px);
  width: 640px;
  height: 360px;
  transform: rotate(-0.5deg);
}

.poster-brutal {
  top: 360px;
  left: calc(var(--center) + 700px - 220px);
  width: 440px;
  height: 620px;
  transform: rotate(2deg);
}

/* dolný rad: Saul a Creedence pod pásom */
.poster-saul {
  top: 1120px;
  left: calc(var(--center) - 330px - 170px);
  width: 340px;
  height: 440px;
  transform: rotate(1.5deg);
}

/* Saul orezaný zhora aj zdola – nápis "It's all GOOD man" ostáva celý */
.poster-saul .poster-img {
  object-position: 50% 30%;
}

/* Creedence na šírku – výrez s nápisom a kapelou */
.poster-ccr {
  top: 1080px;
  left: calc(var(--center) + 330px - 250px);
  width: 560px;
  height: 480px;
  transform: rotate(-1.5deg);
}

/* výrez od vrchu: celý nápis a tváre kapely */
.poster-ccr .poster-img {
  object-position: 50% 0;
}

/* malý filmový pás presne v strede */
.gallery-film {
  position: absolute;
  top: 693px;
  left: calc(var(--center) - 280px);
  z-index: 3;
  width: 560px;
  /* pevný pomer ako video (1280 × 720), aby kamera poznala stred ešte pred načítaním */
  aspect-ratio: 16 / 9;
  transform: rotate(-1deg);
  filter: drop-shadow(0 10px 14px rgba(40, 30, 20, 0.25));
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
