import axios from 'axios'

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2'
})

export const getPokemons = (offset, limit) => {
  return api.get('/pokemon', {
    params: {
      offset,
      limit
    }
  })
}

export const getPokemonByName = (name) => {
  return api.get(`/pokemon/${name}`)
}