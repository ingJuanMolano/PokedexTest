import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePokemonStore = defineStore('pokemon', () => {
  const favorites = ref(JSON.parse(localStorage.getItem('favorites')) || [])

  const addFavorite = (pokemon) => {
    if (isFavorite(pokemon.name)) return
    favorites.value.push(pokemon)

    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  const removeFavorite = (pokemonName) => {
    favorites.value = favorites.value.filter((pokemon) => pokemon.name !== pokemonName)

    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  const isFavorite = (pokemonName) => {
    return favorites.value.some((pokemon) => pokemon.name === pokemonName)
  }

  const toggleFavorite = (pokemon) => {
    if (isFavorite(pokemon.name)) {
      removeFavorite(pokemon.name)
    } else {
      addFavorite(pokemon)
    }
    console.log(favorites.value)
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  }
})
