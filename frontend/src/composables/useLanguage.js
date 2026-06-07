import { computed, ref } from 'vue'

const STORAGE_KEY = 'language'
const savedLanguage = localStorage.getItem(STORAGE_KEY)

function getSystemLanguage() {
  const systemLanguage = navigator.language || navigator.languages?.[0] || ''
  return systemLanguage.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

const language = ref(savedLanguage === 'en' || savedLanguage === 'zh' ? savedLanguage : getSystemLanguage())

function applyLanguage(nextLanguage) {
  language.value = nextLanguage
  localStorage.setItem(STORAGE_KEY, nextLanguage)
  document.documentElement.lang = nextLanguage === 'zh' ? 'zh-CN' : 'en'
}

export function useLanguage() {
  const isZh = computed(() => language.value === 'zh')

  function toggleLanguage() {
    applyLanguage(language.value === 'zh' ? 'en' : 'zh')
  }

  function setLanguage(nextLanguage) {
    if (nextLanguage !== 'zh' && nextLanguage !== 'en') return
    applyLanguage(nextLanguage)
  }

  return {
    language,
    isZh,
    toggleLanguage,
    setLanguage
  }
}
