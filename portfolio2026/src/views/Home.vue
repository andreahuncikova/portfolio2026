<script setup>
import { ref, onMounted } from "vue";
import Hero from "../components/Hero.vue"
import About from "../components/About.vue"
import Skills from "../components/Skills.vue"
import Projects from "../components/Projects.vue"
import Multimedia from "../components/Multimedia.vue"
import Contact from "../components/Contact.vue"

const sections = [
  { id: "hero", component: Hero },
  { id: "about", component: About },
  { id: "skills", component: Skills },
  { id: "projects", component: Projects },
  { id: "multimedia", component: Multimedia },
  { id: "contact", component: Contact },
];

const activeSection = ref(sections[0].id);

const handleScroll = () => {
  for (const sec of sections) {
    const el = document.getElementById(sec.id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    const middle = window.innerHeight / 2;

    if (rect.top < middle && rect.bottom > middle) {
      activeSection.value = sec.id;
      break;
    }
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
</script>

<template>
  <div class="relative">
    <section
      v-for="sec in sections"
      :key="sec.id"
      :id="sec.id"
      class="w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        class="transition-all duration-700 ease-in-out"
        :class="{
          'opacity-100 translate-y-0': activeSection === sec.id,
          'opacity-0 translate-y-12': activeSection !== sec.id
        }"
      >
        <component :is="sec.component" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.opacity-0 {
  opacity: 0;
}
.opacity-100 {
  opacity: 1;
}
.translate-y-0 {
  transform: translateY(0);
}
.translate-y-12 {
  transform: translateY(3rem);
}
</style>