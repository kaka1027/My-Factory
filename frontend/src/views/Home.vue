<template>
  <div class="container">
    <div class="intro-section">
      <div class="intro-text">
        <h1>My Introduction</h1>
        <p><strong>Name:</strong> YUCHEN HUANG</p>
        <p><strong>Study:</strong> Web Application Development</p>
        <p>This is my JC2503 assignment.</p>
        <p>Welcome to my personal website! I'm passionate about web development and creating interactive experiences. This project showcases my skills in building real-time multiplayer applications using modern web technologies.</p>
      </div>
      <div class="intro-image">
        <img src="/images/bear1.png" alt="Profile">
      </div>
    </div>

    <div class="gallery-section">
      <h2>My Interests</h2>
      <div class="image-gallery">
        <router-link to="/about#gaming" class="gallery-item">
          <div class="dual-image">
            <img src="/images/val7.png" alt="Valorant 1">
            <img src="/images/val8.png" alt="Valorant 2">
          </div>
          <p>Gaming</p>
        </router-link>
        <router-link to="/about#work" class="gallery-item">
          <img src="/images/cafe.png" alt="Coffee">
          <p>Coffee Culture</p>
        </router-link>
        <router-link to="/about#music" class="gallery-item">
          <img src="/images/kpop4.png" alt="Music">
          <p>Music</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
