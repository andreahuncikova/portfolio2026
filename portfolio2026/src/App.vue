<template>
  <div class="bg-[#f7f3ee] text-black min-h-screen">
    <div class="cursor"></div>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      cursor: null
    };
  },

  mounted() {
    this.cursor = document.querySelector(".cursor");

    window.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseover", this.handleMouseOver);
  },

  beforeUnmount() {
    window.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseover", this.handleMouseOver);
  },

  methods: {
    handleMouseMove(e) {
      if (!this.cursor) return;
      this.cursor.style.left = `${e.clientX}px`;
      this.cursor.style.top = `${e.clientY}px`;
    },

    handleMouseOver(e) {
      if (!this.cursor || !(e.target instanceof Element)) return;
      const element = e.target.closest("a, button, .project-card, [class*='cursor-pointer']");
      this.cursor.classList.toggle("hover", Boolean(element));
    }
  }
};
</script>