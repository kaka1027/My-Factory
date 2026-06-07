<template>
  <div class="container">
    <h1>{{ copy.title }}</h1>

    <div class="about-section">
      <div class="about-content" id="gaming">
        <h2>{{ copy.entertainmentTitle }}</h2>
        <p><strong>{{ copy.gamingLabel }}</strong> {{ copy.gamingValue }}</p>
        <p>{{ copy.gamingDescription }}</p>

        <div class="image-row">
          <VideoPlayer src="/videos/五杀1.mp4" />
          <img src="/images/val5.png" alt="Valorant 2">
          <VideoPlayer src="/videos/四杀1.mp4" />
          <img src="/images/val2.png" alt="Valorant 4">
          <img src="/images/val3.png" alt="Valorant 5">
          <img src="/images/val4.png" alt="Valorant 6">
        </div>
      </div>

      <div class="about-content" id="work">
        <h2>{{ copy.workTitle }}</h2>
        <p><strong>{{ copy.jobLabel }}</strong> {{ copy.jobValue }}</p>
        <p><strong>{{ copy.hobbyLabel }}</strong> {{ copy.hobbyValue }}</p>
        <p>{{ copy.workDescription }}</p>

        <div class="image-row">
          <img src="/images/bear8.png" alt="Coffee 1">
          <img src="/images/bear7.png" alt="Coffee 2">
          <img src="/images/bear5.png" alt="Coffee 3">
        </div>
      </div>

      <div class="about-content" id="music">
        <h2>{{ copy.musicTitle }}</h2>
        <p>{{ copy.musicDescription }}</p>

        <div class="image-row">
          <div class="image-item">
            <img src="/images/kpop2.png" alt="Music 1">
            <p class="image-caption">Stella</p>
          </div>
          <div class="image-item">
            <img src="/images/kpop3.png" alt="Music 2">
            <p class="image-caption">Yuna</p>
          </div>
          <div class="image-item">
            <img src="/images/kpop5.png" alt="Music 3">
            <p class="image-caption">Stella</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import VideoPlayer from '../components/VideoPlayer.vue'
import { useLanguage } from '../composables/useLanguage'

const route = useRoute()
const { language } = useLanguage()

const translations = {
  zh: {
    title: '关于我',
    entertainmentTitle: '我的娱乐',
    gamingLabel: '游戏：',
    gamingValue: '玩 Valorant',
    gamingDescription: '我喜欢竞技游戏，尤其是 Valorant。策略、配合和团队沟通让这个游戏非常有趣。',
    workTitle: '我的工作',
    jobLabel: '职业：',
    jobValue: 'ABD Cafe 店主',
    hobbyLabel: '爱好：',
    hobbyValue: '喝咖啡，也开发新的咖啡风味',
    workDescription: '作为 ABD Cafe 的店主，我把对咖啡的热爱和创造力结合在一起。我喜欢尝试不同的冲煮方式，创造能给顾客带来快乐的独特风味。',
    musicTitle: '我喜欢的音乐偶像',
    musicDescription: '我也喜欢听音乐和探索不同风格。音乐能让我放松，也能让我在工作和个人项目中保持创造力。'
  },
  en: {
    title: 'About Me',
    entertainmentTitle: 'My Entertainment',
    gamingLabel: 'Gaming:',
    gamingValue: 'Playing Valorant',
    gamingDescription: 'I am passionate about competitive gaming, especially Valorant. The strategic gameplay, coordination, and teamwork make it an exciting experience.',
    workTitle: 'My Work',
    jobLabel: 'Job:',
    jobValue: 'Owner of ABD Cafe',
    hobbyLabel: 'Hobby:',
    hobbyValue: 'Drinking coffee and developing new flavors',
    workDescription: 'As the owner of ABD Cafe, I combine my love for coffee with creativity. I enjoy experimenting with different brewing methods and creating unique flavor profiles that bring joy to our customers.',
    musicTitle: 'My Favorite Music Idols',
    musicDescription: 'I also enjoy listening to music and exploring different genres. Music helps me relax and stay creative in both my work and personal projects.'
  }
}

const copy = computed(() => translations[language.value])

onMounted(() => {
  if (route.hash) {
    const element = document.querySelector(route.hash)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
})
</script>
