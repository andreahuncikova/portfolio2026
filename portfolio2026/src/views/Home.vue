<script setup>
import { ref, onMounted } from "vue";

import Navbar from "../components/Navbar.vue";
import Hero from "../components/Hero.vue";
import About from "../components/About.vue";
import Skills from "../components/Skills.vue";
import Projects from "../components/Projects.vue";
import Multimedia from "../components/Multimedia.vue";
import Contact from "../components/Contact.vue";

const currentSlide = ref(0); // 0 = hero, 1 = about
const isHorizontal = ref(true);
const showNavbar = ref(false);
const isAnimating = ref(false);
const navbarTimeout = ref(null);

// scroll medzi hero → about
const handleWheel = (e) => {
  if (isAnimating.value) return;

  if (isHorizontal.value) {
    if (e.deltaY > 0) {
      isAnimating.value = true;

      // delay navbar
      if (navbarTimeout.value) clearTimeout(navbarTimeout.value);
      navbarTimeout.value = setTimeout(() => {
        showNavbar.value = true;
      }, 300);

      currentSlide.value = 1;
      isHorizontal.value = false;

      setTimeout(() => {
        isAnimating.value = false;
      }, 700); // duration-700 match
    }
  } else {
    if (window.scrollY === 0 && e.deltaY < 0) {
      isAnimating.value = true;

      currentSlide.value = 0;
      isHorizontal.value = true;

      if (navbarTimeout.value) clearTimeout(navbarTimeout.value);
      navbarTimeout.value = setTimeout(() => {
        showNavbar.value = false;
      }, 300);

      setTimeout(() => {
        isAnimating.value = false;
      }, 700);
    }
  }
};

// klik z buttonu na Hero
const goToAbout = () => {
  if (isAnimating.value) return;
  isAnimating.value = true;

  if (navbarTimeout.value) clearTimeout(navbarTimeout.value);
  navbarTimeout.value = setTimeout(() => {
    showNavbar.value = true;
  }, 300);

  currentSlide.value = 1;
  isHorizontal.value = false;

  setTimeout(() => {
    isAnimating.value = false;
  }, 700);
};

onMounted(() => {
  window.addEventListener("wheel", handleWheel);
});
</script>

<template>
  <div class="relative overflow-x-hidden">

  <div class="fixed top-1/2 left-0 w-full z-50 flex justify-center -translate-y-1/2">
  <div class="w-full max-w-6xl px-6">
    <Navbar
      v-show="showNavbar"
      class="w-full transition-all duration-500 h-16 flex items-center"
      :class="showNavbar
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 -translate-y-10'"
    />
  </div>
</div>

    <!-- 🔥 HERO + ABOUT (HORIZONTAL) -->
    <div
      class="flex w-[200vw] h-screen transition-transform duration-700 ease-in-out"
      :style="{ transform: `translateX(-${currentSlide * 100}vw)` }"
    >
      <!-- HERO -->
      <section class="w-screen h-screen flex items-center justify-center">
        <Hero 
          :active="currentSlide === 0"
          @goAbout="goToAbout"
        />
      </section>

      <!-- ABOUT -->
      <section class="w-screen h-screen flex items-center justify-center">
        <About :active="currentSlide === 1" />
      </section>
    </div>


    <!-- 🔽 NORMAL SCROLL -->
    <section class="min-h-screen flex items-center justify-center">
      <Skills />
    </section>

    <section class="min-h-screen flex items-center justify-center">
      <Projects />
    </section>

    <section class="min-h-screen flex items-center justify-center">
      <Multimedia />
    </section>

    <section class="min-h-screen flex items-center justify-center">
      <Contact />
    </section>

  </div>
</template>