<template>
  <div class="about-container">
    <el-row :gutter="20">
      <el-col :span="16" :offset="4">
        <el-card class="about-card">
          <template #header>
            <h1 class="about-title">{{ $t('about.title') }}</h1>
          </template>
          
          <div class="profile-section">
            <el-avatar :size="120" src="/avatar.jpg" />
            <h2 class="name">Kaka</h2>
            <p class="tagline">Full Stack Developer</p>
          </div>

          <div class="content-section">
            <h3>{{ $t('about.content') }}</h3>
            <p class="description">
              热爱编程、热爱技术，专注于 Web 开发和系统架构设计。
              擅长 Vue.js、Node.js、TypeScript 等技术栈，
              同时对云原生技术充满热情。
            </p>
          </div>

          <div class="skills-section">
            <h3>技术栈</h3>
            <div class="skills-list">
              <el-tag v-for="skill in skills" :key="skill" class="skill-tag">
                {{ skill }}
              </el-tag>
            </div>
          </div>

          <div class="contact-section">
            <h3>联系方式</h3>
            <div class="contact-list">
              <div v-for="(contact, index) in contacts" :key="index" class="contact-item">
                <el-icon><component :is="contact.icon" /></el-icon>
                <span>{{ contact.value }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {
  Message,
  Location,
  Link
} from '@element-plus/icons-vue'

const skills = [
  'Vue.js',
  'React',
  'Node.js',
  'TypeScript',
  'MongoDB',
  'Docker',
  'Kubernetes',
  'AWS'
]

const contacts = [
  {
    icon: Message,
    value: 'contact@kaka.cc'
  },
  {
    icon: Location,
    value: '中国'
  },
  {
    icon: Link,
    value: 'www.kaka.cc'
  }
]
</script>

<style scoped>
.about-container {
  padding: 40px 20px;
}

.about-card {
  text-align: center;
}

.about-title {
  margin: 0;
  color: #303133;
}

.profile-section {
  margin: 30px 0;
}

.name {
  margin: 20px 0 10px;
  font-size: 24px;
  color: #303133;
}

.tagline {
  color: #606266;
  margin: 0;
}

.content-section {
  margin: 40px 0;
  text-align: left;
}

.content-section h3 {
  color: #303133;
  margin-bottom: 20px;
}

.description {
  color: #606266;
  line-height: 1.8;
}

.skills-section {
  margin: 40px 0;
  text-align: left;
}

.skills-section h3 {
  color: #303133;
  margin-bottom: 20px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.skill-tag {
  font-size: 14px;
}

.contact-section {
  margin: 40px 0;
  text-align: left;
}

.contact-section h3 {
  color: #303133;
  margin-bottom: 20px;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #606266;
}

.contact-item .el-icon {
  color: #409EFF;
}
</style>