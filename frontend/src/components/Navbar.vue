<template>
  <nav>
    <div class="nav-container">
      <div class="nav-links">
        <router-link to="/">{{ copy.home }}</router-link>
        <router-link to="/about">{{ copy.about }}</router-link>
        <router-link to="/projects">{{ copy.projects }}</router-link>
      </div>
      <div class="nav-actions">
        <LanguageToggle />
        <button class="theme-toggle" type="button" @click="handleToggleTheme">
          <span id="theme-icon">{{ themeIcon }}</span>
          <span id="theme-text">{{ themeText }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import LanguageToggle from './LanguageToggle.vue'
import { useLanguage } from '../composables/useLanguage'
import { useTheme } from '../composables/useTheme'

const { language } = useLanguage()
const { toggleTheme, getThemeIcon, getThemeText } = useTheme()

const themeIcon = ref('🌙')
const themeText = ref('Dark')

const translations = {
  zh: {
    home: '首页',
    about: '关于我',
    projects: '项目'
  },
  en: {
    home: 'Home',
    about: 'About',
    projects: 'Projects'
  }
}

const copy = computed(() => translations[language.value])

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

<style scoped>
.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

@media (max-width: 768px) {
  .nav-actions {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
