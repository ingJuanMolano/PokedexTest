<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header
    class="w-full bg-white shadow-sm px-5 py-5 flex items-center justify-between rounded-b-3xl md:px-8 md:bg-transparent md:shadow-none md:rounded-none"
  >
    <RouterLink to="/" class="flex items-center gap-3">
      <img src="@/images/Loader.png" alt="Pokeball" style="width: 45px" />

      <h1 class="text-3xl font-black tracking-tight hidden md:block">Pokédex</h1>
    </RouterLink>

    <nav class="flex items-center gap-3">
      <RouterLink
        to="/"
        class="px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition border border-gray-400"
      >
        Pokémon 🌏
      </RouterLink>

      <RouterLink
        to="/favoritos"
        class="px-5 py-2 rounded-full bg-red-50 text-red-500 font-semibold hover:bg-red-100 transition"
      >
        ❤️ Favoritos
      </RouterLink>
    </nav>
  </header>
</template>
