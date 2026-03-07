<template>
  <nav
    v-if="showNav"
    class="fixed left-10 top-1/2 -translate-y-1/2 z-50"
  >
    <ul class="relative space-y-8">

      <!-- vertical line -->
      <div class="absolute left-2 top-0 h-full w-[2px] bg-neutral-300"></div>

      <li v-for="section in sections" :key="section.id" class="relative flex items-center gap-4">

        <!-- dot -->
        <div
          class="w-4 h-4 rounded-full border-2 transition-all"
          :class="activeSection === section.id
              ? 'bg-[#f3a0ad] border-[#f3a0ad] scale-125'
            : 'bg-white border-neutral-400'"
        ></div>

        <!-- label -->
        <a
          :href="'#' + section.id"
          class="text-sm transition"
          :class="activeSection === section.id
            ? 'text-[#f3a0ad] font-semibold'
            : 'text-neutral-500 hover:text-black'"
        >
          {{ section.label }}
        </a>

      </li>

    </ul>
  </nav>
</template>


<script>
export default {
  data() {
    return {
      activeSection: "",
      showNav: false,

      sections: [
        { id: "about", label: "About" },
        { id: "skills", label: "Skills" },
        { id: "projects", label: "Projects" },
        { id: "multimedia", label: "Design" },
        { id: "contact", label: "Contact" }
      ]
    };
  },

  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  methods: {
    handleScroll() {

      // show nav when reaching ABOUT section
      const about = document.getElementById("about");

      if (about) {
        const aboutTop = about.offsetTop;
        this.showNav = window.scrollY >= aboutTop - 200;
      }

      // detect active section
      for (const section of this.sections) {
        const el = document.getElementById(section.id);

        if (el) {
          const top = el.offsetTop - 200;
          const bottom = top + el.offsetHeight;

          if (window.scrollY >= top && window.scrollY < bottom) {
            this.activeSection = section.id;
          }
        }
      }
    }
  }
};
</script>