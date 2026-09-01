import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'pokedex',
      component: () => import('@/views/principalMain.vue')
    },

    {
      path: '/favoritos',
      name: 'favoritos',
      component: () => import('@/views/favoritesList.vue')
    },
  ],
})

export default router
