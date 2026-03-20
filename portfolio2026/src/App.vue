<script setup>
import Navbar from "./components/Navbar.vue"
</script>

<template>
  <div class="bg-[#fcfaf6] text-black min-h-screen">
    <div class="cursor"></div>
    <Navbar />
    <router-view />
  </div>
</template>



<script>
export default {
  mounted() {
    const cursor = document.querySelector(".cursor");

    // Sleduj pohyb myši
    window.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    });

    // Dynamické hover over elementy
    document.addEventListener("mouseover", (e) => {
      const el = e.target;
      if (
        el.matches("a, button, .project-card") // pridaj všetky interaktívne triedy
      ) {
        cursor.classList.add("hover");
      }
    });

    document.addEventListener("mouseout", (e) => {
      const el = e.target;
      if (
        el.matches("a, button, .project-card")
      ) {
        cursor.classList.remove("hover");
      }
    });
  }
};
</script>