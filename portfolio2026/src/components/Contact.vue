<template>
  <section
    id="contact"
    class="py-24 px-6 flex flex-col md:flex-row items-center justify-center gap-12 opacity-0 animate-fadeIn"
  >
    <!-- Left: Contact Info -->
    <div class="flex-1 max-w-md text-left">
      <h2 class="text-4xl font-bold mb-6 text-black">Get in Touch</h2>
      <p class="text-neutral-700 mb-6">
        Interested in collaborating or just want to say hi? Send me a message and I will get back to you as soon as possible!
      </p>

      <div class="flex flex-col gap-4">
        <a
          href="mailto:a.huncikova@gmail.com"
          class="relative inline-block px-6 py-3 font-semibold text-black bg-[#f3a0ad] rounded-lg overflow-hidden group"
        >
          <span class="absolute inset-0 w-full h-full bg-pink-400 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></span>
          <span class="relative z-10">Send Email</span>
        </a>

        <a
          href="https://www.linkedin.com/in/andreahuncikova"
          target="_blank"
          class="text-black hover:text-[#f3a0ad] transition-colors"
        >
          LinkedIn → 
        </a>

        <a
          href="https://github.com/andreahuncikova"
          target="_blank"
          class="text-black hover:text-[#f3a0ad] transition-colors"
        >
          GitHub →
        </a>
      </div>
    </div>

    <!-- Right: Graphic / Illustration -->
    <div class="flex-1 max-w-md flex justify-center md:justify-end">
      <div class="w-64 h-64 bg-[#f3a0ad] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl animate-bounce">
        Hello!
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Optional: hover animation for button sliding gradient */
a.group span:first-child {
  background: linear-gradient(120deg, #f3a0ad, #fcfaf6);
}
</style>