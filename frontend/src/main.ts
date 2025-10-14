import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from '@/App.vue'
import router from '@/router'
import zhCn from '@/locales/zh-CN'
import enUs from '@/locales/en-US'
import jaJp from '@/locales/ja-JP'
import koKr from '@/locales/ko-KR'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCn,
    'en-US': enUs,
    'ja-JP': jaJp,
    'ko-KR': koKr
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(ElementPlus)

app.mount('#app')