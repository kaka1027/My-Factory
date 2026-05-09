<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import { onMounted } from 'vue'
import { useTheme } from './composables/useTheme'

const { applyTheme } = useTheme()

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'system'
  applyTheme(savedTheme)
})
</script>

<style>
@import '/css/style.css';
</style>
