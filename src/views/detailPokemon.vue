<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPokemonByName } from '@/services/pokemonApi'
import { usePokemonStore } from '@/stores/pokemon'
import loaderImage from '@/images/Loader.png'
import Magikarp from '@/images/magikarp.png'

const route = useRoute()
const router = useRouter()
const pokemonStore = usePokemonStore()

const pokemon = ref(null)
const isLoading = ref(true)
const error = ref(false)
const copied = ref('')

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
  return pokemon.value?.types[0]?.type.name || 'normal'
})

const cardBackground = computed(() => {
  return backgroundStyles[mainType.value] || backgroundStyles.normal
})

const pokemonImage = computed(() => {
  if (!pokemon.value) return ''

  return (
    pokemon.value.sprites.other['official-artwork'].front_default ||
    pokemon.value.sprites.front_default
  )
})

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
async function copiarDatos(pokemon) {
  const stats = pokemon.stats
    .map((stat) => `${formatStat(stat.stat.name)[0]}: ${stat.base_stat}`)
    .join(', ')

  const texto = `${pokemon.name}, ${stats}`

  await navigator.clipboard.writeText(texto)
  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 4000)
}
function setFavorite() {
  pokemonStore.toggleFavorite(pokemon.value)
}

async function fetchPokemon() {
  try {
    isLoading.value = true
    error.value = false

    const name = route.params.name

    const response = await getPokemonByName(name)

    pokemon.value = response.data
  } catch (err) {
    console.error(err)

    error.value = true
  } finally {
    isLoading.value = false
  }
}

function goBack() {
  if (route.query.from === 'favoritos') {
    router.replace('/favoritos')
  } else {
    router.replace({
      path: '/',
      query: {
        offset: route.query.offset,
        limit: route.query.limit,
      },
    })
  }
}

onMounted(() => {
  fetchPokemon()
})
</script>

<template>
  <!-- LOADING -->

  <div class="flex flex-col items-center justify-center py-20" v-if="isLoading">
    <img :src="loaderImage" alt="Loading" class="w-40 object-contain animate-bounce" />

    <p class="text-gray-500 font-semibold text-xl m-0">Cargando Pokémon...</p>
  </div>

  <!-- ERROR -->

  <div v-else-if="error" class="flex flex-col items-center justify-center py-20 text-center">
    <img :src="Magikarp" class="w-40 object-contain drop-shadow-xl" />

    <h2 class="text-3xl font-black text-gray-800">Algo salió mal</h2>

    <p class="mt-3 text-gray-500 max-w-md">
      No pudimos cargar la información en este momento. Verifica tu conexión o intenta nuevamente
      más tarde...
    </p>

    <button
      class="mt-6 px-6 py-3 rounded-full bg-red-400 text-white font-bold hover:bg-red-500 transition"
      @click="fetchPokemons"
    >
      Reintentar
    </button>
  </div>

  <!-- CONTENIDO -->

  <div v-else class="min-h-screen p-8">
    <button
      @click="goBack"
      class="hidden md:block mb-6 px-5 fixed py-2 rounded-full bg-white shadow font-bold hover:bg-gray-100 transition cursor-pointer"
      style="z-index: 9999"
    >
      ← Volver
    </button>

    <!-- CARD PRINCIPAL -->

    <div
      class="relative overflow-hidden rounded-[40px] shadow-xl p-0 py-5 md:p-10 max-w-6xl mx-auto bg-gradient-to-br flex flex-col md:flex-row items-center justify-center md:justify-between gap-8"
      :class="cardBackground"
    >
      <!-- alerta copiado -->
      <span
        v-if="copied"
        class="absolute top-6 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-50 cursor-pointer"
        @click="copied = false"
      >
        <span class="bg-gray-800/90 text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg">
          ¡Copiado en portapapeles!
        </span>
      </span>
      <!-- decoración -->

      <div class="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/20" />

      <!-- INFORMACIÓN -->
      <div class="z-10">
        <span class="text-sm font-bold text-black/40">
          N°{{ pokemon.id.toString().padStart(3, '0') }}
        </span>

        <h1 class="text-6xl font-black capitalize mt-2">
          {{ pokemon.name }}
        </h1>

        <div class="flex gap-3 mt-5">
          <span
            v-for="type in pokemon.types"
            :key="type.type.name"
            class="px-5 py-2 rounded-full bg-white/80 font-bold capitalize"
          >
            {{ type.type.name }}
          </span>
        </div>

        <div class="flex gap-3 mt-8">
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
              {{
                pokemonStore.isFavorite(pokemon.name) ? 'Quitar de favoritos' : 'Añadir a favoritos'
              }}
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
        </div>
      </div>

      <!-- DATOS -->

      <div class="z-10 bg-white/40 backdrop-blur rounded-3xl p-6 w-64">
        <div class="mb-5">
          <p class="text-sm font-bold text-black/50">ALTURA</p>

          <p class="text-3xl font-black">{{ pokemon.height / 10 || 'N/A' }} m</p>
        </div>

        <div class="mb-5">
          <p class="text-sm font-bold text-black/50">PESO</p>

          <p class="text-3xl font-black">{{ pokemon.weight / 10 || 'N/A' }} kg</p>
        </div>

        <div>
          <p class="text-sm font-bold text-black/50">EXP BASE</p>

          <p class="text-3xl font-black">
            {{ pokemon.base_experience || 'N/A' }}
          </p>
        </div>
      </div>

      <!-- IMAGEN -->

      <img
        :src="pokemonImage"
        :alt="pokemon.name"
        class="w-96 z-10 drop-shadow-2xl transition hover-heartbeat"
      />
    </div>

    <!-- STATS -->

    <div class="max-w-6xl mx-auto mt-8 bg-white rounded-[35px] shadow-lg p-8">
      <h2 class="text-3xl font-black mb-6">Estadísticas base</h2>

      <div class="grid grid-cols-2 md:grid-cols-6 gap-5">
        <div
          v-for="stat in pokemon.stats"
          :key="stat.stat.name"
          class="rounded-3xl bg-gray-100 p-5 text-center"
        >
          <p class="font-black uppercase text-xl" :class="formatStat(stat.stat.name)[1]">
            {{ formatStat(stat.stat.name)[0] }}
          </p>

          <p class="text-4xl font-black mt-2">
            {{ stat.base_stat }}
          </p>
        </div>
      </div>
    </div>

    <!-- HABILIDADES -->

    <div class="max-w-6xl mx-auto mt-8 bg-white rounded-[35px] shadow-lg p-8">
      <h2 class="text-3xl font-black mb-5">Habilidades Principales</h2>

      <div class="flex gap-4">
        <span
          v-for="ability in pokemon.abilities"
          :key="ability.ability.name"
          class="px-5 py-3 rounded-full bg-gray-100 font-bold capitalize"
        >
          {{ ability.ability.name }}
        </span>
      </div>
    </div>
  </div>
</template>
