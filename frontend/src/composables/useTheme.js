import { ref } from 'vue'

export function useTheme() {
  const currentTheme = ref(localStorage.getItem('theme') || 'system')

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  function applyTheme(theme) {
    let actualTheme = theme
    if (theme === 'system') {
      actualTheme = getSystemTheme()
    }
    document.documentElement.setAttribute('data-theme', actualTheme)
    currentTheme.value = theme
  }

  function toggleTheme() {
    let newTheme
    if (currentTheme.value === 'light') {
      newTheme = 'dark'
    } else if (currentTheme.value === 'dark') {
      newTheme = 'system'
    } else {
      newTheme = 'light'
    }

    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
    return newTheme
  }

  function getThemeIcon() {
    const theme = currentTheme.value === 'system' ? getSystemTheme() : currentTheme.value
    return theme === 'dark' ? '☀️' : '🌙'
  }

  function getThemeText() {
    if (currentTheme.value === 'system') return 'System'
    return currentTheme.value === 'dark' ? 'Light' : 'Dark'
  }

  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentTheme.value === 'system') {
      applyTheme('system')
    }
  })

  return {
    currentTheme,
    applyTheme,
    toggleTheme,
    getThemeIcon,
    getThemeText
  }
}
