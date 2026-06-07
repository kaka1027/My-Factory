<template>
  <div class="container">
    <div class="intro-section">
      <div class="intro-text">
        <h1>{{ copy.title }}</h1>
        <p><strong>{{ copy.nameLabel }}</strong> KAKA</p>
        <p><strong>{{ copy.studyLabel }}</strong> SCNU & ABDN</p>
        <p>{{ copy.shortIntro }}</p>
        <p>{{ copy.longIntro }}</p>
      </div>
      <div class="intro-image">
        <img src="/images/bear1.png" :alt="copy.profileAlt">
      </div>
    </div>

    <div class="gallery-section">
      <h2>{{ copy.interestsTitle }}</h2>
      <div class="image-gallery">
        <router-link to="/about#gaming" class="gallery-item">
          <div class="dual-image">
            <img src="/images/val7.png" alt="Valorant 1">
            <img src="/images/val8.png" alt="Valorant 2">
          </div>
          <p>{{ copy.gaming }}</p>
        </router-link>
        <router-link to="/about#work" class="gallery-item">
          <img src="/images/cafe.png" :alt="copy.coffee">
          <p>{{ copy.coffee }}</p>
        </router-link>
        <router-link to="/about#music" class="gallery-item">
          <img src="/images/kpop4.png" :alt="copy.music">
          <p>{{ copy.music }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { language } = useLanguage()

const translations = {
  zh: {
    title: '我的介绍',
    nameLabel: '姓名：',
    studyLabel: '学习经历：',
    shortIntro: '这是我的个人网站。',
    longIntro: '欢迎来到我的个人网站！我喜欢网页开发，也喜欢创造有互动感的体验。这个项目展示了我使用现代 Web 技术构建个人内容和实时互动应用的能力。',
    profileAlt: '个人头像',
    interestsTitle: '我的兴趣',
    gaming: '游戏',
    coffee: '咖啡文化',
    music: '音乐'
  },
  en: {
    title: 'My Introduction',
    nameLabel: 'Name:',
    studyLabel: 'Study:',
    shortIntro: 'This is my website.',
    longIntro: "Welcome to my personal website. I am passionate about web development and interactive experiences. This project showcases my skills in building personal content and real-time interactive applications with modern web technologies.",
    profileAlt: 'Profile',
    interestsTitle: 'My Interests',
    gaming: 'Gaming',
    coffee: 'Coffee Culture',
    music: 'Music'
  }
}

const copy = computed(() => translations[language.value])
</script>
