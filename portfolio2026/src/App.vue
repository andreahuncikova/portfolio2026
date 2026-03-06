<script setup>
import Navbar from "./components/Navbar.vue"
</script>

<template>
  <div class="bg-slate-950 text-white min-h-screen">
    <Navbar />
    <router-view />
  </div>
</template>