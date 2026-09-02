<script setup>
import { ref, onMounted, watch } from 'vue'
import { getPokemons, getPokemonByName } from '@/services/pokemonApi'
import PokemonCard from '@/components/pokemonCard.vue'
import loaderImage from '@/images/Loader.png'
import Magikarp from '@/images/magikarp.png'
import { nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const pokemons = ref([])
const page = ref(1)
const totalPokemones = ref(0)
const offsetNext = ref(0)
const offsetBefore = ref(0)
const isLoading = ref(false)
const urlNext = ref()
const urlPrev = ref()
const limit = ref(5)
const errorFetch = ref('')
const totalPages = ref(0)
const currentOffset = ref(0)

onMounted(async () => {
  if (route.query.offset && route.query.limit) {
    limit.value = Number(route.query.limit)
    offsetNext.value = Number(route.query.offset)
    offsetBefore.value = Number(route.query.offset)
  }
  await fetchPokemons()
})
watch(page, (newValue, oldValue) => {
  newValue < 1 ? (page.value = 1) : null
  if (newValue == oldValue) {
    return
  } else if (newValue > oldValue) {
    fetchPokemons('next')
  } else if (newValue < oldValue) {
    fetchPokemons('prev')
  }
})

watch(limit, (newValue, oldValue) => {
  if (newValue == oldValue) return
  offsetNext.value = 0
  offsetBefore.value = 0
  page.value = 1
  fetchPokemons()
})

function waitForImages() {
  const images = document.querySelectorAll('img')

  return Promise.all(
    [...images].map((img) => {
      if (img.complete) return Promise.resolve()

      return new Promise((resolve) => {
        img.onload = resolve
        img.onerror = resolve
      })
    }),
  )
}

async function fetchPokemons(dir) {
  try {
    isLoading.value = true
    errorFetch.value = false

    const response = await getPokemons(
      dir == 'next' ? offsetNext.value : offsetBefore.value,
      limit.value,
    )
    currentOffset.value = dir == 'next' ? offsetNext.value : offsetBefore.value
    router.replace({
      query: {
        offset: currentOffset.value,
        limit: limit.value,
      },
    })
    const pokemonList = response.data.results

    totalPokemones.value = response.data.count

    pokemons.value = await Promise.all(
      pokemonList.map(async (pokemon) => {
        const detail = await getPokemonByName(pokemon.name)

        return detail.data
      }),
    )

    urlNext.value = response.data.next
    urlPrev.value = response.data.previous

    if (urlNext.value) {
      const paramsNext = new URLSearchParams(urlNext.value.split('?')[1])

      offsetNext.value = Number(paramsNext.get('offset'))
    } else {
      offsetNext.value = ''
    }

    if (urlPrev.value) {
      let paramsBefore = ''
      paramsBefore = new URLSearchParams(urlPrev.value.split('?')[1])

      offsetBefore.value = Number(paramsBefore.get('offset'))
    } else {
      offsetBefore.value = ''
    }
    getTotalPages()
  } catch (error) {
    console.error(error)
    errorFetch.value = true
  } finally {
    await waitForImages()
    await nextTick()
    isLoading.value = false
  }
}
function goLastPage() {
  const lastPage = Math.ceil(totalPokemones.value / limit.value)

  page.value = lastPage

  offsetNext.value = (lastPage - 1) * limit.value
  offsetBefore.value = offsetNext.value

  fetchPokemons()
}
function getTotalPages() {
  totalPages.value = Math.ceil(totalPokemones.value / limit.value)
}
</script>

<template>
  <div v-if="!isLoading && !errorFetch">
    <div class="p-6 text-center">
      <span class="text-md font-bold text-red-400 uppercase"> Pokédex </span>

      <h1 class="text-5xl font-black mt-2">Explora nuevos Pokémon</h1>

      <p class="text-gray-500 mt-3 text-lg">
        Descubre sus tipos, características y encuentra tus favoritos.
      </p>
      <p class="text-red-400 mt-3 text-md">
        (¡Pincha la imagen de cualquier pokémon para ver mas detalles!)
      </p>
    </div>
    <div class="flex justify-center items-center p-6" v-for="pokemon in pokemons" :key="pokemon.id">
      <PokemonCard :pokemon="pokemon" :limit="limit" :offset="currentOffset" :from="'pokemon'" />
    </div>
    <div class="flex flex-col md:flex-row items-center justify-center gap-2 pb-6">
      <div class="flex justify-center items-center">
        <p class="m-0 pr-1">Estás viendo</p>
        <select
          class="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 outline-none cursor-pointer hover:border-red-300 transition"
          v-model="limit"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
        <p class="m-0 pl-1">de {{ totalPokemones }} pokémon</p>
      </div>
      <div>
        <button
          class="px-4 py-2 mr-3 rounded-full bg-gray-100 border border-gray-400"
          @click="page--"
          :disabled="page <= 1"
          :class="{
            'cursor-pointer': page > 1,
            'hover:bg-red-100': page > 1,
            'hover:bg-gray-100': page > 1,
          }"
        >
          ‹
        </button>

        <button
          class="w-10 h-10 rounded-full"
          :class="{
            'cursor-pointer': page > 1,
            'hover:bg-red-100': page > 1,
            'hover:bg-gray-100': page > 1,
          }"
          @click="
            () => {
              offsetNext = 0
              offsetBefore = 0
              page = 1
              fetchPokemons()
            }
          "
          :disabled="page === 1"
        >
          {{ page > 1 ? '1' : '0' }}
        </button>

        <span> ... </span>

        <button class="w-10 h-10 rounded-full bg-red-500 text-white font-bold">
          {{ page }}
        </button>

        <span v-if="page < totalPages"> ... </span>

        <button
          class="w-10 h-10 rounded-full hover:bg-gray-100 hover:bg-red-100 cursor-pointer"
          @click="goLastPage"
          v-if="page < totalPages"
        >
          {{ totalPages }}
        </button>

        <button
          class="px-4 py-2 ml-3 rounded-full bg-gray-100 border border-gray-400"
          :class="{
            'cursor-pointer': page < Math.trunc(totalPokemones / limit),
            'hover:bg-red-100': page < Math.trunc(totalPokemones / limit),
            'hover:bg-gray-100': page < Math.trunc(totalPokemones / limit),
          }"
          @click="page++"
          :disabled="page >= Math.trunc(totalPokemones / limit)"
        >
          ›
        </button>
      </div>
    </div>
  </div>
  <div class="flex flex-col items-center justify-center py-20" v-else-if="isLoading">
    <img :src="loaderImage" alt="Loading" class="w-40 object-contain animate-bounce" />

    <p class="text-gray-500 font-semibold text-xl m-0">Cargando personajes...</p>
  </div>
  <div v-if="errorFetch" class="flex flex-col items-center justify-center py-20 text-center">
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
</template>

<style scoped></style>
