<script setup>
import PokemonCard from '@/components/pokemonCard.vue'
import { usePokemonStore } from '@/stores/pokemon'
import { storeToRefs } from 'pinia'
import captura from '@/images/captura.png'

const pokemonStore = usePokemonStore()

const { favorites } = storeToRefs(pokemonStore)
</script>

<template>
  <div class="p-6 text-center" v-if="favorites.length > 0">
    <span class="text-md font-bold text-red-400 uppercase"> Favoritos ❤️</span>

    <h1 class="text-5xl font-black mt-2">Explora tus Pokémon favoritos</h1>
    <p class="text-red-700 mt-3 text-md">
        (¡Pincha la imagen de cualquier pokémon para ver mas detalles!)
      </p>
  </div>
  <div class="flex justify-center items-center p-6" v-for="pokemon in favorites" :key="pokemon.id">
    <PokemonCard :pokemon="pokemon" :isInFavorite="true" :from="'favoritos'"/>
  </div>
  <div
    v-if="favorites.length === 0"
    class="flex flex-col items-center justify-center py-20 text-center"
  >
    <img
      :src="captura"
      class="w-40 object-contain drop-shadow-xl z-10"
    />

    <h2 class="text-3xl font-black text-gray-800">No tienes favoritos todavía</h2>

    <p class="mt-3 text-gray-500 max-w-md">
      Explora la Pokédex y <strong>captura</strong> los personajes que más te gusten para encontrarlos aquí
      fácilmente.
    </p>

    <RouterLink
      to="/"
      class="mt-6 px-6 py-3 rounded-full bg-red-400 text-white font-bold hover:bg-red-500 transition"
    >
      Explorar personajes
    </RouterLink>
  </div>
</template>

<style scoped></style>
