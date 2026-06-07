<template>
  <div ref="rootRef" class="language-menu">
    <button
      class="language-trigger"
      type="button"
      :aria-expanded="isOpen"
      :aria-label="copy.label"
      @click="isOpen = !isOpen"
    >
      <span>{{ language === 'zh' ? '中文' : 'English' }}</span>
      <span class="chevron">⌄</span>
    </button>

    <div v-if="isOpen" class="language-options" role="menu">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="language-option"
        :class="{ active: language === option.value }"
        role="menuitem"
        @click="selectLanguage(option.value)"
      >
        <span class="checkmark">{{ language === option.value ? '✓' : '' }}</span>
        <strong>{{ option.label }}</strong>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { language, setLanguage } = useLanguage()
const rootRef = ref(null)
const isOpen = ref(false)

const options = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' }
]

const copy = computed(() => ({
  label: language.value === 'zh' ? '选择语言' : 'Select language'
}))

function selectLanguage(value) {
  setLanguage(value)
  isOpen.value = false
}

function handleDocumentClick(event) {
  if (!rootRef.value?.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style scoped>
.language-menu {
  position: relative;
}

.language-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  color: #f7f8f8;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  box-shadow: none;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
}

.language-trigger:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
  box-shadow: none;
}

.language-trigger:active {
  transform: scale(0.98);
}

.chevron {
  color: #8a8f98;
  font-size: 13px;
  line-height: 1;
}

.language-options {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 1200;
  display: grid;
  min-width: 136px;
  padding: 5px;
  background: #0f1011;
  border: 1px solid #23252a;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.34) 0 14px 32px -12px;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  color: #d0d6e0;
  background: transparent;
  border: 0;
  border-radius: 6px;
  box-shadow: none;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
}

.language-option:hover,
.language-option.active {
  color: #f7f8f8;
  background: #18191a;
  transform: none;
  box-shadow: none;
}

.checkmark {
  width: 14px;
  color: #5e6ad2;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
}

.language-option strong {
  font-size: 14px;
  font-weight: 500;
}
</style>
