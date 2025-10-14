<template>
  <el-config-provider :locale="locale">
    <div class="app-container">
      <header class="app-header">
        <nav>
          <router-link to="/">{{ $t('nav.home') }}</router-link>
          <router-link to="/articles">{{ $t('nav.articles') }}</router-link>
          <router-link to="/about">{{ $t('nav.about') }}</router-link>
        </nav>
        <el-select v-model="currentLang" class="lang-select" @change="changeLang">
          <el-option label="简体中文" value="zh-CN" />
          <el-option label="English" value="en-US" />
          <el-option label="日本語" value="ja-JP" />
          <el-option label="한국어" value="ko-KR" />
        </el-select>
      </header>
      <main class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <footer class="app-footer">
        <p>© {{ new Date().getFullYear() }} Kaka. {{ $t('footer.allRightsReserved') }}</p>
      </footer>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElConfigProvider } from 'element-plus'
import zhCn from '@/locales/zh-CN'
import en from '@/locales/en-US'
import ja from '@/locales/ja-JP'
import ko from '@/locales/ko-KR'

const { locale } = useI18n()
const currentLang = ref(locale.value)
const elementLocales = {
  'zh-CN': zhCn,
  'en-US': en,
  'ja-JP': ja,
  'ko-KR': ko
}

const changeLang = (value: string) => {
  locale.value = value
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  padding: 1rem;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header nav {
  display: flex;
  gap: 1rem;
}

.app-header a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

.app-header a:hover {
  color: #409EFF;
}

.lang-select {
  width: 120px;
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  padding: 1rem;
  background: #f5f5f5;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>