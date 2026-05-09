<template>
  <div class="container">
    <h1>About Me</h1>

    <div class="about-section">
      <div class="about-content" id="gaming">
        <h2>My Entertainment</h2>
        <p><strong>Gaming:</strong> Playing Valorant</p>
        <p>I'm passionate about competitive gaming, especially Valorant. The strategic gameplay and team coordination make it an exciting experience.</p>

        <div class="image-row">
          <img src="/images/val1.png" alt="Valorant 1">
          <img src="/images/val5.png" alt="Valorant 2">
          <img src="/images/val6.png" alt="Valorant 3">
          <img src="/images/val2.png" alt="Valorant 4">
          <img src="/images/val3.png" alt="Valorant 5">
          <img src="/images/val4.png" alt="Valorant 6">
        </div>
      </div>

      <div class="about-content" id="work">
        <h2>My Work</h2>
        <p><strong>Job:</strong> Owner of ABD Cafe</p>
        <p><strong>Hobby:</strong> Drinking coffee and developing new flavors</p>
        <p>As the owner of ABD Cafe, I combine my love for coffee with creativity. I enjoy experimenting with different brewing methods and creating unique flavor profiles that bring joy to our customers.</p>

        <div class="image-row">
          <img src="/images/bear8.png" alt="Coffee 1">
          <img src="/images/bear7.png" alt="Coffee 2">
          <img src="/images/bear5.png" alt="Coffee 3">
        </div>
      </div>

      <div class="about-content" id="music">
        <h2>My faourite music idol</h2>
        <p>I also enjoy listening to music and exploring different genres. Music helps me relax and stay creative in both my work and personal projects.</p>

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
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  // 处理锚点导航
  if (route.hash) {
    const element = document.querySelector(route.hash)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
})
</script>
