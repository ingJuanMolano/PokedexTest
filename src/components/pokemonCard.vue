<script setup>
import { ref, computed } from 'vue'
import { defineProps } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'

const pokemonStore = usePokemonStore()
const copied = ref('')

const props = defineProps({
  pokemon: {
    type: Object,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  isInFavorite: {
    type: Boolean,
    default: false,
  },
})

const backgroundStyles = {
  grass: 'from-green-300 to-green-100',
  fire: 'from-orange-400 to-orange-200',
  water: 'from-blue-400 to-blue-200',
  electric: 'from-yellow-300 to-yellow-100',
  poison: 'from-purple-400 to-purple-200',
  bug: 'from-lime-300 to-lime-100',
  flying: 'from-indigo-300 to-indigo-100',
  normal: 'from-gray-300 to-gray-100',
}

const mainType = computed(() => {
  return props.pokemon.types[0]?.type.name || 'normal'
})

const cardBackground = computed(() => {
  return backgroundStyles[mainType.value] || backgroundStyles.normal
})

const pokemonImage = computed(() => {
  return (
    props.pokemon.sprites.other['official-artwork'].front_default ||
    props.pokemon.sprites.front_default
  )
})
async function copiarDatos(pokemon) {
  const stats = pokemon.stats
    .map((stat) => `${formatStat(stat.stat.name)[0]}: ${stat.base_stat}`)
    .join(', ')

  const texto = `${pokemon.name}, ${stats}`

  await navigator.clipboard.writeText(texto)
  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 3000)
}
function setFavorite() {
  pokemonStore.toggleFavorite(props.pokemon)
}
function formatStat(stat) {
  const names = {
    hp: ['HP', 'text-red-500'],
    attack: ['ATK', 'text-yellow-500'],
    defense: ['DEF', 'text-blue-500'],
    'special-attack': ['SP.ATK', 'text-purple-500'],
    'special-defense': ['SP.DEF', 'text-pink-500'],
    speed: ['SPD', 'text-green-500'],
  }

  return names[stat] || ['???', 'text-gray-500']
}
</script>

<template>
  <div
    class="relative overflow-hidden rounded-[30px] p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-gradient-to-br w-full max-w-2xl flex flex-col md:flex-row items-center md:justify-between gap-8"
    :class="cardBackground"
  >
    <!-- FonDo circulito -->
    <div class="absolute -right-10 -bottom-10 w-52 h-52 rounded-full bg-white/20" />

    <!-- Datos generales -->
    <div>
      <span class="text-sm font-bold text-black/40">
        N°{{ pokemon.id.toString().padStart(3, '0') }}
      </span>

      <!-- setear a favorito -->

      <button
        class="ml-3 group shrink-0 relative cursor-pointer w-11 h-11 rounded-full backdrop-blur text-xl hover:scale-110 transition text-gray-400"
        @click="setFavorite"
        :class="pokemonStore.isFavorite(pokemon.name) ? 'bg-red-400 text-white' : 'bg-white/80'"
      >
        ♡

        <!-- Tooltip -->
        <span
          class="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-lg whitespace-nowrap"
        >
          {{ pokemonStore.isFavorite(pokemon.name) ? 'Quitar de favoritos' : 'Añadir a favoritos' }}
        </span>
      </button>

      <!-- compartir -->

      <button
        class="ml-3 group bg-gray-300/80 hover:bg-gray-400 shrink-0 relative cursor-pointer w-11 h-11 rounded-full backdrop-blur text-xl hover:scale-110 transition text-gray-600"
        @click="copiarDatos(pokemon)"
      >
        ⤴

        <!-- Tooltip -->
        <span
          class="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-lg whitespace-nowrap"
        >
          Compartir
        </span>
      </button>

      <!-- nombre -->
      <h2 class="text-3xl font-black capitalize z-10 pr-4">
        {{ pokemon.name }}
      </h2>

      <div class="flex gap-2 mt-3 relative z-10">
        <span
          v-for="type in pokemon.types"
          :key="type.type.name"
          class="px-4 py-1 rounded-full text-sm font-semibold capitalize bg-white/80 text-black/100 hover:scale-110 transition cursor-pointer"
        >
          {{ type.type.name }}
        </span>
      </div>
    </div>

    <!-- Stats -->

    <div class="grid grid-cols-3 gap-x-6 gap-y-3 mt-4">
      <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="text-center">
        <p class="text-xs font-bold text-black/40 uppercase" :class="formatStat(stat.stat.name)[1]">
          {{ formatStat(stat.stat.name)[0] }}
        </p>

        <p class="text-xl font-black">
          {{ stat.base_stat }}
        </p>
      </div>
    </div>

    <!-- imagen -->

    <img
      :src="pokemonImage"
      :alt="pokemon.name"
      class="w-40 object-contain drop-shadow-xl transition hover-heartbeat z-10"
    />

    <!-- alerta copiado -->
    <span
      v-if="copied"
      class="absolute top-6 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-50 pointer-events-none"
    >
      <span class="bg-gray-800/90 text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg">
        ¡Copiado en portapapeles!
      </span>
    </span>
  </div>
</template>
