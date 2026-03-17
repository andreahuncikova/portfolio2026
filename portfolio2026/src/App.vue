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

  window.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  const hoverElements = document.querySelectorAll("a, button");

  hoverElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("hover");
    });

    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("hover");
    });
  });
  } }
</script>