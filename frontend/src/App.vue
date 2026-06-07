<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import { onMounted } from 'vue'
import { useLanguage } from './composables/useLanguage'
import { useTheme } from './composables/useTheme'

const { applyTheme } = useTheme()
const { language, setLanguage } = useLanguage()

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'system'
  applyTheme(savedTheme)
  setLanguage(language.value)
})
</script>

<style>
@import '/css/style.css';
</style>
