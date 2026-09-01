<script setup>
import HeaderPrincipal from '@/components/headerPrincipal.vue'
import Footer from '@/components/footerComponent.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <HeaderPrincipal style="position: fixed; z-index: 9999;"/>
    <main style="padding-top: 100px;" class="flex-1 pt-[100px]">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
