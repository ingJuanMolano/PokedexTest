<script setup>
import HeaderPrincipal from '@/components/headerPrincipal.vue'
import Footer from '@/components/footerComponent.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const backgroundClass = computed(() => {
  if (route.path === '/favoritos') {
    return 'favoritos-bg'
  }

  if (route.path.startsWith('/pokemon')) {
    return 'detalle-bg'
  }

  return 'pokemon-bg'
})
</script>

<template>
  <div class="min-h-screen flex flex-col" :class="backgroundClass">
    <HeaderPrincipal style="position: fixed; z-index: 9999" />
    <main style="padding-top: 100px" class="flex-1 pt-[100px]">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
