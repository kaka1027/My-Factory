<template>
  <nav>
    <div class="nav-container">
      <div class="nav-links">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
      </div>
      <button class="theme-toggle" @click="handleToggleTheme">
        <span id="theme-icon">{{ themeIcon }}</span>
        <span id="theme-text">{{ themeText }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from '../composables/useTheme'

const { toggleTheme, getThemeIcon, getThemeText } = useTheme()

const themeIcon = ref('🌙')
const themeText = ref('Dark')

function handleToggleTheme() {
  toggleTheme()
  themeIcon.value = getThemeIcon()
  themeText.value = getThemeText()
}

onMounted(() => {
  themeIcon.value = getThemeIcon()
  themeText.value = getThemeText()
})
</script>
