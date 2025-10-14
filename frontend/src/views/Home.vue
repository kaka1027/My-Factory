<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="welcome-card">
          <h1>{{ $t('home.title') }}</h1>
          <p class="greeting">{{ $t('home.greeting', { name: visitorName }) }}</p>
          <p class="description">{{ $t('home.description') }}</p>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="stats-row">
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <el-icon><Document /></el-icon>
              文章数量
            </div>
          </template>
          <div class="stat-number">{{ articleCount }}</div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <el-icon><User /></el-icon>
              访客数量
            </div>
          </template>
          <div class="stat-number">{{ visitorCount }}</div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <el-icon><View /></el-icon>
              今日访问
            </div>
          </template>
          <div class="stat-number">{{ todayVisits }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="recent-articles">
          <template #header>
            <div class="card-header">最新文章</div>
          </template>
          <el-table :data="recentArticles" style="width: 100%">
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="createTime" label="发布时间" width="180" />
            <el-table-column fixed="right" label="操作" width="120">
              <template #default="scope">
                <el-button link type="primary" @click="readArticle(scope.row)">
                  阅读
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Document, User, View } from '@element-plus/icons-vue'
import { useVisitorStore } from '@/stores/visitor'

const router = useRouter()
const visitorStore = useVisitorStore()
const visitorName = ref(localStorage.getItem('visitorName') || '')
const articleCount = ref(0)
const visitorCount = ref(0)
const todayVisits = ref(0)
const recentArticles = ref([])

const readArticle = (article: any) => {
  router.push({
    name: 'article-detail',
    params: { id: article.id }
  })
}

onMounted(async () => {
  try {
    // 获取统计数据
    const stats = await Promise.all([
      fetch('/api/articles/count').then(res => res.json()),
      fetch('/api/visitors/count').then(res => res.json()),
      fetch('/api/visitors/today').then(res => res.json()),
      fetch('/api/articles/recent').then(res => res.json())
    ])

    articleCount.value = stats[0].count
    visitorCount.value = stats[1].count
    todayVisits.value = stats[2].count
    recentArticles.value = stats[3]
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
})
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
  text-align: center;
}

.greeting {
  font-size: 24px;
  color: #409EFF;
  margin: 20px 0;
}

.description {
  color: #606266;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
  color: #409EFF;
}

.recent-articles {
  margin-top: 20px;
}
</style>